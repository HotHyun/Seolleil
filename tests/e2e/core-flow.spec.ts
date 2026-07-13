import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, planQuery } from "./helpers";

test.describe("core trip flow", () => {
  test("protects account routes and rejects invalid capability tokens", async ({ page }) => {
    await page.goto("/my-trips");
    await expect(page).toHaveURL(/\/login\?callbackUrl=/);

    await page.goto("/trips/not-a-valid-edit-token");
    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();

    await page.goto("/share/not-a-valid-share-token");
    await expect(page.getByRole("heading", { name: "페이지를 찾을 수 없습니다." })).toBeVisible();
  });

  test("creates an editable trip and opens the read-only share link", async ({ page, context }) => {
    await page.goto(planQuery);
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first().click();
    await page.getByRole("button", { name: "링크 저장하고 비로그인으로 계속" }).click();

    await expect(page).toHaveURL(/\/trips\/[^?]+\?created=.*share=/);
    await expect(page.getByText("이 편집 링크를 가진 사람은 트립을 수정할 수 있습니다.")).toBeVisible();
    await expect(page.getByRole("heading", { name: /트립$/ }).first()).toBeVisible();
    await expect(page.getByText("트립을 만들었어요.")).toBeVisible();
    await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
    await page.getByRole("menuitem", { name: "공유 관리" }).click();
    await expect(page.getByRole("button", { name: "읽기 링크 복사" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const sharePath = new URL(page.url()).searchParams.get("share");
    expect(sharePath).toBeTruthy();

    const sharePage = await context.newPage();
    await sharePage.goto(`/share/${sharePath}`);
    await expect(sharePage.getByText("읽기 전용 공유")).toBeVisible();
    await expect(sharePage.getByRole("heading", { name: /예약·준비 상태|체크리스트 상태/ })).toBeVisible();
    await expect(sharePage.getByRole("button", { name: "읽기 링크 재발급" })).toHaveCount(0);
    await expect(sharePage.getByRole("button", { name: "트립 삭제" })).toHaveCount(0);
    await expectNoHorizontalOverflow(sharePage);
  });
});
