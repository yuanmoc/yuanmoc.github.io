---
title: "使用js解码 Gb18030编码的 Base64字符串"
date: 2021-10-14 15:04:08.436000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
背景：后端使用GB18030字节编码加密成Base64后，在前端解码。

使用工具类进行解码
https://github.com/inexorabletash/text-encoding

1、先生成Uint8 字节buffer
```js
    var binary_string = window.atob(base64Cmd);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    buffer = bytes.buffer;
```

2、再使用Uint8 字节buffer生成对应的中文编码字符串
```js
    var str = new TextDecoder('gb18030').decode(buffer);
```