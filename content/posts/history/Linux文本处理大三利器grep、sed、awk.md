---
title: "Linux文本处理大三利器grep、sed、awk"
date: 2020-08-24 20:24:58.801000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## grep

用于查找文件里符合条件的字符串。

1、grep [查找内容，支持正则]  [文件，支持正则]
2、cat [文件] | grep [查找内容，支持正则]


## sed

主要用来自动编辑一个或多个文件、简化对文件的反复操作、编写转换程序等。

```bash
sed [-hnV] [-e <script>] [-f<script文件>] [文本文件]
```

**参数说明**：

- -e\<script\>或--expression=\<script\> 以选项中指定的script来处理输入的文本文件。

- -f\<script文件\>或--file=\<script文件\> 以选项中指定的script文件来处理输入的文本文件。

- -h或--help 显示帮助。

- -n或--quiet或--silent 仅显示script处理后的结果。

- -V或--version 显示版本信息。

  

**动作说明**：

- a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)
- c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行
- d ：删除。
- i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)
- p ：打印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行
- s ：取代，可以直接进行取代的工作哩！通常这个 s 的动作可以搭配正规表示法！例如 1,20s/old/new/g 

1、以行为单位的新增/删除

```bash
# 以下只修改了输出的文件流，没有修改原文件，可以使用sed -i -e '2d' test.txt这种方式修改原文件

nl test.txt | sed -e '2,5d' # 删除第二到第五行
nl test.txt | sed -e '2d' # 删除第二行
nl test.txt | sed -e '3,$d' # 删除3到最后一行

nl test.txt | sed -e '2a drink team' # 在第二行后面添加
nl test.txt | sed -e '2a drink team' # 在第二行前面添加
```

2、以行为单位的替换与显示

```bash
nl test.txt | sed '2,5c replace 2-5' # 替换2-5行内容成replace 2-5 

nl test.txt | sed -n '5,7p'  # 打印5-7行信息，-n或--quiet或--silent 仅显示script处理后的结果。
```

3、数据的搜寻并显示

```bash
nl test.txt | sed -n '/content/p' # 查找含有content的行并显示
```

4、数据的搜寻并删除

```bash
nl test.txt | sed '/content/d' # 查找含有content的行并删除
```

5、数据的搜寻并执行命令

```bash
# 执行后面花括号中的一组命令，每个命令之间用分号分隔

nl test.txt | sed -n '/9/{s/9/这个是9/g;p}' # 查找9并把9换成‘这个是9’，然后打印。
```

6、数据的搜寻并替换

```bash
sed 's/要被取代的字串/新的字串/g' # 替换文本
```



7、多点编辑

```bash 
sed -i -e '2i 添加内容' -e '3,4d' test.txt # 添加内容并删除3-4行
```



8、直接修改文件内容(危险动作)

```bash
# 主要是使用 -i 

sed -i -e '2d' test.txt # 直接删除文件第二行
```



## awk

是一种处理文本文件的语言，是一个强大的文本分析工具。

语法：

```bash
awk [选项参数] 'script' var=value file(s)
awk [选项参数] -f scriptfile var=value file(s)
```



用法

1、正常使用

```bash
awk '{[pattern] action}' {filenames}   # 行匹配语句 awk '' 只能用单引号
```



```bash
awk '{print $1,$4}' test.txt # 每行按空格或TAB分割，输出文本中的1、4项
awk '{printf "%-8s %-10s", $1, $4}' # 格式化输出printf
```

2、指定分隔符

```bash
awk -F '分隔字符，支持正则' # -F相当于内置变量FS, 指定分割字符
```



```bash
awk -F ',' '{print $1 $2}' test.txt # 以,分隔字符串如：123,45，$1是123，$2是45
```

3、设置变量

```bash
awk -v # 设置变量
```



```bash
awk -va=1 -vb=s '{print $1,$1+a,$1b}' test.txt
```

