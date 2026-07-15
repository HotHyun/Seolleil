import { expect, test } from "@playwright/test";
import { expectNoEmptyMain, expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("production regression", () => {
  test("public routes and mobile ski map remain usable", async ({ page }) => {
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

    await page.goto("/resorts/konjiam");
    const detailMap = page.getByTestId("resort-detail-nearby-map");
    const lodging = page.getByRole("button", { name: "곤지암리조트 EW 빌리지 지도에서 보기" });
    await lodging.scrollIntoViewIfNeeded();
    await lodging.click();
    await expect.poll(async () => (await detailMap.boundingBox())?.y ?? 999).toBeLessThan(120);
    await expect(detailMap.getByText("곤지암리조트 EW 빌리지")).toBeVisible();

    await page.goto("/resorts/phoenix");
    const phoenixMap = page.getByTestId("resort-detail-nearby-map");
    await expect(page.getByRole("button", { name: "스노우랩 휘닉스파크점 지도에서 보기" })).toBeVisible();
    const phoenixRental = page.getByRole("button", { name: "꾹이네 렌탈샵 지도에서 보기" });
    await phoenixRental.scrollIntoViewIfNeeded();
    await phoenixRental.click();
    await expect.poll(async () => (await phoenixMap.boundingBox())?.y ?? 999).toBeLessThan(120);
    await expect(phoenixMap.getByText("꾹이네 렌탈샵")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("anonymous trip supports identity, decisions, checklist, and budget lifecycle", async ({ page, context }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(process.env.E2E_ALLOW_PRODUCTION_WRITES !== "1", "Production writes require an explicit opt-in.");
    test.skip(testInfo.project.name !== "chromium", "Run the mutation lifecycle once, then cover mobile with read-only checks.");

    let editUrl: string | undefined;
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
      await decisions.getByRole("button", { name: "이 상품 선택" }).first().click();
      await expect(page.getByText("선택을 트립에 저장했어요.").last()).toBeVisible();
      await decisions.locator("#lift").getByRole("combobox").click();
      await page.getByRole("option", { name: "6시간권" }).click();
      await decisions.locator("#lift").getByRole("button", { name: "저장하기" }).click();
      await expect(page.getByText("선택을 트립에 저장했어요.").last()).toBeVisible();
      await decisions.locator("#transport").getByRole("combobox").click();
      await page.getByRole("option", { name: "스키장 셔틀" }).click();
      await decisions.locator("#transport").getByRole("button", { name: "저장하기" }).click();
      await decisions.getByLabel("숙소 이름").fill("Playwright 테스트 숙소");
      await decisions.getByLabel("예약·숙소 링크").fill("https://example.com/test-lodging");
      await decisions.getByRole("button", { name: "숙소 저장하기" }).click();
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
