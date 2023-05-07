---
title: "Oom堆栈信息分析"
date: 2021-08-22 16:49:50.370000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
先把一台有问题的服务从微服务摘下来，其他服务重启，保证线上运行正常，然后在这台服务上进行分析原因。

1、打印GC日志
```bash
JAVA_OPTS="$JAVA_OPTS -server -Xms4096m -Xmx4096m -Xss1024k -XX:PermSize=256m -XX:MaxPermSize=256m -XX:+PrintGCDetails -Xloggc:/usr/local/gc.log -XX:+PrintGCTimeStamps"
```
查看GC情况（Minor GC、Major GC、Full GC）
```bash
tail -n 50 gc.log
```

2、查看CPU占用情况
```bash
jps
top -H -p [pid]
```

3、把堆栈信息导出来
```bash
jstack pid > jst.txt

jmap -dump:format=b,file=jdump.bin pid
-dump: 生成Java堆转储快照
-heap：显示Java堆详细信息
-histo：显示堆中对象统计信息

同时也可以使用 
jmap -histo <PID> | grep [过滤类] 
查看一下有没有哪个类对象过多，如果有，可能就是这里的问题了。
```

分析堆栈信息：Memory Analyzer tools:AMT

overview -> See stacktrace，可以看见栈信息

然后点击details，查看这个GC不掉的内存对象是谁，找到自己写的内存对象。

然后去分析代码，为什么会出现这种情况。
