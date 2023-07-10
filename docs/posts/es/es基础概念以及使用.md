---
title: es基础概念以及使用  # 博客标题（必须）
date: 2023-07-04  # 博客发表日期（可选）
author: qzk  # 博客作者（可选，不填的话会使用 `themeConfig.personalInfo.name`）
giscus: true  # 启用/禁用当前页的 Giscus 评论（可选，默认：true）
---

# ES基础概念以及使用

## 1. 基础概念

### 1.1 核心 “倒排索引”

#### 正向索引

如给下表（tb_goods）中的id创建索引：

|  id  |  title   | price |
| :--: | :------: | :---: |
|  1   | 小米手机 | 3499  |
|  2   | 苹果手机 | 4999  |
|  3   | 华为手机 | 4000  |

如果是根据id查询，那么直接走索引，查询速度非常快。

若条件是title符合`"%手机%"`

1）用户搜索数据，条件是title符合`"%手机%"`

2）逐行获取数据

3）判断数据中的title是否符合用户搜索条件

4）如果符合则放入结果集，不符合则丢弃。回到步骤1

逐行扫描，也就是全表扫描，随着数据量增加，其查询效率也会越来越低。当数据量达到数百万时，就是一场灾难。

#### 倒排索引

倒排索引中有两个非常重要的概念：

- 文档（`Document`）：用来搜索的数据，其中的每一条数据就是一个文档。
- 词条（`Term`）：对文档数据或用户搜索数据，利用某种算法分词，得到的具备含义的词语就是词条。例如：小米手机，就可以分为：小米、手机这样的词条。

**创建倒排索引**是对正向索引的一种特殊处理，流程如下：

- 将每一个文档的数据利用算法分词，得到一个个词条
- 创建表，每行数据包括词条、词条所在文档id、位置等信息
- 因为词条唯一性，可以给词条创建索引，例如hash表结构索引

![image-20230704131027303](/images/posts/article-img/image-20230704131027303.png)

倒排索引的检索流程如下：

![image-20230704131059130](/images/posts/article-img/image-20230704131059130.png)

### 1.2 索引和映射

**索引（Index）**，就是相同类型的文档的集合。可以理解为一个**数据库**。

![image-20230704131837700](/images/posts/article-img/image-20230704131837700.png)

**映射（mapping）**，是索引中文档的字段约束信息，类似表的结构约束。

> 常见的映射属性包括
>
> - type：字段数据类型，常见的简单类型有：
>   - 字符串：text（可分词的文本）、keyword（精确值，例如：品牌、国家、ip地址）
>   - 数值：long、integer、short、byte、double、float、
>   - 布尔：boolean
>   - 日期：date
>   - 对象：object
> - index：是否创建索引，默认为true
> - analyzer：使用哪种分词器
> - properties：该字段的子字段

**示例：**

```json
{
  "mappings": {                     
    "properties": {                 
      "id": {                       // 字段名
        "type": "keyword"					  // 类型为关键字：精确值
      },
      "name": {                     
        "type": "text",             // 类型为文本，可分词
        "analyzer": "ik_max_word",  // 指定分词器
        "copy_to": "all"            // 拷贝到自定义字段 all，与多个字段联合检索
      },
      "address": {
        "type": "keyword",
        "index": false              // index为false表示不参与检索条件，默认为true
      },
      "price": {
        "type": "integer"           // 类型为数值型
      },
      "brand": {
        "type": "keyword",
        "copy_to": "all"            // 拷贝到自定义字段 all，与多个字段联合检索
      },
      "location": {
        "type": "geo_point"         // 类型为地理坐标值,经纬度表示，如"31.249,120.3925"
      },
      "all":{
        "type": "text",
        "analyzer": "ik_max_word"
      }
    }
  }
}
```

**特殊字段说明**

地理坐标：

![image-20230704134434022](/images/posts/article-img/image-20230704134434022.png)

一个组合字段，其目的是将多字段的值 利用copy_to合并，提供给用户搜索：

![image-20230704134447492](/images/posts/article-img/image-20230704134447492.png)

### 1.3 文档和字段

elasticsearch是面向**文档（Document）**存储的。一个文档可以理解为数据库中的一条数据。文档数据会被序列化为json格式后存储在elasticsearch中：

![image-20230704131421132](/images/posts/article-img/image-20230704131421132.png)

而Json文档中往往包含很多的**字段（Field）**，类似于数据库中的列，在这里表现为`id`、`title`、`price`的值。

**新增的基本操作如下**：

```json
POST /{索引库名}/_doc/1        // /索引库名/_doc/文档id
{
    "name": "Jack",          //  字段：字段值 
    "age": 21                //  字段：字段值
}
```



### 1.4 mysql与elasticsearch

我们统一的把mysql与elasticsearch的概念做一下对比：

| **MySQL** | **Elasticsearch** | **说明**                                                     |
| --------- | ----------------- | ------------------------------------------------------------ |
| Table     | Index             | 索引(index)，就是文档的集合，类似数据库的表(table)           |
| Row       | Document          | 文档（Document），就是一条条的数据，类似数据库中的行（Row），文档都是JSON格式 |
| Column    | Field             | 字段（Field），就是JSON文档中的字段，类似数据库中的列（Column） |
| Schema    | Mapping           | Mapping（映射）是索引中文档的约束，例如字段类型约束。类似数据库的表结构（Schema） |
| SQL       | DSL               | DSL是elasticsearch提供的JSON风格的请求语句，用来操作elasticsearch，实现CRUD |

两者各自有自己的擅长支出：

- Mysql：擅长事务类型操作，可以确保数据的安全和一致性

- Elasticsearch：擅长海量数据的搜索、分析、计算

## 2. RestClient整合Spring使用

### 2.1 环境准备和说明

