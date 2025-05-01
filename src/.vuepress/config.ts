import {defineUserConfig} from "vuepress";

import theme from "./theme.js";
import setFrontmatter from "./util/setFrontmatter.js"
import dailyListPlugin from "./util/dailyListPlugin.js"
import {baiduAnalyticsPlugin} from '@vuepress/plugin-baidu-analytics'

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
    {
      // 时间默认转 UTC 时间，实际多了8个小时，现在进行减少
      name: 'modify-frontmatter-date-plugin',
      onInitialized: (app) => {
        app.pages.forEach((page) => {
          // 示例：统一修改最后更新时间
          const date = page.frontmatter.date
          if (date) {
            // 将字符串转换为 Date 对象
            const originalDate = new Date(date);
            // 直接在 UTC 时间上减小时
            originalDate.setUTCHours(originalDate.getUTCHours() - 8);
            // 转换为 UTC 字符串
            page.frontmatter.date = originalDate.toISOString();
          }
        })
      }
    }
  ],
});
