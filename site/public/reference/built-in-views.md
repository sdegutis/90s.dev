# Built-in Views

See also the [technical views reference](../technical/views.md#views).

* To understand "malleable" and "axiomic", see the [layout section](../technical/views.md#layout).

These are designed to be composable enough to build any reasonable UI.

If a complex view is common enough, it will become a built-in composite.

Otherwise, the community can publish compostes and functions as needed.

## A note on backing refs

All properties have a ref equivalent, where `something` is backed by ref `$something`:

```ts
class View {

  size: Size
  $size: Ref<Size>

  children: View[]
  $children: Ref<View[]>

  // etc ...

}
```

The refs back the properties, so `v.prop === v.$prop.val` always. See the [refs guide](../guides/refs.md#properties).

To avoid verbosity, backing refs are omitted from the rest of the documentation.


## Generic


### View

The base class.

~~~ts
class View {

  panel: Panel | null
  parent: View | null

  children: View[]
  point: Point
  size: Size

  canFocus: boolean // default false
  canMouse: boolean // default false
  visible: boolean
  autofocus: boolean

  hovered: boolean
  pressed: boolean
  selected: boolean

  alpha: number // 0-1

  background: number // default 0 i.e. 0x00000000
  panelOffset: Point
  mouse: Point

  onPanelFocus?(): void
  onPanelBlur?(): void

  onMouseDown?(button: number): void
  onMouseMove?(pos: Point): void
  onMouseUp?(): void

  onMouseEnter?(): void
  onMouseExit?(): void

  onWheel?(x: number, y: number): void

  onFocus?(): void
  onBlur?(): void

  onKeyDown?(key: string): void
  onKeyUp?(key: string): void
  onKeyPress?(key: string): boolean

  adjust?(): void
  layout?(): void
  forceLayoutTree(): void

  adopted?(parent: View): void
  presented?(panel: Panel): void

  draw(ctx: DrawingContext): void {
    this.drawBackground(ctx, this.background)
  }

  protected onChildResized(child: View) {
    this.adjust?.()
    this.layout?.()
  }

  protected drawBackground(ctx: DrawingContext, bg: number) {
    ctx.fillRect(0, 0, this.size.w, this.size.h, bg)
  }

  focus()       { this.panel?.focusView(this) }
  needsRedraw() { this.panel?.needsRedraw(this) }

  get firstChild(): View | undefined
  get lastChild(): View | undefined

  addChild(child: View, i = this.children.length): void
  removeChild(child: View): void
  remove(): void

}
~~~


### Grid

Malleable when `cols === Infinity`, otherwise axiomic.

Lays out children in columns,
wrapping at `cols`,
or edge if `flow` is set.

Properly handles differently sized children.

~~~ts
class Grid extends View {

  cols = Infinity
  flow = false
  xgap = 0
  ygap = 0

}
~~~


### Spaced

Axiomic in one direction, malleable in the other.

Spaces its children apart equally.

A least favorite child. A necessary evil. An unfortunate fact of life. *Almost* deprecated.

~~~ts
class Spaced extends View{dir:'x'|'y'='x'}
class SpacedX extends Spaced{}
class SpacedY extends Spaced{}
~~~





## Malleable


### Margin

Malleable.

Resizes and repositions its child to match
its own size and position, except padding.

Use this to add a border around a malleables
like splits or more margins.

The border can be transparent padding or colored.

~~~ts
class Margin extends View {

  // shortcut for up = down = left = right = n
  padding: number

  // each defaults to 0
  up:    number
  down:  number
  left:  number
  right: number

  paddingColor: number // defaults to transparent black

}
~~~

### Center

Malleable.

Literally just centers its content on both axes.

No customization. Put inside Paned if you need alignment to an axis.

~~~ts
class Center extends View { /*...*/ }
~~~

### Paned

Malleable.

Like Split, except it "vacuums-shrinks" towards a given side.

The side being vacuumed must be axiomic in the given direction.

After layout, both sides will be resized to fit available area.

~~~ts
class Paned extends View {

  gap = 0
  dir: 'x' | 'y'
  vacuum: 'a' | 'b'

}
~~~

Convenience subclasses:

```ts
class PanedXA extends Paned { dir='x'; align='a' }
class PanedXB extends Paned { dir='x'; align='b' }
class PanedYA extends Paned { dir='y'; align='a' }
class PanedYB extends Paned { dir='y'; align='b' }
```

### Scroll

Malleable.

Allows scrolling its content which presumably outgrows it.

Doesn't resize its content.

(May have more than one child, but only deals with the first one.)

Currently there's no way to auto-hide/show scrollbars in relation to mouse events.

~~~ts
class Scroll extends View {

  scrollBy: number
  showh: boolean // default true
  showv: boolean // default true

  get content() { return this.firstChild! }

  scrollVisible(inner: View): void

}
~~~

### Split

Malleable.

Lays out two children side by side in a given `dir`.

Resizable by `pos`, which is relative to `stick` side.

Negative values imply coming from the non-`stick` side.

~~~ts
class Split extends View {

  dividerColorHovered = 0xffffff11
  dividerColorPressed = 0x1177ffcc

  pos =  20
  min =  10
  max = -10

  dir: 'x' | 'y'
  stick: 'a' | 'b'

}
~~~

Convenience subclasses:

```ts
class SplitXA extends Split { dir='x'; stick='a' }
class SplitXB extends Split { dir='x'; stick='b' }
class SplitYA extends Split { dir='y'; stick='a' }
class SplitYB extends Split { dir='y'; stick='b' }
```


## Axiomic




### Border

Axiomic.

Shrinks itself to fit around its child,
except padding.

Use this to add a border around axiomics like buttons or labels.

The border can be transparent padding or colored.

~~~ts
class Border extends Margin {

  // shortcut for up = down = left = right = n
  padding: number

  // each defaults to 0
  up:    number
  down:  number
  left:  number
  right: number

  paddingColor: number // defaults to transparent black

}
~~~


### Button

Axiomic.

Has no content.
Give it a Label or Image child,
or use a `button` composite.

Use this to build clickable things,
like text buttons, checkboxes, or scrollbar handles.

~~~ts
class Button extends Border {

  // reasonable defaults
  hoverBackground    = 0xffffff22
  pressBackground    = 0xffffff11
  selectedBackground = 0xffffff33

  onClick?(button: number): void

}
~~~



### Group

Axiomic.

Shrinks to fit multiple children,
laying them out in a given `dir` with optional `gap`.

Aligns children to
start (`a`),
middle (`m`),
end (`z`)
or grows them to match the biggest (`+`).

~~~ts
class Group extends View {

  gap: number
  dir: 'x' | 'y'
  align: 'a' | 'm' | 'z' | '+'

}
~~~

Convenience subclasses:

```ts
class GroupX  extends Group { dir='x' }
class GroupY  extends Group { dir='y' }
class GroupXA extends Group { dir='x'; align='a' }
class GroupXZ extends Group { dir='x'; align='z' }
class GroupYA extends Group { dir='y'; align='a' }
class GroupYZ extends Group { dir='y'; align='z' }
```

### Image

Axiomic.

Draws an image on screen.

Shrinks itself around the image.

Often wrapped with Border or Button.

~~~ts
class Image extends View {

  bitmap: Bitmap | null

}
~~~

### Label

Axiomic.

Draws text on screen.

Shrinks itself around the text.

Often wrapped with Border or Button.

Allows multiline strings.

Not editable; use Textbox for that.

~~~ts
class Label extends View {

  color = 0xffffffff
  font: Font
  text = ''

}
~~~


### Textbox

Axiomic believe it or not.

Not quite deprecated, but still very experimental and likely to become easier to use.

Shrinks itself around its content. Wrap in Scroll for stereotypical editable text area.

Use `model` to get/set/edit text or respond to text events.

Has a primitive form of syntax highlighting for some reason, but no selection yet? Ha.

~~~ts
class Textbox extends View {

  model = new TextModel()

  font: Font
  cursorColor = 0x0000ff99
  textColor   = 0xffffffff

  editable = true

  xgap = 0
  ygap = 0

  onEnter?(): void

}
~~~
