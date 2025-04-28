import { Pipeline } from 'immaculata'
import { oshost, tree } from '../../data.ts'
import { compileTsx } from './compile.ts'
import { monaco } from './monaco.ts'
import { checkForIframes } from './plugins/iframes.ts'
import { addHeaderPermalinks, markdown, renameMarkdownLinks, sectionMacro, type Env } from "./plugins/markdown.ts"
import { runcodeMacro } from './plugins/runcode.ts'
import { highlightCode } from './plugins/shiki.ts'
import { generateToc, tocToHtml } from './plugins/toc.ts'
import { Head, Html, Main, Navbar, Sidebar, UnderConstruction } from "./template.tsx"

let reloader = ''
if (false && process.argv[2] === 'dev') reloader = `
<script type="module">
const es = new EventSource('/reload')
es.onmessage = () => location.reload()
window.onbeforeunload = () => es.close()
</script>`

const renderer = markdown({}, [
  renameMarkdownLinks,
  generateToc,
  highlightCode,
  addHeaderPermalinks,
  checkForIframes,
  sectionMacro,
  runcodeMacro,
])

export async function processSite() {
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
      const env: Env = {}
      const result = renderer.render(f.text, env)
      f.text = <Html>
        <Head iframes={env.iframes ?? false} />
        <body>
          <Navbar posts={blogs} />
          <Main content={result} />
          <Sidebar toc={tocToHtml(env.toc!)} />
          <UnderConstruction />
        </body>
      </Html>
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
