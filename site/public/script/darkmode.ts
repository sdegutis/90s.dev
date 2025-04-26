(() => {

  const toggledarkmode = document.querySelector('#toggledarkmode') as HTMLDivElement
  const [dark, light, system] = toggledarkmode.querySelectorAll('a')

  const buttons = { dark, light, '': system }
  const modes = new Map(Object.entries(buttons).map(([k, v]) => [v, k]))

  dark.onclick = light.onclick = system.onclick = (e) => {
    e.preventDefault()
    set(modes.get(e.target as HTMLAnchorElement)!)
  }

  const set = (mode: string) => {
    document.documentElement.classList.remove('dark', 'light')
    if (mode) document.documentElement.classList.add(mode)
    localStorage.setItem('dark', mode)
    for (const [m, button] of Object.entries(buttons)) {
      button.classList.toggle('current', mode === m)
    }
  }

  const lastmode = localStorage.getItem('dark')
  set(lastmode ?? '')

})()
