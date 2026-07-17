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
      apiKey: "bb89a7555541af96d500213fb23ea66d",
      indexName: "kk",
    },
    sidebarDepth: 0,
    sidebar: [
    {
      "title": "element-ui",
      "children": [
        {
          "title": "子目录",
          "children": [
            ["/element-ui/子目录/又一个.md", " 又一个"]
          ]
        }
,
        ["/element-ui/element ui 表格动态生成多级表头，可无限嵌套.md", " element ui 表格动态生成多级表头，可无限嵌套"]
      ]
    }
,
    ["/typora插入图片设置.md", " typora插入图片设置"]
    ]
  }
}
