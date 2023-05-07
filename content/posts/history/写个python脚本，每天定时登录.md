---
title: "写个python脚本，每天定时登录"
date: 2021-09-13 21:35:28.258000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
写一个脚本，每天登录获取积分。

使用的语法是python3，系统是centos7。


1、安装http请求需要的requests模块，直接使用pip3来安装
```python
pip install requests
```
也可以到官网去下载源文件来安装
https://pypi.org/project/requests/

2、编写python脚本，文件名称：lmsLogin.py

```python
#!/bin/python3

import re
import requests
from urllib import parse

users = [
    {'user': 'xxx', 'pwd': 'xxx'},
    {'user': 'xxx', 'pwd': 'xxx'}
]

for user in users:
    res = requests.get(url = 'https://lms.qinsilk.com/login')
    pattern = re.compile(r'<meta content="(.*)?" name="csrf-token"', re.M|re.I)
    token = pattern.findall(res.text, 0)[0]
    print(token)

    cookie = requests.utils.dict_from_cookiejar(res.cookies)
    print (cookie)


    url = r'https://lms.qinsilk.com/login_check'
    headers = {
        'origin': 'https://lms.qinsilk.com',
        'content-type': 'application/x-www-form-urlencoded',
        'User-Agent': r'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
        'Referer': r'https://lms.qinsilk.com/login',
        'Connection': 'keep-alive'
    }
    datas = {
        '_username': user['user'],
        'isMayday': 0,
        '_password': user['pwd'],
        '_remember_me': 'on',
        '_target_path': '',
        '_csrf_token': token
    }
    data = parse.urlencode(datas).encode('utf-8')
    print(data)
    postRes = requests.post(url = url, data = datas, headers = headers, cookies = cookie)
    print(postRes)

```

3、设置定时任务每天执行

```bash
vim /etc/crontab

#输入以下内容,每天6点登录
0  6  *  * * root python3 /root/lmsLogin/lmsLogin.py >> /root/lmsLogin/index.log

# 重启crond
systemctl resart crond
```
