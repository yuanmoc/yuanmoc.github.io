import { markdownContainerPlugin } from "@vuepress/plugin-markdown-container"

// 日常图片容器
const galleryContainer = markdownContainerPlugin({
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
                        pageImgs.push('<img class="placeholder" no-view/>')
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

export default galleryContainer