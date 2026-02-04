import * as immaculata from 'immaculata'

export const isDev = process.argv[2] === 'dev'
export const tree = new immaculata.FileTree('site', import.meta.url)
export const monaco = new immaculata.FileTree('node_modules/monaco-editor', import.meta.url)
