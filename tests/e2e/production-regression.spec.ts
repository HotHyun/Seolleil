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
      await page.goto(planQuery);
      await page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first().click();
      await page.getByRole("button", { name: "링크 저장하고 비로그인으로 계속" }).click();
      await expect(page).toHaveURL(/\/trips\/[^?]+/);
      editUrl = page.url().split("?")[0];
      await expect(page.getByText("비공개 트립을 만들었어요.")).toBeVisible();

      await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
      await page.getByRole("menuitem", { name: "공유 관리" }).click();
      await page.getByRole("button", { name: /새 링크/ }).click();
      const shareUrl = await page.locator("text=/https?:.*\\/share\\//").first().textContent();
      const readToken = shareUrl ? new URL(shareUrl).pathname.split("/").pop() : null;
      expect(readToken).toBeTruthy();
      await page.getByRole("combobox", { name: "새 링크 권한" }).click();
      await page.getByRole("option", { name: "편집 가능" }).click();
      await page.getByRole("button", { name: /새 링크/ }).click();
      const editUrlText = await page.locator("text=/https?:.*\\/share\\//").first().textContent();
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
