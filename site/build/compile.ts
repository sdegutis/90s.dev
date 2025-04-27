import ts from 'typescript'

export function compileTsx(str: string, filename: string, sourceMap = true) {
  return ts.transpileModule(str, {
    fileName: filename,
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      sourceMap,
    }
  })
}
