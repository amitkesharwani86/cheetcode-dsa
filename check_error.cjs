const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER_ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE_ERROR:', error.message);
  });

  page.on('requestfailed', request => {
    console.log('REQUEST_FAILED:', request.url(), request.failure().errorText);
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Page loaded successfully without crashing.');
  } catch (err) {
    console.log('Navigation failed:', err.message);
  }

  await browser.close();
})();
