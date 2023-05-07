---
title: "使用 Spring实现一个策略"
date: 2020-12-26 17:51:08.942000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
在很多场景中，我们都需要根据不同的行为调用不同的一个实现业务逻辑，这里就可以使用策略模式来实现。

下面在Spring中来实现一个策略模式,场景：根据不同的打印方式，调用不同的打印指令。

下面主要使用了注解与Spring BeanPostProcessor 相结合，在项目启动时，将注解的类添加到PrinterStrategy中管理，然后通过传过来的参数获取相应的类去执行。


1、创建一个枚举类，记录类型

```java
public enum PrinterEnum {
    ESC,TSC
}

```

2、创建一个注解类，用于添加标识类型并交于Spring管理
```java
@Target(value = ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Component
public @interface PrinterAnnotation {

    /**
     * type 类别
     * @return
     */
    PrinterEnum type() default PrinterEnum.ESC;

    String description() default "";
}
```

3、创建一个抽象打印类
```java
public abstract class PrinterAbstract {

    public abstract void getPrintEsc();
}
```

4、实现两种打印方式，并为其加上打印注解
```java
@PrinterAnnotation(type = PrinterEnum.ESC)
public class EscPrinter extends PrinterAbstract {

    public void getPrintEsc() {
        System.out.println("esc");
    }
}

@PrinterAnnotation(type = PrinterEnum.TSC)
public class TscPrinter extends PrinterAbstract {

    public void getPrintEsc() {
        System.out.println("tsc");
    }
}

```

5、创建一个静态方法，方便获取与使用
```java
public class PrinterStrategy {

    private static Map<PrinterEnum, PrinterAbstract> printers;

    static {
        printers = new ConcurrentHashMap<PrinterEnum, PrinterAbstract>();
    }

    public static PrinterAbstract getPrinters(PrinterEnum type) {
        if (printers != null) {
            return printers.get(type);
        }
        return null;
    }

    public static void setPrinters(PrinterEnum type, PrinterAbstract printerAbstract) {
        printers.put(type, printerAbstract);
    }
}
```

6、在项目启动时，将打印类添加到 PrinterStrategy 中管理
```java
@Component
public class PrinterProcessor implements BeanPostProcessor {

    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        Class<?> aClass = bean.getClass();
        if (aClass.isAnnotationPresent(PrinterAnnotation.class)) {
            PrinterAnnotation annotation = aClass.getAnnotation(PrinterAnnotation.class);
            PrinterEnum type = annotation.type();
            PrinterStrategy.setPrinters(type, (PrinterAbstract) bean);
        }
        return bean;
    }

    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

6、可以调用并使用
```java
@SpringBootApplication
@RestController
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @RequestMapping("/test/{printerType}")
    public String test(@PathVariable PrinterEnum printerType) {
        PrinterAbstract printers = PrinterStrategy.getPrinters(printerType);
        if (printers != null) {
            printers.getPrintEsc();
        }
        return "success";
    }
}
```