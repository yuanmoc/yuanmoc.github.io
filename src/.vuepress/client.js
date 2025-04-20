import { defineClientConfig } from "vuepress/client";
import TestDisplay from "./components/TestDisplay.vue";


export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
        // https://theme-hope.vuejs.press/zh/guide/component/global.html
        // 引入组件，在md中可以直接 <TestDisplay /> 调用
        app.component("TestDisplay", TestDisplay);
    },
});