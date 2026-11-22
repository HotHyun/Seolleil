import { expect, test } from "@playwright/test";
import { expectClickablePrimaryNav, expectNoEmptyMain, expectNoHorizontalOverflow, planQuery } from "./helpers";

const mobilePages = [
  { path: "/", heading: /스키장은 정했죠\?/ },
  { path: "/plan", heading: /어느 스키장으로 여행 가세요/ },
  { path: planQuery, heading: /추천 스키장 3곳/ },
  { path: "/resorts", heading: /국내 스키장/ },
  { path: "/login", heading: /내 트립 저장하기/ }
];

test.describe("mobile layout", () => {
  for (const item of mobilePages) {
    test(`${item.path} keeps primary content inside the viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(item.path);

      await expect(page.getByRole("heading", { name: item.heading }).first()).toBeVisible();
      await expectClickablePrimaryNav(page);
      await expectNoEmptyMain(page);
      await expectNoHorizontalOverflow(page);
    });
  }

  test("a resort detail page keeps content inside the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resorts");

    const detailLink = page.locator('a[href^="/resorts/"]').first();
    test.skip((await detailLink.count()) === 0, "deployed resort directory does not expose detail links yet");
    await detailLink.click();

    await expect(page).toHaveURL(/\/resorts\/[^/]+$/);
    await expect(page.locator("main")).toBeVisible();
    await expectClickablePrimaryNav(page);
    await expectNoEmptyMain(page);
    await expectNoHorizontalOverflow(page);
  });

  test("ski map is the main mobile view with the resort picker in a bottom drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resorts");

    const map = page.getByTestId("ski-map-viewport");
    const selection = page.getByTestId("ski-map-selection");
    await expect(map).toBeVisible();
    await expect(selection).toBeVisible();

    const [mapBox, selectionBox] = await Promise.all([map.boundingBox(), selection.boundingBox()]);
    expect(mapBox?.height ?? 0).toBeGreaterThanOrEqual(600);
    expect(selectionBox?.y ?? 0).toBeGreaterThanOrEqual(mapBox?.y ?? 0);
    expect((selectionBox?.y ?? 0) + (selectionBox?.height ?? 0)).toBeLessThanOrEqual((mapBox?.y ?? 0) + (mapBox?.height ?? 0));

    await page.getByRole("button", { name: "스키장 선택" }).click();
    await expect(page.getByRole("dialog").getByPlaceholder("스키장, 지역, 태그 검색")).toBeVisible();
    await page.getByRole("dialog").getByRole("button").filter({ hasText: "렌탈" }).first().click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expectNoHorizontalOverflow(page);
  });
});
