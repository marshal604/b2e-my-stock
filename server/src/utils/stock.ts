import { readFile, isFileExistSync, isDirectoryExistSync } from '@utils/file';
import {
  Stock,
  MonthRevenue,
  GetMonthRevenueInput,
  GetQuarterRevenueInput,
  QuarterRevenue,
  GetStockInfoInput,
  StockInfo,
  GetTradeInfoInput,
  TradeInfo
} from '@models/shared/stock';
import { formatDate, DateFormatCategory } from '@utils/date';
import {
  MonthRevenueObject,
  QuarterRevenueObject,
  ExDividendObject,
  CollectorEquityObject,
  StockInfoObject,
  TradeInfoObject
} from '@models/utils/stock.model';
import {
  GetExDividendInput,
  ExDividend,
  GetCollectorEquityInput,
  CollectorEquity
} from '@models/shared/stock/reference.model';

export function getStockList(): Promise<Stock[]> {
  const stockList = 'stock-list';
  return readFile({ path: stockList, fileName: stockList });
}

export function getMonthRevenue(input: GetMonthRevenueInput): Promise<MonthRevenueObject> {
  const date = new Date(input.startTime);
  const path = 'month-revenue';
  const promiseList: Promise<MonthRevenueObject>[] = [];
  while (date < new Date()) {
    const fileName = formatDate(date, DateFormatCategory.MonthRevenue);
    if (!isFileExistSync({ path, fileName })) {
      break;
    }
    promiseList.push(
      readFile({ path, fileName })
        .then(jsonItem => {
          const data = JSON.parse(jsonItem) as { data: MonthRevenue[] };
          // code === 0 is get all data
          return {
            [fileName]:
              input.code === '0' ? data.data : data.data.filter(item => item.code === input.code)
          };
        })
        .catch((error: Error) => {
          console.log(`getMonthRevenue failed from  ${path}/${fileName}`, error.message);
          return { [fileName]: [] };
        })
    );
    date.setMonth(date.getMonth() + 1);
  }
  return Promise.all(promiseList).then((dataList: MonthRevenueObject[]) => {
    let obj: MonthRevenueObject = {};
    dataList.forEach(item => {
      const [month, revenue] = Object.entries(item)[0];
      obj = {
        ...obj,
        [month]: revenue
      };
    });
    return obj;
  });
}

export function getQuarterRevenue(input: GetQuarterRevenueInput): Promise<QuarterRevenueObject> {
  const date = new Date(input.startTime);
  const path = 'quarter-revenue';
  const promiseList: Promise<QuarterRevenueObject>[] = [];
  while (date < new Date()) {
    const fileName = formatDate(date, DateFormatCategory.QuarterRevenue);
    if (!isFileExistSync({ path, fileName })) {
      break;
    }
    promiseList.push(
      readFile({ path, fileName })
        .then(jsonItem => {
          const data = JSON.parse(jsonItem) as { data: QuarterRevenue[] };
          // code === 0 is get all data
          return {
            [fileName]:
              input.code === '0' ? data.data : data.data.filter(item => item.code === input.code)
          };
        })
        .catch((error: Error) => {
          console.log(`getQuarterRevenue failed from  ${path}/${fileName}`, error.message);
          return { [fileName]: [] };
        })
    );
    date.setMonth(date.getMonth() + 3);
  }
  return Promise.all(promiseList).then((data: QuarterRevenueObject[]) => {
    let obj: QuarterRevenueObject = {};
    data.forEach(item => {
      const [quarter, revenue] = Object.entries(item)[0];
      obj = {
        ...obj,
        [quarter]: revenue
      };
    });
    return obj;
  });
}

export function getExDividend(input: GetExDividendInput): Promise<ExDividendObject> {
  const path = `ex-dividend/${input.code}`;
  const fileName = input.code;
  if (!isDirectoryExistSync({ path }) || !isFileExistSync({ path, fileName })) {
    return Promise.reject(`getExDividend failed from ${path}/${fileName}`);
  }
  return readFile({ path, fileName })
    .then(jsonItem => {
      const data = JSON.parse(jsonItem) as { data: ExDividend[] };
      return {
        [fileName]: data.data
      };
    })
    .catch((error: Error) => {
      console.log(`getExDividend failed from  ${path}/${fileName}`, error.message);
      return { [fileName]: [] };
    });
}

