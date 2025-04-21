export function mainPage(posts: { path: string, title: string }[], content: string) {
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
        <link href="https://fonts.googleapis.com/css2?family=Gemunu+Libre:wght@200..800&family=Geo:ital@0;1&family=Michroma&family=Oxanium:wght@200..800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
        <script type="module" src="/script/runcode.js"></script>
      </head>
      <body>

        <nav>

          <a id='sitelogo' href='/'>90s.dev</a>

          <h3>Examples</h3>
          <ul>
            <li><a href='/examples/hello-world.html'>Hello World</a></li>
          </ul>

          <h3>Guides</h3>
          <ul>
            <li><a href='/guides/refs.html'>Refs</a></li>
            <li><a href='/guides/views.html'>Views</a></li>
          </ul>

          <h3>API</h3>
          <ul>
            <li><a href='/api/refs.html'>Refs</a></li>
          </ul>

          <h3>Blog</h3>
          <ul>
            {posts.map(({ path, title }) => {
              return <li><a href={path}>{title}</a></li>
            })}
          </ul>

        </nav>

        <main>
          {content}
        </main>

      </body>
    </html>
  </>
}
