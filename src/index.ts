import axios from 'axios';
import fs from 'fs';
import path from 'path';
import urlParse from 'url-parse';
import { Chromium } from './Chromium';

async function main() {
  const baseUrl = 'https://m.rethinkmall.com/';
  // const crawler = new Crawler('https://m.rethinkmall.com/');

  // crawler.load().then(() => {
  //   // tslint:disable-next-line:no-console
  //   console.log('loaded successfully');
  //   const results = crawler.getElements('ul.anibanner_image_list > img', (tag) => {
  //     // tslint:disable-next-line:no-console
  //     console.log(tag);
  //     return tag.getAttribute('src');
  //   });
  //   // tslint:disable-next-line:no-console
  //   console.log(results);
  // });

  const chromium = await Chromium.open(baseUrl);
  await chromium.wait(3000);
  const results = await chromium.getElements('.anibanner_image_list > li img');
  // const content = await chromium.getContent();
  // tslint:disable-next-line:no-console
  // console.log(content.indexOf('class="anibanner_image_list'));
  // tslint:disable-next-line:no-console
  const sources: any[] = [];
  for (const result of results) {
    const element = await result.getProperty('src');
    if (element !== null) {
      sources.push(await element.jsonValue());
    }
  }
  for (const src of sources) {
    const res = await axios.get(src, { responseType: 'arraybuffer' });
    // console.log(res.data);
    const parse = urlParse(src);
    const filename = parse.pathname.split('/').slice(-1)[0];
    fs.writeFileSync(path.join(__dirname, '../results', filename), res.data);
  }
    // tslint:disable-next-line:no-console
  console.log(sources);

  process.exit();
}

main();
