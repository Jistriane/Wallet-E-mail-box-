const puppeteer = require('puppeteer');
const path = require('path');

async function generateScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 720
    });
    
    // Navegar para a aplicação local
    await page.goto('http://localhost:5173', {
      waitUntil: 'networkidle0'
    });
    
    // Esperar um pouco para garantir que tudo carregou
    await page.waitForTimeout(2000);
    
    // Tirar screenshot
    await page.screenshot({
      path: path.join(__dirname, '../public/screenshot1.png'),
      fullPage: false
    });
    
    console.log('Screenshot gerada com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar screenshot:', error);
  } finally {
    await browser.close();
  }
}

generateScreenshot().catch(console.error); 