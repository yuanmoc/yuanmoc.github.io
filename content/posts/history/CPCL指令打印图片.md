---
title: "Cpcl指令打印图片"
date: 2021-10-14 11:59:33.567000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
```java

    public String graphics(int x0, int y0, int width, int height, BufferedImage bmp) {
        if (bmp != null) {
            //生成2进制字符串
            int[] rgb = new int[3];
            width = bmp.getWidth();
            height = bmp.getHeight();
            int wModByte = (width % 8) == 0 ? 0 : 8 - (width % 8);
            int pixelCount = (width + wModByte) * height;
            int wPrintByte = (width + wModByte) / 8;
            StringBuilder res = new StringBuilder();
            for (int y = 0; y < height; y++) {
                for (int x = 0; x < width; x++) {
                    int pixel = bmp.getRGB(x, y);
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
            //生成二值图字节流
            String x = res.toString();
            for (int i = 0; i < binary2.length(); i = i + 8) {
                String substring = binary2.substring(i, i + 8);
                String hex = Long.toHexString(Long.parseLong(substring,2));
                if(hex.length() == 1) {
                    hex = "0" + hex;
                } else if(hex.length() > 2) {
                    hex = hex.substring(hex.length() - 2);
                }
                hexStr.append(hex);
            }

            StringJoiner sj = new StringJoiner(" ", "", "\r\n");
            sj.add("EG").add(String.valueOf(wPrintByte)).add(String.valueOf(height))
                    .add(String.valueOf(x0)).add(String.valueOf(y0)).add(hexStr.toString());
            return sj.toString();
        }
        return "";
    }


    private String toHexString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for(Byte b : bytes) {
            String hex = Integer.toHexString(b.intValue()).toUpperCase();
            if(hex.length() == 1) {
                hex = "0" + hex;
            } else if(hex.length() > 2) {
                hex = hex.substring(hex.length() - 2);
            }
            sb.append(hex);
        }
        return sb.toString();
    }
```