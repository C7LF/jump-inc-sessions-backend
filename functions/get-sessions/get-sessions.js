const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

exports.handler = async (event, context) => {
  let theTitle = null
  let browser = null
  console.log('spawning chrome headless')
  try {
    const executablePath = await chromium.executablePath

    // setup
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath,
      headless: chromium.headless,
    })

    // Do stuff with headless chrome
    const page = await browser.newPage()
    const targetUrl = 'https://davidwells.io'

    // Goto page and then do stuff
    await page.goto(targetUrl, {
      waitUntil: ["domcontentloaded", "networkidle0"]
    })

    await page.waitForSelector('#phenomic')

    theTitle = await page.title();

    console.log('done on page', theTitle)

  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error
      })
    }
  } finally {
    // close browser
    if (browser !== null) {
      await browser.close()
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      title: theTitle,
    })
  }
}


// exports.handler = async (event, context, callback) => {

//     // try {

//         const browser = await puppeteer.launch({
//             args: chromium.args,
//             executablePath: chromium.executablePath,
//             headless: chromium.headless,
//         });

//         const page = await browser.newPage();

//         let sessions = null

//         page.on('response', async response => {
//             // allow XHR only
//             if ('xhr' !== response.request().resourceType()) {
//                 return;
//             }

//             // find response which contains products
//             if (response.url().includes('https://api.roller.app/api/products/availabilities/widget')) {
//                 await response.json().then(data => {
//                     // return session objects.
//                     sessions = data.products.filter(item => item.productId == 457566).map(oj => oj.sessions).flat(1);
//                 }).catch(err => console.log(err));
//             }
//         });

//         await page.goto('https://roller.app/jumpincsheffield/products/booknow?/sessions#/sessions', { waitUntil: ['networkidle2', 'load', 'domcontentloaded'], timeout: 100000 })
//         await page.close()
//         await browser.close()
//     // } catch {
//     //     console.log("error")
//     //     sessions = "wrong"
//     // }

//         return callback(null, {
//             statusCode: 200,
//             body: JSON.stringify({
//               title: sessions,
//             })
//           })


// }