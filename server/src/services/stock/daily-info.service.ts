import { GetStockInfoInput, StockInfo } from '@models/shared/stock';
import { DateFormatCategory, formatDate } from '@utils/date';
import { readFile } from '@utils/file';
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
}
