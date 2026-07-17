module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor']
  ],
  themeConfig: {
    algolia: {
      appId: "VHK35PIBP8",
      apiKey: "72e05530eb3e8b95d9a65cef01f2b00c",
      indexName: "book",
    },
    sidebarDepth: 0,
    sidebar: []
  }
}