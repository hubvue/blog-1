# http 缓存 

### 缓存的好处 
1️⃣ 减少冗余信息的传输  
2️⃣ 降低响应时延  
3️⃣ 降低对服务器的要求，对同一资源的请求并发过大问题。  


### 强制缓存
优先从浏览器数据库中获取对应的数据，若存在对应的数据，则选择直接从中获取。  
若缓存失效，才去服务器请求数据。  

##### Expire  
`http1.0` 遗留的产物，指明资源的过期时间，但是客户端和服务端的时候可能有差距。   


##### Cache Control
`no-store` : 表示直接不适用缓存，UA每次都必须向服务器发起请求资源。
`no-cache` : 标志直接跳过强缓存阶段,必须向服务器发起询问是否已经更新，也就是协商缓存。 
`max-age`：表示资源的过期时间。若对应的资源文件长期不变，那么一般将时间设为一年对应的秒数。    
public：表示资源可以被传输过程总任何人缓存
pravite ： 表示资源只可以被最终的接收端缓存。
public与pravite：这两个值得区别在于是否请用代理缓存，前者表示启用，而后者的缓存仅仅在本地浏览器的缓存中。

##### 注意
1️⃣ `max-age` `expire` `date`三者是对应关系，同时使用的时候不要出现矛盾冲突的情况。   
2️⃣ 在http1.1的版本中，max-age的优先级是大于Expire的，而在http1.0中则正好相反，所以我们建议填写最好不要相矛盾。

### 协商缓存  
客户端请求数据的时候，会先从本地数据库的对应资源下，获取一个资源的标志符号(ETag或者修改时间等等)，客户端待着参数请求服务器，服务器根据这些标志判断资源是否已经更新，若没有更新的话则直接返回一个304状态码，客户端收到之后就直接从浏览器数据库中取出对应的缓存数据。若资源已经过期，则服务端会连同数据一起返回。    

两种缓存机制可以同时使用，强缓存优先于协商缓存，若强缓存命中则不必走一遍协商缓存的RTT。

##### ETag 与 If-None-Match
ETag值是根据内容计算出来的一个值，可以细微发觉内容的变化。  
有强弱验证之分,强验证要求每一个字符都相等，而弱验证只要求文档含义相类似即可。   
```js
ETag:sdjkfbjkxcbvybwhebfknis
```

```js 
ETag:W/sdhjkfbxcbvysbddjbvcjk
```
使用node可以是以下的形式：
```js
if (path === '/js/main.js') {
    let string = fs.readFileSync('./js/main.js', 'utf8')
    response.setHeader('Content-Type', 'application/javascript;charset=utf-8')
    let fileMd5 = md5(string)
    response.setHeader('ETag', fileMd5)
    if (request.headers['if-none-match'] === fileMd5) {
      response.statusCode = 304
    } else {
      response.write(string) 
    }
    response.end()
 }
```

##### Last Modified 与 If-Modified-Since 
比较资源修改日期。  
但有这个方法有两个问题  

1️⃣ 服务器资源只发生了一些周期性的更改，比如添加了注释等等无关内容的操作。用户也会被强制下载。    
2️⃣ 校验日期只能够精细到秒级，而细微到亚秒的时候就不起作用。   


##### 注意
1️⃣ Etag 与 修改时间同时存在的话，服务器回先判断Etag是If-None-Match否校验过关，若没有匹配ETag的资源则马上返回`200 ok`，若匹配成功了，则会进行 `Double Check`，再验证`If-Modified-Since`的校验，若事件过期了，则也会返回资源。  

### 使用场景  

![](/blog_assets/http_cache.png)


### http 缓存 与 前端持久化
___
##### 疑问？
1️⃣ 缓存资源能否跨站点使用呢？比如A站点在一个CDN服务商那里缓存了一个标准版本的jQuery库 2.6.3版本，那么用户查看完A站点之后，浏览器缓存了这个资源，那么同样使用这个CDN缓存的B站点访问的时候，是否能够直接读取缓存呢？ 


___
### 参考文章
[持久化存储于http](https://juejin.im/post/5a7e92696fb9a06336114aca#heading-14)