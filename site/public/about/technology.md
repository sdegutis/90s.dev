---
order: 2
---

# Technology

[90s.dev/os/](/os/) follows the design of a lightweight OS inside the browser.


## Future-now web architecture

The architecture is designed with high performance apps (60 fps games) in mind:

* Apps run inside [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)

* Apps draw into an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

* Apps have access to its [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) context

* Apps use [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap) to render to screen

Learn more about 90s.dev [architecture](../technical/architecture.md#architecture).


## Ideal game development platform

This architecture enables the creation of:

* 60 fps games with low input latency

* Apps that help with building games or game assets

Learn more about 90s.dev [use-cases](use-cases.md#who-is-it-for).
