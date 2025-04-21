# Introducing 90s.dev

WIP

::: runcode 120 70 autosize
```tsx
import * as api from '/api.js'

const $count = api.$(0)
const inc = () => $count.val++

const panel = await api.sys.makePanel({ name: "hello world" },
  <api.Center background={0x333333ff} size={api.sys.$size}>
    <api.GroupY gap={4}>
      <api.Label text='hello world!' />
      <api.GroupX gap={2}>
        <button style='submit' action={inc}>click me</button>
        <api.Label text={$count.adapt(n => `clicked ${n} times`)} />
      </api.GroupX>
    </api.GroupY>
  </api.Center>
)

panel.focusPanel()
```
:::
