---
title: "图片转 Bit Map位图"
date: 2021-01-26 23:14:53.190000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
记录一下如何生成位图字节码

``` 
public static byte[] imgToInstruct(int o_x, int o_y, int mode, BufferedImage bi) throws Exception{
       //定义指令拼装部分尾部
       byte[] i2="\r\n".getBytes("utf-8");

       //生成2进制字符串
       int[] rgb = new int[3];
       int width = bi.getWidth();
       int height = bi.getHeight();
       int wModByte = (width % 8) == 0 ? 0 : 8 - (width % 8);
       int pixelCount = (width + wModByte) * height;
       int wPrintByte = (width + wModByte) / 8;
       StringBuilder res = new StringBuilder();
       for (int y = 0; y < height; y++) {
           for (int x = 0; x < width; x++) {
               int pixel = bi.getRGB(x, y);
               // 下面三行代码将一个数字转换为RGB数字
               rgb[0] = (pixel & 0xff0000) >> 16;
               rgb[1] = (pixel & 0xff00) >> 8;
               rgb[2] = (pixel & 0xff);
               String bitStr = (rgb[0] + rgb[1] + rgb[2]) / 3 >= 200 ? "1" : "0";
               res.append(bitStr);
           }
           for (int k = 0; k < wModByte; k++) {
               res.append("1");
           }
       }
       //生成二值图（黑白图像）字节流
       String x=res.toString();
       byte[] i1 =new byte[x.length()/8];
       for(int i=0;i<x.length();i=i+8)
       {
           String y =x.substring(i,i+4);
           String z=x.substring(i+4,i+8);
           byte y1=Byte.parseByte(y,2);
           byte z1=Byte.parseByte(z,2);
           i1[i/8]=(byte)(((byte)(y1<<4)) | z1);
       }
       //数组合并
       String istr=String.format("BITMAP %d,%d,%d,%d,%d,",o_x,o_y,wPrintByte,height,mode);
       byte[] i0=istr.getBytes("utf-8");
       byte[] retVal =new  byte[i0.length + i1.length + i2.length];
       System.arraycopy(i0,0,retVal,0,i0.length);
       System.arraycopy(i1,0,retVal,i0.length,i1.length);
       System.arraycopy(i2,0,retVal,i0.length+i1.length,i2.length);
       return retVal;
   }

```

2、image To byte

```java

    public static byte[] imageToByte(BufferedImage bi) {
        int[] rgb = new int[3];
        int width = bi.getWidth();
        int height = bi.getHeight();
        StringBuilder res = new StringBuilder();

        int i;
        String y;
        for(int x = 0; x < width / 8 * 8; ++x) {
            for(int y = 0; y < height / 8 * 8; ++y) {
                i = bi.getRGB(x, y);
                rgb[0] = (i & 16711680) >> 16;
                rgb[1] = (i & '\uff00') >> 8;
                rgb[2] = i & 255;
                y = (rgb[0] + rgb[1] + rgb[2]) / 3 >= 200 ? "0" : "1";
                res.append(y);
            }
        }

        String x = res.toString();
        byte[] i1 = new byte[x.length() / 8];

        for(i = 0; i < x.length(); i += 8) {
            y = x.substring(i, i + 4);
            String z = x.substring(i + 4, i + 8);
            byte y1 = Byte.parseByte(y, 2);
            byte z1 = Byte.parseByte(z, 2);
            i1[i / 8] = (byte)((byte)(y1 << 4) | z1);
        }

        byte[] bytes = new byte[]{(byte)(width / 8 % 256), (byte)(width / 8 / 256), (byte)(height / 8 % 256), (byte)(height / 8 / 256)};
        bytes = byteMerger(bytes, i1);
        return bytes;
    }


```