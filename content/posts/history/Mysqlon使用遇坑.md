---
title: "Mysqlon使用遇坑"
date: 2021-06-03 09:57:46.371000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
本来想查询分组下id最大的一条数据，语句如下：

```sql
select *
from order_delivery where id in (
   select max(id) id from order_delivery where cid >= _IN_CUR_ID and cid < _IN_CUR_ID + _IN_STEP and update_time > '2021-03-01' group by cid, delivery_type
);
```

结果发现，on下的子语句不走索引了。数据太多，结果跑不动了。

改了一下，先排序再分组查询，这样避免了on子查询的使用，成功走上了索引。

```sql
select *
from
  (select * from  order_delivery where cid >= _IN_CUR_ID and cid < _IN_CUR_ID + _IN_STEP and update_time > '2021-03-01' order by id desc) t
 group by  cid, delivery_type;
```

