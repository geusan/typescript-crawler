import axios from 'axios';
import fs from 'fs';
import path from 'path';
import urlParse from 'url-parse';
import { Chromium } from './Chromium';

async function main() {
  const baseUrl = 'BASE_URL';
  const destination = path.join(__dirname, '../results');

  const chromium = await Chromium.open(baseUrl);
  await chromium.wait(3000);
  const results = await chromium.getElements('.anibanner_image_list > li img');
  const sources: any[] = [];
  for (const result of results) {
    const element = await result.getProperty('src');
    if (element !== null) {
      sources.push(await element.jsonValue());
    }
  }

  if (!fs.lstatSync(destination).isDirectory()) {
    fs.mkdirSync(destination);
  }

  for (const src of sources) {
    const res = await axios.get(src, { responseType: 'arraybuffer' });
    const parse = urlParse(src);
    const filename = parse.pathname.split('/').slice(-1)[0];
    fs.writeFileSync(path.join(__dirname, '../results', filename), res.data);
  }
  process.exit();
}

main();
