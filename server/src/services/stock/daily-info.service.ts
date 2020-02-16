import {
  GetStockInfoInput,
  StockInfo,
  StockInfoList,
  Stock,
  StockList,
  TradeInfo,
  TradeInfoList,
  GetTradeInfoInput,
  GetTradeInfoRangeListInput
} from '@models/shared/stock';
import { DateFormatCategory, formatDate } from '@utils/date';
import { readFile, recursiveReadFile, RecursiveReadFileOutput, readDirSync } from '@utils/file';
export class DailyInfoService {
  stockListPath = 'stock-list';
  tradeInfoPath = 'trade-info';

  getCurrentStockInfo(request: GetStockInfoInput): Promise<StockInfo> {
    const time = new Date(request.startTime);
    const fileName = formatDate(time, DateFormatCategory.StockPriceAndVolumeWithPathName);
    const path = `${this.stockListPath}/${request.code}`;

    return readFile({
      path,
      fileName
    }).then(jsonData => {
      const { data }: { data: StockInfo[] } = JSON.parse(jsonData);
      const lastData = data[data.length - 1];
      return lastData;
    });
  }

  getSpecificDateStockInfo(request: GetStockInfoInput): Promise<StockInfo> {
    const time = new Date(request.startTime);
    const fileName = formatDate(time, DateFormatCategory.StockPriceAndVolumeWithPathName);
    const path = `${this.stockListPath}/${request.code}`;

    return readFile({
      path,
      fileName
    }).then(jsonData => {
      const { data }: { data: StockInfo[] } = JSON.parse(jsonData);
      const specificData = <StockInfo>data.find(item => {
        const [_, month, date] = item.date.split('/');
        return Number(month) === time.getMonth() + 1 && Number(date) === time.getDate();
      });
      return specificData;
    });
  }

  getStockInfoList(request: GetStockInfoInput): Promise<StockInfoList> {
    const time = new Date(request.startTime);
    const today = new Date();
    const path = `${this.stockListPath}/${request.code}`;
    const fileNameList = [];
    while (time <= today) {
      fileNameList.push(formatDate(time, DateFormatCategory.StockPriceAndVolumeWithPathName));
      time.setMonth(time.getMonth() + 1);
    }

    return recursiveReadFile<StockInfo>({
      path,
      fileNameList
    }).then((list: RecursiveReadFileOutput<StockInfo[]>[]) => ({
      list
    }));
  }

  getStockList(): Promise<StockList> {
    return readFile({
      path: this.stockListPath,
      fileName: this.stockListPath
    }).then(jsonData => {
      const { data }: { data: Stock[] } = JSON.parse(jsonData);
      return { list: data };
    });
  }

  getCurrentTradeInfo(): Promise<TradeInfoList> {
    const fileList = this.getTradeInfoFileList();
    const lastFileName = fileList[fileList.length - 1];
    return readFile({
      path: this.tradeInfoPath,
      fileName: lastFileName
    }).then(jsonData => {
      const { data }: { data: TradeInfo[] } = JSON.parse(jsonData);
      return {
        list: [
          {
            date: lastFileName,
            data
          }
        ]
      };
    });
  }

  getTradeInfoRangeList(request: GetTradeInfoRangeListInput): Promise<TradeInfoList> {
    const fileDateList = this.getDateFormatTradeInfoFileList();
    const startTime = new Date(request.startTime);
    const dateIndex = fileDateList.findIndex(item => item >= startTime);
    const fileNameList = this.getTradeInfoFileList().slice(dateIndex || 0);
    return recursiveReadFile<TradeInfo>({
      path: this.tradeInfoPath,
      fileNameList
    }).then((list: RecursiveReadFileOutput<TradeInfo[]>[]) => ({
      list
    }));
  }

  getSpecificTradeInfoList(request: GetTradeInfoInput): Promise<TradeInfoList> {
    return this.getTradeInfoRangeList({ startTime: request.startTime }).then(data => {
      return {
        list: data.list.map(obj => {
          return {
            date: obj.date,
            data: obj.data.filter(item => item.code === request.code)
          };
        })
      };
    });
  }

  getTradeInfoFileList(): string[] {
    return readDirSync(this.tradeInfoPath).map(item => item.split('.')[0]);
  }

  getDateFormatTradeInfoFileList(): Date[] {
    return this.getTradeInfoFileList().map(item => {
      const year = Number(item.slice(0, 4));
      const month = Number(item.slice(4, -2)) - 1;
      const date = Number(item.slice(-2));
      return new Date(year, month, date);
    });
  }
}
