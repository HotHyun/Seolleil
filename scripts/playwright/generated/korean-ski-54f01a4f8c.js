const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  const pageErrors = [];
  const serverErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => { if (response.url().startsWith("https://ski.hothyun.com") && response.status() >= 500) serverErrors.push(`${response.status()} ${response.url()}`); });

  await page.goto("https://ski.hothyun.com/resorts?resortId=konjiam", { waitUntil: "networkidle", timeout: 90_000 });
  await page.waitForFunction(() => Boolean(window.kakao?.maps), undefined, { timeout: 30_000 });
  const viewport = page.getByTestId("ski-map-viewport");
  if (!(await viewport.isVisible())) throw new Error("Ski map viewport is not visible");
  if (await page.getByRole("heading", { name: "실제 지도 연결을 준비하고 있어요" }).count()) throw new Error("Kakao map fell back to the unavailable state");
  const tileCount = await viewport.locator("img").count();
  if (tileCount < 1) throw new Error("Kakao map tiles were not rendered");

  await page.getByTestId("ski-map-selection").getByRole("button", { name: "주변 보기" }).click();
  await page.getByRole("button", { name: "곤지암 브라더스" }).click();
  const exactPlaceLink = page.getByRole("link", { name: /지도\/예약 확인/ });
  const href = await exactPlaceLink.getAttribute("href");
  if (!href?.startsWith("https://place.map.kakao.com/")) throw new Error(`Expected exact Kakao place URL, received: ${href}`);
  if (consoleErrors.length || pageErrors.length || serverErrors.length) throw new Error(JSON.stringify({ consoleErrors, pageErrors, serverErrors }));

  console.log(JSON.stringify({ kakaoSdk: true, tileCount, exactPlaceLink: href, consoleErrors: 0, pageErrors: 0, serverErrors: 0 }, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
