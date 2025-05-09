import { defineClientConfig } from "vuepress/client";
import DailyInfo from "./components/DailyInfo.vue";
import DailyPassword from "./components/DailyPassword.vue"
import "vuepress-theme-hope/presets/bounce-icon.scss"

export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
        // https://theme-hope.vuejs.press/zh/guide/component/global.html
        // 引入组件，在md中可以直接 <DailyInfo /> 调用
        app.component("DailyInfo", DailyInfo);
        app.component("DailyPassword", DailyPassword)
    },
});