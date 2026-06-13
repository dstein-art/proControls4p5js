# Editing & Adding Examples

Examples on the doc pages are live — the textarea is editable and the canvas updates in real time as you type (700ms debounce).

---

## How examples work

Each example is a `<div class="example-row">` containing a `<textarea class="live-code">` and an `<iframe class="example-frame">`. When the page loads, the iframe fetches `example.html?c=<controlName>` which pulls the default code from the `DEFAULTS` object. As soon as the iframe is ready, the textarea's current code is sent via `postMessage` and the canvas re-renders.

---

## Key files

| File | What to edit |
|---|---|
| `docs/example.html` | `DEFAULTS` object (lines ~259–1140) — default code for each control type |
| `docs/slidersHelp.html` | Live examples for sliders and dials |
| `docs/buttonsHelp.html` | Live examples for buttons and pads |
| `docs/selectorsHelp.html` | Live examples for switches and selectors |
| `docs/panelsHelp.html` | Live examples for panels and dialogs |
| `docs/menusHelp.html` | Live examples for menus |
| `docs/displaysHelp.html` | Live examples for display controls |

---

## Edit an existing example

Open the relevant `docs/*.html` file and find the `<textarea class="live-code">` for that example. Edit the code directly in the textarea — it's the source of truth for what's shown on the page.

```html
<textarea class="live-code">
const vol = new AnalogSlider({
  x: 20, y: 20,
  label: 'VOL',
  readout: 'db',
});
</textarea>
```

---

## Add a new example to a doc page

Paste this block into the appropriate `docs/*.html` file where you want it to appear:

```html
<div class="example-row">
  <div class="live-editor">
    <div class="live-hint">CODE</div>
    <textarea class="live-code" spellcheck="false">
const myControl = new AnalogSlider({
  x: 20, y: 20,
  label: 'VOL',
});
    </textarea>
  </div>
  <iframe class="example-frame" src="example.html?c=slider"
          scrolling="no" frameborder="0"></iframe>
</div>
```

- Set `?c=<controlName>` on the iframe `src` to match a key in `DEFAULTS` — this sets the canvas size and the fallback code before the postMessage fires.
- The textarea code is what actually runs; it overrides `DEFAULTS` as soon as the iframe loads.

---

## Add a new control type (new DEFAULTS entry)

If you're adding examples for a control that has no entry in `DEFAULTS` yet:

1. Open `docs/example.html`
2. Find the `DEFAULTS` object (~line 259)
3. Add a new key matching the control's class name in camelCase:

```js
const DEFAULTS = {
  // ... existing entries ...
  myNewControl: `
const c = new MyNewControl({
  x: 20, y: 20,
  label: 'NEW',
});
`,
};
```

4. If the control needs a specific canvas size, also add it to the `SIZES` object (~line 102):

```js
const SIZES = {
  // ...
  myNewControl: [240, 180],  // [width, height]
};
```

---

## Two code modes

**Setup-only (default)** — your textarea code is the body of `setup()`. Just create controls:

```js
const vol = new AnalogSlider({ x: 20, y: 20, label: 'VOL' });
```

**Full sketch** — define your own `setup()` and `draw()` for custom animation. `example.html` detects the presence of `function setup` and switches modes automatically:

```js
function setup() {
  createCanvas(300, 200);
  ControlStyle = 'black';
}

function draw() {
  background(20);
  // custom drawing here
}
```
