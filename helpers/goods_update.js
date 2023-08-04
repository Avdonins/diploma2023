const { Capabilities, By, until } = require('selenium-webdriver')
let fs = require('fs');
let goods = require('/helpers/data.json')

export const goodsRepo = {
    getData: () => goods,
    updateData: (driver) => main(driver),
    stopLoad: () => main("stop"),
    createSession: () => createSession(),
    getDate: () => getDate(),
}

const getDate = () => {
    const { mtime } = fs.statSync('./helpers/data.json')
    return mtime
}

const createSession = () => {
    let caps = Capabilities.chrome();
    caps.setPageLoadStrategy('eager')

    caps.set("goog:chromeOptions", {
        args: [
            "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 OPR/95.0.0.0",
            "log-level=3",
            "--disable-blink-features=AutomationControlled",
            "--ignore-certificate-errors-spki-list",
            // "--headless",
        ]
    })
    var webdriver = require('selenium-webdriver');
    const driver = new webdriver.Builder()
        .forBrowser('chrome')
        .withCapabilities(caps)
        .build()
    
    return driver
}

const stopLoad = () => {
    driver.quit()
}

const getData = async (driver, data, categories) => {
    try {
        for (let url of categories) {
            let category = '',
                count_of_products = 0,
                max_pages = 0,
                page = 10,
                current_URL = '';

            while (true) {
                await driver.get(`${url}?p=${page}`).then(() => {
                    return driver.getCurrentUrl();
                }).then(currentURL => {
                    current_URL = currentURL;
                })

                await driver.sleep(Math.floor(Math.random() * (6 - 2) + 2) * 1000)

                if (max_pages == 0) {
                    await driver.findElement(By.className('pagination-widget__page-link_last')).getAttribute('href').then(e => {
                        max_pages = parseInt(e.split('=')[1])
                        if (max_pages == NaN) {
                            max_pages = parseInt(e.split('/')[5].split('=')[1])
                        }
                    }).catch((error) => {
                        max_pages = 1
                    })
                }

                let divs = await driver.wait(until.elementsLocated(By.css('[data-id="product"]'), 10000))
                await driver.wait(until.elementsLocated(By.className('product-buy__price'), 10000))
                await driver.wait(until.elementsLocated(By.tagName('img'), 15000))

                await driver.findElement(By.className('title')).then(async e => {
                    category = await e.getText();
                })

                log(`Current url: ${current_URL}\nWatch page: ${page}, Count of products: ${divs.length}, Category: ${category}\n`)
                count_of_products += divs.length

                console.log(count_of_products)

                for (let div of divs) {
                    const elem = await div.findElement(By.className('catalog-product__name'))
                    const link = await elem.getAttribute('href')

                    const body = await elem.findElement(By.tagName('span')).getText()
                    const name = body.split('[')[0].trimEnd();
                    const description = body.split('[').slice(1).join(' ').replace('[', '') //.trimEnd().split(']')[0]

                    const raiting = await div.findElement(By.className('catalog-product__rating')).getAttribute('data-rating')
                    let price = await div.findElement(By.className('product-buy__price')).getText()

                    const img = await div.findElement(By.tagName('img')).getAttribute('data-src')

                    price = price.replace(/ /g, '').replace('\n', '').split('₽')
                    if (price[1] == '') {
                        price[1] = null
                    }

                    data.goods.push({
                        'name': name,
                        'description': description.replace(']', ''),
                        'raiting': parseInt(raiting),
                        'category': category,
                        'price': parseInt(!price[1] ? price[0].trimEnd() : price[1]),
                        'priceDiscount': parseInt(!price[1] ? price[1] : price[0].trimEnd()),
                        'url': link,
                        'img': img
                    })
                }
                page++;
                if (page > max_pages) {
                    break
                }
            }
        }
    } catch (error) {
        console.log(error)
        log(error);
    } finally {
        driver.quit();
    }
}

const log = (str) => {
    const fs = require('fs');
    fs.writeFile('./helpers/log.txt', `${str}\n`, { flag: 'a' }, (err) => {
        console.log(err);
    });
}

const saveData = () => {
    console.log("SAVE TRUE")
    fs.writeFileSync('./helpers/data.json', JSON.stringify(goods, null, 4));
}

