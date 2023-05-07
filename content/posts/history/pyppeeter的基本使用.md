---
title: "Pyppeeter的基本使用"
date: 2022-11-23 21:53:55.700000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# categories = ""
# bookSearchExclude: false
---
## 背景
抓包时，遇到一些网页的信息与渲染页面上的不一样，原因是抓到的数据还没有渲染，所以不一样。
pyppeeter就可以解决这个问题，还可以进行一些页面上的自动化操作。从而达到我想要的效果，在这里记录下来基本的使用方法。

## 基本使用

安装
> pip3 install pyppeteer


```python
import asyncio
from pyppeteer import launch


async def test():
    browser = await launch(headless=False, args=['--disable-infobars'])
    page = await browser.newPage()
    await page.setViewport({'width':1366,'height':768})

    # 是否启用JS，enabled设为False，则无渲染效果
    await page.setJavaScriptEnabled(enabled=True)

    response = await page.goto('https://baidu.com/')

    #获取status、headers、url
    # print(response.status)
    # print(response.headers)
    # print(response.url)

    #获取当前页标题
    # print(await page.title())

    #获取当前页内容
    await asyncio.sleep(2)

    print(await page.content()) #文本类型
    # print(await response.text())

    # cookie操作
    # print(await page.cookies())  # 获取cookie,[{'name':xx,'value':xxx...},...]
    # page.deleteCookie() 删除cookie
    # page.setCookie() 设置cookie

    #定位元素
    #1、只定位一个元素（css选择器）
    # element = await page.querySelector('#s-top-left > a')
    #2、css选择器
    # elements = await page.querySelectorAll('#s-top-left > a:nth-child(2n)')
    #3、xpath
    # elements = await page.xpath('//div[@id="s-top-left"]/a')
    # for element in elements:
    #     print(await (await element.getProperty('textContent')).jsonValue()) #获取文本内容
    #     print(await (await element.getProperty('href')).jsonValue())#获取href属性

    #模拟输入和点击
    # await page.type('#kw','中国',{'delay':1000}) #模拟输入，输入时间:1000 ms
    # await asyncio.sleep(2)
    # await page.click('.swiper-button-next')
    # await page.click('.swiper-button-next')
    #模拟点击，也可以先定位元素，然后await element.click()



    # 执行js，滚动页面到底部
    # await page.evaluate('window.scrollTo(0,document.body.scrollHeight);')

    await asyncio.sleep(5)
    await browser.close() #关闭浏览器


if __name__ == '__main__':
    asyncio.get_event_loop().run_until_complete(test())

```

