---
order: 2
---

# Technology


[90s.dev/os/](/os/) is follows the architecture of a lightweight OS inside the browser.

* The host runs in [the GUI thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread) and manages an [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

  * Each process runs inside its own [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and owns 0+ panels

    * Processes and panels communicate with the host by [MessagePorts](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)

  * Each panel renders into its own [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) as needed

    * Panels can render their contents directly to a [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) context

    * Panels use the efficient [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap) to blit to the host

* System-wide events are sent to all processes via [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

This design enables the creation of 60fps games with low latency.
