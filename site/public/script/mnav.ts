for (const button of document.querySelectorAll<HTMLElement>('#mobileheader>span')) {
  const first = button.nextElementSibling
  button.onclick = () => {
    document.body.classList.toggle(first ? 'navmenu1' : 'navmenu2')
    setTimeout(() => {
      document.body.addEventListener('click', () => {
        document.body.classList.remove('navmenu1', 'navmenu2')
      }, { once: true })
    })
  }
}
