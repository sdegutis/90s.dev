import * as immaculata from 'immaculata'

export const isDev = process.argv[2] === 'dev'
export const oshost = isDev ? 'http://localhost:8080' : 'https://os.90s.dev'
export const tree = new immaculata.LiveTree('site', import.meta.url)
export const monaco = new immaculata.LiveTree('node_modules/monaco-editor', import.meta.url)
