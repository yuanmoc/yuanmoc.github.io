const modifyFrontmatterDate = (options) => (app) => ({
    name: 'modify-frontmatter-date-plugin',
    onInitialized: (app) => {
        app.pages.forEach((page) => {
            // 示例：统一修改最后更新时间
            const date = page.frontmatter.date
            if (date) {
                // 将字符串转换为 Date 对象
                const originalDate = new Date(date);
                // 直接在 UTC 时间上减小时
                originalDate.setUTCHours(originalDate.getUTCHours() - 8);
                // 转换为 UTC 字符串
                page.frontmatter.date = originalDate.toISOString();
            }
        })
    }
});

export default modifyFrontmatterDate