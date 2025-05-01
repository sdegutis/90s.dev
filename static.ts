import * as immaculata from 'immaculata'

export const isDev = process.argv[2] === 'dev'
export const oshost = isDev ? 'http://localhost:8080' : 'https://os.90s.dev'
export const tree = new immaculata.FileTree('site', import.meta.url)
export const monaco = new immaculata.FileTree('node_modules/monaco-editor', import.meta.url)

export const martel = new immaculata.FileTree('node_modules/@fontsource/martel', import.meta.url)
export const silkscreen = new immaculata.FileTree('node_modules/@fontsource/silkscreen', import.meta.url)
export const oxanium = new immaculata.FileTree('node_modules/@fontsource-variable/oxanium', import.meta.url)
export const firacode = new immaculata.FileTree('node_modules/@fontsource-variable/fira-code', import.meta.url)
export const gemunulibre = new immaculata.FileTree('node_modules/@fontsource-variable/gemunu-libre', import.meta.url)
