import { isDev } from "../../static.ts"

export function Html(data: { children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      {data.children}
    </html>
  </>
}

export function Head(data: { files: string[] }) {
  return <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>90s.dev</title>
    <meta charset="utf-8" />
    {...data.files}
    <link rel="stylesheet" href="/style.css" />
    <script src="/script/darkmode.js"></script>
    <script type="module" src="/script/links.js"></script>
    <script type="module" src="/script/mnav.js"></script>
    <script type="module" src="/script/nav.js"></script>
    <script type="module" src="/script/toc.js"></script>
    <script src="https://bubbles.90s.dev/ssaver.js" type="module"></script>
  </head>
}

export function Main(data: { content: string }) {
  return <main id='main'>
    <header id='mobileheader'>
      <span>::Site::</span>
      <a class='sitelogo' href='/'>90s.dev</a>
      <span>::Page::</span>
    </header>

    {data.content}

    <footer>
      Copyright &copy; {new Date().getFullYear()}
      <span style='font-family: Silkscreen'> :: </span>
      Made with <a href='https://immaculata.dev/'>immaculata.dev</a>
      <span style='font-family: Silkscreen'> :: </span>
      <a href='mailto:admin@90s.dev'>Email</a>
      <span style='font-family: Silkscreen'> :: </span>
      <a href='/legal/tos.html'>Terms of Service</a>
      <span style='font-family: Silkscreen'> :: </span>
      <a href='/legal/privacy-policy.html'>Privacy Policy</a>
    </footer>
  </main>
}

export function Navbar(data: {
  pages: {
    path: string,
    title: string,
    section: string | undefined,
  }[]
}) {

  const sections = Object.entries({
    'about': 'About',
    'getting-started': 'Getting started',
    'guides': 'Guides',
    'technical': 'Technical',
    'reference': 'Reference',
    'community': 'Community',
    'blog': 'Blog',
  })

  const groups = Map.groupBy(data.pages, p => p.section)

  return <nav id='nav' class='navbar'>
    <p><a href='/' class='sitelogo'>90s.dev</a></p>

    <h3>Links</h3>
    <ul>
      <li><a href='https://github.com/sdegutis/os.90s.dev'>Github</a></li>
      <li><a href='https://os.90s.dev'>os.90s.dev</a></li>
      <li><a href='https://sys32.90s.dev'>sys32.90s.dev</a></li>
    </ul>

    {sections.map(([key, title]) => {
      const pages = groups.get(key)
      if (!pages) return ''

      return <>
        <h3>{title}</h3>
        <ul>
          {pages.map(page => <li>
            <a href={page.path}>{page.title}</a>
          </li>)}
        </ul>
      </>
    })}

  </nav>
}

export function Sidebar(data: { toc: string }) {
  return <div id='side' class='navbar'>

    <h3>Site Theme</h3>
    <div id='toggledarkmode'>
      <a href='#'>Dark</a>
      <a href='#'>Light</a>
      <a href='#'>System</a>
    </div>

    <h3>On this page</h3>
    <nav id='toc' class='table-of-contents'>
      {data.toc}
    </nav>

  </div>
}

export function UnderConstruction(data: { early?: boolean }) {
  return null
  return !isDev && <div id='underconstruction' class={data.early ? 'early' : ''}>
    <script type='module' src='/script/under-construction.js' />
    <p>
      ⚠️ under construction ⚠️
    </p>
  </div>
}
