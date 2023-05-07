---
title: "Multipass虚拟机使用"
date: 2023-04-29 10:53:24.873000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---

使用brew安装
```bash
brew install --cask multipass
```

可选的安装:(图形界面)
```bash
brew install --cask microsoft-remote-desktop
```

创建虚拟机
```bash
multipass launch --name vm01 --mem 2G --disk 40G --cpus 2
```
--name, -n, 指出虚拟机实例的名称, 默认为primary

--mem, -m, 虚拟机所用的物理内存, 默认为1GB

--disk, -d, 磁盘大小, 默认为5GB

--cpus, -c, 使用的CPU核数, 默认为1

impish, 使用的Ubuntu版本, 采用multipass find可以找出所有支持的版本, 最新版为22.04.


图形界面

```bash
有一些开发环境不得不用图形界面, 这里也采用了官网推荐的一个方法4, 通过迂回的方式安装并显示图形界面. 因为需要安装软件包, 这里需要先进行镜像的配置, 主要的方法就参考清华镜像了5, 这里需要注意: 如果你用的也是arm架构的话, 镜像源需要采用的是ubuntu-port

sudo apt update
sudo apt install ubuntu-desktop xrdp
```

设置密码
```bash
sudo passwd root
```

然后使用 microsoft-remote-desktop 连接虚拟机

使用虚拟机
```bash
multipass exec vm01 -- lsb_release -a
multipass shell vm01
```

常用命令
```bash
# 查看镜像
multipass find
# 查看虚拟机
multipass list
# 启动实例
multipass start vm01
# 停止实例
multipass stop vm01
# 删除实例（删除后，还会存在）
multipass delete vm01
# 释放实例（彻底删除）
multipass purge vm01
```
