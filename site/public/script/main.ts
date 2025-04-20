import monaco from './monaco.js'

for (const codeblock of document.querySelectorAll('pre code.language-tsx')) {
  const container = codeblock as HTMLElement
  const initial = codeblock.textContent!

  const rect = container.getBoundingClientRect()
  container.replaceChildren()

  const editor = monaco.editor.create(container, {
    value: initial,
    language: 'typescript',
    theme: 'vs-dark',
    lineNumbers: 'off',
    fontSize: 13,
    lineHeight: 1.15,
    // padding: { top: 12, },
    lineDecorationsWidth: 0,
    minimap: { enabled: false },
    guides: { indentation: false },
    folding: false,
    scrollBeyondLastLine: false,
    renderLineHighlightOnlyWhenFocus: true,
    tabSize: 2,
  })

  editor.layout({
    height: rect.height,
    width: rect.width,
  })

  // const compressed = 

  let w = 70
  let h = 20

  const url = new URL(`http://localhost:8080/`)
  url.searchParams.set('embed', '1')

  const iframe = document.createElement('iframe')
  iframe.width = (w * 3).toString()
  iframe.height = (h * 3).toString()
  // iframe.style = `width:100%;aspect-ratio:${w}/${h}`
  container.parentElement!.insertAdjacentElement('afterend', iframe)

  window.addEventListener('message', (msg) => {
    if (msg.source === iframe.contentWindow) {
      const resizeData = msg.data.resized
      w = resizeData.w
      h = resizeData.h

      iframe.width = (w * 3).toString()
      iframe.height = (h * 3).toString()
    }
  })


  const model = editor.getModel()!

  const updateIframe = async () => {
    const code = model.getValue()

    const stream1 = new Blob([code]).stream().pipeThrough(new CompressionStream('gzip'))
    const blob1 = await new Response(stream1).blob()
    const bytes1 = new Uint8Array(await blob1.arrayBuffer())
    const compressed = btoa(String.fromCharCode(...bytes1))

    url.searchParams.set('code', compressed)
    iframe.src = url.toString()
  }

  model.onDidChangeContent(() => {

    editor.layout({
      width: rect.width,
      height: editor.getContentHeight(),
    })

    // container.

  })


  updateIframe()
  model.onDidChangeContent(throttle(updateIframe, 300))
}

function throttle(fn: () => void, ms = 0) {
  let timer: ReturnType<typeof setTimeout> | undefined
  return () => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
}
