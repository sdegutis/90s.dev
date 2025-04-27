const navlinks = document.querySelectorAll<HTMLAnchorElement>('#toc a')
const visible = new Set<HTMLElement>()

const observer = new IntersectionObserver(records => {
  records.sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0)

  for (const r of records) {
    if (r.isIntersecting)
      visible.add(r.target as HTMLElement)
    else
      visible.delete(r.target as HTMLElement)
  }

  const refdHeaders = [...visible].map(el => headerMap.get(el)!).sort((a, b) => {
    const ai = allHeaders.indexOf(a)
    const bi = allHeaders.indexOf(b)
    if (ai < bi) return -1
    if (ai > bi) return +1
    return 0
  })

  const header = refdHeaders[0]

  for (const a of navlinks) {
    a.classList.toggle('current', a.hash.slice(1) === header.id)
  }
}, { threshold: 1 })

const headerMap = new Map<HTMLElement, HTMLElement>()
const tops = [...document.querySelectorAll<HTMLElement>('main>*, main>section>*')].slice(1, -1)
const allHeaders: HTMLElement[] = []
for (const node of tops) {
  if (node.tagName.match(/^H\d$/)) {
    allHeaders.push(node)
  }
  headerMap.set(node, allHeaders.at(-1)!)
  observer.observe(node)
}

// checkhash()
// window.addEventListener('hashchange', checkhash)

// function checkhash() {
//   for (const a of document.querySelectorAll('a')) {
//     if (a.hash) {
//       a.classList.toggle('current', a.hash === location.hash)
//     }
//   }
// }
