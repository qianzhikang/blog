---
title: Nginx入门
date: 2022-04-25 12:26:22
giscus: true  # 启用/禁用当前页的 Giscus 评论（可选，默认：true）
---
# Nginx基本使用

本文将带你入门`Ngxin`，了解Nginx的几大用途，并且初步教会你使用Nginx部署你的前端项目！

## 1. 简介

Nginx (engine x) 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。

其特点是占有内存少，并发能力强，事实上Nginx的并发能力在同类型的网页服务器中表现较好。Nginx代码完全用C语言从头写成。官方数据测试表明能够支持高达 50,000 个并发连接数的响应。

## 2. Nginx主要应用

- 静态网站部署

- 负载均衡
- 反向代理

## 3. 安装Nginx & 项目部署

Nginx 官网：http://nginx.org/

### 3.1 Nginx for Windows

> 下载windows版本支持的稳定版`Nginx`

![进入下载页](/images/posts/article-img/202204241358895.png)

![下载稳定版](/images/posts/article-img/202204241359043.png)

> 解压得到文件夹，`注意解压路径不要含有中文字符，否则可能启动失败！`双击 `exe` 执行文件 或 在此启动命令行（使用管理员权限），执行 `nginx.exe`。

![解压后的文件夹](/images/posts/article-img/202204241401040.png)

> 访问 `localhost:80` 测试

![成功页面](/images/posts/article-img/202204241405594.png)



### 3.2 Windows 下部署前端项目

**Nginx根目录下的`/conf/nginx.conf`文件是Nginx的配置文件，要部署自己的项目需要做一些改变。**

> 修改`nginx.conf`文件的`server`中的访问根目录

```yml
server {
    listen       80;  #代理监听的端口
    server_name  localhost;
    location / {
        root   html/dist;  #项目访问入口的根目录
        index  index.html index.htm; #主页
    }
    error_page   500 502 503 504  /50x.html; #错误页面的配置
    location = /50x.html {
        root   html;
    }
}
```

> 将需要部署的前端项目打包

```bash
npm run build
```

![生成的dist](/images/posts/article-img/202204241421464.png)

> 将`dist`文件夹复制到Nginx根目录下的`/html`文件夹内，并且重启Nginx。

![复制dist文件到目标目录下](/images/posts/article-img/202204241423536.png)

在`Nginx根目录`下，管理员身份启动命令行，输入命令，重新加载配置文件。

```bash
nginx -s reload
```

> 重启后，再次访问`localhost:80`

![成功访问项目](/images/posts/article-img/202204241416197.png)



> 关闭 Nginx 进程命令

安全退出（推荐），保存一些配置，慢慢关闭进程。

```bash
nginx -s quit
```

快速退出，直接停止进程。

```bash
nginx -s stop
```



### 3.3 Nginx for Docker

这里主要以Docker拉取Nginx镜像，并且使用容器运行的方式，在云服务器上安装Nginx，一来比较方便，二来可以再回顾一下Docker的一些操作。

> 拉取远程镜像

```bash
docker pull nginx
```

> 查看拉取的镜像

```bash
docker images
```

![拉取的Nginx镜像](/images/posts/article-img/202204241432663.png)

> 使用镜像创建并启动容器测试

```bash
docker run -d --name mynginx -p 80:80 nginx
```

- -d  ：后台守护运行
- --name ：容器名字（自定义）
- -p 80:80 ：将容器的80端口映射为宿主机的80端口
- nginx ：镜像的名字

**`注意，这里需要ECS的 80 端口开启访问，否则会被防火墙拦截！`**

![测试访问远程nginx](/images/posts/article-img/202204241439677.png)

到这里，基于docker镜像的nginx的linux安装已经完成了，但是如果想要像上文一样部署项目，则需要进入容器内部修改配置文件。

> 查看容器下的配置文件

容器运行后，会在容器内的 `/etc/nginx` 下生成 `nginx.conf`，使用docker命令进入容器内部查看，容器id可以使用 `docker ps`查看。

```bash
docker exec -it 容器id bash
```

![容器内的nginx.conf](/images/posts/article-img/202204241450817.png)

查看nginx.conf的内容

```bash
cat nginx.conf
```

![nginx.conf](/images/posts/article-img/202204241453969.png)

查看`/etc/nginx/conf.d/*.conf`文件

![default.conf](/images/posts/article-img/202204241456908.png)

退出容器

```bash
exit
```

在这里就可以修改，进行项目的部署了。但是这种方式每次都要进入Docker容器内部进行操作，不便于操作，所以需要对配置文件和部署目录以及日志输出进行外部挂载，在宿主机上便于操作。



### 3.4 Linux 下挂载配置文件

由于需要修改一些配置文件的映射关系，所以需要先将Nginx容器删除，再次创建的时，设置挂载目录。

> 创建宿主机的挂载目录

```bash
mkdir /home/docker/nginx/{conf,html,logs} -p
```

命令在`/home/docker/nginx/`下创建了`conf,html,logs`三个文件夹。

> 将容器内的配置文件拷贝到宿主机的挂载目录中

```bash
docker cp 容器id:/etc/nginx/nginx.conf ./
```

表示将容器下的`/etc/nginx/nginx.conf`拷贝到当前目录。

