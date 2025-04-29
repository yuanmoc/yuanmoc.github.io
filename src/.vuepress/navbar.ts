import { navbar } from "vuepress-theme-hope";

// icon: https://icon-sets.iconify.design/
export default navbar([
  "/",
  { text: "文章", link: "/article/" , icon: "material-symbols:post-rounded"},
  { text: "分类", link: "/category/", icon: "tabler:category-filled" },
  { text: "标签", link: "/tag/", icon: "material-symbols:tag-rounded" },
  { text: "归档", link: "/timeline/", icon: "gravity-ui:list-timeline" },
  { text: "secret", link: "/posts/eb0620.html", icon: "fontisto:user-secret" },

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
