# Data Binding API

⚠️ **EXPERIMENTAL**: This API is experimental and subject to change.

## Overview

The `bind()` function enables two-way reactive data binding between ProControls and JavaScript objects. When a control is bound to a data property, the control and data stay in sync automatically.

- **Control changes data**: When the user moves a slider, the bound data object updates
- **Data changes control**: When you modify the bound data object, the control display updates automatically
- **No boilerplate**: No need for manual onChange handlers or value tracking

## Two Categories

### 1. Single-Data Controls (require field name)

Interactive controls with a single numeric or state value use explicit field binding:

```javascript
const config = { volume: 0.5 };
const slider = new AnalogSlider({ x: 50, y: 50, label: 'Volume' });
slider.bind(config, 'volume');
```

**Supported single-data controls:**
- `AnalogSlider`
- `Selector`
- `Switch`
- `IconButton`
- `SliderSelector`
- `VUMeter` (display-only)
- `StatusPanel` (display-only)
- `ConsolePanel` (display-only)
- `TimeGraphPanel` (display-only)

### 2. Multi-Data Controls (auto field matching)

Container and array-based controls automatically match field names:

```javascript
const data = { bass: 0.3, mid: 0.5, treble: 0.7 };
const multiSlider = new MultiSlider({ names: ['bass', 'mid', 'treble'] });
multiSlider.bind(data);  // Auto-matches property names
```

**Supported multi-data controls:**
- `Panel` (matches child control names)
- `MultiSlider` (matches slider names)
- `GridPad` (matches row names)
- `XYPad` (matches implicit x, y)
- `RangeSlider` (matches implicit min, max)
- `GridView` (binds to array)
- `PianoPad`
- `TagSelector`
- `ModalPanel`

## Usage Examples

### Example 1: Single Slider Binding

```javascript
function setup() {
  createCanvas(400, 300);

  const settings = { brightness: 128 };

  let brightnessSlider = new AnalogSlider({
    x: 50,
    y: 50,
    label: 'Brightness',
    min: 0,
    max: 255,
    value: settings.brightness
  });

  // Bind slider to settings.brightness
  brightnessSlider.bind(settings, 'brightness');
}

function draw() {
  background(220);

  // settings.brightness is always in sync with slider
  background(settings.brightness);
  text('Brightness: ' + settings.brightness, 50, 150);
}
```

### Example 2: Multi-Slider with EQ Controls

```javascript
function setup() {
  createCanvas(400, 300);

  const audioEQ = {
    bass: 0.5,
    mid: 0.5,
    treble: 0.5
  };

  let eqSlider = new MultiSlider({
    x: 50,
    y: 50,
    names: ['bass', 'mid', 'treble'],
    min: 0,
    max: 1,
    values: [0.5, 0.5, 0.5]
  });

  // Bind all three sliders to their matching properties
  eqSlider.bind(audioEQ);
}

function draw() {
  // audioEQ properties are always synced
  console.log(audioEQ.bass, audioEQ.mid, audioEQ.treble);
}
```

### Example 3: Panel with Multiple Controls

```javascript
function setup() {
  createCanvas(400, 300);

  const audioConfig = {
    masterVolume: 0.7,
    fadeTime: 2.0,
    enabled: true
  };

  let panel = new Panel({ x: 50, y: 50, width: 300, height: 250 });

  // Add sliders with names matching data properties
  let volume = new AnalogSlider({
    name: 'masterVolume',  // Must match audioConfig key
    label: 'Master Volume',
    min: 0,
    max: 1,
    value: audioConfig.masterVolume
  });
  panel.add(volume);

  let fade = new AnalogSlider({
    name: 'fadeTime',      // Must match audioConfig key
    label: 'Fade Time',
    min: 0,
    max: 10,
    value: audioConfig.fadeTime
  });
  panel.add(fade);

  let enabled = new Switch({
    name: 'enabled',       // Must match audioConfig key
    label: 'Enabled',
    value: audioConfig.enabled
  });
  panel.add(enabled);

  // Bind panel - automatically binds all children
  panel.bind(audioConfig);
}

function draw() {
  // All audioConfig properties stay in sync
}
```

### Example 4: GridPad Drum Pattern

```javascript
function setup() {
  createCanvas(600, 400);

  const drumPattern = {
    kick: [1, 0, 1, 0, 1, 0, 1, 0],
    snare: [0, 1, 0, 1, 0, 1, 0, 1],
    hihat: [1, 1, 1, 1, 1, 1, 1, 1]
  };

  let gridPad = new GridPad({
    x: 50,
    y: 50,
    names: ['kick', 'snare', 'hihat'],  // Must match pattern keys
    rows: 3,
    cols: 8,
    values: [
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1]
    ]
  });

  // Bind to drum pattern
  gridPad.bind(drumPattern);
}

function draw() {
  // drumPattern.kick, drumPattern.snare, drumPattern.hihat always in sync
}
```

### Example 5: XYPad with Position Binding

```javascript
function setup() {
  createCanvas(400, 400);

  const position = { x: 0.5, y: 0.5 };

  let xypad = new XYPad({
    x: 50,
    y: 50,
    width: 300,
    height: 300
  });

  // Automatically binds to x and y properties
  xypad.bind(position);
}

function draw() {
  background(220);

  // Use position.x and position.y
  fill(0);
  circle(
    position.x * width,
    position.y * height,
    50
  );
}
```