```bash
docker cp 容器id:/etc/nginx/conf.d/default.conf ./conf/
```

表示将容器下的`/etc/nginx/conf.d/default.conf`拷贝到当前目录下的`conf`文件夹下。

> 停止容器运行并且删除容器

停止运行种的容器

```bash
docker container stop 容器id
```

删除容器

```bash
docker rm 容器id
```

> 重新创建容器，并将配置挂载到宿主机

```bash
docker run -d --name mynginx -p 80:80 -v /home/docker/nginx/nginx.conf:/etc/nginx/nginx.conf -v /home/docker/nginx/logs:/var/log/nginx -v /home/docker/nginx/html:/usr/share/nginx/html -v /home/docker/nginx/conf:/etc/nginx/conf.d --privileged=true 镜像名
```

- -v /home/docker/nginx/nginx.conf:/etc/nginx/nginx.conf ：表示将当前`/home/docker/nginx/nginx.conf`文件映射为容器的`/etc/nginx/nginx.conf`文件
- `logs`,`html`文件夹也是同理
- `--privileged=true` ：表示容器内部对挂载的目录拥有读写等特权



> 修改配置文件`/home/docker/nginx/conf/default.conf`的访问根目录。

```bash
vim default.conf
```

![image-20220424152021395](/images/posts/article-img/202204241520444.png)

> 将需要部署的项目`dist`文件夹上传到云服务器的`/home/docker/nginx/html`下，并重新载入nginx的配置。

![将dist拷贝到html下](/images/posts/article-img/202204241526833.png)

进入容器

```bash
docker exec -it 容器id bash
```

重新载入 nginx 配置

```bash
nginx -s reload
```

> 访问远程 nginx 测试  （http://远程主机IP:80/）

![成功访问](/images/posts/article-img/202204241530914.png)

> 多  `location{}` 的配置时，指定目录不是使用`root`,而是使用 `alias`。

![多location配置](/images/posts/article-img/202204242343653.png)

### 3.5 Nginx for Linux

下载 Linux 的压缩包，上传服务器端

![linux版](/images/posts/article-img/202204242157449.png)

> 解压

来到存放压缩包的目录

![压缩文件](/images/posts/article-img/202204242231044.png)

命令解压

```bash
tar -zxvf nginx-1.18.0.tar.gz
```

> 源码编译安装

进入解压目录

![nginx解压目录下](/images/posts/article-img/202204242233703.png)

执行脚本进行安装前的配置工作

```bash
./configure
```

```bash
make
```

执行安装

```bash
make install
```

> 查看nginx被安装到了哪

```bash
whereis nginx
```

![查看nginx的安装目录](/images/posts/article-img/202204242238076.png)

> 进入nginx的安装目录下的`sbin`，启动nginx

```bash
cd /usr/local/nginx/sbin/
./nginx  启动
```

> 可能遇到的问题

80端口被占用，需要修改端口，然后reload重启遇到报错

![reload 报错](/images/posts/article-img/202204242242769.jpg)

解决方法，修改 nginx.conf 文件，将pid的注释去掉

![image-20220424224432468](/images/posts/article-img/202204242244510.png)

一些其他的命令：

```bash
./nginx -s stop  停止
./nginx -s quit  安全退出
./nginx -s reload  重新加载配置文件
ps aux|grep nginx  查看nginx进程
```

> 访问测试

![访问成功](/images/posts/article-img/202204242229314.png)

*删除nginx：`rm -rf usr/local/nginx`*





## 4. 反向代理 & 负载均衡

普通项目下，客户端直接请求一个服务器，这个时候过多的客户端请求，会导致单个服务器负荷很大，这时候可以起同一个应用起在多个服务器上。这时客户端就需要访问不同的地址进行访问，但是我们希望客户端访问同一个地址进行访问，这就需要Nginx为服务实现反向代理。

反向代理隐藏了真正的服务端，就像你每天使用百度的时候，只知道敲打`www.baidu.com`就可以打开百度搜索页面，但背后成千上万台百度服务器具体是哪一台提供的服务的，是黑盒的。只是访问这个代理服务器，它会把我们的请求转发到真实提供服务的服务器，从而请求回数据。

- 普通访问：

![普通流程](/images/posts/article-img/202204250959333.png)

- 反向代理：

![反向代理](/images/posts/article-img/202204250950382.png)



## 5. 配置反向代理和负载均衡


> 新建一个SpringBoot项目，加入依赖

```xml
<!--web依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!--单元测试-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!--lombok-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

> 编写一个简单的控制器控制台打印访问记录信息

```java
@RestController
@Slf4j
public class NginxController {
    @GetMapping("/hello")
    public String sayHello(){
        log.info("enter this service!!!!!");
        return "Hello";
    }
}
```

> 打包项目，控制台运行jar包，分别启动两个服务，8080端口 和 8081端口

```bash
java -jar nginx-proxy --server.port=8080
```

```bash
java -jar nginx-proxy --server.port=8081
```





> 修改配置文件，设置负载均衡和代理

修改`/nginx-1.20.2/conf/nginx.conf`文件

![配置代理](/images/posts/article-img/202204251223529.png)

> 重新载入nginx配置，进行测试

```bash
nginx -s reload
```

访问  `localhost/hello`，查看终端输出的信息，测试代理和负载均衡。
