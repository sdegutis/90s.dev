import ts from 'typescript'

export function compileTsx(str: string) {
  return ts.transpileModule(str, {
    compilerOptions: {
      inlineSourceMap: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
    }
  }).outputText
}
