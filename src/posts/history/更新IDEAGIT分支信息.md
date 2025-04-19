---
title: 更新 ID Eagit分支信息
date: 2022-01-21 10:41:51
permalink: /posts/15bc73/
category: 
  - history
tag: 
  - 默认
---
IDEA 常常出现本地显示的分支信息与远程的分支信息不一致，使用以下命令更新远程分支信息到本地缓存中来。

```bash
git remote update origin --prune
```