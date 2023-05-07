---
title: "Restful Api设计规范"
date: 2020-07-17 11:49:19.164000
draft: false
bookComments: true
tags: ["2023-05-07从halo博客迁移"]
# bookSearchExclude: false
---


**请求格式**

RESTful的核心思想就是，客户端发出的数据+操作指令都是“动词+宾语”的结构，比如`GET /articles`这个命令，GET是动词，/articles是宾语，有五种HTTP请求方式。
```http
# GET：读取（Read）
# POST：新建（Create）
# PUT：更新（Update）
# PATCH：更新（Update），通常是部分更新
# DELETE：删除（Delete）
```

**动词的覆盖**

有些客户端只能使用GET和POST这两种方法。服务器必须接受POST模拟其他三个方法（PUT、PATCH、DELETE）。这时，客户端发出的 HTTP 请求，要加上`X-HTTP-Method-Override`属性，告诉服务器应该使用哪一个动词，覆盖POST方法。

```http
POST /api/person/4 HTTP/1.1  
X-HTTP-Method-Override: PUT
```

**复数 URL**

为了统一起见，建议都使用复数 URL，比如`GET /articles/2`要好于`GET /article/2`。

**单词问题**
出现单词拼接时，用`-`分隔。

**避免多级 URL**

常见的情况是，资源需要多级分类，因此很容易写出多级的 URL，比如获取某个作者的某一类文章。
```http
# GET /authors/12/categories/2
```
这种 URL 不利于扩展，语义也不明确，往往要想一会，才能明白含义。
更好的做法是，除了第一级，其他级别都用查询字符串表达。
```http
# GET /authors/12?categories=2
```
下面是另一个例子，查询已发布的文章。你可能会设计成下面的 URL。
```http
# GET /articles/published
```
查询字符串的写法明显更好
```http
# GET /articles?published=true
```

**不要返回纯本文**

API 返回的数据格式，不应该是纯文本，而应该是一个 JSON 对象，因为这样才能返回标准的结构化数据。所以，服务器回应的 HTTP 头的Content-Type属性要设为application/json。

客户端请求时，也要明确告诉服务器，可以接受 JSON 格式，即请求的 HTTP 头的ACCEPT属性也要设成application/json。下面是一个例子。
```http
GET /orders/2 HTTP/1.1 
Accept: application/json
```


**发生错误时，不要返回 200 状态码**

有一种不恰当的做法是，即使发生错误，也返回200状态码，把错误信息放在数据体里面，就像下面这样。
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "status": "failure",
  "data": {
    "error": "Expected at least two items in list."
  }
}
```
上面代码中，解析数据体以后，才能得知操作失败。

这种做法实际上取消了状态码，这是完全不可取的。正确的做法是，状态码反映发生的错误，具体的错误信息放在数据体里面返回。
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Invalid payoad.",
  "detail": {
     "surname": "This field is required."
  }
}
``` 

**常见的状态码**

2XX 状态码：请求成功
- 200 OK：状态码表示操作成功。
- 201 Created：成功请求并创建了新的资源，用于POST请求返回。
- 202 Accepted：表示服务器已经收到请求，但还未进行处理，会在未来再处理，用于异步操作。
- 204 No Content：表示资源已经不存在，用于DELETE请求返回。

3XX 状态码：重定向
- 301 Moved Permanently：状态码（永久重定向）。
- 302 Found：状态码（暂时重定向）。
- 303 See Other：表示参考另一个 URL。

4XX 状态码:表示客户端错误
- 400 Bad Request：服务器不理解客户端的请求，未做任何处理。
- 401 Unauthorized：用户未提供身份验证凭据，或者没有通过身份验证。
- 403 Forbidden：用户通过了身份验证，但是不具有访问资源所需的权限。
- 404 Not Found：所请求的资源不存在，或不可用。
- 405 Method Not Allowed：用户已经通过身份验证，但是所用的 HTTP 方法不在他的权限之内。
- 410 Gone：所请求的资源已从这个地址转移，不再可用。
- 415 Unsupported Media Type：客户端要求的返回格式不支持。比如，API 只能返回 JSON 格式，但是客户端要求返回 XML 格式。
- 422 Unprocessable Entity ：客户端上传的附件无法处理，导致请求失败。
- 429 Too Many Requests：客户端的请求次数超过限额。

5XX 状态码:表示服务端错误。
- 一般来说，API 不会向用户透露服务器的详细信息，所以只要两个状态码就够了。
- 500 Internal Server Error：客户端请求有效，服务器处理时发生了意外。
- 503 Service Unavailable：服务器无法处理请求，一般用于网站维护状态。

END!