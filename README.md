# ProControls for p5.js

**Hardware-inspired UI controls for p5.js sketches — drop in one script tag and go.**

Faders. Knobs. XY pads. Step-sequencer grids. VU meters. LED displays. ADSR envelopes. Piano keyboard. Modal dialogs. No event handlers to wire. No layout math. No boilerplate. Controls register themselves, draw themselves, and fire callbacks automatically.

→ **[Live Demo](https://procontrols.org/docs/demo.html)** · **[Documentation](https://procontrols.org/docs/gettingStarted.html)** · **[Interactive Examples](https://procontrols.org/docs/example.html)**

---

## What it looks like

```js
// One script tag + three lines of code
const volume = new AnalogSlider({ x: 20, y: 20, label: 'VOL', readout: 'db' });
const cutoff  = new Dial({ x: 100, y: 20, size: 70, min: 20, max: 20000, label: 'FREQ' });
const power   = new Switch({ x: 200, y: 40, states: ['OFF', 'ON'], state: 1 });
```

Controls appear on the canvas, respond to mouse and touch, and call your `onChange` when they change — that's it.

---

## Controls

**Input** — AnalogSlider · MultiSlider · RangeSlider · Dial · MultiDial · XYPad · GridPad · PianoPad · Switch · IconButton · Selector · TagSelector · SliderSelector

**Container** — Panel · ModalPanel · Bevel · MessageDialog · InputDialog · Menu · PopupMenu

**Display** — VUMeter · VUDial · LEDMeter · ADSRDisplay · Markup · ConsolePanel · StatusPanel · TimeGraphPanel · ListView · GridView · HeatMapView

---

## Quickstart

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js"></script>
<script src="ProControls.js"></script>
```

```js
function setup() {
  createCanvas(600, 400);
  ControlStyle = 'black';  // black · stainless · white · brushed · red · blue · yellow · dimpled
}

function draw() {
  background(30);
}
```

Controls placed anywhere in `setup()` appear automatically — no `draw()` calls needed.

---

## Callbacks

```js
new AnalogSlider({
  x: 20, y: 20,
  min: 0, max: 1, value: 0.8,
  label: 'GAIN',
  readout: 'db',
  onChange: (v) => myFilter.gain.value = v,
});
```

Every control fires `onChange(value, control)` on change and `onRelease(value, control)` on release.

---

## Panels — group controls together

```js
const strip = new Panel({ x: 20, y: 20, width: 200, height: 240, label: 'CHANNEL' });
strip.add(new Dial({ x: 20, y: 20, size: 70, label: 'FREQ' }));
strip.add(new AnalogSlider({ x: 120, y: 20, width: 44, height: 180, label: 'GAIN' }));

strip.onRelease = (vals) => console.log(vals);  // { FREQ: 440, GAIN: 0.8 }
```

Panels clip, scroll, and fire a single `onChange` / `onRelease` with a values snapshot for all children. Drag the title bar to reposition. Minimize with the − button.

---

## ModalPanel — await-able dialogs

```js
const modal = new ModalPanel({ label: 'Export Settings', width: 320 });
modal.add(new Selector({ name: 'format', label: 'Format', options: ['WAV', 'MP3', 'FLAC'] }));
modal.add(new AnalogSlider({ name: 'quality', label: 'Quality', value: 90, min: 0, max: 100 }));

async function mousePressed() {
  const result = await modal.show();   // blocks until Save or Cancel
  if (result) startExport(result);     // { format: 'WAV', quality: 90 }
}
```

The canvas dims, all other controls freeze, and your code awaits the result. Works naturally with `async` p5.js event handlers — `draw()` keeps running behind the backdrop.

---

## Themes

Eight built-in themes, switchable with one line:

| `'black'` | `'stainless'` | `'white'` | `'brushed'` |
|---|---|---|---|
| `'red'` | `'blue'` | `'yellow'` | `'dimpled'` |

```js
ControlStyle = 'stainless';
```

Override individual tokens for custom looks:

```js
new AnalogSlider({ theme: { track: '#1a1a2e', cap: '#00aaff', scaleText: '#6699cc' } });
```

---

## Developer tools

```js
openConsolePanel();   // floating console overlay — captures console.log inside the sketch
openStatusPanel();    // thin bar: FPS, Δt, control count, heap usage
```

---

## Features at a glance

- Zero dependencies beyond p5.js — one `.js` file, no build step
- Touch support out of the box (iOS, Android)
- Auto-layout: omit `x`/`y` and controls arrange themselves
- Spring-back on XYPad and sliders
- Scrollable panels with automatic scrollbars
- HeatMapView with drill-down treemap and gradient color metric
- Fully themeable per-control or globally
- MIT License

---

## Installation

**CDN / self-hosted** — download `ProControls.js` from this repo and include it after p5.js.

**npm** — coming soon.

---

## Documentation

| | |
|---|---|
| [Getting Started](https://procontrols.org/docs/gettingStarted.html) | HTML setup, script tags, first sketch |
| [Sliders & Dials](https://procontrols.org/docs/slidersHelp.html) | AnalogSlider · MultiSlider · RangeSlider · Dial · MultiDial |
| [Buttons & Pads](https://procontrols.org/docs/buttonsHelp.html) | XYPad · GridPad · PianoPad · IconButton |
| [Selectors](https://procontrols.org/docs/selectorsHelp.html) | Switch · Selector · TagSelector · SliderSelector |
| [Panels](https://procontrols.org/docs/panelsHelp.html) | Panel · ModalPanel · Bevel · MessageDialog · InputDialog |
| [Menus](https://procontrols.org/docs/menusHelp.html) | Menu · PopupMenu |
| [Displays](https://procontrols.org/docs/displaysHelp.html) | VUMeter · LEDMeter · ADSRDisplay · HeatMapView · and more |
| [Themes](https://procontrols.org/docs/themesHelp.html) | Theming system and token reference |

---

## License

MIT — free for personal and commercial use. See [LICENSE](LICENSE).

Built by [David Stein](https://procontrols.org).
