---
title: "快速排序(Quick Sort)"
weight: 5
draft: false
bookComments: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---
## 快速排序介绍
它的基本思想是: **选择一个基准数，通过一趟排序将要排序的数据分割成独立的两部分；其中一部分的所有数据都比另外一部分的所有数据都要小**。然后，再按此方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，以此达到整个数据变成有序序列。

## 代码实现

```java
class QuickSort {


    public static void main(String[] args) {
        int[] arr = {5,23,7,87,234,1};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
    
    public static void quickSort(int[] arr, int start, int end) {
        if (start >= end) {
            return;
        }
        int first, l, r;
        first = arr[start];
        l = start;
        r = end;
        while (l < r) {
            // 要从先比较右边
            while (l < r && arr[r] >= first) {
                r--;
            }
            while (l < r && arr[l] <= first) {
                l++;
            }
            // 替换值后，接着比较
            int tmp = arr[l];
            arr[l] = arr[r];
            arr[r] = tmp;
        }
        arr[start] = arr[l];
        arr[l] = first;
        quickSort(arr, start, l - 1);
        quickSort(arr, l + 1, end);
    }
    
}
```

## 快速排序时间复杂度和稳定性

**快速排序稳定性**    
快速排序是不稳定的算法，它不满足稳定算法的定义。


**快速排序时间复杂度**  
快速排序的时间复杂度在最坏情况下是O(N2)，平均的时间复杂度是O(N*lgN)。
- 为什么最少是lg(N+1)次? 快速排序是采用的分治法进行遍历的，我们将它看作一棵二叉树，它需要遍历的次数就是二叉树的深度，而根据完全二叉树的定义，它的深度至少是lg(N+1)。因此，快速排序的遍历次数最少是lg(N+1)次。
- 为什么最多是N次? 这个应该非常简单，还是将快速排序看作一棵二叉树，它的深度最大是N。因此，快读排序的遍历次数最多是N次。
