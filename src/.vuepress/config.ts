import { defineUserConfig } from "vuepress";

import theme from "./theme.js";
import setFrontmatter from "./util/setFrontmatter.js"

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "YUANMOC",
  description: "记录美好生活！",

  theme,

  // 在构建前执行自动生成 front matter 的函数
  onWatched: (app, ctx) => {
    setFrontmatter(app.options.source, app.options)
  },
  // 编译时生成
  // onGenerated: (app) => {
  //   setFrontmatter(app.options.source, app.options)
  // }

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  // debug: true,

});
