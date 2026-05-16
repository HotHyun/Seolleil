import { expect, test } from "@playwright/test";

test.describe("landing page", () => {
  test("shows product value and primary calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /스키장 고르고/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /스키 트립 만들기/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /국내 스키장 둘러보기/ })).toBeVisible();
    await expect(page.getByText("추천 결과 미리보기")).toBeVisible();
    await expect(page.getByRole("heading", { name: /세 번만 결정하면/ })).toBeVisible();
  });

  test("renders cleanly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /스키장 고르고/ })).toBeVisible();
    await expect(page.getByText("비발디파크 스키월드")).toBeVisible();
    await expect(page.getByRole("link", { name: /스키 트립 만들기/ }).first()).toBeVisible();
  });

  test("exposes optional login entry point", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "로그인" }).click();
    await expect(page.getByRole("heading", { name: "내 트립 저장하기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Google로 계속하기" })).toBeVisible();
  });
});
