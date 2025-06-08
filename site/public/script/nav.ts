for (const a of document.querySelectorAll<HTMLAnchorElement>('#nav a')) {
  a.classList.toggle('current', location.href.startsWith(a.href))
}
