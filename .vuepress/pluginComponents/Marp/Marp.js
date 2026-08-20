// vuepress渲染页面时 把language-echart标记中的内容 直接渲染成ECharts图表
if (typeof global === 'undefined') {
window.global = window;
}

if (typeof process === 'undefined') {
window.process = { env: { NODE_ENV: 'production' } };
}
const marp = require("./marp-core.min.js").default || require("./marp-core.min.js")  
 
function extractConfig(text) {
  const idx = text.lastIndexOf('option =')
  if (idx === -1) return null
  return text.slice(idx + 'option ='.length).trim()
}

function parseConfig(str) {
  try {
    return new Function('return (' + str + ')')()
  } catch (e) {
    console.warn('[v-language-echart] 解析失败:', e)
    return null
  }
} 


export default async function Marp(el) { 
   
}
