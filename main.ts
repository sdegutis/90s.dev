import * as immaculata from 'immaculata'
import { registerHooks } from 'module'
import { compileTsx } from './site/compile.ts'

const isDev = process.argv[2] === 'dev'

const tree = new immaculata.LiveTree('site', import.meta.url)
registerHooks(tree.enableImportsModuleHook())
registerHooks(immaculata.jsxRuntimeModuleHook('immaculata/dist/jsx-strings.js'))
registerHooks(immaculata.compileJsxTsxModuleHook(compileTsx))

if (isDev) {
  const server = new immaculata.DevServer(9090, { hmrPath: '/reload' })
  server.files = await processSite()

  tree.watch({}, async (paths) => {
    try { server.files = await processSite() }
    catch (e) { console.error(e) }
    server.reload()
  })
}
else {
  immaculata.generateFiles(await processSite())
}

async function processSite() {
  const mod = await import("./site/build.ts")
  return await mod.processSite(tree, isDev)
}
