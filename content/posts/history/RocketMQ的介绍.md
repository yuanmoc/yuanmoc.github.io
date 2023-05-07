---
title: "Rocket Mq的介绍"
date: 2021-04-11 00:10:12.110000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
RocketMQ 架构图
![image.png](/images/image-bb86482048c94e20ad0bf9d904a0ada0.png)

有四大部分：NameServer，Broker，Producer，Consumer。

## NameServer

NameServer主要包括两个主要功能：

1、管理brokers：broker服务器启动时会注册到NameServer上，并且两者之间保持心跳监测机制，以此来保证NameServer知道broker的存活状态；

2、路由信息管理：每一台NameServer都存有全部的broker集群信息和生产者/消费者客户端的请求信息；

## Broker
Broker的四大作用：

1、请求分发：是client的入口，接收来自生产者消费者的请求
2、client管理：管理客户（产品/消费者）并维护消费者的主题订阅。
3、数据存储：提供简单的api来查询磁盘上的临时数据
4、高可用：主从节点间同步数据保证高可用

## Producer

Producer启动时，需要指定NameServer的地址，从NameServer集群中选一台建立长连接。如果该NameServer宕机，会自动连其他NameServer。直到有可用的NameServer为止。生产者每30秒从NameServer获取Topic跟Broker的映射关系，更新到本地内存中。再跟Topic涉及的所有Broker建立长连接，每隔30秒发一次心跳。Broker每隔10s中扫描所有存活的连接，如果Broker在2分钟内没有收到心跳数据，则关闭与Producer的连接。

## Consumer

消费客户端的连接方式和生产者类似。

## 其他概念
1、 Topic
一个应用尽可能用一个Topic，消息子类型用tags来标识，tags可以由应用自由设置。只有发送消息设置了tags，消费方在订阅消息时，才可以利用tags 在broker做消息过滤。

2、 key
每个消息在业务层面的唯一标识码，要设置到 keys 字段，方便将来定位消息丢失问题。服务器会为每个消息创建索引(哈希索引)，应用可以通过 topic，key来查询这条消息内容，以及消息被谁消费。由于是哈希索引，请务必保证key 尽可能唯一，这样可以避免潜在的哈希冲突。

3、Message：消息，要传输的信息。

4、Message Queue：消息队列

5、send
send消息方法，只要不抛异常，就代表发送成功。但是发送成功会有多个状态，在sendResult里定义。

SEND_OK：消息发送成功

FLUSH_DISK_TIMEOUT：消息发送成功，但是服务器刷盘超时，消息已经进入服务器队列，只有此时服务器宕机，消息才会丢失

FLUSH_SLAVE_TIMEOUT：消息发送成功，但是服务器同步到Slave时超时，消息已经进入服务器队列，只有此时服务器宕机，消息才会丢失

SLAVE_NOT_AVAILABLE：消息发送成功，但是此时slave不可用，消息已经进入服务器队列，只有此时服务器宕机，消息才会丢失
