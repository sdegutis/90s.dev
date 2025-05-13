# Composites

Composites are overridable view functions that take *semantic data* and return concrete views.

```tsx
const label1 = <Label text="hi" color={0xffffffff} />  // concrete view
const label2 = <label text="hi" style="emphasis" />   // composite view
```


## How they work

Imagine you just have a view function:

```tsx
const MyLabel = (data: { text: string }) =>
  <Border padding={2}>
    <Label text={data.text}/>
  </Border>

const label = <MyLabel text="hi" />
```

This is fine, but there's no ability to let users theme it. It will always return the same thing.

We can solve this by putting a lookup table in the middle:

```tsx
const views = {}

views.label = (data: { text: string }) =>
  <Border padding={2}>
    <Label text={data.text}/>
  </Border>

const label = <views.label text="hi" />
```

But this table needs to be accessible to both the JSX system and outside modules.

Composites solve this by using a process-scoped lookup table and [preludes](architecture.md#preludes) for injection.

```tsx
// theme code:

import api from '/os/api.js'

api.composites['label'] = (data: { text: string }) =>
  <Border padding={2}>
    <Label text={data.text}/>
  </Border>

// app code:

const label = <label text="hi" />

// internal JSX code:

const fn = api.composites['label']
return fn({ text: 'hi' })
```

See [JSX](views.md#jsx) to learn more.

## Registering composites

Theme code can be loaded into an app's process
by users via [preludes](architecture.md#preludes).

Registering a composite makes it immediately available in the current process:

```tsx
import api from '/os/api.js'
api.composites['foo'] = (data: any) => <Label text='foo'/>
const view = <foo /> // === <Label text='foo'/>
```

## Loading composites

It's not common for apps to load theme modules themselves, though they can.

Typically, composites are loaded via preludes specified by the user.

## Data types

Whether theming composites, inventing new ones, or using existing ones,
it's important to keep as much type safety as possible.

At the moment, there is no type-checking and autocompletion for composites,
due to their dynamic nature.

, make sure to reference [the wiki](https://github.com/ppl-90s-dev/ppl/wiki)
to correctly use its data type.


## Philosophy


Traditional UI models use this structure:

```
UI    = Views

Views = Layout + Style + Behavior + Content
```

This was not flexible, so the separation of HTML/CSS/JS emerged:

```
UI   = HTML + CSS + JS

HTML = Layout + Behavior + Content
CSS  = Layout + Style
JS   = Behavior
```

But in practice, this created as many problems as it solved.

Layout, style, and behavior should *not* be separated from one another.

Rather, *content* should be separated from *everything else*, and the rest kept *together*.

So this UI system uses the following structure:

```
UI = Views

Views      = Concretes | Composites
Concretes  = Content + Layout + Style + Behavior
Composites = Content + Views
```















Because your app runs inside a process,
*nothing* will override its content unless you tell it to.

So you can either:

1. Manually load a theme or register composites yourself
2. Import a file that creates composites, such as someone's theme file
3. Run them as preludes





You could just make a function that returns a view. What makes composites
useful is that the JSX system looks them up in a well-known global,
and that any process can add to this global or ask other libraries to do so.
Since this happens on a per-process basis, no globals are harmed.


is mostly just convention: composites have a known global location
where they can be overridden.






You can override existing composites, or create and publish your own:

```tsx
import { Button, Label, composites } from "/os/api.js"

composites['button'] = (data: Record<string, any>) => {
  const bg = bgForStyle(data.style)
  return <Button background={bg} onClick={data.action} padding={2}>
    {data.children}
  </Button>
}
```









With a few simple conventions, system wide theming is no longer a thing of the past:

* Theme authors publish modules that add to the `composites` mapping.

* App authors import these modules to let them add to their process's `composites`.

* Users can specify modules that are executed in every process at startup.






Because composites only separate out *content*,
and kept together behavior, layout, and style,
we could easily:

* Show an icon representing the text instead of the given text

* Use an entirely different layout structure

* Add content, such as a "don't show again" checkbox

* Wrap callback functions, like showing "are you sure?" prompts

* *And more!!!*
