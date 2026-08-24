module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor', {
      showDepth: null
    }],'@vuepress/back-to-top'
  ],
  themeConfig: {
    algolia: {
      appId: "VHK35PIBP8",
     // apiKey:"72e05530eb3e8b95d9a65cef01f2b00c",
      apiKey:"c64d99d7233c868e667414b42aa4aa54",
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
            ["element-ui/子目录/又一个.md", "又一个"]
          ]
        },
        ["element-ui/element ui 表格动态生成多级表头，可无限嵌套.md", "element ui 表格动态生成多级表头，可无限嵌套"]
      ]
    },
    {
      "title": "js",
      "children": [
        ["js/addEventListener第三个参数不是只有true和false吗？.md", "addEventListener第三个参数不是只有true和false吗？"],
        ["js/js实现类的继承.md", "js实现类的继承"],
        ["js/js拖动效果1.md", "js拖动效果1"],
        ["js/js拖动效果2.md", "js拖动效果2"],
        ["js/promise串、并行实现.md", "promise串、并行实现"],
        ["js/promise暂停 继续.md", "promise暂停 继续"],
        ["js/原型方法卸载dom事件（once）.md", "原型方法卸载dom事件"],
        ["js/自动触发dom事件.md", "自动触发dom事件"],
        ["js/详细解CommonJS和UMD.md", "详细解释一下CommonJS和UMD"]
      ]
    },
    {
      "title": "webgl",
      "children": [
        ["webgl/1hellopoint1.md", "1/hellopoint1"],
        ["webgl/2hellopoint2 给着色器传值.md", "2/hellopoint2 给着色器传值"],
        ["webgl/3clickpoints 点击绘点.md", "3/clickpoints 点击绘点"],
        ["webgl/4coloredPoints 不同颜色的点.md", "4/coloredPoints 不同颜色的点"],
        ["webgl/5mutiPoint 一次绘多个点.md", "5/mutiPoint 一次绘多个点"]
      ]
    },
    ["typora插入图片设置.md", "typora插入图片设置"]    ]
  }
}
