import { BaseStockInput } from './base.model';

export interface GetStockInfoInput extends BaseStockInput {}
export interface StockInfo {
  date: string;
  transactionVolume: number;
  transactionPrice: number;
  openPrice: number;
  higherPrice: number;
  lowerPrice: number;
  closePrice: number;
  priceSpreadWithhigherAndLower: number;
  transactionCount: number;
}
export interface GetTradeInfoInput extends BaseStockInput {}
export interface TradeInfo {
  code: string;
  name: string;
  foreignInvestorBuy: number;
  foreignInvestorSell: number;
  foreignInvestorBuyAndSell: number;
  securtiesInvestorBuy: number;
  securtiesInvestorSell: number;
  securtiesInvestorBuyAndSell: number;
  dealerBuy: number;
  dealerSell: number;
  dealerBuyAndSell: number;
  allInvestorBuyAndSell: number;
}
