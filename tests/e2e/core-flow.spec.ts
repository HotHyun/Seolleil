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

  test("creates a private trip and issues a persistent read link", async ({ page, context }) => {
    let editUrl: string | undefined;
    try {
      await page.goto(planQuery);
      await page.getByRole("button", { name: /이 스키장으로 트립 만들기/ }).first().click();
      await page.getByRole("button", { name: "링크 저장하고 비로그인으로 계속" }).click();

      await expect(page).toHaveURL(/\/trips\/[^?]+/);
      editUrl = page.url().split("?")[0];
      expect(new URL(page.url()).searchParams.get("share")).toBeNull();
      await expect(page.getByText("이 편집 링크를 가진 사람은 트립을 수정할 수 있습니다.")).toBeVisible();
      await expect(page.getByText("비공개 트립을 만들었어요.")).toBeVisible();
      await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
      await page.getByRole("menuitem", { name: "공유 관리" }).click();
      await expect(page.getByText("활성 공유 링크가 없습니다.")).toBeVisible();
      await page.getByRole("button", { name: /새 링크/ }).click();
      const shareUrl = await page.locator("text=/https?:.*\\/share\\//").first().textContent();
      const shareToken = shareUrl ? new URL(shareUrl).pathname.split("/").pop() : null;
      expect(shareToken).toBeTruthy();
      const sharePage = await context.newPage();
      await sharePage.goto(`/share/${shareToken}`);
      await expect(sharePage.getByText("보기 전용")).toBeVisible();
      await expect(sharePage.getByRole("heading", { name: "예약·준비 상태" })).toBeVisible();
      await expect(sharePage.getByRole("button", { name: "트립 삭제" })).toHaveCount(0);
      await expectNoHorizontalOverflow(sharePage);
    } finally {
      if (editUrl) {
        await page.goto(editUrl);
        await page.getByRole("button", { name: "트립 관리 메뉴" }).click();
        await page.getByRole("menuitem", { name: "트립 삭제" }).click();
        await page.getByRole("button", { name: "트립 삭제" }).click();
      }
    }
  });
});
