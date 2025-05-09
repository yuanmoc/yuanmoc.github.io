import {defineUserConfig} from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'

import theme from "./theme.js";
import setFrontmatter from "./util/setFrontmatter.js"
import { dailyListPlugin, dateContainer } from "./util/dailyListPlugin.js"
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics'
import galleryContainer from "./util/galleryContainer.js"
import modifyFrontmatterDate from "./util/modifyFrontmatterDate.js"

export default defineUserConfig({
  bundler: viteBundler({
    viteOptions: {
      server: {
      }
    },
    vuePluginOptions: {},
  }),
  base: "/",

  lang: "zh-CN",
  title: "YUANMOC",
  description: "记录美好生活！",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  // debug: true,

  // 自定义插件，插件会按顺序执行，先执行模板里，再执行自定义
  plugins: [
    setFrontmatter(),
    baiduAnalyticsPlugin({
      id: "1a2e8709a79bd587207c1e48121859d7"
    }),
    modifyFrontmatterDate(),
    // 日常图片容器
    galleryContainer,
    dateContainer,
    // 最后执行
    dailyListPlugin({password: "668800"}),
  ],
});
