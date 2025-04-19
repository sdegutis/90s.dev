# Refs Guide

See also: [Refs API](/api/refs.html)

Refs lend themselves extremely well to reactive GUI programming.

This guide explains how they work and shows some basic recipes.

### Basics

A ref is like a pointer.

```typescript
const r = $(0)
console.log('val is', r.val)  // val is 0

r.val++
console.log('val is', r.val)  // val is 1
```

You can watch it.

```typescript
const r = $(0)
r.watch(n => console.log('val is', n))

r.val = 3  // val is 3
r.val++    // val is 4
```

You can adapt it to another value.

```typescript
const r = $(0)
const r2 = r.adapt(n => n * 2)
r2.watch(n => console.log('val is', n))

r.val = 3  // val is 6
r.val++    // val is 8
```

### Properties

You can back existing properties with a ref.

```typescript
const point = { x: 0, y: 0 }
const $x = makeRef(point, 'x')

$x.watch(x => console.log('val is', x))

point.x = 10  // val is 10
point.x++     // val is 11
```

You can even back class properties.

```typescript
class Point {
  x = 0
  y = 0

  $x = makeRef(this, 'x')
  $y = makeRef(this, 'y')
}

const point = new Point()

point.$x.watch(x => console.log('val is', x))

point.x = 10 // val is 10
point.x++    // val is 11
```

### Advanced

You can create a new ref based on multiple other refs:

```typescript
const r1 = $(1)
const r2 = $(100)

const r3 = multiplex([r1, r2], (v1, v2) => v1 * v2)
console.log(r3.val) // 100

r3.watch(n => console.log(`${r1.val} * ${r2.val} = ${n}`))

r1.val++     // 2 * 100 = 200
r1.val++     // 3 * 100 = 300
r2.val *= 2  // 3 * 200 = 600
```

You can change a value before watchers see it.

This is useful for normalizing/constraining values.

```typescript
const r = $(0)
r.watch(n => console.log('val is', n))
r.intercept(n => Math.max(0, Math.min(10, n)))

r.val = 9 // val is 9
r.val++   // val is 10
r.val++   // (nothing printed; no change in value)

console.log('val is currently', r.val) // val is currently 10
```

You can make one ref defer to another.

This basically ties the two refs together.

```typescript
const first = $(10)
first.watch(n => console.log('first is', n))

console.log(first.val) // 10

const second = $(0)

first.defer(second) // first is 0
first.val++         // first is 1
second.val++        // first is 2

console.log(first.val)  // 2
console.log(second.val) // 2

second.watch(n => console.log('second is', n))
first.val++         // first is 3
                    // second is 3
second.val++        // first is 4
                    // second is 4
```
