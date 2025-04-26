import monaco from './monaco.js'

export function makeMonacoFancier() {

  monaco.languages.onLanguageEncountered('typescript', () => {
    monaco.languages.setMonarchTokensProvider('typescript', tokenProvider as monaco.languages.IMonarchLanguage)
  })

  monaco.editor.defineTheme('vsc2', {
    base: 'vs-dark',
    inherit: true,
    rules: rules,
    colors: {
      "editor.background": '#191919',
      "editor.selectionBackground": '#5a194e99',
    },
  })

}

const rules = [
  { token: "identifier.ts", foreground: "9CDCFE" },
  { token: "variable.property.ts", foreground: "9CDCFE" },
  { token: "constant.ts", foreground: "4FC1FF" },
  { token: "variable.ts", foreground: "9CDCFE" },
  { token: "method.ts", foreground: "DCDCAA" },
  { token: "delimiter.bracket", foreground: "569CD6" },
  // { token: "delimiter.ts", foreground: "569CD6" },
]

const tokenProvider = {

  defaultToken: 'invalid',
  tokenPostfix: '.ts',

  typeKeywords: [
    'any', 'bigint', 'boolean', 'number', 'object', 'string', 'unknown', 'void',
  ],

  ctrlKeywords: [
    'export', 'default', 'return', 'as', 'if', 'break', 'case', 'catch', 'continue',
    'do', 'else', 'finally', 'for', 'throw', 'try', 'with', 'yield', 'await',
    'import', 'from', 'type',
  ],

  alwaysKeyword: [
    'constructor', 'super',
  ],

  keywords: [
    // Should match the keys of textToKeywordObj in
    // https://github.com/microsoft/TypeScript/blob/master/src/compiler/scanner.ts
    'abstract', 'asserts',
    'class', 'const', 'debugger',
    'declare', 'delete', 'enum',
    'extends', 'false', 'function', 'get',
    'implements', 'in', 'infer', 'instanceof', 'interface',
    'is', 'keyof', 'let', 'module', 'namespace', 'never', 'new',
    'null', 'out', 'package', 'private', 'protected',
    'public', 'override', 'readonly', 'require', 'global', 'satisfies',
    'set', 'static', 'switch', 'symbol', 'this',
    'true', 'typeof', 'undefined', 'unique',
    'var', 'while', 'async', 'of'
  ],

  operators: [
    '<=', '>=', '==', '!=', '===', '!==', '=>',
    '+', '-', '**', '*', '/', '%', '++',
    '--', '<<', '</', '>>', '>>>', '&', '|',
    '^', '!', '~', '&&', '||', '??', '?',
    ':', '=', '+=', '-=', '*=', '**=', '/=',
    '%=', '<<=', '>>=', '>>>=', '&=', '|=', '^=', '@'
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      [/}/, {
        cases: {
          '$S2==INJSX': { token: '@brackets', next: '@pop' },
          '@default': '@brackets',
        }
      }],

      [/{/, 'delimiter.bracket'],

      // highlight class field-properties
      [/^\s+#?[\w$]+(?=\s*[;=:])/, 'variable.property'],

      // highlight function/class defs
      [/(function|class|new)(\s+)(#?[\w$]+)(\s*)([<(]?)/, ['keyword', '',
        {
          cases: {
            '$1==function': 'method',
            '$1==class': 'type.identifier',
            '$1==new': 'type.identifier',
          }
        }, '', {
          cases: {
            '<': { token: '@brackets', next: '@typeparams' },
            '@default': '@rematch',
          }
        },
      ]],

      // import *
      [/(import)(\s+)(\*)/, ['keyword.flow', '', 'keyword']],

      // // highlight var/const/let defs
      // [/(const|let|var)(\s+)(#?[\w$]+)/, ['keyword', '', {
      //   cases: {
      //     '$1==const': 'constant',
      //     '@default': 'variable',
      //   }
      // }]],
      // highlight var/const/let defs
      // [/([\w$]+)(:)/, ['attribute.name', '']],

      { include: 'jsxReady' },

      { include: 'common' },

    ],

    common: [

      // identifiers and keywords
      [/(#?[a-zA-Z_$][\w$]*)([<(]?)/, [
        {
          cases: {
            '@typeKeywords': 'type.identifier',
            '@alwaysKeyword': 'keyword',
            '$1~#?[A-Z].*': 'type.identifier',
            '$2': 'method',
            '@ctrlKeywords': 'keyword.flow',
            '@keywords': 'keyword',
            '@default': 'identifier',
          }
        },
        {
          cases: {
            '$2==<': { token: '@brackets', next: '@typeparams' },
            '@default': '@rematch',
          }
        },
      ]],

      // whitespace
      { include: '@whitespace' },

      // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
      [
        /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
        { token: 'regexp', bracket: '@open', next: '@regexp' }
      ],

      [/=>/, 'keyword'],

      // delimiters and operators
      [/[()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': ''
          }
        }
      ],

      [/\.\.\./, 'keyword'],

      // numbers
      [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)n?/, 'number.hex'],
      [/0[oO]?(@octaldigits)n?/, 'number.octal'],
      [/0[bB](@binarydigits)n?/, 'number.binary'],
      [/(@digits)n?/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],

    ],

    typeparams: [
      [/>/, '@brackets', '@pop'],
      { include: 'common' }
    ],

    jsxReady: [
      [/<>/, 'delimiter.html', '@jsxText.FRAGMENT'],
      [/(<)([A-Z][\w$]*\s*(?:,|extends|implements))/, ['@brackets', { token: '@rematch', next: '@typeparams' }]],
      [/(<)([a-zA-Z$])/, ['delimiter.html',
        { token: '@rematch', next: '@jsxIdent.jsxOpen.' },
      ]],
    ],

    jsxIdent: [
      [/\./, { token: 'delimiter', switchTo: '$S0^' }],
      [/[A-Z][\w$]*/, { token: 'type.identifier', switchTo: '$S0$0' }],
      [/[\w$-]+/, { token: 'tag', switchTo: '$S0$0' }],
      [/.+/, { token: '@rematch', switchTo: '@$S2.$S3.$S4' }],
    ],

    jsxOpen: [
      [/{/, { token: 'keyword', next: '@root.INJSX', bracket: '@open' }],
      [/>/, { token: 'delimiter.html', switchTo: '@jsxText.$S2' }],
      [/\/>/, { token: 'delimiter.html', next: '@pop' }],
      [/ +([\w-$]+)/, 'attribute.name'],
      [/(=)(')/, ['delimiter', { token: 'string', next: '@string_single' }]],
      [/(=)(")/, ['delimiter', { token: 'string', next: '@string_double' }]],
      [/(=)({)/, ['delimiter', { token: '@brackets', next: '@root.INJSX' }]],
    ],

    jsxText: [
      [/{/, { token: 'keyword', next: '@root.INJSX', bracket: '@open' }],
      [/<\/>/, {
        cases: {
          '$S2==FRAGMENT': { token: 'delimiter.html', next: '@pop' },
          '@default': { token: 'invalid', next: '@pop' },
        }
      }],
      [/(<\/)(\s*)([\w$])/, ['delimiter.html', '',
        { token: '@rematch', switchTo: '@jsxIdent.jsxClose.$S2.' },
      ]],
      { include: 'jsxReady' },
      [/./, 'string'],
    ],

    jsxClose: [
      [/>/, {
        cases: {
          '$S2==$S3': { token: 'delimiter.html', next: '@pop' },
          '@default': { token: 'invalid', next: '@pop' },
        }
      }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment']
    ],

    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment']
    ],

    jsdoc: [
      [/[^\/*]+/, 'comment.doc'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[\/*]/, 'comment.doc']
    ],

    // We match regular expression quite precisely
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ['regexp.escape.control', 'regexp.escape.control', 'regexp.escape.control']
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ['regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]
      ],
      [/(\()(\?:|\?=|\?!)/, ['regexp.escape.control', 'regexp.escape.control']],
      [/[()]/, 'regexp.escape.control'],
      [/@regexpctl/, 'regexp.escape.control'],
      [/[^\\\/]/, 'regexp'],
      [/@regexpesc/, 'regexp.escape'],
      [/\\\./, 'regexp.invalid'],
      [/(\/)([dgimsuy]*)/, [{ token: 'regexp', bracket: '@close', next: '@pop' }, 'keyword.other']]
    ],

    regexrange: [
      [/-/, 'regexp.escape.control'],
      [/\^/, 'regexp.invalid'],
      [/@regexpesc/, 'regexp.escape'],
      [/[^\]]/, 'regexp'],
      [
        /\]/,
        {
          token: 'regexp.escape.control',
          next: '@pop',
          bracket: '@close'
        }
      ]
    ],

    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop']
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop']
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@bracketCounting'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'common' }
    ]
  }

}
