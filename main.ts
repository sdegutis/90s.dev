import * as immaculata from 'immaculata'
import { registerHooks } from 'module'
import { fileURLToPath } from 'url'
import { isDev } from './data.ts'
import { compileTsx } from './site/build/compile.ts'

const tree = new immaculata.LiveTree('site', import.meta.url)
registerHooks(tree.enableImportsModuleHook())
registerHooks(immaculata.exportAsStringModuleHook({ bareExt: 'md' }))
registerHooks(immaculata.jsxRuntimeModuleHook('immaculata/dist/jsx-strings.js'))
registerHooks(immaculata.compileJsxTsxModuleHook((src, url) => {
  return compileTsx(src, fileURLToPath(url), false).outputText
}))

if (isDev) {
  const server = new immaculata.DevServer(9090, { hmrPath: '/reload' })
  server.files = await processSite()

  tree.watch({}, async (paths) => {
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
  const mod = await import("./site/build/build.ts")
  return await mod.processSite(tree)
}
