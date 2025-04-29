import fm from 'front-matter'
import { Pipeline, type LiveTree } from 'immaculata'
import ts from 'typescript'
import { gemunulibre, martel, monaco, oshost, oxanium, silkscreen, tree } from '../../static.ts'
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

    const fonts = vendorFonts([
      { tree: martel, root: '/fonts/martel', files: ['/400.css', '/700.css'] },
      { tree: silkscreen, root: '/fonts/silkscreen', files: ['/400.css', '/700.css'] },
      { tree: oxanium, root: '/fonts/oxanium', files: ['/index.css'] },
      { tree: gemunulibre, root: '/fonts/gemunulibre', files: ['/index.css'] },
    ])

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
        <Head files={fonts.links} bettertsx={env.bettertsx ?? false} runcode={env.runcode ?? false} />
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
      <Head files={fonts.links} bettertsx={false} runcode={false} />
      <body>
        <Navbar pages={pages} />
        <Main content={
          <>
            <h1>Page not found</h1>
            <p>This page doesn't exist.</p>
            <p>Redirecting to one that does in 3, 2, 1...</p>
            <script>{`setTimeout(() => {location.href = '/'}, 3000)`}</script>
          </>
        } />
        <Sidebar toc={''} />
        <UnderConstruction />
      </body>
    </Html>)

    for (const font of fonts.subtrees) {
      files.graft(font.root, font.files)
    }

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

function vendorFonts(fonts: {
  tree: LiveTree,
  root: string,
  files: string[],
}[]) {
  const links: string[] = []
  const subtrees: { root: string, files: Pipeline }[] = []

  for (const font of fonts) {
    const pipeline = new Pipeline()
    subtrees.push({ root: font.root, files: pipeline })

    for (const file of font.files) {
      const content = font.tree.files.get(file)?.content.toString()!

      for (const match of content.matchAll(/url\(\.(.+?)\)/g)) {
        const path = match[1]!
        pipeline.add(path, font.tree.files.get(path)!.content)
        links.push(<link rel="preload" href={font.root + path} as="font" type="font/woff" crossorigin />)
      }

      pipeline.add(file, content)
      links.push(<link rel="stylesheet" href={font.root + file} />)
    }
  }

  return { subtrees, links }
}
