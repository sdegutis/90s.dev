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

This is fine, but there's no ability to let users theme it.

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

See [JSX](views.md#jsx) for a more detailed description of how the lookup table works.

## Registering composites

Theme code can be loaded into an app's process by users via preludes.

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

Whether authoring composites or using them, this is an area where
TypeScript + LSP don't help one little bit, due to the dynamic nature of composites.

To avoid type errors, the best solution for now is to check [the wiki](https://github.com/ppl-90s-dev/ppl/wiki)
for documentation of composites authored "in the wild" as opposed to built-in composites.

I'm sure a better solution will come in time.


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

Therefore, this UI system uses the following structure:

```
UI = Views

Views      = Concretes | Composites
Concretes  = Content + Layout + Style + Behavior
Composites = Content + Views
```

Notice that Content may or may not be separate, while the others are always kept together.

Because composites draw this line differently, they can:

* Show an icon representing the text instead of the given text

* Use an entirely different layout structure and/or style

* Add content, such as a "don't show again" checkbox

* Wrap callback functions, like showing "are you sure?" prompts

* *...and more!!!*
