---
title: "Nacos的使用"
date: 2020-12-26 10:55:28.499000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---

## 配置中心

启动配置中心
### 在SpringBoot中使用
1、添加web依赖和nacos配置中心依赖
```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba.boot</groupId>
        <artifactId>nacos-config-spring-boot-starter</artifactId>
        <version>0.2.1</version>
    </dependency>
    <dependency>
        <groupId>com.alibaba.boot</groupId>
        <artifactId>nacos-config-spring-boot-actuator</artifactId>
        <version>0.2.1</version>
    </dependency>
```
2、在配置文件application.properties中添加nacos配置
```properties
# Nacos配置中心地址
nacos.config.server-addr=127.0.0.1:8848

# endpoint http://localhost:8080/actuator/nacos-config
# health http://localhost:8080/actuator/health
# 不需要身份验证的情况下访问所有actuator端点
management.endpoints.web.exposure.include=*
# 将健康信息展示给所有用户
management.endpoint.health.show-details=always
```
3、在配置类中启用Nacos配置中心
```java
@SpringBootApplication
@NacosPropertySource(dataId = "example", groupId = "DEFAULT_GROUP", autoRefreshed = true)
public class NacosConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(NacosConfigApplication.class, args);
    }
}
```

其中dataId和groupId对应我们在配置中心中配置的DataId和group值。如下图
![Nacos配置中心](/images/image-0cfb0c52d14542e0b582fc365ad02df5.png)

4、示例代码测试。
```java
@Controller
@RequestMapping("config")
public class ConfigController {

    @NacosValue(value = "${useLocalCache:false}", autoRefreshed = true)
    private boolean useLocalCache;

    @RequestMapping(value = "/get", method = GET)
    @ResponseBody
    public boolean get() {
        return useLocalCache;
    }
}
```

### 在SpringCloud中使用
1、添加web和Nacos依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>0.2.1.RELEASE</version>
</dependency>
```

2、在boostrap.properties中配置Nacos
```properties
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
spring.application.name=example
spring.cloud.nacos.config.file-extension=properties
```

在 Nacos Spring Cloud 中，dataId 的完整格式如下：

`${prefix}-${spring.profiles.active}.${file-extension}`
- prefix 默认为 `spring.application.name` 的值，也可以通过配置项 `spring.cloud.nacos.config.prefix`来配置。
- spring.profiles.active 即为当前环境对应的 profile，详情可以参考 Spring Boot文档。 注意：当 spring.profiles.active 为空时，对应的连接符 - 也将不存在，dataId 的拼接格式变成 `${prefix}.${file-extension}`
- file-exetension 为配置内容的数据格式，可以通过配置项 `spring.cloud.nacos.config.file-extension` 来配置。目前只支持 properties 和 yaml 类型。

3、示例代码
```java
@RestController
@RequestMapping("/config")
@RefreshScope
public class ConfigController {

    @Value("${useLocalCache:false}")
    private boolean useLocalCache;

    /**
     * http://localhost:8080/config/get
     */
    @RequestMapping("/get")
    public boolean get() {
        return useLocalCache;
    }
}
```

### 多配置文件
很多应用都会用到多个配置文件管理配置，比如我们现在想要配置一个mysql和一个redis，但是又不想单独放在一个配置文件中，这时，我们就可以引用多个配置文件。

```properties
spring.application.name=multi-data-ids-example

spring.cloud.nacos.config.server-addr=127.0.0.1:8848

# 配置一个应用级的配置，需要自动刷新配置。
spring.cloud.nacos.config.ext-config[0].data-id=app.properties
spring.cloud.nacos.config.ext-config[0].group=multi-data-ids
spring.cloud.nacos.config.ext-config[0].refresh=true

# 配置一个Mysql数据源配置。
spring.cloud.nacos.config.ext-config[1].data-id=datasource.properties
spring.cloud.nacos.config.ext-config[1].group=multi-data-ids

# 配置一个Redis数据源配置。
spring.cloud.nacos.config.ext-config[2].data-id=redis.properties
spring.cloud.nacos.config.ext-config[2].group=multi-data-ids
```

除了这样引入，我们还可以使用注解的形式引入
```java

@SpringBootApplication
@NacosPropertySources({
        @NacosPropertySource(dataId = "app.properties", groupId = "multi-data-ids", autoRefreshed = true),
        @NacosPropertySource(dataId = "datasource.properties", groupId = "multi-data-ids", autoRefreshed = false),
        @NacosPropertySource(dataId = "redis.properties", groupId = "multi-data-ids", autoRefreshed = false)
})
public class SpringBootMySQLApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootMySQLApplication.class, args);
    }
}
```

## 注册中心


### 服务发现
1、添加依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <exclusions>
            <exclusion>
                <groupId>com.alibaba.nacos</groupId>
                <artifactId>nacos-client</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.hibernate</groupId>
        <artifactId>hibernate-validator</artifactId>
        <version>5.1.0.Final</version>
    </dependency>
</dependencies>
```

2、配置Nacos服务地址
```properties
server.port=8070
spring.application.name=service-provider
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

3、启用服务发现,并编写测试接口
```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosProviderApplication {

	public static void main(String[] args) {
		SpringApplication.run(NacosProviderApplication.class, args);
	}

	@RestController
	class EchoController {
		@RequestMapping(value = "/echo/{string}", method = RequestMethod.GET)
		public String echo(@PathVariable String string) {
			return "Hello Nacos Discovery " + string;
		}
	}
}
```

### 服务消费

1、添加依赖
```properties
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
        <version>2.0.0.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-openfeign</artifactId>
        <version>2.0.0.RELEASE</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <exclusions>
            <exclusion>
                <groupId>com.alibaba.nacos</groupId>
                <artifactId>nacos-client</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>com.alibaba.nacos</groupId>
        <artifactId>nacos-client</artifactId>
    </dependency>
</dependencies>
```

2、配置Nacos地址
```properties
server.port=8080
spring.application.name=service-consumer
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```

3、启用服务发现与消费
```java
@SpringBootApplication
@EnableDiscoveryClient
public class NacosConsumerApplication {

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }

    @RestController
    public class TestController {

        private final RestTemplate restTemplate;

        @Autowired
        public TestController(RestTemplate restTemplate) {this.restTemplate = restTemplate;}

        @RequestMapping(value = "/echo/{str}", method = RequestMethod.GET)
        public String echo(@PathVariable String str) {
            return restTemplate.getForObject("http://service-provider/echo/" + str, String.class);
        }
    }
}

```

4、使用OpenFeign来调用

Feign类
```java
@FeignClient("service-provider")
public interface RemoteServer {

    @RequestMapping(value = "/echo/{string}")
    String echo(@PathVariable("string") String string);
}

```
Feign远程调用，要启用@EnableFeignClients
```java
@SpringBootApplication
@RestController
@EnableDiscoveryClient
@EnableFeignClients
public class NacosConsumerApplication {

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public static void main(String[] args) {
        SpringApplication.run(NacosConsumerApplication.class, args);
    }

    @Resource
    private RemoteServer remoteServer;

    @RequestMapping(value = "/feign/echo/{str}", method = RequestMethod.GET)
    public String feignEcho(@PathVariable String str) {
        return remoteServer.echo(str);
    }

}
```

完结。