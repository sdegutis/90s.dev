import * as immaculata from 'immaculata'
import { registerHooks } from 'module'
import { fileURLToPath } from 'url'
import { isDev } from './isdev.ts'
import { compileTsx } from './site/build/compile.ts'

const tree = new immaculata.LiveTree('site', import.meta.url)
registerHooks(tree.enableImportsModuleHook())
registerHooks(immaculata.jsxRuntimeModuleHook('immaculata/dist/jsx-strings.js'))
registerHooks(immaculata.compileJsxTsxModuleHook((src, url) => compileTsx(src, fileURLToPath(url))))

if (isDev) {
  const server = new immaculata.DevServer(9090, { hmrPath: '/reload' })
  server.files = await processSite()

  tree.watch({}, async (paths) => {
    console.log('paths changed', [...paths].map(path => '\n  ' + path).join(''))
    try { server.files = await processSite() }
    catch (e) { console.error(e) }
    server.reload()
  })
}
else {
  immaculata.generateFiles(await processSite())
}

async function processSite() {
  const mod = await import("./site/build/build.ts")
  return await mod.processSite(tree)
}
