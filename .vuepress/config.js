module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor', {
      showDepth: null
    }]
  ],
  themeConfig: {
    algolia: {
      appId: "VHK35PIBP8",
      //apiKey: "bb89a7555541af96d500213fb23ea66d",
      //apiKey:"72e05530eb3e8b95d9a65cef01f2b00c",
      apiKey:"09995659b64997b66380d5d6114b5ba2",
      indexName: "kk",
    },
    sidebarDepth: 0,
    sidebar: [
    {
      "title": "element-ui",
      "children": [
        ["element-ui/element ui 表格动态生成多级表头，可无限嵌套.md", "element ui 表格动态生成多级表头，可无限嵌套"]
      ]
    },
    {
      "title": "js",
      "children": [
        ["js/js实现类的继承.md", "js实现类的继承"],
        ["js/js拖动效果1.md", "js拖动效果1"],
        ["js/js拖动效果2.md", "js拖动效果2"],
        ["js/promise串、并行实现.md", "promise串、并行实现"],
        ["js/promise暂停 继续.md", "promise暂停 继续"],
        ["js/原型方法卸载dom事件（once）.md", "原型方法卸载dom事件"],
        ["js/自动触发dom事件.md", "自动触发dom事件"]
      ]
    },
    ["typora插入图片设置.md", "typora插入图片设置"]    ]
  }
}
