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
});
