const p = require("puppeteer")
const extractor = require("keyword-extractor")
const cheerio = require("cheerio");
const axios = require("axios");
const _ = require("lodash")
const siteUrl = "https://www.snopes.com/?s=coronavirus";
let siteName = "";

const getKeywords = async () => {
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

        await browser.close()

        return {descriptions: descriptions, keywords: Array.from(new Set(_.flatten(_.concat(descriptions.map((obj) => extract(obj.description))))))}
    }

    catch (err) {
        return err
    }
}

const fetchWebsite = async () => {
    const res = await axios.get(siteUrl)
    
    return cheerio.load(res.data)
}

const getResults = async () => {
    const $ = await fetchWebsite()

    console.log($.html())

    const titles = []
    const descriptions = []

    const extract = (str) => extractor.extract(str, {
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true
   })

    $("h2.heading").each((index, element) => {
        titles.push($(element).text())
        console.log(element)
    })

    $("p.subheading").each((index, element) => {
        descriptions.push($(element).text())
    })

    const titleKeywords = titles.map(text => extract(text)).flat()
    const descriptionKeywords = descriptions.map(text => extract(text)).flat()
    
    const flatKeywords = Array.from(new Set(_.flatten(_.concat(titleKeywords, ...descriptionKeywords))))

    return {
        keywords: flatKeywords,
        descriptions: descriptions,
        titles: titles
    }
    
}
void (async () => console.log(await getKeywords()))()


module.exports = getKeywords