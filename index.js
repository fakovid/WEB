const p = require("puppeteer")
const extractor = require("keyword-extractor")

void (async () => {
    try {
        const browser = await p.launch()

        const page = await browser.newPage()

        await page.goto("https://www.snopes.com/?s=coronavirus")

        // const grabFromSearchResult = () => {

        // }

        const extract = (str) => extractor.extract(str, {
            language:"english",
            remove_digits: true,
            return_changed_case:true,
            remove_duplicates: true
       })
        

        const descriptions = await page.evaluate(() => {

            const SearchQuery = "div.ais-hits--item"
            const data = []
            const searchRows = document.querySelectorAll(SearchQuery)
            const grabFromResult = (result) => ({heading: result.querySelector("h2.heading").innerText,description: result.querySelector("p.subheading").innerText})

            for (const result of searchRows) {
                
                data.push(grabFromResult(result))
            }

            return data
        })

        console.log(descriptions)

        descriptions.forEach(element => {
            console.log(extract(element.description))
        });


        await browser.close()
    }

    catch (err) {
        console.log(err)
    }
})()