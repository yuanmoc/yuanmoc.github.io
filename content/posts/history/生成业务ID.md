---
title: "生成业务 ID"
date: 2021-05-13 16:13:14.427000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

生成唯一的业务ID号

```java
public class UniqueStringGenerator {
    private static final int MAX_COUNTER = 10000;
    private volatile static int COUNTER = 0;
    private static final String PAD_STR = "0";
    private static DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyMMddHHmmssSSS");

    public static synchronized String generatorId() {
        if (COUNTER > MAX_COUNTER) {
            COUNTER = 0;
        }
        String uniqueNumber = getNowString() + getNumberString();
        COUNTER++;
        return uniqueNumber;
    }

    private static String getNowString() {
        LocalDateTime ldt = LocalDateTime.now();
        return ldt.format(FORMATTER);
    }

    private static String getNumberString() {
        return StringUtils.leftPad(String.valueOf(COUNTER), String.valueOf(MAX_COUNTER).length(), PAD_STR);
    }
}
```