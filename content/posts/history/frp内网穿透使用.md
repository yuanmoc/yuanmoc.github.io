---
title: "Frp内网穿透使用"
date: 2021-01-09 22:41:55.458000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
由于项目要开发调试第三方的回调，回调地址必须是外网的一个ip地址或者域名，为了方便调试应用，下面搭建一个外网穿透服务来使用，把外网地址映射到本地机器上。

个人使用frp来搭建内网穿透服务，frp分为frps服务端和frpc客户端，注意，在使用时，frps和frpc的版本要一样，不然可能会出现问题。

附：[frp的github 地址](https://github.com/fatedier/frp)

### 服务端的搭建
1、需要一个外网ip,域名，域名解析到ip上，如：frp.yuanmoc.cn解析到我的ip上。

2、下载frp到我们的服务器，我是在Linux上搭建的frps，所以我下载了Linux版本frps，即frp_0.34.3_linux_amd64.tar.gz
，解压下载下来的文件 `tar -zxvf frp_0.34.3_linux_amd64.tar.gz` ，其中 frps 和 frps.ini 是我们需要的文件，注意frps要有可执行的权限，即 
```bash
chmod +x frps` 
```

3、编写修改 frps.ini 配置文件
```ini
[common]
bind_addr = 0.0.0.0 # 全部客户端可连接
bind_port = 7000  # 绑定的端口，在客户端上要对应
vhost_http_port = 8000 # 映射的http请求端口
# 安全起见，加上授权
authentication_method = token # 授权方式token
token = xxx # token的值，要在客户端的common添加此授权

```
4、启动服务端，可以使用以下命令进行执行
```bash
frps -c frps.ini
```

5、启动成功后会有如下日志
```text
2021/01/09 22:05:16 [I] [service.go:190] frps tcp listen on 0.0.0.0:7000
2021/01/09 22:05:16 [I] [service.go:232] http service listen on 0.0.0.0:8080
2021/01/09 22:05:16 [I] [root.go:215] start frps success

```


### 客户端的搭建
1、下载客户端，由于我要在Windows上使用，所以就下载了个Windows版本，即frp_0.34.3_windows_amd64.zip，解压，其中 frpc 和 frpc.ini 是我们要使用到的，这里要注意一下，frpc是客户端的而frps是服务端的，别搞错了哦。

2、编写配置文件 frpc.ini
```ini
[common]
server_addr = x.x.x.x # 刚才服务端的外网ip地址
server_port = 7000 # 服务端的绑定的端口，即 bind_port 的值
token = xxx # 授权token

# ssh 连接，目前没有用到
[ssh]
type = tcp
local_ip = 127.0.0.1
local_port = 22
remote_port = 6000

# web 服务，这个是我们需要的
[web]
type = http # 类型是http,当然还会有https类型
local_port = 8080 # 本地你web服务启动的端口
custom_domains = frp.yuanmoc.cn # 一开始你解析的域名

# 可以有多个，当然我这里一个就够用了
#[web2]
#type = http
#local_port = 8081
#custom_domains = frp2.yuanmoc.cn
```
3、启动客户端
```bash
./frpc.exe -c frpc.ini
```
启动成功后，在客户端会显示如下日志：
```bash
2021/01/09 22:06:42 [I] [service.go:288] [ad516891811f3c34] login to server success, get run id [ad516891811f3c34], server udp port [0]
2021/01/09 22:06:42 [I] [proxy_manager.go:144] [ad516891811f3c34] proxy added: [ssh web]
2021/01/09 22:06:42 [I] [control.go:180] [ad516891811f3c34] [ssh] start proxy success
2021/01/09 22:06:42 [I] [control.go:180] [ad516891811f3c34] [web] start proxy success
```
在服务端也会显示如下日志：
```bash
2021/01/09 22:06:41 [I] [service.go:444] [ad516891811f3c34] client login info: ip [119.123.72.17:14167] version [0.34.3] hostname [] os [windows] arch [amd64]
2021/01/09 22:06:41 [I] [tcp.go:63] [ad516891811f3c34] [ssh] tcp proxy listen port [6000]
2021/01/09 22:06:41 [I] [control.go:446] [ad516891811f3c34] new proxy [ssh] success
2021/01/09 22:06:41 [I] [http.go:92] [ad516891811f3c34] [web] http proxy listen for host [frp.yuanmoc.cn] location [] group []
2021/01/09 22:06:41 [I] [control.go:446] [ad516891811f3c34] new proxy [web] success
```
4、这下就可以通过外网的域名去调试你本地的项目了
```bash
外网访问http://frp.yuanmoc.cn:8000就会映射到本地的http://localhost:8080上，用于调试某些api的回调非常方便。
http://frp.yuanmoc.cn:8000 -> http://localhost:8080
```
其中8000端口是你在frp服务端设置的vhost_http_port，8080是客户端设置的local_port，也是你web项目启动的端口。

### 服务端后台启动
为了方便使用，一般服务程序都会在后台启动，这里也编写一个脚本来使用，这里的`start.sh，frps，frps.ini`都在同一个目录下。

1、创建文件并给予可执行权限
```bash
touch start.sh
chmod +x start.sh
```

2、把以下内容添加到start.sh文件
```bash
#!/bin/bash
# 启动
start(){
  echo "start frps......"
  nohup ./frps -c ./frps.ini > frps.log  2>&1 &
  echo $! > $PIDFILE
  if [ $? -ne 0 ]
  then
    echo "Could not create PID file"
    exit 1
  else
    echo "frps running......"
  fi
}
# 停止
stop(){
  PID=$1
  ps -p $PID > /dev/null 2>&1
  if [ $? -eq 0 ]
  then
    echo "stop frps......"
    kill -9 $PID
    echo "stop completing......"
  fi
}
# 重启
restart(){
  stop $1
  start
}

PIDFILE=./frps.pid
if [ -f $PIDFILE ]
then
  PID=$(cat $PIDFILE)
  restart $PID
else
  start
fi

```

3、执行
```bash
./start.sh
```

最后附上[官方文档](https://gofrp.org/docs/)，学习更多。