const main = async (driver) => {
    let data = {
        goods: []
    }

    driver.build()

    let categories = [
        // 'https://www.dns-shop.ru/catalog/62c92d5946d337c4/servernye-operacionnye-sistemy/',
        // 'https://www.dns-shop.ru/catalog/e6d959c943e32156/aksessuary-dlya-servernyx-korpusov/',
        // 'https://www.dns-shop.ru/catalog/6cbd9f23e7066c55/servernye-napravlyayushhie/',
        // 'https://www.dns-shop.ru/catalog/bbbfd86bd37e0b91/oxlazhdenie-dlya-servernyx-processorov/',
        // 'https://www.dns-shop.ru/catalog/8f96686c51a99374/servernye-kabeli-i-perexodniki/',
        // 'https://www.dns-shop.ru/catalog/d1b66c37b97c8cc4/korziny-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/17a9e95b16404e77/servernye-korpusa/',
        // 'https://www.dns-shop.ru/catalog/4be07aa32e7a4e77/servernye-bp/',
        // 'https://www.dns-shop.ru/catalog/recipe/4665d1c30d258853/servernaa-pamat/',
        // 'https://www.dns-shop.ru/catalog/2b911f3c621a36eb/servernye-ssd-m2/',
        // 'https://www.dns-shop.ru/catalog/1023687c7ba7a69d/servernye-ssd/',
        // 'https://www.dns-shop.ru/catalog/17aa4e3216404e77/servernye-hdd/',
        // 'https://www.dns-shop.ru/catalog/17aa955316404e77/servernye-materinskie-platy/',
        // 'https://www.dns-shop.ru/catalog/17a9de1b16404e77/servernye-processory/',
        // 'https://www.dns-shop.ru/catalog/6f22e17dbcf0a54b/antipylevye-filtry-i-reshetki/',
        // 'https://www.dns-shop.ru/catalog/b20c9fc9750b3e70/aksessuary-dlya-korpusa/',
        // 'https://www.dns-shop.ru/catalog/17a8bbf216404e77/salazki-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/982e4f4eaab9f4c1/dekorativnye-elementy-dlya-ventilyatora/',
        // 'https://www.dns-shop.ru/catalog/c839bbe4305dcaed/smazka-dlya-ventilyatorov/',
        // 'https://www.dns-shop.ru/catalog/3f6ce729cc78f9c3/antivibracionnye-prokladki-i-gvozdi/',
        // 'https://www.dns-shop.ru/catalog/0e7b09605595ce74/kabel-menedzhment/',
        // 'https://www.dns-shop.ru/catalog/2a8f00c7c701409e/derzhateli-dlya-videokart/',
        // 'https://www.dns-shop.ru/catalog/f5006471d2d49eac/razvetviteli-dlya-ventilyatorov/',
        // 'https://www.dns-shop.ru/catalog/c07ae254c0358d7e/kabeli-razvetviteli-i-udliniteli/',
        // 'https://www.dns-shop.ru/catalog/519a8e40b53be1b3/kontrollery-podsvetki/',
        // 'https://www.dns-shop.ru/catalog/b37626c35ecf3604/sistemy-podsvetki/',
        // 'https://www.dns-shop.ru/catalog/17a8a9e816404e77/setevye-karty/',
        // 'https://www.dns-shop.ru/catalog/2c0f47131ade2231/aksessuary-dlya-materinskix-plat/',
        // 'https://www.dns-shop.ru/catalog/ebc01709b094a079/mnogofunkcionalnye-paneli/',
        // 'https://www.dns-shop.ru/catalog/ed60465eacbf3c59/adaptery-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/17a89bb916404e77/platy-rasshireniya/',
        // 'https://www.dns-shop.ru/catalog/recipe/a93cd0f2071b812a/vnesnie-opticeskie-privody/',
        // 'https://www.dns-shop.ru/catalog/17a89b8416404e77/karty-videozaxvata/',
        // 'https://www.dns-shop.ru/catalog/17a89b4f16404e77/zvukovye-karty/',
        // 'https://www.dns-shop.ru/catalog/17a9c97816404e77/opticheskie-privody/',
        // 'https://www.dns-shop.ru/catalog/17a8943716404e77/monitory/',
        // 'https://www.dns-shop.ru/catalog/17a9d18916404e77/vneshnie-boksy-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/ed60465eacbf3c59/adaptery-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/17aa4e3216404e77/servernye-hdd/',
        // 'https://www.dns-shop.ru/catalog/f09d15560cdd4e77/zhestkie-diski-25/',
        // 'https://www.dns-shop.ru/catalog/17a8914916404e77/zhestkie-diski-35/',
        // 'https://www.dns-shop.ru/catalog/17a9d1c016404e77/dok-stancii-dlya-nakopitelej/',
        // 'https://www.dns-shop.ru/catalog/recipe/4fef73f9c0e09a2c/servernye-ssd/',
        // 'https://www.dns-shop.ru/catalog/recipe/5bb555d805b6001e/servernye-ssd-m2/',
        // 'https://www.dns-shop.ru/catalog/dd58148920724e77/ssd-m2-nakopiteli/',
        // 'https://www.dns-shop.ru/catalog/8a9ddfba20724e77/ssd-nakopiteli/',
        // 'https://www.dns-shop.ru/catalog/54cdf51d85e52c20/instrumenty-dlya-naneseniya-termointerfejsa/',
        // 'https://www.dns-shop.ru/catalog/17a9cd3616404e77/termoklej/',
        // 'https://www.dns-shop.ru/catalog/17a9cfd716404e77/radiatory-dlya-ssd-m2/',
        // 'https://www.dns-shop.ru/catalog/17a89a6e16404e77/radiatory-dlya-pamyati/',
        // 'https://www.dns-shop.ru/catalog/85fe8b0e83901664/termoprokladki/',
        // 'https://www.dns-shop.ru/catalog/982e4f4eaab9f4c1/dekorativnye-elementy-dlya-ventilyatora/',
        // 'https://www.dns-shop.ru/catalog/c839bbe4305dcaed/smazka-dlya-ventilyatorov/',
        // 'https://www.dns-shop.ru/catalog/3f6ce729cc78f9c3/antivibracionnye-prokladki-i-gvozdi/',
        // 'https://www.dns-shop.ru/catalog/f57ceff4e49d10ec/instrumenty-dlya-raboty-s-szho/',
        // 'https://www.dns-shop.ru/catalog/ba01d15ff8c9184b/bekplejty-dlya-videokart/',
        // 'https://www.dns-shop.ru/catalog/d9afd9ed4713ecfd/zhidkost-dlya-oxlazhdeniya/',
        // 'https://www.dns-shop.ru/catalog/7dd2f94fbd40b838/fitingi-dlya-szho/',
        // 'https://www.dns-shop.ru/catalog/36ca7a16b10e23fd/trubki-i-shlangi/',
        // 'https://www.dns-shop.ru/catalog/0448014d9ef2e443/rezervuary-szho/',
        // 'https://www.dns-shop.ru/catalog/2cacbd38aaea1804/pompy-szho/',
        // 'https://www.dns-shop.ru/catalog/c337d10545a1d894/radiatory-szho/',
        // 'https://www.dns-shop.ru/catalog/46a6ee18ae77e78a/vodobloki/',
        // 'https://www.dns-shop.ru/catalog/17a9d15416404e77/krepleniya-dlya-sistem-oxlazhdeniya/',
        // 'https://www.dns-shop.ru/catalog/17a9cccc16404e77/termointerfejsy/',
        // 'https://www.dns-shop.ru/catalog/17a9cf0216404e77/ventilyatory-dlya-korpusa/',
        // 'https://www.dns-shop.ru/catalog/17a9cc9816404e77/sistemy-zhidkostnogo-oxlazhdeniya/',
        // 'https://www.dns-shop.ru/catalog/17a9cc2d16404e77/kulery-dlya-processorov/',
        // 'https://www.dns-shop.ru/catalog/17a89c2216404e77/bloki-pitaniya/',
        // 'https://www.dns-shop.ru/catalog/17a89c5616404e77/korpusa/',
        // 'https://www.dns-shop.ru/catalog/17a9b91b16404e77/operativnaya-pamyat-so-dimm/',
        // 'https://www.dns-shop.ru/catalog/17a89a3916404e77/operativnaya-pamyat-dimm/',
        // 'https://www.dns-shop.ru/catalog/17a89aab16404e77/videokarty/',
        // 'https://www.dns-shop.ru/catalog/17a89a0416404e77/materinskie-platy/',
        'https://www.dns-shop.ru/catalog/17a899cd16404e77/processory/'
    ]
    categories.reverse()

    await getData(driver, data, categories).then(() => {
        goods = data
        saveData()
    })
}