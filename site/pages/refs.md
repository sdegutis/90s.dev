# Refs

A ref is like a pointer:

```typescript
const r = $(0)
console.log(r.val) // 0

r.val++
console.log(r.val) // 1
```

You can watch it:

```typescript
const r = $(0)
r.watch(n => console.log(n))

r.val = 3 // stdout: 3
r.val++   // stdout: 4
```

You can adapt it to another value:

```typescript
const r = $(0)
const r2 = r.adapt(n => n * 2)
r2.watch(n => console.log(n))

r.val = 3 // stdout: 6
r.val++   // stdout: 8
```
