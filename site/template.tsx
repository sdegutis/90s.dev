export function mainPage(current: string, posts: { path: string, title: string }[], content: string) {
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
        <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
        <script type="module" src="/script/runcode.js"></script>
      </head>
      <body>

        <nav>

          <a class='sitelogo' href='/'>90s.dev</a>

          <h3>Guides</h3>
          <ul>
            <li><A current={current} href='/guides/getting-started.html'>Getting started</A></li>
            <li><A current={current} href='/guides/hello-world.html'>Hello world</A></li>
            <li><A current={current} href='/guides/sharing-apps.html'>Sharing apps</A></li>
            <li><A current={current} href='/guides/refs.html'>Refs</A></li>
            <li><A current={current} href='/guides/views.html'>Views</A></li>
          </ul>

          <h3>Examples</h3>
          <ul>
            <li><A current={current} href='/examples/todo-list.html'>Todo List</A></li>
          </ul>

          <h3>API</h3>
          <ul>
            <li><A current={current} href='/api/refs.html'>Refs</A></li>
          </ul>

          <h3>Blog</h3>
          <ul>
            {posts.map(({ path, title }) => {
              return <li><A current={current} href={path}>{title}</A></li>
            })}
          </ul>

        </nav>

        <main>
          <header id='togglemenu'>
            <a class='sitelogo' href='/'>90s.dev</a>
            <span>☰</span>
          </header>

          {content}

          <footer>
            Copyright &copy; {new Date().getFullYear()}. <a href='mailto:admin@90s.dev'>Email</a>
          </footer>
        </main>

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
