import {createPage} from 'vuepress/core'
import {dateSorter} from "@vuepress/helper";
import {markdownContainerPlugin} from "@vuepress/plugin-markdown-container";
import {ref} from "vue";
import {encrypt, randomBase64, generatorKey, md5} from "./cryptoUtil.js";

// 加密的密码列表
const passList = ref({})

export const dailyListPlugin = (options) => (app) => ({
    name: 'vuepress-daily-plugin',

    // 初始化之后，所有的页面已经加载完毕
    // onInitialized 先执行，onPrepared再执行
    // onPrepared 会生成路由信息
    async onInitialized(app) {

        const { password } = options;
        // 默认的解密密码
        passList.value['default'] = randomBase64();

        // 获取页面内容，分成小组
        const articles = app.pages
            .filter(page => page.path.startsWith('/daily/') && page.path !== '/daily/')
            .reduce((resultArray, item, index) => {
                return handlerPage(item, password).concat(resultArray || [])
            }, [])
            .sort((a,b) =>
                dateSorter(a.date, b.date)
            ).reduce((resultArray, item, index) => {
                // 比例放大，让旧的数据多存在一个js
                const chunkIndex = Math.floor(Math.sqrt( 8 * (index / 10)) / 2);

                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = []; // 新建一个子数组
                }

                resultArray[chunkIndex].push(item);

                return resultArray;
            }, []);

        // 文章分组大小
        await app.writeTemp('daily.js', `export const dailyNum = ${articles.length};`);
        articles.forEach(async (group, groupIndex) => {
            const groupString = JSON.stringify(group);
            await app.writeTemp(`${md5(groupIndex)}.js`, `export const dailyData = '${groupString}'`);
        })

        // 不需要再生成html和js页面了，移除
        app.pages = app.pages.filter(page => !page.path.startsWith('/daily/'))

        // 创建页面
        const dailyPage = await createPage(app, {
            path: '/daily/',
            // 设置 frontmatter
            frontmatter: {
                sidebar: false,
                comment: false
            },
            // 设置 markdown 内容
            content: `<DailyInfo :encryptedKeyObj="encryptedKeyObj"/>
<script setup>
const encryptedKeyObj = ${JSON.stringify(passList.value)};
</script>
`,
        })
        // 把它添加到 `app.pages`
        app.pages.push(dailyPage)
    },
})

function handlerPage(page, password) {
    let result = []
    const regex = /daily\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})(\s+password(:\s+\w*)?)?([\s\S]*?)(?=daily|$)/g;
    let match;
    let count = 0
    while ((match = regex.exec(page.contentRendered))!== null) {
        // 1 时间
        // 2 密码 password: 123
        // 3 密码 : 123
        // 4 内容
        count++
        let key = passList.value['default'];
        if (!!match[2]) {
            if (!!match[3]) {
                key = match[3].replace(":", "").trim();
                if (!key) {
                    key = password
                }
            } else {
                key = password
            }
        }
        let htmlContent = match[4].trim()
        const encryptedKey = generatorKey(key)
        passList.value[encryptedKey] = ''
        // 加密内容
        htmlContent = encrypt(htmlContent, key)
        result.push({
            id: formatDate(match[1]),
            date: match[1],
            password: !!match[2],
            content: htmlContent,
            encryptedKey: encryptedKey
        });
    }
    //  如果不能分隔，直接整个显示
    if (count === 0) {
        result.push({
            id: formatDate(page.frontmatter.date),
            date: page.frontmatter.date,
            password: false,
            content: encrypt(page.contentRendered, passList.value['default']),
            encryptedKey: generatorKey(passList.value['default'])
        });
    }
    return result;
}

// 格式化时间成id
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const year = date.getFullYear() % 100;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        return year+month+day+hour+minute+second;
    } catch (e) {
        return ""
    }
}

// 日常容器
export const dateContainer = markdownContainerPlugin({
    type: "daily",
    validate: (params) => {
        return params.trim().match(/^daily\s+(.*)$/);
    },
    render: (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        // 处理容器开始标签
        if (token.nesting === 1) {
            return `${token.info.trim()}<div>`
        } else {
            return `</div>`
        }
    },
    marker: "="
})


