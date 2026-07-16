import { expect, test } from "@playwright/test";
import { expectNoEmptyMain, expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("production regression", () => {
  test("public routes and mobile ski map remain usable", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    const health = await page.request.get("/api/health");
    expect(health.ok()).toBeTruthy();

    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/plan", "/resorts", "/login"]) {
      await page.goto(path);
      await expectNoEmptyMain(page);
      await expectNoHorizontalOverflow(page);
    }

    await page.goto("/resorts");
    const map = page.getByTestId("ski-map-viewport");
    const selection = page.getByTestId("ski-map-selection");
    await expect(map).toBeVisible();
    await expect(selection).toBeVisible();
    const [mapBox, selectionBox] = await Promise.all([map.boundingBox(), selection.boundingBox()]);
    expect(mapBox?.height ?? 0).toBeGreaterThanOrEqual(460);
    expect(Math.max(0, (mapBox?.y ?? 0) + (mapBox?.height ?? 0) - (selectionBox?.y ?? 0))).toBeLessThanOrEqual(42);
    await expect(selection.getByText(/렌탈 후보/)).toBeVisible();
    await expect(selection.getByText(/숙박 후보/)).toBeVisible();
    await expect(selection.getByText(/^초보\s*\d+$/)).toHaveCount(0);
    await expect(selection.getByText(/^접근\s*\d+$/)).toHaveCount(0);
    const fallback = page.getByRole("heading", { name: "실제 지도 연결을 준비하고 있어요" });
    if (await fallback.count()) await expect(page.getByRole("link", { name: /카카오맵에서 정확히 보기/ })).toBeVisible();
    await selection.getByRole("button", { name: "주변 보기" }).click();
    await expect(page.getByRole("button", { name: "전체", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "픽업", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "가격 확인", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "가격 확인", exact: true }).click();

    await page.goto("/resorts/konjiam");
    await expect(page.getByRole("heading", { name: "퇴근 후에도 닿는 수도권 스키" })).toBeVisible();
    await expect(page.getByRole("link", { name: /곤지암리조트으로 트립 만들기/ })).toBeVisible();

    await page.goto("/resorts/phoenix");
    await expect(page.getByRole("heading", { name: "넓은 설원과 역동적인 라이딩" })).toBeVisible();
    await expect(page.getByText("주변 렌탈샵 9곳")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(pageErrors, `Page errors: ${pageErrors.join("\n")}`).toEqual([]);
    expect(consoleErrors, `Console errors: ${consoleErrors.join("\n")}`).toEqual([]);
  });

  test("anonymous trip supports identity, decisions, checklist, and budget lifecycle", async ({ page, context }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(process.env.E2E_ALLOW_PRODUCTION_WRITES !== "1", "Production writes require an explicit opt-in.");
    test.skip(testInfo.project.name !== "chromium", "Run the mutation lifecycle once, then cover mobile with read-only checks.");

    let editUrl: string | undefined;
    const serverErrors: string[] = [];
    page.on("response", (response) => {
      if (response.url().startsWith("https://ski.hothyun.com") && response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`);
    });
    try {
      await page.goto(planQuery, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first().click();
      await page.getByRole("button", { name: "링크 저장하고 비로그인으로 계속" }).click();
      await expect(page).toHaveURL(/\/trips\/[^?]+/);
      editUrl = page.url().split("?")[0];
      await expect(page.getByText("비공개 트립을 만들었어요.")).toBeVisible();

      await expect(page.getByText("이번 여행, 지금 정해진 것")).toBeVisible();
      await expect(page.getByRole("menuitem", { name: "공유 관리" })).toHaveCount(0);

      const tripName = `회귀 스키 트립 ${Date.now()}`;
      const tripMemo = "토요일 아침 테스트 출발";
      await page.getByRole("button", { name: "트립 이름 수정" }).click();
      await page.getByRole("dialog", { name: "트립 이름 수정" }).getByRole("textbox", { name: "트립 이름" }).fill(tripName);
      await page.getByRole("dialog", { name: "트립 이름 수정" }).getByRole("button", { name: "저장하기" }).click();
      await expect(page.getByText("트립 정보를 저장했어요.")).toBeVisible();
      await expect(page.getByRole("heading", { name: tripName })).toBeVisible();
      await page.getByRole("button", { name: "메모 추가" }).click();
      await page.getByRole("dialog", { name: "트립 메모 추가" }).getByRole("textbox", { name: "트립 메모" }).fill(tripMemo);
      await page.getByRole("dialog", { name: "트립 메모 추가" }).getByRole("button", { name: "저장하기" }).click();
      await expect(page.getByText(tripMemo)).toBeVisible();

      await page.getByRole("link", { name: /선택·예약/ }).first().click();
      const decisions = page.getByTestId("trip-decision-workspace");
      await expect(decisions.getByRole("heading", { name: "렌탈샵과 상품" })).toBeVisible();
      await expect(decisions.getByTestId("trip-place-map").or(decisions.getByTestId("trip-place-map-fallback")).first()).toBeVisible();
      await expect(decisions.getByRole("button", { name: "가격 확인", exact: true })).toBeVisible();
      await decisions.getByRole("button", { name: "픽업", exact: true }).click();
      await expect(decisions.getByRole("heading", { name: "간지보더" })).toBeVisible();
      await decisions.getByRole("heading", { name: "간지보더" }).click();
      await expect(decisions.getByRole("combobox", { name: "간지보더 렌탈 상품" })).toBeVisible();
      await decisions.getByRole("button", { name: "전체", exact: true }).click();
      await decisions.getByRole("button", { name: "이 상품 저장" }).first().click();
      await expect(page.getByText("선택을 트립에 저장했어요.").last()).toBeVisible();
      await decisions.locator("#lift").getByRole("combobox").click();
      await page.getByRole("option", { name: "6시간권" }).click();
      await decisions.locator("#lift").getByRole("button", { name: "저장하기" }).click();
      await expect(page.getByText("선택을 트립에 저장했어요.").last()).toBeVisible();
      await decisions.locator("#transport").getByRole("combobox").click();
      await page.getByRole("option", { name: "스키장 셔틀" }).click();
      await decisions.locator("#transport").getByRole("button", { name: "저장하기" }).click();
      await decisions.getByRole("button", { name: /다른 숙소 직접 입력/ }).click();
      await decisions.getByLabel("숙소 이름").fill("Playwright 테스트 숙소");
      await decisions.getByLabel("예약·숙소 링크").fill("https://example.com/test-lodging");
      await decisions.getByLabel("예상 숙박비 (전체)").fill("320000");
      await decisions.getByRole("button", { name: "검토 중으로 저장" }).click();
      await expect(page.getByText("선택을 트립에 저장했어요.").last()).toBeVisible();

      await page.getByRole("link", { name: /트립 개요/ }).first().click();
      await expect(page.getByText("Playwright 테스트 숙소")).toBeVisible();
      await expect(page.getByText("6시간권")).toBeVisible();
      await expect(page.getByText("스키장 셔틀")).toBeVisible();

      const marker = `회귀 체크 ${Date.now()}`;
      await page.getByRole("link", { name: /준비 체크리스트/ }).first().click();
      await page.getByText("예약/구매", { exact: true }).click();
      await expect(page.getByRole("link", { name: "선택·예약 도우미 열기" }).first()).toBeVisible();
      await page.getByRole("textbox", { name: "새 체크 항목 이름" }).fill(marker);
      await page.getByRole("button", { name: "항목 추가" }).click();
      await expect(page.getByText(marker).first()).toBeVisible();

      await page.getByRole("link", { name: /비용·정산/ }).first().click();
      const budget = page.getByTestId("trip-budget-workspace");
      await expect(budget.getByRole("heading", { name: "비용 확정과 1/N 정산" })).toBeVisible();
      await budget.getByLabel("실제 숙박비").fill("240000");
      await budget.getByRole("button", { name: "추가", exact: true }).click();
      await budget.getByLabel("비용 이름").fill("테스트 식비");
      await budget.getByLabel("금액").fill("60000");
      await budget.getByLabel("몇 명이 나눌까요?").fill("4");
      await budget.getByRole("button", { name: "저장하기" }).click();
      await expect(page.getByText("비용과 정산 정보를 저장했어요.")).toBeVisible();
      await page.reload();
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("숙소 이름")).toHaveValue("Playwright 테스트 숙소");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("실제 숙박비")).toHaveValue("240000");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("비용 이름")).toHaveValue("테스트 식비");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("몇 명이 나눌까요?")).toHaveValue("4");

      await expectNoHorizontalOverflow(page);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${editUrl}?view=decisions`);
      const mobileDecisions = page.getByTestId("trip-decision-workspace");
      await expect(mobileDecisions.getByRole("heading", { name: "렌탈샵과 상품" })).toBeVisible();
      await expect(mobileDecisions.getByTestId("trip-place-map").or(mobileDecisions.getByTestId("trip-place-map-fallback")).first()).toBeVisible();
      await expect(mobileDecisions.getByRole("button", { name: "가격 확인", exact: true })).toBeVisible();
      await expect(mobileDecisions.getByRole("heading", { name: "공식 숙소 비교" })).toBeVisible();
      await expectNoHorizontalOverflow(page);
      expect(serverErrors, `Production 5xx responses: ${serverErrors.join("\n")}`).toEqual([]);
    } finally {
      for (const candidate of context.pages()) {
        if (candidate !== page) await candidate.close();
      }
      if (editUrl) {
        await page.goto(editUrl);
        await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
        await page.getByRole("menuitem", { name: "트립 삭제" }).click();
        await page.getByRole("button", { name: "트립 삭제" }).click();
        await expect(page).toHaveURL(/\/$/);
      }
    }
  });
});
