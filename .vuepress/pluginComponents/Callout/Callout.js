const CALLOUTS = [
  { type: "tip", background_color: "#D8F2E5", left_line_color: "#3ABD7E", icon: "\\f02c" },
  { type: "bug", background_color: "#FEEED3", left_line_color: "#E0AC00", icon: "\\f188" },
  { type: "info", background_color: "#DFF6DD", left_line_color: "#3ABD7E", icon: "\\f05a" },
  { type: "note", background_color: "#E1D1EB", left_line_color: "#6A1B9A", icon: "\\f040" },
  { type: "quote", background_color: "#FAFAFA", left_line_color: "#777777", icon: "\\f10d" },
  { type: "example", background_color: "#F1EDFD", left_line_color: "#777777", icon: "\\f133" },
  { type: "caution", background_color: "#FDE7E9", left_line_color: "#C62828", icon: "\\f024" },
  { type: "failure", background_color: "#F4D4D4", left_line_color: "#C62828", icon: "\\f00d" },
  { type: "warning", background_color: "#FEEED3", left_line_color: "#E0AC00", icon: "\\f071" },
  { type: "success", background_color: "#D8F2E5", left_line_color: "#3ABD7E", icon: "\\f00c" },
  { type: "question", background_color: "#FFF4CE", left_line_color: "#E0AC00", icon: "\\f128" },
  { type: "abstract", background_color: "#E5F8F8", left_line_color: "#777777", icon: "\\f00b" },
  { type: "important", background_color: "#D8E6F3", left_line_color: "#3B83C1", icon: "\\f132" },
]

const CALLOUT_TYPES = CALLOUTS.map((callout) => callout.type).join('|')
const CALLOUT_MARKER_RE = new RegExp(`\\[!\\s*(${CALLOUT_TYPES})\\s*\\]`, 'i')

function ensureCalloutLabel(el, type) {
  const paragraph = el.querySelector('p:first-child')
  if (!paragraph) return

  const firstElement = paragraph.firstElementChild
  if (firstElement && firstElement.tagName.toLowerCase() === 'span') {
    firstElement.setAttribute('data-type', type.toUpperCase())
    ensureCalloutContent(paragraph, firstElement)
    return
  }

  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT)
  let textNode = walker.nextNode()
  while (textNode) {
    const markerMatch = textNode.nodeValue.match(CALLOUT_MARKER_RE)
    if (markerMatch) {
      const label = document.createElement('span')
      label.className = 'md-plain'
      label.setAttribute('data-type', type.toUpperCase())
      label.textContent = markerMatch[0]

      const before = textNode.nodeValue.slice(0, markerMatch.index)
      const after = textNode.nodeValue.slice(markerMatch.index + markerMatch[0].length)
      const fragment = document.createDocumentFragment()
      if (before) fragment.appendChild(document.createTextNode(before))
      fragment.appendChild(label)
      if (after) fragment.appendChild(document.createTextNode(after))
      textNode.parentNode.replaceChild(fragment, textNode)
      ensureCalloutContent(paragraph, label)
      return
    }
    textNode = walker.nextNode()
  }

  const label = document.createElement('span')
  label.className = 'md-plain'
  label.setAttribute('data-type', type.toUpperCase())
  paragraph.insertBefore(label, paragraph.firstChild)
  ensureCalloutContent(paragraph, label)
}

function ensureCalloutContent(paragraph, label) {
  const contentNodes = []
  let contentSpan = null

  for (const node of Array.from(paragraph.childNodes)) {
    if (node === label) continue
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('callout-content')) {
      contentSpan = node
      continue
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('md-softbreak')) {
      continue
    }
    if (!contentSpan && node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'span') {
      contentSpan = node
      contentSpan.classList.add('callout-content')
      continue
    }
    contentNodes.push(node)
  }

  if (!contentSpan) {
    contentSpan = document.createElement('span')
    contentSpan.className = 'callout-content'
  }

  contentNodes.forEach((node) => contentSpan.appendChild(node))

  const softbreak = Array.from(paragraph.childNodes).find(
    (node) => node.nodeType === Node.ELEMENT_NODE && node.classList.contains('md-softbreak')
  )
  if (softbreak) {
    paragraph.insertBefore(contentSpan, softbreak.nextSibling)
  } else {
    paragraph.appendChild(contentSpan)
  }
}

export default function Callout(el){
  if (!el || !el.textContent) return

  const content = el.textContent
  const markerMatch = content.match(CALLOUT_MARKER_RE)
  const type = markerMatch && markerMatch[1]

  if (!type) return

  const normalizedType = type.toLowerCase()
  el.classList.add('plugin-callout')
  el.setAttribute('callout-type', normalizedType)
  ensureCalloutLabel(el, normalizedType)
  el.__calloutInstance = { type: normalizedType }
}