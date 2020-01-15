import {
  GetMonthRevenueInput,
  GetQuarterRevenueInput,
  QuarterRevenueList,
  MonthRevenueList,
  GetIncreasingQuarterRevenueInput,
  GetIncreasingMonthRevenueInput,
  MonthRevenue,
  QuarterRevenue,
  MonthRevenueCompareWith,
  MonthRevenueFilterList,
  QuarterRevenueFilterList,
  MonthRevenueFilter,
  QuarterRevenueCompareWith,
  QuarterRevenueFilter
} from '@models/shared/stock';
import { formatDate, DateFormatCategory } from '@utils/date';
import { recursiveReadFile, RecursiveReadFileOutput, isFileExistSync } from '@utils/file';

export class RevenueService {
  readonly monthRevenuePath = 'month-revenue';
  readonly quarterRevenuePath = 'quarter-revenue';
  readonly QUARTER = 3;
  getMonthRevenueList(request: GetMonthRevenueInput): Promise<MonthRevenueList> {
    const time = new Date(request.startTime);
    const fileNameList = [];
    const currentTime = new Date();
    while (time <= currentTime) {
      fileNameList.push(formatDate(time, DateFormatCategory.MonthRevenue));
      time.setMonth(time.getMonth() + 1);
    }
    return recursiveReadFile<MonthRevenue>({
      path: this.monthRevenuePath,
      fileNameList: fileNameList
    }).then((list: RecursiveReadFileOutput<MonthRevenue[]>[]) => ({
      list: list
        .map(item => ({
          date: item.date,
          data: item.data.find(item => item.code === request.code) || <MonthRevenue>{}
        }))
        .filter(item => Object.keys(item.data).length !== 0)
    }));
  }

  getIncreasingMonthRevenueList(
    request: GetIncreasingMonthRevenueInput
  ): Promise<MonthRevenueFilterList> {
    const currentTime = new Date();
    const time = new Date();
    const compareAmount = request.filter.compareAmount;
    time.setMonth(currentTime.getMonth() - compareAmount);
    const fileNameList = [];
    while (time <= currentTime) {
      fileNameList.push(formatDate(time, DateFormatCategory.MonthRevenue));
      time.setMonth(time.getMonth() + 1);
    }
    return recursiveReadFile<MonthRevenue>({
      path: this.monthRevenuePath,
      fileNameList: fileNameList
    }).then((list: RecursiveReadFileOutput<MonthRevenue[]>[]) => {
      const compareMap = new Map<string, { lastMonthRatio: number[]; lastYearRatio: number[] }>();
      // filter no revenue month
      list = list.filter(item => Object.keys(item.data).length !== 0);
      list.forEach(item => {
        item.data.forEach(stock => {
          const obj = compareMap.get(stock.code) || { lastMonthRatio: [], lastYearRatio: [] };
          obj.lastMonthRatio.unshift(stock.compareLastMonthRatio);
          obj.lastYearRatio.unshift(stock.compareLastYearRatio);
          compareMap.set(stock.code, obj);
        });
      });

      const data = list[0].data.filter(stock => {
        const { lastYearRatio, lastMonthRatio } = compareMap.get(stock.code) || {
          lastMonthRatio: [],
          lastYearRatio: []
        };
        if (lastMonthRatio.length !== compareAmount || lastYearRatio.length !== compareAmount) {
          return;
        }
        let result = false;

        switch (request.compareWith) {
          case MonthRevenueCompareWith.lastMonth:
            result = this.compareMonthRevenueIncreasingPercent(lastMonthRatio, request.filter);
            break;
          case MonthRevenueCompareWith.lastYear:
            result = this.compareMonthRevenueIncreasingPercent(lastYearRatio, request.filter);
            break;
          case MonthRevenueCompareWith.lastYearAndMonth:
          default:
            result =
              this.compareMonthRevenueIncreasingPercent(lastMonthRatio, request.filter) &&
              this.compareMonthRevenueIncreasingPercent(lastYearRatio, request.filter);
            break;
        }
        return result;
      });

      return {
        list: data
      };
    });
  }

