---
order: 3
---

# Publishing

To share apps and libraries you made,
you have to create an account.

* Accounts are free, and use OTPs instead of passwords.

With an account, you get:

* One public folder named <code>[net/](/os/#sys/apps/filer.app.js@net/)\<username>/</code>

* Up to `2^16 bytes` (64 KiB) per file

* Up to `2^24 bytes` (16 MiB) between all files


## Creating an account

1. Create an account in [90s.dev/os/#sys/apps/account.app.js](/os/#sys/apps/account.app.js)

2. Login with the token emailed to you

3. Create a folder under [net/](/os/#sys/apps/filer.app.js@net/) with your username

Congratulations, you now have a public folder!

You can put anything you want in it: apps, libraries, data files, documentation, etc.

All public files can be accessed via `api.fs`. See [Understanding FS](./filesystem.md#filesystem) to learn more.


## Shared apps

To get a sharable link to your app:

1. Open your app in [90s.dev/os/#sys/apps/filer.app.js](/os/#sys/apps/filer.app.js@net/)

2. Click your app to open it

3. That's it! Your URL is now sharable.


## Shared libraries

Libraries are normal code files:

```ts
// net/someuser/path/to/lib.js

export const randomNumber = () => 4
```

Libraries can be imported like so:

```ts
import { randomNumber } from '/os/fs/net/someuser/path/to/lib.js'

for (let i = 0; i < 3; i++) {
  console.log(randomNumber()) // prints three random integers
}
```


## Shared data files

Data files can be access through the [filesystem](./filesystem.md#filesystem):

```ts
const logo: string = await fs.getFile('net/someuser/images/logo.bitmap')
```
