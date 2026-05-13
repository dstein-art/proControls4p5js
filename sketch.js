// sketch.js — demo for AnalogControls

let gainSlider, masterSlider, vuMeter, xyPad, gainDial, vuDial, ledMeter, styleSwitch, effectSelector, multiSlider, multiDial;
let rubberDial, groovedDial, pointerDial;
let arrowSelector, gridToggle, gridPercent;
let adsrDisplay;
let tagSelector;
let rangeSlider;
let channelPanel;
let controls  = [];
let vuLevel   = 0;
let _noiseT   = 0;  // time offset for Perlin noise

const STYLES  = ['black', 'stainless', 'white', 'brushed', 'red', 'blue', 'yellow'];
const LABELS  = ['BLACK', 'STEEL', 'WHITE', 'BRUSH', 'RED', 'BLUE', 'YLW'];
let   currentStyle = 'stainless';

function buildControls() {
  analogReset();  // clear stale registrations before rebuilding
  AnalogStyle = currentStyle;

  gainSlider = new AnalogSlider({
    x: 20, y: 50,
    height: 200,
    min: 0, max: 30,
    value: gainSlider ? gainSlider.value : 0.7,
    label: 'GAIN',
    readout: 'raw',
    decimals: 1,
    theme: { capIndicator: '#ff0000' },
    onChange: v => console.log('gain', v),
  });

  masterSlider = new AnalogSlider({
    x: 100, y: 50,
    height: 200,
    min: 0, max: 1,
    value: masterSlider ? masterSlider.value : 0.85,
    label: 'MASTER',
    readout: 'db',
    theme: { capIndicator: '#ffcc00' },
  });

  vuMeter = new VUMeter({
    x: 180, y: 50,
    width: 44, height: 200,
    min: 0, max: 1,
    value: 0,
    label: 'VU',
    meterWidth: 10,
    showFader: false,
  });

  xyPad = new XYPad({
    x: 260, y: 50,
    width: 220, height: 200,
    minX: -1, maxX: 1,
    minY: -1, maxY: 1,
    valueX: xyPad ? xyPad.valueX : 0,
    valueY: xyPad ? xyPad.valueY : 0,
    label: 'XY',
    crosshairColor: '#ff6600',
    springBack: true,
    onChangeX: vx => console.log('x', vx),
    onChangeY: vy => console.log('y', vy),
  });

  gainDial = new Dial({
    x: 510, y: 80,
    size: 80,
    min: 0, max: 20,
    value: gainDial ? gainDial.value : 0.65,
    label: 'GAIN',
    readout: 'raw',
    onChange: v => console.log('dial gain', v),
  });

  vuDial = new VUDial({
    x: 620, y: 80,
    size: 80,
    min: 0, max: 1,
    value: 0,
    label: 'VU',
    showKnob: false,
  });

  ledMeter = new LEDMeter({
    x: 720, y: 110,
    min: 0, max: 1,
    value: 0,
    readout: 'db',
    digits: 5,
    decimals: 1,
    label: 'dB',
  });

  effectSelector = new Selector({
    x: 516, y: 200,
    width: 200,
    options: ['SINE', 'SQUARE', 'SAW', 'TRI', 'NOISE'],
    state: effectSelector ? effectSelector.state : 0,
    label: 'WAVE',
    onChange: (i, lbl) => console.log('wave', lbl),
  });

  arrowSelector = new Selector({
    x: 516, y: 262,
    width: 200,
    style: 'arrow',
    options: ['NONE', 'ROOM', 'HALL', 'PLATE', 'SPRING'],
    state: arrowSelector ? arrowSelector.state : 0,
    label: 'REVERB',
    onChange: (i, lbl) => console.log('reverb', lbl),
  });

  gridToggle = new GridPad({
    x: 730, y: 200,
    rows: 4, cols: 4,
    mode: 'toggle',
    cellSize: 18,
    hGroup: 2, vGroup: 2,
    label: 'PATTERN',
    values: gridToggle ? gridToggle.values : null,
    onChange: v => console.log('pattern', v),
  });

  tagSelector = new TagSelector({
    x: 185, y: 300,
    width: 285,
    words: ['REVERB', 'DELAY', 'CHORUS', 'FLANGER', 'PHASER', 'DISTORT',
            'COMPRESS', 'EQ', 'GATE', 'LIMITER', 'PITCH', 'RING MOD'],
    selected: tagSelector ? tagSelector.selected : [],
    label: 'FX',
    onChange: (sel, added, removed) => console.log('fx', sel, added, removed),
  });

  gridPercent = new GridPad({
    x: 20, y: 300,
    rows: 4, cols: 8,
    mode: 'percent',
    cellSize: 18,
    hGroup: 4,
    label: 'MATRIX',
    values: gridPercent ? gridPercent.values : null,
    onChange: v => console.log('matrix', v),
  });

  styleSwitch = new AnalogSwitch({
    x: 896, y: 74,
    width: 52,
    states: LABELS,
    state: STYLES.indexOf(currentStyle),
    springDefault: STYLES.indexOf('stainless'),
    label: 'STYLE',
    onChange: i => {
      currentStyle = STYLES[i];
      buildControls();
    },
  });

  // Preserve ADSR values across theme rebuilds
  const aVal = multiSlider ? multiSlider.slider('A').value : 0.3;
  const dVal = multiSlider ? multiSlider.slider('D').value : 0.4;
  const sVal = multiSlider ? multiSlider.slider('S').value : 0.7;
  const rVal = multiSlider ? multiSlider.slider('R').value : 0.8;

  // 4 sliders × 60px + 3 gaps × 4px = 252px — matches ADSRDisplay width exactly
  multiSlider = new MultiSlider({
    x: 20, y: 410,
    width: 60, height: 90,
    readout: 'raw', decimals: 2,
    sliders: {
      'A': { value: aVal, min: 0, max: 2 },
      'D': { value: dVal, min: 0, max: 2 },
      'S': { value: sVal, min: 0, max: 1 },
      'R': { value: rVal, min: 0, max: 4 },
    },
    onChange: v => {
      if (adsrDisplay) {
        adsrDisplay.attack  = v['A'];
        adsrDisplay.decay   = v['D'];
        adsrDisplay.sustain = v['S'];
        adsrDisplay.release = v['R'];
      }
    },
  });

  // y = slider top (410) + fader height (90) + child label height (16) + gap (3)
  adsrDisplay = new ADSRDisplay({
    x: 20, y: 519,
    width: 252, height: 115,
    attack: aVal, decay: dVal, sustain: sVal, release: rVal,
    label: 'ENV',
  });

  multiDial = new MultiDial({
    x: 510, y: 420,
    size: 60,
    min: 0, max: 100,
    readout: 'raw', decimals: 0,
    dials: {
      'BASS':   multiDial ? multiDial.dial('BASS').value   : 50,
      'MID':    multiDial ? multiDial.dial('MID').value    : 50,
      'TREBLE': multiDial ? multiDial.dial('TREBLE').value : 50,
    },
    onChange: v => console.log('tone', v),
  });

  rubberDial = new Dial({
    x: 730, y: 430,
    size: 60,
    min: 0, max: 1, value: rubberDial ? rubberDial.value : 0.6,
    label: 'RUBBER', readout: 'raw', decimals: 2,
    style: 'rubber',
  });

  groovedDial = new Dial({
    x: 800, y: 430,
    size: 60,
    min: 0, max: 1, value: groovedDial ? groovedDial.value : 0.4,
    label: 'GROOVED', readout: 'raw', decimals: 2,
    style: 'grooved',
  });

  pointerDial = new Dial({
    x: 870, y: 430,
    size: 60,
    min: 0, max: 1, value: pointerDial ? pointerDial.value : 0.75,
    label: 'POINTER', readout: 'raw', decimals: 2,
    style: 'pointer',
  });

  rangeSlider = new RangeSlider({
    x: 480, y: 300,
    width: 54, height: 170,
    min: 0, max: 1,
    valueLow:  rangeSlider ? rangeSlider.valueLow  : 0.2,
    valueHigh: rangeSlider ? rangeSlider.valueHigh : 0.8,
    label: 'RANGE',
    readout: 'raw', decimals: 2,
    onChange: (lo, hi) => console.log('range', lo, hi),
  });

  // Panel — demonstrates grouped controls with scrollable content
  channelPanel = new Panel({
    x: 556, y: 300,
    width: 165, height: 170,
    label: 'PANEL',
  });
  channelPanel.add(new Dial({
    x: 15, y: 18,
    size: 65, min: 0, max: 100,
    value: 60,
    label: 'FREQ', readout: 'raw', decimals: 0,
  }));
  channelPanel.add(new Dial({
    x: 90, y: 18,
    size: 65, min: 0, max: 100,
    value: 40,
    label: 'RES', readout: 'raw', decimals: 0,
  }));
  channelPanel.add(new AnalogSwitch({
    x: 26, y: 110,
    width: 112,
    states: ['LP', 'BP', 'HP', 'NOTCH'],
    state: 0,
    label: 'MODE',
  }));

  controls = [gainSlider, masterSlider, vuMeter, xyPad, gainDial, vuDial, ledMeter,
              effectSelector, arrowSelector, gridToggle, gridPercent,
              styleSwitch, multiSlider, adsrDisplay, multiDial,
              rubberDial, groovedDial, pointerDial, tagSelector, rangeSlider,
              channelPanel];
}

function setup() {
  createCanvas(970, 640);
  buildControls();
}

function draw() {
  analogBackground();

  // Simulate VU level driven by master fader, modulated by slow Perlin noise
  _noiseT += 0.002;
  const noiseVal = noise(_noiseT);          // 0–1, slowly drifting
  const target   = masterSlider.value * (0.4 + noiseVal * 0.7);
  vuLevel        = lerp(vuLevel, target, 0.12);
  vuMeter.value  = vuLevel;
  vuDial.value   = vuLevel;
  ledMeter.value = vuLevel;

  // No draw loop needed — controls render themselves automatically.
}

// No event wiring or draw loop needed — AnalogControls.js handles it all.
