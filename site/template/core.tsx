import { isDev } from "../../globals.ts"
import { Nav } from '../build/nav.tsx'

export function Html(data: { children: any }) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      {data.children}
    </html>
  </>
}

export function Head(data: {
  iframes: boolean,
  runcode: boolean,
  bettertsx: boolean,
}) {
  return <head>
    <script src="/script/darkmode.js"></script>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/style.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>90s.dev</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&family=Martel:wght@200;300;400;600;700;800;900&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
    {data.runcode && <script type="module" src="/script/runcode.js"></script>}
    {data.iframes && <script type="module" src="/script/iframes.js"></script>}
    {data.bettertsx && <script type="module" src="/script/bettertsx.js"></script>}
    <script type="module" src="/script/toc.js"></script>
    <script type="module" src="/script/nav.js"></script>
    <script type="module" src="/script/mnav.js"></script>
  </head>
}

export function Main(data: { content: string }) {
  return <main id='main'>
    <header id='mobileheader'>
      <span>☰</span>
      <a class='sitelogo' href='/'>90s.dev</a>
      <span>☰</span>
    </header>

    {data.content}

    <footer>
      Copyright &copy; {new Date().getFullYear()} / <a href='mailto:admin@90s.dev'>Email</a>
    </footer>
  </main>
}

export function Navbar(data: { posts: { path: string, title: string }[] }) {
  return <nav id='nav' class='navbar'>
    <Nav />
    <h3>News</h3>
    <ul>
      {data.posts.map(({ path, title }) => {
        return <li><a href={path}>{title}</a></li>
      })}
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

export function UnderConstruction() {
  return !isDev &&
    <div id='underconstruction'>
      <p>
        ⚠️ Under construction ⚠️
        <span onclick="this.parentElement.parentElement.remove()">I don't care</span>
      </p>
    </div>
}
