---
title: "Python使用execjs调用js方法"
date: 2022-11-12 14:54:30.900000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
背景：
在使用python抓包时，要使用到js的相关解密方法，使用python写相关解密方法实现会有一些问题，有时js的加密方法是混淆过的，无法直译过来，所以直接调用js的方法是最方便的。

下面是execjs使用的相关记录：

1、先在本地安装node环境，因为在使用的时候会调用到。
```bash
brew install node
```

2、编写方法调用js

安装要使用到的crypto-js模块
```bash
npm install crypto-js
```

编写方法调用

```python
import execjs

    node = execjs.get()
    ctx = node.compile("""
            const CryptoJS = require('crypto-js');  //引用AES源码js
            function decrypt(data) {
                const SECRET_KEY = 'pengzhihui'
                const encryptedHexStr = CryptoJS.enc.Base64.parse(data);
                const str = CryptoJS.enc.Utf8.stringify(encryptedHexStr);

                const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY);

                const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
                return JSON.parse(decryptedStr)
            }
        """)
    res = ctx.call('decrypt', detail)
```


