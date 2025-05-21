# Finally releasing 90s.dev

I've mentioned this a bunch on HN
and I've been working on it nonstop since about February.
So I'm pretty excited to finally make it public.

::: section box note
### tl;dr

What it is in relation to other gamedev apps:

|             | Game dev |                     Meta gamedev                     |
| ----------- | :------: | :--------------------------------------------------: |
| Proprietary | [pico8]  |                      [picotron]                      |
| Open src    | [tic80]  | [90s.dev](/os/) <small style='opacity:0.5'>*</small> |

<small style='opacity:0.5'>\* you are here</small>

What it is:

* An API for making games, game engines, and game maker components

* An API that wraps web technology up in an "operating system" metaphor

* An API that shows you how fun it was to make GUI apps in the 90s

What it's not:

* A game engine

* A game maker

Short demo of the paint app ([source code](https://github.com/sdegutis/os/blob/main/site/fs/sys/apps/paint.app.tsx)):

<iframe width=640 height=360 src='/os/#sys/apps/paint.app.js'></iframe>

:::

[tic80]: https://tic80.com/ 
[pico8]: https://www.lexaloffle.com/pico-8.php
[picotron]: https://www.lexaloffle.com/picotron.php


## The dream

Ever since I was a kid, I wanted to recreate Warcraft II or at least Warcraft I.
But for decades, I never got around to it.
One day this February, I just got up at 2am and started writing code.
I was tired of waiting.
So I wrote and wrote and wrote.

But instead of making a game,
or even *a game engine*,
or even *the game maker tools*,
I found myself making an API for making game maker tools and a game engine and a game.

It turns out I'm an *API designer* at heart. I guess I always kinda knew this.

Eventually it evolved into an API around a 320x180 canvas
for building and sharing apps,
whether a game maker tool like map-maker,
or a 60 fps game.


## New game making platform that runs on the web

In short, [90s.dev/os/](/os/) is a unique new kind of platform for making game makers:

* Runs in the browser using an HTML canvas for portability.

* Has a 320x180 (16:9) screen that scales up to fill the window.

* Runs all apps inside web workers for security and performance.

* Gives you full access to WebGL2 via OffscreenCanvas for 60 fps games.

* Lets you publish and load apps located on GitHub or NPM.

* Has a new GUI API that has legitimate innovations, even in 2025.

* Comes with a TypeScript-first VSCode-ready SDK for fast prototyping.

* Allows importing modules written in any languages that compile to wasm.

By default, it will come with basic apps for making pixel art data for games,
such as paint, sprite-maker, and map-maker.
Someone else will have to make the sound-effect-editor and music-editor,
since I know nothing about web audio APIs.

But that's the beauty and point of it,
you *can* make those apps *and* publish them,
and they will be first-class apps that anyone can run,
and that you can share with an iframe or link.

For example, click this to open my 80%-finished paint app,
and click again to close it: [/os/#sys/apps/paint.app.js](/os/#sys/apps/paint.app.js)


### Inspired by gamedev prototyping apps

It's inspired by pico8, tic80, picotron, and love2d:

* Like pico8, it aims for aesthetic minimalism and supports just one language.

* Like tic80, it lifts most of the restrictions of pico8.

* Like love2d, it requires an external IDE for actually writing code.

* Like picotron, it uses an operating system architecture to run apps.

You could think of it as a meta-pico8, or a love2d with TypeScript,
or a tic80 that added extensibility vertically instead of horizontally.


## Genuine GUI innovations

I honestly wasn't trying to innovate here.
All I wanted was a simple GUI that let me
build the side panel in Warcraft I and II
with its action buttons like Move and Attack.

So I wrote a very typical view API,
where views draw themselves to screen
and have child views.
For a while, it was very ordinary and boring,
which for a GUI is a good thing.

### Layout

But I got tired of
manually positioning and resizing
all the views in a tree,
so I ended up with
an extremely simple [auto-layout system](../technical/views.md#layout)
that also happens to be robust.

### Refs

I also got tired of manually setting values
such as size, children, or background color,
especially when most of the time
it was in response to another value changing,
and the new value was directly based on that changed value.
I also got tired of adding callbacks to everything.

So [refs](../technical/views.md#refs) gradually emerged,
basically watchable pointers,
and after about a month or so, they became so stable
that I reworked the view APIs so that
all view properties are backed by refs.
This means all properties are watchable,
and you can give a ref to any property.

*Note*: Even though refs share the same name
as similar concepts in other systems,
I designed mine from the ground up,
with zero inspiration from those other systems.
They're nothing like React refs,
and I didn't even know Vue had refs until last week.

### Composites

And finally, I stumbled on an interesting property of JSX.
It turns out that if you reverse the way HTML and React use
strings vs values for JSX tags, string tags become the *perfect way*
to decouple an abstract view's implementation from its usage.
With a concrete (capitalized) view, you have to import it and use it directly.
But an abstract (lowercase) view can be added to a global table by some library or app,
and then used by an entirely separate part of the system.

This lead to [composites](../technical/views.md#composites):

```tsx
import { Button } from '/os/api.js'

const b1 = <Button onClick={...}>...</Button> // concrete
const b2 = <button onClick={...}>...</button> // abstract
```

This is a *surprisingly powerful* concept for GUI app development.
The concrete view above is always going to look and work the same.
But the abstract view above can be implemented *in any way at all*.

This is most clear with the colorpicker view:

```tsx
const $color = $(0x00000000)
const view = <colorpicker $color={$color}/>
```

The default implementation of this has a bare-basic color picker,
that allows only 48 colors from two 24 color palettes (sweet24 and vinik24).

But any app or library developer can override this to return
*any kind* of color picker they want. Maybe a more traditional one
that has sliders for RGBA and has 16 million colors,
or maybe one that lets you choose from a large list of palettes,
or maybe one that mimicks pico8's exactly.


## A note on publishing apps

Until just a couple days ago,
there was a shared drive in the built-in file system called `net/`
that was backed by a database,
and the way to share apps or libraries or game assets was
to copy your files into your own folder in this drive.
You could easily import modules via:

```ts
import { stuff } from '/os/fs/net/someuser/some/file.js'
```

And it just worked, thanks to a service worker.

But this weekend, I had an epiphany of
how to use the same service worker to
import files hosted on NPM or GitHub, via CDN.
So I removed `net/` and decided to support this:

```ts
import { stuff } from '/os/fs/ghb/someuser/project@1.0.0/some/file.js' // or:
import { stuff } from '/os/fs/npm/someuser/project@1.0.0/some/file.js'
```

This is in the works, but it's mostly done.


## Community first

Since this is designed as an operating system,
where the screen is just a 320x180 canvas,
it needs apps.
The built-in apps will be *serviceable at best*.

Ideally, the community makes their own apps,
and uses those apps to make game assets and games,
and all of these get shared with other users.

Since this requires coordination among the community,
there is an issue tracker, wiki, and discussion forum
in the sidebar, each hosted in a GitHub repo.

* [Issues](https://github.com/sdegutis/90s.dev/issues): For feature requests and bug reports

* [Forum](https://github.com/sdegutis/90s.dev/discussions): The announce and discuss projects

* [Wiki](https://github.com/sdegutis/90s.dev/wiki): To collectively curate and find projects

For sharing apps, use the link format `/os/#app`, e.g.

* [/os/#sys/apps/paint.app.js](/os/#sys/apps/paint.app.js)
* [/os/#sys/apps/fontmaker.app.js](/os/#sys/apps/fontmaker.app.js)
* [/os/#sys/apps/spritemaker.app.js](/os/#sys/apps/spritemaker.app.js)
* `/os/#ghb/someuser/someapp.app.js` (coming soon)
* `/os/#npm/someuser/someapp.app.js` (coming soon)

## Prior art

I've been working on game makers for a while.

Here are some previous half-finished projects that inspired the current one:

* [minigamemaker.com](https://minigamemaker.com/)

* [https://90s.dev/v1/](https://90s.dev/v1/) (codename sys32)


## For hire

I'm avaiable for contract work if you have something genuinely interesting and challenging.
