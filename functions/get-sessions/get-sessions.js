//const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda')

exports.handler = async (event, context) => {

    const browser = await chromium.puppeteer.launch({
        // Required
        executablePath: await chromium.executablePath,

        // Optional
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        headless: chromium.headless
    });

    const sessionData = async () => {
        const page = await browser.newPage();

        page.on('response', async response => {
            // allow XHR only
            if ('xhr' !== response.request().resourceType()) {
                return;
            }

            // find response which contains products
            if (response.url().includes('https://api.roller.app/api/products/availabilities/widget')) {
                await response.json().then(data => {
                    // return session objects.
                    return data.products.filter(item => item.productId == 457566).map(oj => oj.sessions).flat(1);
                }).catch(err => console.log(err));
            }
        });

        await page.goto('https://roller.app/jumpincsheffield/products/booknow?/sessions#/sessions', { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 100000 })
        await page.close()
        await browser.close()
    };
    sessionData()

}