const express = require('express')
const cors = require('cors')
const app = express()

const puppeteer = require('puppeteer');

app.get('/sessions', cors(), (req, res) => {
    const sessionData = async () => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        page.on('response', async response => {
            // allow XHR only
            if ('xhr' !== response.request().resourceType()) {
                return ''
            }

            // find response which contains products
            if (response.url().includes('https://api.roller.app/api/products/availabilities/widget')) {
                await response.json().then(data => {
                    // return session objects.
                    res.send(data.products.filter(item => item.productId == 457566).map(oj => oj.sessions).flat(1));
                }).catch(err => console.log(err));
            }
        });

        await page.goto('https://roller.app/jumpincsheffield/products/booknow?/sessions#/sessions', { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 100000 })
        await page.close()
        await browser.close()
    };
    sessionData()
})

app.listen(process.env.PORT || 8080, () => console.log(`Server running`))