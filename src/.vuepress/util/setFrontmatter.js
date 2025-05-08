import fs from 'fs'; // 文件模块
import matter from 'gray-matter'; // FrontMatter解析器 https://github.com/jonschlinkert/gray-matter
import jsonToYaml from 'json2yaml'
import chalk from 'chalk' // 命令行打印美化
import os from 'os';
import path from "path";
import { watch } from "chokidar";

const excludeDirectory = [
    '.vuepress',
    '@pages',
    '.github',
    '.idea',
    '.git',
    'node_modules',
    '.DS_Store',
    'README.md'
]

// 预设标签类型
const tagStr = "Java 基础,变量与数据类型,运算符,控制结构,类与对象,继承,多态,封装,抽象类,内部类,枚举,异常处理,泛型,注解,反射机制,Java 序列化,Lambda 表达式,Stream API, 函数式接口,方法引用,Java 8 新特性,Java 9 新特性,Java 10 新特性,Java 11 新特性,Java 12 新特性,Java 13 新特性,Java 14 新特性,Java 15 新特性,Java 16 新特性,Java 17 新特性,Java 18 新特性,Java 19 新特性,Java 20 新特性,设计模式,单例模式,工厂模式,抽象工厂模式,建造者模式,原型模式,适配器模式,桥接模式,组合模式,装饰器模式,外观模式,享元模式,代理模式,责任链模式,命令模式,解释器模式,迭代器模式,中介者模式,备忘录模式,观察者模式,状态模式,策略模式,模板方法模式,访问者模式,MVC 模式,MVVM 模式,MVP 模式,集合框架,List,ArrayList,LinkedList,Vector,Stack,Set,HashSet,LinkedHashSet,TreeSet,Map,HashMap,LinkedHashMap,TreeMap,ConcurrentHashMap, 队列,优先队列,双端队列,数据结构算法,排序算法,查找算法,多线程,线程创建,线程同步,synchronized 关键字,Lock 接口,ReentrantLock, 读写锁,线程池,ExecutorService,Fork/Join 框架,并发集合,ConcurrentLinkedQueue,CopyOnWriteArrayList,CountDownLatch,CyclicBarrier,Semaphore,Exchanger, 原子类,死锁,线程安全,输入输出流,字节流,字符流,缓冲流,转换流,对象流,文件读写,RandomAccessFile,NIO, 缓冲区,通道,Path 与 Files 类,网络编程,Socket 编程,TCP 协议,UDP 协议,HTTP 协议,HttpClient,WebSocket, 网络通信优化,服务器端编程,客户端编程,数据库编程,JDBC, 数据库连接池,数据库事务,SQL 语句,数据库增删改查,数据库索引,数据库优化,MySQL,Oracle,PostgreSQL,SQL Server,SQLite,Redis,MongoDB,Elasticsearch,HBase,Cassandra,Spring,Spring Boot,Spring Cloud,Spring MVC,Spring Data,Spring Security,MyBatis,Hibernate,Struts,Play Framework,JUnit,Mockito,PowerMock,Selenium,Log4j,Logback,SLF4J,Apache Commons,Google Guava,RxJava,Project Reactor,Jackson,Gson,Lombok,IntelliJ IDEA,Eclipse,NetBeans,Maven,Gradle,Git,SVN,Docker,Kubernetes,Jenkins,GitLab CI/CD,SonarQube,VisualVM,YourKit,JProfiler,软件架构,微服务架构,单体架构,分布式架构,分层架构,领域驱动设计（DDD）,六边形架构,事件驱动架构,RESTful 架构,GraphQL 架构,API 设计,缓存架构,消息队列架构,服务网格,云计算,AWS,阿里云,腾讯云,华为云,大数据,Hadoop,Spark,Flink,Kafka,Pig,Sqoop,Oozie,Zookeeper,人工智能,机器学习,Java 机器学习库,TensorFlow Java,Deeplearning4j,神经网络,自然语言处理,计算机视觉,Java 安全编程,身份验证与授权,OAuth 2.0,JWT,加密算法,代码安全审计,性能优化,代码重构,内存管理,Java 内存模型,垃圾回收机制,系统监控,性能测试,敏捷开发,Scrum,Kanban,持续集成与持续部署（CI/CD）,代码审查,静态代码分析工具,代码质量保障,技术选型,开源项目贡献,Java 核心技术,Java 并发编程,JVM,JVM 调优,JVM 原理,面向对象设计,异常处理,反射,NIO,Spring Cloud Native,Quarkus,Micronaut,微服务,分布式系统,RESTful API,SOAP,云原生,微服务治理,服务网格,Istio,Knative,Serverless,响应式编程,API 网关,服务发现,负载均衡,分布式事务,缓存,Ehcache,消息队列,RabbitMQ,RocketMQ,分布式存储,数据库,NoSQL,ORM,Spring Batch,Quartz,定时任务,SSL/TLS,并发优化,代码质量,单元测试,集成测试,自动化测试,重构,DevOps,持续集成,持续部署,Azure,边缘计算,区块链,物联网,微前端,函数计算,事件驱动架构,响应式架构,CQRS,领域建模,DDD 实践,代码规范,最佳实践,学习笔记,入门教程,进阶指南,实战项目,开源项目,源码解析,技术选型,版本升级,模块化,Jigsaw,反应式流,Web 开发,Servlet,Spring WebFlux,Jakarta EE,HTTP/2,gRPC,Protobuf,Thrift,服务限流,熔断,降级,分布式配置中心,服务注册与发现,分布式锁,分布式 ID,容器化最佳实践,K8s 集群管理,Helm,Service Mesh 实践,云函数,微服务拆分,单体应用迁移,设计模式应用,性能测试,APM,日志收集,分布式追踪,安全编码,OWASP,依赖管理,漏洞扫描,代码审计,静态代码分析,持续测试,自动化部署,蓝绿部署,金丝雀发布,混沌工程,容灾备份,内存泄漏排查,类加载机制,字节码编程,动态代理,CAS,volatile,JUC,垃圾回收算法,CMS,G1,ZGC,JMM,JMH,函数式编程,Optional,CompletableFuture,反应式编程库,云原生设计模式,12 因素应用,容器化设计,服务网格架构,Serverless 设计模式,无状态服务,事件溯源,CQRS 实践,领域建模工具,设计模式实战,TDD,BDD,契约测试,接口测试,集成测试策略,端到端测试,CI/CD 流水线优化,GitOps,IaC,云原生架构,微服务安全,API 安全,认证授权,数据加密,传输安全,安全开发周期,依赖漏洞管理,供应链安全,容器安全,云安全,渗透测试,漏洞修复,Java 版本特性,模块化开发,多模块项目,依赖冲突,Java EE 迁移,Jakarta EE 新特性,企业级架构,大型系统设计,高并发架构,高可用架构,分布式系统理论,CAP 定理,BASE 理论,最终一致性,分布式共识算法,缓存策略,缓存问题解决方案,消息队列选型,消息可靠性,死信队列,分布式消息事务,搜索引擎集成,全文检索,日志分析,APM 选型,微服务监控,Metrics,分布式追踪系统,链路分析,混沌工程实践,故障注入,容灾测试,系统可用性,性能瓶颈分析,代码性能剖析,算法优化,数据结构,设计模式源码解析,开源框架原理,Spring 自动装配,MyBatis 映射,Netty 线程模型,Kafka 消息存储,开源贡献,Java 社区动态,新框架趋势,Quarkus 原生编译,Micronaut 轻量级,GraalVM Native Image,低代码集成,微服务边缘计算,物联网 Java,区块链 SDK,大数据 Java 开发,批处理流处理,数据序列化,云平台最佳实践,Serverless 架构设计,函数计算微服务,事件驱动设计,消息驱动微服务,DDD 微服务拆分,设计模式架构模式,代码整洁,重构手法,代码异味,静态代码分析工具,代码审查,团队开发规范,项目结构优化,依赖管理最佳实践,构建优化,测试自动化,持续交付,DevOps 工具链,Git 分支策略,CI/CD 最佳实践,监控报警,日志管理,分布式日志,ELK 实战,APM 集成,微服务治理中心,API 网关实现,限流熔断组件,分布式配置中心实践,服务注册发现原理,微服务通信,DDD 核心概念,事件风暴,领域建模过程,反应式架构原则,响应式系统特征,Reactive Streams 实现,响应式微服务,函数式反应式对比,Java 函数式接口,Lambda 最佳实践,Stream 高级用法,Optional 正确使用,CompletableFuture 异步,并发编程最佳实践,锁优化,CAS 原子类,线程池配置,并发容器原理,JUC 深度解析,JVM 底层原理,垃圾回收器对比,JVM 调优步骤,性能基准测试,JMH 指南,Java 版本升级,新特性迁移,模块化实战,JPMS 依赖,多模块构建,类路径模块路径,Java EE 迁移指南,企业应用现代化,单体应用拆分,微服务化步骤,遗留系统迁移,开源框架对比,技术选型决策,架构设计权衡,系统设计案例,高并发解决方案,高可用模式,分布式容错,CAP 应用,BASE 实践,最终一致性实现,分布式事务对比,分布式锁对比,分布式 ID 对比,缓存方案对比,缓存策略选择,缓存数据库一致性,消息队列选型对比,消息传递模式,消息可靠性保证,死信队列处理,分布式事务消息,搜索引擎对比,Elasticsearch 集群,全文检索步骤,数据建模,分布式存储方案,数据库分库分表,读写分离,连接池优化,ORM 优化,SQL 性能调优,索引设计,慢查询处理,事务隔离级别,数据库锁,分布式监控体系,Prometheus Grafana,分布式追踪实现,APM 工具对比,监控报警阈值,故障排查流程,混沌工程步骤,故障注入工具,容灾测试实践,系统可用性评估,性能测试流程,负载压力测试,JMeter 脚本,优化策略,代码质量保障,静态代码分析,代码审查清单,测试覆盖率,测试金字塔,TDD 流程,BDD 框架,契约测试实现,接口测试工具,集成测试策略,端到端测试实施,自动化测试维护,持续测试集成,DevOps 工具链集成,IaC 实践,Terraform,Ansible,Kubernetes 部署,Helm 图表,容器化最佳实践,Dockerfile 优化,K8s 资源配置,服务网格实施,Istio 配置,Serverless 框架,函数计算实践,无服务器架构,边缘计算应用,物联网开发,区块链智能合约,机器学习模型部署,大数据处理流程,Spark API,Flink 应用,分布式协议,云平台服务对比,云原生设计原则,微服务云原生,容器化微服务,服务网格微服务,Serverless 微服务,DDD 云原生,设计模式云原生,Java 生态趋势,新框架工具,Java LTS 版本,企业级最佳实践,技术分享,学习资源,入门进阶,精通 Java,Java 面试,职业发展,Java 社区,开源文化,技术趋势,版本特性,Java 生态周边,技术图书,在线课程,实战项目,经验总结,问题解决,技术方案,架构设计,代码优化,性能调优,安全加固,系统重构,技术债务,CI/CD 排查,容器化故障,微服务调用链,数据一致性,缓存失效,消息积压,数据库连接池,内存溢出,线程死锁,编译错误,依赖冲突,框架升级,API 调试,测试定位,集成测试环境,端到端数据,监控误报,故障恢复,混沌实验,性能分析,静态分析修复,IaC 调试,K8s 调度,服务网格配置,Serverless 错误,边缘计算连接,区块链共识,机器学习推理,大数据调优,云服务配置,云原生日志,微服务架构评审,DDD 建模,设计模式讨论,代码整洁计划,重构方案,技术选型报告,系统设计文档,项目架构总结,技术分享 PPT,博客排版,SEO 优化,读者互动,问题答疑,技术专栏,系列教程,专题讨论,热点技术,新兴技术,跨语言互操作,Kotlin,Scala,Groovy,Java WebAssembly,GraalVM 多语言,函数式普及,反应式成熟,云原生整合,微服务治理标准化,服务网格生态,Serverless 多样化,边缘计算云协同,区块链企业应用,机器学习工程化,大数据实时化,云厂商锁定,多云战略,混合云架构,技术债务可视化,持续交付模型,DevOps 转型,团队培训,新人培养,技术领导力,架构师成长,技术管理,团队建设,技术债管理,持续学习,终身学习,技术创新,开源文化,免费资源,付费课程,技术图书推荐,在线平台,实战案例,项目复盘,经验沉淀,解决方案,实施挑战,经验教训,最佳实践,可复用模式,知识共享,技术传承,新人带教,培训课程设计,内部认证,技能考核,能力评估,绩效指标,贡献评估,创新激励,技术分享激励,开源贡献激励,专利申请,成果转化,业务价值,技术业务对齐,技术驱动创新,业务需求分析,技术方案评估,可行性分析,风险评估,资源规划,技术预算,团队规模,招聘策略,人才培养,团队组建,跨职能团队,全栈团队,敏捷团队,DevOps 团队,团队管理,沟通效率,会议管理,文档管理,知识管理,工具链管理,技术生态建设,内部技术平台,内部工具,技术基础设施,技术中台,数据中台,业务中台,中台战略,平台工程,开发者体验,自助服务,IaC 平台,CI/CD 平台,监控平台,安全平台,数据平台,AI 平台,边缘平台,物联网平台,区块链平台,机器学习平台,大数据平台,云平台管理,多云管理,混合云管理,服务网格管理,Serverless 管理,平台架构,平台选型,平台设计,平台演进,平台团队,平台协作,平台即产品,开发者生产力,效率工具,代码生成,低代码,无代码,自动化工具,脚本,IDE 插件,命令行工具,生产力技巧,时间管理,任务管理,知识管理,协作工具,技术写作,图表工具,性能分析,安全工具,测试工具,容器化工具,Kubernetes 工具,Serverless 工具,边缘工具,物联网工具,区块链工具,机器学习工具,大数据工具,云工具,跨平台工具,多语言工具,工具对比,工具实践,工具链集成,工具学习,工具选择,工具生态,Java 生态全景,框架生态,库生态,工具生态,社区生态,企业生态,Java 技术栈,全栈开发,后端开发,前后端集成,移动端后端,跨平台开发,桌面应用,嵌入式系统,区块链 Java,机器学习 Java,大数据 Java,云计算 Java,边缘计算 Java,Serverless Java,分布式系统 Java,企业级 Java,Web 开发 Java,API 开发 Java,数据库 Java,工具 Java,测试 Java,DevOps Java,安全 Java,性能 Java,架构 Java,设计模式 Java,代码质量 Java,学习 Java,Jakarta EE,Spring Framework,Netty,GraalVM,gRPC,SonarQube,JMeter,Prometheus,Grafana,ELK Stack,Jaeger,Chaos Monkey,Nacos,Apollo,Hystrix,Resilience4j,Spring Cloud Gateway,AWS Lambda,Seata,Event Sourcing,Reactive Programming,Functional Programming,Java 21,Virtual Threads,Records,Sealed Classes,Pattern Matching";
const tags = tagStr.split(",");
// 重新设置标签
const resetTag = false
const resetPermalink = false
// 重新设置时间
const reSetMatterData = false

