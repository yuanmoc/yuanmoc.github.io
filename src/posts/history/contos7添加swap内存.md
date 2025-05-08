---
title: Contos7添加swap内存
date: 2022-10-09 21:56:13
permalink: /posts/402981.html
tag: 
  - Map
---
Swap介绍：

Linux 将物理内存分为内存段，叫做页面。交换是指内存页面被复制到预先设定好的硬盘空间(叫做交换空间)的过程，目的是释放对于页面的内存。物理内存和交换空间的总大小是可用的虚拟内存的总量。

Swap即：交换分区，类似于Windows的虚拟内存，但物理内存不足时，把部分硬盘空间当成虚拟内存使用，从而解决了物理内存容量不足。

1、查看内在
```bash
 free -hm
```

1.添加swap交换分区空间

使用dd命令创建swap交换分区文件`/dev/mapper/swap-mem`，大小为2G：

```bash
  dd if=/dev/zero of=/home/swap-mem bs=1024 count=2048000
```

格式化swap分区：

```bash
 mkswap /home/swap-mem
```

设置交换分区：

```bash
 mkswap -f /home/swap-mem
```

给权限

```bash
 chmod 600 /home/swap-mem
```

激活swap分区：

```bash
 swapon /home/swap-mem
```

设为开机自动启用：

```bash
 vim /etc/fstab
```

在该文件底部添加如下内容：

```bash
 /home/swap-mem swap swap defaults 0 0
```

2.删除swap交换分区

停止正在使用的swap分区：

```bash
 swapoff /home/swap-mem
```

删除swap分区文件：

```bash
 rm /home/swap-mem
```

删除或注释在`/etc/fstab`文件中的以下开机自动挂载内容：

```bash
 /home/swap-mem swap swap defaults 0 0
```

完结！