### Example 6: GridView with Array Binding

```javascript
function setup() {
  createCanvas(600, 400);

  const items = [
    { name: 'Item 1', value: 50, enabled: true },
    { name: 'Item 2', value: 75, enabled: false },
    { name: 'Item 3', value: 30, enabled: true }
  ];

  let gridView = new GridView({
    x: 50,
    y: 50,
    columns: ['name', 'value', 'enabled'],
    rows: 3
  });

  // Bind array - each item's properties sync with grid cells
  gridView.bind(items);
}

function draw() {
  // items array always reflects grid edits
  console.log(items);
}
```

### Example 7: Preset System

```javascript
const presets = {
  warm: { bass: 0.7, mid: 0.5, treble: 0.3 },
  bright: { bass: 0.3, mid: 0.5, treble: 0.8 },
  neutral: { bass: 0.5, mid: 0.5, treble: 0.5 }
};

const currentEQ = { bass: 0.5, mid: 0.5, treble: 0.5 };
let eqSlider;

function setup() {
  createCanvas(400, 300);

  eqSlider = new MultiSlider({
    x: 50,
    y: 50,
    names: ['bass', 'mid', 'treble'],
    min: 0,
    max: 1,
    values: [0.5, 0.5, 0.5]
  });

  eqSlider.bind(currentEQ);
}

function keyPressed() {
  // Load preset - sliders update automatically
  if (key === '1') {
    currentEQ.bass = presets.warm.bass;
    currentEQ.mid = presets.warm.mid;
    currentEQ.treble = presets.warm.treble;
  }
  if (key === '2') {
    currentEQ.bass = presets.bright.bass;
    currentEQ.mid = presets.bright.mid;
    currentEQ.treble = presets.bright.treble;
  }
}

function draw() {
  background(220);
  // Sliders automatically show preset values
}
```

### Example 8: Display-Only Binding (VUMeter)

```javascript
function setup() {
  createCanvas(400, 300);

  const systemMetrics = {
    cpuUsage: 45,
    memoryUsage: 62
  };

  let cpuMeter = new VUMeter({
    x: 50,
    y: 50,
    label: 'CPU Usage'
  });

  // Display-only: meter updates when data changes, but doesn't modify data
  cpuMeter.bind(systemMetrics, 'cpuUsage');
}

function draw() {
  background(220);

  // Simulate changing metrics
  systemMetrics.cpuUsage = random(20, 90);
  // Meter display updates automatically
}
```

## Rules for Multi-Data Controls

When using multi-data binding, property names in your data object **must match** the control's internal field names:

- **Panel**: Match child control `name` properties
- **MultiSlider**: Match `names` array
- **GridPad**: Match `names` array (row names)
- **XYPad**: Use `x` and `y` properties
- **RangeSlider**: Use `min` and `max` properties
- **GridView**: Bind to array; columns must match object property names

## How It Works

1. **Initial sync**: Control reads initial value from bound data
2. **Control → Data**: When user interacts with control, bound data updates immediately
3. **Data → Control**: When data property changes, control display updates via Proxy
4. **Automatic**: No callbacks needed - everything syncs automatically

## Limitations

- **Primitives not supported**: Cannot bind to bare `let x = 0.5`. Use objects: `let data = {x: 0.5}`
- **Array values**: GridView binds to arrays of objects; not raw arrays of numbers
- **Display-only controls**: VUMeter, StatusPanel, etc. only update display when data changes

## API Reference

### `control.bind(dataObject, fieldName)`

**Parameters:**
- `dataObject` (Object): The data object containing values to bind
- `fieldName` (String): *(Optional for multi-data controls)* Property name to bind to

**Returns:** The control itself (for chaining)

**Examples:**
```javascript
// Single-data
slider.bind(data, 'volume');

// Multi-data
panel.bind(data);
multiSlider.bind(data);

// Chaining
slider.bind(data, 'volume').position(100, 100);
```

## Performance Considerations

- **Zero overhead when not used**: If you don't call `bind()`, no binding code runs
- **Minimal overhead when used**: Uses JavaScript Proxies (modern browsers only)
- **Efficient updates**: Only syncs changed values

## Browser Support

Requires browsers supporting JavaScript Proxy:
- Chrome 49+
- Firefox 18+
- Safari 10+
- Edge 12+
- Not supported: IE 11 and earlier

## Troubleshooting

### "Binding doesn't work"

Check:
1. Data object property name matches control name/label
2. You're using an object, not a primitive (e.g., `{volume: 0.5}` not just `0.5`)
3. Control name/label matches for multi-data controls
4. Browser supports Proxy (IE 11 not supported)

### "Changes don't propagate to data"

For single-data controls, make sure you specify the field name:
```javascript
slider.bind(data, 'volume');  // ✓ Correct
slider.bind(data);            // ✗ Wrong - specify field for single-data
```

### "Control doesn't update when data changes"

Make sure you're modifying the property on the object:
```javascript
data.volume = 0.8;  // ✓ Control updates
volume = 0.8;       // ✗ Creating new variable, not updating object
```
