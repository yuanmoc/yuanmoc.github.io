import { defineUserConfig } from "vuepress";

import theme from "./theme.js";
import setFrontmatter from "./util/setFrontmatter.js"
import dailyListPlugin from "./util/dailyListPlugin.js"
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics'

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "YUANMOC",
  description: "记录美好生活！",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  // debug: true,

  // 自定义插件
  plugins: [
    dailyListPlugin(),
    setFrontmatter(),
    baiduAnalyticsPlugin({
      id: "1a2e8709a79bd587207c1e48121859d7"
    }),
  ],
});
