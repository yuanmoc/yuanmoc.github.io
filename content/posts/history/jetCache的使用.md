---
title: "Jet Cache的使用"
date: 2020-12-26 23:01:39.750000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
jetcahce是阿里出品的一套缓存系统，下面进行简单的使用，同时附上[官方文档](https://github.com/alibaba/jetcache/wiki/Home_CN)地址。

使用lettuce客户端连接redis的方式（jetcahce里面有jedis和lettuce两种连接redis的方式，个人比较喜欢使用lettuce，因为他是使用netty实现的，效率比较高，同时是多线程安全的）。

1、添加jetcache-starter-redis-lettuce和jetcache-starter-redis依赖
```xml
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis</artifactId>
    <version>2.5.14</version>
</dependency>
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis-lettuce</artifactId>
    <version>2.6.0</version>
</dependency>
```

2、为jetcache配置远程连接redis和本地缓存 
```yaml
jetcache:
  statIntervalMinutes: 15
  areaInCacheName: false
# 本地缓存，使用linkedhashmap实现
  local:
    default:
      type: linkedhashmap
      keyConvertor: fastjson
# 远程缓存，使用lettuce的方式连接
  remote:
    default:
      type: redis.lettuce
      keyConvertor: fastjson
      uri: redis://password@127.0.0.1:6379/
      valueEncoder: java
      valueDecoder: java
      poolConfig:
        minIdle: 5
        maxIdle: 20
        maxTotal: 50
```

3、添启动配置
@EnableMethodCache注解是激活@Cached注解的
@EnableCreateCacheAnnotation注解是激活CreateCache注解的
```java
@SpringBootApplication
@EnableMethodCache(basePackages = "com.example.jetcache.jetcache")
@EnableCreateCacheAnnotation
public class JetcacheApplication {

    public static void main(String[] args) {
        SpringApplication.run(JetcacheApplication.class, args);
    }

}
```

4、简单使用
```java

@Service
public class UserService {

    @CreateCache(name = "user", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    private Cache<String, UserVO> userCache;

    @CreateCache(name = "userList", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    private Cache<String, List<UserVO>> usersCache;

    @Resource
    private UserDao userDao;

    @Cached(name = "userList", key = "''", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    public List<UserVO> getUserList() {
        return userDao.getUserList();
    }

    @Cached(name = "user", key = "#id", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    public UserVO getById(Integer id) {
       return userDao.getById(id);
    }

    @CacheUpdate(name="user.", key="#user.id", value="#user")
    void updateUser(UserVO user) {
        userDao.updateUser(user);
    }

    @CacheInvalidate(name="user", key="#userId")
    void deleteUser(Integer userId) {
        userDao.deleteUser(userId);
    }

    public Boolean deleteById(Integer id) {
        userCache.REMOVE(String.valueOf(id));
        usersCache.REMOVE("");
        return userDao.deleteById(id);
    }
}

```

5、使用过程中缓存没有失效问题

在使用的过程中，出现了一次缓存无效，使用的时候搞了以下操作。
ftcahce是阿里出品的一套缓存系统，下面进行简单的使用，同时附上[官方文档](https://github.com/alibaba/jetcache/wiki/Home_CN)地址。

使用lettuce客户端连接redis的方式（jetcahce里面有jedis和lettuce两种连接redis的方式，个人比较喜欢使用lettuce，因为他是使用netty实现的，效率比较高，同时是多线程安全的）。

1、添加jetcache-starter-redis-lettuce和jetcache-starter-redis依赖
```xml
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis</artifactId>
    <version>2.5.14</version>
</dependency>
<dependency>
    <groupId>com.alicp.jetcache</groupId>
    <artifactId>jetcache-starter-redis-lettuce</artifactId>
    <version>2.6.0</version>
</dependency>
```

2、为jetcache配置远程连接redis和本地缓存 
```yaml
jetcache:
  statIntervalMinutes: 15
  areaInCacheName: false
# 本地缓存，使用linkedhashmap实现
  local:
    default:
      type: linkedhashmap
      keyConvertor: fastjson
# 远程缓存，使用lettuce的方式连接
  remote:
    default:
      type: redis.lettuce
      keyConvertor: fastjson
      uri: redis://password@127.0.0.1:6379/
      valueEncoder: java
      valueDecoder: java
      poolConfig:
        minIdle: 5
        maxIdle: 20
        maxTotal: 50
```

3、添启动配置
@EnableMethodCache注解是激活@Cached注解的
@EnableCreateCacheAnnotation注解是激活CreateCache注解的
```java
@SpringBootApplication
@EnableMethodCache(basePackages = "com.example.jetcache.jetcache")
@EnableCreateCacheAnnotation
public class JetcacheApplication {

    public static void main(String[] args) {
        SpringApplication.run(JetcacheApplication.class, args);
    }

}
```

4、简单使用
```java

@Service
public class UserService {

    @CreateCache(name = "user", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    private Cache<String, UserVO> userCache;

    @CreateCache(name = "userList", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    private Cache<String, List<UserVO>> usersCache;

    @Resource
    private UserDao userDao;

    @Cached(name = "userList", key = "''", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    public List<UserVO> getUserList() {
        return userDao.getUserList();
    }

    @Cached(name = "user", key = "#id", expire = UserConstants.CACHE_TIME_EXPIRE, cacheType = CacheType.REMOTE)
    public UserVO getById(Integer id) {
       return userDao.getById(id);
    }

    @CacheUpdate(name="user.", key="#user.id", value="#user")
    void updateUser(UserVO user) {
        userDao.updateUser(user);
    }

    @CacheInvalidate(name="user", key="#userId")
    void deleteUser(Integer userId) {
        userDao.deleteUser(userId);
    }

    public Boolean deleteById(Integer id) {
        userCache.REMOVE(String.valueOf(id));
        usersCache.REMOVE("");
        return userDao.deleteById(id);
    }
}

```

5、使用过程中缓存没有生效问题

在使用的过程中，出现了一次缓存无效，使用的时候搞了以下操作。

1、在外部调用getUser方法，而在类内调用createCache方法，同时缓存作用在createCache中，这时缓存就没有效果。

```java
@Service
public class InvalidUserService {

    @Resource
    private UserDao userDao;

    public UserVO getUser(UserVO userVO) {
        return createCache(userVO.getId());
    }

    @Cached(name = "user", key = "#userId")
    public UserVO createCache(Integer userId) {
        return userDao.getById(userId);
    }
}
```
主要的原因是AOP切面时，通过代理类调用了getUser方法，再在内部调用了createCache方法，这时，createCache方法没有经过代理类的调用，所以注解就没有效果。然后我们的解决方法是让我们的方法走代理就可以了。

2、我们可以通过下面方法来使其走到代理类的调用
（1）把 getUser方法 与 createCache 方法写于不同的类中。
（2）将自身注入到类中，并调用，强行走代理，即
```java
@Service
public class InvalidUserService {

    @Resource
    InvalidUserService self;

    @Resource
    private UserDao userDao;

    public UserVO getUser(UserVO userVO) {
        return self.createCache(userVO.getId());
    }

    @Cached(name = "user", key = "#userId")
    public UserVO createCache(Integer userId) {
        return userDao.getById(userId);
    }
}
```
（3）通过ApplicationContext获取代理对象，然后走代理

```java

@Service
public class InvalidUserService {

    @Resource
    private ApplicationContext applicationContext;

    @Resource
    private UserDao userDao;

    public UserVO getUser(UserVO userVO) {
        return applicationContext.getBean(InvalidUserService.class).createCache(userVO.getId());
    }

    @Cached(name = "user", key = "#userId")
    public UserVO createCache(Integer userId) {
        return userDao.getById(userId);
    }
}
```
