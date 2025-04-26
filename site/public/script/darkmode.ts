(() => {
  const set = (mode: string) => {
    document.documentElement.classList.remove('darkmode', 'lightmode')
    if (mode) document.documentElement.classList.add(mode)
    localStorage.setItem('darkmode', mode)
  }

  const lastmode = localStorage.getItem('darkmode')
  if (lastmode !== null) set(lastmode)

  const toggledarkmode = document.querySelector('#toggledarkmode') as HTMLDivElement
  const [dark, light, system] = toggledarkmode.querySelectorAll('a')
  dark.onclick = (e) => { e.preventDefault(); set('darkmode') }
  light.onclick = (e) => { e.preventDefault(); set('lightmode') }
  system.onclick = (e) => { e.preventDefault(); set('') }
})()
