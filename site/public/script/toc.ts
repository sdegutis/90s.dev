const navlinks = document.querySelectorAll<HTMLAnchorElement>('#toc a')
const root = document.querySelector('main')!
const visible = new Set<HTMLElement>()

function firstHeaderBefore(el: Element) {
  let node: Element | null = el
  while (node) {
    if (node.tagName.match(/^H\d$/)) return node
    node = node.previousElementSibling
  }
  return node
}

function highestStartingAt() {
  const ordered = [...visible].sort((a, b) => {
    if (a.offsetTop < b.offsetTop) return -1
    if (a.offsetTop > b.offsetTop) return +1
    return 0
  })
  return ordered.find(el => el.tagName.match(/^H\d$/))
    ?? firstHeaderBefore(ordered[0])
}

const observer = new IntersectionObserver(records => {
  records.sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0)
  for (const r of records) {
    if (r.isIntersecting)
      visible.add(r.target as HTMLElement)
    else
      visible.delete(r.target as HTMLElement)
  }

  const header = highestStartingAt()
  if (!header) return

  for (const a of navlinks) {
    a.classList.toggle('current', a.hash.slice(1) === header.id)
  }
}, { threshold: 1 })

for (const node of [...root.children].slice(1, -1)) {
  observer.observe(node)
}

checkhash()
window.addEventListener('hashchange', checkhash)

function checkhash() {
  for (const a of document.querySelectorAll('a')) {
    if (a.hash) {
      a.classList.toggle('current', a.hash === location.hash)
    }
  }
}
