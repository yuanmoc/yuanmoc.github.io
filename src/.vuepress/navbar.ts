import { navbar } from "vuepress-theme-hope";

// icon: https://icon-sets.iconify.design/
export default navbar([
  "/",
  { text: "文章", link: "/article/" , icon: "/assets/icon/material-symbols--post-rounded.svg"},
  { text: "标签", link: "/tag/", icon: "/assets/icon/material-symbols--tag-rounded.svg" },
  // { text: "归档", link: "/timeline/", icon: "/assets/icon/gravity-ui--list-timeline.svg" },
  // { text: "secret", link: "/secret/to.html", icon: "/assets/icon/la--user-secret.svg" },
  { text: "随笔", link: "/daily/", icon: "/assets/icon/la--user-secret.svg" },

  // {
  //   text: "文档",
  //   icon: "f7:doc-on-doc-fill",
  //   prefix: "/docs/",
  //   children: [
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
    //   { text: "介绍", icon: "f7:doc-fill", link: "intro" },
    // ],
  // },

]);
