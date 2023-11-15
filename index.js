import puppeteer from 'puppeteer';

const url = "https://rbc.ru/";

const main = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage()
    await page.goto(url);
    const links = await page.evaluate(() => {
        const politicsLinks = [];
        const linkElements = document.querySelectorAll('a'); 
    
        for (const linkElement of linkElements) {
          const linkText = linkElement.textContent;
          const linkHref = linkElement.href;
    
          if (linkHref.includes('politics') && linkHref != 'https://www.rbc.ru/politics/' && linkHref !=  'https://www.rbc.ru/politics/?utm_source=topline') {
            politicsLinks.push({ title: linkText, url: linkHref });
          }
        }
    
        return politicsLinks;
      });
    
    const url2 = links[1].url;
    console.log(url2);
    await page.goto(url2);
    const pageText = await page.evaluate(() => {
      const paragraphElements = document.querySelectorAll('p');
  
      let combinedText = '';
  
      for (const paragraphElement of paragraphElements) {
        combinedText += paragraphElement.textContent + ' '; 
      }
  
      return combinedText.trim(); 
    });
  
    
    console.log(pageText);
    

    console.log(pageText)

    await browser.close()
}
main();