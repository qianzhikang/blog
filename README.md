# 如何开始？

为了防止长时间不使用，忘记如何使用
- `.vuepress/public/images/` 项目图片资源，所有的文档中的图片和博客首页图片存放在这
- `.vuepress/config.js` 配置文件，配置博客项目的各项内容，具体看注释
- `./docs/links/README.md` 链接页
- `./docs/post/` 文章源markdown文件，主要在这里编辑，各个内容之间分文件夹

**写一篇文档的步骤**
1. 在对应内容的文件夹内添加md文件(./docs/post/)
2. 将文件中的图片拷贝到`.vuepress/public/images/posts/article-img`
3. 替换文档中的图片url为`/images/posts/article-img/*.png`
4. 在catalog.md中添加文档的访问超链接

**杂文**
1. 在`./docs/post/`目录下写md文档（与guide.md同级）
2. 图片放`.vuepress/public/images/home`目录
