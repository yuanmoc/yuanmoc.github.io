---
title: "更新 ID Eagit分支信息"
date: 2022-01-21 10:41:51.413000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
IDEA 常常出现本地显示的分支信息与远程的分支信息不一致，使用以下命令更新远程分支信息到本地缓存中来。

```base
git remote update origin --prune
```