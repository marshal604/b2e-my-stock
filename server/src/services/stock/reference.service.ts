import {
  GetCollectorEquityListInput,
  CollectorEquity,
  BaseStockList,
  GetCollectorEquityChangeListInput,
  Stock,
  CollectorEquityLevel,
  CollectorEquityLevelMapping,
  CollectorEquityChangeItem,
  GetCollectorEquityChangeListOutput
} from '@models/shared/stock';
import { formatDate, DateFormatCategory } from '@utils/date';
import { recursiveReadFile, RecursiveReadFileOutput, readFileSync } from '@utils/file';

export class ReferenceService {
  readonly collectorEquityPath = 'collector-equity';
  readonly collectorEquityDateListFileName = 'date-list';
  readonly stockListPath = 'stock-list';
  readonly stockListFileName = 'stock-list';
  getCollectorEquityList(
    request: GetCollectorEquityListInput
  ): Promise<BaseStockList<CollectorEquity[]>> {
    const time = new Date(request.startTime);
    const dateList: string[] = JSON.parse(
      readFileSync({
        path: this.collectorEquityPath,
        fileName: this.collectorEquityDateListFileName
      })
    );
    const formatTime = formatDate(time, DateFormatCategory.CollectorEquity);
    const fileNameList = dateList.filter(date => date >= formatTime);
    const path = `${this.collectorEquityPath}/${request.code}`;
    return recursiveReadFile<CollectorEquity>({
      path,
      fileNameList: fileNameList
    }).then((list: RecursiveReadFileOutput<CollectorEquity[]>[]) => ({
      list
    }));
  }

  async getCollectorEquityChangeList(
    request: GetCollectorEquityChangeListInput
  ): Promise<GetCollectorEquityChangeListOutput> {
    const dateList: string[] = JSON.parse(
      readFileSync({
        path: this.collectorEquityPath,
        fileName: this.collectorEquityDateListFileName
      })
    ).slice(0, 2);
    const stockList: { data: Stock[] } = JSON.parse(
      readFileSync({
        path: this.stockListPath,
        fileName: this.stockListFileName
      })
    );
    type PromiseListModel = Stock & RecursiveReadFileOutput<CollectorEquity[]>;
    const promiseList: Promise<PromiseListModel[]>[] = [];
    stockList.data.forEach(stock => {
      const path = `${this.collectorEquityPath}/${stock.code}`;
      promiseList.push(
        recursiveReadFile<CollectorEquity>({
          path,
          fileNameList: dateList
        }).then(list => {
          return list.map(item => ({
            ...item,
            ...stock
          }));
        })
      );
    });
    const list = await Promise.all(promiseList);
    const filterMap = new Map<string, number>();
    const changeCollectorEquityList: CollectorEquityChangeItem[] = [];
    list.forEach(collectorEquityList => {
      const noData = collectorEquityList.some(
        collectorEquityItem => collectorEquityItem.data.length === 0
      );
      if (noData) {
        return;
      }
      filterMap.clear();
      const refCollectorEquityItem = collectorEquityList[0];
      request.changeList
        .map(level => CollectorEquityLevelMapping[level])
        .forEach(level => {
          const levelData = <CollectorEquity>(
            refCollectorEquityItem.data.find(levelItem => levelItem.level === level)
          );
          filterMap.set(level, levelData.people);
        });
      const compareCollectorEquityItem = collectorEquityList[1];
      const levelChangeList: CollectorEquityLevel[] = [];
      let hasChange: boolean = false;
      compareCollectorEquityItem.data
        .filter(levelItem => filterMap.get(levelItem.level))
        .forEach(levelItem => {
          const value = filterMap.get(levelItem.level);
          const isPeopleNotEqual = value !== levelItem.people;
          if (isPeopleNotEqual) {
            levelChangeList.push(levelItem.level as CollectorEquityLevel);
          }
          hasChange = hasChange || isPeopleNotEqual;
        });
      if (hasChange) {
        changeCollectorEquityList.push({
          code: refCollectorEquityItem.code,
          name: refCollectorEquityItem.name,
          levelChangeList
        });
      }
    });
    return {
      list: changeCollectorEquityList
    };
  }
}