/**
 * 给.md文件设置frontmatter(标题、日期、永久链接等数据)
 */
function setFrontmatter(sourceDir) {
    const defaultText = '默认';

    const files = readFileList(sourceDir) // 读取所有md文件数据

    files.forEach(file => {
        let dataStr = fs.readFileSync(file.filePath, 'utf8');// 读取每个md文件内容

        // fileMatterObj => {content:'剔除frontmatter后的文件内容字符串', data:{<frontmatter对象>}, ...}
        const fileMatterObj = matter(dataStr, {});

        // 已有FrontMatter
        let matterData = fileMatterObj.data;

        let hasChange = false;
        // 是否是新创建的MatterData，也就是之前还没有
        let isNewMatterData = false
        if (!matterData || Object.keys(matterData).length === 0) {
            isNewMatterData = true
        }

        // 主页,不需要处理
        if ( matterData.home === true ) {
            return
        }
        // console.log(chalk.blue('start '),"write frontmatter(写入frontmatter)：", file.filePath)

        // 已有FrontMatter,但是没有title、date、permalink、categories、tags数据的
        if (!matterData.hasOwnProperty('title')) { // 标题
            // 检查是否为数字字符串
            const isNumericString = !isNaN(parseFloat(file.name)) && isFinite(file.name);
            if (isNumericString) {
                matterData.title = `${file.name}T`;
            } else {
                matterData.title = file.name;
            }
            hasChange = true;
        }

        //  已经创建了的Frontmatter，不需要对日期进行处理
        if (!matterData.hasOwnProperty('date') && isNewMatterData) { // 日期
            const stat = fs.statSync(file.filePath);
            matterData.date = dateFormat(getBirthtime(stat));
            hasChange = true;
        }

        if (!matterData.hasOwnProperty('permalink') || resetPermalink) { // 永久链接
            let prefix = '/other/'
            if (file.filePath.indexOf('/docs/') > 1) {
                prefix = "/docs/"
            } else if (file.filePath.indexOf('/posts/') > 1) {
                prefix = "/posts/"
            } else {
                let filePathArr = file.filePath.split(path.sep) // path.sep用于兼容不同系统下的路径斜杠
                let ind = filePathArr.indexOf("src")
                // 下一级取前缀名, 下下级是文件名
                if (ind !== -1 && ind + 2 < filePathArr.length) {
                    prefix = "/"+filePathArr[ind + 1]+"/"
                }
            }
            matterData.permalink = getPermalink(prefix);
            hasChange = true;
        }

        if (matterData.article !== false && file.filePath.indexOf('/posts/') > 1) { // 是文章页才添加分类和标签
            // 不要分类信息
            // if (!matterData.hasOwnProperty('category')) { // 分类
            //     matterData.category = getCategories(file, defaultText)
            //     hasChange = true;
            // }
            if (!matterData.hasOwnProperty('tag') || resetTag) { // 标签
                matterData.tag = matchTags(fileMatterObj.content, defaultText);
                hasChange = true;
            }
        }

        // 自动补充日常中的时间信息
        if (file.filePath.indexOf('/daily/') > 1) {
            const regex = /(^===\s+daily)(\s+\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2})?/gm;
            fileMatterObj.content = fileMatterObj.content.replace(regex, (match, prefix, date) => {
                if (!date) {
                    hasChange = true;
                    return prefix + " " + dateFormat(new Date());
                }
                return match;
            })
        }

        if (hasChange || reSetMatterData) {
            if (matterData.date && type(matterData.date) === 'date') {
                matterData.date = repairDate(matterData.date) // 修复时间格式
            }
            const newData = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + fileMatterObj.content;
            fs.writeFileSync(file.filePath, newData); // 写入
            console.log(chalk.blue('tip ') + chalk.green(`write frontmatter(写入frontmatter)：${file.filePath} `))
        }


    })
}

