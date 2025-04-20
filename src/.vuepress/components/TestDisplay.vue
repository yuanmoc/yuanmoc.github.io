<template>
  <h2>测试测试</h2>
  <div>
    <p>当前页面的语言是: {{ langvalue }}</p>
  </div>
</template>

<script setup>
import { usePageLang,usePageFrontmatter } from 'vuepress/client';

const getDate = (input) => {
  if (input) {
    if (typeof input === 'number') {
      return new Date(input);
    }
    console.log("input", input)
    let date = Date.parse(input.toString());
    console.log("Date.parse", date)
    if (!Number.isNaN(date))
      // markdown的date时间转换时到UTC时间了，减8个小时转换成中国时区时间
      date = date - 8 * 60 * 60 * 1000;
      return new Date(date);
  }
  return null;
};

const lang = usePageLang();
const langvalue = lang.value
// const formatter =
//         new Intl.DateTimeFormat(lang.value, {
//           dateStyle: "short",
//         })
//
// const pageFrontmatter = usePageFrontmatter()
// console.log(pageFrontmatter)
// // "2025-04-19T16:03:04.000Z"
//
// const { ["date"]: timestamp } = pageFrontmatter.value;
// console.log( timestamp)
// console.log(getDate(timestamp))
//
// const datestr = formatter.format(getDate(timestamp));
// console.log(datestr)
// 2025/4/20
</script>