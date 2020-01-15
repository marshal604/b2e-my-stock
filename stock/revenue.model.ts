import { BaseStockInput, BaseStockItem } from './base.model';
export interface GetMonthRevenueInput extends BaseStockInput {}
export interface MonthRevenue {
  code: string;
  name: string;
  currentMonthRevenue: number;
  lastMonthRevenue: number;
  lastYearRevenue: number;
  compareLastMonthRatio: number;
  compareLastYearRatio: number;
  currentMonthAccumulateRevenue: number;
  lastYearAccumulateRevenue: number;
  compareAccumulateRatio: number;
}
export interface GetQuarterRevenueInput extends BaseStockInput {}
export interface QuarterRevenue {
  code: string;
  name: string;
  operatingRevenue: number;
  operatingCost: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  nonOperatingIncome: number;
  preTaxIncome: number;
  incomeTaxExpense: number;
  netIncome: number;
  eps: number;
}

export interface QuarterRevenueList {
  list: BaseStockItem<QuarterRevenue>[];
}

export interface QuarterRevenueFilterList {
  list: QuarterRevenue[];
}

export interface MonthRevenueList {
  list: BaseStockItem<MonthRevenue>[];
}

export interface MonthRevenueFilterList {
  list: MonthRevenue[];
}

export interface GetIncreasingMonthRevenueInput {
  compareWith: MonthRevenueCompareWith;
  filter: MonthRevenueFilter;
}

export interface MonthRevenueFilter {
  compareAmount: number;
  percent?: number;
}

export enum MonthRevenueCompareWith {
  lastMonth = 'lastMonth',
  lastYear = 'lastYear',
  lastYearAndMonth = 'lastYearAndMonth'
}

export interface GetIncreasingQuarterRevenueInput {
  compareWith: QuarterRevenueCompareWith;
  filter: QuarterRevenueFilter;
}

export interface QuarterRevenueFilter {
  compareAmount: number;
  isEpsPositive?: boolean;
  epsIncreasingPercent?: number;
  grossProfitIncreasingPercent?: number;
}

export enum QuarterRevenueCompareWith {
  lastQuarter = 'lastQuarter',
  lastYear = 'lastYear'
}
