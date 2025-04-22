import monaco from './monaco.js'
import { makeMonacoFancier } from './token-provider.js'

{
  const footer = document.querySelector('main>footer')!
  const year = new Date().getFullYear().toString()
  footer.textContent = footer.textContent!.replace(/20\d{2}/, year)
}

for (const a of document.querySelectorAll('a')) {
  if (!a.href.startsWith(location.origin)) {
    a.target = '_blank'
  }
}

for (const a of document.querySelectorAll<HTMLAnchorElement>('nav a')) {
  a.classList.toggle('current', location.href === a.href)
}

makeMonacoFancier()

const oshost = await fetch('/os.txt').then(r => r.text())
const api = await fetch(oshost + '/api.d.ts.json').then(r => r.json())

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
    "react/jsx-runtime": ["file:///sys/api/core/jsx.js"],
  },
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
})


let modelnum = 0
for (const runcode of document.querySelectorAll<HTMLDivElement>('div.runcode')) {
  modelnum++

  const autosize = runcode.classList.contains('autosize')

  const preblock = runcode.querySelector('pre') as HTMLPreElement
  const codeblock = runcode.querySelector('pre>code') as HTMLElement

  const container = codeblock as HTMLElement
  const initial = codeblock.textContent!

  const iframe = runcode.querySelector('iframe')!
  const rect = container.getBoundingClientRect()

  container.replaceChildren()

  const uri = monaco.Uri.parse(`file:///sample${modelnum}.tsx`)
  const model = monaco.editor.createModel(initial.trimEnd(), 'typescript', uri)

  const editor = monaco.editor.create(container, {
    model,
    language: 'typescript',
    theme: 'vsc2',
    lineNumbers: 'off',
    fontSize: 13,
    lineHeight: 1.15,
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

  editor.layout({
    height: rect.height,
    width: preblock.clientWidth - 24,
  })

  const url = new URL(oshost)
  url.searchParams.set('embed', '1')

  const updateIframe = async () => {
    const code = model.getValue()

    const stream1 = new Blob([code]).stream().pipeThrough(new CompressionStream('gzip'))
    const blob1 = await new Response(stream1).blob()
    const bytes1 = new Uint8Array(await blob1.arrayBuffer())
    const compressed = btoa(String.fromCharCode(...bytes1))

    url.searchParams.set('code', compressed)
    iframe.src = url.toString()
  }

  if (autosize) {
    model.onDidChangeContent(() => {
      editor.layout({
        width: preblock.clientWidth - 24,
        height: editor.getContentHeight(),
      })
    })
  }

  updateIframe()
}

for (const code of document.querySelectorAll<HTMLElement>('pre>code:not(:has(>.monaco-editor))')) {
  code.textContent = code.textContent!.trimEnd()
  monaco.editor.colorizeElement(code, {
    theme: 'vsc2',
    mimeType: 'typescript'
  })
}
