// .vuepress/enhanceApp.js 
import Chart from './pluginComponents/Chart.js'

export default ({ Vue, options, router, siteData, isServer }) => {

       if (isServer) return  // ✅ 构建阶段直接跳过，不碰任何 DOM
        
       var initAllPlugins = function(){

          //渲染chart图表
          document.querySelectorAll('.language-chart').forEach((item)=>{Chart(item)})
       }

       if (document.readyState === 'loading') {
         document.addEventListener('DOMContentLoaded', ()=>{setTimeout(initAllPlugins,1000)})
       } else if(document.readyState === 'complete'){
         initAllPlugins()
       }
 
}