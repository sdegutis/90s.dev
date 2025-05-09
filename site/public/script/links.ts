for (const a of document.querySelectorAll('a')) {
  if (!a.href.startsWith(location.origin)) {
    if (a.href.startsWith('/os/#')) {
      a.onclick = (e) => {
        if (e.ctrlKey) return
        e.preventDefault()

        const maybe = a.parentElement?.nextElementSibling
        if (maybe?.tagName === 'IFRAME') {
          maybe.remove()
          return
        }

        const iframe = document.createElement('iframe')
        iframe.className = 'embedded'
        iframe.width = '640'
        iframe.height = '360'
        iframe.src = a.href
        a.parentElement?.insertAdjacentElement('afterend', iframe)
      }
    }
    else {
      a.target = '_blank'
    }
  }
}
