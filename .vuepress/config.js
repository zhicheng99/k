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
      apiKey: "bb89a7555541af96d500213fb23ea66d",
      indexName: "kk",
    },
    sidebarDepth: 0,
    sidebar: [
      ["fsfsfdsf/fsfdsfds.md", " fsfdsfds"],
    ]
  }
}