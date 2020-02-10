import {
  GetMonthRevenueInput,
  MonthRevenueList,
  GetQuarterRevenueInput,
  QuarterRevenueList,
  GetIncreasingMonthRevenueInput,
  MonthRevenueFilterList,
  QuarterRevenueFilterList,
  GetIncreasingQuarterRevenueInput,
  BaseStockList,
  GetCollectorEquityListInput,
  CollectorEquity,
  GetCollectorEquityChangeListInput,
  GetCollectorEquityChangeListOutput,
  GetStockInfoInput,
  StockInfo,
  StockInfoList
} from '@models/shared/stock';
import { RevenueService, ReferenceService, DailyInfoService } from '@service';

interface Context {
  revenueService: RevenueService;
  referenceService: ReferenceService;
  dailyInfoService: DailyInfoService;
}
export const context: Context = {
  revenueService: new RevenueService(),
  referenceService: new ReferenceService(),
  dailyInfoService: new DailyInfoService()
};

export const resolvers = {
  Query: {
    sayHello: (_: any, arg: { name: string }) => `Hello ${arg.name}!`,
    getMonthRevenueList: (
      _: any,
      { request }: { request: GetMonthRevenueInput },
      context: Context
    ): Promise<MonthRevenueList> => {
      return context.revenueService.getMonthRevenueList(request);
    },
    getQuarterRevenueList: (
      _: any,
      { request }: { request: GetQuarterRevenueInput },
      context: Context
    ): Promise<QuarterRevenueList> => {
      return context.revenueService.getQuarterRevenueList(request);
    },
    getIncreasingMonthRevenueList: (
      _: any,
      { request }: { request: GetIncreasingMonthRevenueInput },
      context: Context
    ): Promise<MonthRevenueFilterList> => {
      return context.revenueService.getIncreasingMonthRevenueList(request);
    },
    getIncreasingQuarterRevenueList: (
      _: any,
      { request }: { request: GetIncreasingQuarterRevenueInput },
      context: Context
    ): Promise<QuarterRevenueFilterList> => {
      return context.revenueService.getIncreasingQuarterRevenueList(request);
    },
    getCollectorEquityList(
      _: any,
      { request }: { request: GetCollectorEquityListInput },
      context: Context
    ): Promise<BaseStockList<CollectorEquity[]>> {
      return context.referenceService.getCollectorEquityList(request);
    },
    getCollectorEquityChangeList(
      _: any,
      { request }: { request: GetCollectorEquityChangeListInput },
      context: Context
    ): Promise<GetCollectorEquityChangeListOutput> {
      return context.referenceService.getCollectorEquityChangeList(request);
    },
    getCurrentStockInfo(
      _: any,
      { request }: { request: GetStockInfoInput },
      context: Context
    ): Promise<StockInfo> {
      return context.dailyInfoService.getCurrentStockInfo(request);
    },
    getStockInfoList(
      _: any,
      { request }: { request: GetStockInfoInput },
      context: Context
    ): Promise<StockInfoList> {
      return context.dailyInfoService.getStockInfoList(request);
    },
    getSpecificDateStockInfo(
      _: any,
      { request }: { request: GetStockInfoInput },
      context: Context
    ): Promise<StockInfo> {
      return context.dailyInfoService.getSpecificDateStockInfo(request);
    }
  }
};
