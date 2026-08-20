// vuepress渲染页面时 把language-echart标记中的内容 直接渲染成ECharts图表
if (typeof global === 'undefined') {
window.global = window;
}

if (typeof process === 'undefined') {
window.process = { env: { NODE_ENV: 'production' } };
}
// const marp = require("./marp-core.min.js").default || require("./marp-core.min.js") 
const markmapModule = require("./sb-markmap.common.js")
const marp = markmapModule.default || markmapModule
require('./sb-markmap.css');

if (typeof document !== 'undefined' && !document.getElementById('vuepress-markmap-style')) {
  const markmapStyle = document.createElement('style');
  markmapStyle.id = 'vuepress-markmap-style';
  markmapStyle.textContent = `
  .vuepress-markmap-container {
    display: block;
    width: 100%;
    min-height: 300px;
    margin: 1rem 0;
    overflow: hidden;
  }

  .vuepress-markmap-container > svg {
    display: block;
    width: 100%;
    height: 300px;
  }
`;
  document.head.appendChild(markmapStyle);
}
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

function getMarkmapOption(content, optionName) {
  const markmapConfig = content.match(
    /^markmap:\s*\r?\n((?:^[ \t]+.*(?:\r?\n|$))*)/m,
  )
  const optionMatch = markmapConfig?.[1]?.match(
    new RegExp(`^\\s+${optionName}:\\s*([^\\r\\n]+)`, 'm'),
  )
  const value = optionMatch?.[1]?.trim()

  return value?.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2')
}

function getMarkmapHeight(content) {
  const height = getMarkmapOption(content, 'height')

  if (!height) return '300px'
  return /^\d+(?:\.\d+)?$/.test(height) ? `${height}px` : height
}

function createContainerClass() {
  return `vuepress-markmap-container-${Date.now()}-${Math.random().toString(36).slice(2)}`
}


export default async function Marpmap(el) { 
  el.style.display = 'none'
  const codeEl = el.querySelector('code')
  if (!codeEl) return
  // const config = parseConfig(extractConfig(codeEl.textContent || ''))
  const config = codeEl.textContent || ''
  if (!config) return
  var container = document.createElement('div')
  const height = getMarkmapHeight(config)
  const backgroundColor = getMarkmapOption(config, 'backgroundColor')
  container.className = createContainerClass()
  container.style.cssText = `display: block; width: 100%; min-height: ${height}; margin: 1rem 0; overflow: hidden;`
  if (backgroundColor) container.style.backgroundColor = backgroundColor
  var div = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  div.style.display = 'block'
  div.style.width = '100%'
  div.style.height = height
  if (backgroundColor) div.style.backgroundColor = backgroundColor
  container.appendChild(div)
  el.insertAdjacentElement('afterend', container)

//   const { root } = marp.transformer.transform(`---
// markmap:
//   height: 300px
//   backgroundColor: "#f8f8f8"
// ---

// # 日常记录 
// ## dsfsdfd`);
const { root } = marp.transformer.transform(config);


  var mm = marp.Markmap.create(div, { duration: 0 });
  el.__mmInstance = mm
  await mm.setData(root);
  await mm.fit();
  

  // el.__chartInstance = echarts.init(div)
  // el.__chartInstance.setOption(config)

  // // 响应窗口大小变化
  // window.addEventListener('resize', () => {
  //   if (el.__chartInstance) el.__chartInstance.resize()
  // })
}
