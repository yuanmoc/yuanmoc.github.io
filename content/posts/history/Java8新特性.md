---
title: "Java8新特性"
date: 2020-07-29 11:41:55.610000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---
## Lambda表达式

Lambda 表达式的引入避免了匿名方法的麻烦使用，并且给予Java简单但是强大的函数化的编程能力。

**使用**
```java
// 在1.8之前使用
new Thread(new Runnable() {

    @Override
    public void run() {
        System.out.println("Before Java8!");
    }

}).start();

// 在1.8之后使用
new Thread(() -> System.out.println("In Java8!") ).start();
```

**语法**

基本语法: (parameters) -> expression 或 (parameters) ->{ statements; } 
```java
// 1. 不需要参数,返回值为 5  
() -> {return 5;}
() -> 5   // 只有一行，可以省略{}和return

  
// 2. 接收一个参数(数字类型),返回其2倍的值  
(x) -> 2 * x  
  
// 3. 接受2个参数(数字),并返回他们的差值  
(x, y) -> x – y  
  
// 4. 接收2个int型整数,返回他们的和  
(int x, int y) -> x + y  
  
// 5. 接受一个 string 对象,并在控制台打印,不返回任何值(看起来像是返回void)  
(String s) -> System.out.print(s)
```

Java SE 8中增加了一个新的包：java.util.function
- `Predicate<T> -> boolean test(T t);`       接收 T 并返回 boolean
- `Consumer<T> -> void accept(T t);`        接收 T，不返回值
- `Function<T, R> -> R apply(T t);`     接收 T，返回 R
- `Supplier<T> -> T get();`        提供 T 对象（例如工厂），不接收值
- `UnaryOperator<T> -> R apply(T t);`   接收 T 对象，返回 T
- `BinaryOperator<T> -> R apply(T t, U u);`  接收两个 T，返回 T


## 新的日期API

1.8之前JDK自带的日期处理类非常不方便，而面对这一缺点，新的java.time包涵盖了所有处理日期，时间，日期/时间，时区，时刻（instants），过程（during）与时钟（clock）的操作。

**LocalDate/LocalTime/LocalDateTime**
- LocalDate为日期处理类
- LocalTime为时间处理类
- LocalDateTime为日期时间处理类

```java
LocalDateTime ldt = LocalDateTime.now();
// 通过静态方法of()方法参数可以指定年月日时分秒
LocalDateTime of = LocalDateTime.of(2018, 12, 30, 20, 20, 20);

与获取相关的方法:get系类的方法
getYear() 获取年
getMinute() 获取分钟
getHour() 获取小时
getDayOfMonth 获得月份天数(1-31)
getDayOfYear 获得年份天数(1-366)
getDayOfWeek 获得星期几(返回一个 DayOfWeek枚举值)
getMonth 获得月份, 返回一个 Month 枚举值
getMonthValue 获得月份(1-12)
getYear 获得年份

格式化日期
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
LocalDateTime ldt = LocalDateTime.parse("2018-01-21 20:30:36", formatter);

String yyyy = ldt.format(DateTimeFormatter.ofPattern("yyyy"));

判断的方法
isAfter()判断一个日期是否在指定日期之后
isBefore()判断一个日期是否在指定日期之前
isEqual(); 判断两个日期是否相同

添加年月日时分秒的方法 plus系列的方法 都会返回一个新的LocalDateTime的对象
LocalDateTime localDateTime = ldt.plusYears(1);
LocalDateTime localDateTime1 = ldt.plusMonths(3);
LocalDateTime localDateTime2=ldt.plusHours(10);

减去年月日时分秒的方法 minus 系列的方法
LocalDateTime localDateTime2 = ldt.minusYears(8);

指定年月日时分秒的方法 with系列的方法
LocalDateTime localDateTime3 = ldt.withYear(1998);

获取这个月的第几个星期几是几号
TemporalAdjusters.dayOfWeekInMonth(2, DayOfWeek.FRIDAY) 代表的意思是这个月的第二个星期五是几号
LocalDateTime with1 = now.with(TemporalAdjusters.dayOfWeekInMonth(2,DayOfWeek.FRIDAY));

```


**Instant 时间戳**
```java
Instant ins = Instant.now();
```


