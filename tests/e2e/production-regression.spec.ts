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
  });

  test("anonymous trip enforces persistent read, edit, and revoked link permissions", async ({ page, context }, testInfo) => {
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

      const tripName = `친구들과 스키 ${Date.now()}`;
      const tripMemo = "토요일 아침에 모여 함께 출발";
      await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
      await page.getByRole("menuitem", { name: "트립 수정" }).click();
      await page.getByRole("textbox", { name: "트립 이름" }).fill(tripName);
      await page.getByRole("textbox", { name: "트립 메모" }).fill(tripMemo);
      await page.getByRole("button", { name: "트립 정보 저장하고 비용 재계산" }).click();
      await expect(page.getByText("트립 정보를 저장했어요.")).toBeVisible();
      await page.getByRole("dialog", { name: "트립 수정" }).getByRole("button", { name: "닫기" }).click();
      await expect(page.getByRole("heading", { name: tripName })).toBeVisible();
      await expect(page.getByText(tripMemo)).toBeVisible();

      const budget = page.getByTestId("trip-budget-workspace");
      await expect(budget.getByRole("heading", { name: "비용 확정과 1/N 정산" })).toBeVisible();
      await budget.getByRole("combobox", { name: "리프트권" }).click();
      await page.getByRole("option", { name: "6시간권" }).click();
      await budget.getByRole("combobox", { name: "교통" }).click();
      await page.getByRole("option", { name: "자차" }).click();
      await budget.getByLabel("숙소 이름").fill("Playwright 테스트 숙소");
      await budget.getByLabel("실제 숙박비").fill("240000");
      await budget.getByLabel("예약/숙소 링크").fill("https://example.com/test-lodging");
      await budget.getByRole("button", { name: "추가", exact: true }).click();
      await budget.getByLabel("비용 이름").fill("테스트 식비");
      await budget.getByLabel("금액").fill("60000");
      await budget.getByLabel("몇 명이 나눌까요?").fill("4");
      await budget.getByRole("button", { name: "비용과 정산 저장" }).click();
      await expect(page.getByText("비용과 정산 정보를 저장했어요.")).toBeVisible();
      await page.reload();
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("숙소 이름")).toHaveValue("Playwright 테스트 숙소");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("실제 숙박비")).toHaveValue("240000");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("비용 이름")).toHaveValue("테스트 식비");
      await expect(page.getByTestId("trip-budget-workspace").getByLabel("몇 명이 나눌까요?")).toHaveValue("4");

      await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
      await page.getByRole("menuitem", { name: "공유 관리" }).click();
      await page.getByRole("button", { name: /새 링크/ }).click();
      const latestShareUrl = page.locator("text=/https?:.*\\/share\\//").first();
      const shareUrl = await latestShareUrl.textContent();
      const readToken = shareUrl ? new URL(shareUrl).pathname.split("/").pop() : null;
      expect(readToken).toBeTruthy();
      await page.getByRole("combobox", { name: "새 링크 권한" }).click();
      await page.getByRole("option", { name: "편집 가능" }).click();
      await page.getByRole("button", { name: /새 링크/ }).click();
      await expect(latestShareUrl).not.toHaveText(shareUrl ?? "");
      const editUrlText = await latestShareUrl.textContent();
      const editToken = editUrlText ? new URL(editUrlText).pathname.split("/").pop() : null;
      expect(editToken).toBeTruthy();
      expect(editToken).not.toBe(readToken);
      await page.getByRole("dialog", { name: "트립 공유" }).getByRole("button", { name: "닫기" }).click();
      await expect(page.getByRole("dialog", { name: "트립 공유" })).toBeHidden();

      const marker = `회귀 테스트 ${Date.now()}`;
      const editable = await context.newPage();
      await editable.goto(`/share/${editToken}`);
      await expect(editable.getByText("함께 편집")).toBeVisible();
      await editable.getByRole("textbox", { name: "새 체크 항목 이름" }).fill(marker);
      await editable.getByRole("button", { name: "항목 추가" }).click();
      await expect(editable.getByText(marker).first()).toBeVisible();

      const readonly = await context.newPage();
      await readonly.goto(`/share/${readToken}`);
      await expect(readonly.getByText("보기 전용")).toBeVisible();
      await expect(readonly.getByRole("heading", { name: tripName })).toBeVisible();
      await expect(readonly.getByText(tripMemo)).toHaveCount(0);
      await expect(readonly.getByText(marker)).toBeVisible();
      await expect(readonly.getByRole("button", { name: "항목 추가" })).toHaveCount(0);

      await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
      await page.getByRole("menuitem", { name: "공유 관리" }).click();
      await page.getByRole("button", { name: "보기 링크 비활성화" }).click();
      await expect(page.getByText("공유 링크를 비활성화했어요.")).toBeVisible();
      await readonly.goto(`/share/${readToken}`);
      await expect(readonly.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
      await editable.reload();
      await expect(editable.getByText("함께 편집")).toBeVisible();
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
