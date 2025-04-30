import { createPage } from 'vuepress/core'
import { dateSorter } from "@vuepress/helper";
import {toBase64} from '@jsonjoy.com/base64';

const dailyListPlugin = (options) => (app) => ({
    name: 'vuepress-plugin-daily',

    async onPrepared() {
        // 获取页面内容，分成小组
        const articles = app.pages
            .filter(page => page.path.startsWith('/daily/') && page.path !== '/daily/')
            .map(page => ({
                date: page.frontmatter.date,
                content: page.contentRendered, // markdown 解码后抱着内容
            }))
            .sort((a,b) =>
                dateSorter(a.date, b.date)
            ).reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / 10);

                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = []; // 新建一个子数组
                }

                resultArray[chunkIndex].push(item);

                return resultArray;
            }, []);


        // 文章分组大小
        await app.writeTemp('daily-num.js', `export const dailyNum = ${articles.length}`);

         // 加密保存文章信息
         articles.forEach(async (group, groupIndex) => {
            const groupString = JSON.stringify(group);
            const groupUint8Array = new Uint8Array(Buffer.from(groupString, 'utf8'));
            await app.writeTemp(`daily-${groupIndex}.js`, `export const dailyData = '${toBase64(new Uint8Array(groupUint8Array))}'`);
        })
    },

        // 初始化之后，所有的页面已经加载完毕
    async onInitialized(app) {

        // 创建页面
        const dailyPage = await createPage(app, {
            path: '/daily/',
            // 设置 frontmatter
            frontmatter: {
                sidebar: false
            },
            // 设置 markdown 内容
            content: `<DailyInfo />`,
        })
        // 把它添加到 `app.pages`
        app.pages.push(dailyPage)
    },
})

export default dailyListPlugin

