import fm from 'front-matter'
import { Pipeline } from 'immaculata'
import ts from 'typescript'
import { monaco, oshost, tree } from '../../static.ts'
import { Head, Html, Main, Navbar, Sidebar, UnderConstruction } from "../template/core.tsx"
import { md, type Env } from "./markdown.ts"
import { tocToHtml } from './toc.ts'

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

    const pages = files.with('\.md$').all().map(p => {
      const path = p.path.replace('.md', '.html')
      const title = p.text.match(/[^#]*# *(.+)/)![1]
      const section = p.path.match('/(.+?)/')?.[1]
      const frontmatter = fm<{ order?: number }>(p.text)
      p.text = frontmatter.body
      const meta = frontmatter.attributes
      return { path, title, section, meta }
    })

    pages.sort((a, b) => {
      const ao = a.meta.order ?? Infinity
      const bo = b.meta.order ?? Infinity
      if (ao < bo) return -1
      if (ao > bo) return +1
      return 0
    })

    files.with('\.md$').do(f => {
      f.path = f.path.replace('.md', '.html')
      const env: Env = {}
      const result = md.render(f.text, env)
      f.text = <Html>
        <Head bettertsx={env.bettertsx ?? false} runcode={env.runcode ?? false} />
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

    files.add('/404.html', <Html>
      <Head bettertsx={false} runcode={false} />
      <body>
        <Navbar pages={pages} />
        <Main content={
          <>
            <h1>Page not found</h1>
            <p>This page doesn't exist.</p>
            <script>{`location.href = '/'`}</script>
          </>
        } />
        <Sidebar toc={''} />
        <UnderConstruction />
      </body>
    </Html>)

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
