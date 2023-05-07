---
title: "Callable返回值的源码"
date: 2020-07-20 10:31:48.979000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
分析一下Callable是如何拿到返回值的

## callable 是如何保存返回值

1、先写一个callable测试类

```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    ExecutorService pool = Executors.newCachedThreadPool();

    Future<String> result = pool.submit(() -> {
        return "Callable Test";
    });

    System.out.println(result.get());
}
```

2、看一下submit方法有什么
```java
public <T> Future<T> submit(Callable<T> task) {
    if (task == null) throw new NullPointerException();
    RunnableFuture<T> ftask = newTaskFor(task);
    execute(ftask);
    return ftask;
}
```
构建一个 RunnableFuture 对象，通过AbstractExecutorService的execute方法来执行，那么返回值的获取操作应该就在RunnableFuture对象里了，执行的方法是run()。

3、再深入查看newTaskFor(task)方法
```java
protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {
    return new FutureTask<T>(callable);
}
```

发现他实际是构建了一个 FutureTask<T>(callable) 对象，把我们创建的callable对象传进去。

4、那我们来看一下这个对象的run()方法
```java
public void run() {
	if (state != NEW ||
		!UNSAFE.compareAndSwapObject(this, runnerOffset, null, Thread.currentThread()))
		return;
	try {
		Callable<V> c = callable;
		if (c != null && state == NEW) {
			V result;
			boolean ran;
			try {
				result = c.call(); //执行线程，获取结果
				ran = true;
			} catch (Throwable ex) {
				result = null; //有异常，结果设置为空
				ran = false;
				setException(ex);
			}
			if (ran)
				set(result); //设置保存结果
		}
	} finally {
		// runner must be non-null until state is settled to
		// prevent concurrent calls to run()
		runner = null;
		// state must be re-read after nulling runner to prevent
		// leaked interrupts
		int s = state;
		if (s >= INTERRUPTING)
			handlePossibleCancellationInterrupt(s);
	}
}

```

5、再看看set()方法
```java
protected void set(V v) {
    if (UNSAFE.compareAndSwapInt(this, stateOffset, NEW, COMPLETING)) {
        outcome = v;
        UNSAFE.putOrderedInt(this, stateOffset, NORMAL); // final state
        finishCompletion();
    }
}
```
把线程执行结果通过set()进行保存，保存在outcome 变量中

## 获取callable返回值

主要是看看通过Future<T> 是怎样获取callable值的

1、主要是看FutureTask<T> get()方法
```java
// 没有设置等待时间
public V get() throws InterruptedException, ExecutionException {
    int s = state;
    if (s <= COMPLETING) //线程没有执行完
        s = awaitDone(false, 0L); //阻塞等待
    return report(s);
}

//设置等待时间
public V get(long timeout, TimeUnit unit)
    throws InterruptedException, ExecutionException, TimeoutException {
    if (unit == null)
        throw new NullPointerException();
    int s = state;
    if (s <= COMPLETING &&
         (s = awaitDone(true, unit.toNanos(timeout))) <= COMPLETING)
         throw new TimeoutException();
    return report(s);
}
```

2、awaitDone方法
```java
private int awaitDone(boolean timed, long nanos)
        throws InterruptedException {
    final long deadline = timed ? System.nanoTime() + nanos : 0L;
    FutureTask.WaitNode q = null;
    boolean queued = false;
    for (;;) {
        if (Thread.interrupted()) {
            removeWaiter(q);
            throw new InterruptedException();
        }

        int s = state;
        if (s > COMPLETING) {
            if (q != null)
                q.thread = null;
            return s;
        }
        else if (s == COMPLETING) // cannot time out yet
            Thread.yield();
        else if (q == null)
            q = new FutureTask.WaitNode();
        else if (!queued)
            queued = UNSAFE.compareAndSwapObject(this, waitersOffset,
                    q.next = waiters, q);
        else if (timed) {
            nanos = deadline - System.nanoTime();
            if (nanos <= 0L) {
                removeWaiter(q);
                return state;
            }
            LockSupport.parkNanos(this, nanos);
        }
        else
            LockSupport.park(this);
    }
}

```
通过自旋等待线程的执行完，返回值
