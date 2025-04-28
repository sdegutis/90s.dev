import { Pipeline } from 'immaculata'
import ts from 'typescript'
import { monaco, oshost, tree } from '../../static.ts'
import { md, type Env } from "../plugins/markdown.ts"
import { tocToHtml } from '../plugins/toc.ts'
import { Head, Html, Main, Navbar, Sidebar, UnderConstruction } from "../template/core.tsx"

let reloader = ''
if (true && process.argv[2] === 'dev') reloader = `
<script type="module">
const es = new EventSource('/reload')
es.onmessage = () => location.reload()
window.onbeforeunload = () => es.close()
</script>`

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

    const pages = files.with('\.md$').all().map(p => {
      const path = p.path.replace('.md', '.html')
      const title = p.text.match(/[^#]*# *(.+)/)![1]
      const section = p.path.match('/(.+?)/')?.[1]
      return { path, title, section }
    })

    files.with('\.md$').do(f => {
      f.path = f.path.replace('.md', '.html')
      const env: Env = {}
      const result = md.render(f.text, env)
      f.text = <Html>
        <Head
          bettertsx={env.bettertsx ?? false}
          runcode={env.runcode ?? false}
        />
        <body>
          <Navbar pages={pages} />
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

function compileTsx(str: string, filename: string) {
  return ts.transpileModule(str, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      sourceMap: true,
    }
  })
}
