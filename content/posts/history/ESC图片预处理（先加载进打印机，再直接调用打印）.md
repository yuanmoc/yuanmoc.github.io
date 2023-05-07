---
title: "Esc图片预处理（先加载进打印机，再直接调用打印）"
date: 2021-04-10 15:10:20.196000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
# ESC图片预处理

## 定义

```java
/**
 * 定义位图
 */
public byte[] critDefineNV(ArrayList<BufferedImage> images) {
    int n = images.size();
    // 定义几个位图，执行会覆盖原来的
    byte[] header = new byte[]{28, 113, (byte)n};

    for(int i = 0; i < images.size(); ++i) {
        header = byteMerger(header, imageToByte((BufferedImage)images.get(i)));
    }

    return header;
}

/**
 * 合并字节数组
 */
public byte[] byteMerger(byte[] byte_1, byte[] byte_2) {
    byte[] byte_3 = new byte[byte_1.length + byte_2.length];
    System.arraycopy(byte_1, 0, byte_3, 0, byte_1.length);
    System.arraycopy(byte_2, 0, byte_3, byte_1.length, byte_2.length);
    return byte_3;
}

/**
 * 图片转字节
 */
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

## 发送打印

```java
/**
 * 1 ≤ n ≤ 64  m=0,1,2,3,48,49,50,51
 * n 是第几个位图
 * m = 0,48 正常打印； m = 1,49 倍宽打印； 
 * m = 2,50 倍高打印； m = 3,51 四倍角打印。
 */
public byte[] critPrintNV(int n, int mode) {
    return new byte[]{28, 112, (byte)n, (byte)mode};
}
```

对齐，加在打印的前面

```java
16进制：
1B 61 n

n=0，48：左对齐； n=1，49：中间对齐； n=2，50；右对齐。
```



