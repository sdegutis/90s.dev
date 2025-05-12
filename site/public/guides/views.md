---
order: 1
---


# Views

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

const fnResult1 = <MyButton foo={bar} />
const fnResult2 = MyButton({ foo: bar })

import { composites } from '/os/api.js'
const comp1 = <fancybutton hello="world" />
const comp2 = composites["fancybutton"]({ hello: "world" })
~~~

*Note:* Due to a TypeScript limitation, all JSX expressions have type `View` unless casted.


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

See [Composites](composites.md#composites) to learn more.


## Responsibilities

Concrete view classes are separated by responsibility,
with each subclass getting more specific.

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

When a view takes semantic data and should be customizable, make it into a composite.


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

There is nothing magic here. Ref is a very ordinary class:

* The constructor takes an initial value
* The `adapt` method creates a new ref based on the callback
* The `set` method changes it and calls all its callbacks

The value of refs comes from the simplicity of their design.
Because there is no magic or overcomplicated sophistry,
refs are predictable, and make it easy to react to their changes.

Most view properties take either a value
or a ref holding that type of value.

See the [refs page](refs.md#refs) to learn more about how they work.


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

Two patterns emerged over time:
flexible views like Split or Center,
and axiom views like Button or Label.
There's an inherent tension between them:

* Flexible views are resized by their parents.
  But they reposition and often resize their contents,
  usually in response to being resized.

* Axiom views know their own size.
  They usually don't resize their children,
  but they can reposition them.

Because this system is not rigid or formal,
views are able to combine these aspects
if approached carefully.
For example:

* Spaced is flexible on one axis and axiomic on another.
* Group usually contains axiomics but can resize them.


## Initialization


## Built-in views


### View

~~~ts
class View { /*...*/ }
~~~

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
