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
