---
order: 2
---

# Technology

[90s.dev/os/](/os/) follows the design of a lightweight OS inside the browser.


## Future-now web architecture

90s.dev runs on the latest web technology,
carefully designed with extreme efficiency in mind,
to be a platform that's ideal for any app,
but especially high performance pixel art games.

* The host runs in [the GUI thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread) and manages an [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

  * Each process runs inside its own [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and owns 0+ panels

    * Processes and panels communicate with the host by [MessagePorts](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)

  * Each panel renders into its own [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) as needed

    * Panels can render their contents directly to a [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) context

    * Panels use the efficient [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap) to blit to the host

* System-wide events are sent to all processes via [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

* [JSX](../technical/views.md#jsx) and the shared [filesystem](../technical/filesystem.md#filesystem) are handled by a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

Learn more about 90s.dev [architecture](../technical/architecture.md#architecture).


## Ideal game development platform

This architecture enables the creation of:

* 60 fps games with low input latency

* Apps that help with building games or game assets

Learn more about 90s.dev [use-cases](use-cases.md#who-is-it-for).
