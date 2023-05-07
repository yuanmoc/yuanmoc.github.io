---
title: "Redis分布式锁"
date: 2021-12-29 00:45:40.918000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

```xml
        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.0.1</version>
        </dependency>

```

LockUtil

```java

public class LockUtil {

    private static final JedisPool JEDIS_POOL;

    /** 锁过期时间 */
    private static final long INTERNAL_LOCK_LEASE_TIME = 5000;

    private final static long TIME_OUT = 20000; //获取锁的超时时间

    private static final SetParams PARAMS = SetParams.setParams().nx().px(INTERNAL_LOCK_LEASE_TIME);

    static {
        JEDIS_POOL = new JedisPool("139.9.183.232", 6379);
    }

    private static Jedis getJedis() {
        Jedis resource = JEDIS_POOL.getResource();
        resource.auth("yuanmoc");
        return resource;
    }

    public static boolean lock(String lockKey, String sessionId) {
        Jedis jedis = getJedis();
        long start = System.currentTimeMillis();
        try{
            for(;;){
                // SET命令返回OK ，则证明获取锁成功
                System.out.println(Thread.currentThread().getName() + " - 正在获取锁");
                String lock = jedis.set(lockKey, sessionId, PARAMS);
                if("OK".equals(lock)){
                    System.out.println(Thread.currentThread().getName() + " - 获取锁成功");
                    return true;
                }
                // 否则循环等待，在timeout时间内仍未获取到锁，则获取失败
                long l = System.currentTimeMillis() - start;
                if (l >= TIME_OUT) {
                    System.out.println(Thread.currentThread().getName() + " - 获取锁超时");
                    return false;
                }
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }finally {
            jedis.close();
        }
    }

    public static boolean unlock(String lockKey, String sessionId){
        Jedis jedis = getJedis();
        String script =
                "if redis.call('get',KEYS[1]) == ARGV[1] then" +
                "   return redis.call('del',KEYS[1]) " +
                "else" +
                "   return 0 " +
                "end";
        try {
            Object result = jedis.eval(script, Collections.singletonList(lockKey),
                    Collections.singletonList(sessionId));
            if("1".equals(result.toString())){
                System.out.println(Thread.currentThread().getName() + " - 释放锁成功");
                return true;
            }
            System.out.println(Thread.currentThread().getName() + " - 释放锁失败");
            return false;
        }finally {
            jedis.close();
        }
    }
}
```


Test01

```java

/**
 * 1、加锁
 * 2、释放锁
 * 3、程序意外死亡释放锁失败（利用超时闲时间防止死锁）
 * 4、业务执行时间超过锁过期时间
 */
public class Test01 {

    private static String key = "flash_1";
    private static String sessionId1 = "session_id_1";
    private static String sessionId2 = "session_id_2";

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(2);
        executorService.execute(() -> {
            try {
                LockUtil.lock(key, sessionId1);
                System.out.println(Thread.currentThread().getName() + "业务执行中...");
                Thread.sleep(300);
            } catch (Exception e) {

            } finally {
                LockUtil.unlock(key, sessionId1);
            }
        });

        executorService.execute(() -> {
            try {
                LockUtil.lock(key, sessionId2);
                System.out.println(Thread.currentThread().getName() + "业务执行中...");
                Thread.sleep(300);
            } catch (Exception e) {

            } finally {
                LockUtil.unlock(key, sessionId2);
            }
        });

    }
}
```

LockUtil2

