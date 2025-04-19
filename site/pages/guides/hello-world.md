# Hello World

The traditional "click me" app:

```typescript
import * as api from '/api.js'
await api.appReady

const $count = api.$(0)
const inc = () => $count.val++

const panel = await api.sys.makePanel({ name: "hello world" },
  <panel size={{ w: 120, h: 70 }}>
    <api.Center>
      <api.GroupY gap={4}>
        <api.Label text='hello world!' />
        <api.GroupX gap={2}>
          <button style='submit' action={inc}>click me</button>
          <api.Label text={$count.adapt(n => `clicked ${n} times`)} />
        </api.GroupX>
      </api.GroupY>
    </api.Center>
  </panel>
)

panel.focusPanel()
```

### Full Breakdown

All API functions are exported from this file.

```typescript
import * as api from '/api.js'
```

When the API is imported, the system is initialized,
and all prelude scripts of your choosing are run.
So we wait for them to finish.

```typescript
await api.appReady
```

We create a [Ref](/guides/refs.html) and a function to modify it.

```typescript
const $count = api.$(0)
const inc = () => $count.val++
```

The `sys` has a method to create panels, which is async
since apps run inside web workers, which need to communicate
with the host (the GUI thread).

```typescript
const panel = await api.sys.makePanel({ name: "hello world" },
```

Panels only require a name and a root view, so they can draw
something on screen, and so the shell has a somewhat unique
string to manage them by.

[Shells](/guides/shells.html) are just user-land programs
which typically watch the `panelevents` broadcast channel
and manage the size, position, and visibility of panels.

The panel here is the root view, which specifies
its initial size, which the shell can use (or ignore).

```typescript
  <panel size={{ w: 120, h: 70 }}>
    // ...
  </panel>
)
```


::: note
#### A note on JSX

JSX here is just shorthand for:

```typescript
import { composites } from '/api.js'

function jsx(tag, data) {
  if (isConstructable(tag))  return new tag(data)
  else if (isFunction(tag))  return tag(data)
  else                       return composites[tag](data)
}
```

Unlike the classical web browser model, views are just instances
of `View` or a subclass, and devs can create subclasses directly.
Functions must ultimately return a view.

JSX strings are here used for [Composites](/guides/composites.html),
which is a technique for styling and restructuring views and overriding
their functionality, as a modern alternative to older, classical models
such as HTML, CSS, web-components, and React.js.
:::


We center our main content, which is a group of views stacked
vertically, mainly being our greeting and our pair of button and
the label that reflects its actions.

```typescript
    <api.Center>
      <api.GroupY gap={4}>
        <api.Label text='hello world!' />
        <api.GroupX gap={2}>
          // ...
        </api.GroupX>
      </api.GroupY>
    </api.Center>
```

Above, we used primitive view classes, which can't be styled.
Here, we use the `button` composite, to allow users to override
our style, layout, and/or functionality. The default impl uses
a padding of 2, switches color based on the given `style`,
and puts the text inside a `Label` child of the `Button`.

```typescript
          <button style='submit' action={inc}>click me</button>
```

Finally we have the label that shows the number of clicks.
We take the `$count` and adapt it to produce a string.
Like most properties on View and its subclasses, you can
either pass a value or a ref to a value. (This aids with
creating flexible but simple composite APIs like `button`).

```typescript
          <api.Label text={$count.adapt(n => `clicked ${n} times`)} />
```

And that's it! You now have a working app, simple as can be.

Feel free to check out the [Todo List](/guides/todo-list.html)
for a more in-depth example.
