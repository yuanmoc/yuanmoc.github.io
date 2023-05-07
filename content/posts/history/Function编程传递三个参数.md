---
title: "Function编程传递三个参数"
date: 2022-11-11 10:04:21.545000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
# Function 编程传递三个参数

java 内置的Function 类有两个参数Function和三个参数BiFunction的，但是有时就需要传递更多的参数，才能达到我们使用的场景。以下记录两个传递多少参数的用法。



比如计算三个数相加

```java
a + b + c
```



## 自己编写一个@FunctionalInterface，支持接收多个参数



```java
@FunctionalInterface
public interface ThreeParamFunction<T, U, K, R> {

    R apply(T t, U u, K k);
}

ThreeParamFunction<Integer, Integer, Integer, Integer> threeParamFunction = (a,b,c) -> {
  return a + b + c;
}

Integer add = threeParamFunction.apply(1,2,3); // 6
```



## 使用多个@FunctionalInterface来拼接



```java
BiFunction <Integer, Integer, Function<Integer, Integer>> multiAdder = (a, b) -> c -> {
  return a + b + c;
};

Integer add = multiAdder.apply(1,2).apply(3); // 6
```



