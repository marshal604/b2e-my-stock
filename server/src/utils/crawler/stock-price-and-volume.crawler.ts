import axios from 'axios';
import nodeSchedule from 'node-schedule';
import cheerio from 'cheerio';

import { formatDate, DateFormatCategory } from '@utils/date';
import {
  writeFile,
  isDirectoryExistSync,
  isFileExistSync,
  mkdirSync,
  readFileSync
} from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
import { transformCommaStringToNumber } from '@utils/transform';
import { StockInfo } from '@models/shared/stock';
export class StockPriceAndVolumeCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  filePath = 'stock-list';
  constructor() {}

  init() {
    if (!isDirectoryExistSync({ path: this.filePath })) {
      mkdirSync(this.filePath);
    }
    const { data: stockList } = JSON.parse(
      readFileSync({ path: this.filePath, fileName: 'stock-list' })
    );
    Array.from(stockList as { name: string; code: string }[])
      .filter(stock => stock.code.length === 4)
      .filter(stock => stock.code.slice(0, 2) !== '00')
      .forEach(stock => {
        this.historyDownload(new Date(), stock.code);
      });
    this.routineDownload();
  }

  download(date: Date, code: string) {
    const stockPriceAndVolumeDate = formatDate(
      date,
      DateFormatCategory.StockPriceAndVolumeWithQueryDate
    );
    const fileName = formatDate(date, DateFormatCategory.StockPriceAndVolumeWithPathName);
    const url = `https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${stockPriceAndVolumeDate}&stockNo=${code}`;
    const stockAndVolumeList: StockInfo[] = [];
    axios
      .get(url)
      .then(({ data }: any) => {
        const stockData: string[][] = data.data;
        if (!stockData || stockData.length === 0) {
          console.log(
            `StockPriceAndVolumeCrawler: code: ${code} ${fileName} could not available data in ${date} `
          );
          return;
        }
        Array.from(stockData).forEach(stockDateItems => {
          const [
            stockDate,
            transactionVolume,
            transactionPrice,
            openPrice,
            higherPrice,
            lowerPrice,
            closePrice,
            priceSpreadWithhigherAndLower,
            transactionCount
          ] = stockDateItems;
          stockAndVolumeList.push({
            date: String(stockDate).trim(), // 日期
            transactionVolume: transformCommaStringToNumber(String(transactionVolume)), // 成交股數
            transactionPrice: transformCommaStringToNumber(String(transactionPrice)), // 成交金額
            openPrice: Number(openPrice), // 開盤價
            higherPrice: Number(higherPrice), // 最高價
            lowerPrice: Number(lowerPrice), // 最低價
            closePrice: Number(closePrice), // 收盤價
            priceSpreadWithhigherAndLower: Number(priceSpreadWithhigherAndLower), // 漲跌價差
            transactionCount: transformCommaStringToNumber(String(transactionCount)) // 成交筆數
          });
        });
        writeFile({
          path: `${this.filePath}/${code}`,
          fileName,
          data: JSON.stringify({ data: stockAndVolumeList })
        });
      })
      .catch(({ message }: Error) => console.log('StockPriceAndVolumeCrawler:' + message));
  }

  historyDownload(date: Date, code: string) {
    const historyDate = new Date(date);
    historyDate.setMonth(date.getMonth() - 3);
    historyDate.setDate(1);
    historyDate.setHours(0);
    while (historyDate < date) {
      if (
        !isFileExistSync({
          path: `${this.filePath}/${code}`,
          fileName: formatDate(historyDate, DateFormatCategory.StockPriceAndVolumeWithPathName)
        })
      ) {
        this.throttle.add(this.download.bind(this, new Date(historyDate), code));
      }
      historyDate.setMonth(historyDate.getMonth() + 1);
    }
  }

  routineDownload() {
    // query everyday at 12:00 PM
    nodeSchedule.scheduleJob('0 0 12 * * *', () => {
      const date = new Date();
      console.log(`StockPriceAndVolumeCrawler: routine download in ${date}`);
      const { data: stockList } = JSON.parse(
        readFileSync({ path: this.filePath, fileName: 'stock-list' })
      );
      Array.from(stockList as { name: string; code: string }[])
        .filter(stock => stock.code.length === 4)
        .filter(stock => stock.code.slice(0, 2) !== '00')
        .forEach(stock => {
          this.throttle.add(this.download.bind(this, date, stock.code));
        });
    });
  }
}
