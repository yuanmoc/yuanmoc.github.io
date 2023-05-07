---
title: "Jvm参数"
date: 2020-07-28 11:02:39.424000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

**调优的目的**

- 减少Minor GC、Major GC、Full GC（在GC的过程中，程序会STW[stop the world]，程序会出现卡顿，减少GC会提升程序的运行流畅和效率）。
- 其中Full GC时间最长，首先要减少Full GC。


**常用的调优工具**

Java内置的VisualVM

![VisualVM](/images/image-0e5fbf79aed34d629402c33631fa12d2.png)

**JVM参数**

|参数|说明|
|--|--|
|-Xms100M|初始化堆空间大小，-XX:InitialHeapSize=100M|
|-Xmx100M|最大堆空间大小，-XX:MaxHeapSize=100M|
|-Xmn20M|年轻代空间大小，-XX:NewSize=20M|
|-Xss512k|设置线程空间大小|
|-XX:PermGen|设置永久代内存初始化大小,jdk1.8开始废弃永久代|
|-XX:MaxPermGen|设置永久代最大值|
|-XX:SurvivorRatio|设置Eden区和Survivor区的空间比例:Eden/S0=Eden/S1 默认为8|
|-XX:NewRatio|设置年老代和年轻代的大小比例,默认值是2|
|-XX:PermSize=256m|永久区空间大小|
|-XX:MaxPermSize=256m|最大永久区空间大小|
|-XX:+UseStringCache|启用缓存常用字符串,默认开启|
|-XX:+UseConcMarkSweepGC|年老代使用cms收集器|
|-XX:UseParNewGC|新生代使用并行收集器|
|-XX:ParallelGCThreads=4|并行线程数量|
|-XX:CMSClassUnloadingEnabled|允许对类元素进行清理|
|-XX:+DisableExplicitGC|禁止显示GC|
|-XX:UseCMSInitiatingOccupancyOnly|表示只有达到阀值的时候用进行cms回收|
|-XX:CMSInitiatingOccupancyFraction=70|设置cms在老年代回收的阀值为70%|
|-verbose:gc|输出虚拟机GC详情|
|-XX:+PrintGCDetails|打印GC详情日志|
|-XX:+PrintGCDateStamps|打印GC耗时|
|-XX:+PrintTenuringDistribution|打印Tenuring年龄信息|
|-XX:+HeapDumpOnOutOfMemoryError|当抛出oom错误时进行HeapDump|
|-XX:HeapDumpPath=/home/admin/logs|指定HeapDump文件的输出路径|
|-XX:+UseSerialGC|串行,Young区和Old区都使用串行,使用复制算法回收,逻辑简单高效,无线程切换开销|
|-XX:+UseParallelGC|并行, Young区:使用Parallel Scavenge回收算法,会产生多个线程并行回收.通过|
|-XX:ParallelGCThreads=n|参数指定线程数,默认是cpu核数;Old区:单线程|
|-XX:+UseParallelOldGC|并行,和UseParallelGC一样,Young区和Old区的垃圾回收都用多线程收集|
|-XX:+UseConcMarkSweepGC|并发、短暂停顿的并发收集。young区：可以使用普通的Parallel垃圾收集算法由参数 -XX:+UseParNewGC来控制;old区:只能使用Concurrent Mark Sweep|
|-XX:+UseG1GC|并行的、并发的和增量式压缩短暂停顿的垃圾收集器。不区分Young区和Old区空间。它把堆空间划分为多个大小相等的区域。当进行垃圾收集时，它会优先收集存活对象比较少的区域，因此叫"Garbage First"|
