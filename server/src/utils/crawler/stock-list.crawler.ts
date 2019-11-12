import axios from 'axios';
import nodeSchedule from 'node-schedule';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
export class StockListCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  path = 'stock-list';
  constructor() {}

  init() {
    this.throttle.add(this.download.bind(this, new Date()));
    this.routineDownload();
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
        const stockList: { code: string; name: string }[] = Array.from(stockInfoList).map(
          stock => ({
            code: stock[0],
            name: stock[1]
          })
        );

        writeFile({
          path: this.path,
          fileName: 'stock-list',
          data: JSON.stringify({ stockList })
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
