import {
  MonthRevenue,
  QuarterRevenue,
  ExDividend,
  CollectorEquity,
  StockInfo,
  TradeInfo
} from '@models/shared/stock';

export interface MonthRevenueObject {
  [id: string]: MonthRevenue[];
}

export interface QuarterRevenueObject {
  [id: string]: QuarterRevenue[];
}

export interface ExDividendObject {
  [id: string]: ExDividend[];
}

export interface CollectorEquityObject {
  [id: string]: CollectorEquity[];
}

export interface StockInfoObject {
  [id: string]: StockInfo[];
}

export interface TradeInfoObject {
  [id: string]: TradeInfo[];
}
