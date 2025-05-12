---
order: 0
---

# API Reference

This page gives a birds eye overview of all the exports from `/os/api.js`

To learn more about a given export, including its methods and properties:

* Use auto-complete in VS Code to see its properties and their jsdocs

* Browse the source code, contained in <code>[helloworld.zip](/os/helloworld.zip)/sys/api/</code>


## Host Communication

For making syscalls to the host.

```tsx
const sys      // represents the host
const program  // represents the process
class Panel {} // represents a panel
```


## Event primitives

```tsx
class Listener {}  // event handling primitive

class Ref {}  // Dynamic pointer
function $    // short for new Ref(...)

type MaybeRef<T>  // good for apis
function defRef   // ensures a ref

function makeRef    // creates a property into a ref
function multiplex  // creates a ref from multiple refs

// helpers for equals
function arrayEquals
function pointEquals
function sizeEquals
```

## Files

Helpers to access the file system.
See [Filesystem](filesystem.md#filesystem) to learn more.

```tsx
const fs       // file system singleton
const pathFns  // path helper functions

function runJsFile // executes code at given fs path
```

## Views

See [Views](views.md#views-overview) to learn more.

```tsx
class View {}
class Label {}
class Border {}
class Button {}
class Center {}
class Scroll {}
class Grid {}
class ImageView {}
class Spaced{X,Y} {}
class Split{X,Y}{A,B} {}
class Group{X,Y}{A,B} {}
class Paned{X,Y}{A,B} {}
class Margin {}
class TextBox {}
```

## View helpers
```tsx
// conveniences for moving/resizing views, panels, or any ref you have
function dragMove
function dragResize

function showMenu    // shows a menu within a panel
function showPrompt  // shows a text prompt within a panel
function subpanel    // used by showMenu and showPrompt
```

## Drawing
```tsx
class DrawingContext {} // wraps canvas.context for views

class Bitmap {} // fundamental sprite class
class Cursor {} // wraps a bitmap with a hotspot
class Font   {} // very basic pixel fonts
```

## Composites

See [Composites](composites.md#composites) to learn more.

```tsx
// record of all composites
const composites

// concrete default composites are as follows
// (but they're usually not directly useful)

function ButtonComp         // default comp for <button>
function PanelBodyComp      // default comp for <panel-body>
function PanelResizerComp   // default comp for <panel-resizer>
function PanelTitlebarComp  // default comp for <panel-titlebar>
function PanelViewComp      // default comp for <panel>
function ImplicitComp       // default comp for <> and <implicit>
function TextFieldComp      // default comp for <textfield>
```

## Config helpers
```tsx
const $usrConfig // live representation of `usr/config.jsln`
const sysConfig  // overridable config used by the host

const preludesFinished // resolves when preludes finish

const preferences // for storing settings/theme-data/etc

function as // safely get a value from an object if its a given type

class JSLN {} // like JSON but much more convenient
```

## IndexedDB helpers
```tsx
function opendb   // small indexeddb wrapper
function kvs      // uses opendb as a kv store
function pobject  // uses opendb to persist an object
```

## Timing helpers
```tsx
function sleep
function ontick
function debounce
// function throttle // haven't needed to write this yet lol
```

## RPC and IPC

Convenience wrappers for syscalls.
Used internally by `sys`, `program`, and `Panel`.

```tsx
// like BroadcastChannel but scoped to current user-agent (e.g. tab)
class BC {}
type SysEvent
type KeyEvent
type ProcEvent
type PanelEvent

// wraps ipc with host
class wRPC {}
type ServerProgram
type ClientProgram
type ServerPanel
type ClientPanel
```

## net.90s.dev

```tsx
// represents current state of account
const $userState

// wraps fetch scoped to net.90s.dev with credentials
// used internally by `net/` implementation
function GET
function POST
```
