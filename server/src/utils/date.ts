export enum DateFormatCategory {
  MonthRevenue = 'yyy_m_0',
  QuarterRevenue = 'yyy_0q',
  FinancialCorporationTrade = 'yyyymmdd',
  StockList = 'yyyymmdd',
  StockPriceAndVolumeWithQueryDate = 'yyyymmdd',
  StockPriceAndVolumeWithPathName = 'yyyymm',
  StockTrade = 'yyyymmdd'
}

export function formatDate(date: Date, format: DateFormatCategory): string {
  switch (format) {
    case DateFormatCategory.MonthRevenue:
      return yyy_m_0(date);
    case DateFormatCategory.QuarterRevenue:
      return yyy_0q(date);
    case DateFormatCategory.FinancialCorporationTrade:
    case DateFormatCategory.StockList:
    case DateFormatCategory.StockPriceAndVolumeWithQueryDate:
    case DateFormatCategory.StockTrade:
      return yyyymmdd(date);
    case DateFormatCategory.StockPriceAndVolumeWithPathName:
      return yyyymm(date);
  }
}

export function isWeekend(date: Date): boolean {
  return date.getDay() === 6 || date.getDay() === 0;
}

/* return format: yyy_m_0 */
function yyy_m_0(date: Date): string {
  const year = date.getFullYear() - 1911;
  const month = date.getMonth() + 1;
  return `${year}_${month}_0`;
}

/* 
    一般公司(含投控公司)：每會計年度第1季、第2季及第3季終了後45日內(5/15、8/14、11/14前)。
    return format: yyy_0q
  */
function yyy_0q(date: Date): string {
  const fullYear = date.getFullYear();
  const year = fullYear - 1911;
  /**
   * season1 04/01 ~ 05/15 24:00
   * season2 07/01 ~ 08/15 24:00
   * season3 10/01 ~ 11/14 24:00
   * season4 01/01 ~ 03/31 24:00
   * in order to logic simple and buffer, so modify below
   * season1 04/01 ~ 06/30 24:00
   * season2 07/01 ~ 09/30 24:00
   * season3 10/01 ~ 12/31 24:00
   * season4 01/01 ~ 03/31 24:00
   */
  const isSeason1 =
    new Date(`${fullYear}/04/01`) <= date && date < new Date(`${fullYear}/06/30 24:00`);
  const isSeason2 =
    new Date(`${fullYear}/07/01`) <= date && date < new Date(`${fullYear}/09/30 24:00`);
  const isSeason3 =
    new Date(`${fullYear}/10/01`) <= date && date < new Date(`${fullYear}/12/31 24:00`);
  if (isSeason1) {
    return `${year}_01`;
  } else if (isSeason2) {
    return `${year}_02`;
  } else if (isSeason3) {
    return `${year}_03`;
  } else {
    return `${year - 1}_04`;
  }
}

/* return format: yyyymmdd */
function yyyymmdd(date: Date): string {
  const year = date.getFullYear();
  const month = fetchZero({ data: date.getMonth() + 1, zeroNum: 2 });
  const day = fetchZero({ data: date.getDate(), zeroNum: 2 });
  return `${year}${month}${day}`;
}

/* return format: yyyymm */
function yyyymm(date: Date): string {
  const year = date.getFullYear();
  const month = fetchZero({ data: date.getMonth() + 1, zeroNum: 2 });
  return `${year}${month}`;
}

function fetchZero({ data, zeroNum }: { data: string | number; zeroNum: number }): string {
  const zeros = Array(zeroNum)
    .fill(0)
    .join('');
  return (zeros + data).slice(-zeroNum);
}
