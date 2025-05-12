---
order: 1
---

# Views

Views are comprised of concrete classes
which handle layout, style, content, and behavior,
and can be configured by
setting properties or
replacing methods.

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

const fnResult1 = <MyFunction foo={bar} />
const fnResult2 = MyFunction({ foo: bar })

import { composites } from '/os/api.js'
const comp1 = <something hello="world" />
const comp2 = composites["something"]({ hello: "world" })
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

When a view should be semantic and customizable, make it into a composite.


## Refs

## Layout

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
