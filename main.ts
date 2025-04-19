import * as immaculata from 'immaculata'

const isDev = process.argv[2] === 'dev'

const tree = new immaculata.LiveTree('site', import.meta.url)

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 5"><path d="M1 0 L3 2 1 4 Z" fill="#19f" /></svg>`
const iconlink = `<link rel="shortcut icon" href="${`data:image/svg+xml,${encodeURIComponent(icon)}`}" />`

function processSite() {
  return tree.processFiles(files => {



  })
}

if (isDev) {
  const server = new immaculata.DevServer(9090, '/_reload')
  server.files = await processSite()
  server.notFound = () => '/404.html'

  tree.watch({
    ignored: (str) => str.includes('/out/') || str === '/fs/api.ts'
  }, async (paths) => {
    const start = Date.now()
    try { server.files = await processSite() }
    catch (e) { console.error(e) }
    console.log('Reprocessed:', Date.now() - start + 'ms')
    server.reload()
  })
}
else {
  immaculata.generateFiles(await processSite())
}
