const div = document.querySelector('#underconstruction')!
const html = div.outerHTML
new MutationObserver((r) => {
  if (!document.querySelector('#underconstruction')) {
    document.body.insertAdjacentHTML('beforeend', html)
  }
}).observe(div.parentElement!, { childList: true })
