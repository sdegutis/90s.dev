---
order: 0
---

# Architecture

## Host

The host is a very lightweight app on the GUI thread of the web browser.

It has a few small responsibilities:

* Create and manage processes and panels

* Handle inputs from keyboard/mouse

* Direct events to the appropriate panels and processes

* Draw all prerendered panel images to the screen

## Processes & Panels

Each process runs inside its own [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker).
Processes request and own panels.

At a bare minimum, it must communicate with the host via [syscalls](#syscalls).
For typical code, a `sys` global and `Panel` class are there to all the heavy lifting for you.

Processes own references to panels.
Panels draw onto an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
and use [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap)
to efficiently send the rendered image to the host.

The built-in `Panel` class uses [Views](views.md#view) to draw
its content onto a panel. But custom panels can draw directly
to an OffscreenCanvas and send that to the host if needed.


## Code environments

All `.js` files in the [Filesystem](filesystem.md#filesystem) are runnable,
no matter which drive they're in or how they're named.
There is no difference between library code and application code,
except that they execute in different environments based on how they're called:

```ts
api.runJsFile("net/someuser/foo.js")  // runs it in the current web worker
api.sys.launch("net/someuser/foo.js") // runs it in its own new web worker
```


## Syscalls

The `wRPC` class is used internally by `sys` and `Panel` to communicate with the host.

::: section box warning

### Warning

This section describes low-level APIs that you typically don't need.

Unless you have good reason, you should probably stick with `sys` and `Panel`.

:::

### Calling convention

Data is passed via an array in the format: `[...args, name, cid]`

* `args` are whatever the method takes
* `name` is the name of the method
* `cid` is
  * `0` when a response is not expected
  * `+n` when a response is expected
  * `-n` for the response to `+n`

Responses omit the `name` but otherwise have the same format.

For example:

```ts
postMessage([panelid, 'focuspanel', 0]) // no response expected

postMessage(['readcliptext', 123]) // now wait for message ["clipboard value", -123]
```

Internally, `wRPC` uses simple incrementing ids per instance to differentiate responses.

::: section box note

### Tip

To see what `wRPC` is doing in the host, run `LOGRPC=1` in the devtools console.

To see what `wRPC` is doing in an app, run `LOGRPC=1` in [/os/#sys/apps/terminal.app.js](/os/#sys/apps/terminal.app.js).

:::

### Methods

Notes:

* For full, up-to-date docs, see `api/core/rpc.ts`

* If a method returns `void`, it means it will never respond

* A process must initiate host interaction with `postMessage(["init", n])`

* The response to `ping` must always be the next even number after `n`

* Key events are always sent, whether you have focus or not

```ts
// Calls a process can make to the host
export interface ServerProgram {
  init(): Promise<[sysid: string, id: number, w: number, h: number, desktop: Point & Size, keymap: string[], opts: Record<string, any>]>
  newpanel(name: string, ord: PanelOrdering, x: number, y: number, w: number, h: number): Promise<[id: number, port: MessagePort]>
  adjust(panid: number, x: number, y: number, w: number, h: number): void
  focuspanel(id: number): void
  terminate(pid: number): void
  hidepanel(panid: number): void
  showpanel(panid: number): void
  resize(w: number, h: number): void
  setdesktop(x: number, y: number, w: number, h: number): void
  thisfile(path: string): void
  getprocs(): Promise<[procs: { pid: number, path: string }[]]>
  getpanels(): Promise<[panels: PanelInfo[]]>
  openipc(pid: number): Promise<[MessagePort | null]>
  launch(path: string, opts: Record<string, any>, optsTs: Transferable[]): Promise<[number | null]>
  askdir(opts: DirectoryPickerOptions | undefined): Promise<[dir: FileSystemDirectoryHandle | null]>
  readcliptext(): Promise<[text: string]>
}

// Calls the host can make to a process
export interface ClientProgram {
  ping(n: number): Promise<[n: number]>
  gotipc(port: MessagePort): void
}

// Calls a panel can make to the host through its MessagePort
export interface ServerPanel {
  blit(img: ImageBitmap): void
  renamed(name: string): void
  close(): void
  focus(): void
  cursor(data: string): void
}

// Calls the host can make to a panel through its MessagePort
export interface ClientPanel {
  adjusted(x: number, y: number, w: number, h: number): void
  focus(): void
  blur(): void
  mouseentered(): void
  mouseexited(): void
  mousemoved(x: number, y: number): void
  mousedown(b: number): void
  mouseup(): void
  wheel(x: number, y: number): void
  needblit(): void
}
```
