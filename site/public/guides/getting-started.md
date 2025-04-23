# Getting started

This guide sets up a dev environment for
apps and libraries in [os.90s.dev](${OSHOST})


## Hello World

To getting a "hello world" sample app working:

1. Download [helloworld.zip](${OSHOST}/helloworld.zip) and extract it

2. Open [os.90s.dev/#sys/apps/filer.app.js](${OSHOST}/#sys/apps/filer.app.js)

3. Mount `helloworld/app` and navigate to it

4. Click `helloworld.app.js` (it may take a sec)

To see the development cycle in action:

5. Open `helloworld` in your favorite IDE

6. Change some text or something

7. Click the app again in `filer.app.js`

Congratulations, your hello world app works!

(If it doesn't, please [file a bug](https://github.com/ppl-90s-dev/ppl/issues).)

## Next steps

The entire core and all system apps are included in
the zip. This way you can see how the system works
internally, and even fork and modify built-in apps.

Check out the [Hello World guide](/guides/hello-world.html)
for a full breakdown of the sample code.


## Sharing your creations

Whether you made an app or a library, you can share
it with other people.

Check out the [Sharing your work](/guides/sharing-apps.html)
guide to learn more.


## Caveats

*Updated 4/22/2025*

1. All JS files must be named `.tsx` for technical reasons, never `.ts`, `.js`, or `.jsx`

If you find any issues, [file them on github](https://github.com/ppl-90s-dev/ppl/issues)