测试框架及版本：

- elasticsearch 7.12.1
- ik分词器插件 7.12.1
- springboot 2.7.9
- elasticsearch-rest-high-level-client 7.12.1

**1) 覆盖SpringBoot 2.7.9中的es版本配置**

```xml
<properties>
   <!-- 重新指定es的版本，覆盖springboot中的版本 -->
   <elasticsearch.version>7.12.1</elasticsearch.version>
</properties>


<dependencyManagement>
    <dependencies>
        <!-- 重新指定es的版本，覆盖springboot中的版本 -->
        <dependency>
            <groupId>org.elasticsearch.client</groupId>
            <artifactId>elasticsearch-rest-high-level-client</artifactId>
            <version>${elasticsearch.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>


<!-- elasticsearch -->
<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency>
```

**2) 配置es的连接客户端**

```java
@Configuration
public class ElasticSearchConfig {
    @Bean
    public RestHighLevelClient restHighLevelClient(){
        return new RestHighLevelClient(RestClient.builder(HttpHost.create("http://192.168.6.94:9200")));
    }
}
```

### 2.2 索引库操作

#### 1）创建索引库

```java
    /**
     * 创建索引库和映射
     */
    @Test
    void createIndexDemo() throws IOException {
        // 创建索引库创建请求
        CreateIndexRequest request = new CreateIndexRequest("shop");
        // 构建mapping映射
        request.source(INDEX_JSON, XContentType.JSON);
        // 执行
        restHighLevelClient.indices().create(request, RequestOptions.DEFAULT);
    }
```

其中`INDEX_JSON`字段的映射值与`Shop`实体类的关系如下图：

![映射关系](/images/posts/article-img/C11FCDE2-F3D3-4502-8CBE-438D4106991D-8449670-8449671.png)

#### 2）删除索引库

```java
    /**
     * 删除索引库
     */
    @Test
    void deleteIndexDemo() throws IOException {
        // 创建索引库删除请求
        DeleteIndexRequest request = new DeleteIndexRequest("shop");
        // 执行
        restHighLevelClient.indices().delete(request, RequestOptions.DEFAULT);
    }
```

#### 3）判断索引库是否存在

```java
    /**
     * 判断索引库是否存在
     * 本质就是Get查询
     */
    @Test
    void GetIndexDemo() throws IOException {
        // 创建索引库查询请求
        GetIndexRequest request = new GetIndexRequest("shop");
        // 执行，使用exists查询是否存在，返回布尔值
        boolean exists = restHighLevelClient.indices().exists(request, RequestOptions.DEFAULT);
        System.out.println(exists ? "已存在" : "不存在");
    }
```

### 2.3 文档操作

#### 1）新增文档

```java
    // 模拟数据
    ShopDto init() {
        Shop shop = new Shop();
        shop.setId(10100001L);
        shop.setBrand("nobrand");
        shop.setPrice(10000);
        shop.setScore(45);
        shop.setName("noname");
        shop.setAddress("local");
        shop.setLatitude("31.2497");
        shop.setLongitude("120.3925");
        return new ShopDto(shop);
    }

    /**
     * 新增文档
     */
    @Test
    void insertDoc() throws IOException {
        // 初始化 shop
        ShopDto shopDto = init();
        // 转为json
        String json = JSON.toJSONString(shopDto);
        // 创建新增请求对象，指定索引库和文档id
        IndexRequest request = new IndexRequest("shop").id(shopDto.getId().toString());
        // 配置json文档
        request.source(json, XContentType.JSON);
        // 执行新增
        restHighLevelClient.index(request, RequestOptions.DEFAULT);
    }
```

#### 2）批量新增

```java
/**
 * 批量新增
 */
@Test
void bulkDocs() throws IOException {
    // 初始化一个shop的list集合, 具体方法略..
    List<ShopDto> shopDtos = initList();
    // 创建批量请求
    BulkRequest request = new BulkRequest();
    // 准备参数，添加多个新增的Request
    shopDtos.forEach(item -> request.add(new IndexRequest("shop")
            .id(item.getId().toString()).source(JSON.toJSONString(item), XContentType.JSON)));
    // 执行批量处理
    restHighLevelClient.bulk(request, RequestOptions.DEFAULT);
}
```

#### 3）查询文档（简单查询）

查询的方法，以下示例仅为最简单的id查询方式，复杂查询在[这里](3. DSL查询文档)

```java
    /**
     * 简单查询文档
     */
    @Test
    void getDocsById() throws IOException {
        // 创建查询请求
        GetRequest request = new GetRequest("shop", "10100001");
        // 执行，获取结果
        GetResponse response = restHighLevelClient.get(request, RequestOptions.DEFAULT);
        // 解析结果
        String json = response.getSourceAsString();

        System.out.println(json);
    }
```

#### 4）删除文档

```java
/**
 * 删除文档
 */
@Test
void deleteDoc() throws IOException {
    // 准备Request,参数为索引库名和删除的id值
    DeleteRequest request = new DeleteRequest("shop", "10100001");
    // 执行
    restHighLevelClient.delete(request, RequestOptions.DEFAULT);
}
```

#### 5）修改文档

- 全量修改：本质是先根据id删除，再新增
- 增量修改：修改文档中的指定字段值

**在RestClient的API中，全量修改与新增的API完全一致，判断依据是ID。**

增量修改：

```java
    /**
     * 修改文档
     */
    @Test
    void UpdateDoc() throws IOException {
        // 构建增量修改的请求
        UpdateRequest request = new UpdateRequest("shop", "10100001");
        // 需要修改的k-v对
        request.doc("name","newname","price",50000);
        // 执行更新
        restHighLevelClient.update(request,RequestOptions.DEFAULT);
    }
```



## 3. DSL查询文档