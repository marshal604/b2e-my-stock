import { GetStockInfoInput, StockInfo, StockInfoList } from '@models/shared/stock';
import { DateFormatCategory, formatDate } from '@utils/date';
import { readFile, recursiveReadFile, RecursiveReadFileOutput } from '@utils/file';
export class DailyInfoService {
  stockListPath = 'stock-list';

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
}
