---
order: 3
---

# Filesystem

To browse files, use [90s.dev/os/#sys/apps/filer.app.js](/os/#sys/apps/filer.app.js)


## Drives

* `sys/` is read-only and contains core system files

* `usr/` is stored in IndexedDB

* `net/` is backed by a shared database

* You can mount local file system folders to named drives

  * *NOTE:* `.js` files are stored as `.tsx` on mounted drives


## Structure

The file system structure of [90s.dev/os/](/os/) is very simple:

* Every directory, including root drives, has the format `<dir>/`

  * The trailing `/` is part of the folder name

  * For example `sys/` and `sys/apps/` are two folders

* Drives are just (special) folders

* All files are text-based, binary is not supported


## Data files

*Note:* All files are strings.

```tsx
// returns contents if exists
const contents: string | null = await api.fs.getFile('usr/myfile')

// returns list of names if exists
const entries: string[] | null = await api.fs.getDir('usr/mydir/')
```


## Code files

All code files are executable, whether apps or libraries, from any [drive](#drives).

There are two ways to execute code:

```ts
api.sys.launch("net/someuser/foo.js") // runs it in its own new web worker
import "/os/fs/net/someuser/foo.js"   // runs it in the current web worker
```


## Accessing files in `usr/`

Because `sys/` and `net/` are the same for everyone,
libraries and apps that make use of these will work
the same for all users.

It is possible to use `usr/` in apps and libs, *however*,
the files *may not exist* or may be different, depending
on what the user has stored there!

There are currently no conventions for what files in
`usr/` should be expected. This is something that
the community will surely decide on as needed.
