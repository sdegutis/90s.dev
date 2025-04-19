# Refs

A ref is like a pointer:

```typescript
const r = $(0)
console.log(r.val) // 0

r.val++
console.log(r.val) // 1
```

But you can watch it:

this `is(so)` cool

```typescript
const r = $(0)
r.watch(n => console.log(n))

r.val = 3 // stdout: 3
r.val++   // stdout: 4
```
