---
title: "Rocket Mq延时消息的使用和延时级别的配置"
date: 2021-04-13 17:14:47.343000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
# RocketMQ延时消息的使用和延时级别的配置

开源框架的没有__STARTDELIVERTIME配置
阿里企业级没有messageDelayLevel配置

```
消息tag
__TAG

消息key
__KEY

消息ID
__MSGID

重试次数
__RECONSUMETIMES

设置消息的定时投递时间（绝对时间),最大延迟时间为7天.
__STARTDELIVERTIME

设置消息的延迟级别，其中，level=0 级表示不延时
_DELAYTIMEVELVEL

在服务器端（rocketmq-broker端）的属性配置文件中加入以下行：
messageDelayLevel=1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h 
这个配置项配置了从1级开始各级延时的时间，如1表示延时1s，2表示延时5s，14表示延时10m，可以修改这个指定级别的延时时间； 
```

