import { expect, type Page } from "@playwright/test";

export const planQuery =
  "/recommendations?visitDate=2027-01-10&departureLocation=seoul-gangnam&peopleCount=2&tripDuration=same_day&transportType=car&skillLevel=beginner&rideType=ski&ownsEquipment=false&ownsClothing=false&priority1=beginner&priority2=close&priority3=rental&liftTicketTimeSlot=4h&lodgingCostInput=";

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return Math.max(0, root.scrollWidth - window.innerWidth);
  });

  expect(overflow).toBeLessThanOrEqual(2);
}

export async function expectNoEmptyMain(page: Page) {
  const main = page.locator("main");
  await expect(main).toBeVisible();

  const box = await main.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThan(360);
}

export async function expectClickablePrimaryNav(page: Page) {
  await expect(page.getByRole("navigation").getByRole("link", { name: "스키장", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation").getByRole("link", { name: "트립 만들기", exact: true })).toBeVisible();
}
