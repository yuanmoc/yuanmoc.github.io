---
title: "归并排序(Merge Sort)"
weight: 52
draft: false
bookComments: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---

## 归并排序介绍

基本思路就是将数组分成二组 A，B，如果这二组组内的数据都是有序的，那么就可以 很方便的将这二组数据进行排序。如何让这二组组内数据有序了？
可以将 A，B 组各自再分成二组。依次类推，当分出来的小组只有一个数据时，可以认为这个小组组内已经达到了有序，然后再合并相邻的二个小组就可以了。这样通过先递归的分解数列，再合并数列就完成了归并排序。

## 代码实现

```java
public class MergeSort {
   
    public static void main(String[] args) {
        int[] arr = {5,23,7,87,234,1};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
    
    // 归并排序
    public static void mergeSort(int[] arr, int start, int end) {
        if (start >= end) {
            return;
        }
        // 分到最小单元，再合并时排序好
        int middle = (start + end) / 2;
        mergeSort(arr, start, middle);
        mergeSort(arr, middle + 1, end);
        // 合并两个数组值，并排序
        merge(arr, start, middle, end);
    }
    
    public static void merge(int[] arr, int start, int middle, int end) {
        // 创建一个临时数组来保存排序好的内容
        int[] tmp = new int[end-start+1];
        // 新数组的索引index，i是左边数组索引，j是右边数组索引
        int i = start, j = middle + 1, index = 0;
        // 当两边数组都有值时，进行比较，再放入到新数组上
        while (i <= middle && j <= end) {
            if (arr[i] < arr[j]) {
                tmp[index++] = arr[i++];
            } else {
                tmp[index++] = arr[j++];
            }
        }
        // 如果右边数组为空，左边数组就直接把值赋过去
        while (i <= middle) {
            tmp[index++] = arr[i++];
        }
        // 如果左边数组值为空，就直接把右边数组的值赋过去
        while (j <= end) {
            tmp[index++] = arr[j++];
        }
        // 把排序好的内容赋值回去
        for (int k = 0; k < tmp.length; k++) {
            arr[start+k] = tmp[k];
        }
        tmp = null;
    }
    
    
}

```

## 快速排序时间复杂度和稳定性

归并排序把集合进行层层拆半分组。如果集合长度为n，那么拆半的层数就是logn，每一层进行归并操作的运算量是n。所以，归并排序的时间复杂度等于每一层的运算量×层级数，即O(nlogn)。
