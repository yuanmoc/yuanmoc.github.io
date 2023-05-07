---
title: "使用jetcache@ Create Cache创建两个缓存对象，发现配置全部使用了第一个"
date: 2021-10-28 15:28:43.621000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
使用@CreateCache创建两个缓存对象，由于这两个缓存对象都使用的 area 和 name 是一样的，导致了创建的第二个缓存对象没有生效，而是使用了第一个缓存对象。

主要排查为什么会使用到了第一个缓存的对象。

```java
/** 第一个缓存对象 */
@CreateCache(name = "pre", cacheType = CacheType.REMOTE, expire = Integer.MAX_VALUE, timeUnit = TimeUnit.SECONDS)
private Cache<String, List<PopupsVO>> popupsCache;

/** 第二个缓存对象 */
@CreateCache(name = "pre", cacheType = CacheType.REMOTE, expire = 60, timeUnit = TimeUnit.SECONDS)
private Cache<String, List<Integer>> popupsCacheUserPopupsIds;

```

请求时，会先初始化缓存配置config，`com.alicp.jetcache.anno.field.LazyInitCache#checkInit` ,由于已经初始化过了，debug把 this.inited 改成false。重新进入初始化环节。

```java
    private void checkInit() {
        if (!this.inited) {
            synchronized(this) {
                if (!this.inited) {
                    this.init();
                    this.inited = true;
                }
            }
        }

    }
```

在`com.alicp.jetcache.anno.field.LazyInitCache#init` 进行初始化，

```java
 private void init() {
        if (this.inited) {
            throw new IllegalStateException();
        } else {
            GlobalCacheConfig globalCacheConfig = (GlobalCacheConfig)this.beanFactory.getBean(GlobalCacheConfig.class);
            ConfigProvider configProvider = (ConfigProvider)this.beanFactory.getBean(ConfigProvider.class);
            CachedAnnoConfig cac = new CachedAnnoConfig();
            cac.setArea(this.ann.area());
            cac.setName(this.ann.name());
            cac.setTimeUnit(this.ann.timeUnit());
            cac.setExpire((long)this.ann.expire());
            cac.setLocalExpire((long)this.ann.localExpire());
            cac.setCacheType(this.ann.cacheType());
            cac.setLocalLimit(this.ann.localLimit());
            cac.setSerialPolicy(this.ann.serialPolicy());
            cac.setKeyConvertor(this.ann.keyConvertor());
            cac.setRefreshPolicy(this.refreshPolicy);
            cac.setPenetrationProtectConfig(this.protectConfig);
            String cacheName = cac.getName();
            if (CacheConsts.isUndefined(cacheName)) {
                String[] hiddenPackages = globalCacheConfig.getHiddenPackages();
                CacheNameGenerator g = configProvider.createCacheNameGenerator(hiddenPackages);
                cacheName = g.generateCacheName(this.field);
            }

            this.cache = configProvider.getCacheContext().__createOrGetCache(cac, this.ann.area(), cacheName);
        }
    }
```

在这里发现没有什么可以使配置无效的，进入下一个环节分析 `com.alicp.jetcache.anno.support.CacheContext#__createOrGetCache`

```java
    public Cache __createOrGetCache(CachedAnnoConfig cachedAnnoConfig, String area, String cacheName) {
        String fullCacheName = area + "_" + cacheName;
        Cache cache = this.cacheManager.getCacheWithoutCreate(area, cacheName);
        if (cache == null) {
            synchronized(this) {
                cache = this.cacheManager.getCacheWithoutCreate(area, cacheName);
                if (cache == null) {
                    if (this.globalCacheConfig.isAreaInCacheName()) {
                        cache = this.buildCache(cachedAnnoConfig, area, fullCacheName);
                    } else {
                        cache = this.buildCache(cachedAnnoConfig, area, cacheName);
                    }

                    this.cacheManager.putCache(area, cacheName, cache);
                }
            }
        }

        return cache;
    }
```

在这里，发现如果能拿到配置就不初始化了，也可能是问题的所在，接着进入this.cacheManager.getCacheWithoutCreate(area, cacheName);分析。

```java
    public Cache getCacheWithoutCreate(String area, String cacheName) {
        ConcurrentHashMap<String, Cache> areaMap = this.getCachesByArea(area);
        return (Cache)areaMap.get(cacheName);
    }
```

发现缓存管理器以 area 和 cacheName 来保存记录了缓存实例的配置，也就是说，如果第一个缓存初始化了缓存配置，第二个缓存通过 area 和 cacheName 来查询，发现已经有了配置，就直接拿来使用。

最终解决，如果要使两个缓存实例使用不一样的配置，那就要使两个缓存实例的 area 或者 cacheName 不一样。完结.....