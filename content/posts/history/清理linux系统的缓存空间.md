---
title: "清理linux系统的缓存空间"
date: 2022-10-09 22:46:27.912000
draft: false
bookComments: false
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---

背景：
jenkins 在2核4G机器上编译vue项目时，经常会把jenkins的进程给down掉，原因是内存不足。

解决方案：

1、添加了2G swap交换内存，在内存不够时，可以使用swap的内存。虽然说性能不好，但是总比没有强。

[如何在contos7上添加swap内存空间](/posts/history/contos7添加swap内存)

2、在编译前，先把缓存中的内存清理出来，留有足够的内存用来编译，编译后再清理一下。
```bash
echo "开始清除缓存"
sync;sync;sync #写入硬盘，防止数据丢失
sleep 10#延迟10秒
echo 3 > /proc/sys/vm/drop_caches
```


其他常用排查服务器整体负载的命令：

1、top 查看整体负载情况
> top

2、查找cpu占用率最高的N个进程
> ps auxw | head -1;ps auxw |sort -rn -k3 |head -11

3、 根据内存使用定位
> ps auxw |sort -rn -k4 |head -11