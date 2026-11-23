// Gera os quadros da prévia em vídeo de um site (rola a página passo a passo e tira prints).
// Depois: ffmpeg -framerate 12 -i quadros/f%04d.jpg -vf "scale=800:500,format=yuv420p" -c:v libx264 -crf 29 -movflags +faststart -an assets/portfolio/NOME.mp4
// Uso: npm i playwright-core && node tools/gerar-previa.mjs <pasta-saida> <chave> 110
// Edite o objeto `urls` abaixo com o site novo e ajuste o caminho do Chrome.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const [, , out, key, nStr, gpu] = process.argv;
const N = +nStr || 130;
const urls = {
  giltec: 'https://giltec.vercel.app/',
  querencia: 'https://querencia-churrascaria.vercel.app/',
  'johny-burger': 'https://johny-burguer.vercel.app/',
  'la-bella-donna': 'http://localhost:8123/',
};
const dir = `${out}/${key}`;
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const args = gpu === 'gpu'
  ? ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist', '--enable-webgl']
  : ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const t0 = Date.now();
await page.goto(urls[key], { waitUntil: 'load', timeout: 60000 });
let i = 0;
const shot = async () => page.screenshot({ path: `${dir}/f${String(i++).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 72 });
// abertura do site (animações de entrada)
for (let k = 0; k < 12; k++) await shot();
await page.waitForTimeout(1500);
const h = await page.evaluate(() => document.documentElement.scrollHeight);
const total = h - 800;
const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
for (let k = 0; k <= N; k++) {
  const y = Math.round(total * (0.04 + 0.96 * (k / N)));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(220);
  await shot();
  if (k % 20 === 0) console.log(key, k, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
console.log(key, 'frames', i, 'altura', h, ((Date.now() - t0) / 1000).toFixed(0) + 's');
await browser.close();
