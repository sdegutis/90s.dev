
export function Html(data: { children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      {data.children}
    </html>
  </>
}

export function Head() {
  return <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>90s.dev</title>
    <meta charset="utf-8" />
    {/* {...data.files} */}
    <link rel="stylesheet" href="/style.css" />
    <script src="/script/darkmode.js"></script>
    <script type="module" src="/script/mnav.js"></script>
    <script type="module" src="/script/nav.js"></script>
    <script type="module" src="/script/toc.js"></script>
    <script src="https://sdegutis.github.io/bubbles/ssaver.js" type="module"></script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Gemunu+Libre:wght@200..800&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />

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
      <a href='/feed.xml'>RSS</a>
      <span style='font-family: Silkscreen'> :: </span>
      <a href='https://github.com/sdegutis/90s.dev?tab=readme-ov-file#contributing'>Contribute</a>
    </footer>
  </main>
}

export function Navbar(data: {
  posts: {
    path: string,
    title: string,
  }[]
}) {
  return <nav id='nav' class='navbar'>
    <p><a href='/' class='sitelogo'>90s.dev</a></p>
    <h3>Articles</h3>
    <ul>
      {data.posts.map(page => <li>
        <a href={page.path}>{page.title}</a>
      </li>)}
    </ul>
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
