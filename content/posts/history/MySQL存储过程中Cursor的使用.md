---
title: "My Sql存储过程中 Cursor的使用"
date: 2023-04-26 15:53:23.176000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
```sql

BEGIN
	DECLARE _done  INT DEFAULT false; 
	DECLARE _name,_pwd VARCHAR(50);
    -- 定义游标，并将sql结果集赋值到游标中
	DECLARE my_cursor CURSOR FOR (SELECT  userName,pwd from  sys_user_menu WHERE menuId=22);
	-- 声明当游标遍历完后将标志变量置成某个值
	DECLARE CONTINUE HANDLER FOR NOT found SET _done=true;
	-- 打开游标
	OPEN my_cursor;
		-- 声明开始循环
		my_loop:LOOP   
		-- 将游标中的值赋值给变量
		FETCH my_cursor INTO _name,_pwd;
		-- 判断是否结束循环，一定要放到FETCH之后，如果放到fetch之前，
		-- 先判断done，这个时候done的值还是之前的循环的值，因此就会导致循环一次
		IF _done THEN
	        LEAVE my_loop; 
		END IF;
		-- SELECT  _doctor;
		INSERT INTO sys_user (userName,pwd) VALUES (_name,_pwd);
		-- 结束循环   
	END LOOP my_loop;     
	-- 关闭游标
	CLOSE my_cursor;
END


```