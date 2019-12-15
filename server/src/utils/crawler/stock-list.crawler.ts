import axios from 'axios';
import nodeSchedule from 'node-schedule';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile, isFileExist, isDirectoryExist } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
import { isWeekend } from '@utils/date';
import { Stock } from '@models/shared/stock';
export class StockListCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  path = 'stock-list';
  constructor() {}

  init(): Promise<void> {
    const date = isWeekend(new Date())
      ? new Date(new Date().setDate(new Date().getDate() - 2))
      : new Date();

    this.throttle.add(this.download.bind(this, date));
    this.routineDownload();
    return new Promise(resolve => {
      const interval = setInterval(() => {
        isDirectoryExist({
          path: this.path
        })
          .then((exist: boolean) => {
            if (!exist) {
              return false;
            }
            return isFileExist({
              path: this.path,
              fileName: this.path
            });
          })
          .then((exist: boolean) => {
            if (!exist) {
              return;
            }
            resolve();
            clearInterval(interval);
          });
      }, 2_000);
    });
  }

  download(date: Date) {
    const stockListDate = formatDate(date, DateFormatCategory.StockList);
    const url = `https://www.twse.com.tw/exchangeReport/MI_INDEX?response=json&date=${stockListDate}&type=ALLBUT0999`;
    axios
      .get(url)
      .then(({ data }: any) => {
        const stockInfoList: Array<string[]> = data.data9;
        if (!stockInfoList) {
          console.log(`StockListCrawler: could not available data in ${date} `);
          return;
        }
        const stockList: Stock[] = Array.from(stockInfoList).map(stock => ({
          code: stock[0],
          name: stock[1]
        }));

        writeFile({
          path: this.path,
          fileName: 'stock-list',
          data: JSON.stringify({ data: stockList })
        });
      })
      .catch(({ message }: Error) => console.log('StockListCrawler:' + message));
  }

  routineDownload() {
    nodeSchedule.scheduleJob('0 0 16 * * 1-5', () => {
      const date = new Date();
      console.log(`StockListCrawler: routine download in ${date}`);
      this.throttle.add(this.download.bind(this, date));
    });
  }
}
