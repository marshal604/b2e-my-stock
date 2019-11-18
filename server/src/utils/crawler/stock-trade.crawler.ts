import axios from 'axios';
import nodeSchedule from 'node-schedule';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile, isFileExistSync } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
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
    const stockTradeList: { [id: string]: string }[] = [];
    axios
      .get(url)
      .then((res: any) => {
        const { data } = res.data;
        if (!data || data.length === 0) {
          console.log(
            `StockTradeCrawler: code: ${stockTradeDate} could not available data in ${date} `
          );
          return;
        }
        stockTradeList.push({
          code: data[0], // 證券代號
          name: data[1], // 證券名稱
          foreignInvestorBuy: data[2], // 外陸資買進股數(不含外資自營商)
          foreignInvestorSell: data[3], // 外陸資賣出股數(不含外資自營商)
          foreignInvestorBuyAndSell: data[4], // 外陸資買賣超股數(不含外資自營商)
          securtiesInvestorBuy: data[8], // 投信買進股數
          securtiesInvestorSell: data[9], // 投信賣出股數
          securtiesInvestorBuyAndSell: data[10], // 投信買賣超股數
          dealerBuy: data[12], // 自營商買進股數(自行買賣)
          dealerSell: data[13], // 自營商賣出股數(自行買賣)
          dealerBuyAndSell: data[14], // 自營商買賣超股數(自行買賣)
          allInvestorBuyAndSell: data[18] // 三大法人買賣超股數
        });
        writeFile({
          path: this.filePath,
          fileName: stockTradeDate,
          data: JSON.stringify({ stockTradeList })
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
