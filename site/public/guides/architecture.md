# Architecture


## Overview

[90s.dev/os/](/os/) is follows the architecture of a lightweight OS inside the browser.

* The host runs in [the GUI thread](https://developer.mozilla.org/en-US/docs/Glossary/Main_thread) and manages an [HTML Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

* Each process runs inside its own [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) and owns 0+ panels

* Each panel prerenders into its own [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) and blits to the host

* Process and panels communicate with the host through [MessagePorts](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)

* System-wide events are sent to all processes via [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

* Users can publish data, code, and apps under `net/` in the [shared filesystem](../technical/filesystem.md#filesystem)

* Shared modules can be natively imported due to a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

This design allows for many use-cases:

* Creating 60fps web games with low input latency and high graphical output

* Creating code libraries, data assets, and game-maker components

* Sharing or consuming all of these through a shared file system

## Host

The main GUI thread is a lightweight host with a few small responsibilities:

* Creating and managing processes and panels

* Dispatching mouse/keyboard events to processes and panels

* Drawing prerendered panels into the HTML Canvas


## Processes and panels

* Running arbitrary userland code

* Communicating with the host via RPC

* Requesting panels from the host


## Panels

Panels are the core GUI mechanism:

* Creating and drawing into panels via [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

* Sending prerendered panel images to the host via [transferToImageBitmap](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap)


## Filesystem


## Graphics



## System-wide events
