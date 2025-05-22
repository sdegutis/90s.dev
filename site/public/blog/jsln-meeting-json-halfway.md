# JSLN: Meeting JSON halfway

Nobody likes writing or editing JSON.
That's why JSON5 and JSONC and TOML etc exist.

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

which is sugar for:

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

Probably nobody should use this. But I do and will continue to.

Anyway here's the [source code] (229 loc) for parse/stringify, I'm releasing it as MIT.

[source code]: https://github.com/sdegutis/os.90s.dev/blob/main/site/sys/api/core/jsln.ts
