// sketch.js — demo for AnalogControls

let gainSlider, masterSlider, vuMeter, xyPad, gainDial, vuDial, ledMeter, styleSwitch, effectSelector, multiSlider, multiDial;
let rubberDial, groovedDial, pointerDial;
let controls  = [];
let vuLevel   = 0;

const STYLES  = ['black', 'stainless', 'white', 'brushed'];
const LABELS  = ['BLACK', 'STEEL', 'WHITE', 'BRUSH'];
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
    options: ['SINE', 'SQUARE', 'SAW', 'TRI', 'NOISE'],
    state: effectSelector ? effectSelector.state : 0,
    label: 'WAVE',
    onChange: (i, lbl) => console.log('wave', lbl),
  });

  styleSwitch = new AnalogSwitch({
    x: 896, y: 74,
    width: 52,
    states: LABELS,
    state: STYLES.indexOf(currentStyle),
    label: 'STYLE',
    onChange: i => {
      currentStyle = STYLES[i];
      buildControls();
    },
  });

  multiSlider = new MultiSlider({
    x: 20, y: 310,
    height: 150,
    min: -12, max: 12,
    readout: 'raw', decimals: 1,
    label: 'EQ',
    sliders: {
      '60Hz':  multiSlider ? multiSlider.slider('60Hz').value  : 0,
      '250Hz': multiSlider ? multiSlider.slider('250Hz').value : 0,
      '2kHz':  multiSlider ? multiSlider.slider('2kHz').value  : 0,
      '8kHz':  multiSlider ? multiSlider.slider('8kHz').value  : 0,
    },
    onChange: v => console.log('eq', v),
  });

  multiDial = new MultiDial({
    x: 510, y: 310,
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
    x: 730, y: 320,
    size: 60,
    min: 0, max: 1, value: rubberDial ? rubberDial.value : 0.6,
    label: 'RUBBER', readout: 'raw', decimals: 2,
    dialStyle: 'rubber',
  });

  groovedDial = new Dial({
    x: 800, y: 320,
    size: 60,
    min: 0, max: 1, value: groovedDial ? groovedDial.value : 0.4,
    label: 'GROOVED', readout: 'raw', decimals: 2,
    dialStyle: 'grooved',
  });

  pointerDial = new Dial({
    x: 870, y: 320,
    size: 60,
    min: 0, max: 1, value: pointerDial ? pointerDial.value : 0.75,
    label: 'POINTER', readout: 'raw', decimals: 2,
    dialStyle: 'pointer',
  });

  controls = [gainSlider, masterSlider, vuMeter, xyPad, gainDial, vuDial, ledMeter,
              effectSelector, styleSwitch, multiSlider, multiDial,
              rubberDial, groovedDial, pointerDial];
}

function setup() {
  createCanvas(970, 510);
  buildControls();
}

function draw() {
  analogBackground();

  // simulate VU level driven by master fader (with noise)
  const target = masterSlider.value * (0.8 + random(-0.1, 0.1));
  vuLevel        = lerp(vuLevel, target, 0.25);
  vuMeter.value  = vuLevel;
  vuDial.value   = vuLevel;
  ledMeter.value = vuLevel;

  // No draw loop needed — controls render themselves automatically.
}

// No event wiring or draw loop needed — AnalogControls.js handles it all.
