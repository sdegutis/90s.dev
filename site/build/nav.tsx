import mdattrs from 'markdown-it-attrs'
import navMd from './nav.md'
import { makeRenderer, renameMarkdownLinks } from "./plugins/markdown.ts"

const renderer = makeRenderer({}, [
  renameMarkdownLinks,
  mdattrs,
])

const navHtml = renderer.render(navMd)

export const Nav = () => navHtml
