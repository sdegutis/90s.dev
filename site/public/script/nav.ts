for (const a of document.querySelectorAll<HTMLAnchorElement>('#nav a')) {
  a.classList.toggle('current', a.href === location.href)
}
