---
title: "Application Event和 Listener实现业务解耦"
date: 2021-06-26 17:24:22.370000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

ApplicationEvent以及Listener是Spring为我们提供的一个事件监听、订阅的实现，内部实现原理是观察者设计模式，设计初衷是为了系统业务逻辑解耦，提高可扩展性及可维护性。事件发布者并不需要考虑谁去监听，监听具体的内容是什么，发布者的工作只是为了发布时间而已。

# 创建并发布 ApplicationEvent 事件


1、创建一个ApplicationEvent事件实体,只要 extends ApplicationEvent，作用于发布事件时
```java
public class UserEvent extends ApplicationEvent {

    private UserVO userVO;

    public UserEvent(Object source, UserVO userVO) {
        super(source);
        this.userVO = userVO;
    }

    public UserVO getUserVO() {
        return userVO;
    }

    public void setUserVO(UserVO userVO) {
        this.userVO = userVO;
    }
}
```
2、创建一个业务Servie，并发布ApplicationEvent事件

```java

@Service
@Transactional
public class UserService {

    @Resource
    private UserDao userDao;

    @Resource
    private ApplicationContext applicationContext;

    public void testSave() {
        UserVO userVO = new UserVO();
        userVO.setName("123");
        userVO.setAge(18);
        userDao.save(userVO);
        applicationContext.publishEvent(new UserEvent(this, userVO));
        System.out.println("123123");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("123456");
    }
}
```
3、创建一个事务监听器，事务提交后，执行发布的内容
```java
@Component
public class UserListener {

    @TransactionalEventListener
    public void register(UserEvent userEvent) {
        // 获取用户对象
        UserVO userVO = userEvent.getUserVO();
        // 打印信息
        System.out.println("事务提交，执行");
    }

}
```

# Listener
可以同时监听一个事件执行不同的逻辑
- @EventListener
- @TransactionalEventListener
- ApplicationListener
- SmartApplicationListener

1、@EventListener 事件发布后马上执行
```java
@Component
public class UserListener {

    @EventListener
    public void register(UserEvent userEvent) {
        // 获取用户对象
        UserVO userVO = userEvent.getUserVO();
        // 打印信息
        System.out.println("发布后，马上执行");
    }

}
```
2、@TransactionalEventListener 事务提交后，才执行事件
```java
@Component
public class UserListener {

    @TransactionalEventListener
    public void register(UserEvent userEvent) {
        // 获取用户对象
        UserVO userVO = userEvent.getUserVO();
        // 打印信息
        System.out.println("事务提交，执行");
    }

}
```
3、ApplicationListener  原始方式实现，用户注册监听
```java
@Component
public class User2Listener implements ApplicationListener<UserEvent> {

    @Override
    public void onApplicationEvent(UserEvent userEvent) {
        // 获取用户对象
        UserVO userVO = userEvent.getUserVO();
        // 打印信息
        System.out.println("执行");
    }
}
```
4、SmartApplicationListener  实现有序监听
```java
@Component
public class User3Listener implements SmartApplicationListener {
    @Override
    public boolean supportsEventType(Class<? extends ApplicationEvent> aClass) {
        // 只有UserEvent监听类型才会执行下面逻辑
        return aClass == UserEvent.class;
    }

    @Override
    public boolean supportsSourceType(Class<?> sourceType) {
        // 只有在UserService内发布的事件类型是UserRegisterEvent事件时，才会执行下面逻辑
        return sourceType == UserService.class;
    }

    @Override
    public int getOrder() {
        // 同步情况下监听执行顺序，数值越小证明优先级越高，执行顺序越靠前
        return 0;
    }

    @Override
    public String getListenerId() {
        // 监听ID
        return SmartApplicationListener.super.getListenerId();
    }

    @Override
    public void onApplicationEvent(ApplicationEvent applicationEvent) {
        // 获取用户对象
        UserEvent userEvent = (UserEvent) applicationEvent;
        UserVO userVO = userEvent.getUserVO();
        // 打印信息
        System.out.println("User3Listener执行");
    }
}
```

# 其他基本类


添加依赖创建一个简单项目来测试

pom.xml文件：

```xml
<dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
         <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.2.6</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>RELEASE</version>
            <scope>compile</scope>
        </dependency>
    </dependencies>
```

application.yaml文件：

```yaml
spring:
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/test?useUnicode=true&characterEncoding=UTF-8&useSSL=false
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: yuanmoc
    type: com.alibaba.druid.pool.DruidDataSource
  jpa:
    #这个参数是在建表的时候，将默认的存储引擎切换为 InnoDB 用的
    database-platform: org.hibernate.dialect.MySQL5InnoDBDialect
    #配置在日志中打印出执行的 SQL 语句信息。
    show-sql: true
    hibernate:
      #配置指明在程序启动的时候要删除并且创建实体类对应的表
      ddl-auto: update
  application:
    name: springboot-test
```


实体

```java

@Entity
@Table(name = "user")
public class UserVO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }
}
```
dao
```java
@Repository
public interface UserDao extends JpaRepository<UserVO, Integer> {

}
```

controller

```java
@Controller
@ResponseBody
public class UserController {

    @Resource
    private UserService userService;

    @RequestMapping("/test")
    public String test() {
        userService.testSave();
        return "success";
    }
}
```

