import { expect, test } from "@playwright/test";
import { expectClickablePrimaryNav, expectNoEmptyMain, expectNoHorizontalOverflow } from "./helpers";

test.describe("landing page", () => {
  test("shows product value and primary calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /설원으로/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /내 스키 여행 시작하기/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /스키장 둘러보기/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /출발에 가까운 네 단계/ })).toBeVisible();
    await expectClickablePrimaryNav(page);
    await expectNoEmptyMain(page);
    await expectNoHorizontalOverflow(page);
  });

  test("renders cleanly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /설원으로/ })).toBeVisible();
    await expect(page.getByText("로그인 없이 시작")).toBeVisible();
    await expect(page.getByRole("link", { name: /내 스키 여행 시작하기/ })).toBeVisible();
    await expectClickablePrimaryNav(page);
    await expectNoHorizontalOverflow(page);
  });

  test("exposes optional login entry point", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "로그인" }).click();
    await expect(page.getByRole("heading", { name: "내 트립 저장하기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Google로 계속하기" })).toBeVisible();
  });
});
