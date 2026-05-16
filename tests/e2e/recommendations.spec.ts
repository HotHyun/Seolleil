import { expect, test } from "@playwright/test";

test.describe("recommendation flow", () => {
  test("submits the plan form and displays recommendations", async ({ page }) => {
    await page.goto("/plan");

    await page.getByLabel("방문 날짜").fill("2027-01-10");
    await page.getByLabel("출발지").selectOption("seoul-gangnam");
    await page.getByLabel("인원").fill("2");
    await page.getByLabel("일정").selectOption("same_day");
    await page.getByLabel("교통수단").selectOption("car");
    await page.getByLabel("실력").selectOption("beginner");
    await page.getByLabel("종목").selectOption("ski");
    await page.getByLabel("장비 보유").selectOption("false");
    await page.getByLabel("의류 보유").selectOption("false");
    await page.getByLabel("1순위").selectOption("beginner");
    await page.getByLabel("2순위").selectOption("close");
    await page.getByLabel("3순위").selectOption("rental");
    await page.getByLabel("리프트권 시간권").selectOption("4h");

    await page.getByRole("button", { name: "추천 결과 보기" }).click();

    await expect(page).toHaveURL(/\/recommendations/);
    await expect(page.getByRole("heading", { name: "조건에 맞는 추천 3곳" })).toBeVisible();
    await expect(page.getByText("비용 요약").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first()).toBeVisible();
  });
});

