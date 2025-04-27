import ts from 'typescript'

export function compileTsx(str: string) {
  return ts.transpileModule(str, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      inlineSourceMap: true,
    }
  }).outputText
}
