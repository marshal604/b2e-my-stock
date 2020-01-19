import { BaseStockInput, Stock, BaseStockList } from './base.model';

export interface GetExDividendInput extends BaseStockInput {}
export interface ExDividend {
  date: string;
  retainedEarningsCashDividend: number;
  legalReserveCashDividend: number;
  retainedEarningsStockDividend: number;
  legalReserveStockDividend: number;
}
export interface GetCollectorEquityListInput extends BaseStockInput {}
export interface GetCollectorEquityChangeListInput {
  changeList: CollectorEquityLevel[];
}

export type CollectorEquityChangeItem = Stock & {
  levelChangeList: CollectorEquityLevel[];
};

export type GetCollectorEquityListOutput = BaseStockList<CollectorEquity[]>;

export interface GetCollectorEquityChangeListOutput {
  list: CollectorEquityChangeItem[];
}

export interface CollectorEquity {
  level: string;
  people: number;
  stock: number;
  percent: number;
}

export enum CollectorEquityLevelMapping {
  Have100Up = '100,001-200,000',
  Have200Up = '200,001-400,000',
  Have400Up = '400,001-600,000',
  Have600Up = '600,001-800,000',
  Have800Up = '800,001-1,000,000',
  Have1000Up = '1,000,001以上'
}

export enum CollectorEquityLevel {
  Have100Up = 'Have100Up',
  Have200Up = 'Have200Up',
  Have400Up = 'Have400Up',
  Have600Up = 'Have600Up',
  Have800Up = 'Have800Up',
  Have1000Up = 'Have1000Up'
}
