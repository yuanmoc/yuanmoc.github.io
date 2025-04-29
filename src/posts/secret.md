---
icon: fontisto:user-secret
title: secret
date: 2025-04-18 11:40:44
permalink: /posts/eb0620.html
comment: true
category: 
  - 默认
tag: 
  - 默认
---

# secret页

::: center
自用跳转中间页面，没有进行sitemap！
:::

:::center
<span style="cursor: pointer;" @click="linkToMy1">跳转个人日常！</span>
:::

:::center
<span style="cursor: pointer;" @click="linkToMy2">跳转个人文档！</span>
:::

<script setup>
function linkToMy1() {
    console.log("要点上面⛽️！");
}
function linkToMy2() {
    console.log("要点旁边👆！");
}
</script>