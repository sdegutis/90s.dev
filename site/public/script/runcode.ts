import monaco from './monaco.js'
import { makeMonacoFancier } from './token-provider.js'

const oshost = await fetch('/os.txt').then(r => r.text())

const nav = document.querySelector('body > nav') as HTMLElement

document.querySelector<HTMLElement>('#togglemenu>span')?.addEventListener('mousedown', () => {
  nav.classList.toggle('shown')
})

nav.addEventListener('mousedown', function (e) {
  if (this.classList.contains('shown') && this === e.target) {
    this.classList.remove('shown')
  }
})

for (const a of document.querySelectorAll('a')) {
  if (!a.href.startsWith(location.origin)) {
    if (a.href.startsWith(oshost + '/#')) {
      a.onclick = (e) => {
        if (e.ctrlKey) return
        e.preventDefault()

        const maybe = a.parentElement?.nextElementSibling
        if (maybe?.tagName === 'IFRAME') {
          maybe.remove()
          return
        }

        const iframe = document.createElement('iframe')
        iframe.className = 'embedded'
        iframe.width = '640'
        iframe.height = '360'
        iframe.src = a.href
        a.parentElement?.insertAdjacentElement('afterend', iframe)
      }
    }
    else {
      a.target = '_blank'
    }
  }
}

makeMonacoFancier()


// <iframe class="embedded" width="640" height="360" src="http://localhost:8080/#sys/apps/filer.app.js"></iframe>

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
  const iframe = runcode.querySelector('iframe')!

  const initial = codeblock.textContent!

  const uri = monaco.Uri.parse(`file:///sample${modelnum}.tsx`)
  const model = monaco.editor.createModel(initial.trimEnd(), 'typescript', uri)

  const editor = monaco.editor.create(preblock, {
    model,
    language: 'typescript',
    theme: 'vsc2',
    lineNumbers: 'off',
    // overflowWidgetsDomNode: preblock,
    fontSize: 13,
    scrollbar: { alwaysConsumeMouseWheel: !autosize, },
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

  const resize = () => {
    const rect = codeblock.getBoundingClientRect()
    if (autosize) rect.height = editor.getContentHeight()
    editor.layout(rect)
  }

  resize()

  new ResizeObserver(resize).observe(preblock)


  const url = new URL(oshost)

  const updateIframe = async () => {
    const code = model.getValue()
    url.searchParams.set('code', await compress(code))
    iframe.src = url.toString()
  }

  if (autosize) {
    model.onDidChangeContent(resize)
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

async function compress(code: string) {
  const stream = new Blob([code]).stream().pipeThrough(new CompressionStream('gzip'))
  const blob = await new Response(stream).blob()
  const bytes = new Uint8Array(await blob.arrayBuffer())
  return btoa(String.fromCharCode(...bytes))
}
