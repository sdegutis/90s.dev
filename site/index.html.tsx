export function mainPage(content: string) {
  return <>
    {'<!DOCTYPE html>'}
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="/style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>90s.dev</title>
      </head>
      <body>
        {/* <nav>
          <h3>Learn</h3>
          <a href='/'>About</a>
          <a href='/api/refs'>Refs</a>
          <a href='/api/views'>Views</a>
        </nav> */}
        <main>
          {content}
        </main>
      </body>
    </html>
  </>
}
