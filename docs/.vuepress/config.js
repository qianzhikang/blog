const { gungnirTheme } = require("vuepress-theme-gungnir");
const { giscusPlugin } = require("vuepress-plugin-giscus");

module.exports = {
  lang: 'zh-CN',
  title: 'Site',
  description: 'blog site',
  docsDir: "posts",

  // 发布仓库
  base: '/blog/',

  plugins: [
    // 评论插件
    giscusPlugin({
      repo: "qianzhikang/blog",  // 必须，string，格式：user_name/repo_name
      repoId: "R_kgDOJ228bg",  // 必须，string，在 Giscus 官网上生成
      category: "Show and tell",  // 必须，string
      categoryId: "DIC_kwDOJ228bs4CXoo0",  // 必须，string，在 Giscus 官网上生成
      theme: "preferred_color_scheme", // 可选，string，default="light"
    })
  ],

  theme: gungnirTheme({
    searchText: "搜索",
    personalInfo: {
      // 必须：名称，将在首页、移动端侧边栏和文章作者信息处显示
      name: "qzk",

      // 必须：头像，将在首页和移动端侧边栏显示
      avatar: "/images/avatar.png",

      // 必须：个人简介，将在首页显示
      description: "on the way",
    },


    // navbar 左侧
    navbarTitle: "Home",  // 可选，默认："$ cd /home/"

    // navbar 右侧
    navbar: [
      // NavbarItem
      {
        text: '归档',
        link: '/tags',
      },
      {
        text: '关于',
        link: '/links/',
      }
    ],

    // 首页轮播图
    homeHeaderImages: [
      // 图 1
      {
        "path": "/images/bg/bg-1.jpg",
        "mask": "rgba(40, 57, 101, .4)"
      },
      {
        "path": "/images/bg/bg-2.jpg",
        "mask": "rgba(40, 57, 101, .4)"
      }
    ],
    
    
    // 其他页配置
    pages: {
      // 标签页配置
      tags: {
        // 可选：标签页副标题
        subtitle: '标签页',

        // 可选：标签页封面图路径和蒙版
        bgImage: {
          path: '/images/bg/bg-1.jpg',
          mask: 'rgba(211, 136, 37, .5)'
        },
        bgImage: {
          path: '/images/bg/bg-2.jpg',
          mask: 'rgba(211, 136, 37, .5)'
        }
      },

      // 链接页配置
      links: {
        // 可选：链接页副标题
        subtitle: '链接页',

        // 可选：链接页封面图路径和蒙版
        bgImage: {
          path: '',
          mask: 'rgba(64, 118, 190, 0.5)'
        }
      },
    },

    // 底部配置
    footer: `
      &copy; <a href="https://github.com/Renovamen" target="_blank">Renovamen</a> 2018-2022
      <br>
      Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
  })
}