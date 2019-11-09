import { MonthRevenueCrawler } from '@utils/crawler/month-revenue.crawler';
import { QuarterRevenueCrawler } from '@utils/crawler/quarter-revenue.crawler';

export class Crawler {
  private monthRevenueCrawler: MonthRevenueCrawler;
  private quarterRevenueCrawler: QuarterRevenueCrawler;
  constructor() {
    this.monthRevenueCrawler = new MonthRevenueCrawler();
    this.quarterRevenueCrawler = new QuarterRevenueCrawler();
  }
  init() {
    this.monthRevenueCrawler.init();
    this.quarterRevenueCrawler.init();
  }
}
