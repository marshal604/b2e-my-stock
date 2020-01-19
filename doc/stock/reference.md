## getCollectorEquityList
### Query
```
query getCollectorEquityList($request: GetCollectorEquityListInput!) {
  getCollectorEquityList(request: $request) {
    list {
      date,
      data {
        level
        people
        stock
        percent
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
    "startTime": "2019/06/04"
  }
}
```

### Response
```
{
  "data": {
    "getCollectorEquityList": {
      "list": [
        {
          "date": "20200117",
          "data": [
            {
              "level": "1-999",
              "people": 73907,
              "stock": 13423811,
              "percent": 0.24
            },
            {
              "level": "1,000-5,000",
              "people": 81202,
              "stock": 169345860,
              "percent": 3.09
            },
            {
              "level": "5,001-10,000",
              "people": 17865,
              "stock": 124646028,
              "percent": 2.28
            },
            {
              "level": "10,001-15,000",
              "people": 7997,
              "stock": 95414022,
              "percent": 1.74
            },
            {
              "level": "15,001-20,000",
              "people": 3365,
              "stock": 58566329,
              "percent": 1.07
            },
            {
              "level": "20,001-30,000",
              "people": 3957,
              "stock": 95526512,
              "percent": 1.74
            },
            {
              "level": "30,001-40,000",
              "people": 1898,
              "stock": 65430293,
              "percent": 1.19
            },
            {
              "level": "40,001-50,000",
              "people": 1118,
              "stock": 50177308,
              "percent": 0.91
            },
            {
              "level": "50,001-100,000",
              "people": 2180,
              "stock": 149057996,
              "percent": 2.72
            },
            {
              "level": "100,001-200,000",
              "people": 1206,
              "stock": 162844763,
              "percent": 2.97
            },
            {
              "level": "200,001-400,000",
              "people": 571,
              "stock": 158460348,
              "percent": 2.89
            },
            {
              "level": "400,001-600,000",
              "people": 197,
              "stock": 96061085,
              "percent": 1.75
            },
            {
              "level": "600,001-800,000",
              "people": 113,
              "stock": 78351156,
              "percent": 1.43
            },
            {
              "level": "800,001-1,000,000",
              "people": 64,
              "stock": 57148346,
              "percent": 1.04
            },
            {
              "level": "1,000,001以上",
              "people": 409,
              "stock": 4091165347,
              "percent": 74.85
            },
            {
              "level": "合　計",
              "people": 196049,
              "stock": 5465619204,
              "percent": 100
            }
          ]
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

## getCollectorEquityChangeList
### Query
```
query getCollectorEquityChangeList($request: GetCollectorEquityChangeListInput!) {
  getCollectorEquityChangeList(request: $request) {
    list {
      code
      name
      levelChangeList
    }
  }
}
```
### Request
```
{
  "request": {
    "changeList": [
      "Have100Up",
      "Have200Up",
      "Have400Up",
      "Have600Up",
      "Have800Up",
      "Have1000Up"
    ]
  }
}
```

### Response
```
{
  "data": {
    "getCollectorEquityChangeList": {
      "list": [
        {
          "code": "1101",
          "name": "台泥",
          "levelChangeList": [
            "100,001-200,000",
            "200,001-400,000",
            "400,001-600,000",
            "600,001-800,000",
            "800,001-1,000,000",
            "1,000,001以上"
          ]
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