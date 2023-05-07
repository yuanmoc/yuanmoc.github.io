---
title: "Leetcode242.有效的字母异位词"
date: 2020-07-14 18:02:24.265000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
题目
```txt
给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

示例 1:

输入: s = "anagram", t = "nagaram"
输出: true
示例 2:

输入: s = "rat", t = "car"
输出: false
说明:
你可以假设字符串只包含小写字母。

进阶:
如果输入字符串包含 unicode 字符怎么办？你能否调整你的解法来应对这种情况？
```
针对这种情况，我们可以使用字母的特性，只有26个字母。
1、我们可以建立一个26位大小的数组作为计数器。
2、遍历S，把其中的字母放入到计数器中。
3、遍历T，把对应的字母从计数器中减少，并判断是否合理。

代码
```java
public boolean isAnagram(String s, String t) {
    if(s.length() != t.length()) {
        return false;
    }
    int[] counter = new int[26];
    for (int i = 0; i < s.length(); i++) {
        counter[s.charAt(i) - 'a']++;
    }
    for (int i = 0; i < t.length(); i++) {
        if (--counter[t.charAt(i) - 'a'] < 0) {
            return false;
        }
    }
    return true;
}
```

针对如果我们在不确定字符的范围时，我们可以使用Hash来替换数组，去除大小个数的限定。

这是使用HashMap进行改造：
```java
public boolean isAnagram(String s, String t) {
    if(s.length() != t.length()) {
        return false;
    }
    Map<Character,Integer> counter = new HashMap<>();
    for (int i = 0; i < s.length(); i++) {
        Integer mun = counter.getOrDefault(s.charAt(i), 0);
        counter.put(s.charAt(i), mun + 1);
    }
    for (int i = 0; i < t.length(); i++) {
        Integer mun = counter.getOrDefault(t.charAt(i), 0);
        counter.put(t.charAt(i), mun - 1);
        if ( mun < 0) {
            return false;
        }
    }
    return true;
}
```