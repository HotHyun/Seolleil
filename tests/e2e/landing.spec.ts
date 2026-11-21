import { expect, test } from "@playwright/test";
import { expectClickablePrimaryNav, expectNoEmptyMain, expectNoHorizontalOverflow } from "./helpers";

test.describe("landing page", () => {
  test("shows product value and primary calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /이동 시간과 총비용으로/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "조건 직접 입력" })).toBeVisible();
    await expect(page.getByRole("button", { name: "추천 보기" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /스키장 추천부터 가격 비교, 장갑 챙기기까지/ })).toBeVisible();
    await expect(page.getByLabel("추천 결과 예시")).toBeVisible();
    await expect(page.getByRole("link", { name: "본문으로 바로가기" })).toHaveAttribute("href", "#main-content");
    await expectClickablePrimaryNav(page);
    await expectNoEmptyMain(page);
    await expectNoHorizontalOverflow(page);
  });

  test("renders cleanly on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /이동 시간과 총비용으로/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "조건 직접 입력" })).toBeVisible();
    await expect(page.getByRole("link", { name: /설레일/ })).toBeVisible();
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
