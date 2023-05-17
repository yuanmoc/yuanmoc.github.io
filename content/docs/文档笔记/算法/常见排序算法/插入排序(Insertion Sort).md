---
title: "插入排序(Insertion Sort)"
weight: 4
draft: false
bookComments: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---

## 插入排序介绍

基本思想是: 把n个待排序的元素看成为一个有序表和一个无序表。开始时有序表中只包含1个元素，无序表中包含有n-1个元素，**排序过程中每次从无序表中取出第一个元素，将它插入到有序表中的适当位置，使之成为新的有序表，重复n-1次可完成排序过程**。

## 代码

```java
public class InsertSort{
    public static void main(String[] args) {
        int[] arr = {1,2,321,123,34};
        insertSort(arr);
        System.out.println(Arrays.toString(arr));
    }
    
    public static void insertSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = i; j > 0; j--) {
                // 向前比较，如果到合适位置就进行下一轮
                if (arr[j] < arr[j-1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j-1];
                    arr[j-1] = tmp;
                } else {
                    break;
                }
            }
        }
    }
}

```

## 插入排序的时间复杂度和稳定性
**插入排序时间复杂度**  
直接插入排序的时间复杂度是O(N2)。

假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? N-1！因此，直接插入排序的时间复杂度是O(N2)。

**插入排序稳定性**  
直接插入排序是稳定的算法，它满足稳定算法的定义。


