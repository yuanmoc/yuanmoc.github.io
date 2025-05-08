---
title: Jmeter追加cookie
date: 2022-05-10 20:02:50
permalink: /posts/ad9e92.html
tag: 
  - JMeter
---

使用 BeanShell 进行对线程cookie进行追加。

```java
import org.apache.jmeter.protocol.http.control.CookieManager;
import org.apache.jmeter.protocol.http.control.Cookie;

CookieManager manager = ctx.getCurrentSampler().getCookieManager();
Cookie cookie = new Cookie("GSMSessionSID", "GSMSessionSID", "qinsilk.com", "/gsm", true, Long.MAX_VALUE);
manager.add(cookie);
```