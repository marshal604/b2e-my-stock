import { BaseStockInput } from './base.model';

export interface GetExDividendInput extends BaseStockInput {}
export interface ExDividend {
  date: string;
  retainedEarningsCashDividend: number;
  legalReserveCashDividend: number;
  retainedEarningsStockDividend: number;
  legalReserveStockDividend: number;
}
export interface GetCollectorEquityInput extends BaseStockInput {}
export interface CollectorEquity {
  level: string;
  people: number;
  stock: number;
  percent: number;
}
