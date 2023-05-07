---
title: "Git提交规范"
date: 2023-04-11 11:31:04.201000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
# Git提交规范
格式：
```text
<type>(<scope>): <subject> [<ISSUE_ID>]

<body>

<footer>
```
例子：
```text
feat(user): Add user registration [777]

Use Tencent cloud verification code to verify mobile phone 
and add user registration function

https://github.com/one-user/a-project/issues/777
```

# 以下是字段说明

## type [必须]
用于说明 commit 的类别，只允许使用下面几种标识：

feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
perf：优化
test：增加测试
chore：构建过程或辅助工具的变动
revert：撤销上一次的 commit

## scope [必须]
用于说明修改的范围，基本上有有以下几种情形：

all：表示大范围的修改
loation：表示小范围的修改
module：表示修改了某个模块 例如：feat(user): add user login

## subject [必须]
用于表示本次提交修改的简要说明，尽量简短

## ISSUE_ID [可选]
添加在 git issues 中需求或者 bug 
修复对应的 issues 记录ID

## body [可选]
body中就是 subject的详细说明

## footer [可选]
可以写备注，填写相关的需求管理 issues id