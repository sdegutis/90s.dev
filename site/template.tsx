import { oshost } from "../isdev.ts"

export function mainPage(current: string, posts: { path: string, title: string }[], content: string, toc: string) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>90s.dev</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&family=Martel:wght@200;300;400;600;700;800;900&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
        <script type="module" src="/script/runcode.js"></script>
      </head>
      <body>

        <nav id='nav' class='navbar'>

          <a class='sitelogo' href='/'>90s.dev</a>

          <h3>About</h3>
          <ul>
            <li><A current={current} href='/what-is-90s-dev.html'>What is 90s.dev?</A></li>
            <li><A current={current} href='/getting-started.html'>Getting started</A></li>
            <li><A current={current} href='/hello-world.html'>Hello world tour</A></li>
          </ul>

          <h3>Guides</h3>
          <ul>
            <li><A current={current} href='/api-reference.html'>API Reference</A></li>
            <li><A current={current} href='/understanding-views.html'>Views</A></li>
            <li><A current={current} href='/understanding-refs.html'>Refs</A></li>
            <li><A current={current} href='/understanding-fs.html'>Filesystem</A></li>
            <li><A current={current} href='/understanding-composites.html'>Composites</A></li>
            <li><A current={current} href='/writing-shells.html'>Shells</A></li>
          </ul>

          <h3>Collaboration</h3>
          <ul>
            <li><A current={current} href='/creating-an-account.html'>Creating an account</A></li>
            <li><A current={current} href='/publishing-apps.html'>Publishing apps</A></li>
            <li><A current={current} href='/publishing-libs.html'>Publishing libraries</A></li>
            <li><A current={current} href='/publishing-files.html'>Publishing files</A></li>
          </ul>

          <h3>Links</h3>
          <ul>
            <li><A current={current} href={oshost}>os.90s.dev</A></li>
            <li><A current={current} href='https://github.com/ppl-90s-dev/ppl/issues'>Feature requests</A></li>
            <li><A current={current} href='https://github.com/ppl-90s-dev/ppl/issues'>Bug reports</A></li>
            <li><A current={current} href='https://github.com/ppl-90s-dev/ppl/wiki'>Community wiki</A></li>
          </ul>

          <h3>News</h3>
          <ul>
            {posts.map(({ path, title }) => {
              return <li><A current={current} href={path}>{title}</A></li>
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

        {toc}

      </body>
    </html>
  </>
}

function A(data: { current: string, href: string, children: string }) {
  return <a
    class={data.current === data.href ? 'current' : ''}
    href={data.href}
    children={data.children}
  />
}
