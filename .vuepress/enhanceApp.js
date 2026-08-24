// .vuepress/enhanceApp.js
export default ({ Vue, options, router, siteData, isServer }) => {
  if (isServer) return

  let Chart = null
  let Echarts = null
  let Markmap = null
  let Marp = null
  let PlantUml = null
  let Callout = null
  let retryCount = 0
  let retryCount1 = 0;
  let retryCount2 = 0;
  let retryCount3 = 0;
  let retryCount4 = 0;
  let retryCount5 = 0;


 
 // chart
  var initChart = function(){
    if (!Chart) {
      Chart = require('./pluginComponents/Chart/Chart.js').default || require('./pluginComponents/Chart/Chart.js')
    }

    // 渲染 Chart.js 图表
    const chartBlocks = document.querySelectorAll('.language-chart')
    if (chartBlocks.length === 0 && document.querySelectorAll('.language-chart').length === 0) {
      retryCount++
      if (retryCount < 5) setTimeout(initChart, 200)
      return
    }
    retryCount = 0

    chartBlocks.forEach((el) => {
      if (el.__chartInstance) return
      try {
        Chart(el)
      } catch (e) {
        console.warn('[Chart plugin] init failed:', e)
      }
    })
  }

 //echarts
  var initEcharts = function(){
    if (!Echarts) {
      Echarts = require('./pluginComponents/Echarts/Echarts.js').default || require('./pluginComponents/Echarts/Echarts.js')
    }
     // 渲染 ECharts 图表
    const echartBlocks = document.querySelectorAll('.language-echarts')
    if (echartBlocks.length === 0 && document.querySelectorAll('.language-echarts').length === 0) {
      retryCount1++
      if (retryCount1 < 5) setTimeout(initEcharts, 200)
      return
    }
    retryCount1 = 0
    echartBlocks.forEach((el) => {
      if (el.__chartInstance) return
      try {
        Echarts(el)
      } catch (e) {
        console.warn('[Echarts plugin] init failed:', e)
      }
    })
  }
  

  var initMarkmap = function(){
    if (!Markmap) { 
      Markmap = require('./pluginComponents/Markmap/Markmap.js').default || require('./pluginComponents/Markmap/Markmap.js')
    }  

    // 渲染 Markmap 思维导图
    const markmapBlocks = document.querySelectorAll('.language-markmap')
    if (markmapBlocks.length === 0) {
      retryCount2++
      if (retryCount2 < 5) setTimeout(initMarkmap, 200)
      return
    }
    retryCount2 = 0

    markmapBlocks.forEach((el) => {
      if (el.__mmInstance) return
      try {
        Markmap(el).catch(e => console.warn('[Markmap plugin] init failed:', e))
      } catch (e) {
        console.warn('[Markmap plugin] init failed:', e)
      }
    })
  }


  // var initMarp = ()=>{
  //   if (!Marp) { 
  //     Marp = require('./pluginComponents/Marp/Marp.js').default || require('./pluginComponents/Marp/Marp.js')
  //   }  

  //   // 渲染 Marp ppt
  //   const markmapBlocks = document.querySelectorAll('.language-marp')
  //   if (markmapBlocks.length === 0) {
  //     retryCount3++
  //     if (retryCount3 < 5) setTimeout(initMarkmap, 200)
  //     return
  //   }
  //   retryCount3 = 0

  //   markmapBlocks.forEach((el) => {
  //     if (el.__mmInstance) return
  //     try {
  //       Marp(el).catch(e => console.warn('[Marp plugin] init failed:', e))
  //     } catch (e) {
  //       console.warn('[Marp plugin] init failed:', e)
  //     }
  //   })
  // }
  

  var initPlatUml = function(){
    if (!PlantUml) { 
      PlantUml = require('./pluginComponents/PlantUml/PlantUml.js').default || require('./pluginComponents/PlantUml/PlantUml.js')
    }

     // 渲染 plantuml 思维导图
    const plantumlBlocks = document.querySelectorAll('.language-plantuml')
    if (plantumlBlocks.length === 0) {
      retryCount4++
      if (retryCount4 < 5) setTimeout(initPlatUml, 200)
      return
    }
    retryCount4 = 0

    plantumlBlocks.forEach((el) => {
      if (el.__mmInstance) return
      try {
        PlantUml(el).catch(e => console.warn('[PlantUml plugin] init failed:', e))
      } catch (e) {
        console.warn('[PlantUml plugin] init failed:', e)
      }
    })
  }

  var initCallouts = function(){
    if (!Callout) {
      Callout = require('./pluginComponents/Callout/Callout.js').default || require('./pluginComponents/Callout/Callout.js')
    }
    const calloutBlocks = document.querySelectorAll('blockquote')
    console.log('calloutBlocks', calloutBlocks)
    if (calloutBlocks.length === 0) {
      retryCount5++
      if (retryCount5 < 5) setTimeout(initCallouts, 200)
      return
    }
    retryCount5 = 0
    
    calloutBlocks.forEach((el) => {
      if (el.__calloutInstance) return
      try {
        Callout(el)
      } catch (e) {
        console.warn('[Callout plugin] init failed:', e)
      } 
    })
  }



  const initAllPlugins = () => {

    initChart();
    initEcharts();
    initMarkmap();
    // initMarp();

    initPlatUml();
    initCallouts();


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
    retryCount1 = 0
    retryCount2 = 0
    setTimeout(initAllPlugins, 300)
  })
}
