import { MonthRevenueCrawler } from '@utils/crawler/month-revenue.crawler';
import { QuarterRevenueCrawler } from '@utils/crawler/quarter-revenue.crawler';
import { StockListCrawler } from '@utils/crawler/stock-list.crawler';
import { StockPriceAndVolumeCrawler } from '@utils/crawler/stock-price-and-volume.crawler';
import { ExDividendCrawler } from './ex-dividend.crawler';

export class Crawler {
  private monthRevenueCrawler: MonthRevenueCrawler;
  private quarterRevenueCrawler: QuarterRevenueCrawler;
  private stockListCrawler: StockListCrawler;
  private stockPriceAndVolumeCrawler: StockPriceAndVolumeCrawler;
  private exDividendCrawler: ExDividendCrawler;
  constructor() {
    this.monthRevenueCrawler = new MonthRevenueCrawler();
    this.quarterRevenueCrawler = new QuarterRevenueCrawler();
    this.stockListCrawler = new StockListCrawler();
    this.stockPriceAndVolumeCrawler = new StockPriceAndVolumeCrawler();
    this.exDividendCrawler = new ExDividendCrawler();
  }
  init() {
    this.stockListCrawler.init();
    this.monthRevenueCrawler.init();
    this.quarterRevenueCrawler.init();
    this.stockPriceAndVolumeCrawler.init();
    this.exDividendCrawler.init();
  }
}
