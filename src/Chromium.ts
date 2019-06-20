import puppeteer from 'puppeteer';

export class Chromium {

  public static async open(baseUrl: string) {
    const chromium = new Chromium();
    await chromium.initialize(baseUrl);
    return chromium;
  }

  private browser!: puppeteer.Browser;
  private page!: puppeteer.Page;

  public async getContent() {
    return this.page.content();
  }

  public async close() {
    await this.browser.close();
  }

  public async wait(time: number) {
    await this.page.waitFor(time);
  }

  public async getElements(query: string) {
    return this.page.$$(query);
  }

  private async initialize(baseUrl: string) {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(baseUrl);
  }

}
