# Refs

A ref is like a pointer:

```typescript
const r = $(0)
console.log('val is', r.val)  // val is 0

r.val++
console.log('val is', r.val)  // val is 1
```

You can watch it:

```typescript
const r = $(0)
r.watch(n => console.log('val is', n))

r.val = 3  // val is 3
r.val++    // val is 4
```

You can adapt it to another value:

```typescript
const r = $(0)
const r2 = r.adapt(n => n * 2)
r2.watch(n => console.log('val is', n))

r.val = 3  // val is 6
r.val++    // val is 8
```

You can make a property backed by a ref:

```typescript
const point = { x: 0, y: 0 }
const $x = makeRef(point, 'x')

$x.watch(x => console.log('val is', x))

point.x = 10  // val is 10
point.x++     // val is 11
```