// 获取分类数据
function getCategories(file, categoryText) {
    let categories = []
    // 不在_posts文件夹
    let filePathArr = file.filePath.split(path.sep) // path.sep用于兼容不同系统下的路径斜杠
    filePathArr.pop() // 去除文件名称

    const ind = filePathArr.indexOf('posts')!== -1? filePathArr.indexOf('posts') : filePathArr.indexOf('docs');
    // 默认分类
    if (ind === -1 || ind + 1 >= filePathArr.length) {
        categories = [categoryText];
    } else {
        categories = filePathArr.slice(ind + 1);
    }
    return categories
}

function matchTags(content, defaultTag) {
    // 对标签按长度从长到短排序,优先匹配长标签（避免短标签被优先匹配）
    const tagCounts = {};

    // 遍历标签并检查是否存在于内容中（区分大小写,精确匹配子字符串）
    // 遍历每个标签，计算其在文章中出现的次数
    tags.forEach(tag => {
        const regex = new RegExp(tag, 'gi');
        const matches = content.match(regex);
        if (matches) {
            tagCounts[tag] = matches.length;
        }
    });

    // 将标签按照出现次数从高到低排序
    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

    if (sortedTags.length <= 0) {
        return [defaultTag]
    }

    // 最多获取5个
    return sortedTags.slice(0, 5);
}

