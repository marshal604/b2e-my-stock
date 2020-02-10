## getCurrentStockInfo
### Query
```
query($request: StockInfoInput!) {
  getCurrentStockInfo(request: $request) {
    date
    transactionVolume
    transactionPrice
    openPrice
    higherPrice
    lowerPrice
    closePrice
    priceSpreadWithHigherAndLower
    transactionCount
  }
}
```
### Request
```
{
  "request": {
    "code": "1101",
    "startTime": "Tue Feb 11 2020 00:00:00 GMT+0800"
  }
}
```

### Response
```
{
  "data": {
    "getCurrentStockInfo": {
      "date": "109/02/10",
      "transactionVolume": 12820414,
      "transactionPrice": 541670664,
      "openPrice": 42,
      "higherPrice": 42.6,
      "lowerPrice": 41.7,
      "closePrice": 42.4,
      "priceSpreadWithHigherAndLower": -0.1,
      "transactionCount": 4073
    }
  }
}
```

## getSpecificDateStockInfo
### Query
```
query($request: StockInfoInput!) {
  getSpecificDateStockInfo(request: $request) {
    date
    transactionVolume
    transactionPrice
    openPrice
    higherPrice
    lowerPrice
    closePrice
    priceSpreadWithHigherAndLower
    transactionCount
  }
}
```
### Request
```
{
  "request": {
    "code": "1101",
    "startTime": "Mon Feb 03 2020 00:00:00 GMT+0800"
  }
}
```

### Response
```
{
  "data": {
    "getSpecificDateStockInfo": {
      "date": "109/02/03",
      "transactionVolume": 23001298,
      "transactionPrice": 942583933,
      "openPrice": 40.5,
      "higherPrice": 41.65,
      "lowerPrice": 40.1,
      "closePrice": 41.55,
      "priceSpreadWithHigherAndLower": -0.5,
      "transactionCount": 8088
    }
  }
}
```


## getStockInfoList
### Query
```
query($request: StockInfoInput!) {
  getStockInfoList(request: $request) {
    list {
      date
      data {
        date
        transactionVolume
        transactionPrice
        openPrice
        higherPrice
        lowerPrice
        closePrice
        priceSpreadWithHigherAndLower
        transactionCount
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
    "startTime": "Fri Jan 03 2020 00:00:00 GMT+0800"
  }
}
```

### Response
```
{
  "data": {
    "getStockInfoList": {
      "list": [
        {
          "date": "202001",
          "data": [
            {
              "date": "109/01/02",
              "transactionVolume": 18470566,
              "transactionPrice": 813465904,
              "openPrice": 43.8,
              "higherPrice": 44.15,
              "lowerPrice": 43.8,
              "closePrice": 44.1,
              "priceSpreadWithHigherAndLower": null,
              "transactionCount": 6251
            },
            {
                ...
            },
            {
              "date": "109/02/10",
              "transactionVolume": 12820414,
              "transactionPrice": 541670664,
              "openPrice": 42,
              "higherPrice": 42.6,
              "lowerPrice": 41.7,
              "closePrice": 42.4,
              "priceSpreadWithHigherAndLower": -0.1,
              "transactionCount": 4073
            }
          ]
        }
      ]
    }
  }
}
```
