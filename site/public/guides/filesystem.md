# Filesystem

To browse files, use [os.90s.dev/#sys/apps/filer.app.js](${OSHOST}/#sys/apps/filer.app.js)


## File format

The file system of [os.90s.dev](${OSHOST}) is very simple:

* Every directory, including root drives, has the format `<dir>/`

  * The trailing `/` is part of the folder name

  * For example `sys/` and `sys/apps/` are two folders

* Drives are just (special) folders

* All files are text-based, binary is not supported


## Root drives

* `sys/` is read-only and contains core system files

* `usr/` is stored in IndexedDB

* `net/` is backed by a shared database

* You can mount local file system drives to given names

  * *NOTE:* `.js` files are stored as `.tsx` on mounted drives


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
