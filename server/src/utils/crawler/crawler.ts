import { MonthRevenueCrawler } from '@utils/crawler/month-revenue.crawler';

export class Crawler {
  private monthRevenueCrawler: MonthRevenueCrawler;
  constructor() {
    this.monthRevenueCrawler = new MonthRevenueCrawler();
  }
  init() {
    this.monthRevenueCrawler.init();
  }
}
