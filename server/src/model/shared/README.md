## Interface
```typescript
export interface BaseStockInput {
  code: string;
  startTime: string;
}
export interface GetMonthRevenueInput extends BaseStockInput {}
export interface MonthRevenue {
    code: string;
    name: string;
    currentMonthRevenue: number;
    lastMonthRevenue:number;
    lastYearRevenue: number;
    compareLastMonthRatio: number;
    compareLastYearRatio:number;
    currentMonthAccumulateRevenue:number;
    lastYearAccumulateRevenue:number;
    compareAccumulateRatio:number;
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
```