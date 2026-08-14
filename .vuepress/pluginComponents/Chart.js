// vuepress渲染页面时 把language-charts标记中的内容 直接渲染成图表
const chart = require("./chart.min.js") 


 function extractConfig(text) {
   const idx = text.lastIndexOf('config =')
   if (idx === -1) return null
   return text.slice(idx + 'config ='.length).trim()
 }
 
 function parseConfig(str) {
   try {
     return new Function('return (' + str + ')')()
   } catch (e) {
     console.warn('[v-language-chart] 解析失败:', e)
     return null
   }
 }


export default function Chart(el){
	el.style.display = 'none';
	const codeEl = el.querySelector('code')
	if (!codeEl) return
	const config = parseConfig(extractConfig(codeEl.textContent || ''))
	if (!config) return

	if (el.__chartInstance) el.__chartInstance.destroy()


	var canvas = document.createElement('canvas') 
	el.insertAdjacentElement('afterend', canvas)


	el.__chartInstance = new chart(canvas,config) 
}