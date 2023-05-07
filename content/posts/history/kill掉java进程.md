---
title: "Kill掉java进程"
date: 2021-05-11 14:58:11.388000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
开发时有可能会出现端口被占用，或者异常能出时，重启，端口会被占用的情况。
这里需要kill无用的进程。

在windows系统下：

```bash
# 查询端口进程的PID
netstat -ano| findstr 8080
# 也可以使用java工具jps查看java应用进程
jps

# kill掉进程
taskkill /pid [pid] /f
```

在Linux系统下：
```bash
jps

kill [pid]
```