function readFileList(dir, filesList = []) {
    const fileDir = fs.statSync(dir);
    if (fileDir.isFile()) {
        generatorFileInfo(dir, filesList);
        return filesList;
    }

    const files = fs.readdirSync(dir);
    files.forEach((filename, index) => {
        const filePath = path.join(dir, filename);
        if (!excludeDirectory.includes(filename)) {
            readFileList(filePath, filesList);  //递归读取文件
        }
    });
    return filesList;
}

function generatorFileInfo(filePath,  filesList = []) {
    const filename = path.basename(filePath)
    const fileNameArr = filename.split('.')
    const firstDotIndex = filename.indexOf('.');
    const lastDotIndex = filename.lastIndexOf('.');

    let name = null, type = null;
    if (fileNameArr.length === 2) { // 没有序号的文件
        name = fileNameArr[0]
        type = fileNameArr[1]
    } else if (fileNameArr.length >= 3) { // 有序号的文件(或文件名中间有'.')
        name = filename.substring(firstDotIndex + 1, lastDotIndex)
        type = filename.substring(lastDotIndex + 1)
    }

    if (type === 'md') { // 过滤非md文件
        filesList.push({
            name,
            filePath
        })
    }
}


// 获取文件创建时间
function getBirthtime(stat) {
    // 在一些系统下无法获取birthtime属性的正确时间,使用atime代替
    return stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime
}

