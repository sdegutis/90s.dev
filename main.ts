import * as immaculata from 'immaculata'
import { useTree } from 'immaculata/hooks.js'
import { registerHooks } from 'module'
import ts from 'typescript'
import { fileURLToPath } from 'url'
import { isDev, tree } from './static.ts'

registerHooks(useTree(tree))
registerHooks(immaculata.hooks.exportAsString({ bareExt: 'md' }))
registerHooks(immaculata.hooks.mapImport('react/jsx-runtime', 'immaculata/jsx-strings.js'))
registerHooks(immaculata.hooks.compileJsx((src, url) => compileTsx(src, fileURLToPath(url)).outputText))

if (isDev) {
  const server = new immaculata.DevServer(9090, { hmrPath: '/reload' })
  server.notFound = () => '/404.html'
  server.files = await processSite()

  tree.watch().on('filesUpdated', async (paths) => {
    console.log('Paths changed:', [...paths].map(path => '\n  ' + path).join(''))
    try { server.files = await processSite() }
    catch (e) { console.error(e) }
    server.reload(null)
  })
}
else {
  immaculata.generateFiles(await processSite())
}

async function processSite() {
  const mod = await import("./site/build/process.tsx")
  return mod.processSite()
}

function compileTsx(str: string, filename: string) {
  return ts.transpileModule(str, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      sourceMap: true,
      inlineSourceMap: true,
      inlineSources: true,
    }
  })
}
