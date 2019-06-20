import axios from 'axios';
import { JSDOM } from 'jsdom';

export class Crawler {

  private baseUrl: string;
  private dom: JSDOM | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.dom = null;
  }

  public async load(url?: string) {
    const response = await axios.get(url || this.baseUrl);
    this.dom = new JSDOM(Buffer.from(response.data));
  }

  public getElements(query: string, callback: (tag: Element, idx?: number, array?: Element[]) => any) {
    if (!this.dom) {
      return undefined;
    }
    // tslint:disable-next-line:no-console
    console.log((this.dom.window.document.querySelector('#layout_body') || { innerHTML: '' }).innerHTML);
    return Array.prototype.slice.call(this.dom.window.document.querySelectorAll(query)).map(callback);
  }
}