**ZonedDate、ZonedTime、ZonedDateTime**
- 带时区的时间或日期
```java
// 查看java8中支持的时区有哪些
Set<String> zones= ZoneId.getAvailableZoneIds();

// 获取一个指定的时区
ZoneId zoneId = ZoneId.of("Asia/Shanghai");

LocalDateTime localDateTime = LocalDateTime.now(zoneId);
ZonedDateTime zonedDateTime = localDateTime.atZone(zoneId);
```

**Duration、Period**
- Duration:用于计算两个“时间”间隔
- Period:用于计算两个“日期”间隔
```java
// 比较之后得到的是一个Duration对象，然后调用对象相应的方法
Instant instant1 = Instant.now();
Instant instant2 = Instant.now();
Duration duration = Duration.between(instant1, instant2);

// 比较之后得到的是一个Period对象，然后调用对象相应的方法
LocalDate localDate = LocalDate.now();
LocalDate localDate2 = LocalDate.of(2018, 1, 12);
Period period=Period.between(localDate, localDate2);
```


**TemporalAdjusters**
- 这个类在日期调整时非常有用，比如得到当月的第一天、最后一天，当年的第一天、最后一天，下一周或前一周的某天等
```java
LocalDate now = LocalDate.now();
LocalDate with = now.with(TemporalAdjusters.lastDayOfYear());
```

**DateTimeFormatter**
- 配合LocalDate/LocalTime/LocalDateTime使用，比如想把当前日期格式化成yyyy-MM-dd hh:mm:ss的形式。
```java
LocalDateTime now = LocalDateTime.now();
DateTimeFormatter timeFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
String time = now.format(timeFormat);

DateTimeFormatter dateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
LocalDateTime parse = LocalDateTime.parse(time, timeFormat);
```

## 引入Optional
Optional 类的引入是为了解决空指针异常问题，这样我们就不用显式进行空值检测。

常用操作：

- Optional.of(T t) : 创建一个 Optional 实例
- Optional.empty() : 创建一个空的 Optional 实例
- Optional.ofNullable(T t):若 t 不为 null,创建 Optional 实例,否则创建空实例
- isPresent() : 判断是否包含值 orElse(T t) : 如果调用对象包含值，返回该值，否则返回t
- orElseGet(Supplier s) :如果调用对象包含值，返回该值，否则返回 s 获取的值
- map(Function f): 如果有值对其处理，并返回处理后的Optional，否则返回Optional.empty()
- flatMap(Function mapper):与 map 类似，要求返回值必须是Optional

## 使用Base64

**实例方法**
java.util.Base64 类仅由用于获得Base64编码方案的编码器和解码器的静态方法组成。

|方法名|描述|
|----|----|
|getDecoder()|返回Base64.Decoder解码使用Basic型base64编码方案。|
|getEncoder()|返回一个Base64.Encoder编码使用Basic型base64编码方案。|
|getMimeDecoder()|返回一个Base64.Decoder解码使用MIME型BASE64解码方案。|
|getMimeEncoder()|返回一个Base64.Encoder编码使用MIME型base64编码方案。|
|getMimeEncoder(int lineLength, byte[] lineSeparator)|返回一个Base64.Encoder ，它使用具有指定行长度和行分隔符的MIME类型base64编码方案进行编码。|
|getUrlDecoder()|返回Base64.Decoder解码使用URL and Filename safe型base64编码方案。|
|getUrlEncoder()|返回一个Base64.Encoder编码使用URL and Filename safe型base64编码方案。|

**Encoder**

|方法|描述|
|--|--|
|byte[] encode(byte[] src)|使用Base64编码方案将指定字节数组中的所有字节编码为新分配的字节数组。|
|int encode(byte[] src, byte[] dst)|使用Base64编码方案对来自指定字节数组的所有字节进行编码，将生成的字节写入给定的输出字节数组，从偏移0开始。|
|ByteBuffer encode(ByteBuffer buffer)|使用Base64编码方案将所有剩余字节从指定的字节缓冲区编码到新分配的ByteBuffer中。|
|String	encodeToString(byte[] src)|使用Base64编码方案将指定的字节数组编码为字符串。|
|Base64.Encoder withoutPadding()|返回一个编码器实例，编码器等效于此编码器实例，但不会在编码字节数据的末尾添加任何填充字符。|
|OutputStream wrap(OutputStream os)|使用Base64编码方案包装用于编码字节数据的输出流。|

