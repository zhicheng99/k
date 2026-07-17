module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor']
  ],
  themeConfig: {
    algolia: {
      appId: "94TJRUSSVM",
      apiKey: "941614e14d7a41584c653c9bed684ad8",
      indexName: "k",
    },
    sidebarDepth: 0,
    sidebar: [
      ["fsfsfdsf/fsfdsfds.md", " fsfdsfds"],
    ]
  }
}