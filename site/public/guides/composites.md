# Composites


Rather than following the HTML/CSS/JS model
of separating layout from style from behavior,
views in 90s.dev/os keep these together,
and allow separating them from *content*.

It does this using composites,
which are view placeholders
that takes *semantic content*
rather than *literal content*,
and turns them *into* literal content.


## Example

WIP

Consider these two labels:

```tsx
const label1 = <Label text="hi" color={0xffffffff} />
const label2 = <label text="hi" style="emphasis" />
```

The first label is concrete.
Its parameters are fixed.
It always draws in the exact same way.

The second label is composite.
The `label` composite could be implemented in any way.

Imagine an implementation of `label` that:

* Sets its color based on `style`
* 

```tsx
assertEqual()
```


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

Layout and style should *not* be separated from one another.

So views in 90s.dev use this structure:

```
UI = Views

Views      = Concretes | Composites
Concretes  = Content + Layout + Style + Behavior
Composites = Content + Views
```



WIP

WIP

WIP

WIP

WIP

WIP

WIP

WIP

To register a composite


```tsx
composites['button'] = function ButtonComp(data: Record<string,any>) {
  return <Button background={colorForStyle(data.style)} padding={2} onClick={data.action}>
    <Label text={data.children}/>
  </Button>
}
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
