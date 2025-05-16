---
order: 2
---

# Features

[90s.dev/os/](/os/) has several innovative features.


## Latest web technology

The software is designed as a lightweight OS inside the browser.
The GUI thread launches apps inside their own [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker),
so they can run at full performance with low latency.

Apps then draw into an [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)
with full access to its [WebGL2](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext) context,
and blit to the GUI thread with [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap)
and [MessagePorts](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).

Learn more about 90s.dev [architecture](../technical/architecture.md#architecture).


## Minimalist design

Less is more, and limitations lead to creativity. The whole os uses a pixel art aesthetic,
and has a default screen size to `320x180`, which perfectly fits `16:9` screens.

This is `6x` smaller than HDMI screens and `12x` smaller than DisplayPort screens,
which means *significantly more* CPU & GPU time can be spent on game engine logic or app logic.

A small screen also means it's quicker and easier to design GUIs for it,
partly because they take less time to design,
and partly because they require and allow fewer design choices.


## Ideal game development platform

The architecture is designed with high performance apps (60 fps games) in mind,
but is also fully capable of creating any apps including game making tools.

Users can use the apps to build games, or other apps like sprite makers, map makers,
and music editors. Games, apps, and data files can all be published on the shared filesystem.

Learn more about 90s.dev [use-cases](use-cases.md#who-is-it-for).
