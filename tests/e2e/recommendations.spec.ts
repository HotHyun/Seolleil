import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("recommendation flow", () => {
  test("submits the plan form and displays recommendations", async ({ page }) => {
    await page.goto("/plan");
    await expect(page.getByRole("heading", { name: /조건을 입력하면/ })).toBeVisible();
    await expect(page.getByText("1. 일정/이동")).toBeVisible();
    await expect(page.getByRole("button", { name: "추천 결과 보기" })).toBeVisible();

    await page.goto(planQuery);

    await expect(page).toHaveURL(/\/recommendations/);
    await expect(page.getByRole("heading", { name: "조건에 맞는 추천 3곳" })).toBeVisible();
    await expect(page.getByText("비용 요약").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
