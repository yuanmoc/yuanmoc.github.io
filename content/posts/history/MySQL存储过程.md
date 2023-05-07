---
title: "My Sql存储过程"
date: 2020-07-18 11:31:40.665000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
存储过程是为了完成特定功能的SQL语句集，经编译创建并保存在数据库中，用户可通过指定存储过程的名字并给定参数来调用执行。

## 创建存储过程基本格式
```sql
CREATE
    [DEFINER = { user | CURRENT_USER }]
　PROCEDURE sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body
 
proc_parameter:
    [ IN | OUT | INOUT ] param_name type
 
characteristic:
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
 
routine_body:
　　Valid SQL routine statement
 
[begin_label:] BEGIN
　　[statement_list]
　　　　……
END [end_label]
```


## 使用user表来做测试
```sql
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` int(5) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

## 创建一个基本的存储过程
```sql
create PROCEDURE select_user(IN user_id INTEGER) 
BEGIN 
	select * from user where id = user_id; --分号不可少
END; --分号不可少
```
- `select_user`是创建一个名称为select_user的存储过程。
- `IN user_id INTEGER`是设置一个user_id的参数，类型为整数。
- 过程体格式：以`BEGIN`开始，`END`结束，可嵌套创建。

为了避免存储过程中分号(";")结束语句，我们使用分隔符告诉mysql解释器,该段命令是否已经结束了。
```sql
delimiter $
[数据库语句/存储过程语句]
$
delimiter ; --用完记得修改回来
```


## 执行一个存储过程
```sql
call select_user(5);
```
- `select_user`是要执行存储过程的名称
- `5`是参数

## 删除存储过程
```sql
DROP PROCEDURE IF EXISTS porcedureName;
```

## 存储过程变量IN、OUT、INTOUT的使用

创建一个带有IN,OUT,INOUT参数的存储过程，IN输入用户的ID user_id,INOUT是值入一个临时变量，加一后回调，OUT是输出对应用户的年龄。
```sql
create procedure paramcter_test( 
    in user_id int, 
    inout tmp int, 
    out user_age int
) 
BEGIN 
    select age INTO user_age from user where id = user_id; 
    set tmp = tmp + 1;
END; 
```
- IN：是输入到存储过程中。
- INOUT：是可以输入到存储过程，也可以从存储过程中接收数值。
- OUT：是接收存储过程的值到外部变量中。
- `age INTO user_age`是将age的值设置到变量user_age中。

测试并执行存储过程
```sql
// 设置三个参数
set @user_id=5;
set @tmp=1;
set @user_age=0;

//执行存储过程
call paramcter_test(@user_id,@tmp,@user_age);

//查看参数结果
select @user_id;
select @tmp;
select @user_age;
```

## MySQL存储过程的控制语句

### 变量作用域
设置局部变量,创建一个局部变量x1，大小varchar(1)，默认值是outer。
set是为变量赋值。
```sql
begin
  declare x1 varchar(5) default 'outer'; 
  set x1='yes';
end;
```

### 条件语句

1、f-then-else 语句
```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc2(IN parameter int)  
     -> begin 
     -> declare var int;  
     -> set var=parameter+1;  
     -> if var=0 then 
     -> insert into t values(17);  
     -> end if;  
     -> if parameter=0 then 
     -> update t set s1=s1+1;  
     -> else 
     -> update t set s1=s1+2;  
     -> end if;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

2、case语句
```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc3 (in parameter int)  
     -> begin 
     -> declare var int;  
     -> set var=parameter+1;  
     -> case var  
     -> when 0 then   
     -> insert into t values(17);  
     -> when 1 then   
     -> insert into t values(18);  
     -> else   
     -> insert into t values(19);  
     -> end case;  
     -> end;  
     -> //  
mysql > DELIMITER ; 
```

3、while ···· end while
```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc4()  
     -> begin 
     -> declare var int;  
     -> set var=0;  
     -> while var<6 do  
     -> insert into t values(var);  
     -> set var=var+1;  
     -> end while;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

4、repeat···· end repeat
```sql
repeat
    --循环体
until 循环条件  
end repeat;
```

```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc5 ()  
     -> begin   
     -> declare v int;  
     -> set v=0;  
     -> repeat  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> until v>=5  
     -> end repeat;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

5、loop ·····endloop
```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc6 ()  
     -> begin 
     -> declare v int;  
     -> set v=0;  
     -> LOOP_LABLE:loop  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> if v >=5 then 
     -> leave LOOP_LABLE;  
     -> end if;  
     -> end loop;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

6、ITERATE迭代
```sql
mysql > DELIMITER //  
mysql > CREATE PROCEDURE proc10 ()  
     -> begin 
     -> declare v int;  
     -> set v=0;  
     -> LOOP_LABLE:loop  
     -> if v=3 then   
     -> set v=v+1;  
     -> ITERATE LOOP_LABLE;  
     -> end if;  
     -> insert into t values(v);  
     -> set v=v+1;  
     -> if v>=5 then 
     -> leave LOOP_LABLE;  
     -> end if;  
     -> end loop;  
     -> end;  
     -> //  
mysql > DELIMITER ;
```

END!