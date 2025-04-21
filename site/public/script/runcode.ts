import monaco from './monaco.js'
import { rules, tokenProvider } from './token-provider.js'

monaco.languages.onLanguageEncountered('typescript', () => {
  monaco.languages.setMonarchTokensProvider('typescript', tokenProvider as monaco.languages.IMonarchLanguage)
})

monaco.editor.defineTheme('vsc2', {
  base: 'vs-dark',
  inherit: true,
  rules: rules,
  colors: {
    "editor.background": '#1b1f25',
  },
})

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

for (const codeblock of document.querySelectorAll('pre:has(+.runcode) > code:is(.language-tsx, .language-typescript)')) {
  const container = codeblock as HTMLElement
  const initial = codeblock.textContent!

  const iframe = container.parentElement!.nextElementSibling as HTMLIFrameElement
  const autosize = iframe.classList.contains('resize')

  const rect = container.getBoundingClientRect()
  container.replaceChildren()

  const uri = monaco.Uri.parse('file:///sample.tsx')
  const model = monaco.editor.createModel(initial, 'typescript', uri)

  const editor = monaco.editor.create(container, {
    model,
    language: 'typescript',
    theme: 'vs-dark',
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
    width: rect.width,
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
        width: rect.width,
        height: editor.getContentHeight(),
      })
    })
  }

  updateIframe()
}
