const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const baseURL = process.env.E2E_BASE_URL || 'https://ski.hothyun.com';
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${baseURL}/resorts/high1`, { waitUntil: 'networkidle', timeout: 90000 });
  const explorer = page.getByTestId('shuttle-route-explorer');
  await explorer.getByRole('textbox', { name: '출발 도시 또는 정류장 검색' }).fill('수원');
  await explorer.getByRole('button', { name: /수원·영통선/ }).click();
  const stopVisible = await explorer.getByText('수원역', { exact: true }).isVisible();
  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - window.innerWidth));
  const offenders = await page.evaluate(() => [...document.querySelectorAll('*')].map(element => {
    const rect = element.getBoundingClientRect();
    return { tag: element.tagName, className: String(element.className).slice(0, 180), text: (element.textContent || '').trim().slice(0, 80), left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width), scrollWidth: element.scrollWidth };
  }).filter(item => item.right > window.innerWidth + 2 || item.left < -2).sort((a, b) => b.right - a.right).slice(0, 12));
  if (!stopVisible || overflow > 2 || consoleErrors.length || pageErrors.length) throw new Error(JSON.stringify({ stopVisible, overflow, offenders, consoleErrors, pageErrors }));
  const result = { url: page.url(), stopVisible, overflow, offenders, consoleErrors, pageErrors };

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
