---
order: 2
---

# Hello World tour

This guide goes through the "hello world" sample app in the [Getting Started](getting-started.md#getting-started) guide.

::: runcode 120 70
~~~tsx
import api, { $, Center, GroupY, Label, GroupX } from '/os/api.js'

await api.preludesFinished

const count = $(0)
const inc = () => count.value++

const panel = await api.sys.makePanel({ name: "hello world" },
  <Center size={api.sys.$size} background={0x444444ff}>
    <GroupY gap={4}>
      <Label text='hello world!' />
      <GroupX gap={2}>
        <button style='submit' action={inc}>click me</button>
        <Label text={count.adapt(n => `clicked ${n} times`)} />
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

Let's look at each part of the code topically.


## Data management

~~~tsx
const count = $(0)
const inc = () => count.set(count.val + 1)

// ...

<button style='submit' action={inc}>click me</button>
<Label text={count.adapt(n => `clicked ${n} times`)} />
~~~

We create a ref and a function to modify it.
There's nothing magical about refs,
they're basically just watchable pointers
that run your callbacks when they change.

We give the label's text property a `Ref<string>` instead of `string` so that
whenever the value changes, the label will automatically update its text.

Keep in mind that refs are always optional.
We could have just set `label.text` to a string
directly in the button's `action` callback.
But that's also exactly what the code above does.

Learn more in the [Refs guide](../guides/refs.md#refs).


## System architecture

~~~tsx
const panel = await api.sys.makePanel({ name: "hello world" },
~~~

We have to `await` it because our code is running inside a process (a web worker),
and has to ask the host (the GUI thread) to create a new panel.

The host is very lightweight, responsible mainly for
propagating mouse/keyboard events to processes,
managing processes and panels, and displaying panels on the screen.
Processes do most of the heavy lifting, including drawing to panels via OffscreenCanvas.

Learn more in the [Architecture guide](./technology.md#architecture).

We also have to name our panel so the shell can show it in a taskbar or whatever.
Shells are just userland programs that manage panels
in response to BroadcastChannel events.
The built-in shell is a simple windows-style shell.
There are no tiling shells yet, sorry. But you can make one.

Learn more in the [Shells section](./technology.md#shells) of the architecture guide.


## How views work

~~~tsx
<Center size={api.sys.$size} background={0x444444ff}>
  <GroupY gap={4}>
    <Label text='hello world!' />
    <GroupX gap={2}>
      ...
      <Label text={count.adapt(n => `clicked ${n} times`)} />
    </GroupX>
  </GroupY>
</Center>
~~~

Views handle content, style, layout, and behavior.

* We use `Center`, `GroupX`, and `GroupY` for layout
* We use `label` and `button` to draw text to the screen
* Theme customization is opt-in rather than automatic

Learn more in the [Views guide](../guides/views.md#views).

::: section box note
### A note on JSX

There's nothing special about JSX here. It's just shorthand.

These two are equivalent:

```tsx
const label1 = <Label text='hello world!' />

const label2 = new Label({ text: 'hello world!' })
```

Learn more in the [JSX section](../guides/views.md#jsx) of the views guide.
:::




## Theming made easy

~~~tsx
<button style='submit' action={inc}>click me</button>
~~~

We have only seen concrete views until now, such as `Label` and `GroupY`.
They look and behave exactly how they're told, without exception.

On the other hand, `button` is a composite view,
which operates purely on *semantic* data,
and transforms it however the *composite's author* decides.
This is the key to theming.

For example, using the default composite for `button`,
our code from earlier becomes:

~~~tsx
// before
<button style='submit' action={inc}>click me</button>

// after
<Button background={0xffffff33} padding={2} onClick={inc}>
  <Label text='click me'/>
</Button>
~~~

But composites loaded by a theme could return anything else,
and users can load any theme they'd like into all processes.
The possibilities for customization are practically endless.

```tsx
await api.preludesFinished
```

This line is needed to make sure preludes can finish running,
which are the mechanism users use to load theme modules into
an app's process (web worker thread) to customize it.

Learn more in the [Composite guide](../guides/composites.md#composites).
