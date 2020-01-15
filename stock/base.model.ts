export interface BaseStockInput {
  code: string;
  startTime: string;
}

export interface Stock {
  code: string;
  name: string;
}

export interface BaseStockItem<T> {
  date: string;
  data: T;
}
