# Hello World tour

The traditional "click me" app:

::: runcode 120 70
~~~tsx
import api, { $, Center, GroupY, Label, GroupX } from '/os/api.js'
await api.preludesFinished

const $count = $(0)
const inc = () => $count.$++

const panel = await api.sys.makePanel({ name: "hello world" },
  <Center size={api.sys.$size} background={0x444444ff}>
    <GroupY gap={4}>
      <Label text='hello world!' />
      <GroupX gap={2}>
        <button style='submit' action={inc}>click me</button>
        <Label text={$count.adapt(n => `clicked ${n} times`)} />
      </GroupX>
    </GroupY>
  </Center>
)

panel.focusPanel()
~~~
:::

::: section info box
***Tip***: You can edit and re-run all code examples on this site with `Ctrl-R`
:::

### Full Breakdown

All API functions are exported from this file.

~~~tsx
import * as api from '/os/api.js'
~~~

When the API is imported, the system is initialized,
and all prelude scripts of your choosing are run.
So we wait for them to finish.

~~~tsx
await api.preludesFinished
~~~

We create a [Ref](../guides/refs.md#refs-walkthrough) and a function to modify it.

~~~tsx
const $count = api.$(0)
const inc = () => $count.$++
~~~

::: section note box
### What's with all the "$" characters?

We named our variable `$count` to note that it's
a ref. This isn't strictly needed, but many classes
have both a plain field and a ref version of that
field (which the field uses internally&mdash;see
[makeRef](../guides/refs.md#properties).

And since refs are so common, the standalone function
`$` was created as a shorter version of `new Ref(...)`.
Plus it kind of looks like `&foo` in C and Go.

Finally, the value that the ref holds is *also* named `$`
because it's short, easy to remember, and *also* kind
of looks like `foo.&` in Zig.

The main takeaway is that there's nothing special about `$`.
:::

The `sys` has a method to create panels, which is async
since apps run inside web workers, which need to communicate
with the host (the GUI thread).

~~~tsx
const panel = await api.sys.makePanel({ name: "hello world" },
~~~

Panels only require a name and a root view, so they can draw
something on screen, and so the shell has a somewhat unique
string to manage them by.

[Shells](../guides/shells.md#shells) are just user-land programs
which typically watch the `panelevents` broadcast channel
and manage the size, position, and visibility of panels.

The panel here is the root view, which specifies
its initial size, which the shell can use (or ignore).

~~~tsx
  <panel size={{ w: 120, h: 70 }}>
    // ...
  </panel>
)
~~~


::: section note box
### A note on JSX

JSX here is just shorthand for:

~~~tsx
import { composites } from '/os/api.js'

function jsx(tag, data) {
  if (isConstructable(tag))  return new tag(data)
  else if (isFunction(tag))  return tag(data)
  else if (isString(tag))    return composites[tag](data)
  else                       throw Error('...')
}
~~~

Unlike the classical web browser model, views are just instances
of `View` or a subclass, and devs can create subclasses directly.
Functions must ultimately return a view.

JSX strings are here used for [Composites](../guides/api-reference.md#composites),
which is a technique for styling and restructuring views and overriding
their functionality, as a modern alternative to older, classical models
such as HTML, CSS, web-components, and React.js.
:::


We center our main content, which is a group of views stacked
vertically, mainly being our greeting and our pair of button and
the label that reflects its actions.

~~~tsx
    <api.Center>
      <api.GroupY gap={4}>
        <api.Label text='hello world!' />
        <api.GroupX gap={2}>
          // ...
        </api.GroupX>
      </api.GroupY>
    </api.Center>
~~~

Above, we used primitive view classes, which can't be styled.
Here, we use the `button` composite, to allow users to override
our style, layout, and/or functionality. The default impl uses
a padding of 2, switches color based on the given `style`,
and puts the text inside a `Label` child of the `Button`.

~~~tsx
          <button style='submit' action={inc}>click me</button>
~~~

Finally we have the label that shows the number of clicks.
We take the `$count` and adapt it to produce a string.
Like most properties on View and its subclasses, you can
either pass a value or a ref to a value. (This aids with
creating flexible but simple composite APIs like `button`).

~~~tsx
          <api.Label text={$count.adapt(n => `clicked ${n} times`)} />
~~~

And that's it! You now have a working app, simple as can be.
