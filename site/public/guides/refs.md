# Understanding Refs

Refs lend themselves extremely well to reactive GUI programming.

This guide explains how they work and shows some basic recipes.

### Basics

A ref is like a pointer.

::: runcode 120 50
```tsx
import { $, print } from '/api.js'

const r = $(0)
print('val is', r.$)  // val is 0

r.$++
print('val is', r.$)  // val is 1
```
:::

You can watch it.

::: runcode 120 50
```tsx
import { $, print } from '/api.js'

const r = $(0)
r.watch(n => print('val is', n))

r.$ = 3  // val is 3
r.$++    // val is 4
```
:::

You can adapt it to another value.

::: runcode 120 50
```tsx
import { $, print } from '/api.js'

const r = $(0)
const r2 = r.adapt(n => n * 2)
r2.watch(n => print('val is', n))

r.$ = 3  // val is 6
r.$++    // val is 8
```
:::

### Properties

You can back existing properties with a ref.

::: runcode 120 50
```tsx
import { $, print, makeRef } from '/api.js'

const point = { x: 0, y: 0 }
const $x = makeRef(point, 'x')

$x.watch(x => print('val is', x))

point.x = 10  // val is 10
point.x++     // val is 11
```
:::

You can even back class properties.

::: runcode 120 50
```tsx
import { $, print, makeRef } from '/api.js'

class Point {
  x = 0
  y = 0

  $x = makeRef(this, 'x')
  $y = makeRef(this, 'y')
}

const point = new Point()

point.$x.watch(x => print('val is', x))

point.x = 10 // val is 10
point.x++    // val is 11
```
:::

### Advanced

You can create a new ref based on multiple other refs:

::: runcode 120 50
```tsx
import { $, print, multiplex } from '/api.js'

const r1 = $(1)
const r2 = $(100)

const r3 = multiplex([r1, r2], (v1, v2) => v1 * v2)
print(r3.$) // 100

r3.watch(n => print(`${r1.$} * ${r2.$} = ${n}`))

r1.$++     // 2 * 100 = 200
r1.$++     // 3 * 100 = 300
r2.$ *= 2  // 3 * 200 = 600
```
:::

You can change a value before watchers see it.

This is useful for normalizing/constraining values.

::: runcode 120 50
```tsx
import { $, print } from '/api.js'

const r = $(0)
r.watch(n => print('val is', n))
r.intercept(n => Math.max(0, Math.min(10, n)))

r.$ = 9 // val is 9
r.$++   // val is 10
r.$++   // (nothing printed; no change in value)

print('val is currently', r.$) // val is currently 10
```
:::

You can make one ref defer to another.

This basically ties the two refs together.

::: runcode 120 50
```tsx
import { $, print } from '/api.js'

const first = $(10)
first.watch(n => print('first is', n))

print(first.$) // 10

const second = $(0)

first.defer(second) // first is 0
first.$++         // first is 1
second.$++        // first is 2

print(first.$)  // 2
print(second.$) // 2

second.watch(n => print('second is', n))

first.$++   // first is 3
              // second is 3

second.$++  // first is 4
              // second is 4
```
:::