// 定义永久链接数据
function getPermalink(prefix = '/pages/') {
    return `${prefix + (Math.random() + Math.random()).toString(16).slice(2, 8)}.html`
}


// 类型判断
function type(o) {
    const s = Object.prototype.toString.call(o);
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

// 修复date时区格式的问题
function repairDate(date) {
    date = new Date(date);
    return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}

// 日期的格式
function dateFormat(date) {
    return `${date.getFullYear()}-${zero(date.getMonth() + 1)}-${zero(date.getDate())} ${zero(date.getHours())}:${zero(date.getMinutes())}:${zero(date.getSeconds())}`
}

// 小于10补0
function zero (d) {
    return d.toString().padStart(2, '0')
}


export default (options) => (app) => {
    // 此处的代码会在插件被加载时立即执行（早于所有生命周期钩子）
    const sourceDir = app.options.source;
    // 首次启动检查
    setFrontmatter(sourceDir)

    return {
        name: 'vuepress-set-frontmatter-plugin',
        onInitialized() {

        },
        onWatched: (app, watchers, restart) => {
            // 添加自定义文件监听器
            const customWatcher =  watch(
                "**/*.md",
                {
                    cwd: sourceDir,
                    ignoreInitial: false,
                },
            );
            watchers.push(customWatcher)  // 必须加入 watchers 数组

            // 监听文件修改事件
            customWatcher.on('change', (filePath) => {
                setFrontmatter(path.join(sourceDir, filePath))
                // 如果修改的是daily文件，重启一下服务
                if (filePath.indexOf('daily/') > -1) {
                    restart()
                }
            })
        }
    }
}