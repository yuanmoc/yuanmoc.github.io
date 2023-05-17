---
title: "选择排序(Selection sort)"
weight: 50
draft: false
bookComments: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---

## 选择排序介绍
它的基本思想是: **首先在未排序的数列中找到最小元素，然后将其存放到数列的起始位置**;接着，再从剩余未排序的元素中继续寻找最小元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

## 代码

```java
public class SelectSort {
    public static void main(String[] args) {
        int[] arr = {1,2,321,123,34};
        selectSort(arr);
        System.out.println(Arrays.toString(arr));
    }
    
    public static void selectSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            // 选择出最小的数index
            int min = i;
            for (int j = i; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    min = j;
                }
            }
            // 交换位置
            int tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
}
```

## 选择排序的时间复杂度和稳定性

**选择排序时间复杂度**  
选择排序的时间复杂度是O(N2)。

