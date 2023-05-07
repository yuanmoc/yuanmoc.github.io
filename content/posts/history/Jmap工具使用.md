---
title: "Jmap工具使用"
date: 2021-04-05 15:40:47.175000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## 作用：

jmap是JDK中提供的一个用来监视进程运行中的jvm物理内存的占用情况的工具。该进程内存内，所有对象的情况，例如产生了哪些对象，对象数量。当系统崩溃时，jmap 可以从core文件或进程中获得内存的具体匹配情况，包括Heap size, Perm size等。

## 影响：

使用jmap会影响线上运行的应用，所以尽量不要在线上执行此命令。如果想dump堆信息，可以使用gcore命令，比jmap -dump快。


## Jmap的使用

1、查看堆信息
> `jmap -heap <PID>`

可以通过jps命令来查看正在运行的java应用进程。
```bash
$ jps
7576 jar
9962 Jps
```
然后查看对应堆信息
```bash
$ jmap -heap 7576
Attaching to process ID 7576, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.212-b10

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2116026368 (2018.0MB)
   NewSize                  = 44564480 (42.5MB)
   MaxNewSize               = 705167360 (672.5MB)
   OldSize                  = 89653248 (85.5MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 116391936 (111.0MB)
   used     = 65823008 (62.773712158203125MB)
   free     = 50568928 (48.226287841796875MB)
   56.552893836219035% used
From Space:
   capacity = 11534336 (11.0MB)
   used     = 0 (0.0MB)
   free     = 11534336 (11.0MB)
   0.0% used
To Space:
   capacity = 11534336 (11.0MB)
   used     = 0 (0.0MB)
   free     = 11534336 (11.0MB)
   0.0% used
PS Old Generation
   capacity = 84410368 (80.5MB)
   used     = 13827064 (13.186515808105469MB)
   free     = 70583304 (67.31348419189453MB)
   16.380764979013005% used

16171 interned Strings occupying 1390008 bytes.

```


2、查看堆内存中类占用信息
> `jmap -histo:live <PID> | grep [过滤类]`

```bash
$ jmap -histo:live 7576 | grep com.example.
 194:           100           2400  com.example.jetcache.jetcache.model.UserVO
1254:             1             56  com.example.jetcache.jetcache.service.InvalidUserService$$EnhancerBySpringCGLIB$$b2e448c
1255:             1             56  com.example.jetcache.jetcache.service.UserService$$EnhancerBySpringCGLIB$$cec2f015
1664:             1             32  com.example.jetcache.jetcache.JetcacheApplication$$EnhancerBySpringCGLIB$$745909b5
2016:             1             24  com.example.jetcache.jetcache.controller.UserController
2017:             1             24  com.example.jetcache.jetcache.service.InvalidUserService
2018:             1             24  com.example.jetcache.jetcache.service.UserService
2370:             1             16  com.example.jetcache.jetcache.dao.UserDao
2371:             1             16  com.example.jetcache.jetcache.service.UserService$$EnhancerBySpringCGLIB$$cec2f015$$FastClassBySpringCGLIB$$4bd67238
2372:             1             16  com.example.jetcache.jetcache.service.UserService$$FastClassBySpringCGLIB$$764105c0

```


3、生成并导出堆信息，live是先触发gc，再统计导出信息
> `jmap -dump:live,format=b,file=d:\\d.bin <PID>`

```bash
$ jmap -dump:live,format=b,file=d:\d.bin 7576
Dumping heap to D:\d.bin ...
Heap dump file created
```

