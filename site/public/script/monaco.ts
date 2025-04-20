const base = location.origin + '/monaco/min/vs'

await new Promise(resolve => {
  const script = document.createElement('script')
  script.src = base + "/loader.js"
  script.onload = resolve
  document.head.append(script)
})

export default await new Promise<typeof import('monaco-editor')>(resolve => {
  const r = require as any
  r.config({ paths: { vs: base } })
  r(['vs/editor/editor.main'], resolve)
})
