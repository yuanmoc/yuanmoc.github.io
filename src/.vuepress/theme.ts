import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  hostname: "https://yuanmoc.cn",

  author: {
    name: "yuanmoc",
    url: "#",
  },

  logo: "/logo.png",

  // 配置github图标
  // repo: "vuepress-theme-hope/vuepress-theme-hope",
  // docsDir: "src",

  // 导航栏
  navbar,

  // 侧边栏
  sidebar,

  // 页脚
  footer: "<a style='color: #282c34' href='https://beian.miit.gov.cn/'>粤ICP备20065374号</a>",
  displayFooter: true,

  // 博客相关
  blog: {
    description: "开发者",
    intro: "#", // 个人介绍页面
    medias: {
      // 社交地址
      // GitHub: "https://example.com",
      // GitHub: {
      //   icon: "https://example.com/logo.svg",
      //   link: "https://example.com",
      // },
    },
  },

  // 加密配置
  encrypt: {
    config: {
      "/docs/": {
        hint: "本人可见",
        password: "6666",
      },
    },
  },

  // 多语言配置
  // metaLocales: {
  //   editLink: "在 GitHub 上编辑此页",
  // },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  // hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    markmap: true,

    // 取消注释它们如果你需要 TeX 支持
    // math: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {

    blog: {
      // 过滤只要posts文件夹的内容
      filter: (page, localePath) => {
        // 非 posts 页面，不进行sitemap索引
        if (!page.path.startsWith('/posts/')) {
          page.frontmatter.sitemap = false
          return false;
        } else {
          return true;
        }
      }
    },

    comment: { // https://giscus.app/zh-CN
      provider: "Giscus",
      repo: 'yuanmoc/blogtalks',
      repoId: 'R_kgDOJfRS1A',
      category: "General",
      categoryId: "DIC_kwDOJfRS1M4CpMn0",
      mapping: "og:title",
      strict: "0",
      reactionsEnabled: "1",
      emitMetadata: "0",
      inputPosition: "bottom",
      theme: "light",
      lang: "zh-CN",
      hideComments: false // 全局隐藏评论，默认 false
    },

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      prefix: "fa6-solid:",
    },

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
