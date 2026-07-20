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
      apiKey:"72e05530eb3e8b95d9a65cef01f2b00c",
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
    ["typora插入图片设置.md", "typora插入图片设置"]    ]
  }
}
