import { expect, test } from "@playwright/test";
import { expectClickablePrimaryNav, expectNoEmptyMain, expectNoHorizontalOverflow, planQuery } from "./helpers";

const mobilePages = [
  { path: "/", heading: /스키장 고르고/ },
  { path: "/plan", heading: /조건을 입력하면/ },
  { path: planQuery, heading: /조건에 맞는 추천 3곳/ },
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

  test("ski map keeps the mobile map visible above its compact selection sheet", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resorts");

    const map = page.getByTestId("ski-map-viewport");
    const selection = page.getByTestId("ski-map-selection");
    await expect(map).toBeVisible();
    await expect(selection).toBeVisible();

    const [mapBox, selectionBox] = await Promise.all([map.boundingBox(), selection.boundingBox()]);
    expect(mapBox?.height ?? 0).toBeGreaterThanOrEqual(460);
    const overlap = Math.max(0, (mapBox?.y ?? 0) + (mapBox?.height ?? 0) - (selectionBox?.y ?? 0));
    expect(overlap).toBeLessThanOrEqual(42);
    await expectNoHorizontalOverflow(page);
  });
});