  getQuarterRevenueList(request: GetQuarterRevenueInput): Promise<QuarterRevenueList> {
    const time = new Date(request.startTime);
    const fileNameList = [];
    const currentTime = new Date();
    while (time <= currentTime) {
      fileNameList.push(formatDate(time, DateFormatCategory.QuarterRevenue));
      time.setMonth(time.getMonth() + this.QUARTER);
    }
    return recursiveReadFile<QuarterRevenue>({
      path: this.quarterRevenuePath,
      fileNameList: fileNameList
    }).then((list: RecursiveReadFileOutput<QuarterRevenue[]>[]) => ({
      list: list.map(item => ({
        date: item.date,
        data: item.data.find(item => item.code === request.code) || <QuarterRevenue>{}
      }))
    }));
  }

  getIncreasingQuarterRevenueList(
    request: GetIncreasingQuarterRevenueInput
  ): Promise<QuarterRevenueFilterList> {
    const currentTime = new Date();
    let alphaQuarter = this.QUARTER;
    switch (request.compareWith) {
      case QuarterRevenueCompareWith.lastQuarter:
        alphaQuarter = 1 * this.QUARTER;
        break;
      case QuarterRevenueCompareWith.lastYear:
      default:
        alphaQuarter = 4 * this.QUARTER;
    }
    if (
      !isFileExistSync({
        path: this.quarterRevenuePath,
        fileName: formatDate(currentTime, DateFormatCategory.QuarterRevenue)
      })
    ) {
      currentTime.setMonth(currentTime.getMonth() - alphaQuarter);
    }

    const time = new Date(currentTime);
    const compareAmount = request.filter.compareAmount;
    time.setMonth(time.getMonth() - compareAmount * alphaQuarter);
    const fileNameList = [];
    while (time <= currentTime) {
      fileNameList.push(formatDate(time, DateFormatCategory.QuarterRevenue));
      time.setMonth(time.getMonth() + alphaQuarter);
    }

    return recursiveReadFile<QuarterRevenue>({
      path: this.quarterRevenuePath,
      fileNameList: fileNameList
    }).then((list: RecursiveReadFileOutput<QuarterRevenue[]>[]) => {
      const compareMap = new Map<string, { data: QuarterRevenue[] }>();
      list.forEach(item => {
        item.data.forEach(stock => {
          const obj = compareMap.get(stock.code) || { data: [] };
          obj.data.unshift(stock);
          compareMap.set(stock.code, obj);
        });
      });
      const data = this.compareQuarterRevenue(list[0].data, request.filter, compareMap);

      return { list: data };
    });
  }

  private compareMonthRevenueIncreasingPercent(
    list: number[],
    filter: MonthRevenueFilter
  ): boolean {
    return list.every(item => {
      let comparePercentResult = true;
      if (typeof filter.percent === 'number') {
        comparePercentResult = item >= filter.percent;
      }
      return comparePercentResult;
    });
  }

  private compareQuarterRevenue(
    list: QuarterRevenue[],
    filter: QuarterRevenueFilter,
    compareMap: Map<string, { data: QuarterRevenue[] }>
  ): QuarterRevenue[] {
    return list.filter(item => {
      let result = true;
      if (filter.isEpsPositive) {
        const stock = compareMap.get(item.code) || { data: [] };
        result = stock.data.every((stockItem: QuarterRevenue) => {
          return stockItem.eps >= 0;
        });
      }

      if (filter.epsIncreasingPercent) {
        const stock = compareMap.get(item.code) || { data: [] };
        let preEps = 0.0001;
        result = stock.data.every((stockItem: QuarterRevenue) => {
          const epsRatio = (stockItem.eps / preEps) * 100;
          preEps = stockItem.eps;
          return epsRatio >= (filter.epsIncreasingPercent || 0);
        });
      }

      if (filter.grossProfitIncreasingPercent) {
        const stock = compareMap.get(item.code) || { data: [] };
        let preGrossProfitRatio = 0;
        result = stock.data.every((stockItem: QuarterRevenue) => {
          const grossProfitRatio = (stockItem.grossProfit / stockItem.operatingRevenue) * 100;
          const totalRatio = grossProfitRatio - preGrossProfitRatio;
          preGrossProfitRatio = grossProfitRatio;
          return totalRatio >= (filter.grossProfitIncreasingPercent || 0);
        });
      }

      return result;
    });
  }
}
