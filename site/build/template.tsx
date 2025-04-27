import { isDev, oshost } from "../../isdev.ts"
import { Toc } from "./markdown.ts"

function tocToHtml(toc: Toc) {
  const table: string[] = []
  _tocToHtml(toc, table, 0, 1)
  return table.join('\n')
}

function _tocToHtml(toc: Toc, table: string[], i: number, level: number) {
  table.push(`<ul>`)
  for (; i < toc.length; i++) {
    const line = toc[i]
    table.push(`<li>`)
    table.push(`<a href="#${line.id}"># ${line.text}</a>`)

    const next = toc[i + 1]

    if (next && next.level > level) {
      i = _tocToHtml(toc, table, i + 1, next.level)
    }

    table.push(`</li>`)

    if (next && next.level < level) {
      break
    }
  }
  table.push(`</ul>`)
  return i
}

export function template(current: string, posts: { path: string, title: string }[], content: string, toc: Toc) {

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
        <script type="module" src="/script/iframes.js"></script>
        <script type="module" src="/script/toc.js"></script>
        <script type="module" src="/script/nav.js"></script>
      </head>
      <body>

        <nav id='nav' class='navbar'>

          <a class='sitelogo' href='/'>90s.dev</a>

          <h3>About</h3>
          <ul>
            <li><a href='/about/discover-90s-dev.html'>What is 90s.dev?</a></li>
            <li><a href='/about/getting-started.html'>Getting started</a></li>
            <li><a href='/about/hello-world.html'>Hello world tour</a></li>
          </ul>

          <h3>Guides</h3>
          <ul>
            <li><a href='/guides/api-reference.html'>API Reference</a></li>
            <li><a href='/guides/views.html'>Views</a></li>
            <li><a href='/guides/refs.html'>Refs</a></li>
            <li><a href='/guides/filesystem.html'>Filesystem</a></li>
            <li><a href='/guides/composites.html'>Composites</a></li>
            <li><a href='/guides/shells.html'>Shells</a></li>
          </ul>

          <h3>Collaboration</h3>
          <ul>
            <li><a href='/collaboration/creating-an-account.html'>Creating an account</a></li>
            <li><a href='/collaboration/publishing-apps.html'>Publishing apps</a></li>
            <li><a href='/collaboration/publishing-libs.html'>Publishing libraries</a></li>
            <li><a href='/collaboration/publishing-files.html'>Publishing files</a></li>
          </ul>

          <h3>Links</h3>
          <ul>
            <li><a href={oshost}>os.90s.dev</a></li>
            <li><a href='https://github.com/ppl-90s-dev/ppl/issues'>Feature requests</a></li>
            <li><a href='https://github.com/ppl-90s-dev/ppl/issues'>Bug reports</a></li>
            <li><a href='https://github.com/ppl-90s-dev/ppl/wiki'>Community wiki</a></li>
          </ul>

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
            {tocToHtml(toc)}
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
