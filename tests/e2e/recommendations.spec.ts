import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("recommendation flow", () => {
  test("submits the plan form and displays recommendations", async ({ page }) => {
    await page.goto("/plan");
    await expect(page.getByRole("heading", { name: /어느 스키장으로 여행 가세요/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "여행 정보" })).toBeVisible();
    await expect(page.getByRole("button", { name: "다음 단계" })).toBeVisible();

    await page.goto(planQuery);

    await expect(page).toHaveURL(/\/recommendations/);
    await expect(page.getByRole("heading", { name: "추천 스키장 3곳" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "한눈에 비교" })).toBeVisible();
    await expect(page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("asks for a resort first and routes the recommend option to recommendations", async ({ page }) => {
    await page.goto("/plan");
    await page.getByRole("button", { name: "다음 단계" }).click();
    await expect(page.getByText(/스키장을 고르거나/)).toBeVisible();

    await page.getByRole("combobox", { name: "스키장" }).click();
    const options = page.getByRole("option");
    await expect(options.last()).toHaveText("스키장 추천받을래요");
    await options.last().click();
    await expect(page.getByText(/스키장 3곳을 추천해 드려요/)).toBeVisible();
  });

  test("preselects the recommend option with mode=recommend and a resort with resortId", async ({ page }) => {
    await page.goto("/plan?mode=recommend");
    await expect(page.getByRole("combobox", { name: "스키장" })).toContainText("스키장 추천받을래요");

    await page.goto("/plan?resortId=konjiam");
    await expect(page.getByRole("combobox", { name: "스키장" })).toContainText("곤지암리조트");
  });

  test("the blue CTA next to the resort label selects the recommend option", async ({ page }) => {
    await page.goto("/plan");
    await page.getByRole("button", { name: "스키장을 추천받고 싶나요?" }).click();
    await expect(page.getByRole("combobox", { name: "스키장" })).toContainText("스키장 추천받을래요");
    await expect(page.getByRole("button", { name: "스키장을 추천받고 싶나요?" })).toHaveCount(0);
  });
});
