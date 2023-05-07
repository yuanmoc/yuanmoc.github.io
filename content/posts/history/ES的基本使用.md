---
title: "Es的基本使用"
date: 2023-04-19 16:47:01.858000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
## 创建索引
创建文档 
```text
POST /{索引库名}
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
      "properties": {
        "color": {
          "type": "keyword"
        },
        "make": {
          "type": "keyword"
        }
      }
  }
}
```

修改映射
```text
PUT /{索引名称}/_mapping
{
  "properties":{
    "name":{
      "type":"text"
    },
    "age":{
      "type":"integer"
    }
  }
}
```

查看映射
GET /{索引库名}/_mapping

### 插入
添加文档
```text
POST /{索引库名}/_doc
{
  "name":"李四",
  "age":29,
  "address":"天津"
}
```

批量处理
针对不同的操作类型，第二行的请求体是不一样的
（1）index 和 create 第二行是source数据体
（2）delete 没有第二行
（3）update 第二行可以是partial doc，upsert或者是script
```text
POST /{索引库名}/_bulk
{"create":{"_index":"索引名", "_id":"文档"}} // 动作
{"field1":"value1"} //请求体
```

删除文档 :   DELETE /{索引库名}/_doc/文档id 

全量修改  :   PUT /{索引库名}/_doc/文档id { json文档 }

增量修改  :   POST /{索引库名}/_update/文档id { "doc": {字段}}


## 查询
查询文档 ：GET /{索引库名}/_doc/文档id

```text
GET /{索引库名}/_search
{
  "query":{
    "match_all": {}
  }
}
```

查询文档：GET /{索引库名}/_search
```text
{
    "query" : {
        "match" : {
            "last_name" : "Smith"
        }
    },
    "sort": [
        { "date":   "desc" },
        { "_score": "desc" }
    ]
}


GET /{索引库名}/_search
{
    "query": {
        "bool": {
            "must": [
                {
                    "match": {
                        "gender": "M"
                    }
                },
                {
                    "match": {
                        "address": "mill"
                    }
                }
            ],
            "must_not": [
                {
                    "match": {
                        "age": "18"
                    }
                }
            ],
            "should": [
                {
                    "match": {
                        "lastname": "Wallace"
                    }
                }
            ]
        }
    }
}

bool  组合多个条件
must 且
must not  不在
should  数组 满足一个
term    满足一个
```

```text
GET /{索引库名}/_search
{
  "query": {
    "bool": {
      "must": [
        {"term": {"city": "上海" }}
      ],
      "should": [
        {"term": {"brand": "皇冠假日" }},
        {"term": {"brand": "华美达" }}
      ],
      "must_not": [
        { "range": { "price": { "lte": 500 } }}
      ],
      "filter": [
        { "range": {"score": { "gte": 45 } }}
      ]
    }
  }
}
```

```text
找到姓氏为“Smith”的员工，但是我们只想得到年龄大于30岁的员工
GET  /{索引库名}/_search
{
    "query" : {
        "filtered" : {
            "filter" : {
                "range" : {
                    "age" : { "gt" : 30 } <1>
                }
            },
            "query" : {
                "match" : {
                    "last_name" : "smith" <2>
                }
            }
        }
    }
}
```

## 聚合
```text
GET /{索引名称}/_doc/_search
{
    "size" : 0,  // 查询条数，这里设置为0，因为我们不关心搜索到的数据，只关心聚合结果，提高效率
    "aggs" : { 
        "popular_colors" : {  // 给这次聚合起一个名字，任意。
            "terms" : {  // 划分桶的方式，这里是根据词条划分
              "field" : "color"
            }
        }
    }
}

// 返回

{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": { // 查询的数据列表
    "total": 8,
    "max_score": 0,
    "hits": []
  },
  "aggregations": {
    "popular_colors": {  // 自己定义的查询聚合
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [  // 聚合数据
        {
          "key": "red",
          "doc_count": 4
        },
        {
          "key": "blue",
          "doc_count": 2
        },
        {
          "key": "green",
          "doc_count": 2
        }
      ]
    }
  }
}
```

```text
GET /{索引名称}/_doc/_search
{
    "size" : 0,
    "aggs" : { 
        "popular_colors" : { 
            "terms" : { 
              "field" : "color"
            },
            "aggs":{
                "avg_price": { 
                   "avg": {
                      "field": "price" 
                   }
                }
            }
        }
    }
}

// 返回

{
  "aggregations": {
    "popular_colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "red",
          "doc_count": 4,
          "avg_price": {
            "value": 32500
          }
        },
        {
          "key": "blue",
          "doc_count": 2,
          "avg_price": {
            "value": 20000
          }
        },
        {
          "key": "green",
          "doc_count": 2,
          "avg_price": {
            "value": 21000
          }
        }
      ]
    }
  }
}
```

