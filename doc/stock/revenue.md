## getMonthRevenueList
### Query
```
query($request: GetMonthRevenueInput!) {
  getMonthRevenueList(request: $request) {
    list {
      date
      data {
        code
        name
        currentMonthRevenue
        lastMonthRevenue
        lastYearRevenue
        compareLastMonthRatio
        compareLastYearRatio
        currentMonthAccumulateRevenue
        lastYearAccumulateRevenue
        compareAccumulateRatio
      }
    }
  }
}
```
### Request
```
{
  "request": {
    "code": "1101",
    "startTime": "Tue Jan 01 2019 00:00:00 GMT+0800"
  }
}
```

### Response
```
{
  "data": {
    "getMonthRevenueList": {
      "list": [
        {
          "date": "107_12_0",
          "data": {
            "code": "1101",
            "name": "台泥",
            "currentMonthRevenue": 11404254,
            "lastMonthRevenue": 11784150,
            "lastYearRevenue": 10986420,
            "compareLastMonthRatio": -3.22,
            "compareLastYearRatio": 3.8,
            "currentMonthAccumulateRevenue": 124599062,
            "lastYearAccumulateRevenue": 98311776,
            "compareAccumulateRatio": 26.73
          }
        },
        ...
        ...
      ]
    }
  }
}
```

## getMonthRevenueList
### Query
```
query($request: GetIncreasingMonthRevenueInput!) {
  getIncreasingMonthRevenueList(request: $request) {
    list {
      code
      name
      currentMonthRevenue
      lastMonthRevenue
      lastYearRevenue
      compareLastMonthRatio
      compareLastYearRatio
      currentMonthAccumulateRevenue
      lastYearAccumulateRevenue
      compareAccumulateRatio
    }
  }
}
```
### Request
```
{
  "request": {
    "compareWith": "lastYearAndMonth",
    "filter": {
      "compareAmount": 1,
      "percent": 20
    }
  }
}
```

### Response
```
{
  "data": {
    "getIncreasingMonthRevenueList": {
      "list": [
        {
          "code": "1109",
          "name": "信大",
          "currentMonthRevenue": 870651,
          "lastMonthRevenue": 638725,
          "lastYearRevenue": 546290,
          "compareLastMonthRatio": 36.31,
          "compareLastYearRatio": 59.37,
          "currentMonthAccumulateRevenue": 7129805,
          "lastYearAccumulateRevenue": 5993178,
          "compareAccumulateRatio": 18.96
        },
        {
            ...
            ...
        }
      ]
    }
  ]
}
```


## getQuarterRevenueList
### Query
```
query($request: GetQuarterRevenueInput!) {
  getQuarterRevenueList(request: $request) {
    list {
      date
      data {
        code
        name
        operatingRevenue
        operatingCost
        grossProfit
        operatingExpenses
        operatingProfit
        nonOperatingIncome
        preTaxIncome
        incomeTaxExpense
        netIncome
        eps
      }
    }
  }
}
```
### Request
```
{
  "request": {
    "code": "1101",
    "startTime": "Tue Jan 01 2019 00:00:00 GMT+0800"
  }
}
```

### Response
```
{
  "data": {
    "getQuarterRevenueList": {
      "list": [
        {
          "date": "107_04",
          "data": {
            "code": "1101",
            "name": "台泥",
            "operatingRevenue": 124594602,
            "operatingCost": 91003063,
            "grossProfit": 33591539,
            "operatingExpenses": 5410638,
            "operatingProfit": 28180901,
            "nonOperatingIncome": 2363520,
            "preTaxIncome": 30544421,
            "incomeTaxExpense": 7900350,
            "netIncome": 22644071,
            "eps": 4.37
          }
        },
        {
            ...
            ...
        }
      ]
    }
  }
}
```


## getQuarterRevenueList
### Query
```
query($request: GetIncreasingQuarterRevenueInput!) {
  getIncreasingQuarterRevenueList(request: $request) {
    list {
      code
      name
      operatingRevenue
      operatingCost
      grossProfit
      operatingExpenses
      operatingProfit
      nonOperatingIncome
      preTaxIncome
      incomeTaxExpense
      netIncome
      eps
    }
  }
}
```
### Request
```
{
  "request": {
    "compareWith": 1,
    "isEpsPositive": true,
    "isEpsIncreasing": true,
    "epsIncreasingPercent": 10,
    "isGrossProfitIncreasing": true,
    "grossProfitIncreasingPercent": 5
  }
}
```

### Response
```
{
  "data": {
    "getIncreasingQuarterRevenueList": {
      "list": [
        {
          "code": "1229",
          "name": "聯華",
          "operatingRevenue": 5970777,
          "operatingCost": 4474654,
          "grossProfit": 1496123,
          "operatingExpenses": 647522,
          "operatingProfit": 848601,
          "nonOperatingIncome": 1949878,
          "preTaxIncome": 2798479,
          "incomeTaxExpense": 121419,
          "netIncome": 2677060,
          "eps": 2.1
        },
        {
            ...
            ...
        }
      ]
    }
  }
}
```