export function getCollectorEquity(input: GetCollectorEquityInput): Promise<CollectorEquityObject> {
  const date = new Date(input.startTime);
  const path = `collector-equity/${input.code}`;

  if (!isDirectoryExistSync({ path })) {
    return Promise.reject(`getCollectorEquity failed from ${path}`);
  }
  const dateListPath = 'collector-equity';
  return readFile({ path: dateListPath, fileName: 'date-list' })
    .then(jsonItem => {
      const dateList: string[] = JSON.parse(jsonItem);
      const promiseList: Promise<CollectorEquityObject>[] = [];
      dateList
        .filter(recordDate => {
          const year = recordDate.slice(0, 4);
          const month = recordDate.slice(4, 6);
          const day = recordDate.slice(6, 8);
          return date <= new Date(`${year}/${month}/${day}`);
        })
        .forEach(fileName => {
          if (!isFileExistSync({ path, fileName })) {
            return;
          }
          promiseList.push(
            readFile({ path, fileName })
              .then(jsonItem => {
                const data = JSON.parse(jsonItem) as { data: CollectorEquity[] };
                return {
                  [fileName]: data.data
                };
              })
              .catch((error: Error) => {
                console.log(`getCollectorEquity failed from  ${path}/${fileName}`, error.message);
                return { [fileName]: [] };
              })
          );
        });
      return promiseList;
    })
    .then(promiseList => {
      return Promise.all(promiseList).then((dataList: CollectorEquityObject[]) => {
        let obj: CollectorEquityObject = {};
        dataList.forEach(item => {
          const [code, collectorEquity] = Object.entries(item)[0];
          obj = {
            ...obj,
            [code]: collectorEquity
          };
        });
        return obj;
      });
    })
    .catch((error: Error) => {
      console.log(`getCollectorEquity: ${dateListPath}/date-list loading failure`, error.message);
      return {};
    });
}

export function getStockInfo(input: GetStockInfoInput): Promise<StockInfoObject> {
  const date = new Date(input.startTime);
  const path = `stock-list/${input.code}`;
  const promiseList: Promise<StockInfoObject>[] = [];
  if (!isDirectoryExistSync({ path })) {
    return Promise.reject(`getStockInfo failed from ${path}`);
  }
  while (date < new Date()) {
    const fileName = formatDate(date, DateFormatCategory.StockPriceAndVolumeWithPathName);
    if (!isFileExistSync({ path, fileName })) {
      break;
    }
    promiseList.push(
      readFile({ path, fileName })
        .then(jsonItem => {
          const data = JSON.parse(jsonItem) as { data: StockInfo[] };
          return {
            [fileName]: data.data
          };
        })
        .catch((error: Error) => {
          console.log(`getStockInfo failed from  ${path}/${fileName}`, error.message);
          return { [fileName]: [] };
        })
    );
    date.setDate(date.getDate() + 1);
  }
  return Promise.all(promiseList).then((dataList: StockInfoObject[]) => {
    let obj: StockInfoObject = {};
    dataList.forEach(item => {
      const [recordDate, stockInfo] = Object.entries(item)[0];
      obj = {
        ...obj,
        [recordDate]: stockInfo
      };
    });
    return obj;
  });
}

export function getStockTradeInfo(input: GetTradeInfoInput): Promise<TradeInfoObject> {
  const date = new Date(input.startTime);
  const path = `trade-info`;
  const promiseList: Promise<TradeInfoObject>[] = [];
  if (!isDirectoryExistSync({ path })) {
    return Promise.reject(`getStockTradeInfo failed from ${path}`);
  }
  while (date < new Date()) {
    const fileName = formatDate(date, DateFormatCategory.StockTrade);
    if (!isFileExistSync({ path, fileName })) {
      break;
    }
    promiseList.push(
      readFile({ path, fileName })
        .then(jsonItem => {
          const data = JSON.parse(jsonItem) as { data: TradeInfo[] };
          return {
            [fileName]: data.data
          };
        })
        .catch((error: Error) => {
          console.log(`getStockTradeInfo failed from  ${path}/${fileName}`, error.message);
          return { [fileName]: [] };
        })
    );
    date.setDate(date.getDate() + 1);
  }
  return Promise.all(promiseList).then((dataList: TradeInfoObject[]) => {
    let obj: TradeInfoObject = {};
    dataList.forEach(item => {
      const [recordDate, tradeInfo] = Object.entries(item)[0];
      obj = {
        ...obj,
        [recordDate]: tradeInfo
      };
    });
    return obj;
  });
}
