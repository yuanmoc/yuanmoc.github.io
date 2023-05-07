---
title: "使用hugo搭建博客"
weight: 1
draft: false
bookComments: true
date: 2023-05-07T19:56:31+08:00
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---

# 在 MAC M1 PRO 上安装hugo并搭建博客

## 安装hugo
(如果是其他机器，请按照官网安装教程[点击直达地址](https://gohugo.io/installation/))
```bash
brew install hugo
```

## 查看版本号
```bash
hugo version
```

## 创建站点
```bash
hugo new site myblog
```

目录结构
```txt
hugo-book
├── archetypes                      内容模版目录
│   └── default.md                 模版文件
├── config.toml                     配置文件(也可以是config.yaml)
├── content                         内容目录
├── data                            数据目录
├── layouts                         网站模版目录
├── static                          静态文件目录
└── themes                          主题目录
```

## 添加模板
这里使用的是hugo-book，可以在官网查找合适的模板[点击直达](https://themes.gohugo.io/)
```bash
git clone https://github.com/alex-shpak/hugo-book.git themes/hugo-book
```

把默认模板的模板内容复制出来并运行测试
```bash
cp themes/hugo-book/exampleSite/* ./
# 删除其他国际化内容，就留一个中文
rm -rf content content.bn content.ru content.zh
mv content.en content
# 测试成功后，可以把content下面的目录删除，写自己的内容
```

## 修改配置
这里使用了config.yaml配置文件，其他的删除,如：config.toml
```bash
# 就使用中文，把 languages 这块修改成以下配置
defaultContentLanguage: "zh"
languages:
  zh:
    languageName: Chinese
    contentDir: content
    weight: 1

# 发布使用 github pages 的 /docs ，生成的静态文件目录修改成 /docs
# 添加以下配置
publishDir: docs

# baseURL 修改成你配置的地址，如果是github pages 刚修改成 <github-name>.github.io

# title 网站的标题


```

## 运行hugo
```bash
hugo server
```
访问 [http://localhost:1313](http://localhost:1313)


## 创建文章
```bash
hugo new post/first.md
```

头部有Front Matter（前置元数据）参数
```md
---
title: "使用hugo搭建博客"
weight: 1
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---
```

> title：指定页面或文章的标题。  
> weight：用于控制页面或文章的排序顺序。  
> draft：指定页面或文章是否为草稿状态。  
> bookFlatSection：指示页面是否应为扁平目录结构。  
> bookToc：指示是否应自动生成页面的目录结构。  
> bookHidden：指示页面是否应在目录结构中隐藏。  
> bookCollapseSection：指示目录结构中的部分是否折叠。  
> bookComments：指示页面是否允许评论。  
> bookSearchExclude：指示页面是否应排除在搜索结果之外。



## 部署

在Github上新建仓库 xxx.github.io

一定是 xxx.github.io，xxx 为你的 Github 用户名

用 hugo 生成网页，托管到 GitHub 仓库

```bash
hugo -D # 会编译草稿内容
或者
hugo
```

将 myblog 目录 push 到刚创建仓库的 main 分支
```bash
git init
git add .
git commit -m "message"
git remote add origin https://github.com/xxx/xxx.github.io.git
git push -u origin main
```

在你仓库 xxx.github.io 下，Settings->Pages->Branch
把/(root) 修改成 /docs 保存即可。

然后就可以访问 xxx.github.io 了。

到此部署完成✅。

## 添加评论功能

使用 https://utteranc.es/ 来做评论功能

1、找到comments.html或者在文章内容下面添加以下内容
```html
{{ if .Site.Params.utteranc.enable }}
<script src="https://utteranc.es/client.js"
        repo="{{ .Site.Params.utteranc.repo }}"
        issue-term="{{ .Site.Params.utteranc.issueTerm }}"
        theme="{{ .Site.Params.utteranc.theme }}"
        crossorigin="anonymous"
        async>
</script>
{{ end }}
```
2、创建一个公开的github仓库在存储评论  

3、安装utterances  
就安装到自己刚才创建的仓库就可以  
https://github.com/apps/utterances 


4、并配置存储评论的github仓库，这里使用的是
```yaml
params:
  utteranc:
    enable: true
    repo: "yuanmoc/blogtalks" # 换成自己得
    issueTerm: "pathname"
    theme: "github-light"
```

