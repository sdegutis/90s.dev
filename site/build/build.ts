import { LiveTree, Pipeline } from 'immaculata'
import { oshost } from '../../data.ts'
import { template } from "../build/template.tsx"
import { compileTsx } from './compile.ts'
import { addHeaderPermalinks, checkForIframes, generateToc, makeRenderer, renameMarkdownLinks, runcodeMacro, sectionMacro, type Toc } from "./markdown.ts"
import { monaco } from './monaco.ts'
import { highlightCode } from './shiki.ts'

let reloader = ''
if (false && process.argv[2] === 'dev') reloader = `
<script type="module">
const es = new EventSource('/reload')
es.onmessage = () => location.reload()
window.onbeforeunload = () => es.close()
</script>`

export type Env = {
  toc: Toc
  iframes?: boolean
}

const renderer = makeRenderer({}, [
  renameMarkdownLinks,
  generateToc,
  highlightCode,
  addHeaderPermalinks,
  checkForIframes(oshost),
  sectionMacro,
  runcodeMacro,
])

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

    files.with('\.md$').do(f => {
      f.path = f.path.replace('.md', '.html')
      f.text = f.text.replaceAll('${OSHOST}', oshost)
      const env: Env = { toc: [] }
      const result = renderer.render(f.text, env)
      f.text = template(blogs, result, env)
    })

    files.with(/\.tsx?$/).do(f => {
      const out = compileTsx(f.text, f.path)
      const jsPath = f.path.replace(/\.tsx?$/, '.js')
      files.add(f.path, f.text)
      files.add(jsPath + '.map', out.sourceMapText!)
      f.text = out.outputText
      f.path = jsPath
    })

    if (reloader) files.with(/\.html$/).do(f => { f.text = f.text.replace('<head>', '$&' + reloader) })

    files.graft('/monaco', Pipeline.from(monaco.files).with('^/min/'))

    files.add('/os.txt', oshost)

  })
}
