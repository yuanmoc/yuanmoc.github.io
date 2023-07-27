---
title: "使用playwright截图驾照题目"
date: 2023-07-27T20:33:50+08:00
draft: false
bookComments: true
# tags = []
# categories = ""
# bookSearchExclude: false
---

## 目的
目前科目一的题目只有在线版本，对于那些需要导出pdf版，打印出来练习的，没有办法可以直接导出pdf，因此需要截图 [科目一题目](https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1-guangzhou.html?id=800500)，整理成pdf，以供打印。

这里借助Playwright工具，截图出题目，然后再整理成pdf。

## Playwright介绍 
Playwright是一个强大的Python库，仅用一个API即可自动执行Chromium、Firefox、WebKit等主流浏览器自动化操作，并同时支持以无头模式、有头模式运行。

Playwright也是一款Web端到端测试工具，可以做自动化测试。

## Playwright 安装
```bash
pip3 install playwright
```

## 安装主流的浏览器驱动
```bash
playwright install
```
注意：安装过程需要时间，慢慢等吧～～

## 步骤
1、观察页面元素，如何可以截出一张包含详细信息的图片。

2、查找截图的范围，达到完美边界。

3、进行下一页自动化处理。

没有详细步骤，看代码吧～～

## 整体代码

1、把全部题目和详解截图下来
```python
import os.path

from playwright.sync_api import sync_playwright

# 图片保存路径
path = '/Users/yuanmoc/Documents/py-workspace/test/timu'

def run(playwright):
    # 使用chrome模拟浏览器
    browser = playwright.chromium.launch(headless=False)
    # 窗体大小，还可以设置头信息等
    #context = browser.new_context(viewport = {'width': 375, 'height': 812})
    context = browser.new_context()
    # 新建page
    page = context.new_page()
    # 打开页面
    page.goto("https://www.jiakaobaodian.com/mnks/exercise/0-car-kemu1-guangzhou.html?id=800500")
    # 选择元素，点击禁止自动跳转下一页（因为这里需要截图先）
    page.wait_for_selector("input.checkbox-next").click()
    # 选择元素，点击显示详解
    page.wait_for_selector("text='显示详解'").click()
    
    # 处理第一页
    handlerPage(page, 1)
    for i in range(2, 2285):
        # 点击到下一页
        page.wait_for_selector("text='下一题'").click()
        # 处理下一页
        printPage(page, i)
    
    # 关闭资源
    page.close()
    context.close()
    browser.close()


def handlerPage(page, num):
    # 选择答案，让其显示出正确答案，以供查看
    page.click("[ref=\"answerclick\"]:last-child")
    # 这里需要先等待一些时间，让页面渲染完成，不然下面的元素无法进行定位与appendChild
    page.wait_for_timeout(300)
    # 选择题目元素
    detail = page.wait_for_selector('#ComQuestionDetail_qundefined').as_element()
    # 选择详解元素
    xiangjie = page.wait_for_selector('.xiangjie >> .content').as_element()
    # 把详解插入到题目答案后面
    page.evaluate('''([detail, xiangjie]) => {
        detail.appendChild(document.createElement("br"));
        detail.appendChild(xiangjie);
    }''', [detail, xiangjie])
    # 创建保存图片的目录
    if not os.path.exists(path):
        os.mkdir(path)
    # 选择元素范围，并截图，保存
    page.locator("div.com-mnks-question-detail").screenshot(path=path + "/"+str(num)+".png")

if __name__ == '__main__':
    with sync_playwright() as playwright:
        run(playwright)

```

2、把图片拼接成A4纸差不多大小，方便打印

需要安装 `pip3 install Pillow`
```python
from PIL import Image
import os

input_folder = '/Users/yuanmoc/Documents/py-workspace/test/timu/'
output_folder = '/Users/yuanmoc/Documents/py-workspace/test/timu1/'


if __name__ == '__main__':
    if not os.path.exists(output_folder):
        os.mkdir(output_folder)

    # 14张图片拼成一页
    for i in range(1, 2284, 14):
        # 一张图片大小是 860 x 335
        # 创建一个新的（860 * 2 + 2） x （335 * 7）像素大小的白色背景图像
        new_image = Image.new('RGB', (860 * 2 + 2, 335 * 7), 'white')

        # 将四个图像粘贴到新图像的正确位置
        new_image.paste(Image.open(input_folder+str(i)+'.png'), (0, 0))
        new_image.paste(Image.open(input_folder+str(i+1)+'.png'), (862, 0))

        new_image.paste(Image.open(input_folder + str(i + 2) + '.png'), (0, 335))
        new_image.paste(Image.open(input_folder + str(i + 3) + '.png'), (862, 335))

        new_image.paste(Image.open(input_folder + str(i + 4) + '.png'), (0, 335*2))
        new_image.paste(Image.open(input_folder + str(i + 5) + '.png'), (862, 335*2))

        new_image.paste(Image.open(input_folder + str(i + 6) + '.png'), (0, 335*3))
        new_image.paste(Image.open(input_folder + str(i + 7) + '.png'), (862, 335*3))

        new_image.paste(Image.open(input_folder + str(i + 8) + '.png'), (0, 335*4))
        new_image.paste(Image.open(input_folder + str(i + 9) + '.png'), (862, 335*4))

        new_image.paste(Image.open(input_folder + str(i + 10) + '.png'), (0, 335*5))
        new_image.paste(Image.open(input_folder + str(i + 11) + '.png'), (862, 335*5))

        new_image.paste(Image.open(input_folder + str(i + 12) + '.png'), (0, 335*6))
        new_image.paste(Image.open(input_folder + str(i + 13) + '.png'), (862, 335*6))
        new_image.save(output_folder + str(i)+'-'+str(i+13)+'.png')


```