```java

public class LockUtil2 {

    private static final JedisPool JEDIS_POOL;

    /** 锁过期时间 */
    private static final long INTERNAL_LOCK_LEASE_TIME = 5000;

    private final static long TIME_OUT = 20000; //获取锁的超时时间

    static {
        JEDIS_POOL = new JedisPool("139.9.183.232", 6379);
    }

    private static Jedis getJedis() {
        Jedis resource = JEDIS_POOL.getResource();
        resource.auth("yuanmoc");
        return resource;
    }

    public static boolean lock(String lockKey, String sessionId) {
        Jedis jedis = getJedis();
        long start = System.currentTimeMillis();
        String script = "if (redis.call('exists', KEYS[1]) == 0) then " +
                            "redis.call('hset', KEYS[1], ARGV[2], 1); " +
                            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                            "return nil; " +
                        "end; " +
                        "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                            "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                            "return nil; " +
                        "end; " +
                        "return redis.call('pttl', KEYS[1]);";
        try{
            for(;;){

                System.out.println(Thread.currentThread().getName() + " - 正在获取锁");
                Object eval = jedis.eval(script, Collections.singletonList(lockKey),
                        Arrays.asList(INTERNAL_LOCK_LEASE_TIME + "", sessionId));
                if(eval == null){
                    System.out.println(Thread.currentThread().getName() + " - 获取锁成功");
                    return true;
                }
                // 否则循环等待，在timeout时间内仍未获取到锁，则获取失败
                long l = System.currentTimeMillis() - start;
                if (l >= TIME_OUT) {
                    System.out.println(Thread.currentThread().getName() + " - 获取锁超时");
                    return false;
                }
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }finally {
            jedis.close();
        }
    }

    public static boolean unlock(String lockKey, String sessionId){
        Jedis jedis = getJedis();
        String script =
                // 如果锁已经不存在
                "if (redis.call('exists', KEYS[1]) == 0) then " +
                    "return 1; " +
                "end;" +
                // 如果释放锁的线程和已存在锁的线程不是同一个线程，返回null
                "if (redis.call('hexists', KEYS[1], ARGV[2]) == 0) then " +
                    "return nil;" +
                "end; " +
                // 通过hincrby递减1的方式，释放一次锁
                // 若剩余次数大于0 ，则刷新过期时间
                "local counter = redis.call('hincrby', KEYS[1], ARGV[2], -1); " +
                "if (counter > 0) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return 0; " +
                // 否则证明锁已经释放，删除key
                "else " +
                    "redis.call('del', KEYS[1]); " +
                    "return 1; "+
                "end; " +
                    "return nil;";
        try {
            Object result = jedis.eval(script, Collections.singletonList(lockKey),
                    Arrays.asList(INTERNAL_LOCK_LEASE_TIME + "", sessionId));
            if(result != null){
                System.out.println(Thread.currentThread().getName() + " - 释放锁成功");
                return true;
            }
            System.out.println(Thread.currentThread().getName() + " - 释放锁失败");
            return false;
        }finally {
            jedis.close();
        }
    }

}

```

test2

```java

/**
 * 1、可重入锁
 */
public class Test02 {

    private static String key = "flash_1";
    private static String sessionId1 = "session_id_1";
    private static String sessionId2 = "session_id_2";

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        executorService.execute(() -> {
            try {
                LockUtil2.lock(key, sessionId1);
                System.out.println(Thread.currentThread().getName() + " - 业务执行中...");
                Thread.sleep(300);
            } catch (Exception e) {

            } finally {
                LockUtil2.unlock(key, sessionId1);
            }
        });

        executorService.execute(() -> {
            try {
                LockUtil2.lock(key, sessionId1);
                System.out.println(Thread.currentThread().getName() + " - 业务执行中...");
                Thread.sleep(300);
            } catch (Exception e) {

            } finally {
                LockUtil2.unlock(key, sessionId1);
            }
        });

        executorService.execute(() -> {
            try {
                LockUtil2.lock(key, sessionId2);
                System.out.println(Thread.currentThread().getName() + " - 业务执行中...");
                Thread.sleep(300);
            } catch (Exception e) {

            } finally {
                LockUtil2.unlock(key, sessionId2);
            }
        });

    }
}

```

其他

```java

    private static Map<String, Map<Thread, Timer>> expirationRenewalMap = new ArrayList<>(0);

    public static void scheduleExpirationRenewal(String lockKey, String sessionId, Thread thread) {
        Map<Thread, Timer> timerMap = expirationRenewalMap.get(lockKey + sessionId);
        if (timerMap == null) {
            timerMap = new HashMap<>();
        } else {
            for (Thread thread1 : timerMap.keySet()) {
                timerMap.get(thread1).cancel();
            }
        }
        long period = INTERNAL_LOCK_LEASE_TIME / 3L;
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new ExpirationRenewalTimerTask(lockKey, thread), period, period);
        timerMap.put(thread, timer);
        expirationRenewalMap.put(lockKey + sessionId, timerMap);
    }

    static class ExpirationRenewalTimerTask extends TimerTask {

        public ExpirationRenewalTimerTask(String lockKey, Thread thread) {
            this.lockKey = lockKey;
            this.thread = thread;
        }
        private String lockKey;
        private Thread thread;

        @Override
        public void run() {
            Map<Thread, Timer> timerMap = expirationRenewalMap.get(lockKey);
            if (timerMap == null) {
                return;
            }
            for (Thread thread1 : timerMap.keySet()) {
                if (!thread1.isAlive()) {
                    Timer timer = timerMap.get(thread1);
                    timer.cancel();
                }
            }

            Jedis jedis = getJedis();
            String script =
                    "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                            "return 1; " +
                            "end; " +
                            "return 0;";
            try {
                Object result = jedis.eval(script, Collections.singletonList(lockKey),
                        Arrays.asList(INTERNAL_LOCK_LEASE_TIME + "", sessionId));
                if(result != null){
                    System.out.println(sessionId + " - 续租锁成功");

                }
            }finally {
                jedis.close();
            }
        }
    }
```