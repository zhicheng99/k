// vuepress渲染页面时 把language-echart标记中的内容 直接渲染成ECharts图表
if (typeof global === 'undefined') {
window.global = window;
}

if (typeof process === 'undefined') {
window.process = { env: { NODE_ENV: 'production' } };
}
const plantUml = require("./plantuml-encoder.js").default || require("./plantuml-encoder.js") 
 
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
  

export default async function PlantUml(el) { 
  el.style.display = 'none'
  const codeEl = el.querySelector('code')
  if (!codeEl) return
  const config = codeEl.textContent || ''
  if (!config) return
  const encoded = plantUml.encode(config)
  el.__mmInstance = encoded
  const img = document.createElement('img')
  img.alt = 'PlantUML diagram';
  img.style.maxWidth = '100%';
  img.style.height = 'auto';
  img.style.display = 'block';
  img.style.margin = '0 auto';
  
  //后期再优化 如果希望完全离线生成图片，就不能只使用 plantuml-encoder，还需要引入 PlantUML 渲染器或本地 Java 服务。
  img.src = `https://www.plantuml.com/plantuml/png/${encoded}`
  el.insertAdjacentElement('afterend', img)
 
}
