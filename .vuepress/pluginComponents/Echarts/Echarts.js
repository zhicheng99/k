// vuepress渲染页面时 把language-echart标记中的内容 直接渲染成ECharts图表
if (typeof global === 'undefined') {
window.global = window;
}
const echarts = require("./echarts.min.js").default || require("./echarts.min.js") 
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


export default function Echarts(el) { 
  el.style.display = 'none'
  const codeEl = el.querySelector('code')
  if (!codeEl) return
  const config = parseConfig(extractConfig(codeEl.textContent || ''))
  if (!config) return

  if (el.__chartInstance) {
    el.__chartInstance.dispose()
    el.__chartInstance = null
  }

  var div = document.createElement('div')
  div.style.width = '100%'
  div.style.height = '400px'
  el.insertAdjacentElement('afterend', div)

  el.__chartInstance = echarts.init(div)
  el.__chartInstance.setOption(config)

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    if (el.__chartInstance) el.__chartInstance.resize()
  })
}
