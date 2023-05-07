---
title: "Sql条件语句"
date: 2020-08-21 19:21:16.590000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## IF表达式

语法：IF(expr1, expr2, expr3)
解释：如果expr1结果为true，则使用expr2值，否则使用expr3值。

使用：
```sql
select id, name, age, IF(sex=1,'男','女') as sex from student 
```

## IFNULL

语法：IFNULL(expr1, expr2)
解释：如果expr1不为空，则输出expr1的值，否则输出expr2的值。

使用：
```sql
select IFNULL(1,0)    --输出1
select IFNULL(NULL,0) --输出0
```

## IF ELSEIF ELSE

语法：
```sql
IF search_condition 
THEN statement_list  
[ELSEIF search_condition THEN]  
    statement_list ...  
[ELSE statement_list]  
END IF 
```

## CASE THEN

语法：
```sql
CASE search_condition
  WHEN expr1 THEN value1
  WHEN expr2 THEN value2
ELSE 
  value3
END
```

使用：
```sql
SELECT id, name, CASE sex
WHEN 1 THEN '男'
WHEN 2 THEN '女' 
ELSE '保密' 
END AS sex
from student
```

测试数据库语句：
```sql
CREATE TABLE `student` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '姓名',
  `age` int(11) DEFAULT NULL COMMENT '年龄',
  `sex` tinyint(1) DEFAULT NULL COMMENT '性别，1男，2女',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';
```