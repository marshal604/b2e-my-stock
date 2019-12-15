import axios from 'axios';
import nodeSchedule from 'node-schedule';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile, isFileExistSync } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
import { transformCommaStringToNumber } from '@utils/transform';
import { TradeInfo } from '@models/shared/stock';
export class StockTradeCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  filePath = 'trade-info';
  constructor() {}

  init() {
    this.historyDownload(new Date());
    this.routineDownload();
  }

  download(date: Date) {
    const stockTradeDate = formatDate(date, DateFormatCategory.StockTrade);
    const url = `http://www.twse.com.tw/fund/T86?response=json&date=${stockTradeDate}&selectType=ALLBUT0999`;
    const stockTradeList: TradeInfo[] = [];
    axios
      .get(url)
      .then(({ data: { data: stockData } }: { data: { data: string[][] } }) => {
        if (!stockData || stockData.length === 0) {
          console.log(
            `StockTradeCrawler: code: ${stockTradeDate} could not available data in ${date} `
          );
          return;
        }
        Array.from(stockData).forEach(items => {
          stockTradeList.push({
            code: String(items[0]).trim(), // 證券代號
            name: String(items[1]).trim(), // 證券名稱
            foreignInvestorBuy: transformCommaStringToNumber(String(items[2])), // 外陸資買進股數(不含外資自營商)
            foreignInvestorSell: transformCommaStringToNumber(String(items[3])), // 外陸資賣出股數(不含外資自營商)
            foreignInvestorBuyAndSell: transformCommaStringToNumber(String(items[4])), // 外陸資買賣超股數(不含外資自營商)
            securtiesInvestorBuy: transformCommaStringToNumber(String(items[8])), // 投信買進股數
            securtiesInvestorSell: transformCommaStringToNumber(String(items[9])), // 投信賣出股數
            securtiesInvestorBuyAndSell: transformCommaStringToNumber(String(items[10])), // 投信買賣超股數
            dealerBuy: transformCommaStringToNumber(String(items[12])), // 自營商買進股數(自行買賣)
            dealerSell: transformCommaStringToNumber(String(items[13])), // 自營商賣出股數(自行買賣)
            dealerBuyAndSell: transformCommaStringToNumber(String(items[14])), // 自營商買賣超股數(自行買賣)
            allInvestorBuyAndSell: transformCommaStringToNumber(String(items[18])) // 三大法人買賣超股數
          });
        });
        writeFile({
          path: this.filePath,
          fileName: stockTradeDate,
          data: JSON.stringify({ data: stockTradeList })
        });
      })
      .catch(({ message }: Error) => console.log('StockTradeCrawler:' + message));
  }

  historyDownload(date: Date) {
    const historyDate = new Date(date);
    historyDate.setMonth(date.getMonth() - 2);
    historyDate.setDate(1);
    historyDate.setHours(0);
    while (historyDate < date) {
      const isWeekend = historyDate.getDay() === 0 || historyDate.getDay() === 6;
      if (
        !isFileExistSync({
          path: this.filePath,
          fileName: formatDate(historyDate, DateFormatCategory.StockTrade)
        }) &&
        !isWeekend
      ) {
        this.throttle.add(this.download.bind(this, new Date(historyDate)));
      }
      historyDate.setDate(historyDate.getDate() + 1);
    }
  }

  routineDownload() {
    // query everyday at 09:00 PM
    nodeSchedule.scheduleJob('0 0 21 * * *', () => {
      const date = new Date();
      console.log(`StockTradeCrawler: routine download in ${date}`);
      this.throttle.add(this.download.bind(this, date));
    });
  }
}
