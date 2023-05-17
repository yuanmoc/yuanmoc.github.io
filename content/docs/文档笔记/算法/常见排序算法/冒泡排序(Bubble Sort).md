---
title: "冒泡排序(Bubble Sort)"
weight: 1
draft: false
bookComments: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookSearchExclude: false
---
## 冒泡排序介绍 

**它会遍历若干次要排序的数列，每次遍历时，它都会从前往后依次的比较相邻两个数的大小；如果前者比后者大，则交换它们的位置。这样，一次遍历之后，最大的元素就在数列的末尾！** 采用相同的方法再次遍历时，第二大的元素就被排列在最大元素之前。重复此操作，直到整个数列都有序为止！

## 代码实现

```java
public class BubbleSort {

    public static void main(String[] args) {
        int[] arr = {1,122,23,4,5};
        bubbleSort(arr);
        System.out.println(Arrays.toString(arr));
    }
    
    public static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            // 控制最后一个节点，每一次把最大的值交换到后面
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j+1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = tmp;
                }
            }
        }
    }
}
```

## 复杂度和稳定性  

**冒泡排序时间复杂度**  
冒泡排序的时间复杂度是O(N2)。 假设被排序的数列中有N个数。遍历一趟的时间复杂度是O(N)，需要遍历多少次呢? N-1次！因此，冒泡排序的时间复杂度是O(N2)。

**冒泡排序稳定性**  
冒泡排序是稳定的算法，它满足稳定算法的定义。 算法稳定性 -- 假设在数列中存在a[i]=a[j]，若在排序之前，a[i]在a[j]前面；并且排序之后，a[i]仍然在a[j]前面。则这个排序算法是稳定的!
