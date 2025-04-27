import { LiveTree, Pipeline } from 'immaculata'
import { oshost } from '../../isdev.ts'
import { mainPage } from "../template.tsx"
import { compileTsx } from './compile.ts'
import { render } from "./markdown.ts"
import { monaco } from './monaco.ts'

let reloader = ''
if (false && process.argv[2] === 'dev') reloader = `
<script type="module">
const es = new EventSource('/reload')
es.onmessage = () => location.reload()
window.onbeforeunload = () => es.close()
</script>
`

export async function processSite(tree: LiveTree) {
  return tree.processFiles(files => {

    files.with('\.d\.ts$').remove()

    files.without('^/public').remove()
    files.with('/public').do(f => f.path = f.path.replace(/^\/public/, ''))

    const blogs = files.with('^/blogs/').all().map(f => {
      const path = f.path.replace('.md', '.html')
      const title = f.text.split('\n')[0].slice(2)
      return { path, title }
    })

    files.with('^/guides/').do(f => {
      f.path = f.path.slice('/guides'.length)
    })

    files.with('\.md$').do(f => {
      f.path = f.path.replace('.md', '.html')
      f.text = f.text.replaceAll('${OSHOST}', oshost)
      const result = render(f.text)
      f.text = mainPage(f.path, blogs, result.html, result.toc)
    })

    files.with(/\.tsx?$/).do(f => {
      f.text = compileTsx(f.text, f.path)
      f.path = f.path.replace(/\.tsx?$/, '.js')
    })

    if (reloader) files.with(/\.html$/).do(f => { f.text = f.text.replace('<head>', '$&' + reloader) })

    files.graft('/monaco', Pipeline.from(monaco.files).with('^/min/'))

    files.add('/os.txt', oshost)

  })
}
