import './bettertsx.js'
import monaco from './monaco.js'

const isDev = location.origin.includes('localhost')
const origin = isDev ? 'http://localhost:8080' : 'https://os.90s.dev'
const api = await fetch(origin + '/api.d.ts.json').then(r => r.json())

const ts = monaco.languages.typescript

for (const [path, content] of Object.entries<string>(api)) {
  const liburi = 'file://' + path
  ts.typescriptDefaults.addExtraLib(content, liburi)
  monaco.editor.createModel(content, 'typescript', monaco.Uri.parse(liburi))
}

ts.typescriptDefaults.setCompilerOptions({
  ...ts.typescriptDefaults.getCompilerOptions(),
  jsx: ts.JsxEmit.ReactJSX,
  paths: {
    "/*": ["file:///*"],
    "react/jsx-runtime": ["file:///os/sys/api/core/jsx.js"],
  },
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
})


let modelnum = 0
for (const runcode of document.querySelectorAll<HTMLDivElement>('div.runcode')) {
  modelnum++

  const autosize = true || runcode.classList.contains('autosize')

  const preblock = runcode.querySelector('pre') as HTMLPreElement
  const codeblock = runcode.querySelector('pre>code') as HTMLElement
  const iframe = runcode.querySelector('iframe')!

  const initial = codeblock.textContent!

  const uri = monaco.Uri.parse(`file:///sample${modelnum}.tsx`)
  const model = monaco.editor.createModel(initial.trimEnd(), 'typescript', uri)

  const editor = monaco.editor.create(preblock, {
    model,
    language: 'typescript',
    fontLigatures: true,
    theme: 'vsc2',
    fontFamily: "Fira Code Variable",
    lineNumbers: 'off',
    fontSize: 12,
    scrollbar: { alwaysConsumeMouseWheel: !autosize, },
    lineDecorationsWidth: 0,
    minimap: { enabled: false },
    guides: { indentation: false },
    folding: false,
    scrollBeyondLastLine: !autosize,
    renderLineHighlightOnlyWhenFocus: true,
    tabSize: 2,
  })

  editor.addAction({
    id: 'Run code',
    label: 'Run code',
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR,
    ],
    run: () => {
      updateIframe()
    },
  })

  const resize = () => {
    codeblock.textContent = model.getValue()
    const rect = codeblock.getBoundingClientRect()

    const padding = window.getComputedStyle(preblock)
    rect.width += parseInt(padding.marginRight)
    rect.height += parseInt(padding.marginBottom)

    if (autosize) rect.height = editor.getContentHeight()
    // rect.height = Math.max(150, rect.height)
    editor.layout(rect)
  }

  new ResizeObserver(resize).observe(preblock)


  const url = new URL('/os/', window.origin)

  const updateIframe = async () => {
    const code = model.getValue()
    url.searchParams.set('code', await compress(code))
    iframe.src = url.toString()
  }

  if (autosize) {
    model.onDidChangeContent(() => {
      resize()
    })
  }

  resize()

  updateIframe()
}

async function compress(code: string) {
  const stream = new Blob([code]).stream().pipeThrough(new CompressionStream('gzip'))
  const blob = await new Response(stream).blob()
  const bytes = new Uint8Array(await blob.arrayBuffer())
  return btoa(String.fromCharCode(...bytes))
}
