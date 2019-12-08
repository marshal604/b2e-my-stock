import nodeSchedule from 'node-schedule';
import cheerio from 'cheerio';
import request from 'request';
import iconv from 'iconv-lite';

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
import { CollectorEquity } from '@models/shared/stock';

export class CollectorEquityCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  filePath = 'collector-equity';
  stockListFilePath = 'stock-list';
  dateList: string[] = [];
  constructor() {}

  init() {
    if (!isDirectoryExistSync({ path: this.filePath })) {
      mkdirSync(this.filePath);
    }
    const { stockList } = JSON.parse(
      readFileSync({ path: this.stockListFilePath, fileName: 'stock-list' })
    );
    request.post(
      {
        url: 'https://www.tdcc.com.tw/smWeb/QryStockAjax.do',
        form: {
          REQ_OPR: 'qrySelScaDates'
        }
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log('CollectorEquityCrawler: get statistic date list failure', err);
          return;
        }
        writeFile({
          path: `${this.filePath}`,
          fileName: 'date-list',
          data: body
        });
        this.dateList = JSON.parse(body);
        Array.from(stockList as { name: string; code: string }[])
          .filter(stock => stock.code.length === 4)
          .filter(stock => stock.code.slice(0, 2) !== '00')
          .forEach(stock => {
            this.historyDownload(this.dateList, stock.code);
          });
        this.routineDownload();
      }
    );
  }

  download(date: Date, code: string) {
    const collectorEquityDate = formatDate(date, DateFormatCategory.CollectorEquity);
    request.post(
      {
        url: 'https://www.tdcc.com.tw/smWeb/QryStockAjax.do',
        form: {
          scaDates: collectorEquityDate,
          scaDate: collectorEquityDate,
          SqlMethod: 'StockNo',
          StockNo: code,
          radioStockNo: code,
          StockName: '',
          REQ_OPR: 'SELECT',
          clkStockNo: code,
          clkStockName: ''
        },
        encoding: null
      },
      (err, httpResponse, body) => {
        if (err) {
          console.log(
            `CollectorEquityCrawler: download ${code} in ${collectorEquityDate} failure`,
            err
          );
          return;
        }
        const decodeData = iconv.decode(body, 'big-5');
        const $ = cheerio.load(decodeData);
        const collectorEquityList: CollectorEquity[] = [];

        $('form > table > tbody > tr > td > table[class=mt] > tbody > tr').each(
          (index: number, el: CheerioElement) => {
            if (index < 2) {
              return;
            }
            const td = $(el)
              .find('td')
              .map((__, element: CheerioElement) => {
                return $(element)
                  .text()
                  .trim();
              });

            collectorEquityList.push({
              level: JSON.stringify(td[1]), // 持股/單位數分級
              people: Number(td[2]), // 人數
              stock: transformCommaStringToNumber(JSON.stringify(td[3])), // 股數/單位數
              percent: Number(td[4]) // 占集保庫存數比例 (%)
            });
          }
        );
        writeFile({
          path: `${this.filePath}/${code}`,
          fileName: collectorEquityDate,
          data: JSON.stringify({ collectorEquityList })
        });
      }
    );
  }

  historyDownload(dateList: string[], code: string) {
    dateList.forEach(dateItem => {
      if (
        !isFileExistSync({
          path: `${this.filePath}/${code}`,
          fileName: dateItem
        })
      ) {
        const year = dateItem.slice(0, 4);
        const month = dateItem.slice(4, 6);
        const date = dateItem.slice(6);
        this.throttle.add(this.download.bind(this, new Date(`${year}/${month}/${date}`), code));
      }
    });
  }

  routineDownload() {
    // query everyday at 12:00 PM
    nodeSchedule.scheduleJob('0 0 6 * * 7', () => {
      request.post(
        {
          url: 'https://www.tdcc.com.tw/smWeb/QryStockAjax.do',
          form: {
            REQ_OPR: 'qrySelScaDates'
          }
        },
        (err, httpResponse, body) => {
          if (err) {
            console.log('CollectorEquityCrawler: get statistic date list failure', err);
            return;
          }
          writeFile({
            path: `${this.filePath}`,
            fileName: 'date-list',
            data: body
          });
          const [lastDate] = body;
          const year = lastDate.slice(0, 4);
          const month = lastDate.slice(4, 6);
          const date = lastDate.slice(6);
          const { stockList } = JSON.parse(
            readFileSync({ path: this.filePath, fileName: 'stock-list' })
          );
          Array.from(stockList as { name: string; code: string }[])
            .filter(stock => stock.code.length === 4)
            .filter(stock => stock.code.slice(0, 2) !== '00')
            .forEach(stock => {
              this.throttle.add(
                this.download.bind(this, new Date(`${year}/${month}/${date}`), stock.code)
              );
            });
        }
      );
    });
  }
}
