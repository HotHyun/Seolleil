import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("accessibility smoke checks", () => {
  test("key public pages expose one main landmark and no empty links or buttons", async ({ page }) => {
    for (const path of ["/", "/plan", planQuery, "/resorts", "/login"]) {
      await page.goto(path);

      await expect(page.locator("main")).toHaveCount(1);
      await expectNoHorizontalOverflow(page);

      const unnamedControls = await page
        .locator("a, button")
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => !node.getAttribute("aria-hidden"))
            .map((node) => ({
              text: node.textContent?.trim() ?? "",
              label: node.getAttribute("aria-label") ?? "",
              href: node instanceof HTMLAnchorElement ? node.href : "",
              type: node.tagName.toLowerCase()
            }))
            .filter((node) => !node.text && !node.label)
        );

      expect(unnamedControls, `${path} has unnamed interactive controls`).toEqual([]);
    }
  });

  test("calendar month navigation uses its full touch target", async ({ page }) => {
    await page.goto("/plan");
    await page.getByRole("button", { name: "여행 방문 날짜" }).click();

    const caption = page.locator(".rdp-caption_label");
    const nextMonth = page.locator(".rdp-button_next");
    const previousCaption = await caption.textContent();
    const box = await nextMonth.boundingBox();

    expect(box?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    await nextMonth.click({ position: { x: 2, y: 2 } });
    await expect(caption).not.toHaveText(previousCaption ?? "");
  });
});