**Decoder**

|方法|描述|
|--|--|
|byte[] decode(byte[] src)|使用Base64编码方案从输入字节数组中解码所有字节，将结果写入新分配的输出字节数组。|
|int decode(byte[] src, byte[] dst)|使用Base64编码方案从输入字节数组中解码所有字节，将结果写入给定的输出字节数组，从偏移0开始。|
|ByteBuffer decode(ByteBuffer buffer)|使用Base64编码方案从输入字节缓冲区中解码所有字节，将结果写入新分配的ByteBuffer。|
|byte[] decode(String src)|使用Base64编码方案将Base64编码的字符串解码为新分配的字节数组。|
|InputStream wrap(InputStream is)|返回一个输入流，用于解码Base64编码字节流。|


**简单使用**

```java
String str= "hello world!";
// 加密
String desc = Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8));
// 解密
byte[] unDecodeStr = Base64.getDecoder().decode(desc);
```


## 接口的默认方法
在方法的前面添加 default 实现默认接口的定义。

以前当需要修改接口的时候，需要修改全部实现该接口的类。而引进的默认方法的目的是为了解决接口的修改与现有的实现不兼容的问题。

## 方法引用

方法引用是用来直接访问类或者实例的已经存在的方法或者构造方法。方法引用是一个Lambda表达式，其中方法引用的操作符是双冒号"::"。

```java
类名::静态方法名

对象::实例方法名

对象的超类方法引用语法： super::MethodName

类构造器引用语法： ClassName::new 例如：ArrayList::new

数组构造器引用语法： TypeName[]::new 例如： String[]:new

类名::实例方法名 
```

## Stream/ParallelStream 类

Java 8 API添加了一个新的抽象称为流Stream，把真正的函数式编程风格引入到Java中，可以让你以一种声明的方式处理数据。

Stream/ParallelStream 是对集合的包装,通常和lambda一起使用。 使用lambdas可以支持许多操作,如 map, filter, limit, sorted, count, min, max, sum, collect 等等。其中ParallelStream 并行流是并行执行线程不安全的，同时也是无序的。

**流的生成方法**

- Collection接口的stream()或parallelStream()方法
- 静态的Stream.of()、Stream.empty()方法
- Arrays.stream(array, from, to)
- 静态的Stream.generate()方法生成无限流，接受一个不包含引元的函数
- 静态的Stream.iterate()方法生成无限流，接受一个种子值以及一个迭代函数
- Pattern接口的splitAsStream(input)方法
- 静态的Files.lines(path)、Files.lines(path, charSet)方法
- 静态的Stream.concat()方法将两个流连接起来

**流的Intermediate方法(中间操作)**

- filter(Predicate) ：将结果为false的元素过滤掉
- map(fun) ：转换元素的值，可以用方法引元或者lambda表达式
- flatMap(fun) ：若元素是流，将流摊平为正常元素，再进行元素转换
- limit(n) ：保留前n个元素
- skip(n) ：跳过前n个元素
- distinct() ：剔除重复元素
- sorted() ：将Comparable元素的流排序
- sorted(Comparator) ：将流元素按Comparator排序
- peek(fun) ：流不变，但会把每个元素传入fun执行，可以用作调试

 
**流的Terminal方法(终结操作)**

（1）约简操作
- reduce(fun) ：从流中计算某个值，接受一个二元函数作为累积器，从前两个元素开始持续应用它，累积器的中间结果作为第一个参数，流元素作为第二个参数
- reduce(a, fun) ：a为幺元值，作为累积器的起点
- reduce(a, fun1, fun2) ：与二元变形类似，并发操作中，当累积器的第一个参数与第二个参数都为流元素类型时，可以对各个中间结果也应用累积器进行合并，但是当累积器的第一个参数不是流元素类型而是类型T的时候，各个中间结果也为类型T，需要fun2来将各个中间结果进行合并

（2）收集操作
- iterator()：
- forEach(fun)：
- forEachOrdered(fun) ：可以应用在并行流上以保持元素顺序
- toArray()：
- toArray(T[] :: new) ：返回正确的元素类型
- collect(Collector)：
- collect(fun1, fun2, fun3) ：fun1转换流元素；fun2为累积器，将fun1的转换结果累积起来；fun3为组合器，将并行处理过程中累积器的各个结果组合起来

 
（3）查找与收集操作

