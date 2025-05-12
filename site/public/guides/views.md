---
order: 1
---


# Views Overview

Views are comprised of concrete classes
which handle layout, style, content, and behavior,
and can be configured by
setting properties,
replacing methods,
or subclassing.


## JSX

JSX is just a convenient shorthand calling functions or constructors:

~~~tsx
import { composites } from '/os/api.js'

function jsx(tag, data) {
  if (isConstructable(tag))  return new tag(data)
  else if (isFunction(tag))  return tag(data)
  else if (isString(tag))    return composites[tag](data)
  else                       throw Error('...')
}
~~~

So these expressions are equivalent:

~~~tsx
const label1 = <Label text='hello world' color={0xffffff33} /> as Label
const label2 = new Label({ text: 'hello world', color: 0xffffff33 })

const fnResult1 = <MyFunction foo={bar} baz={qux} />
const fnResult2 = MyFunction({ foo: bar, bax: qux })

import { composites } from '/os/api.js'
const comp1 = <fancybutton hello={123} world={456} />
const comp2 = composites["fancybutton"]({ hello: 123, world: 456 })
~~~

*Note:* Due to a TypeScript limitation, all JSX expressions have type `View` unless casted.


## Refs

Views have properties that can be set the traditional way:

```tsx
const label1 = <Label text='hello world' color={0xffffff33} /> as Label

label1.text = "updated text"
```

But this can be tedious. Consider a click counter label:

```tsx
let clicks = 0
const clickCount = (n: number) => `clicked ${n} times`

const label1 = <Label text={clickCount(clicks)} /> as Label

button1.onClick = () => label1.text = clickCount(++clicks)
```

This works, but it's much easier to just use refs:

```tsx
const clicks = $(0)
const text = clicks.adapt(n => `clicked ${n} times`)

const label1 = <Label text={text} />

button1.onClick = () => clicks.set(clicks.val + 1)
```

There is nothing magical going on here:

* The `$` function takes an initial value and returns a ref
* The `text.adapt` method creates a new ref based on the callback
* The `text.set` method changes `val` and calls all its callbacks
* The `text.val` readonly property is just the value of the ref

Most view properties take either a value,
or a ref holding that type of value.
When given a ref, it calls `watch` on the ref
and sets its own value whenever the ref changes.

Learn more on the [Refs Walkthrough](refs.md#refs-walkthrough).


## Custom behavior

Although views can be subclassed, methods can just be overridden instead:

```tsx
const view = <View onMouseDown={b => {
  console.log(`clicked with ${b} button`)
}}/>
```

This is equivalent to:

```tsx
const view = <View/>
view.onMouseDown = b => {
  console.log(`clicked with ${b} button`)
}
```

Some common lifetime callbacks:

* `init()`: called immediately after construction; must call `super.init()`
* `adopted(parent: View)`: called when `parent` changes
* `presented(panel: Panel)`: called when added to a panel

*Note:* Currently it's difficult to call `super.someMethod()` without subclassing,
which makes `init` hard to override via JSX. It's typically fine though, since
you can just run the same code immediately after creating the JSX expression,
or use `presented` or `adopted`.


## Composites

Rather than following the HTML/CSS/JS model
of separating layout from style from behavior,
views keep these responsibilities together,
and allow separating them from *content*.

It does this using composites,
which are view placeholders
that takes *semantic content*
rather than *literal content*,
and turns them *into* literal content.

Learn more on the [Composites page](composites.md#composites).


## Responsibilities

Unlike in HTML, the base class contains very minimal functionality.

For example:

* To add padding to an element, wrap it in a
  [Margin](#margin) or [Border](#border)
  and set `padding`.

* To add a visible border, wrap it in a
  [Margin](#margin) or [Border](#border)
  and set `padding` and `paddingColor`.

* To create a checkbox,
  combine a [Button](#button) and [Label](#label)
  and wrap them in a [GroupX](#group).

When a complex view is needed more than once, wrap it in a function.

When a view should be customizable, make it into a composite.


## Layout

Views have an *incidental* layout system.
That is, by following certain conventions,
layout is handled automatically:

* A view that has an inherent size,
  whether based on its child views or properties or both,
  should override `adjust` and set its own size.

* A view that has children should override `layout`
  and set the position (and possibly size)
  of each of its children.

This is made possible by carefully designed callbacks
registered in the base class's initializer.

There's an inherent tension between outer views,
which start at the panel's root and dive inwards,
and inner views, which start deep and build outwards,
until they meet each other.

Two common layout patterns emerged from this:

* Flexible views (e.g. Split or Center)
  are resized by their parents.
  They reposition and often resize their children,
  usually in response to being resized.
  These are usually outer views.

* Axiomic views (e.g. Button or Label)
  know and set their own size.
  They may have children and reposition them,
  but usually they don't resize them.
  These are usually inner views.

Because the layout system is neither rigid nor formal,
views are able to customize their layout behavior,
if approached carefully. For example:

* Spaced is flexible on one axis and axiomic on another.
* Group usually contains axiomics but can resize them.



## Built-in views


### View

~~~ts
class View { /*...*/ }
~~~

The base class.

### Border

~~~ts
class Border extends Margin { /*...*/ }
~~~

### Button

~~~ts
class Button extends Border { /*...*/ }
~~~

### Center

~~~ts
class Center extends View { /*...*/ }
~~~

### Grid

~~~ts
class Grid extends View { /*...*/ }
~~~

### Group

~~~ts
class Group extends View { /*...*/ }
~~~

### Image

~~~ts
class Image extends View { /*...*/ }
~~~

### Label

~~~ts
class Label extends View { /*...*/ }
~~~

### Margin

~~~ts
class Margin extends View { /*...*/ }
~~~

### Paned

~~~ts
class Paned extends View { /*...*/ }
~~~

### Scroll

~~~ts
class Scroll extends View { /*...*/ }
~~~

### Spaced

~~~ts
class Spaced extends View { /*...*/ }
~~~

### Split

~~~ts
class Split extends View { /*...*/ }
~~~

### Textbox

~~~ts
class Textbox extends View { /*...*/ }
~~~
