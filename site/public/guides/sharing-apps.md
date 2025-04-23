# Sharing apps

The purpose of [os.90s.dev](${OSHOST}) is to be a
collaborative dev environment. Which means you'll
need a way to share your apps and libraries.

The [net/](${OSHOST}/#sys/apps/filer.app.js@net/) drive
was created for exactly that purpose, along with the
way the URL automatically becomes a sharable link
that opens all the non-minimized apps and files.

If you made something cool for [os.90s.dev](${OSHOST}) and want to share it:

1. Create an account in [os.90s.dev/#sys/apps/account.app.js](${OSHOST}/#sys/apps/account.app.js)

2. Create a folder under [net/](${OSHOST}/#sys/apps/filer.app.js@net/) with your username

3. Copy your app into that folder

4. Open your app so that the URL becomes a sharable link

5. Share the URL with your friends!

Make sure to minimize all apps that you don't want shared,
since minimized apps are not part of the URL.

## Sharing a library

If you made some code that should be shared,
follow steps 1-3 above, but only share the path
and API of your library, not the URL.

Libraries can be imported like so:

```ts
import { something } from '/fs/net/<username>/path/to/file.js'

console.log(something)
```

And it just works.


## Community links

- [Issues](https://github.com/ppl-90s-dev/ppl/issues) for feature requests, bug reports, etc

- [Wiki](https://github.com/ppl-90s-dev/ppl/wiki) for sharing your apps and libraries, etc
