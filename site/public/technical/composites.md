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

## Overriding functionality

Consider the built-in `colorpicker` composite:

```tsx
const $color = $(0x00000000)
const view = <colorpicker $color={$color} />
```

By default, this shows a simple color picker with a limited palette.

But it can be overridden by apps or users to show *any* kind of color picker.

### App overrides

It can be overridden by an app or library:

```tsx
composites["colorpicker"] = (data: { $color: Ref<number> }) => {
  return // some view
}

const view = <colorpicker $color={$color} />
```

To share overrides, put this in a file and import it:

```tsx
// in file net/someuser/best-color-picker.js

composites["colorpicker"] = (data: { $color: Ref<number> }) => {
  return // some view
}

// in an app:

import "/os/fs/net/someuser/best-color-picker.js"
const view = <colorpicker $color={$color} />
```

### User overrides

Users can then import custom color pickers using preludes:

```ts
// in file usr/config.jsln
process.prelude[]="usr/my-color-picker.js"

// in file usr/my-color-picker.js
composites["colorpicker"] = (data: { $color: Ref<number> }) => {
  return // some view
}
```

Now all apps that use `<colorpicker>` will use *your* component.

## Authoring composites

Theme code can be loaded into an app's process by users via preludes.

Registering a composite makes it immediately available in the current process:

```tsx
import api from '/os/api.js'
api.composites['foo'] = (data: any) => <Label text='foo'/>
const view = <foo /> // === <Label text='foo'/>
```

If a composite is relatively complex and the first of its kind,
it may make sense to break down its functionality into smaller composites
so each can be overridden.

Or at least you may want to break it down into functions
and export them, so that other composites can be implemented that
import your functionality but use it differently.

See also [Variables](#variables) below.

## Loading composites

It's not common for apps to load theme modules themselves, though they can.

Typically, composites are loaded via preludes specified by the user.

## Variables

Sometimes only a minor, predictable change is needed when using a composite.
In that case, overriding it would be entirely overkill.

To solve this, there's a global for general-purpose variables:

```ts
declare const preferences: Record<string, any>
```

Composite authors can access it and set defaults if needed:

```tsx
api.preferences['fancybutton-padding'] = 2

const defaultColor = 0x99000099

api.composites['fancybutton'] = (data: any) =>
  <Button padding={api.preferences['fancybutton-padding']}>
    <Label text={data.text} color={api.preferences['fancybutton-color'] ?? defaultColor}/>
  </Button>
```

*Note:* Variables that a composite uses should be documented along with the composite.


## Parameter types

Whether authoring composites or using them,
TypeScript + LSP offer not even a little help,
due to the dynamic nature of composites.

For now, the best solution is to check
[the wiki](https://github.com/ppl-90s-dev/ppl/wiki)
for parameter type info, and update it when authoring composites.


## Built-in composites





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
