import { MonthRevenueCrawler } from '@utils/crawler/month-revenue.crawler';
import { QuarterRevenueCrawler } from '@utils/crawler/quarter-revenue.crawler';
import { StockListCrawler } from '@utils/crawler/stock-list.crawler';

export class Crawler {
  private monthRevenueCrawler: MonthRevenueCrawler;
  private quarterRevenueCrawler: QuarterRevenueCrawler;
  private stockListCrawler: StockListCrawler;
  constructor() {
    this.monthRevenueCrawler = new MonthRevenueCrawler();
    this.quarterRevenueCrawler = new QuarterRevenueCrawler();
    this.stockListCrawler = new StockListCrawler();
  }
  init() {
    this.monthRevenueCrawler.init();
    this.quarterRevenueCrawler.init();
    this.stockListCrawler.init();
  }
}
