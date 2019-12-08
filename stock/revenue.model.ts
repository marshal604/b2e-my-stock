import { BaseStockInput } from './base.model';
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
