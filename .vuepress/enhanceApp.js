// .vuepress/enhanceApp.js
export default ({ Vue, options, router, siteData, isServer }) => {
  if (isServer) return

  let Chart = null
  let retryCount = 0

  const initAllPlugins = () => {
    if (!Chart) {
      Chart = require('./pluginComponents/Chart.js').default || require('./pluginComponents/Chart.js')
    }

    const blocks = document.querySelectorAll('.language-chart')
    if (blocks.length === 0) {
      retryCount++
      if (retryCount < 5) setTimeout(initAllPlugins, 200)
      return
    }
    retryCount = 0

    blocks.forEach((el) => {
      if (el.__chartInstance) return
      try {
        Chart(el)
      } catch (e) {
        console.warn('[Chart plugin] init failed:', e)
      }
    })
  }

  // 首次加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initAllPlugins, 300))
  } else {
    setTimeout(initAllPlugins, 300)
  }

  // SPA 路由切换
  router.afterEach(() => {
    retryCount = 0
    setTimeout(initAllPlugins, 300)
  })
}