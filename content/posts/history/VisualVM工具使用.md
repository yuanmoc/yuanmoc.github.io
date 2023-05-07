---
title: "Visual Vm工具使用"
date: 2021-04-05 16:00:48.450000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## 作用
jvisualVM是JDK自带的Java性能分析工具，在JDK的bin目录下，文件名就叫jvisualVM.exe。

jvisualvm可以监控本地、远程的java进程，实时查看进程的cpu、堆、线程等参数，对java进程生成dump文件，并对dump文件进行分析。

## 插件安装
插件安装：https://visualvm.github.io/pluginscenters.html

下载
![image.png](/images/image-18e84dfa361c4b2bb5b3df8a17c3b684.png)

下载要安装的插件
![image.png](/images/image-d1a84c7bdb76432ba98ab5288a53551e.png)

打开visualVM工具，在工具->插件->已下载，选择下载好的插件安装。

## 导入jmap导出的dump

通过 jmap -dump:live,format=b,file=d:/b.bin 7576 导出的dump文件，可以装载到jVisualVM中进行分析。

点击文件->载入，选择我们导出好的dump文件即可。

![image.png](/images/image-5edc213f90994f84b7d716a4733f3c31.png)