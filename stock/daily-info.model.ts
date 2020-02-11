import { BaseStockInput, BaseStockItem, Stock } from './base.model';

export interface GetStockInfoInput extends BaseStockInput {}
export interface StockInfo {
  date: string;
  transactionVolume: number;
  transactionPrice: number;
  openPrice: number;
  higherPrice: number;
  lowerPrice: number;
  closePrice: number;
  priceSpreadWithHigherAndLower: number;
  transactionCount: number;
}
export interface GetTradeInfoInput extends BaseStockInput {}
export interface TradeInfo {
  code: string;
  name: string;
  foreignInvestorBuy: number;
  foreignInvestorSell: number;
  foreignInvestorBuyAndSell: number;
  securitiesInvestorBuy: number;
  securitiesInvestorSell: number;
  securitiesInvestorBuyAndSell: number;
  dealerBuy: number;
  dealerSell: number;
  dealerBuyAndSell: number;
  allInvestorBuyAndSell: number;
}

export interface StockInfoList {
  list: BaseStockItem<StockInfo[]>[];
}

export interface StockList {
  list: Stock[];
}
