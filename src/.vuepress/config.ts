import {defineUserConfig} from "vuepress";

import theme from "./theme.js";
import setFrontmatter from "./util/setFrontmatter.js"
import dailyListPlugin from "./util/dailyListPlugin.js"
import {baiduAnalyticsPlugin} from '@vuepress/plugin-baidu-analytics'
import { markdownContainerPlugin } from "@vuepress/plugin-markdown-container"

export default defineUserConfig({
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
    },
    // 最后执行
    dailyListPlugin(),
    // 日常图片容器
    markdownContainerPlugin({
      type: "gallery",
      validate: (params) => {
        return params.trim() === 'gallery'
      },
      render: (tokens, idx, options, env, self) => {
        const token = tokens[idx];

        // 处理容器开始标签
        if (token.nesting === 1) {
          // 渲染容器内部内容为HTML字符串
          let closeIdx = idx + 1;

          // 遍历直到找到闭合标签
          while (closeIdx < tokens.length && !(tokens[closeIdx].nesting === -1 && tokens[closeIdx].type === 'container_gallery_close')) {
            closeIdx++;
          }

          // 提取并渲染内容区间的token
          const contentTokens = tokens.slice(idx + 1, closeIdx);
          const content = self.render(contentTokens, options, env);

          // 递归隐藏内容
          function hiddenToken(tokensRef, start, end) {
            for (let i = start; i < end; i++) {
              tokensRef[i].hidden = true;

              if (tokensRef[i].children) {
                hiddenToken(tokensRef[i].children, 0, tokensRef[i].children.length)
              }
            }
          }
          hiddenToken(tokens, idx + 1, closeIdx)

          // 提取所有<img>标签
          const imgs = content.match(/<img[^>]*>/g) || [];

          // 每6个图片为一组
          const chunkSize = 6;
          const hasNextPage = imgs.length > chunkSize;
          const pages = [];
          for (let i = 0; i < imgs.length; i += chunkSize) {
            const pageImgs = imgs.slice(i, i + chunkSize);
            let pageImgsLength = pageImgs.length
            if (pageImgsLength < chunkSize) {
              while (pageImgsLength < chunkSize && hasNextPage) {
                pageImgs.push('<img class="placeholder" />')
                pageImgsLength++;
              }
            }

            // 显示页码html
            const pageNumHtml = hasNextPage ? `<div class="page-number">第${pages.length + 1}页</div>` : '';
            pages.push(`
<div class="gallery-page">
${pageImgs.join('')} ${pageNumHtml}
</div>
`);
          }

          // 显示图片总数html
          const imgSumHtml = hasNextPage ? `<div class="gallery-sum">总共${imgs.length}张图片</div>`: '';

          // 组合分页结构并包裹在.gallery容器中
          return `${imgSumHtml}
<div class="gallery-container">
${pages.join('')}`;
        } else {
          // 处理容器结束标签
          return '</div>';
        }
      }
    })
  ],
});
