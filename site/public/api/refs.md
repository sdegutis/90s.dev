# Refs API

See also: [Refs Guide](/guides/refs.html)

```typescript
// typical way to create a ref
const $ = <T,>(val: T, equals?: Equals<T>) => Ref<T>


class Ref<T> {


  // the long-winded version of $
  constructor(val: T, equals?: Equals<T>)


  // experimental (too easy to forget; need to rethink)
  equals?: Equals<T> | undefined


  // value of ref
  get $(): T
  set $(val: T): void


  // watch a value for changes when !equals(a,b) ?? !==
  watch(fn: (data: T, old: T) => void): ListenerDone


  // intercept changes to val to normalize/constrain it
  intercept(fn: (data: T) => T, deps: Ref<any>[] = []): ListenerDone


  // create a new ref that transforms this ref in a given way
  adapt<U>(fn: (data: T, old: T) => U, equals?: Equals<U>): Ref<U>


  // the async verion of adapt
  async adaptAsync<U>(fn: (data: T, old: T) => Promise<U>, equals?: Equals<U>):
    Promise<Ref<U>>


  // make this ref defer its value and callbacks to another ref
  defer(other: Ref<T>): void


}


// watch multiple refs and combine their values into one
function multiplex<
  T,
  const R extends Ref<any>[],
  A extends { [N in keyof R]: R[N] extends Ref<infer V> ? V : never }
>(refs: R, fn: (...args: A) => T): Ref<T>


// transform an object's property into a ref and return it
function makeRef<T, K extends keyof T>(o: T, k: K): Ref<T>


// helpers for APIs that accept T or Ref<T>
type MaybeRef<T> = T | Ref<T>
function defRef<T>(t: MaybeRef<T>): Ref<T>


// stuff the API uses
type Equals<T> = (a: T, b: T) => boolean
type ListenerDone = () => void
```
