---
title: "Jconsole使用"
date: 2021-04-05 17:18:54.161000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
开启JMX管理功能

在JVM启动参数中添加如下参数
```bash
-Djava.rmi.server.hostname=xxx.xxx.xxx.xxx
-Dcom.sun.management.jmxremote.port=9999 
-Dcom.sun.management.jmxremote.ssl=false 
-Dcom.sun.management.jmxremote.authenticate=true 
-Dcom.sun.management.jmxremote.pwd.file=jmxremote.password 
-Dcom.sun.management.jmxremote.access.file=jmxremote.access
```