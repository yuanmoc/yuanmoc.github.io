import fs from 'fs'; // 文件模块
import matter from 'gray-matter'; // FrontMatter解析器 https://github.com/jonschlinkert/gray-matter
import jsonToYaml from 'json2yaml'
import chalk from 'chalk' // 命令行打印美化
import os from 'os';
import path from "path";

const excludeDirectory = [
    '.vuepress',
    '@pages',
    '.github',
    '.idea',
    '.git',
    'node_modules',
]


/**
 * 给.md文件设置frontmatter(标题、日期、永久链接等数据)
 */
function setFrontmatter(sourceDir, themeConfig) {
    const { category: isCategory, tag: isTag, defaultText = '默认', extendFrontmatter } = themeConfig
    const files = readFileList(sourceDir) // 读取所有md文件数据

    files.forEach(file => {
        let dataStr = fs.readFileSync(file.filePath, 'utf8');// 读取每个md文件内容

        // fileMatterObj => {content:'剔除frontmatter后的文件内容字符串', data:{<frontmatter对象>}, ...}
        const fileMatterObj = matter(dataStr, {});

        // 已有FrontMatter
        let matterData = fileMatterObj.data;
        let hasChange = false;

        // 主页，不需要处理
        if ( matterData.home === true ) {
            return
        }
        console.log(chalk.blue('start '),"write frontmatter(写入frontmatter)：", file.filePath)

        // 已有FrontMatter，但是没有title、date、permalink、categories、tags数据的
        if (!matterData.hasOwnProperty('title')) { // 标题
            matterData.title = file.name;
            hasChange = true;
        }

        if (!matterData.hasOwnProperty('date')) { // 日期
            const stat = fs.statSync(file.filePath);
            matterData.date = dateFormat(getBirthtime(stat));
            hasChange = true;
        }

        if (!matterData.hasOwnProperty('permalink')) { // 永久链接
            let prefix = '/other/'
            if (file.filePath.indexOf('/docs/') > 1) {
                prefix = "/docs/"
            } else if (file.filePath.indexOf('/posts/') > 1) {
                prefix = "/posts/"
            }
            matterData.permalink = getPermalink(prefix);
            hasChange = true;
        }

        if (!matterData.hasOwnProperty('pageComponent') && matterData.article !== false) { // 是文章页才添加分类和标签
            if (isCategory !== false && !matterData.hasOwnProperty('category')) { // 分类
                matterData.category = getCategories(file, defaultText)
                hasChange = true;
            }
            if (isTag !== false && !matterData.hasOwnProperty('tag')) { // 标签
                matterData.tag = [defaultText];
                hasChange = true;
            }
        }

        // 扩展自动生成frontmatter的字段
        if (type(extendFrontmatter) === 'object') {
            Object.keys(extendFrontmatter).forEach(keyName => {
                if (!matterData.hasOwnProperty(keyName)) {
                    matterData[keyName] = extendFrontmatter[keyName]
                    hasChange = true;
                }
            })
        }

        if (hasChange) {
            if (matterData.date && type(matterData.date) === 'date') {
                matterData.date = repairDate(matterData.date) // 修复时间格式
            }
            const newData = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + fileMatterObj.content;
            fs.writeFileSync(file.filePath, newData); // 写入
            console.log(chalk.blue('tip ') + chalk.green(`write frontmatter(写入frontmatter)：${file.filePath} `))
        }


    })
}

// 获取分类数据
function getCategories(file, categoryText) {
    let categories = []
    // 不在_posts文件夹
    let filePathArr = file.filePath.split(path.sep) // path.sep用于兼容不同系统下的路径斜杠
    filePathArr.pop() // 去除文件名称

    const ind = filePathArr.indexOf('posts')!== -1? filePathArr.indexOf('posts') : filePathArr.indexOf('docs');
    // 默认分类
    if (ind === -1 || ind + 1 >= filePathArr.length) {
        categories = [categoryText];
    } else {
        categories = filePathArr.slice(ind + 1);
    }
    return categories
}


function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        let filePath = path.join(dir, item);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !excludeDirectory.includes(item)) {
            readFileList(path.join(dir, item), filesList);  //递归读取文件
        } else {
            // if (path.basename(dir) !== 'docs') { // 过滤docs目录级下的文件
            //     return
            // }

            const filename = path.basename(filePath)
            const fileNameArr = filename.split('.')
            const firstDotIndex = filename.indexOf('.');
            const lastDotIndex = filename.lastIndexOf('.');

            let name = null, type = null;
            if (fileNameArr.length === 2) { // 没有序号的文件
                name = fileNameArr[0]
                type = fileNameArr[1]
            } else if (fileNameArr.length >= 3) { // 有序号的文件(或文件名中间有'.')
                name = filename.substring(firstDotIndex + 1, lastDotIndex)
                type = filename.substring(lastDotIndex + 1)
            }

            if (type === 'md') { // 过滤非md文件
                filesList.push({
                    name,
                    filePath
                });
            }

        }
    });
    return filesList;
}



// 获取文件创建时间
function getBirthtime(stat) {
    // 在一些系统下无法获取birthtime属性的正确时间，使用atime代替
    return stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime
}

// 定义永久链接数据
function getPermalink(prefix = '/pages/') {
    return `${prefix + (Math.random() + Math.random()).toString(16).slice(2, 8)}/`
}


// 类型判断
function type(o) {
    const s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

// 修复date时区格式的问题
function repairDate(date) {
    date = new Date(date);
    return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}

// 日期的格式
function dateFormat(date) {
    return `${date.getFullYear()}-${zero(date.getMonth() + 1)}-${zero(date.getDate())} ${zero(date.getHours())}:${zero(date.getMinutes())}:${zero(date.getSeconds())}`
}

// 小于10补0
function zero (d) {
    return d.toString().padStart(2, '0')
}


export default setFrontmatter;