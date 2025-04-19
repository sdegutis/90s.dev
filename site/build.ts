import * as immaculata from 'immaculata'
import { md } from "./highlight.ts"
import { mainPage } from "./page.html.tsx"

let reloader = ''
if (process.argv[2] === 'dev') reloader = `
<script type="module">
const es = new EventSource('/reload')
es.onmessage = () => location.reload()
window.onbeforeunload = () => es.close()
</script>
`

export async function processSite(tree: immaculata.LiveTree) {
  return tree.processFiles(async (files) => {

    const pages = files.with('^/pages/').copy()
    const blogs = files.with('^/blogs/').copy()

    files.without('^/public/').remove()
    files.do(f => f.path = f.path.slice('/public'.length))

    pages.do(f => {
      const path = f.path.replace('/pages', '').replace('.md', '.html')
      const content = mainPage(blogs, reloader + md.render(f.text))
      files.add(path, content)
    })

    blogs.do(f => {
      const path = f.path.replace('.md', '.html')
      const content = mainPage(blogs, reloader + md.render(f.text))
      files.add(path, content)
    })

  })
}
