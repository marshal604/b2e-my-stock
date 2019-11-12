import { MonthRevenueCrawler } from '@utils/crawler/month-revenue.crawler';
import { QuarterRevenueCrawler } from '@utils/crawler/quarter-revenue.crawler';
import { StockListCrawler } from '@utils/crawler/stock-list.crawler';
import { StockPriceAndVolumeCrawler } from '@utils/crawler/stock-price-and-volume.crawler';

export class Crawler {
  private monthRevenueCrawler: MonthRevenueCrawler;
  private quarterRevenueCrawler: QuarterRevenueCrawler;
  private stockListCrawler: StockListCrawler;
  private stockPriceAndVolumeCrawler: StockPriceAndVolumeCrawler;
  constructor() {
    this.monthRevenueCrawler = new MonthRevenueCrawler();
    this.quarterRevenueCrawler = new QuarterRevenueCrawler();
    this.stockListCrawler = new StockListCrawler();
    this.stockPriceAndVolumeCrawler = new StockPriceAndVolumeCrawler();
  }
  init() {
    this.stockListCrawler.init();
    this.monthRevenueCrawler.init();
    this.quarterRevenueCrawler.init();
    this.stockPriceAndVolumeCrawler.init();
  }
}
