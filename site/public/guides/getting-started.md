# Getting Started

This guide sets up a dev environment for making and testing
apps in [os.90s.dev](https://os.90s.dev).


## Hello World

1. Download [helloworld.zip](${OSHOST}/helloworld.zip)

2. Extract to `helloworld` somewhere

3. Open [os.90s.dev/?app=sys/apps/filer.app.js](https://os.90s.dev/?app=sys/apps/filer.app.js)

4. Mount `helloworld/app` and click it in the sidebar

5. Click `helloworld.app.js` (it may take a second)


## Your first edit

1. Open `helloworld` in your favorite IDE

2. Change some text or something

3. Click the app again in `filer.app.js`


### Going further

The entire core and all system apps are included in
[helloworld.zip](${OSHOST}/helloworld.zip), so that
you can fully understand what everything does, learn
from it, and experiment more easily.

For example, if you wanted to modify the filer,
you could copy `sys/apps/filer.app.js` into your
`helloworld/apps/`, modify it, and run that.


### Community

If you make something cool and want to share it:

1. Create an account in [os.90s.dev/?app=sys/apps/account.app.js](https://os.90s.dev/?app=sys/apps/account.app.js)

2. Create a folder under [net/](https://os.90s.dev/?app=sys/apps/filer.app.js&file=net/) with your username

3. Copy your app into that folder

4. Open your app so that the URL becomes a sharable link

5. Share the link with your friends!

See also:

- [Issues](https://github.com/ppl-90s-dev/ppl/issues) for feature requests, bug reports, etc

- [Wiki](https://github.com/ppl-90s-dev/ppl/wiki) for sharing your creations, documenting findings, etc



### Caveats

*Updated 4/22/2025*

1. All runnable files must be named `.tsx` for technical reasons, never `.ts`

2. If you find any issues, [file them on github](https://github.com/ppl-90s-dev/ppl/issues)
