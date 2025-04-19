import { Pipeline } from "immaculata"

export function mainPage(posts: Pipeline, content: string) {
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
        <nav>
          <h3>Learn</h3>
          <a href='/'>About</a>
          <a href='/refs.html'>Refs</a>
          <a href='/views.html'>Views</a>
          <h3>Blog</h3>
          {posts.all().map(f => {
            const path = f.path.replace('.md', '.html')
            const title = f.text.split('\n')[0].slice(2)
            return <a href={path}>{title}</a>
          })}
        </nav>
        <main>
          {content}
        </main>
      </body>
    </html>
  </>
}
