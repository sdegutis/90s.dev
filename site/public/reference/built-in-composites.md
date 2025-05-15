# Built-in Composites

See also the [technical composites reference](../technical/composites.md#composites).


## implicit

*Experimental.*

Used by JSX fragments.

```ts
data: {
  children: string | string[]
}
```

Default returns a label.

## button

*Experimental.*

```ts
data: {
  action: () => void
  style: 'submit' | 'cancel' | undefined
  children: any
}
```

Default returns button wrapped in label.

## textfield

*Experimental.*

```ts
data: {
  length?: number
} & ConstructorParameters<typeof TextBox>[0]
```

## panel

*Experimental.*

```ts
data: {
  file?: PanelFile,
  children: View,
  size?: MaybeRef<Size>,
  presented?: (panel: Panel) => void,
  onKeyPress?: (key: string) => boolean,
  menuItems?: () => MenuItem[],
}
```

## panel-titlebar

*Experimental.*

```ts
data: {
  title: MaybeRef<string>
  menuItems?: () => MenuItem[]
}
```

## panel-body

*Experimental.*

```ts
data: {
  children: View
  panelFocused: Ref<boolean>
}

preferences['panel-body-gap']: number
preferences['panel-body-gap-color']: number
preferences['panel-body-gap-color-focused']: number | undefined
preferences['panel-body-gap-color-unfocused']: number | undefined
```

## panel-resizer

*Experimental.*

```ts
data: {
  panelFocused: Ref<boolean>
}
```
