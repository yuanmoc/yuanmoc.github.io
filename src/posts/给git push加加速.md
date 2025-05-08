---
title: 给git push加加速
date: 2025-04-19 16:03:04
permalink: /posts/17b38b.html
tag: 
  - Git
  - Set
  - 脚本
---

## 解决 github push 上传不了问题

有时遇到 git 上传很慢，或者上传不上去的时候，即浪费时间，又很烦。

现记录几种解决方式如下：

1、针对单个项目代理
设置代理，即找到.git文件夹中的config文件，并添加以下的代理信息即可
```ini
[http "https://github.com"]
	proxy = socks5://127.0.0.1:7890
```

也可以使用以下脚本进行设置
```bash
git config http.https://github.com.proxy socks5://127.0.0.1:7890
```

2、使用全局配置
```ini
# 启动全局代理配置
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890

#取消配置
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 使用ssh解决https上传不稳定问题

:::tip
针对mac用户测试
:::

1、检查是否已有SSH密钥
```bash
ls -al ~/.ssh
```

2、生成新的SSH密钥
```bash
ssh-keygen -t rsa -b 4096 -C "test@qq.com"
```
这里-t rsa指定了密钥类型，-b 4096指定了密钥长度，-C后面跟的是一个注释，通常是您的邮箱地址。
没有什么问题就一直回车，最后会生成两个文件 `~/.ssh/id_rsa` 和 `~/.ssh/id_rsa.pub`。

::: note 生成过程说明
当你在终端中输入并执行这个命令后，可能会经历以下步骤：

1.选择密钥保存位置
   plaintext
   Generating public/private rsa key pair.
   Enter file in which to save the key (/Users/your_username/.ssh/id_rsa):
   系统会提示你输入密钥的保存位置，默认路径是 /Users/your_username/.ssh/id_rsa（在 macOS 或 Linux 系统中）或 C:\Users\your_username\.ssh\id_rsa（在 Windows 系统中）。如果你想使用默认位置，直接按回车键即可；如果你想将密钥保存到其他位置，可以输入完整的路径。

2.设置密钥密码（可选）
   plaintext
   Enter passphrase (empty for no passphrase):
   Enter same passphrase again:
   系统会提示你输入一个密码（passphrase）来保护你的私钥。如果你不想设置密码，直接按回车键即可。设置密码可以增加私钥的安全性，因为在使用私钥进行身份验证时，需要输入这个密码进行解密。输入密码时，终端不会显示你输入的内容，这是为了保护密码的安全性。输入完成后，再次输入相同的密码进行确认。

3.密钥生成完成
   plaintext
   Your identification has been saved in /Users/your_username/.ssh/id_rsa.
   Your public key has been saved in /Users/your_username/.ssh/id_rsa.pub.
   The key fingerprint is:
   SHA256:xxxxxx test@qq.com
   The key's randomart image is:
   +---[RSA 4096]----+
   |       .o...     |
   |      .o o.      |
   |     .o o o      |
   |    . o o o      |
   |   .   o S .     |
   |  .     . + .    |
   |   .   . o o     |
   |    . . o .      |
   |     ooo.        |
   +----[SHA256]-----+

当密钥生成完成后，系统会显示私钥和公钥的保存位置，以及密钥的指纹（fingerprint）和随机艺术图像（randomart image）。密钥指纹是密钥的一种哈希表示，用于快速验证密钥的完整性和唯一性；随机艺术图像则是一种可视化的表示方式，帮助你直观地识别密钥。
生成的私钥（id_rsa）需要妥善保管，不要泄露给他人；公钥（id_rsa.pub）可以安全地分享到你需要进行 SSH 连接的服务器上。

:::

3、然后添加您的私钥到ssh-agent(windows则是OpenSSH)：
```bash
ssh-add ~/.ssh/id_rsa
```
查看可以使用 `ssh-add -l`,删除则是 `ssh-add -D`


4、复制公钥到GitHub： 打开您的公钥文件（通常是~/.ssh/id_rsa.pub），复制其内容。
您也可以使用cat命令来查看并复制公钥内容：
```bash
cat ~/.ssh/id_rsa.pub
```

打开 https://github.com/settings/keys
进入“SSH and GPG keys”（SSH和GPG密钥），点击“New SSH key”（新建SSH密钥），粘贴您的公钥内容。

5、测试SSH连接： 在终端中运行以下命令来测试您的SSH连接：
```bash
ssh -T git@github.com
```

配置完成！

最后修改一下.git config，让其走ssh
```ini
[remote "origin"]
	url = https://github.com/xxx/xxx.git
	fetch = +refs/heads/*:refs/remotes/origin/*

# 从上面链接修改成下面的这种

[remote "origin"]
	url = git@github.com:xxx/xxx.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