- max(Comparator)：返回流中最大值
- min(Comparator)：返回流中最小值
- count()：返回流中元素个数
- findFirst() ：返回第一个元素
- findAny() ：返回任意元素
- anyMatch(Predicate) ：任意元素匹配时返回true
- allMatch(Predicate) ：所有元素匹配时返回true
- noneMatch(Predicate) ：没有元素匹配时返回true

## 注解相关的改变

在Java 8中使用@Repeatable注解定义重复注解。

```java
// ---没有使用重复注解之前---
public @interface Authority {
     String role();
}

public @interface Authorities {   //@Authorities注解作为可以存储多个@Authority注解的容器
    Authority[] value();
}

public class RepeatAnnotationUseOldVersion {
    @Authorities({@Authority(role="Admin"), @Authority(role="Manager")})
    public void doSomeThing(){
    }
}

// ---使用重复注解之后---

@Repeatable(Authorities.class)
public @interface Authority {
     String role();
}
// @Authorities注解作为可以存储多个@Authority注解的容器
public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseNewVersion {
    @Authority(role="Admin")
    @Authority(role="Manager")
    public void doSomeThing(){ }
}
```

在 java8 以前，注解只能用在各种程序元素（定义类、定义接口、定义方法、定义成员变量）上。从 java8 开始，类型注解可以用在任何使用到类型的地方。
新增类型：
- `TYPE_PARAMETER`：表示该注解能写在类型参数的声明语句中。 类型参数声明如： `<T>、<T extends Person>`。
- `TYPE_USE`：表示注解可以再任何用到类型的地方使用，比如允许在如下位置使用。

**全部类型**

```java
public enum ElementType {
    // 用于描述类、接口(包括注解类型) 或enum声明 Class, interface 
    TYPE,
 
    // 用于描述域 Field declaration 
    FIELD,
 
    // 用于描述方法 Method declaration
    METHOD,
 
    // 用于描述参数 Formal parameter declaration
    PARAMETER,
 
    // 用于描述构造器 Constructor declaration
    CONSTRUCTOR,
 
    // 用于描述局部变量 Local variable declaration
    LOCAL_VARIABLE,
 
    // 注解 Annotation type declaration 
    ANNOTATION_TYPE,
 
    // 用于描述包 Package declaration
    PACKAGE,
 
    // 1.8,用来标注类型参数 Type parameter declaration
    TYPE_PARAMETER,
 
    // 1.8,能标注任何类型名称 Use of a type
    TYPE_USE
}
```

**简单使用**
```java
// --TYPE_PARAMETER的使用---
@Target(ElementType.TYPE_PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface TypeParameterAnnotation {
     
}

// 如下是该注解的使用例子
public class TypeParameterClass<@TypeParameterAnnotation T> {
    public <@TypeParameterAnnotation U> T foo(T t) {
        return null;
    }   
}

// ---TYPE_USE的使用---

@Target(ElementType.TYPE_USE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TypeUseAnnotation {
         
}

// 如下是该注解的使用例子
public class TestTypeUse {
     
    public static @TypeUseAnnotation class TypeUseClass<@TypeUseAnnotation T> extends @TypeUseAnnotation Object {
        public void foo(@TypeUseAnnotation T t) throws @TypeUseAnnotation Exception {
             
        }
    }
     
    // 如下注解的使用都是合法的
    @SuppressWarnings({ "rawtypes", "unused", "resource" })
    public static void main(String[] args) throws Exception {
        TypeUseClass<@TypeUseAnnotation String> typeUseClass = new @TypeUseAnnotation TypeUseClass<>();
        typeUseClass.foo("");
        List<@TypeUseAnnotation Comparable> list1 = new ArrayList<>();
        List<? extends Comparable> list2 = new ArrayList<@TypeUseAnnotation Comparable>();
        @TypeUseAnnotation String text = (@TypeUseAnnotation String)new Object();
        java.util. @TypeUseAnnotation Scanner console = new java.util.@TypeUseAnnotation Scanner(System.in);
    }
}
```