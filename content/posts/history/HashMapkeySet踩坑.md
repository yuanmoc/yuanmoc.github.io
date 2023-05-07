---
title: "Hash Mapkey Set踩坑"
date: 2021-11-06 14:32:29.161000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

在HashMap中使用keySet获取一个Set对象，然后移除Set对象中的值，发现会把HashMap中的值也移除掉了。


查看源码发现，HashMap中keySet使用的也是HashMap中的对象，而不是重新创建一个对象，所以操作HashSet时，也就是操作了HashMap对象。

```java
    public Set<K> keySet() {
        Set<K> ks;
        return (ks = keySet) == null ? (keySet = new KeySet()) : ks;
    }

    final class KeySet extends AbstractSet<K> {
        public final int size()                 { return size; }
        public final void clear()               { HashMap.this.clear(); }
        public final Iterator<K> iterator()     { return new KeyIterator(); }
        public final boolean contains(Object o) { return containsKey(o); }
        public final boolean remove(Object key) {
            return removeNode(hash(key), key, null, false, true) != null;
        }
        public final Spliterator<K> spliterator() {
            return new KeySpliterator<>(HashMap.this, 0, -1, 0, 0);
        }
        public final void forEach(Consumer<? super K> action) {
            Node<K,V>[] tab;
            if (action == null)
                throw new NullPointerException();
            if (size > 0 && (tab = table) != null) {
                int mc = modCount;
                for (int i = 0; i < tab.length; ++i) {
                    for (Node<K,V> e = tab[i]; e != null; e = e.next)
                        action.accept(e.key);
                }
                if (modCount != mc)
                    throw new ConcurrentModificationException();
            }
        }
    }
```