---
title: "Esik分词 Pingyin分词的使用"
date: 2023-04-21 16:29:39.736000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
## 1、在线联网安装

插件的版本与ES的版本要一致

```text
# 安装IK分词器拼音插件(Github官网)
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v6.7.0/elasticsearch-analysis-pinyin-6.7.0.zip

# 安装IK分词器插件(Github官网)
elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.7.0/elasticsearch-analysis-ik-v6.7.0.zip
```



## **2、离线安装**



```text
# 安装IK分词器拼音插件
mkdir $ES_PATH/pinyin
cd $ES_PATH/pinyin
# 下载
wget install https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v6.7.0/elasticsearch-analysis-pinyin-6.7.0.zip
# 解压
unzip elasticsearch-analysis-pinyin-6.7.0.zip -d ./


# 安装IK分词器插件
mkdir $ES_PATH/ik
cd $ES_PATH/ik
# 下载
wget install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.7.0/elasticsearch-analysis-ik-v6.7.0.zip
# 解压
unzip elasticsearch-analysis-ik-v6.7.0.zip -d ./
```



## **3、测试**

测试pingyin分词

```text
# Kibana方式
GET _analyze
{
  "text":"刘德华",
  "analyzer":"pinyin"
}

# 返回拼音表示安装完成
{
  "tokens" : [
    {
      "token" : "liu",
      "start_offset" : 0,
      "end_offset" : 0,
      "type" : "word",
      "position" : 0
    },
    {
      "token" : "de",
      "start_offset" : 0,
      "end_offset" : 0,
      "type" : "word",
      "position" : 1
    },
    {
      "token" : "hua",
      "start_offset" : 0,
      "end_offset" : 0,
      "type" : "word",
      "position" : 2
    },
    {
      "token" : "ldh",
      "start_offset" : 0,
      "end_offset" : 0,
      "type" : "word",
      "position" : 2
    }
  ]
}

```



测试ik ik_max_word分词，还有 ik_smart 的

```text
GET _analyze
{
  "analyzer": "ik_max_word",
  "text": ["中文分词语"]
}

# 返回分词表示安装完成
{
  "tokens" : [
    {
      "token" : "中文",
      "start_offset" : 0,
      "end_offset" : 2,
      "type" : "CN_WORD",
      "position" : 0
    },
    {
      "token" : "分词",
      "start_offset" : 2,
      "end_offset" : 4,
      "type" : "CN_WORD",
      "position" : 1
    },
    {
      "token" : "词语",
      "start_offset" : 3,
      "end_offset" : 5,
      "type" : "CN_WORD",
      "position" : 2
    }
  ]
}
```



 下面我们将拼音以及分词都结合起来进行搜索，首先我们创建一个索引，这里表示我们分词采用自定义的方式进行分词我们分别将ik_smart以及ik_max_word都对pinyin进行了整合，并且我们的主分片3个，每个分片一个副本集



```text
PUT /test_pinyin
{
  "settings": {
        "analysis": {
            "analyzer": {
                "ik_smart_pinyin": {
                    "type": "custom",
                    "tokenizer": "ik_smart",
                    "filter": ["my_pinyin", "word_delimiter"]
                },
                "ik_max_word_pinyin": {
                    "type": "custom",
                    "tokenizer": "ik_max_word",
                    "filter": ["my_pinyin", "word_delimiter"]
                }
            },
            "filter": {
                "my_pinyin": {
                    "type" : "pinyin",
                    "keep_separate_first_letter" : true,
                    "keep_full_pinyin" : true,
                    "keep_original" : true,
                    "first_letter": "prefix",
                    "limit_first_letter_length" : 16,
                    "lowercase" : true,
                    "remove_duplicated_term" : true 
                }
            }
        },
        "number_of_shards": 3,
        "number_of_replicas": 1
  }
}
```



然后我们创建一个_mapping模板他的类型是_doc，用于设置字段指定使用哪个分词器，手动创建mapping

```text
PUT /test_pinyin/_doc/_mapping
{
    "properties": {
        "content": {
            "type": "text",
            "analyzer": "ik_max_word_pinyin",
            "search_analyzer": "ik_smart_pinyin",
            "fields": {
                "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                }
            }
        },
        "age": {
            "type": "long"
        }
    }
}
```



  然后创建之后我们来导入几条条数据



```text
POST /test_pinyin/test/
{
  "content":"小米手机有点东西",
  "age":18
}


```



然后我们就能开始愉快的查询了,首先我们不分词直接中文搜索

```text
# 搜索小米查询出结果
POST /test_pinyin/_doc/_search
{
  "query":{
    "match":{
      "content":"小米"
    }
  }
}

# 搜索xiaomi查询出结果
POST /test_pinyin/_doc/_search
{
  "query":{
    "match":{
      "content":"xiaomi"
    }
  }
}
```

注意：查询字符串过长可能导致ES服务器挂机，所以限制查询字符串长度，一般为40个长度就可以了。
