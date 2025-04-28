import mdattrs from 'markdown-it-attrs'
import { isDev } from "../../data.ts"
import navMd from './nav.md'
import { makeRenderer, renameMarkdownLinks, type Env } from "./plugins/markdown.ts"
import { tocToHtml } from './plugins/toc.ts'

const renderer = makeRenderer({}, [
  renameMarkdownLinks,
  mdattrs,
])

const navHtml = renderer.render(navMd)

export function template(posts: { path: string, title: string }[], content: string, env: Env) {

  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>
        <script src="/script/darkmode.js"></script>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>90s.dev</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&family=Martel:wght@200;300;400;600;700;800;900&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
        <script type="module" src="/script/runcode.js"></script>
        {env.iframes && <script type="module" src="/script/iframes.js"></script>}
        <script type="module" src="/script/toc.js"></script>
        <script type="module" src="/script/nav.js"></script>
      </head>
      <body>

        <nav id='nav' class='navbar'>

          {navHtml}

          <h3>News</h3>
          <ul>
            {posts.map(({ path, title }) => {
              return <li><a href={path}>{title}</a></li>
            })}
          </ul>

        </nav>

        <main id='main'>
          <header id='mobileheader'>
            <span>☰</span>
            <a class='sitelogo' href='/'>90s.dev</a>
            <span>☰</span>
          </header>

          {content}

          <footer>
            Copyright &copy; {new Date().getFullYear()} / <a href='mailto:admin@90s.dev'>Email</a>
          </footer>
        </main>

        <div id='side' class='navbar'>

          <h3>Site Theme</h3>
          <div id='toggledarkmode'>
            <a href='#'>Dark</a>
            <a href='#'>Light</a>
            <a href='#'>System</a>
          </div>

          <h3>On this page</h3>
          <nav id='toc' class='table-of-contents'>
            {tocToHtml(env.toc!)}
          </nav>

        </div>

        {!isDev &&
          <div id='underconstruction'>
            <p>
              ⚠️ Under construction ⚠️
              <span onclick="this.parentElement.parentElement.remove()">I don't care</span>
            </p>
          </div>
        }

      </body>
    </html>
  </>
}
