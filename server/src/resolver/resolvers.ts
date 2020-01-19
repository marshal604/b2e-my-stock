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
  GetCollectorEquityChangeListOutput
} from '@models/shared/stock';
import { RevenueService, ReferenceService } from '@service';

interface Context {
  revenueService: RevenueService;
  referenceService: ReferenceService;
}
export const context: Context = {
  revenueService: new RevenueService(),
  referenceService: new ReferenceService()
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
    }
  }
};
