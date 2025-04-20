# 90s.dev

::: note
***Note:***

This site is not yet public. You'll be very confused if you try to read anything on it.
:::

::: features
* 🧪
  ### Retrofuturistic
  Innovative tech on the inside, pixel art on the outside.

* 🤝
  ### Collaborative
  Dev env that lets us build parts of an app together.

* 🔨
  ### Game-maker maker
  Together, we shall make the best pixel art game maker ever conceived.
:::

Welcome to 90s.dev, an alternative reality where
the 2000s played out differently, pixel art aesthetics still reign supreme,
and GUIs evolved to be far more usable and convenient.

```tsx
import * as api from '/api.js'

const $count = api.$(0)
const inc = () => $count.val++

const panel = await api.sys.makePanel({ name: "hello world" },
  <api.Center background={0x333333ff} size={{ w: 120, h: 70 }}>
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

:::placeholder 120 70
:::
