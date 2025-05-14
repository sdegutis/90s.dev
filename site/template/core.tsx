
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
      Copyright &copy; {new Date().getFullYear()} / <a href='mailto:admin@90s.dev'>Email</a>
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
    about: 'Learn',
    guides: 'Guides',
    collaboration: 'Collaboration',
    links: 'Links',
    blogs: 'News',
    legal: 'Legal',
  })

  const pages = [
    ...data.pages,
    { section: 'links', title: '90s.dev/os/', path: '/os/' },
    { section: 'links', title: 'Feature requests', path: 'https://github.com/ppl-90s-dev/ppl/issues' },
    { section: 'links', title: 'Bug reports', path: 'https://github.com/ppl-90s-dev/ppl/issues' },
    { section: 'links', title: 'Community wiki', path: 'https://github.com/ppl-90s-dev/ppl/wiki' },
  ]

  const groups = Map.groupBy(pages, p => p.section)

  return <nav id='nav' class='navbar'>
    <p><a href='/' class='sitelogo'>90s.dev</a></p>

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
  return <div id='underconstruction' class={data.early ? 'early' : ''}>
    <script type='module' src='/script/under-construction.js' />
    <p>
      ⚠️ not yet public; things may break ⚠️
    </p>
  </div>
}
