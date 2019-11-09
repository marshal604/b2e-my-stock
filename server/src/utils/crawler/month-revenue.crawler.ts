import axios from 'axios';
import nodeSchedule from 'node-schedule';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import { formatDate, DateFormatCategory } from '@utils/date';
import { writeFile } from '@utils/file';
import { Throttle, ThrottleRequestPerSecond } from '@utils/throttle';
import { readFileSync } from '@utils/file';
export class MonthRevenueCrawler {
  throttle = new Throttle({ requestPerSecond: ThrottleRequestPerSecond.Default });
  constructor() {}

  init() {
    this.historyDownload(new Date());
    this.routineDownload();
  }

  download(date: Date) {
    const monthRevenueDate = formatDate(date, DateFormatCategory.MonthRevenue);
    const url = `https://mops.twse.com.tw/nas/t21/sii/t21sc03_${monthRevenueDate}.html`;
    const monthRevenueList: { [id: string]: CheerioElement }[] = [];
    axios
      .get(url, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'text/html; charset=big5'
        }
      })
      .then(({ data }: any) => {
        const decodeData = iconv.decode(data, 'big-5');
        const $ = cheerio.load(decodeData);
        $('center > table > tbody > tr > td > table').each((_, el: CheerioElement) => {
          const tr = $(el).find('table > tbody > tr');
          tr.each((row: number, elem: CheerioElement) => {
            if (row > 1 && row + 1 < tr.length) {
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
                /* 營業收入 */
                currentMonthRevenue: td[2], // 當月營收
                lastMonthRevenue: td[3], // 上月營收
                lastYearRevenue: td[4], // 去年當月營收
                compareLastMonthRatio: td[5], // 上月比較增減(%)
                compareLastYearRatio: td[6], // 去年同月增減(%)
                /* 累計營業收入 */
                currentMonthAccumulateRevenue: td[7], // 當月累計營收
                lastYearAccumulateRevenue: td[8], // 去年累計營收
                compareAccumulateRatio: td[9] // 前期累計比較增減(%)
              };

              monthRevenueList.push(parseData);
            }
          });
        });
        if (monthRevenueList.length === 0) {
          console.log(`MonthRevenueCrawler: could not available data in ${date} `);
          return;
        }
        writeFile({
          path: 'month-revenue',
          fileName: monthRevenueDate,
          data: JSON.stringify({ revenue: monthRevenueList })
        });
      })
      .catch(({ message }: Error) => console.log('MonthRevenueCrawler:' + message));
  }

  historyDownload(date: Date) {
    const historyDate = new Date(date);
    historyDate.setFullYear(date.getFullYear() - 2);
    historyDate.setMonth(0);
    while (historyDate < date) {
      try {
        readFileSync({
          path: 'month-revenue',
          fileName: formatDate(historyDate, DateFormatCategory.MonthRevenue)
        });
      } catch {
        this.throttle.add(this.download.bind(this, new Date(historyDate)));
      }
      historyDate.setMonth(historyDate.getMonth() + 1);
    }
  }

  routineDownload() {
    nodeSchedule.scheduleJob('0 0 20 1-15 * *', () => {
      const date = new Date();
      console.log(`MonthRevenueCrawler: routine download in ${date}`);
      this.throttle.add(this.download.bind(this, date));
    });
  }
}
