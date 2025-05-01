# Where are all the engineers?

<!-- ALLOWEARLY -->

Bear with me as I think out loud here.

A few weeks ago, I wrote a small parser by hand
for a small configuration language
that I imagined would be a more convenient
version of JSON for my specific needs.

Today I [announced JSLN](introducing-jsln.md#jsln-tomljsonc-alternative)
and [told HN](https://news.ycombinator.com/item?id=43858664)
and [told r/javascript](https://www.reddit.com/r/javascript/comments/1kcb5s8/introducing_jsln/).
I was very proud of my work and wanted to share it.
I was convinced at least a few people would agree that it's useful.

Now, I'm not surprised or sad about getting no views.
One drop in the ocean does not make a big splash.

But what did deeply sadden me was this reddit comment:

> why not use a generic parser? i.e. write PEG grammar and skip the whole 'writing a custom parser'? ohm.js is one of those libraries
>
> &mdash; u/kattskill

To *me*, the answer is obvious:

* My parser is under 300 lines of code, shorter than *just the file grammar.js* inside ohm.js
* My parser is almost definitely at least *twice* as fast as if I were to write it using ohm.js
* Writing my parser only needed me to understand JSLN, without needing to learn ohm.js
* Debugging my parser only needed me to know JavaScript and devtools, not ohm.js also
* My parser is self-contained with zero dependencies *and is under 300 readable lines of code*

To be fair, there were several reasons I could count that comment as an outlier:

* It was one comment out of the *2.4 million* members on r/javascript
* It was posted in the middle of a workday by someone who was apparently not working
* It wasn't the only comment posted, and was the only negative one
* It showed a few signs that the person just *doesn't care*, including inconsistent capitals

But this is something I've seen *for my whole career*, which spans a quarter of a century:

The *vast* majority of software developers don't really understand software engineering.
They seem to look at code as pieces of stuff that you can glue together with more stuff.
As long as they get a paycheck, they don't seem to mind duct taping everything together.

There are a few outliers, who mostly seem to gravitate towards HN,
at least for the 15 years that I've been going there,
who in contrast tend to care *too much*, leading to decision paralysis.

But *every* time I've worked at *any* organization, I find maybe one or two engineers,
people who are passionate about finding the *right* solution, philosophically speaking,
to every problem, and even if they can't in the moment, they never really let it go,
and sometimes they work on it in their spare time, or sometimes they think about it
while driving or in the shower, and sometimes they have epiphanies
and churn out something like `git` with relative speed.

I guess it's not really engineering. It's philosophy that they're missing.
I don't mean academic philosophy which is nothing more than a scam.
I mean genuinely trying to understand how all the parts fit together,
and the right way to arrange them and make new systems that don't just work,
but work *for the right reasons*, which is the key to "clean code" as they put it lately.

That's what we really are. Software engineers are modern philosophers.
We envision a system entirely in our minds, and we create it with electrons.
But unlike ancient philosophers, the litmus test here is practical:
if you're right, your software will have no bugs, work smoothly,
and be easy to change, extend, and maintain. If you're wrong, it crashes,
glitches, or becomes disproportionately difficult to develop further.

I don't know what the solution is. But I do know that *I personally*
love software engineering. That's part of why I'm creating \[REDACTED]
