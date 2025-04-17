import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { text: "文章", link: "/article/" },
  { text: "分类", link: "/category/" },
  { text: "标签", link: "/tag/" },
  { text: "归档", link: "/timeline/" },
  {
    text: "文档",
    icon: "pen-to-square",
    prefix: "/docs/",
    children: [
    //   {
    //     text: "苹果",
    //     icon: "pen-to-square",
    //     prefix: "apple/",
    //     children: [
    //       { text: "苹果1", icon: "pen-to-square", link: "1" },
    //       { text: "苹果2", icon: "pen-to-square", link: "2" },
    //       "3",
    //       "4",
    //     ],
    //   },
      { text: "介绍", icon: "pen-to-square", link: "intro" },
    ],
  },

]);
