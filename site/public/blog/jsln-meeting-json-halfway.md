# JSLN: Meeting JSON halfway

Nobody likes writing or editing JSON.
That's why JSON5 and JSONC and TOML etc exist.

But those either add *way too much* complexity of their own,
or they simplify the *wrong things* about JSON.
I really *just want JSON*, only, *slightly* more convenient.

So in the spirit of xkcd.com/927,
I present to you, *yet another JSON alternative:*

```coffee
foo=123
bar.a="hello"
bar.b="world"

friends.names[]="Norm MacDonald"
friends.names[]="Old Harold Delaney"

also.nested.lists=[["work" 123] null true false 0x234f]

some.multiline.string=
"""
hello world
with multiline strings
"""

# and comments of course
```

which represents:

```json
{
  "foo": 123,
  "bar": {
    "a": "hello",
    "b": "world",
  },
  "some": {
    "multiline": {
      "string": "hello world\nwith multiline strings"
    }
  },
  "also": {
    "nested": {
      "lists": [["work", 123], null, true, false, 9039]
    }
  },
  "friends": {
    "names": [
      "Norm MacDonald",
      "Old Harold Delaney"
    ]
  }
}
```

The goal is to be simple enough that it doesn't *need* a spec for you to refer to;
it's *just JSON*, but with hex/binary numbers, no commas, and easier keys to read/type.

Probably nobody should use this. But I do and will continue to.

Anyway here's the [source code] (229 loc) for parse/stringify, I'm releasing it as MIT.

[source code]: https://github.com/sdegutis/os.90s.dev/blob/main/site/sys/api/core/jsln.ts
