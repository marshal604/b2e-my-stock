import axios from 'axios';
import nodeSchedule from 'node-schedule';
import cheerio from 'cheerio';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
import { readFileSync } from '@utils/file';
export class QuarterRevenueCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  filePath = 'quarter-revenue';
  constructor() {}

  init() {
    this.historyDownload(new Date());
    this.routineDownload();
  }

  download(date: Date) {
    const quarterRevenueDate = formatDate(date, DateFormatCategory.QuarterRevenue);
    const [year, season] = quarterRevenueDate.split('_');
    const url = `https://mops.twse.com.tw/mops/web/ajax_t163sb04?encodeURIComponent=1&step=1&firstin=1&off=1&isQuery=Y&TYPEK=sii&year=${year}&season=${season}`;
    const quarterRevenueList: { [id: string]: CheerioElement }[] = [];
    axios
      .get(url)
      .then(({ data }: any) => {
        const $ = cheerio.load(data);
        $('body > table').each((_, el: CheerioElement) => {
          const tr = $(el).find('table > tbody > tr');
          const headerColumnCount = 30;
          if ($(tr).find('th').length !== headerColumnCount) {
            return;
          }
          tr.each((_: number, elem: CheerioElement) => {
            const td = $(elem)
              .find('td')
              .map((__, element: CheerioElement) => {
                return $(element)
                  .text()
                  .trim();
              });

            // if code is undefined then do nothing
            if (!td[0]) {
              return;
            }

            const parseData = {
              code: td[0], // 公司代號
              name: td[1], // 公司名稱
              operatingRevenue: td[2], // 營業收入
              operatingCost: td[3], // 營業成本
              grossProfit: td[9], // 營業毛利(毛損)淨額
              operatingExpenses: td[10], // 營業費用
              operatingProfit: td[12], // 營業利益(損失)
              nonOperatingIncome: td[13], // 營業外收入及支出
              preTaxIncome: td[14], // 稅前淨利(淨損)
              incomeTaxExpense: td[15], // 所得税費用(利益)
              netIncome: td[19], // 稅後淨利(淨損)
              eps: td[29] // 基本每股盈餘(元)
            };

            quarterRevenueList.push(parseData);
          });
        });
        if (quarterRevenueList.length === 0) {
          console.log(
            `QuarterRevenueCrawler: ${quarterRevenueDate} could not available data in ${date} `
          );
          return;
        }
        writeFile({
          path: this.filePath,
          fileName: quarterRevenueDate,
          data: JSON.stringify({ revenue: quarterRevenueList })
        });
      })
      .catch(({ message }: Error) => console.log('QuarterRevenueCrawler:' + message));
  }

  historyDownload(date: Date) {
    const historyDate = new Date(date);
    historyDate.setFullYear(date.getFullYear() - 2);
    const season1 = 4;
    historyDate.setMonth(season1);
    historyDate.setDate(1);
    while (historyDate < date) {
      try {
        readFileSync({
          path: this.filePath,
          fileName: formatDate(historyDate, DateFormatCategory.QuarterRevenue)
        });
      } catch {
        this.throttle.add(this.download.bind(this, new Date(historyDate)));
      }
      historyDate.setMonth(historyDate.getMonth() + 3);
    }
  }

  routineDownload() {
    // query everyday at 12:00 PM
    nodeSchedule.scheduleJob('0 0 12 * * *', () => {
      const date = new Date();
      console.log(`QuarterRevenueCrawler: routine download in ${date}`);
      this.throttle.add(this.download.bind(this, date));
    });
  }
}
