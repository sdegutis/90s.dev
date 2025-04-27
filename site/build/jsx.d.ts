declare namespace JSX {

  type IntrinsicElements = Record<string, any>

  interface ElementChildrenAttribute {
    children: any
  }

}

declare module "*.md" {
  const text: string
  export default text
}
