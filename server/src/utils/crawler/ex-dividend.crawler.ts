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
export class ExDividendCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  filePath = 'ex-dividend';
  stockListFilePath = 'stock-list';
  constructor() {}

  init() {
    if (!isDirectoryExistSync({ path: this.filePath })) {
      mkdirSync(this.filePath);
    }
    const { stockList } = JSON.parse(
      readFileSync({ path: this.stockListFilePath, fileName: 'stock-list' })
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
    const currentYear = date.getFullYear() - 1911;
    const url = `https://mops.twse.com.tw/mops/web/ajax_t05st09_2?encodeURIComponent=1&step=1&firstin=1&off=1&keyword4=&code1=&TYPEK2=&checkbtn=&queryName=co_id&inpuType=co_id&TYPEK=all&isnew=false&co_id=${code}&date1=100&date2=${currentYear}&qryType=2`;
    const exDividendList: { [id: string]: string | CheerioElement }[] = [];
    axios
      .get(url)
      .then(({ data }: any) => {
        const $ = cheerio.load(data);
        console.log(
          `$('body > center > table[class=hasBorder]`,
          $('body > center > table[class=hasBorder]').length
        );
        $('body > center > table[class=hasBorder] > tbody > tr').each((_, el: CheerioElement) => {
          const td = $(el)
            .find('td')
            .map((__, element: CheerioElement) => {
              return $(element)
                .text()
                .trim();
            });
          if (td.length === 0) {
            return;
          }
          const parseData = {
            date: td[1],
            retainedEarningsCashDividend: td[10], // 盈餘分配之現金股利(元/股)
            legalReserveCashDividend: td[11], // 法定盈餘公積、資本公積發放之現金(元/股)
            retainedEarningsStockDividend: td[13], // 盈餘轉增資配股(元/股)
            legalReserveStockDividend: td[14] // 法定盈餘公積、資本公積轉增資配股(元/股)
          };

          exDividendList.push(parseData);
        });
        if (exDividendList.length === 0) {
          console.log(`ExDividendCrawler: code: ${code} could not available data in ${date} `);
          return;
        }
        writeFile({
          path: `${this.filePath}/${code}`,
          fileName: code,
          data: JSON.stringify({ exDividend: exDividendList })
        });
      })
      .catch(({ message }: Error) => console.log('ExDividendCrawler:' + message));
  }

  historyDownload(date: Date, code: string) {
    const historyDate = new Date(date);
    if (
      isFileExistSync({
        path: `${this.filePath}/${code}`,
        fileName: code
      })
    ) {
      return;
    }
    this.throttle.add(this.download.bind(this, new Date(historyDate), code));
  }

  routineDownload() {
    // query everyday at 23:00 PM
    nodeSchedule.scheduleJob('0 0 23 * * *', () => {
      const date = new Date();
      console.log(`ExDividendCrawler: routine download in ${date}`);
      const { stockList } = JSON.parse(
        readFileSync({ path: this.stockListFilePath, fileName: 'stock-list' })
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
