---
title: "My Batis打印日志"
date: 2021-06-02 14:14:36.256000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
在Mybatis 的配置文件中添加：

```xml
<settings>
    <!-- 打印查询语句 -->
    <setting name="logImpl" value="STDOUT_LOGGING" />
</settings>

```

同时可以配合IDEA插件 MyBatis Log Plugin 一起使用。
