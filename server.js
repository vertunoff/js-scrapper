
import express, { text } from 'express';
import puppeteer from 'puppeteer';
const app = express();
const port = 3000;

app.use(express.static('old'));

app.get('/RBCscrape', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = "https://rbc.ru/";

        await page.goto(url);

        const links = await page.evaluate(() => {
            const politicsLinks = [];
            const linkElements = document.querySelectorAll('a');

            for (const linkElement of linkElements) {
                const linkText = linkElement.textContent;
                const linkHref = linkElement.href;

                if (linkHref.includes('society') && linkHref != 'https://www.rbc.ru/politics/' && linkHref !=  'https://www.rbc.ru/politics/?utm_source=topline') {
                    politicsLinks.push({ title: linkText, url: linkHref });
                }
            }

            return politicsLinks;
        });

        // const url2 = links[1].url;
        const url2 = 'https://www.rbc.ru/society/12/10/2023/6527c2729a794711f96e3875?from=from_main_12'
        await page.goto(url2);
        const pageText = await page.evaluate(() => {
            const paragraphElements = document.querySelectorAll('p');
            let combinedText = '';

            for (const paragraphElement of paragraphElements) {
                combinedText += paragraphElement.textContent + ' ';
            }

            return combinedText.trim();
        });

        await browser.close();
        res.json({ text: pageText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/RIAscrape', async (req, res) => {
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = req.query.url;
        await page.goto(url);

        const listItemDivs = await page.evaluate(() => {
            const listItems = Array.from(document.querySelectorAll('.list-item__title'));
        
            let links = listItems.map(element => {
                return {
                    link: element.href,
                    text: element.text
                }
            })
        
            return links;
          });
        
        await browser.close();
        res.json(listItemDivs)
    }
    catch (error) {
        res.status(500).json({ error: error.message });  
    }
})
app.get('/RIAarticle', async (req, res) =>{
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = req.query.url;
        await page.goto(url);
        const articleTitle = await page.evaluate(() => {
            const titleElement = document.querySelector('.article__title');
            return titleElement ? titleElement.textContent : '';
          });
        
          
        
          // Получаем текст всех абзацев с классом article__text
          const articleTexts = await page.evaluate(() => {
            const textElements = document.querySelectorAll('.article__text');
            const textArray = [];
            
            textElements.forEach(textElement => {
              textArray.push(textElement.textContent);
            });
        
            return textArray;
          });
        
          // Выводим результат
          
          const result = articleTitle + "\n" + '\n' + articleTexts.join('\n\n')
          res.json({text : result})
    }
    catch (error) {
        res.status(500).json({ error: error.message });  
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
