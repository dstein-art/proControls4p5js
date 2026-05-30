// ProControls.js — base class + Slider for p5.js
// Copyright © David Stein 2026
// Last updated: 2026-05-30 — commit 43fb9d5

// q5 compatibility: Define print() as a console.log wrapper
// p5.js defines print, but q5 doesn't (and browser's native print opens dialog, not console)
// Save the native print in case it's needed, then override
const _nativePrintFn = window.print;
window.print = function(...args) {
  // If called with no args, it's probably trying to open the print dialog (native behavior)
  if (args.length === 0) _nativePrintFn();
  // Otherwise, log to console like p5.js does
  else console.log(...args);
};

// Set ControlStyle before creating controls to choose a built-in look.
// Per-control overrides still work via opts.theme.
//   ControlStyle = 'black';     // dark electronic (default)
//   ControlStyle = 'stainless'; // polished chrome/steel
//   ControlStyle = 'white';     // Swiss/Braun minimalist
//   ControlStyle = 'brushed';   // brushed aluminum
//   ControlStyle = 'red';       // deep red studio console
//   ControlStyle = 'blue';      // deep navy broadcast
//   ControlStyle = 'yellow';    // warm amber/golden

let ControlStyle = 'black';

const ProControlThemes = {
  black: {
    bg:              '#1a1a1a',
    panel:           '#2a2a2a',
    panelStroke:     '#111111',
    track:           '#0d0d0d',
    trackStroke:     '#000000',
    capBody:         '#888888',
    capHighlight:    '#bbbbbb',
    capShadow:       '#555555',
    capIndicator:    '#00ccff',
    scaleText:       '#666666',
    scaleTick:       '#444444',
    label:           '#aaaaaa',
    readout:         '#cccccc',
    readoutBg:       '#111111',
    tooltip:         '#eeeeee',
    tooltipBg:       '#000000cc',
    hoverGlow:       '#00ccff44',
    disabledOverlay: '#00000088',
    font:            null,
  },
  stainless: {
    bg:              '#b8bec4',
    panel:           '#cdd3d9',
    panelStroke:     '#8a9097',
    track:           '#8a9097',
    trackStroke:     '#6b7177',
    capBody:         '#c0c6cc',
    capHighlight:    '#f0f4f8',
    capShadow:       '#7a8088',
    capIndicator:    '#005fa3',
    scaleText:       '#445566',
    scaleTick:       '#8a9097',
    label:           '#334455',
    readout:         '#112233',
    readoutBg:       '#b0b8c0cc',
    tooltip:         '#112233',
    tooltipBg:       '#f0f4f8dd',
    hoverGlow:       '#005fa333',
    disabledOverlay: '#cdd3d988',
    font:            null,
  },
  white: {
    bg:              '#e8e8e8',
    panel:           '#f5f5f5',
    panelStroke:     '#d0d0d0',
    track:           '#d8d8d8',
    trackStroke:     '#c0c0c0',
    capBody:         '#e0e0e0',
    capHighlight:    '#ffffff',
    capShadow:       '#b8b8b8',
    capIndicator:    '#cc2200',
    scaleText:       '#666666',
    scaleTick:       '#c0c0c0',
    label:           '#222222',
    readout:         '#111111',
    readoutBg:       '#e8e8e8',
    tooltip:         '#ffffff',
    tooltipBg:       '#000000cc',
    hoverGlow:       '#cc220022',
    disabledOverlay: '#f5f5f588',
    font:            null,
  },
  brushed: {
    bg:              '#8e9099',
    panel:           '#a0a8b0',
    panelStroke:     '#6a7078',
    track:           '#707880',
    trackStroke:     '#505860',
    capBody:         '#9aa2aa',
    capHighlight:    '#d0d8e0',
    capShadow:       '#606870',
    capIndicator:    '#ff8800',
    scaleText:       '#3a4048',
    scaleTick:       '#6a7078',
    label:           '#202830',
    readout:         '#101820',
    readoutBg:       '#8090a088',
    tooltip:         '#101820',
    tooltipBg:       '#d0d8e0dd',
    hoverGlow:       '#ff880033',
    disabledOverlay: '#00000044',
    font:            null,
  },
  red: {
    bg:              '#cc0000',
    panel:           '#990000',
    panelStroke:     '#660000',
    track:           '#550000',
    trackStroke:     '#330000',
    capBody:         '#cc4444',
    capHighlight:    '#ff8888',
    capShadow:       '#882222',
    capIndicator:    '#ffdd00',
    scaleText:       '#ff9999',
    scaleTick:       '#cc3333',
    label:           '#ffdddd',
    readout:         '#ffffff',
    readoutBg:       '#66000099',
    tooltip:         '#ffffff',
    tooltipBg:       '#000000cc',
    hoverGlow:       '#ffdd0044',
    disabledOverlay: '#00000066',
    font:            null,
  },
  blue: {
    bg:              '#0000cc',
    panel:           '#000099',
    panelStroke:     '#000066',
    track:           '#000055',
    trackStroke:     '#000033',
    capBody:         '#3344cc',
    capHighlight:    '#7788ff',
    capShadow:       '#112288',
    capIndicator:    '#ffdd00',
    scaleText:       '#99aaff',
    scaleTick:       '#4455cc',
    label:           '#ddeeff',
    readout:         '#ffffff',
    readoutBg:       '#00006699',
    tooltip:         '#ffffff',
    tooltipBg:       '#000000cc',
    hoverGlow:       '#ffdd0044',
    disabledOverlay: '#00000066',
    font:            null,
  },
  dimpled: {
    bg:              '#8e9099',
    panel:           '#a0a8b0',
    panelStroke:     '#6a7078',
    track:           '#707880',
    trackStroke:     '#505860',
    capBody:         '#9aa2aa',
    capHighlight:    '#d0d8e0',
    capShadow:       '#606870',
    capIndicator:    '#0088cc',
    scaleText:       '#3a4048',
    scaleTick:       '#6a7078',
    label:           '#202830',
    readout:         '#101820',
    readoutBg:       '#aab2ba',
    tooltip:         '#101820',
    tooltipBg:       '#d0d8e0dd',
    hoverGlow:       '#0088cc33',
    disabledOverlay: '#00000044',
    font:            null,
  },
  yellow: {
    bg:              '#e0d000',
    panel:           '#c0a800',
    panelStroke:     '#907800',
    track:           '#665500',
    trackStroke:     '#443300',
    capBody:         '#ddc840',
    capHighlight:    '#fff8aa',
    capShadow:       '#998800',
    capIndicator:    '#cc0000',
    scaleText:       '#332200',
    scaleTick:       '#775500',
    label:           '#110800',
    readout:         '#110800',
    readoutBg:       '#887700aa',
    tooltip:         '#110800',
    tooltipBg:       '#ffeeaadd',
    hoverGlow:       '#cc000033',
    disabledOverlay: '#00000055',
    font:            null,
  },
};

function proControlBackground() {
  const theme = ProControlThemes[ControlStyle] ?? ProControlThemes.black;
  background(theme.bg);
  if (ControlStyle === 'brushed')   _drawBrushedOverlay(theme);
  if (ControlStyle === 'stainless') _drawStainlessOverlay(theme);
  if (ControlStyle === 'dimpled')   _drawDimpledOverlay(theme);
}

function _drawBrushedOverlay(theme) {
  const gc  = drawingContext;
  const h   = height;
  const w   = width;
  const bc  = color(theme.bg);
  const br  = red(bc), bg_ = green(bc), bb = blue(bc);

  gc.save();
  for (let y = 0; y < h; y++) {
    // Three overlapping frequencies: fine grain, visible strokes, slow bands
    const v = Math.sin(y * 11.3) * Math.sin(y * 17.7 + 1.2) * 0.50
            + Math.sin(y *  2.8 + 0.4)                       * 0.35
            + Math.sin(y *  0.15)                             * 0.15;

    // Horizontal sheen band — simulates the directional reflection of brushed metal
    const sheen = Math.max(0, 1 - Math.abs(y / h - 0.38) * 3.5) * 10;

    const d = v * 18 + sheen;
    gc.fillStyle = `rgb(${(br + d) | 0},${(bg_ + d) | 0},${(bb + d) | 0})`;
    gc.fillRect(0, y, w, 1);
  }
  gc.restore();
}

function _drawDimpledOverlay(theme) {
  const gc      = drawingContext;
  const spacing = 12;
  const r       = 2.5;

  gc.save();
  let row = 0;
  for (let gy = spacing / 2; gy < height; gy += spacing) {
    const xOffset = (row % 2 === 1) ? spacing / 2 : 0;
    for (let gx = spacing / 2 + xOffset; gx < width + spacing; gx += spacing) {
      // Outer dark depression
      gc.beginPath();
      gc.arc(gx, gy, r, 0, Math.PI * 2);
      gc.fillStyle = 'rgba(0,0,0,0.18)';
      gc.fill();
      // Inner specular highlight — light catching the rim
      gc.beginPath();
      gc.arc(gx - 0.6, gy - 0.6, r * 0.5, 0, Math.PI * 2);
      gc.fillStyle = 'rgba(255,255,255,0.20)';
      gc.fill();
    }
    row++;
  }
  gc.restore();
}

function _drawStainlessOverlay(theme) {
  const gc  = drawingContext;
  const h   = height;
  const w   = width;
  const bc  = color(theme.bg);
  const br  = red(bc), bg_ = green(bc), bb = blue(bc);

  gc.save();

  // Build a vertical gradient via per-row fillRect.
  // The profile has three zones that mimic a curved reflective surface:
  //   top edge   → slightly dark (shadow)
  //   upper band → bright specular highlight (the "reflection" of a light source)
  //   center     → base color
  //   lower band → secondary softer highlight
  //   bottom     → slightly dark again
  for (let y = 0; y < h; y++) {
    const t = y / h;  // 0 at top, 1 at bottom

    // Primary specular band — sharp bright streak near the top third
    const spec1 = Math.exp(-Math.pow((t - 0.22) / 0.07, 2)) * 52;
    // Secondary softer reflection toward the bottom
    const spec2 = Math.exp(-Math.pow((t - 0.72) / 0.14, 2)) * 18;
    // Overall darkening at very top and bottom edges (curved-surface shadow)
    const edge  = -Math.pow(Math.abs(t - 0.5) * 1.9, 3) * 20;
    // Very subtle vertical banding (tiny surface irregularities)
    const micro = Math.sin(t * h * 0.9) * 1.2;

    const d = spec1 + spec2 + edge + micro;
    gc.fillStyle = `rgb(${(br+d)|0},${(bg_+d)|0},${(bb+d)|0})`;
    gc.fillRect(0, y, w, 1);
  }

  // Thin pure-white specular line at the peak of the highlight band
  gc.fillStyle = 'rgba(255,255,255,0.45)';
  gc.fillRect(0, Math.round(h * 0.19), w, 1);

  gc.restore();
}

// ─── Auto-wiring registry ─────────────────────────────────────────────────────
// Controls self-register on construction. p5.registerMethod hooks dispatch
// events to every registered control so the sketch needs no event boilerplate.

const _proControlRegistry  = [];
const _drawnThisFrame  = new Set();
let   _proControlWired      = false;
let   _proControlWasPressed = false;
const _analogWheelQ     = [];

// Touch tracking — populated by native listeners, injected into p5 globals each frame
let _proTouchActive = false;
let _proTouchX      = 0;
let _proTouchY      = 0;

// ── Auto-layout ──────────────────────────────────────────────────────────────
// Tracks the cursor position for controls created without explicit x/y.
// Portrait controls (h > w) advance the cursor rightward.
// Landscape controls (w >= h) advance the cursor downward.
// When the cursor would overflow the canvas bottom, a new column starts 20px
// to the right of the rightmost edge reached so far.
const _autoLayout = { nextX: 20, nextY: 20, rightEdge: 20 };

function _autoNext(w, h, panelAutoLayout, panelWidth, panelHeight) {
  const GAP    = 8;
  const layout = panelAutoLayout || _autoLayout;
  const startY = panelAutoLayout ? 8 : 20;
  const maxW = panelAutoLayout ? panelWidth : (typeof width !== 'undefined' ? width : 800);
  const maxH = panelAutoLayout ? panelHeight : (typeof height !== 'undefined' ? height : 600);

  if (layout.nextY + h > maxH - GAP) {
    // Overflow — start new column
    layout.nextX = layout.rightEdge + GAP;
    layout.nextY = startY;
  }

  const x = layout.nextX;
  const y = layout.nextY;

  layout.rightEdge = Math.max(layout.rightEdge, x + w);

  if (h > w) {
    // Portrait: place next control to the right
    layout.nextX = x + w + GAP;
    layout.nextY = y;
  } else {
    // Landscape / square: place next control below
    layout.nextX = x;
    layout.nextY = y + h + GAP;
  }

  return { x, y };
}

// Clear all registrations — call at the top of buildControls() when rebuilding.
function proControlReset() {
  _proControlRegistry.length = 0;
  _drawnThisFrame.clear();
  _proControlWasPressed = false;
  _proTouchActive = false;
  Object.assign(_autoLayout, { nextX: 20, nextY: 20, rightEdge: 20 });
}

// p5.prototype.registerMethod only supports lifecycle hooks (pre/post/init/remove),
// NOT event names. Instead we use a single 'pre' hook that fires each frame after
// p5 has already updated mouseX, mouseY, mouseIsPressed from DOM events.

function _proControlPreHook() {
  // One-time canvas setup
  if (!_proControlWired) {
    _proControlWired = true;
    const canvas = this.canvas ?? document.querySelector('canvas');
    if (canvas) {
      canvas.style.touchAction = 'none';
      // Wheel has no p5 global for delta, so queue it via native listener
      canvas.addEventListener('wheel', e => {
        _analogWheelQ.push(e);
        e.preventDefault();
      }, { passive: false });

      // Native touch → sketch-coordinate tracking.
      // p5's touch→mouseX/mouseY mapping is unreliable on iOS Safari, so we
      // track touches ourselves and inject into p5 globals each frame.
      const p5inst = this;
      const _touchPos = (touch) => {
        const rect = canvas.getBoundingClientRect();
        const sx = (canvas.scrollWidth  || rect.width)  / (p5inst.width  || rect.width)  || 1;
        const sy = (canvas.scrollHeight || rect.height) / (p5inst.height || rect.height) || 1;
        return {
          x: (touch.clientX - rect.left) / sx,
          y: (touch.clientY - rect.top)  / sy,
        };
      };
      canvas.addEventListener('touchstart', e => {
        if (e.touches.length > 0) {
          const p = _touchPos(e.touches[0]);
          _proTouchX = p.x; _proTouchY = p.y; _proTouchActive = true;
        }
        e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
          const p = _touchPos(e.touches[0]);
          _proTouchX = p.x; _proTouchY = p.y;
        }
        e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchend', e => {
        _proTouchActive = false;
        e.preventDefault();
      }, { passive: false });
      canvas.addEventListener('touchcancel', () => { _proTouchActive = false; });
    }
  }

  // Inject touch state into p5 globals so all control code sees touch as mouse
  if (_proTouchActive) {
    this.mouseX   = _proTouchX;  this.mouseY   = _proTouchY;
    window.mouseX = _proTouchX;  window.mouseY = _proTouchY;
  }

  // Resolve auto-placement for any controls still pending, in creation order.
  // This runs after all setup() constructors have finished so width/height are final.
  for (const c of _proControlRegistry) {
    if (c._autoPlacePending) c._resolveAutoPlace();
  }

  // Dispatch hover / drag (safe to call every frame — uses current mouseX/mouseY)
  for (const c of _proControlRegistry) c.mouseMoved();

  // Detect press / release edge transitions — union of touch and mouse state
  const down = _proTouchActive || mouseIsPressed;
  if (down && !_proControlWasPressed) {
    for (const c of _proControlRegistry) c.mousePressed();
  } else if (!down && _proControlWasPressed) {
    for (const c of _proControlRegistry) c.mouseReleased();
  }
  _proControlWasPressed = down;

  // Advance spring-back animations
  for (const c of _proControlRegistry) c._tickSpring();

  // Drain wheel queue
  for (const e of _analogWheelQ) {
    for (const c of _proControlRegistry) c.mouseWheel(e);
  }
  _analogWheelQ.length = 0;
}

function _proControlPostHook() {
  // Auto-draw: render every registered control that wasn't explicitly drawn
  // this frame. Fires after the sketch's draw() so background is already set.
  for (const c of _proControlRegistry) {
    if (!_drawnThisFrame.has(c)) c.draw();
  }
  _drawnThisFrame.clear();
}

// Support both p5 v1 (registerMethod) and p5 v2 (function wrapping)
if (typeof p5 !== 'undefined' && p5.prototype.registerMethod) {
  // p5 v1: Use registerMethod hooks
  p5.prototype.registerMethod('pre', _proControlPreHook);
  p5.prototype.registerMethod('post', _proControlPostHook);
} else {
  // p5 v2: Defer wrapping until after p5 setup completes
  const _wrapDrawOnce = () => {
    if (typeof window.setup === 'function') {
      const _originalSetup = window.setup;
      window.setup = function() {
        _originalSetup.call(this);

        // Now wrap draw after setup has run and p5 is initialized
        const _originalDraw = typeof window.draw === 'function' ? window.draw : () => {};
        window.draw = function() {
          _proControlPreHook.call(window);
          _originalDraw.call(window);
          _proControlPostHook.call(window);
        };
      };
    }
  };

  // Wait for p5 to load, then wrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wrapDrawOnce);
  } else {
    setTimeout(_wrapDrawOnce, 0);
  }
}

// ─── Base ────────────────────────────────────────────────────────────────────

class ProControl {
  constructor(opts = {}) {
    // x/y: if neither is provided, auto-placement resolves lazily on first
    // access (after the subclass constructor sets the final width/height).
    if (opts.x === undefined && opts.y === undefined) {
      this._x = 0; this._y = 0;
      this._autoPlacePending = true;
    } else {
      this._x = opts.x ?? 20; this._y = opts.y ?? 20;
      this._autoPlacePending = false;
    }
    this.min      = opts.min      ?? 0;
    this.max      = opts.max      ?? 1;
    this.value    = Math.max(this.min, Math.min(this.max, opts.value ?? this.min));
    this.label    = opts.label    ?? '';
    this.disabled = opts.disabled ?? false;
    this.onChange  = opts.onChange  ?? null;
    this.onRelease = opts.onRelease ?? null;
    this.scale    = opts.scale    ?? 'linear'; // 'linear' | 'log' (log requires min > 0)
    const base    = ProControlThemes[ControlStyle] ?? ProControlThemes.black;
    this.theme    = Object.assign({}, base, opts.theme ?? {});
    this._hovered = false;
    this._active  = false;

    this.springBack     = opts.springBack     ?? false;
    this.springDuration = opts.springDuration ?? 1.0;
    this._springActive  = false;
    this._springStartMs = 0;
    this._springFrom    = null;
    this._springDefault  = opts.springDefault ?? this.value; // subclasses may override
    this._lastPressTime  = -9999;

    _proControlRegistry.push(this);
  }

  get x() { if (this._autoPlacePending) this._resolveAutoPlace(); return this._x; }
  set x(v) { this._autoPlacePending = false; this._x = v; }
  get y() { if (this._autoPlacePending) this._resolveAutoPlace(); return this._y; }
  set y(v) { this._autoPlacePending = false; this._y = v; }

  _resolveAutoPlace() {
    // Check if this control is being added to a panel
    if (this._parentPanel) {
      const panelIntWidth = this._parentPanel.width - 16;   // account for padding
      const panelIntHeight = this._parentPanel.height - 20;  // account for title bar and padding
      const { x, y } = _autoNext(this.width, this.height, this._parentPanel._autoLayout, panelIntWidth, panelIntHeight);
      this._x = this._parentPanel.x + x;
      this._y = this._parentPanel.y + this._parentPanel._titleH + y;
    } else {
      // Use global canvas auto-layout
      const { x, y } = _autoNext(this.width, this.height);
      this._x = x;
      this._y = y;
    }
    this._autoPlacePending = false;
  }

  // Set position after instantiation (backwards compatibility with p5 controls)
  position(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  _isDoubleClick() {
    const now = millis();
    const dt  = now - this._lastPressTime;
    this._lastPressTime = now;
    if (dt < 350) { this._lastPressTime = -9999; return true; }
    return false;
  }

  // Unregister this control so it no longer receives events.
  remove() {
    const i = _proControlRegistry.indexOf(this);
    if (i !== -1) _proControlRegistry.splice(i, 1);
  }

  // Like remove() but only de-registers without any cleanup — used by Panel.add()
  // so composite controls (MultiSlider, MultiDial) can be adopted without destroying
  // their internal sub-children.
  _detach() {
    const i = _proControlRegistry.indexOf(this);
    if (i !== -1) _proControlRegistry.splice(i, 1);
  }

  // Map value (or v) to [0,1]
  _norm(v = this.value) {
    if (this.scale === 'log') {
      return Math.log(v / this.min) / Math.log(this.max / this.min);
    }
    return (v - this.min) / (this.max - this.min);
  }

  // Map n in [0,1] to [min,max]
  _fromNorm(n) {
    n = constrain(n, 0, 1);
    if (this.scale === 'log') {
      return this.min * Math.pow(this.max / this.min, n);
    }
    return this.min + n * (this.max - this.min);
  }

  _drawPanel(x, y, w, h, r = 4) {
    push();
    fill(this.theme.panel);
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    rect(x, y, w, h, r);
    pop();
  }

  _drawLabel(cx, y, txt = this.label) {
    if (!txt) return;
    push();
    noStroke();
    fill(this.theme.label);
    textSize(10);
    textAlign(CENTER, TOP);
    if (this.theme.font) textFont(this.theme.font);
    text(txt, cx, y);
    pop();
  }

  _drawReadout(cx, y, txt) {
    push();
    const pad = 4;
    textSize(9);
    if (this.theme.font) textFont(this.theme.font);
    const w = textWidth(txt) + pad * 2;
    noStroke();
    fill(this.theme.readoutBg);
    rect(cx - w / 2, y, w, 11, 2);
    fill(this.theme.readout);
    textAlign(CENTER, TOP);
    text(txt, cx, y + 1);
    pop();
  }

  _drawTooltip(cx, y, txt) {
    push();
    textSize(10);
    if (this.theme.font) textFont(this.theme.font);
    const pad = 6;
    const tw  = textWidth(txt) + pad * 2;
    const th  = 18;
    fill(this.theme.tooltipBg);
    noStroke();
    rect(cx - tw / 2, y - th - 4, tw, th, 3);
    fill(this.theme.tooltip);
    textAlign(CENTER, CENTER);
    text(txt, cx, y - th / 2 - 4);
    pop();
  }

  _drawDisabled(x, y, w, h) {
    push();
    noStroke();
    fill(this.theme.disabledOverlay);
    rect(x, y, w, h, 4);
    pop();
  }

  // Call at the top of every concrete draw() override to prevent
  // the auto-draw post hook from rendering the control a second time.
  _markDrawn() { _drawnThisFrame.add(this); }

  // ── Spring-back ───────────────────────────────────────────────────────────
  // Continuously animates value back to _springDefault after release.
  // Subclasses with non-value state (XYPad, Switch, Rotary) override these.

  _startSpring() {
    if (!this.springBack || this._springDefault === null) return;
    this._springActive  = true;
    this._springStartMs = millis();
    this._springFrom    = this.value;
  }

  _cancelSpring() {
    this._springActive = false;
  }

  _tickSpring() {
    if (!this._springActive) return;
    const t    = Math.min((millis() - this._springStartMs) / 1000 / this.springDuration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
    this.value = lerp(this._springFrom, this._springDefault, ease);
    if (this.onChange) this.onChange(this.value);
    if (t >= 1) {
      this.value         = this._springDefault;
      this._springActive = false;
    }
  }

  // Subclasses override these
  draw()          {}
  mousePressed()  {}
  mouseReleased() {}
  mouseMoved()    {}
  mouseWheel(_e)  {}
}

// ─── Slider ──────────────────────────────────────────────────────────────────

class AnalogSlider extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.readout    = opts.readout    ?? 'raw';  // 'raw' | 'percent' | 'db'
    this.decimals   = opts.decimals   ?? 2;
    this.horizontal = opts.horizontal ?? false;
    this.style      = opts.style ?? 'knob';      // 'knob' | 'wheel' | 'button'

    // internal
    this._capH      = this.style === 'button' ? 20 : 24;
    this._trackPad  = this._capH / 2 + 2;
    this._dragStart = null;

    if (this.horizontal) {
      this.showScale = opts.showScale ?? false;
      this.showFader = opts.showFader ?? true;
      this.width     = opts.width  ?? 180;
      this.height    = opts.height ?? 44;
    } else {
      const isSpecial = this.style !== 'knob';
      this.showScale = opts.showScale ?? !isSpecial;
      this.showFader = opts.showFader ?? true;
      this.height    = opts.height ?? 180;
      if (opts.width !== undefined) {
        this.width = opts.width;
      } else if (this.style === 'wheel') {
        this.width = 50;
      } else if (this.showScale) {
        // Auto-size width so scale labels fit inside the panel.
        const charPx   = 4;
        const txtOff   = 12;
        const rPad     = 4;
        const maxChars = Math.max(
          (this.min).toFixed(1).length,
          (this.max).toFixed(1).length
        );
        this.width = Math.max(44, Math.ceil((txtOff + maxChars * charPx + rPad) * 2));
      } else {
        this.width = 40;
      }
    }
  }

  // ── geometry helpers ──────────────────────────────────────────────────────

  _trackX()  { return this.x + this.width / 2; }
  _trackTop()    { return this.y + this._trackPad; }
  _trackBottom() { return this.y + this.height - this._trackPad; }
  _trackLen()    { return this._trackBottom() - this._trackTop(); }

  // y-pixel for current value (0 = bottom, 1 = top)
  _capY() {
    return this._trackBottom() - this._norm() * this._trackLen();
  }

  // horizontal geometry
  _hTrackY()    { return this.y + this.height / 2; }
  _hTrackLeft() { return this.x + this._trackPad; }
  _hTrackRight(){ return this.x + this.width - this._trackPad; }
  _hTrackLen()  { return this._hTrackRight() - this._hTrackLeft(); }
  _hCapX()      { return this._hTrackLeft() + this._norm() * this._hTrackLen(); }

  // ── readout formatting ────────────────────────────────────────────────────

  _formatReadout() {
    const v = this.value;
    switch (this.readout) {
      case 'percent':
        return nf(this._norm() * 100, 1, 1) + '%';
      case 'db': {
        if (v <= this.min) return '-∞';
        const db = 20 * Math.log10(v / this.max);
        return nf(db, 1, 1) + ' dB';
      }
      default:
        return nf(v, 1, this.decimals);
    }
  }

  // ── drawing ───────────────────────────────────────────────────────────────

  draw() {
    this._markDrawn();
    if (this.horizontal) { this._drawHorizontal(); } else { this._drawVertical(); }
  }

  _drawVertical() {
    if (this.style === 'wheel')  { this._drawWheel();        return; }
    if (this.style === 'button') { this._drawButtonSlider(); return; }
    const cx = this._trackX();
    const { x, y, width: w, height: h } = this;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push();
      noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    const trackW = 6;
    const trackX = cx - trackW / 2;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(trackX, this._trackTop(), trackW, this._trackLen(), 2);
    pop();

    if (this.showScale) this._drawScale(cx, trackW);
    if (this.showFader) this._drawCap(cx, this._capY());

    this._drawReadout(cx, y + h - 12, this._formatReadout());
    this._drawLabel(cx, y + 2);

    if (this._active) this._drawTooltip(cx, this._capY(), this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawWheel() {
    const { x, y, width: w, height: h } = this;
    const cx   = this._trackX();
    const capY = this._capY();

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    const slotPad = 8;
    const slotX   = x + slotPad;
    const slotW   = w - slotPad * 2;
    const slotTop = this._trackTop();
    const slotH   = this._trackLen();
    const gc      = drawingContext;

    // Wheel body — clipped to slot
    gc.save();
    gc.beginPath();
    gc.rect(slotX, slotTop, slotW, slotH);
    gc.clip();

    const grad = gc.createLinearGradient(slotX, 0, slotX + slotW, 0);
    grad.addColorStop(0,    this.theme.capShadow);
    grad.addColorStop(0.18, this.theme.capBody);
    grad.addColorStop(0.42, this.theme.capHighlight);
    grad.addColorStop(0.58, this.theme.capHighlight);
    grad.addColorStop(0.82, this.theme.capBody);
    grad.addColorStop(1,    this.theme.capShadow);
    gc.fillStyle = grad;
    gc.fillRect(slotX, slotTop, slotW, slotH);

    // Horizontal ribs scrolling with position
    const ribSpacing = 8;
    const ribOffset  = ((capY - slotTop) % ribSpacing + ribSpacing) % ribSpacing;
    gc.lineWidth = 1;
    for (let ry = slotTop + ribOffset; ry < slotTop + slotH; ry += ribSpacing) {
      gc.beginPath(); gc.moveTo(slotX, ry); gc.lineTo(slotX + slotW, ry);
      gc.strokeStyle = 'rgba(0,0,0,0.22)'; gc.stroke();
      gc.beginPath(); gc.moveTo(slotX, ry + 1); gc.lineTo(slotX + slotW, ry + 1);
      gc.strokeStyle = 'rgba(255,255,255,0.16)'; gc.stroke();
    }

    // Accent ridge at current position
    gc.beginPath(); gc.moveTo(slotX, capY); gc.lineTo(slotX + slotW, capY);
    gc.strokeStyle = this.theme.capIndicator;
    gc.lineWidth   = 2;
    gc.globalAlpha = 0.9;
    gc.stroke();
    gc.globalAlpha = 1;

    gc.restore();

    // Overlays — slot border, rim lines, center notches
    gc.save();
    gc.strokeStyle = this.theme.trackStroke;
    gc.lineWidth   = 1;
    gc.strokeRect(slotX, slotTop, slotW, slotH);

    gc.strokeStyle = 'rgba(255,255,255,0.30)';
    gc.beginPath(); gc.moveTo(slotX + 1.5, slotTop + 2); gc.lineTo(slotX + 1.5, slotTop + slotH - 2); gc.stroke();
    gc.strokeStyle = 'rgba(0,0,0,0.22)';
    gc.beginPath(); gc.moveTo(slotX + slotW - 1.5, slotTop + 2); gc.lineTo(slotX + slotW - 1.5, slotTop + slotH - 2); gc.stroke();

    const midY = slotTop + slotH / 2;
    gc.strokeStyle = this.theme.capIndicator;
    gc.lineWidth   = 1.5;
    gc.beginPath(); gc.moveTo(x + 3, midY); gc.lineTo(slotX - 1, midY); gc.stroke();
    gc.beginPath(); gc.moveTo(slotX + slotW + 1, midY); gc.lineTo(x + w - 3, midY); gc.stroke();

    gc.restore();

    this._drawReadout(cx, y + h - 12, this._formatReadout());
    this._drawLabel(cx, y + 2);
    if (this._active) this._drawTooltip(cx, capY, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawButtonSlider() {
    const { x, y, width: w, height: h } = this;
    const cx   = this._trackX();
    const capY = this._capY();

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    // Thin 4px track groove
    const trackW = 4;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(cx - trackW / 2, this._trackTop(), trackW, this._trackLen(), 2);
    pop();

    // Circular cap
    if (this.showFader) {
      const r  = this._capH / 2;   // 10px radius
      const gc = drawingContext;
      gc.save();

      const grad = gc.createRadialGradient(
        cx - r * 0.3, capY - r * 0.35, 0,
        cx, capY, r
      );
      grad.addColorStop(0,    this.theme.capHighlight);
      grad.addColorStop(0.55, this.theme.capBody);
      grad.addColorStop(1,    this.theme.capShadow);

      gc.beginPath();
      gc.arc(cx, capY, r, 0, Math.PI * 2);
      gc.fillStyle = grad;
      gc.fill();
      gc.strokeStyle = this.theme.panelStroke;
      gc.lineWidth   = 1;
      gc.stroke();

      gc.beginPath();
      gc.arc(cx, capY, 2.5, 0, Math.PI * 2);
      gc.fillStyle = this.theme.capIndicator;
      gc.fill();

      gc.restore();
    }

    this._drawReadout(cx, y + h - 12, this._formatReadout());
    this._drawLabel(cx, y + 2);
    if (this._active) this._drawTooltip(cx, capY, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawHWheel() {
    const { x, y, width: w, height: h } = this;
    const capX = this._hCapX();

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    const slotPad  = 8;
    const slotY    = y + slotPad;
    const slotH    = h - slotPad * 2;
    const slotLeft = this._hTrackLeft();
    const slotW    = this._hTrackLen();
    const gc       = drawingContext;

    gc.save();
    gc.beginPath();
    gc.rect(slotLeft, slotY, slotW, slotH);
    gc.clip();

    // Gradient runs top-to-bottom (perpendicular to travel)
    const grad = gc.createLinearGradient(0, slotY, 0, slotY + slotH);
    grad.addColorStop(0,    this.theme.capShadow);
    grad.addColorStop(0.18, this.theme.capBody);
    grad.addColorStop(0.42, this.theme.capHighlight);
    grad.addColorStop(0.58, this.theme.capHighlight);
    grad.addColorStop(0.82, this.theme.capBody);
    grad.addColorStop(1,    this.theme.capShadow);
    gc.fillStyle = grad;
    gc.fillRect(slotLeft, slotY, slotW, slotH);

    // Vertical ribs scrolling with position
    const ribSpacing = 8;
    const ribOffset  = ((capX - slotLeft) % ribSpacing + ribSpacing) % ribSpacing;
    gc.lineWidth = 1;
    for (let rx = slotLeft + ribOffset; rx < slotLeft + slotW; rx += ribSpacing) {
      gc.beginPath(); gc.moveTo(rx, slotY); gc.lineTo(rx, slotY + slotH);
      gc.strokeStyle = 'rgba(0,0,0,0.22)'; gc.stroke();
      gc.beginPath(); gc.moveTo(rx + 1, slotY); gc.lineTo(rx + 1, slotY + slotH);
      gc.strokeStyle = 'rgba(255,255,255,0.16)'; gc.stroke();
    }

    // Accent ridge at current position
    gc.beginPath(); gc.moveTo(capX, slotY); gc.lineTo(capX, slotY + slotH);
    gc.strokeStyle = this.theme.capIndicator;
    gc.lineWidth   = 2;
    gc.globalAlpha = 0.9;
    gc.stroke();
    gc.globalAlpha = 1;

    gc.restore();

    // Slot border, rim highlights, center notches
    gc.save();
    gc.strokeStyle = this.theme.trackStroke;
    gc.lineWidth   = 1;
    gc.strokeRect(slotLeft, slotY, slotW, slotH);

    gc.strokeStyle = 'rgba(255,255,255,0.30)';
    gc.beginPath(); gc.moveTo(slotLeft + 2, slotY + 1.5); gc.lineTo(slotLeft + slotW - 2, slotY + 1.5); gc.stroke();
    gc.strokeStyle = 'rgba(0,0,0,0.22)';
    gc.beginPath(); gc.moveTo(slotLeft + 2, slotY + slotH - 1.5); gc.lineTo(slotLeft + slotW - 2, slotY + slotH - 1.5); gc.stroke();

    const midX = slotLeft + slotW / 2;
    gc.strokeStyle = this.theme.capIndicator;
    gc.lineWidth   = 1.5;
    gc.beginPath(); gc.moveTo(midX, y + 3);          gc.lineTo(midX, slotY - 1);          gc.stroke();
    gc.beginPath(); gc.moveTo(midX, slotY + slotH + 1); gc.lineTo(midX, y + h - 3);       gc.stroke();

    gc.restore();

    if (this.label) {
      push(); noStroke(); fill(this.theme.label); textSize(9); textAlign(LEFT, TOP);
      if (this.theme.font) textFont(this.theme.font);
      text(this.label, x + 4, y + 2);
      pop();
    }
    this._drawReadout(x + w - 22, y + h - 13, this._formatReadout());
    if (this._active) this._drawTooltip(capX, y - 2, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawHButtonSlider() {
    const { x, y, width: w, height: h } = this;
    const ty   = this._hTrackY();
    const capX = this._hCapX();

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    // Thin 4px track groove
    const trackH = 4;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(this._hTrackLeft(), ty - trackH / 2, this._hTrackLen(), trackH, 2);
    pop();

    // Circular cap
    if (this.showFader) {
      const r  = this._capH / 2;
      const gc = drawingContext;
      gc.save();

      const grad = gc.createRadialGradient(
        capX - r * 0.3, ty - r * 0.35, 0,
        capX, ty, r
      );
      grad.addColorStop(0,    this.theme.capHighlight);
      grad.addColorStop(0.55, this.theme.capBody);
      grad.addColorStop(1,    this.theme.capShadow);

      gc.beginPath();
      gc.arc(capX, ty, r, 0, Math.PI * 2);
      gc.fillStyle = grad;
      gc.fill();
      gc.strokeStyle = this.theme.panelStroke;
      gc.lineWidth   = 1;
      gc.stroke();

      gc.beginPath();
      gc.arc(capX, ty, 2.5, 0, Math.PI * 2);
      gc.fillStyle = this.theme.capIndicator;
      gc.fill();

      gc.restore();
    }

    if (this.label) {
      push(); noStroke(); fill(this.theme.label); textSize(9); textAlign(LEFT, TOP);
      if (this.theme.font) textFont(this.theme.font);
      text(this.label, x + 4, y + 2);
      pop();
    }
    this._drawReadout(x + w - 22, y + h - 13, this._formatReadout());
    if (this._active) this._drawTooltip(capX, y - 2, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawHorizontal() {
    if (this.style === 'wheel')  { this._drawHWheel();        return; }
    if (this.style === 'button') { this._drawHButtonSlider(); return; }
    const ty = this._hTrackY();
    const { x, y, width: w, height: h } = this;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push();
      noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    const trackH = 6;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(this._hTrackLeft(), ty - trackH / 2, this._hTrackLen(), trackH, 2);
    pop();

    if (this.showScale) this._drawHScale(ty, trackH);

    const capX = this._hCapX();
    if (this.showFader) this._drawHCap(capX, ty);

    // label top-left, readout bottom-right
    if (this.label) {
      push();
      noStroke();
      fill(this.theme.label);
      textSize(9);
      textAlign(LEFT, TOP);
      if (this.theme.font) textFont(this.theme.font);
      text(this.label, x + 4, y + 2);
      pop();
    }
    this._drawReadout(x + w - 22, y + h - 13, this._formatReadout());

    if (this._active) this._drawTooltip(capX, y - 2, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawHCap(cx, cy) {
    const capW = this._capH;
    const capH = this.height - 10;
    const capX = cx - capW / 2;
    const capY = cy - capH / 2;

    push();
    noStroke();
    for (let i = 0; i < capW; i++) {
      const t   = i / capW;
      const col = lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t);
      fill(col);
      rect(capX + i, capY, 1, capH);
    }
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    noFill();
    rect(capX, capY, capW, capH, 3);
    stroke(this.theme.capIndicator);
    strokeWeight(1.5);
    line(cx, capY + 4, cx, capY + capH - 4);
    pop();
  }

  _drawHScale(ty, trackH) {
    const steps   = 5;
    const tickLen = 4;
    push();
    stroke(this.theme.scaleTick);
    strokeWeight(1);
    fill(this.theme.scaleText);
    textSize(7);
    textAlign(CENTER, TOP);
    if (this.theme.font) textFont(this.theme.font);
    for (let i = 0; i <= steps; i++) {
      const n  = i / steps;
      const tx = this._hTrackLeft() + n * this._hTrackLen();
      const by = ty + trackH / 2 + 2;
      line(tx, by, tx, by + tickLen);
      noStroke();
      text(nf(this._fromNorm(n), 1, 1), tx, by + tickLen + 1);
      stroke(this.theme.scaleTick);
    }
    pop();
  }

  _drawScale(cx, trackW) {
    const steps  = 5;
    const tickLen = 5;
    push();
    stroke(this.theme.scaleTick);
    strokeWeight(1);
    fill(this.theme.scaleText);
    textSize(7);
    textAlign(LEFT, CENTER);
    if (this.theme.font) textFont(this.theme.font);
    for (let i = 0; i <= steps; i++) {
      const n  = i / steps;
      const ty = this._trackBottom() - n * this._trackLen();
      const tx = cx + trackW / 2 + 2;
      line(tx, ty, tx + tickLen, ty);
      const label = nf(this._fromNorm(n), 1, 1);
      noStroke();
      text(label, tx + tickLen + 2, ty);
      stroke(this.theme.scaleTick);
    }
    pop();
  }

  _drawCap(cx, cy) {
    const capW  = this.width - 8;
    const capH  = this._capH;
    const capX  = cx - capW / 2;
    const capY  = cy - capH / 2;
    const r     = 3;

    push();
    // brushed-aluminum body gradient via stepped horizontal lines
    noStroke();
    for (let i = 0; i < capH; i++) {
      const t   = i / capH;
      const col = lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t);
      fill(col);
      rect(capX, capY + i, capW, 1);
    }
    // border
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    noFill();
    rect(capX, capY, capW, capH, r);

    // center indicator line
    stroke(this.theme.capIndicator);
    strokeWeight(1.5);
    line(capX + 4, cy, capX + capW - 4, cy);
    pop();
  }

  // ── input ─────────────────────────────────────────────────────────────────

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _capHit(mx, my) {
    if (this.style === 'wheel') {
      if (this.horizontal) {
        return mx >= this._hTrackLeft() && mx <= this._hTrackRight() &&
               my >= this.y && my <= this.y + this.height;
      }
      return mx >= this.x && mx <= this.x + this.width &&
             my >= this._trackTop() && my <= this._trackBottom();
    }
    if (this.horizontal) {
      const cx = this._hCapX();
      return abs(mx - cx) <= this._capH / 2 &&
             my >= this.y && my <= this.y + this.height;
    }
    const cy = this._capY();
    return abs(my - cy) <= this._capH / 2 &&
           mx >= this.x && mx <= this.x + this.width;
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._capHit(mouseX, mouseY)) {
      if (this._isDoubleClick()) {
        this._cancelSpring();
        this.value = this._springDefault;
        if (this.onChange) this.onChange(this.value);
        if (this.onRelease) this.onRelease(this.value);
        return;
      }
      this._cancelSpring();
      this._active    = true;
      this._dragStart = this.horizontal
        ? { mx: mouseX, value: this.value }
        : { my: mouseY, value: this.value };
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active    = false;
      this._dragStart = null;
      if (this.onRelease) this.onRelease(this.value);
      this._startSpring();
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);

    if (this._active && this._dragStart) {
      let normDelta;
      if (this.horizontal) {
        normDelta = (mouseX - this._dragStart.mx) / this._hTrackLen();
      } else {
        normDelta = (this._dragStart.my - mouseY) / this._trackLen();
      }
      const startNorm = this._norm(this._dragStart.value);
      const prev      = this.value;
      this.value      = this._fromNorm(startNorm + normDelta);
      if (this.value !== prev && this.onChange) this.onChange(this.value);
    }
  }

  mouseWheel(e) {
    if (this.disabled || !this._hovered) return;
    const delta   = e.deltaY ?? e.delta ?? 0;
    const prev    = this.value;
    const newNorm = constrain(this._norm() - delta * 0.001, 0, 1);
    this.value    = this._fromNorm(newNorm);
    if (this.value !== prev && this.onChange) this.onChange(this.value);
    return false; // prevent page scroll
  }
}

// ─── Dial ────────────────────────────────────────────────────────────────────

class Dial extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.size      = opts.size      ?? 70;
    this.readout   = opts.readout   ?? 'raw';
    this.decimals  = opts.decimals  ?? 2;
    this.showScale = opts.showScale ?? false;
    this.showKnob  = opts.showKnob  ?? true;
    this.style = opts.style ?? opts.dialStyle ?? 'classic'; // 'classic' | 'rubber' | 'grooved' | 'pointer'

    this.width  = this.size;
    this.height = this.size + 26;

    this._startAngle = 3 * Math.PI / 4;  // 7:30 o'clock (min)
    this._sweepAngle = 3 * Math.PI / 2;  // 270° clockwise sweep
    this._dragStart  = null;
  }

  // When showScale is true, the dial circle itself is drawn smaller to leave room for scale text
  _getDialSize() {
    return this.showScale ? this.size * 0.70 : this.size;
  }

  _cx()     { return this.x + this.size / 2; }
  _cy()     { return this.y + this.size / 2; }
  _arcR()   { return this._getDialSize() * 0.36; }
  _knobR()  { return this._arcR() - 6; }
  _panelH() { return this.size + 26; }

  _valueAngle() {
    return this._startAngle + this._norm() * this._sweepAngle;
  }

  _formatReadout() {
    const v = this.value;
    switch (this.readout) {
      case 'percent':
        return nf(this._norm() * 100, 1, 1) + '%';
      case 'db': {
        if (v <= this.min) return '-∞';
        const db = 20 * Math.log10(v / this.max);
        return nf(db, 1, 1) + ' dB';
      }
      default:
        return nf(v, 1, this.decimals);
    }
  }

  draw() {
    this._markDrawn();
    const cx = this._cx();
    const cy = this._cy();
    const { x, y, size: s } = this;
    const ph = this._panelH();

    this._drawPanel(x, y, s, ph);

    if (this._hovered && !this.disabled) {
      push();
      noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, s, ph, 4);
      pop();
    }

    if (this.showScale) this._drawDialScale(cx, cy);
    this._drawArcTrack(cx, cy);
    this._drawExtra(cx, cy);  // hook called between arc and knob
    if (this.showKnob) {
      switch (this.style) {
        case 'rubber':  this._drawRubberKnob(cx, cy);  break;
        case 'grooved': this._drawGroovedKnob(cx, cy); break;
        case 'pointer': this._drawPointerKnob(cx, cy); break;
        default:        this._drawKnob(cx, cy);
      }
    }

    this._drawLabel(cx, y + s + 2);
    this._drawReadout(cx, y + ph - 13, this._formatReadout());

    if (this._active) this._drawTooltip(cx, y + 4, this._formatReadout());
    if (this.disabled) this._drawDisabled(x, y, s, ph);
  }

  _drawExtra(_cx, _cy) {}  // no-op; subclasses draw between arc track and knob

  _drawArcTrack(cx, cy) {
    const r   = this._arcR();
    const end = this._startAngle + this._sweepAngle;
    push();
    angleMode(RADIANS);
    noFill();
    strokeCap(ROUND);
    stroke(this.theme.track);
    strokeWeight(4);
    arc(cx, cy, r * 2, r * 2, this._startAngle, end, OPEN);
    stroke(this.theme.capIndicator);
    strokeWeight(3);
    arc(cx, cy, r * 2, r * 2, this._startAngle, this._valueAngle(), OPEN);
    pop();
  }

  _drawKnob(cx, cy) {
    const r = this._knobR();
    push();
    noStroke();
    for (let i = 0; i < r * 2; i++) {
      const t   = i / (r * 2);
      const col = lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t);
      fill(col);
      const hw = Math.sqrt(Math.max(0, r * r - (i - r) * (i - r)));
      rect(cx - hw, cy - r + i, hw * 2, 1);
    }
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    noFill();
    ellipse(cx, cy, r * 2, r * 2);
    const a  = this._valueAngle();
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    stroke(this.theme.capIndicator);
    strokeWeight(2);
    line(cx + ca * (r * 0.35), cy + sa * (r * 0.35),
         cx + ca * (r * 0.82), cy + sa * (r * 0.82));
    pop();
  }

  // Rubber-rimmed knob: dark tactile ring around a metallic centre
  _drawRubberKnob(cx, cy) {
    const kr = this._knobR();
    const rr = kr + 4;  // rubber outer radius (fills gap to arc track)
    const a  = this._valueAngle();

    push();
    angleMode(RADIANS);
    // Dark rubber ring
    const rubberCol = lerpColor(color(this.theme.panelStroke), color(0, 0, 0), 0.72);
    noStroke();
    fill(rubberCol);
    ellipse(cx, cy, rr * 2, rr * 2);

    // Grip bumps — small rectangles at regular intervals around the rim
    const nBumps = 18;
    const bumpCol = lerpColor(rubberCol, color(0, 0, 0), 0.55);
    fill(bumpCol);
    for (let i = 0; i < nBumps; i++) {
      const ba  = (i / nBumps) * Math.PI * 2;
      const bca = Math.cos(ba), bsa = Math.sin(ba);
      const bx  = cx + bca * (rr - 2);
      const by  = cy + bsa * (rr - 2);
      push();
      translate(bx, by);
      rotate(ba);
      noStroke();
      fill(bumpCol);
      rect(-1.5, -3, 3, 6, 1);
      pop();
    }

    // Inner metallic knob
    noStroke();
    const ir = kr - 2;
    for (let i = 0; i < ir * 2; i++) {
      const t   = i / (ir * 2);
      const col = lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t);
      fill(col);
      const hw = Math.sqrt(Math.max(0, ir * ir - (i - ir) * (i - ir)));
      rect(cx - hw, cy - ir + i, hw * 2, 1);
    }
    stroke(lerpColor(color(this.theme.panelStroke), color(0, 0, 0), 0.4));
    strokeWeight(1);
    noFill();
    ellipse(cx, cy, ir * 2, ir * 2);

    // Indicator
    stroke(this.theme.capIndicator);
    strokeWeight(2);
    line(cx + Math.cos(a) * ir * 0.32, cy + Math.sin(a) * ir * 0.32,
         cx + Math.cos(a) * ir * 0.84, cy + Math.sin(a) * ir * 0.84);
    pop();
  }

  // Grooved/knurled knob: machined radial grooves over a gradient sphere
  _drawGroovedKnob(cx, cy) {
    const kr = this._knobR();
    const a  = this._valueAngle();

    push();
    // Base gradient sphere
    noStroke();
    for (let i = 0; i < kr * 2; i++) {
      const t   = i / (kr * 2);
      fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t));
      const hw = Math.sqrt(Math.max(0, kr * kr - (i - kr) * (i - kr)));
      rect(cx - hw, cy - kr + i, hw * 2, 1);
    }

    // Radial grooves — alternating shadow/highlight lines clipped to knob circle
    const gc = drawingContext;
    gc.save();
    gc.beginPath();
    gc.arc(cx, cy, kr, 0, Math.PI * 2);
    gc.clip();
    const nG = 26;
    for (let i = 0; i < nG; i++) {
      const ga  = (i / nG) * Math.PI * 2 + a;  // Rotate grooves with dial value
      const gr  = kr * 0.42; // grooves start at this radius from center
      gc.beginPath();
      gc.moveTo(cx + Math.cos(ga) * gr, cy + Math.sin(ga) * gr);
      gc.lineTo(cx + Math.cos(ga) * kr, cy + Math.sin(ga) * kr);
      gc.strokeStyle = i % 2 === 0 ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.20)';
      gc.lineWidth = 1.6;
      gc.stroke();
    }
    gc.restore();

    // Smooth centre hub drawn over groove area
    const hr = kr * 0.48;
    noStroke();
    for (let i = 0; i < hr * 2; i++) {
      const t   = i / (hr * 2);
      fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t * 0.65 + 0.18));
      const hw = Math.sqrt(Math.max(0, hr * hr - (i - hr) * (i - hr)));
      rect(cx - hw, cy - hr + i, hw * 2, 1);
    }

    // Knob border
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    noFill();
    ellipse(cx, cy, kr * 2, kr * 2);

    // Indicator line through grooves
    stroke(this.theme.capIndicator);
    strokeWeight(2);
    line(cx + Math.cos(a) * hr * 0.3, cy + Math.sin(a) * hr * 0.3,
         cx + Math.cos(a) * kr * 0.88, cy + Math.sin(a) * kr * 0.88);
    pop();
  }

  // Pointer/needle knob: no sphere — a large tapered pointer sweeps the arc
  _drawPointerKnob(cx, cy) {
    const kr  = this._knobR();
    const a   = this._valueAngle();
    const ca  = Math.cos(a), sa = Math.sin(a);
    // Perpendicular axis for pointer width
    const pca = Math.cos(a + Math.PI / 2), psa = Math.sin(a + Math.PI / 2);

    const tipX  = cx + ca * (kr * 0.92);
    const tipY  = cy + sa * (kr * 0.92);
    const baseX = cx - ca * (kr * 0.38);
    const baseY = cy - sa * (kr * 0.38);

    push();
    // Pointer body — tapered quadrilateral
    const tipW  = 1.5;
    const baseW = 5.5;
    fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), 0.32));
    stroke(this.theme.panelStroke);
    strokeWeight(0.75);
    beginShape();
    vertex(tipX  + pca * tipW,  tipY  + psa * tipW);
    vertex(tipX  - pca * tipW,  tipY  - psa * tipW);
    vertex(baseX - pca * baseW, baseY - psa * baseW);
    vertex(baseX + pca * baseW, baseY + psa * baseW);
    endShape(CLOSE);

    // Highlight sheen along one edge of the pointer
    stroke(lerpColor(color(this.theme.capHighlight), color(this.theme.panel), 0.28));
    strokeWeight(0.75);
    noFill();
    line(tipX + pca * 0.6,         tipY  + psa * 0.6,
         baseX + pca * (baseW * 0.35), baseY + psa * (baseW * 0.35));

    // Indicator accent on pointer tip
    noStroke();
    fill(this.theme.capIndicator);
    const dotR = 2.5;
    ellipse(tipX - ca * 4, tipY - sa * 4, dotR * 2, dotR * 2);

    // Centre pivot — layered discs
    noStroke();
    fill(lerpColor(color(this.theme.capShadow), color(0, 0, 0), 0.4));
    ellipse(cx, cy, 12, 12);
    fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), 0.25));
    ellipse(cx, cy, 8, 8);
    fill(this.theme.capIndicator);
    ellipse(cx, cy, 4, 4);
    pop();
  }

  _drawDialScale(cx, cy) {
    const steps = 5;
    const r     = this._arcR();
    push();
    stroke(this.theme.scaleTick);
    strokeWeight(1);
    fill(this.theme.scaleText);
    textSize(7);
    textAlign(CENTER, CENTER);
    if (this.theme.font) textFont(this.theme.font);
    for (let i = 0; i <= steps; i++) {
      const n  = i / steps;
      const a  = this._startAngle + n * this._sweepAngle;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      line(cx + ca * (r + 2), cy + sa * (r + 2),
           cx + ca * (r + 5), cy + sa * (r + 5));
      noStroke();
      text(nf(this._fromNorm(n), 1, this.decimals), cx + ca * (r + 10), cy + sa * (r + 10));
      stroke(this.theme.scaleTick);
    }
    pop();
  }

  _containsPoint(mx, my) {
    const dx = mx - this._cx();
    const dy = my - this._cy();
    return dx * dx + dy * dy <= (this._arcR() + 8) ** 2;
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._containsPoint(mouseX, mouseY)) {
      if (this._isDoubleClick()) {
        this._cancelSpring();
        this.value = this._springDefault;
        if (this.onChange) this.onChange(this.value);
        if (this.onRelease) this.onRelease(this.value);
        return;
      }
      this._cancelSpring();
      this._active    = true;
      this._dragStart = { my: mouseY, value: this.value };
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active    = false;
      this._dragStart = null;
      if (this.onRelease) this.onRelease(this.value);
      this._startSpring();
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (this._active && this._dragStart) {
      const dy        = this._dragStart.my - mouseY;
      const normDelta = dy / 150;
      const startNorm = this._norm(this._dragStart.value);
      const prev      = this.value;
      this.value      = this._fromNorm(startNorm + normDelta);
      if (this.value !== prev && this.onChange) this.onChange(this.value);
    }
  }

  mouseWheel(e) {
    if (this.disabled || !this._hovered) return;
    const prev    = this.value;
    const newNorm = constrain(this._norm() - e.delta * 0.001, 0, 1);
    this.value    = this._fromNorm(newNorm);
    if (this.value !== prev && this.onChange) this.onChange(this.value);
    return false;
  }
}

// ─── Switch ───────────────────────────────────────────────────────────────────

class Switch extends ProControl {
  constructor(opts = {}) {
    super(opts);
    // states: array of labels, e.g. ['OFF','ON'] or ['A','B','C']
    this.states   = opts.states   ?? ['OFF', 'ON'];
    this.state    = opts.state    ?? 0;           // index into states[]
    this.width    = opts.width    ?? 48;
    this.height   = opts.height   ?? (this.states.length > 2 ? this.states.length * 26 + 20 : 70);
    this.onChange = opts.onChange ?? null;        // called with (stateIndex, stateLabel)
    this._springDefault = opts.springDefault ?? this.state; // spring / reset target
  }

  _panelW() { return this.width; }
  _panelH() { return this.height + (this.label ? 14 : 0); }

  draw() {
    this._markDrawn();
    const { x, y, width: w } = this;
    const ph = this._panelH();
    const n  = this.states.length;

    this._drawPanel(x, y, w, ph);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow);
      rect(x, y, w, ph, 4); pop();
    }

    if (n === 2) {
      this._drawToggle(x, y, w, this.height);
    } else {
      this._drawSelector(x, y, w, this.height, n);
    }

    this._drawLabel(x + w / 2, y + this.height + 2);
    if (this.disabled) this._drawDisabled(x, y, w, ph);
  }

  // Two-state toggle: a rocker / illuminated button
  _drawToggle(x, y, w, h) {
    const on  = this.state === 1;
    const mid = y + h / 2;
    const pad = 6;
    const slotH = (h / 2) - pad - 2;

    push();
    // Off slot (top)
    const offActive = !on;
    fill(offActive ? color(this.theme.capIndicator) : this.theme.track);
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    rect(x + pad, y + pad, w - pad * 2, slotH, 3);

    // On slot (bottom)
    const onActive = on;
    fill(onActive ? color(this.theme.capIndicator) : this.theme.track);
    rect(x + pad, mid + 2, w - pad * 2, slotH, 3);

    // Glow on the active slot
    if (onActive || offActive) {
      const gc = drawingContext;
      gc.shadowBlur  = 10;
      gc.shadowColor = this.theme.capIndicator;
      fill(this.theme.capIndicator);
      noStroke();
      const gy = onActive ? mid + 2 : y + pad;
      rect(x + pad, gy, w - pad * 2, slotH, 3);
      gc.shadowBlur = 0;
    }

    // Labels
    noStroke();
    textSize(9);
    textAlign(CENTER, CENTER);
    fill(offActive ? this.theme.readoutBg : this.theme.scaleText);
    text(this.states[0], x + w / 2, y + pad + slotH / 2);
    fill(onActive ? this.theme.readoutBg : this.theme.scaleText);
    text(this.states[1], x + w / 2, mid + 2 + slotH / 2);
    pop();
  }

  // N-state selector: vertical stack of labeled buttons
  _drawSelector(x, y, w, h, n) {
    const itemH = h / n;
    const pad   = 4;

    push();
    for (let i = 0; i < n; i++) {
      const iy      = y + i * itemH;
      const active  = this.state === i;

      fill(active ? color(this.theme.capIndicator) : this.theme.track);
      stroke(this.theme.panelStroke);
      strokeWeight(1);
      rect(x + pad, iy + pad, w - pad * 2, itemH - pad * 2 - 1, 3);

      if (active) {
        const gc = drawingContext;
        gc.shadowBlur  = 8;
        gc.shadowColor = this.theme.capIndicator;
        fill(this.theme.capIndicator);
        noStroke();
        rect(x + pad, iy + pad, w - pad * 2, itemH - pad * 2 - 1, 3);
        gc.shadowBlur = 0;
      }

      noStroke();
      textSize(9);
      textAlign(CENTER, CENTER);
      fill(active ? this.theme.readoutBg : this.theme.scaleText);
      text(this.states[i], x + w / 2, iy + itemH / 2);
    }
    pop();
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _slotAt(mx, my) {
    if (!this._containsPoint(mx, my)) return -1;
    const n    = this.states.length;
    const slot = Math.floor((my - this.y) / (this.height / n));
    return slot < n ? slot : -1;
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
  }

  mousePressed() {
    if (this.disabled) return;
    const slot = this._slotAt(mouseX, mouseY);
    if (slot < 0) {
      // Label area: double-click resets to initial state
      const inLabel = this.label &&
                      mouseX >= this.x && mouseX <= this.x + this.width &&
                      mouseY >  this.y + this.height &&
                      mouseY <= this.y + this._panelH();
      if (inLabel && this._isDoubleClick()) {
        this._cancelSpring();
        this.state = this._springDefault;
        if (this.onChange) this.onChange({index: this.state, label: this.states[this.state]});
        if (this.onRelease) this.onRelease({index: this.state, label: this.states[this.state]});
      }
      return;
    }
    if (this._isDoubleClick()) {
      this._cancelSpring();
      this.state = this._springDefault;
      if (this.onChange) this.onChange({index: this.state, label: this.states[this.state]});
      if (this.onRelease) this.onRelease({index: this.state, label: this.states[this.state]});
      return;
    }
    this._cancelSpring();
    if (this.states.length === 2) {
      this.state = this.state === 0 ? 1 : 0;
    } else {
      this.state = slot;
    }
    if (this.onChange) this.onChange({index: this.state, label: this.states[this.state]});
    this._active = true;
  }

  mouseReleased() {
    if (this._active) {
      this._active = false;
      this._startSpring();
    }
  }

  // Spring for discrete state: snap back after springDuration seconds
  _startSpring() {
    if (!this.springBack) return;
    this._springActive  = true;
    this._springStartMs = millis();
  }

  _tickSpring() {
    if (!this._springActive) return;
    if ((millis() - this._springStartMs) / 1000 >= this.springDuration) {
      const prev = this.state;
      this.state = this._springDefault;
      this._springActive = false;
      if (this.state !== prev && this.onChange)
        this.onChange({index: this.state, label: this.states[this.state]});
    }
  }

  mouseWheel(_e)  {}
}

// ─── Export (global scope for p5 sketches) ───────────────────────────────────
window.ControlStyle       = ControlStyle;    // read-only reflection; set via ControlStyle = '...'
window.ProControlThemes      = ProControlThemes;
window.proControlBackground  = proControlBackground;
window.proControlReset       = proControlReset;
window.proControls         = function() { return [..._proControlRegistry]; };
window.proControlFullReset = function() { _proControlRegistry.length = 0; _drawnThisFrame.clear(); _proControlWasPressed = false; _proTouchActive = false; _proControlWired = false; Object.assign(_autoLayout, { nextX: 20, nextY: 20, rightEdge: 20 }); };
window.resetAutoLayout     = function() { Object.assign(_autoLayout, { nextX: 20, nextY: 20, rightEdge: 20 }); };
window.ProControl     = ProControl;
window.AnalogSlider      = AnalogSlider;
window.Switch            = Switch;
window.AnalogSwitch      = Switch;        // backward-compat alias
window.Dial              = Dial;



// ─── Shared utility ──────────────────────────────────────────────────────────
// Draw a raised-bevel panel around a group of controls (used by Multi- classes).
function _drawBevelGroup(theme, x, y, w, h) {
  const pad = 6;
  const bx = x - pad, by = y - pad;
  const bw = w + pad * 2, bh = h + pad * 2;
  const r  = 8;
  const hi = lerpColor(color(theme.panel), color(theme.capHighlight), 0.50);
  const sh = lerpColor(color(theme.panel), color(theme.panelStroke),  0.65);

  push();
  // Group background
  fill(lerpColor(color(theme.panel), color(theme.track), 0.18));
  stroke(theme.panelStroke);
  strokeWeight(1);
  rect(bx, by, bw, bh, r);
  // Top + left inner highlight
  stroke(hi);
  strokeWeight(1.5);
  noFill();
  line(bx + 3, by + bh - 3, bx + 3, by + 3);
  line(bx + 3, by + 3, bx + bw - 3, by + 3);
  // Bottom + right inner shadow
  stroke(sh);
  line(bx + bw - 3, by + 3, bx + bw - 3, by + bh - 3);
  line(bx + bw - 3, by + bh - 3, bx + 3, by + bh - 3);
  pop();
}

// Draws a bevelled title bar using the theme's cap colors — shared by Panel,
// MessageDialog, and any future control with a title bar.
// Handles clipping, gradient fill, bevel edge lines, separator, and label text.
// The caller is responsible for any additional overlays (e.g. toggle button).
function _drawBevelTitleBar(theme, x, y, w, titleH, minimized, labelText) {
  const gc = drawingContext;

  // Clip to title bar shape
  gc.save();
  gc.beginPath();
  if (minimized) {
    gc.roundRect
      ? gc.roundRect(x + 1, y + 1, w - 2, titleH - 2, 3)
      : gc.rect(x + 1, y + 1, w - 2, titleH - 2);
  } else {
    gc.roundRect
      ? gc.roundRect(x + 1, y + 1, w - 2, titleH - 1, [3, 3, 0, 0])
      : gc.rect(x + 1, y + 1, w - 2, titleH - 1);
  }
  gc.clip();

  // Base fill — accent color, matching a selected Switch option
  gc.fillStyle = theme.capIndicator;
  gc.fillRect(x, y, w, titleH);

  // Bevel gradient overlay: light at top, subtle shadow at bottom
  const grad = gc.createLinearGradient(x, y, x, y + titleH);
  grad.addColorStop(0,   'rgba(255,255,255,0.28)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.07)');
  grad.addColorStop(1,   'rgba(0,0,0,0.18)');
  gc.fillStyle = grad;
  gc.fillRect(x, y, w, titleH);

  // Top specular highlight
  gc.strokeStyle = 'rgba(255,255,255,0.40)';
  gc.lineWidth   = 1;
  gc.beginPath();
  gc.moveTo(x + 2, y + 1.5);
  gc.lineTo(x + w - 2, y + 1.5);
  gc.stroke();

  // Bottom shadow line
  gc.strokeStyle = 'rgba(0,0,0,0.22)';
  gc.beginPath();
  gc.moveTo(x + 2, y + titleH - 1.5);
  gc.lineTo(x + w - 2, y + titleH - 1.5);
  gc.stroke();

  gc.restore();

  // Separator below bar (only when expanded)
  if (!minimized) {
    push();
    stroke(theme.panelStroke);
    strokeWeight(1);
    line(x, y + titleH, x + w, y + titleH);
    pop();
  }

  // Label text
  if (labelText) {
    push();
    noStroke();
    fill(theme.readoutBg);
    textSize(10);
    textAlign(CENTER, CENTER);
    if (theme.font) textFont(theme.font);
    text(labelText, x + w / 2, y + titleH / 2);
    pop();
  }
}

// Shared word-wrap for dialog message areas.  Call inside push/pop with the
// desired textSize already set so textWidth() measures correctly.
function _dialogWrapText(str, maxW) {
  if (!str) return [];
  const lines = [];
  for (const para of str.split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (!line || textWidth(test) <= maxW) {
        line = test;
      } else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

// ─── VUMeter ─────────────────────────────────────────────────────────────────
// Extends Slider: draws the full fader, then overlays a segmented LED column.
// The LED column reflects `this.value` directly; drive it from audio analysis.

class VUMeter extends AnalogSlider {
  constructor(opts = {}) {
    super(Object.assign({
      readout: 'db',
      showScale: false,
      min: 0,
      max: 1,
    }, opts));

    this.segCount    = opts.segCount ?? 20;
    this.colorLow    = opts.colorLow    ?? '#00cc44';
    this.colorMid    = opts.colorMid    ?? '#cccc00';
    this.colorHigh   = opts.colorHigh   ?? '#cc2200';
    this.meterWidth  = opts.meterWidth  ?? 8;
    this._peak       = 0;
    this._peakHold   = 0; // frames
  }

  draw() {
    super.draw();
    this._drawVU();
  }

  _drawVU() {
    const cx     = this._trackX() - this.meterWidth - 4; // left of track
    const top    = this._trackTop();
    const bot    = this._trackBottom();
    const len    = bot - top;
    const segH   = (len / this.segCount) - 1;
    const lit    = Math.round(this._norm() * this.segCount);

    // peak hold
    if (this._norm() >= this._peak) {
      this._peak    = this._norm();
      this._peakHold = 45;
    } else {
      this._peakHold--;
      if (this._peakHold <= 0) this._peak = max(this._peak - 0.005, 0);
    }

    push();
    noStroke();
    for (let i = 0; i < this.segCount; i++) {
      const segY  = bot - (i + 1) * (segH + 1);
      const segN  = i / this.segCount;
      let col;
      if (segN < 0.6)      col = this.colorLow;
      else if (segN < 0.85) col = this.colorMid;
      else                  col = this.colorHigh;

      fill(i < lit ? col : color(col + '33'));
      rect(cx, segY, this.meterWidth, segH, 1);
    }

    // peak indicator
    const peakSeg = Math.round(this._peak * this.segCount);
    if (peakSeg > 0) {
      const peakY = bot - peakSeg * (segH + 1);
      const pN    = (peakSeg - 1) / this.segCount;
      let pcol    = pN < 0.6 ? this.colorLow : pN < 0.85 ? this.colorMid : this.colorHigh;
      fill(pcol);
      rect(cx, peakY, this.meterWidth, segH, 1);
    }
    pop();
  }
}

// ─── XYPad ───────────────────────────────────────────────────────────────────
// Extends ProControl directly — no fader involved.
// Exposes valueX / valueY and fires onChangeX / onChangeY.

class XYPad extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.width  = opts.width  ?? 160;
    this.height = opts.height ?? 160;
    this.minX   = opts.minX  ?? this.min;
    this.maxX   = opts.maxX  ?? this.max;
    this.minY   = opts.minY  ?? this.min;
    this.maxY   = opts.maxY  ?? this.max;
    this._valueX = opts.valueX ?? (this.minX + this.maxX) / 2;
    this._valueY = opts.valueY ?? (this.minY + this.maxY) / 2;
    this.scaleX    = opts.scaleX    ?? 'linear'; // 'linear' | 'log' (log requires minX > 0)
    this.scaleY    = opts.scaleY    ?? 'linear'; // 'linear' | 'log' (log requires minY > 0)
    this.onChangeX = opts.onChangeX ?? null;
    this.onChangeY = opts.onChangeY ?? null;
    this.crosshairColor = opts.crosshairColor ?? this.theme.capIndicator;
    this._pad = 10;
    this._springDefaultX = opts.springDefaultX ?? (this.minX + this.maxX) / 2;
    this._springDefaultY = opts.springDefaultY ?? (this.minY + this.maxY) / 2;
  }

  get valueX() { return this._valueX; }
  set valueX(v) {
    this._valueX = Math.min(Math.max(v, this.minX), this.maxX);
    this._startSpring();
  }

  get valueY() { return this._valueY; }
  set valueY(v) {
    this._valueY = Math.min(Math.max(v, this.minY), this.maxY);
    this._startSpring();
  }

  _normX() {
    if (this.scaleX === 'log') return Math.log(this.valueX / this.minX) / Math.log(this.maxX / this.minX);
    return (this.valueX - this.minX) / (this.maxX - this.minX);
  }

  _normY() {
    if (this.scaleY === 'log') return Math.log(this.valueY / this.minY) / Math.log(this.maxY / this.minY);
    return (this.valueY - this.minY) / (this.maxY - this.minY);
  }

  _innerX() { return this.x + this._pad; }
  _innerY() { return this.y + this._pad; }
  _innerW() { return this.width  - this._pad * 2; }
  _innerH() { return this.height - this._pad * 2; }

  _dotX() { return this._innerX() + this._normX() * this._innerW(); }
  _dotY() { return this._innerY() + (1 - this._normY()) * this._innerH(); }

  draw() {
    this._markDrawn();
    const { x, y, width: w, height: h } = this;
    this._drawPanel(x, y, w, h);

    if (ControlStyle === 'dimpled') {
      const gc = drawingContext;
      const spacing = 7;
      const r = 1.4;
      gc.save();
      gc.beginPath();
      gc.roundRect(x, y, w, h, 4);
      gc.clip();
      let row = 0;
      for (let gy = spacing / 2; gy < y + h; gy += spacing) {
        const xOff = (row % 2 === 1) ? spacing / 2 : 0;
        for (let gx = x + spacing / 2 + xOff; gx < x + w + spacing; gx += spacing) {
          gc.beginPath();
          gc.arc(gx, gy, r, 0, Math.PI * 2);
          gc.fillStyle = 'rgba(0,0,0,0.18)';
          gc.fill();
          gc.beginPath();
          gc.arc(gx - 0.6, gy - 0.6, r * 0.5, 0, Math.PI * 2);
          gc.fillStyle = 'rgba(255,255,255,0.20)';
          gc.fill();
        }
        row++;
      }
      gc.restore();
    }

    if (this._hovered && !this.disabled) {
      push();
      noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    // grid lines
    push();
    stroke(this.theme.scaleTick);
    strokeWeight(1);
    const gx = this._dotX();
    const gy = this._dotY();
    line(this._innerX(), gy, this._innerX() + this._innerW(), gy);
    line(gx, this._innerY(), gx, this._innerY() + this._innerH());
    pop();

    // dot
    push();
    noStroke();
    fill(this.crosshairColor);
    ellipse(gx, gy, 10, 10);
    fill(this.theme.panel);
    ellipse(gx, gy, 4, 4);
    pop();

    // readouts
    const rx = nf(this.valueX, 1, 2);
    const ry = nf(this.valueY, 1, 2);
    this._drawReadout(x + w / 2, y + h - 14, rx + '  /  ' + ry);
    this._drawLabel(x + w / 2, y + 3);

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._containsPoint(mouseX, mouseY)) {
      if (this._isDoubleClick()) {
        this._cancelSpring();
        this._valueX = this._springDefaultX;
        this._valueY = this._springDefaultY;
        if (this.onChangeX) this.onChangeX(this._valueX);
        if (this.onChangeY) this.onChangeY(this._valueY);
        if (this.onChange) this.onChange({x: this._valueX, y: this._valueY});
        if (this.onRelease) this.onRelease({x: this._valueX, y: this._valueY});
        return;
      }
      this._cancelSpring();
      this._active = true;
      this._updateXY(mouseX, mouseY);
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active = false;
      if (this.onRelease) this.onRelease({x: this.valueX, y: this.valueY});
      this._startSpring();
    }
  }

  _startSpring() {
    if (!this.springBack) return;
    this._springActive  = true;
    this._springStartMs = millis();
    this._springFromX   = this.valueX;
    this._springFromY   = this.valueY;
  }

  _tickSpring() {
    if (!this._springActive) return;
    const t    = Math.min((millis() - this._springStartMs) / 1000 / this.springDuration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    this._valueX = lerp(this._springFromX, this._springDefaultX, ease);
    this._valueY = lerp(this._springFromY, this._springDefaultY, ease);
    if (this.onChange)  this.onChange({x: this._valueX, y: this._valueY});
    if (this.onChangeX) this.onChangeX(this._valueX);
    if (this.onChangeY) this.onChangeY(this._valueY);
    if (t >= 1) {
      this._valueX = this._springDefaultX;
      this._valueY = this._springDefaultY;
      this._springActive = false;
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (this._active) this._updateXY(mouseX, mouseY);
  }

  _updateXY(mx, my) {
    const nx = constrain((mx - this._innerX()) / this._innerW(), 0, 1);
    const ny = constrain(1 - (my - this._innerY()) / this._innerH(), 0, 1);
    const prevX = this._valueX;
    const prevY = this._valueY;
    this._valueX = this.scaleX === 'log'
      ? this.minX * Math.pow(this.maxX / this.minX, nx)
      : this.minX + nx * (this.maxX - this.minX);
    this._valueY = this.scaleY === 'log'
      ? this.minY * Math.pow(this.maxY / this.minY, ny)
      : this.minY + ny * (this.maxY - this.minY);
    if (this._valueX !== prevX && this.onChangeX) this.onChangeX(this._valueX);
    if (this._valueY !== prevY && this.onChangeY) this.onChangeY(this._valueY);
    if ((this._valueX !== prevX || this._valueY !== prevY) && this.onChange)
      this.onChange({x: this._valueX, y: this._valueY});
  }
}

// ─── VUDial ──────────────────────────────────────────────────────────────────
// Extends Dial: replaces the filled arc with a segmented LED ring.
// Drive it from audio analysis by setting `this.value`.

class VUDial extends Dial {
  constructor(opts = {}) {
    super(Object.assign({
      readout: 'db',
      showScale: false,
      min: 0,
      max: 1,
    }, opts));

    this.segCount  = opts.segCount  ?? 24;
    this.colorLow  = opts.colorLow  ?? '#00cc44';
    this.colorMid  = opts.colorMid  ?? '#cccc00';
    this.colorHigh = opts.colorHigh ?? '#cc2200';
    this._peak     = 0;
    this._peakHold = 0;
  }

  // background track only — LED ring handles the lit portion
  _drawArcTrack(cx, cy) {
    const r   = this._arcR();
    const end = this._startAngle + this._sweepAngle;
    push();
    angleMode(RADIANS);
    noFill();
    strokeCap(ROUND);
    stroke(this.theme.track);
    strokeWeight(4);
    arc(cx, cy, r * 2, r * 2, this._startAngle, end, OPEN);
    pop();
  }

  _drawExtra(cx, cy) {
    const r          = this._arcR();
    const totalAngle = this._sweepAngle;
    const gapAngle   = 0.025;
    const segAngle   = (totalAngle / this.segCount) - gapAngle;
    const lit        = Math.round(this._norm() * this.segCount);

    // peak hold
    if (this._norm() >= this._peak) {
      this._peak     = this._norm();
      this._peakHold = 45;
    } else {
      this._peakHold--;
      if (this._peakHold <= 0) this._peak = max(this._peak - 0.005, 0);
    }

    push();
    angleMode(RADIANS);
    noFill();
    strokeWeight(3);
    strokeCap(SQUARE);
    for (let i = 0; i < this.segCount; i++) {
      const segN     = i / this.segCount;
      const segStart = this._startAngle + i * (totalAngle / this.segCount) + gapAngle / 2;
      const segEnd   = segStart + segAngle;
      let col;
      if (segN < 0.6)       col = this.colorLow;
      else if (segN < 0.85) col = this.colorMid;
      else                  col = this.colorHigh;
      stroke(i < lit ? col : color(col + '33'));
      arc(cx, cy, r * 2, r * 2, segStart, segEnd, OPEN);
    }

    // peak indicator segment
    const peakSeg = Math.round(this._peak * this.segCount);
    if (peakSeg > 0 && peakSeg <= this.segCount) {
      const pi_    = peakSeg - 1;
      const pN     = pi_ / this.segCount;
      const pcol   = pN < 0.6 ? this.colorLow : pN < 0.85 ? this.colorMid : this.colorHigh;
      const pStart = this._startAngle + pi_ * (totalAngle / this.segCount) + gapAngle / 2;
      stroke(pcol);
      arc(cx, cy, r * 2, r * 2, pStart, pStart + segAngle, OPEN);
    }
    pop();
  }
}

// ─── LEDMeter ────────────────────────────────────────────────────────────────
// Classic 7-segment numeric display. Set `value` each frame to drive it.
// Segments are drawn as beveled hexagons with a canvas shadow glow.

const _LED_SEGS = {
  //        a  b  c  d  e  f  g
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
  '-': [0, 0, 0, 0, 0, 0, 1],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

class LEDMeter extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.digits    = opts.digits    ?? 5;
    this.decimals  = opts.decimals  ?? 2;
    this.readout   = opts.readout   ?? 'raw';
    this.digitW    = opts.digitW    ?? 14;
    this.digitH    = opts.digitH    ?? 26;
    this.digitGap  = opts.digitGap  ?? 4;
    this.ledColor  = opts.ledColor  ?? null;  // null = theme.capIndicator
    this._pad      = 10;
    this._segT     = Math.max(2, Math.round(this.digitH / 9));
  }

  _panelW() {
    return this._pad * 2 + this.digits * this.digitW + (this.digits - 1) * this.digitGap;
  }

  _panelH() {
    return this._pad * 2 + this.digitH + (this.label ? 14 : 0);
  }

  _formatValue() {
    switch (this.readout) {
      case 'percent':
        return nf(this._norm() * 100, 1, this.decimals);
      case 'db': {
        if (this.value <= this.min) return nf(-99, 1, this.decimals);
        return nf(20 * Math.log10(this.value / this.max), 1, this.decimals);
      }
      default:
        return nf(this.value, 1, this.decimals);
    }
  }

  draw() {
    this._markDrawn();
    const { x, y } = this;
    const pw = this._panelW();
    const ph = this._panelH();

    this._drawPanel(x, y, pw, ph);

    const onColor  = this.ledColor ?? this.theme.capIndicator;
    const offColor = this._dimColor(onColor);
    const chars    = this._parseStr(this._formatValue());

    // right-align within digit slots; overflow → all dashes
    let slots;
    if (chars.length > this.digits) {
      slots = Array(this.digits).fill({ char: '-', dot: false });
    } else {
      slots = Array(this.digits).fill(null);
      const offset = this.digits - chars.length;
      for (let i = 0; i < chars.length; i++) slots[offset + i] = chars[i];
    }

    push();
    noStroke();
    for (let i = 0; i < this.digits; i++) {
      const dx = x + this._pad + i * (this.digitW + this.digitGap);
      const dy = y + this._pad;
      const s  = slots[i] ?? { char: ' ', dot: false };
      this._drawDigit(dx, dy, s.char, s.dot, onColor, offColor);
    }
    drawingContext.shadowBlur = 0;  // ensure glow is cleared after last digit
    pop();

    if (this.label) this._drawLabel(x + pw / 2, y + ph - 13);
    if (this.disabled) this._drawDisabled(x, y, pw, ph);
  }

  _dimColor(hexStr) {
    return lerpColor(color(this.theme.panel), color(hexStr), 0.18);
  }

  _parseStr(str) {
    const out = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '.') {
        if (out.length > 0) out[out.length - 1].dot = true;
      } else {
        out.push({ char: str[i], dot: false });
      }
    }
    return out;
  }

  _drawDigit(x, y, ch, dot, onColor, offColor) {
    const w    = this.digitW;
    const h    = this.digitH;
    const t    = this._segT;
    const bv   = Math.max(1, t >> 1);
    const half = Math.floor(h / 2);
    const vLen = half - t - 2;
    const hW   = w - t * 2 - 2;
    const segs = _LED_SEGS[ch] ?? _LED_SEGS[' '];
    const gc   = drawingContext;

    const drawH = (on, sx, sy, sw) => {
      gc.shadowBlur   = on ? 8 : 0;
      gc.shadowColor  = onColor;
      fill(on ? onColor : offColor);
      beginShape();
      vertex(sx + bv,      sy);
      vertex(sx + sw - bv, sy);
      vertex(sx + sw,      sy + t / 2);
      vertex(sx + sw - bv, sy + t);
      vertex(sx + bv,      sy + t);
      vertex(sx,           sy + t / 2);
      endShape(CLOSE);
    };

    const drawV = (on, sx, sy, sh) => {
      gc.shadowBlur  = on ? 8 : 0;
      gc.shadowColor = onColor;
      fill(on ? onColor : offColor);
      beginShape();
      vertex(sx + t / 2, sy);
      vertex(sx + t,     sy + bv);
      vertex(sx + t,     sy + sh - bv);
      vertex(sx + t / 2, sy + sh);
      vertex(sx,         sy + sh - bv);
      vertex(sx,         sy + bv);
      endShape(CLOSE);
    };

    drawH(segs[0], x + t + 1,  y,              hW);   // a — top
    drawV(segs[1], x + w - t,  y + t + 1,      vLen); // b — top-right
    drawV(segs[2], x + w - t,  y + half + 1,   vLen); // c — bottom-right
    drawH(segs[3], x + t + 1,  y + h - t,      hW);   // d — bottom
    drawV(segs[4], x,           y + half + 1,   vLen); // e — bottom-left
    drawV(segs[5], x,           y + t + 1,      vLen); // f — top-left
    drawH(segs[6], x + t + 1,  y + half - bv,  hW);   // g — middle

    if (dot) {
      const ds = t * 1.4;
      gc.shadowBlur  = 8;
      gc.shadowColor = onColor;
      fill(onColor);
      ellipse(x + w + this.digitGap / 2, y + h - ds / 2, ds, ds);
    }
  }
}

// ─── ADSRDisplay ─────────────────────────────────────────────────────────────
// Display-only ADSR envelope graph drawn inside a beveled panel.
// Attack / Decay / Release are relative time values; Sustain is amplitude 0–1.
// Set any property at any time; the graph redraws each frame automatically.

class ADSRDisplay extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.attack        = opts.attack        ?? 0.1;
    this.decay         = opts.decay         ?? 0.2;
    this.sustain       = opts.sustain       ?? 0.7;   // amplitude 0–1
    this.release       = opts.release       ?? 0.3;
    this.width         = opts.width         ?? 220;
    this.height        = opts.height        ?? 120;
    this.envelopeColor = opts.envelopeColor ?? null;  // null → theme.capIndicator
  }

  draw() {
    this._markDrawn();
    const { x, y } = this;
    const pw = this.width;
    const ph = this.height;
    this._drawPanel(x, y, pw, ph);

    const pad    = 8;
    const labelH = this.label ? 14 : 0;
    const tickH  = 14;                           // row for A D S R labels
    const plotW  = pw - pad * 2;
    const plotH  = ph - pad * 2 - tickH - labelH;
    const px     = x + pad;
    const py     = y + pad;
    const lineC  = this.envelopeColor ?? this.theme.capIndicator;

    const A = Math.max(0.001, this.attack);
    const D = Math.max(0.001, this.decay);
    const S = constrain(this.sustain, 0, 1);
    const R = Math.max(0.001, this.release);
    const totalADR = A + D + R;

    // 70% of width shared proportionally by A+D+R; 30% = fixed sustain hold
    const aDRW   = plotW * 0.70;
    const sHoldW = plotW - aDRW;
    const ax = (A / totalADR) * aDRW;
    const dx = (D / totalADR) * aDRW;
    const rx = (R / totalADR) * aDRW;

    const bot  = py + plotH;
    const top  = py;
    const susY = py + (1 - S) * plotH;

    const pts = [
      [px,                         bot],
      [px + ax,                    top],
      [px + ax + dx,               susY],
      [px + ax + dx + sHoldW,      susY],
      [px + ax + dx + sHoldW + rx, bot],
    ];

    const gc  = drawingContext;
    const col = color(lineC);
    gc.save();

    // Gradient fill under the curve
    gc.beginPath();
    gc.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) gc.lineTo(pts[i][0], pts[i][1]);
    gc.closePath();
    const grad = gc.createLinearGradient(px, top, px, bot);
    grad.addColorStop(0, `rgba(${red(col)},${green(col)},${blue(col)},0.30)`);
    grad.addColorStop(1, `rgba(${red(col)},${green(col)},${blue(col)},0.04)`);
    gc.fillStyle = grad;
    gc.fill();

    // Envelope line with glow
    gc.beginPath();
    gc.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) gc.lineTo(pts[i][0], pts[i][1]);
    gc.shadowBlur  = 5;
    gc.shadowColor = lineC;
    gc.strokeStyle = lineC;
    gc.lineWidth   = 1.5;
    gc.lineJoin    = 'round';
    gc.stroke();
    gc.shadowBlur  = 0;

    // Dashed section dividers at A / A+D / A+D+S boundaries
    gc.setLineDash([2, 3]);
    gc.strokeStyle = this.theme.scaleTick;
    gc.lineWidth   = 1;
    for (const dvx of [px + ax, px + ax + dx, px + ax + dx + sHoldW]) {
      gc.beginPath(); gc.moveTo(dvx, top); gc.lineTo(dvx, bot); gc.stroke();
    }
    gc.setLineDash([]);
    gc.restore();

    // A / D / S / R labels centred in each section
    const tickY = py + plotH + 2;
    push();
    textSize(8);
    textFont(this.theme.font || 'sans-serif');
    textAlign(CENTER, TOP);
    fill(this.theme.scaleText);
    noStroke();
    text('A', px + ax / 2,                    tickY);
    text('D', px + ax + dx / 2,               tickY);
    text('S', px + ax + dx + sHoldW / 2,      tickY);
    text('R', px + ax + dx + sHoldW + rx / 2, tickY);
    pop();

    if (this.label) this._drawLabel(x + pw / 2, y + ph - labelH + 1);
    if (this.disabled) this._drawDisabled(x, y, pw, ph);
  }
}

// ─── Selector ────────────────────────────────────────────────────────────────
// Mechanical drum-style selector. Drag up/down on the control (or use the
// scroll wheel) to cycle through options. A gear wheel on the right rotates
// as you scroll. Only the selected option is fully visible at rest; adjacent
// options peek in at the drum edges during a drag.

class Selector extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.options       = opts.options       ?? ['A', 'B', 'C'];
    this.state         = opts.state         ?? 0;
    this.style = opts.style ?? opts.selectorStyle ?? 'rotary'; // 'rotary' | 'arrow'
    this.width         = opts.width         ?? 140;
    this.height        = opts.height        ?? 40;

    // rotary-specific
    this._gearAngle    = 0;
    this._drumOffset   = 0;
    this._dragY        = null;
    this._stateAtDrag  = 0;
    this._angleAtDrag  = 0;

    // arrow-specific
    this._slideOffset  = 0;    // px; eases to 0 after each state change
    this._slideDir     = 1;    // direction of last change (+1 / -1)
    this._prevState    = null; // outgoing option index while animating
    this._arrowHover   = null; // 'left' | 'right' | null

    this._springDefault = opts.springDefault ?? this.state;
  }

  // ── geometry ───────────────────────────────────────────────────────────────

  _teethW()   { return Math.max(14, Math.round(this.height * 0.28)); }
  _dispW()    { return this.width - this._teethW() - 9; }
  _panelH()   { return this.height + (this.label ? 16 : 4); }
  _spacing()  { return Math.round((this.height - 4) * 0.62); }
  _pxPerStep(){ return this._spacing(); }
  _arrowW()   { return 28; }

  // ── drawing ────────────────────────────────────────────────────────────────

  draw() {
    this._markDrawn();
    if (this.style === 'arrow') {
      this._drawArrow();
    } else {
      this._drawRotaryFrame();
    }
  }

  _drawRotaryFrame() {
    // Ease drum offset toward 0 when not actively dragging (click animation)
    if (!this._active && this._drumOffset !== 0) {
      this._drumOffset = Math.abs(this._drumOffset) > 0.4
        ? lerp(this._drumOffset, 0, 0.28)
        : 0;
    }

    const { x, y } = this;
    const panelH = this._panelH();
    const dispW  = this._dispW();
    const tw     = this._teethW();
    const tx     = x + dispW + 7;

    this._drawPanel(x, y, this.width, panelH);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow);
      rect(x, y, this.width, panelH, 4); pop();
    }

    this._drawDrum(x + 3, y + 2, dispW, this.height - 4);
    this._drawTeeth(tx, y + 2, tw, this.height - 4);

    if (this.label) this._drawLabel(x + this.width / 2, y + panelH - 14);
    if (this.disabled) this._drawDisabled(x, y, this.width, panelH);
  }

  _drawArrow() {
    // Ease slide animation
    if (Math.abs(this._slideOffset) > 0.5) {
      this._slideOffset = lerp(this._slideOffset, 0, 0.14);
    } else {
      this._slideOffset = 0;
      this._prevState   = null;
    }

    const { x, y } = this;
    const ph   = this._panelH();
    const aw   = this._arrowW();
    const cy   = y + this.height / 2;
    const dispX = x + aw;
    const dispW = this.width - aw * 2;
    const cx   = dispX + dispW / 2;
    const gc   = drawingContext;

    this._drawPanel(x, y, this.width, ph);

    // Display window background
    push();
    noStroke();
    fill(this.theme.track);
    rect(dispX, y + 2, dispW, this.height - 4, 2);
    pop();

    // Arrow zone hover glow
    const lHit = this._arrowHover === 'left'  && !this.disabled;
    const rHit = this._arrowHover === 'right' && !this.disabled;
    if (lHit) {
      push(); noStroke(); fill(this.theme.hoverGlow);
      rect(x, y, aw, this.height, 4); pop();
    }
    if (rHit) {
      push(); noStroke(); fill(this.theme.hoverGlow);
      rect(x + this.width - aw, y, aw, this.height, 4); pop();
    }

    // Separators between arrow zones and display
    push();
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    line(dispX,        y + 4, dispX,        y + this.height - 4);
    line(dispX + dispW, y + 4, dispX + dispW, y + this.height - 4);
    pop();

    // Left arrow ◀
    const as = 5;
    push(); noStroke();
    fill(lHit ? this.theme.capIndicator : this.theme.scaleText);
    const lax = x + aw / 2;
    beginShape();
    vertex(lax - as, cy);
    vertex(lax + as, cy - as);
    vertex(lax + as, cy + as);
    endShape(CLOSE);
    pop();

    // Right arrow ▶
    push(); noStroke();
    fill(rHit ? this.theme.capIndicator : this.theme.scaleText);
    const rax = x + this.width - aw / 2;
    beginShape();
    vertex(rax + as, cy);
    vertex(rax - as, cy - as);
    vertex(rax - as, cy + as);
    endShape(CLOSE);
    pop();

    // Selected option text — clipped to display zone with slide offset
    gc.save();
    gc.beginPath();
    gc.rect(dispX, y, dispW, this.height);
    gc.clip();
    push();
    noStroke();
    const rdC = color(this.theme.readout);
    fill(red(rdC), green(rdC), blue(rdC));
    textSize(13);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    if (this.theme.font) textFont(this.theme.font);
    text(this.options[this.state], cx + this._slideOffset, cy);
    if (this._prevState !== null) {
      text(this.options[this._prevState], cx + this._slideOffset + this._slideDir * dispW, cy);
    }
    pop();
    gc.restore();

    // Progress indicator — one segment per option, lit segment = current state
    const n        = this.options.length;
    const segGap   = 2;
    const segH     = 3;
    const segAreaW = dispW - 8;
    const segW     = Math.max(2, (segAreaW - (n - 1) * segGap) / n);
    const segY     = y + this.height - segH - 4;
    const litC     = color(this.theme.readout);
    push();
    noStroke();
    for (let i = 0; i < n; i++) {
      const sx = dispX + 4 + i * (segW + segGap);
      fill(i === this.state
        ? litC
        : color(red(litC), green(litC), blue(litC), 65));
      rect(sx, segY, segW, segH, 1);
    }
    pop();

    if (this.label) this._drawLabel(x + this.width / 2, y + ph - 14);
    if (this.disabled) this._drawDisabled(x, y, this.width, ph);
  }

  _drawDrum(dx, dy, dw, dh) {
    const n   = this.options.length;
    const cx  = dx + dw / 2;
    const cy  = dy + dh / 2;
    const off = this._drumOffset;
    const gc  = drawingContext;

    // ── clipped region ───────────────────────────────────────────────────────
    gc.save();
    gc.beginPath();
    if (gc.roundRect) gc.roundRect(dx, dy, dw, dh, 2);
    else              gc.rect(dx, dy, dw, dh);
    gc.clip();

    // Dark drum background
    const bgC = color(this.theme.track);
    const br  = red(bgC) | 0, bgG = green(bgC) | 0, bb = blue(bgC) | 0;
    gc.fillStyle = `rgb(${br},${bgG},${bb})`;
    gc.fillRect(dx, dy, dw, dh);

    // Items: prev / current / next.
    // Spacing < dh keeps adjacent items within (or just outside) the window at all
    // times, so they scroll into view immediately when the drum starts moving.
    const spacing = Math.round(dh * 0.62);
    const rdC = color(this.theme.readout);
    const rr  = red(rdC) | 0, rg = green(rdC) | 0, rb = blue(rdC) | 0;
    gc.textAlign    = 'center';
    gc.textBaseline = 'middle';
    for (let di = -1; di <= 1; di++) {
      const idx = ((this.state + di) % n + n) % n;
      const iy  = cy + di * spacing + off;
      if (iy < dy - spacing || iy > dy + dh + spacing) continue;
      if (di === 0) {
        gc.fillStyle = `rgba(${rr},${rg},${rb},1)`;
        gc.font      = 'bold 13px sans-serif';
      } else {
        gc.fillStyle = `rgba(${rr},${rg},${rb},0.35)`;
        gc.font      = '10px sans-serif';
      }
      gc.fillText(this.options[idx], cx, iy);
    }

    // Top/bottom gradient fade — simulates curved drum surface
    const fadH = dh * 0.38;
    const topG = gc.createLinearGradient(0, dy, 0, dy + fadH);
    topG.addColorStop(0, `rgba(${br},${bgG},${bb},1)`);
    topG.addColorStop(1, `rgba(${br},${bgG},${bb},0)`);
    gc.fillStyle = topG;
    gc.fillRect(dx, dy, dw, fadH);

    const botG = gc.createLinearGradient(0, dy + dh - fadH, 0, dy + dh);
    botG.addColorStop(0, `rgba(${br},${bgG},${bb},0)`);
    botG.addColorStop(1, `rgba(${br},${bgG},${bb},1)`);
    gc.fillStyle = botG;
    gc.fillRect(dx, dy + dh - fadH, dw, fadH);

    gc.restore();
    // ── end clip ─────────────────────────────────────────────────────────────

    // Window frame
    push();
    noFill();
    stroke(this.theme.trackStroke);
    strokeWeight(1.5);
    rect(dx, dy, dw, dh, 2);

    // Selection-zone bracket lines flanking the current item
    const lh = dh * 0.27;
    stroke(this.theme.capIndicator);
    strokeWeight(0.75);
    line(dx + 4, cy - lh, dx + dw - 4, cy - lh);
    line(dx + 4, cy + lh, dx + dw - 4, cy + lh);
    pop();
  }

  _drawTeeth(tx, ty, tw, th) {
    const gc = drawingContext;
    const n  = this.options.length;

    gc.save();
    gc.beginPath();
    gc.rect(tx, ty, tw, th);
    gc.clip();

    // Background — slightly darker than the panel
    const bgC = color(this.theme.panel);
    const br  = Math.max(0, (red(bgC)   | 0) - 12);
    const bg_ = Math.max(0, (green(bgC) | 0) - 12);
    const bb  = Math.max(0, (blue(bgC)  | 0) - 12);
    gc.fillStyle = `rgb(${br},${bg_},${bb})`;
    gc.fillRect(tx, ty, tw, th);

    // Segments — one per option, current state lit
    const segGap   = 2;
    const segAreaH = th - 2;
    const segH     = Math.max(1, (segAreaH - (n - 1) * segGap) / n);
    const litC     = color(this.theme.capIndicator);
    const lr = red(litC) | 0, lg = green(litC) | 0, lb = blue(litC) | 0;
    for (let i = 0; i < n; i++) {
      const sy = ty + 1 + i * (segH + segGap);
      gc.fillStyle = i === (n - 1 - this.state)
        ? `rgb(${lr},${lg},${lb})`
        : `rgba(${lr},${lg},${lb},0.22)`;
      if (gc.roundRect) {
        gc.beginPath();
        gc.roundRect(tx + 2, sy, tw - 4, segH, 1);
        gc.fill();
      } else {
        gc.fillRect(tx + 2, sy, tw - 4, segH);
      }
    }

    // Left shadow — drum curves away from viewer
    const lG = gc.createLinearGradient(tx, 0, tx + tw * 0.55, 0);
    lG.addColorStop(0, 'rgba(0,0,0,0.42)');
    lG.addColorStop(1, 'rgba(0,0,0,0)');
    gc.fillStyle = lG;
    gc.fillRect(tx, ty, tw, th);

    // Right rim highlight — edge catches the light
    const rG = gc.createLinearGradient(tx + tw * 0.55, 0, tx + tw, 0);
    rG.addColorStop(0, 'rgba(255,255,255,0)');
    rG.addColorStop(1, 'rgba(255,255,255,0.14)');
    gc.fillStyle = rG;
    gc.fillRect(tx, ty, tw, th);

    gc.restore();

    // Border
    push();
    noFill();
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(tx, ty, tw, th, 2);
    pop();
  }

  // ── hit-testing ────────────────────────────────────────────────────────────

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this._panelH();
  }

  _inTeeth(mx, my) {
    const tx = this.x + this._dispW() + 7;
    const tw = this._teethW();
    return mx >= tx && mx <= tx + tw &&
           my >= this.y + 2 && my <= this.y + this.height - 2;
  }

  // Returns 'left' | 'right' | 'center' | null for the arrow style
  _arrowZone(mx, my) {
    if (mx < this.x || mx > this.x + this.width ||
        my < this.y || my > this.y + this.height) return null;
    const aw = this._arrowW();
    if (mx < this.x + aw)                return 'left';
    if (mx > this.x + this.width - aw)  return 'right';
    return 'center';
  }

  // ── input ──────────────────────────────────────────────────────────────────

  _resetToDefault() {
    this._cancelSpring();
    this.state        = this._springDefault;
    this._slideOffset = 0;
    this._prevState   = null;
    this._dragY       = null;
    this._active      = false;
    if (this.onChange) this.onChange({index: this.state, label: this.options[this.state]});
    if (this.onRelease) this.onRelease({index: this.state, label: this.options[this.state]});
  }

  mousePressed() {
    if (this.disabled) return;
    const inBody  = mouseX >= this.x && mouseX <= this.x + this.width &&
                    mouseY >= this.y && mouseY <= this.y + this.height;
    const inLabel = this.label &&
                    mouseX >= this.x && mouseX <= this.x + this.width &&
                    mouseY >  this.y + this.height &&
                    mouseY <= this.y + this._panelH();
    if (!inBody && !inLabel) return;

    // Label: double-click resets; single click records time only
    if (inLabel) {
      if (this._isDoubleClick()) this._resetToDefault();
      return;
    }

    if (this.style === 'arrow') {
      const zone = this._arrowZone(mouseX, mouseY);
      if (!zone) return;
      if (zone === 'center') {
        // Center display: double-click resets; single click does nothing
        if (this._isDoubleClick()) this._resetToDefault();
        return;
      }
      // Arrow buttons: advance state only — rapid double-clicks are intentional
      this._cancelSpring();
      const n     = this.options.length;
      const dispW = this.width - this._arrowW() * 2;
      const dir   = zone === 'left' ? -1 : 1;
      const prevState   = this.state;
      this.state        = (this.state + dir + n) % n;
      this._prevState   = prevState;
      this._slideDir    = dir;
      this._slideOffset = -dir * dispW;
      this._active      = true;
      if (this.onChange) this.onChange({index: this.state, label: this.options[this.state]});
    } else {
      if (this._inTeeth(mouseX, mouseY)) {
        // Gear wheel: normal drag interaction only — rapid double-clicks intentional
        this._cancelSpring();
        this._active        = true;
        this._dragY         = mouseY;
        this._stateAtDrag   = this.state;
        this._angleAtDrag   = this._gearAngle;
        this._drumOffset    = 0;
        this._teethPress    = true;
        this._teethPressBot = mouseY >= this.y + this.height / 2;
      } else {
        // Drum display: double-click resets
        if (this._isDoubleClick()) { this._resetToDefault(); return; }
        this._cancelSpring();
        this._active        = true;
        this._dragY         = mouseY;
        this._stateAtDrag   = this.state;
        this._angleAtDrag   = this._gearAngle;
        this._drumOffset    = 0;
        this._teethPress    = false;
        this._teethPressBot = mouseY >= this.y + this.height / 2;
      }
    }
  }

  mouseReleased() {
    if (!this._active) return;
    if (this.style === 'arrow') {
      this._active = false;
      if (this.onRelease) this.onRelease({index: this.state, label: this.options[this.state]});
      this._startSpring();
    } else {
      if (this._dragY !== null) {
        const pxPerStep = this._pxPerStep();
        const n         = this.options.length;
        const dy        = this._dragY - mouseY;

        let newState;
        if (this._teethPress && Math.abs(dy) < pxPerStep * 0.3) {
          const dir = this._teethPressBot ? -1 : 1;
          newState = (this.state + dir + n) % n;
          this._drumOffset = dir * this._spacing();
          this._gearAngle += dir * (Math.PI * 2) / 14;
        } else {
          newState = ((this._stateAtDrag + Math.round(dy / pxPerStep)) % n + n) % n;
          this._drumOffset = 0;
        }

        if (newState !== this.state) {
          this.state = newState;
          if (this.onChange) this.onChange({index: this.state, label: this.options[this.state]});
        }
      }
      this._active     = false;
      this._dragY      = null;
      this._teethPress = false;
      if (this.onRelease) this.onRelease({index: this.state, label: this.options[this.state]});
      this._startSpring();
    }
  }

  // Spring for discrete state: snap back after springDuration seconds
  _startSpring() {
    if (!this.springBack) return;
    this._springActive  = true;
    this._springStartMs = millis();
  }

  _tickSpring() {
    if (!this._springActive) return;
    if ((millis() - this._springStartMs) / 1000 >= this.springDuration) {
      const prev = this.state;
      this.state = this._springDefault;
      this._springActive = false;
      if (this.state !== prev && this.onChange)
        this.onChange({index: this.state, label: this.options[this.state]});
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (this.style === 'arrow') {
      this._arrowHover = this._arrowZone(mouseX, mouseY);
      return;
    }
    if (!this._active || this._dragY === null) return;

    const dy        = this._dragY - mouseY;
    const pxPerStep = this._pxPerStep();
    const teeth     = 14;
    const n         = this.options.length;

    const steps      = Math.trunc(dy / pxPerStep);
    this._drumOffset = -(dy - steps * pxPerStep);

    const newState = ((this._stateAtDrag + steps) % n + n) % n;
    if (newState !== this.state) {
      this.state = newState;
      if (this.onChange) this.onChange({index: this.state, label: this.options[this.state]});
    }

    this._gearAngle = this._angleAtDrag + (dy / pxPerStep) * ((Math.PI * 2) / teeth);
  }

  mouseWheel(e) {
    if (this.disabled || !this._hovered) return;
    const dir = e.delta > 0 ? -1 : 1;
    const n   = this.options.length;
    const prev = this.state;
    this.state = (this.state + dir + n) % n;
    if (this.state === prev) return;
    if (this.style === 'arrow') {
      this._prevState   = prev;
      this._slideDir    = dir;
      this._slideOffset = -dir * (this.width - this._arrowW() * 2);
    } else {
      this._gearAngle += dir * ((Math.PI * 2) / 14);
    }
    if (this.onChange) this.onChange({index: this.state, label: this.options[this.state]});
  }
}

window.VUMeter        = VUMeter;
window.XYPad          = XYPad;
window.VUDial         = VUDial;
window.LEDMeter       = LEDMeter;
window.ADSRDisplay    = ADSRDisplay;
window.Selector       = Selector;

// ─── MultiSlider ──────────────────────────────────────────────────────────────
// A row of AnalogSliders sharing a single onChange / onRelease callback.
//
// `sliders` is an object whose keys are slider names and values are defaults:
//   sliders: { kick: 0.9, snare: 0.7, bass: 0.8 }
//
// For per-slider option overrides, pass an object instead of a number:
//   sliders: { kick: 0.9, bass: { value: 0.5, min: -20, max: 20, readout: 'db' } }
//
// Both callbacks receive the same shape as `sliders` with current values:
//   onChange: v => console.log(v)  // { kick: 0.9, snare: 0.7, bass: 0.8 }

class MultiSlider extends ProControl {
  constructor(opts = {}) {
    super({ x: opts.x, y: opts.y, label: opts.label ?? '', theme: opts.theme });

    this.onChange   = opts.onChange  ?? null;
    this.onRelease  = opts.onRelease ?? null;
    this.horizontal = opts.horizontal ?? false;

    const sliders = opts.sliders ?? { '1': 0.5, '2': 0.5, '3': 0.5 };
    const keys    = Object.keys(sliders);
    const gap     = opts.gap ?? 4;

    this._names    = keys.map(k => k.replace(/[^a-zA-Z0-9]/g, ''));
    this._children = [];

    // Shared defaults applied to every child slider
    const base = {
      horizontal:     this.horizontal,
      height:         opts.height         ?? (this.horizontal ? 44 : 180),
      width:          opts.width,         // undefined → AnalogSlider auto-sizes
      min:            opts.min            ?? 0,
      max:            opts.max            ?? 1,
      readout:        opts.readout        ?? 'raw',
      decimals:       opts.decimals       ?? 2,
      scale:          opts.scale          ?? 'linear',
      showScale:      opts.showScale      ?? !this.horizontal,
      springBack:     opts.springBack     ?? false,
      springDuration: opts.springDuration ?? 1.0,
      style:          opts.style          ?? 'knob',
      theme:          opts.theme          ?? {},
    };

    // Build children relative to (0,0) — resolved position applied after
    let curX = 0, curY = 0;
    for (const name of keys) {
      const raw   = sliders[name];
      const isObj = (typeof raw === 'object' && raw !== null);
      const val   = isObj ? (raw.value ?? base.min) : raw;
      const over  = isObj ? raw : {};

      const s = new AnalogSlider({
        ...base,
        ...over,
        x:         this.horizontal ? 0    : curX,
        y:         this.horizontal ? curY : 0,
        value:     val,
        label:     name,
        onChange:  () => { if (this.onChange)  this.onChange(this._values()); },
        onRelease: () => { if (this.onRelease) this.onRelease(this._values()); },
      });
      s._detach(); // managed by MultiSlider, not the global registry
      this._children.push(s);
      if (this.horizontal) {
        curY += s.height + gap;
      } else {
        curX += s.width + gap;
      }
    }

    // If explicit x/y was provided, offset children immediately.
    // If auto-placement is pending, leave children at (0,0) — the pre-hook
    // calls _resolveAutoPlace() in creation order before the first draw.
    if (!this._autoPlacePending) {
      for (const s of this._children) { s.x += this._x; s.y += this._y; }
    }
  }

  _resolveAutoPlace() {
    const bb = this._bb();
    if (!bb) return;
    const { x, y } = _autoNext(bb.w, bb.h);
    this._x = x; this._y = y;
    this._autoPlacePending = false;
    for (const s of this._children) { s.x += x; s.y += y; }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  _values() {
    const v = {};
    this._names.forEach((n, i) => { v[n] = this._children[i].value; });
    return v;
  }

  get values() { return this._values(); }

  set values(obj) {
    for (const [n, val] of Object.entries(obj)) {
      const i = this._names.indexOf(n);
      if (i !== -1) this._children[i].value = val;
    }
  }

  slider(name) {
    const i = this._names.indexOf(name);
    return i !== -1 ? this._children[i] : null;
  }

  set disabled(v) {
    this._disabled = v;
    for (const s of (this._children ?? [])) s.disabled = v;
  }
  get disabled() { return this._disabled ?? false; }

  // ── Rendering ─────────────────────────────────────────────────────────────

  _bb() {
    if (!this._children.length) return null;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const s of this._children) {
      x1 = Math.min(x1, s.x);      y1 = Math.min(y1, s.y);
      x2 = Math.max(x2, s.x + s.width); y2 = Math.max(y2, s.y + s.height);
    }
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }

  mouseMoved()    { for (const s of this._children) s.mouseMoved(); }
  mousePressed()  { for (const s of this._children) s.mousePressed(); }
  mouseReleased() { for (const s of this._children) s.mouseReleased(); }
  mouseWheel(e)   { for (const s of this._children) s.mouseWheel(e); }
  _tickSpring()   { for (const s of this._children) s._tickSpring(); }

  draw() {
    this._markDrawn();
    const bb = this._bb();
    if (bb) _drawBevelGroup(this.theme, bb.x, bb.y, bb.w, bb.h);
    for (const s of this._children) s.draw();
  }

  remove() {
    super.remove();
    this._children = [];
  }
}

window.MultiSlider = MultiSlider;

// ─── MultiDial ────────────────────────────────────────────────────────────────
// A row of Dials sharing a single onChange / onRelease callback.
//
// `dials` is an object whose keys are dial names and values are defaults:
//   dials: { freq: 440, q: 0.7, gain: 0 }
//
// For per-dial option overrides, pass an object instead of a number:
//   dials: { freq: { value: 440, min: 20, max: 20000 }, gain: 0 }
//
// Both callbacks receive a name→value object: { freq: 440, q: 0.7, gain: 0 }

class MultiDial extends ProControl {
  constructor(opts = {}) {
    super({ x: opts.x, y: opts.y, label: opts.label ?? '', theme: opts.theme });

    this.onChange   = opts.onChange   ?? null;
    this.onRelease  = opts.onRelease  ?? null;
    this.horizontal = opts.horizontal ?? true; // true = row, false = column

    const dials = opts.dials ?? { '1': 0.5, '2': 0.5, '3': 0.5 };
    const keys  = Object.keys(dials);
    const gap   = opts.gap ?? 4;

    this._names    = keys.map(k => k.replace(/[^a-zA-Z0-9]/g, ''));
    this._children = [];

    const base = {
      size:           opts.size           ?? 70,
      min:            opts.min            ?? 0,
      max:            opts.max            ?? 1,
      readout:        opts.readout        ?? 'raw',
      decimals:       opts.decimals       ?? 2,
      scale:          opts.scale          ?? 'linear',
      showScale:      opts.showScale      ?? false,
      showKnob:       opts.showKnob       ?? true,
      style:          opts.style ?? opts.dialStyle ?? 'classic',
      springBack:     opts.springBack     ?? false,
      springDuration: opts.springDuration ?? 1.0,
      theme:          opts.theme          ?? {},
    };

    // Build children relative to (0,0) — resolved position applied after
    let curX = 0, curY = 0;
    for (const name of keys) {
      const raw   = dials[name];
      const isObj = (typeof raw === 'object' && raw !== null);
      const val   = isObj ? (raw.value ?? base.min) : raw;
      const over  = isObj ? raw : {};

      const d = new Dial({
        ...base,
        ...over,
        x:         this.horizontal ? curX : 0,
        y:         this.horizontal ? 0    : curY,
        value:     val,
        label:     name,
        onChange:  () => { if (this.onChange)  this.onChange(this._values()); },
        onRelease: () => { if (this.onRelease) this.onRelease(this._values()); },
      });
      d._detach(); // managed by MultiDial, not the global registry
      this._children.push(d);
      if (this.horizontal) {
        curX += d.size + gap;
      } else {
        curY += d._panelH() + gap;
      }
    }

    // If explicit x/y was provided, offset children immediately.
    // If auto-placement is pending, leave children at (0,0) — the pre-hook
    // calls _resolveAutoPlace() in creation order before the first draw.
    if (!this._autoPlacePending) {
      for (const d of this._children) { d.x += this._x; d.y += this._y; }
    }
  }

  _resolveAutoPlace() {
    const bb = this._bb();
    if (!bb) return;
    const { x, y } = _autoNext(bb.w, bb.h);
    this._x = x; this._y = y;
    this._autoPlacePending = false;
    for (const d of this._children) { d.x += x; d.y += y; }
  }

  // ── Public API ────────────────────────────────────────────────────────────

  _values() {
    const v = {};
    this._names.forEach((n, i) => { v[n] = this._children[i].value; });
    return v;
  }

  get values() { return this._values(); }

  set values(obj) {
    for (const [n, val] of Object.entries(obj)) {
      const i = this._names.indexOf(n);
      if (i !== -1) this._children[i].value = val;
    }
  }

  dial(name) {
    const i = this._names.indexOf(name);
    return i !== -1 ? this._children[i] : null;
  }

  set disabled(v) {
    this._disabled = v;
    for (const d of (this._children ?? [])) d.disabled = v;
  }
  get disabled() { return this._disabled ?? false; }

  // ── Rendering ─────────────────────────────────────────────────────────────

  _bb() {
    if (!this._children.length) return null;
    let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
    for (const d of this._children) {
      x1 = Math.min(x1, d.x);          y1 = Math.min(y1, d.y);
      x2 = Math.max(x2, d.x + d.size); y2 = Math.max(y2, d.y + d._panelH());
    }
    return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
  }

  mouseMoved()    { for (const d of this._children) d.mouseMoved(); }
  mousePressed()  { for (const d of this._children) d.mousePressed(); }
  mouseReleased() { for (const d of this._children) d.mouseReleased(); }
  mouseWheel(e)   { for (const d of this._children) d.mouseWheel(e); }
  _tickSpring()   { for (const d of this._children) d._tickSpring(); }

  draw() {
    this._markDrawn();
    const bb = this._bb();
    if (bb) _drawBevelGroup(this.theme, bb.x, bb.y, bb.w, bb.h);
    for (const d of this._children) d.draw();
  }

  remove() {
    super.remove();
    this._children = [];
  }
}

window.MultiDial = MultiDial;

// ─── GridPad ──────────────────────────────────────────────────────────────────
// A 2-D grid of cells in two modes:
//   'toggle'  — click to flip each cell 0 ↔ 1
//   'percent' — hold left/right click to raise/lower a 0–1 value per cell;
//               double-click snaps to 0 or 1
//
// Options:
//   rows, cols        grid dimensions
//   mode              'toggle' (default) | 'percent'
//   cellSize          pixel size of each cell (default 20)
//   cellGap           gap between cells (default 2)
//   hGroup / vGroup   draw a bevel separator every N cols/rows (0 = none)
//   groupGap          extra px at each group boundary (default 4)
//   values            initial [[row][col]] 2-D array
//   rate              percent change per frame while held (default 0.02)
//   onChange(values)  fires on any cell change

class GridPad extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.rows     = opts.rows     ?? 4;
    this.cols     = opts.cols     ?? 4;
    this.mode     = opts.mode     ?? 'toggle';
    this.cellSize = opts.cellSize ?? 20;
    this.cellGap  = opts.cellGap  ?? 2;
    this.hGroup   = opts.hGroup   ?? 0;
    this.vGroup   = opts.vGroup   ?? 0;
    this.groupGap = opts.groupGap ?? 4;
    this._rate    = opts.rate     ?? 0.02;
    this._pad     = 6;

    // Normalize options for 'colorselect' mode.
    // Accepts string[] or {color,value?}[] — value defaults to the color string.
    this._options = (opts.options ?? []).map(o =>
      (typeof o === 'string') ? { color: o, value: o }
                              : { color: o.color, value: o.value ?? o.color }
    );

    const iv = opts.values;
    this._vals = Array.from({ length: this.rows }, (_, r) =>
      Array.from({ length: this.cols }, (_, c) => {
        const raw = iv?.[r]?.[c] ?? 0;
        if (this.mode === 'colorselect') {
          // Accept a numeric index directly, or match by semantic value/color.
          if (typeof raw === 'number') return constrain(Math.round(raw), 0, Math.max(0, this._options.length - 1));
          const idx = this._options.findIndex(o => o.value === raw || o.color === raw);
          return idx >= 0 ? idx : 0;
        }
        return raw;
      })
    );
    this._initVals = this._vals.map(row => [...row]);

    this._activeCell  = null;
    this._dir         = 1;
    this._lastCell    = null;
    this._pressedCell = null;  // button mode only

    if (!GridPad._ctxBlocked) {
      GridPad._ctxBlocked = true;
      if (typeof document !== 'undefined') {
        document.addEventListener('contextmenu', e => {
          if (e.target?.tagName === 'CANVAS') e.preventDefault();
        });
      }
    }
  }

  // ── geometry ─────────────────────────────────────────────────────────────────

  _colX(c) {
    const gs = this.hGroup ? Math.floor(c / this.hGroup) * this.groupGap : 0;
    return this.x + this._pad + c * (this.cellSize + this.cellGap) + gs;
  }

  _rowY(r) {
    const gs = this.vGroup ? Math.floor(r / this.vGroup) * this.groupGap : 0;
    return this.y + this._pad + r * (this.cellSize + this.cellGap) + gs;
  }

  _totalW() {
    const gs = this.hGroup ? Math.floor((this.cols - 1) / this.hGroup) * this.groupGap : 0;
    return this._pad * 2 + this.cols * this.cellSize + (this.cols - 1) * this.cellGap + gs;
  }

  _totalH() {
    const gs = this.vGroup ? Math.floor((this.rows - 1) / this.vGroup) * this.groupGap : 0;
    return this._pad * 2 + this.rows * this.cellSize + (this.rows - 1) * this.cellGap + gs + (this.label ? 16 : 4);
  }

  _cellAt(mx, my) {
    for (let r = 0; r < this.rows; r++) {
      const cy = this._rowY(r);
      if (my < cy || my > cy + this.cellSize) continue;
      for (let c = 0; c < this.cols; c++) {
        const cx = this._colX(c);
        if (mx >= cx && mx <= cx + this.cellSize) return { r, c };
      }
    }
    return null;
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this._totalW() &&
           my >= this.y && my <= this.y + this._totalH();
  }

  // ── public API ────────────────────────────────────────────────────────────────

  get values() {
    if (this.mode === 'colorselect') {
      return this._vals.map(row => row.map(idx => this._options[idx]?.value ?? null));
    }
    return this._vals.map(row => [...row]);
  }

  getValue(r, c) {
    if (this.mode === 'colorselect') return this._options[this._vals[r]?.[c]]?.value ?? null;
    return this._vals[r]?.[c] ?? 0;
  }

  setValue(r, c, v) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
    if (this.mode === 'colorselect') {
      this._vals[r][c] = constrain(Math.round(v), 0, Math.max(0, this._options.length - 1));
    } else if (this.mode === 'toggle') {
      this._vals[r][c] = v ? 1 : 0;
    } else {
      this._vals[r][c] = constrain(v, 0, 1);
    }
  }

  // ── drawing ───────────────────────────────────────────────────────────────────

  draw() {
    this._markDrawn();
    const w = this._totalW();
    const h = this._totalH();
    this._drawPanel(this.x, this.y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow);
      rect(this.x, this.y, w, h, 4); pop();
    }

    const litC = color(this.theme.capIndicator);
    const dimC = color(this.theme.track);

    // Pass 1: cell fills
    push();
    noStroke();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.mode === 'button') {
          const pressed = this._pressedCell?.r === r && this._pressedCell?.c === c;
          fill(pressed ? litC : dimC);
        } else if (this.mode === 'colorselect') {
          const optColor = this._options[this._vals[r][c]]?.color;
          fill(optColor ? color(optColor) : dimC);
        } else {
          const val = this._vals[r][c];
          fill(this.mode === 'toggle' ? (val ? litC : dimC) : lerpColor(dimC, litC, val));
        }
        rect(this._colX(c), this._rowY(r), this.cellSize, this.cellSize, 2);
      }
    }
    pop();

    // Pass 2: per-cell bevel (raised normally, sunken when button is pressed)
    const gc = drawingContext;
    gc.save();
    gc.lineWidth = 1;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cx = this._colX(c);
        const cy = this._rowY(r);
        const cs = this.cellSize;
        const pressed = this.mode === 'button' &&
                        this._pressedCell?.r === r && this._pressedCell?.c === c;

        // Top + left inner edge
        gc.strokeStyle = pressed ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.42)';
        gc.beginPath();
        gc.moveTo(cx + 1.5, cy + cs - 1.5);
        gc.lineTo(cx + 1.5, cy + 1.5);
        gc.lineTo(cx + cs - 1.5, cy + 1.5);
        gc.stroke();

        // Bottom + right inner edge
        gc.strokeStyle = pressed ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.38)';
        gc.beginPath();
        gc.moveTo(cx + 1.5, cy + cs - 1.5);
        gc.lineTo(cx + cs - 1.5, cy + cs - 1.5);
        gc.lineTo(cx + cs - 1.5, cy + 1.5);
        gc.stroke();
      }
    }
    gc.restore();

    this._drawGroupLines();

    if (this.label) this._drawLabel(this.x + w / 2, this.y + h - 13);
    if (this.disabled) this._drawDisabled(this.x, this.y, w, h);
  }

  _drawGroupLines() {
    if (!this.hGroup && !this.vGroup) return;
    const hiC  = lerpColor(color(this.theme.panel), color(this.theme.capHighlight), 0.5);
    const shC  = lerpColor(color(this.theme.panel), color(this.theme.panelStroke),  0.65);
    const half = Math.round(this.groupGap / 2);
    push();
    strokeWeight(1);
    noFill();
    if (this.hGroup) {
      const top = this._rowY(0);
      const bot = this._rowY(this.rows - 1) + this.cellSize;
      for (let g = 1; g * this.hGroup < this.cols; g++) {
        const lx = this._colX(g * this.hGroup) - half - 1;
        stroke(hiC); line(lx,     top, lx,     bot);
        stroke(shC); line(lx + 1, top, lx + 1, bot);
      }
    }
    if (this.vGroup) {
      const lft = this._colX(0);
      const rgt = this._colX(this.cols - 1) + this.cellSize;
      for (let g = 1; g * this.vGroup < this.rows; g++) {
        const ly = this._rowY(g * this.vGroup) - half - 1;
        stroke(hiC); line(lft, ly,     rgt, ly);
        stroke(shC); line(lft, ly + 1, rgt, ly + 1);
      }
    }
    pop();
  }

  // ── input ─────────────────────────────────────────────────────────────────────

  mousePressed() {
    if (this.disabled || !this._containsPoint(mouseX, mouseY)) return;
    const cell = this._cellAt(mouseX, mouseY);
    if (!cell) {
      // Label area: double-click resets all cells to initial values
      if (this.label && mouseY >= this.y + this._totalH() - 16 && this._isDoubleClick()) {
        this._vals = this._initVals.map(row => [...row]);
        if (this.onChange) this.onChange(this.values);
        if (this.onRelease) this.onRelease(this.values);
      }
      return;
    }
    const { r, c } = cell;

    if (this.mode === 'toggle') {
      this._vals[r][c] = this._vals[r][c] ? 0 : 1;
      if (this.onChange) this.onChange(this.values);
      return;
    }

    if (this.mode === 'colorselect') {
      const n = this._options.length;
      if (n > 0) {
        const dir = (mouseButton === RIGHT) ? -1 : 1;
        this._vals[r][c] = ((this._vals[r][c] + dir) % n + n) % n;
        if (this.onChange) this.onChange(this.values);
      }
      return;
    }

    if (this.mode === 'button') {
      this._pressedCell = { r, c };
      this._active      = true;
      if (this.onPress) this.onPress(r, c);
      return;
    }

    // percent mode
    this._dir        = (mouseButton === RIGHT) ? -1 : 1;
    this._activeCell = { r, c };
    this._active     = true;

    const now = millis();
    if (this._lastCell?.r === r && this._lastCell?.c === c &&
        now - this._lastCell.t < 350) {
      // Use the value captured at first-click time so the hold effect
      // accumulating between clicks doesn't interfere with snap direction.
      const v0 = this._lastCell.v0;
      this._vals[r][c] = v0 <= 0 ? 1 : v0 >= 1 ? 0 : v0 >= 0.5 ? 1 : 0;
      if (this.onChange) this.onChange(this.values);
      this._lastCell = null; this._active = false; this._activeCell = null;
      return;
    }
    this._lastCell = { r, c, t: now, v0: this._vals[r][c] };
  }

  mouseReleased() {
    if (this._active) {
      this._active = false;
      if (this.mode === 'button') {
        const pc = this._pressedCell;
        this._pressedCell = null;
        this._activeCell  = null;
        if (this.onRelease && pc) this.onRelease(pc.r, pc.c);
      } else {
        this._activeCell = null;
        if (this.onRelease) this.onRelease(this.values);
      }
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
  }

  _tickSpring() {
    super._tickSpring();
    if (!this._active || !this._activeCell || this.mode !== 'percent') return;
    const { r, c } = this._activeCell;
    this._vals[r][c] = constrain(this._vals[r][c] + this._rate * this._dir, 0, 1);
    if (this.onChange) this.onChange(this.values);
  }
}

GridPad._ctxBlocked = false;
window.GridPad = GridPad;

// ─── TagSelector ─────────────────────────────────────────────────────────────
// Multi-select chip panel. Each string in opts.words is shown as a rounded
// pill; clicking toggles selection. Double-click the label to reset to the
// initial selection.
// onChange(selectedArray, addedWord, removedWord) — one of the last two args
// is always non-null during a toggle; both null on a label double-click reset.

class TagSelector extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.words     = opts.words    ?? ['Tag 1', 'Tag 2', 'Tag 3'];
    this._selected = new Set(opts.selected ?? []);
    this._initSel  = new Set(opts.selected ?? []);
    this.width     = opts.width    ?? 200;
    this._fixedH   = opts.height   ?? null;

    this._pillH    = 20;
    this._padX     = 8;
    this._gap      = 5;
    this._rowGap   = 6;
    this._inPad    = 8;
    this._labelH   = this.label ? 14 : 0;
    this._sbW      = 5;   // scrollbar width

    this._layout      = [];
    this._layoutDirty = true;
    this._hoveredWord = null;
    this._scrollY     = 0;
    this._contentH    = 0;
    this._maxScrollY  = 0;
    this.height       = this._fixedH ?? 0;

    this._sbDragging        = false;
    this._sbDragStartY      = 0;
    this._sbDragStartScroll = 0;
    this._sbThumbHov        = false;

    this._buildLayout();
  }

  get selected() { return [...this._selected]; }
  set selected(arr) { this._selected = new Set(arr); }

  _buildLayout() {
    this._layoutDirty = false;
    this._layout = [];

    // Reserve scrollbar gutter when height is fixed so pills never overlap it
    const sbGutter  = this._fixedH !== null ? this._sbW + 3 : 0;
    const rightEdge = this.width - this._inPad - sbGutter;

    let curX = this._inPad;
    let curY = this._inPad;

    push();
    textSize(9);
    if (this.theme.font) textFont(this.theme.font);

    for (const word of this.words) {
      const pw = textWidth(word) + this._padX * 2;
      if (curX > this._inPad && curX + pw > rightEdge) {
        curX  = this._inPad;
        curY += this._pillH + this._rowGap;
      }
      this._layout.push({ word, rx: curX, ry: curY, w: pw, h: this._pillH });
      curX += pw + this._gap;
    }
    pop();

    const bottom = this._layout.length > 0
      ? Math.max(...this._layout.map(p => p.ry + p.h))
      : 0;
    this._contentH = bottom + this._inPad;

    if (this._fixedH === null) {
      this.height      = this._contentH + this._labelH;
      this._maxScrollY = 0;
    } else {
      this.height      = this._fixedH;
      this._maxScrollY = Math.max(0, this._contentH - (this._fixedH - this._labelH));
    }

    this._scrollY = constrain(this._scrollY, 0, this._maxScrollY);
  }

  _panelH() { return this.height; }

  _sbGeom() {
    const { x, y, width: w, height: h } = this;
    const trackX = x + w - this._sbW - 2;
    const trackY = y + 3;
    const trackH = h - this._labelH - 6;
    const thumbH = Math.max(14, trackH * trackH / this._contentH);
    const thumbY = this._maxScrollY > 0
      ? trackY + (this._scrollY / this._maxScrollY) * (trackH - thumbH)
      : trackY;
    return { trackX, trackY, trackH, thumbH, thumbY };
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _pillAt(mx, my) {
    const visTop = this.y + 1;
    const visBot = this.y + this.height - this._labelH - 1;
    for (const pill of this._layout) {
      const px = this.x + pill.rx;
      const py = this.y + pill.ry - this._scrollY;
      if (py + pill.h < visTop || py > visBot) continue;
      if (mx >= px && mx <= px + pill.w && my >= py && my <= py + pill.h) {
        return pill.word;
      }
    }
    return null;
  }

  draw() {
    this._markDrawn();
    if (this._layoutDirty) this._buildLayout();

    const { x, y, width: w, height: h } = this;
    const scrollable = this._maxScrollY > 0;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow); rect(x, y, w, h, 4); pop();
    }

    // Clip pill content to interior (above label)
    const gc = drawingContext;
    gc.save();
    gc.beginPath();
    gc.rect(x + 1, y + 1, w - 2, h - this._labelH - 1);
    gc.clip();

    for (const pill of this._layout) {
      const px  = x + pill.rx;
      const py  = y + pill.ry - this._scrollY;
      const sel = this._selected.has(pill.word);
      const hov = this._hoveredWord === pill.word && !this.disabled;
      const pr  = 5;

      push();
      noStroke();
      textSize(9);
      if (this.theme.font) textFont(this.theme.font);

      if (sel) {
        const ic = color(this.theme.capIndicator);
        fill(red(ic), green(ic), blue(ic), hov ? 72 : 48);
        rect(px, py, pill.w, pill.h, pr);
        stroke(this.theme.capIndicator);
        strokeWeight(1.5);
        noFill();
        rect(px, py, pill.w, pill.h, pr);
        noStroke();
        fill(this.theme.capIndicator);
      } else {
        fill(this.theme.bg);
        stroke(hov ? this.theme.capIndicator : this.theme.panelStroke);
        strokeWeight(1);
        rect(px, py, pill.w, pill.h, pr);
        noStroke();
        fill(this.theme.label);
      }

      textAlign(CENTER, CENTER);
      text(pill.word, px + pill.w / 2, py + pill.h / 2 + 0.5);
      pop();
    }

    gc.restore();

    // Scrollbar
    if (scrollable) {
      const { trackX, trackY, trackH, thumbH, thumbY } = this._sbGeom();
      const thumbActive = this._sbDragging || this._sbThumbHov;
      push();
      noStroke();
      fill(this.theme.track);
      rect(trackX, trackY, this._sbW, trackH, 2);
      fill(lerpColor(color(this.theme.panelStroke), color(this.theme.capIndicator), thumbActive ? 0.65 : 0.35));
      rect(trackX, thumbY, this._sbW, thumbH, 2);
      pop();
    }

    if (this.label) this._drawLabel(x + w / 2, y + h - this._labelH + 2);
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  mousePressed() {
    if (this.disabled) return;

    // Scrollbar interaction takes priority
    if (this._maxScrollY > 0) {
      const { trackX, trackY, trackH, thumbH, thumbY } = this._sbGeom();
      if (mouseX >= trackX && mouseX <= trackX + this._sbW &&
          mouseY >= trackY && mouseY <= trackY + trackH) {
        if (mouseY >= thumbY && mouseY <= thumbY + thumbH) {
          this._sbDragging        = true;
          this._sbDragStartY      = mouseY;
          this._sbDragStartScroll = this._scrollY;
        } else {
          // Click on track — jump scroll so thumb centres on click
          const ratio = (mouseY - trackY - thumbH / 2) / (trackH - thumbH);
          this._scrollY = constrain(ratio * this._maxScrollY, 0, this._maxScrollY);
        }
        return;
      }
    }

    const word = this._pillAt(mouseX, mouseY);
    if (word) {
      let added = null, removed = null;
      if (this._selected.has(word)) {
        this._selected.delete(word);
        removed = word;
      } else {
        this._selected.add(word);
        added = word;
      }
      if (this.onChange) this.onChange(this.selected, added, removed);
      return;
    }

    if (this.label) {
      const inLabel = mouseX >= this.x && mouseX <= this.x + this.width &&
                      mouseY >  this.y + this.height - this._labelH &&
                      mouseY <= this.y + this.height;
      if (inLabel && this._isDoubleClick()) {
        this._selected = new Set(this._initSel);
        if (this.onChange) this.onChange(this.selected, null, null);
        if (this.onRelease) this.onRelease(this.selected, null, null);
      }
    }
  }

  mouseReleased() {
    this._sbDragging = false;
  }

  mouseWheel(e) {
    if (!this._hovered || this._maxScrollY <= 0) return;
    const delta = e.deltaY ?? e.delta ?? 0;
    this._scrollY = constrain(this._scrollY + delta * 0.4, 0, this._maxScrollY);
    return false;
  }

  mouseMoved() {
    this._hovered = this._containsPoint(mouseX, mouseY);

    if (this._sbDragging) {
      const { trackH, thumbH } = this._sbGeom();
      const dy = mouseY - this._sbDragStartY;
      this._scrollY = constrain(
        this._sbDragStartScroll + dy / (trackH - thumbH) * this._maxScrollY,
        0, this._maxScrollY
      );
      this._hoveredWord = null;
      return;
    }

    if (this._maxScrollY > 0) {
      const { trackX, thumbY, thumbH } = this._sbGeom();
      this._sbThumbHov = mouseX >= trackX && mouseX <= trackX + this._sbW &&
                         mouseY >= thumbY  && mouseY <= thumbY + thumbH;
    } else {
      this._sbThumbHov = false;
    }

    this._hoveredWord = this._pillAt(mouseX, mouseY);
  }
}

window.TagSelector = TagSelector;

// ─── SliderSelector ──────────────────────────────────────────────────────────
// A vertical fader that snaps to discrete string options.
// opts: x, y, options[], state (index), width, height, label,
//       onChange(index, value), onRelease(index, value), theme

class SliderSelector extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.options  = opts.options ?? ['A', 'B', 'C'];
    this.state    = constrain(opts.state ?? 0, 0, Math.max(0, this.options.length - 1));
    this.style    = opts.style ?? 'knob';  // 'knob' | 'button'

    this._capH     = this.style === 'button' ? 20 : 24;
    this._trackPad = this._capH / 2 + (this.label ? 10 : 2);  // extra top room for label
    this._trackCX  = 18;                   // x-offset of track center within panel

    const n           = this.options.length;
    const tickSpacing = 22;
    const trackLen    = Math.max(0, n - 1) * tickSpacing;

    const charPx   = 5.5;
    const maxChars = n > 0 ? Math.max(...this.options.map(s => s.length)) : 4;
    const labelW   = Math.ceil(maxChars * charPx) + 4;
    const tickEnd  = this._trackCX + 3 + 2 + 5 + 2;  // = 30

    this.height = opts.height ?? Math.max(80, trackLen + this._trackPad * 2);
    this.width  = opts.width  ?? Math.max(50, tickEnd + labelW + 4);
  }

  get value() { return this.options ? (this.options[this.state] ?? null) : null; }
  set value(v) {
    if (!this.options) return;
    const i = this.options.indexOf(v);
    if (i !== -1) this.state = i;
  }

  _trackTop()    { return this.y + this._trackPad; }
  _trackBottom() { return this.y + this.height - this._trackPad; }
  _trackLen()    { return this._trackBottom() - this._trackTop(); }

  _tickY(i) {
    const n = this.options.length;
    if (n <= 1) return (this._trackTop() + this._trackBottom()) / 2;
    return this._trackTop() + (i / (n - 1)) * this._trackLen();
  }

  _capY() { return this._tickY(this.state); }

  _nearestTick(py) {
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < this.options.length; i++) {
      const d = Math.abs(py - this._tickY(i));
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _capHit(mx, my) {
    const cy = this._capY();
    const cx = this.x + this._trackCX;
    if (this.style === 'button') {
      return dist(mx, my, cx, cy) <= this._capH / 2;
    }
    const capW = this._trackCX * 2 - 8;
    return abs(my - cy) <= this._capH / 2 &&
           mx >= cx - capW / 2 && mx <= cx + capW / 2;
  }

  draw() {
    this._markDrawn();
    if (this.options.length === 0) return;
    const { x, y, width: w, height: h } = this;
    const cx = x + this._trackCX;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow); rect(x, y, w, h, 4); pop();
    }

    // Track groove
    const trackW = 6;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(cx - trackW / 2, this._trackTop(), trackW, this._trackLen(), 2);
    pop();

    // Tick marks and option labels
    const tickX   = cx + trackW / 2 + 2;
    const tickLen = 5;
    push();
    textSize(9);
    textAlign(LEFT, CENTER);
    if (this.theme.font) textFont(this.theme.font);
    for (let i = 0; i < this.options.length; i++) {
      const ty         = this._tickY(i);
      const isSelected = i === this.state;
      strokeWeight(isSelected ? 1.5 : 1);
      stroke(isSelected ? this.theme.capIndicator : this.theme.scaleTick);
      line(tickX, ty, tickX + tickLen, ty);
      noStroke();
      fill(isSelected ? this.theme.capIndicator : this.theme.scaleText);
      text(this.options[i], tickX + tickLen + 2, ty);
    }
    pop();

    // Slider cap
    if (this.style === 'button') {
      this._drawSSButtonCap(cx, this._capY());
    } else {
      this._drawSSCap(cx, this._capY());
    }

    this._drawLabel(x + this.width / 2, y + 2);

    if (this._active) {
      this._drawTooltip(cx, this._capY(), this.options[this.state] ?? '');
    }
    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawSSCap(cx, cy) {
    const capW = this._trackCX * 2 - 8;
    const capH = this._capH;
    const capX = cx - capW / 2;
    const capY = cy - capH / 2;

    push();
    noStroke();
    for (let i = 0; i < capH; i++) {
      const t   = i / capH;
      const col = lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), t);
      fill(col);
      rect(capX, capY + i, capW, 1);
    }
    stroke(this.theme.panelStroke);
    strokeWeight(1);
    noFill();
    rect(capX, capY, capW, capH, 3);
    stroke(this.theme.capIndicator);
    strokeWeight(1.5);
    line(capX + 4, cy, capX + capW - 4, cy);
    pop();
  }

  _drawSSButtonCap(cx, cy) {
    const r  = this._capH / 2;
    const gc = drawingContext;
    gc.save();
    const grad = gc.createRadialGradient(
      cx - r * 0.3, cy - r * 0.35, 0,
      cx, cy, r
    );
    grad.addColorStop(0,    this.theme.capHighlight);
    grad.addColorStop(0.55, this.theme.capBody);
    grad.addColorStop(1,    this.theme.capShadow);
    gc.beginPath();
    gc.arc(cx, cy, r, 0, Math.PI * 2);
    gc.fillStyle = grad;
    gc.fill();
    gc.strokeStyle = this.theme.panelStroke;
    gc.lineWidth   = 1;
    gc.stroke();
    gc.beginPath();
    gc.arc(cx, cy, 2.5, 0, Math.PI * 2);
    gc.fillStyle = this.theme.capIndicator;
    gc.fill();
    gc.restore();
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._capHit(mouseX, mouseY)) {
      this._active = true;
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active = false;
      if (this.onRelease) this.onRelease(this.state, this.options[this.state]);
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (this._active) {
      const nearest = this._nearestTick(mouseY);
      if (nearest !== this.state) {
        this.state = nearest;
        if (this.onChange) this.onChange(this.state, this.options[this.state]);
      }
    }
  }

  mouseWheel(e) {
    if (this.disabled || !this._hovered) return;
    const delta = e.deltaY ?? e.delta ?? 0;
    const dir   = delta > 0 ? 1 : -1;
    const next  = constrain(this.state + dir, 0, this.options.length - 1);
    if (next !== this.state) {
      this.state = next;
      if (this.onChange) this.onChange(this.state, this.options[this.state]);
    }
  }
}

window.SliderSelector = SliderSelector;

// ─── RangeSlider ─────────────────────────────────────────────────────────────
// A two-handle slider that defines a low/high range.
// opts: x, y, width, height, min, max, valueLow, valueHigh, label,
//       readout ('raw'|'percent'|'db'), decimals, horizontal,
//       showScale, showFader, onChange(low,high), onRelease(low,high), theme

class RangeSlider extends ProControl {
  constructor(opts = {}) {
    super(opts);

    this.readout    = opts.readout    ?? 'raw';
    this.decimals   = opts.decimals   ?? 2;
    this.horizontal = opts.horizontal ?? false;
    this.showFader  = opts.showFader  ?? true;

    this.valueLow  = opts.valueLow  ?? this.min;
    this.valueHigh = opts.valueHigh ?? this.max;

    this._capH     = 24;
    this._trackPad = this._capH / 2 + 2;
    this._dragging  = null;   // 'low' | 'high'
    this._dragStart = null;
    this._defaultLow  = this.valueLow;
    this._defaultHigh = this.valueHigh;

    if (this.horizontal) {
      this.width     = opts.width     ?? 180;
      this.height    = opts.height    ?? 44;
      this.showScale = opts.showScale ?? false;
    } else {
      this.height    = opts.height    ?? 180;
      this.width     = opts.width     ?? 50;
      this.showScale = opts.showScale ?? true;
    }
  }

  // ── geometry ───────────────────────────────────────────────────────────────

  _trackX()      { return this.x + this.width / 2; }
  _trackTop()    { return this.y + this._trackPad; }
  _trackBottom() { return this.y + this.height - this._trackPad; }
  _trackLen()    { return this._trackBottom() - this._trackTop(); }
  _normLow()     { return this._norm(this.valueLow); }
  _normHigh()    { return this._norm(this.valueHigh); }
  _lowY()        { return this._trackBottom() - this._normLow()  * this._trackLen(); }
  _highY()       { return this._trackBottom() - this._normHigh() * this._trackLen(); }

  _hTrackY()     { return this.y + this.height / 2; }
  _hTrackLeft()  { return this.x + this._trackPad; }
  _hTrackRight() { return this.x + this.width - this._trackPad; }
  _hTrackLen()   { return this._hTrackRight() - this._hTrackLeft(); }
  _lowX()        { return this._hTrackLeft() + this._normLow()  * this._hTrackLen(); }
  _highX()       { return this._hTrackLeft() + this._normHigh() * this._hTrackLen(); }

  // ── formatting ─────────────────────────────────────────────────────────────

  _fmt(v) {
    switch (this.readout) {
      case 'percent': return nf(this._norm(v) * 100, 1, 0) + '%';
      case 'db':
        if (v <= this.min) return '-∞';
        return nf(20 * Math.log10(v / this.max), 1, 1) + ' dB';
      default: return nf(v, 1, this.decimals);
    }
  }

  // ── drawing ────────────────────────────────────────────────────────────────

  draw() {
    this._markDrawn();
    if (this.horizontal) this._drawH(); else this._drawV();
  }

  _drawCapV(cx, cy) {
    const capW = this.width - 8;
    const capH = this._capH;
    const capX = cx - capW / 2;
    const capY = cy - capH / 2;
    push();
    noStroke();
    for (let i = 0; i < capH; i++) {
      fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), i / capH));
      rect(capX, capY + i, capW, 1);
    }
    stroke(this.theme.panelStroke); strokeWeight(1); noFill();
    rect(capX, capY, capW, capH, 3);
    stroke(this.theme.capIndicator); strokeWeight(1.5);
    line(capX + 4, cy, capX + capW - 4, cy);
    pop();
  }

  _drawCapH(cx, cy) {
    const capW = this._capH;
    const capH = this.height - 10;
    const capX = cx - capW / 2;
    const capY = cy - capH / 2;
    push();
    noStroke();
    for (let i = 0; i < capW; i++) {
      fill(lerpColor(color(this.theme.capHighlight), color(this.theme.capShadow), i / capW));
      rect(capX + i, capY, 1, capH);
    }
    stroke(this.theme.panelStroke); strokeWeight(1); noFill();
    rect(capX, capY, capW, capH, 3);
    stroke(this.theme.capIndicator); strokeWeight(1.5);
    line(cx, capY + 4, cx, capY + capH - 4);
    pop();
  }

  _drawV() {
    const cx = this._trackX();
    const { x, y, width: w, height: h } = this;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow); rect(x, y, w, h, 4); pop();
    }

    const trackW = 6;
    push();
    fill(this.theme.track); stroke(this.theme.trackStroke); strokeWeight(1);
    rect(cx - trackW / 2, this._trackTop(), trackW, this._trackLen(), 2);
    pop();

    // Range fill between the two caps
    const lowY  = this._lowY();
    const highY = this._highY();
    const gc    = drawingContext;
    gc.save();
    gc.fillStyle   = this.theme.capIndicator;
    gc.globalAlpha = 0.30;
    gc.fillRect(cx - trackW / 2 + 1, highY, trackW - 2, lowY - highY);
    gc.restore();

    if (this.showScale) {
      const steps = 5; const tickLen = 5;
      push();
      stroke(this.theme.scaleTick); strokeWeight(1);
      fill(this.theme.scaleText); textSize(7); textAlign(LEFT, CENTER);
      if (this.theme.font) textFont(this.theme.font);
      for (let i = 0; i <= steps; i++) {
        const n  = i / steps;
        const ty = this._trackBottom() - n * this._trackLen();
        const tx = cx + trackW / 2 + 2;
        line(tx, ty, tx + tickLen, ty);
        noStroke();
        text(nf(this._fromNorm(n), 1, 1), tx + tickLen + 2, ty);
        stroke(this.theme.scaleTick);
      }
      pop();
    }

    if (this.showFader) {
      this._drawCapV(cx, lowY);   // low cap beneath
      this._drawCapV(cx, highY);  // high cap on top
    }

    const readoutTxt = this._fmt(this.valueLow) + ' – ' + this._fmt(this.valueHigh);
    this._drawReadout(cx, y + h - 12, readoutTxt);
    this._drawLabel(cx, y + 2);

    if (this._dragging === 'low')  this._drawTooltip(cx, lowY,  this._fmt(this.valueLow));
    if (this._dragging === 'high') this._drawTooltip(cx, highY, this._fmt(this.valueHigh));

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  _drawH() {
    const ty = this._hTrackY();
    const { x, y, width: w, height: h } = this;

    this._drawPanel(x, y, w, h);

    if (this._hovered && !this.disabled) {
      push(); noStroke(); fill(this.theme.hoverGlow); rect(x, y, w, h, 4); pop();
    }

    const trackH = 6;
    push();
    fill(this.theme.track); stroke(this.theme.trackStroke); strokeWeight(1);
    rect(this._hTrackLeft(), ty - trackH / 2, this._hTrackLen(), trackH, 2);
    pop();

    // Range fill
    const lowX  = this._lowX();
    const highX = this._highX();
    const gc    = drawingContext;
    gc.save();
    gc.fillStyle   = this.theme.capIndicator;
    gc.globalAlpha = 0.30;
    gc.fillRect(lowX, ty - trackH / 2 + 1, highX - lowX, trackH - 2);
    gc.restore();

    if (this.showScale) {
      const steps = 5; const tickLen = 4;
      push();
      stroke(this.theme.scaleTick); strokeWeight(1);
      fill(this.theme.scaleText); textSize(7); textAlign(CENTER, TOP);
      if (this.theme.font) textFont(this.theme.font);
      for (let i = 0; i <= steps; i++) {
        const n  = i / steps;
        const tx = this._hTrackLeft() + n * this._hTrackLen();
        const by = ty + trackH / 2 + 2;
        line(tx, by, tx, by + tickLen);
        noStroke();
        text(nf(this._fromNorm(n), 1, 1), tx, by + tickLen + 1);
        stroke(this.theme.scaleTick);
      }
      pop();
    }

    if (this.showFader) {
      this._drawCapH(lowX, ty);
      this._drawCapH(highX, ty);
    }

    if (this.label) {
      push(); noStroke(); fill(this.theme.label); textSize(9); textAlign(LEFT, TOP);
      if (this.theme.font) textFont(this.theme.font);
      text(this.label, x + 4, y + 2);
      pop();
    }
    const readoutTxt = this._fmt(this.valueLow) + ' – ' + this._fmt(this.valueHigh);
    this._drawReadout(x + w / 2, y + h - 13, readoutTxt);

    if (this._dragging === 'low')  this._drawTooltip(lowX,  y - 2, this._fmt(this.valueLow));
    if (this._dragging === 'high') this._drawTooltip(highX, y - 2, this._fmt(this.valueHigh));

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  // ── input ──────────────────────────────────────────────────────────────────

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _whichCap(mx, my) {
    if (this.horizontal) {
      const lowX  = this._lowX();
      const highX = this._highX();
      const hitL  = abs(mx - lowX)  <= this._capH / 2 && my >= this.y && my <= this.y + this.height;
      const hitH  = abs(mx - highX) <= this._capH / 2 && my >= this.y && my <= this.y + this.height;
      if (hitL && hitH) return mx <= (lowX + highX) / 2 ? 'low' : 'high';
      if (hitH) return 'high';
      if (hitL) return 'low';
    } else {
      const lowY  = this._lowY();
      const highY = this._highY();
      const hitL  = abs(my - lowY)  <= this._capH / 2 && mx >= this.x && mx <= this.x + this.width;
      const hitH  = abs(my - highY) <= this._capH / 2 && mx >= this.x && mx <= this.x + this.width;
      if (hitL && hitH) return my >= (lowY + highY) / 2 ? 'low' : 'high';
      if (hitH) return 'high';
      if (hitL) return 'low';
    }
    return null;
  }

  mousePressed() {
    if (this.disabled) return;
    const cap = this._whichCap(mouseX, mouseY);
    if (!cap) return;
    if (this._isDoubleClick()) {
      if (cap === 'low') this.valueLow  = this._defaultLow;
      else               this.valueHigh = this._defaultHigh;
      if (this.onChange) this.onChange({lo: this.valueLow, hi: this.valueHigh});
      if (this.onRelease) this.onRelease({lo: this.valueLow, hi: this.valueHigh});
      return;
    }
    this._dragging  = cap;
    this._dragStart = this.horizontal
      ? { pos: mouseX, valueLow: this.valueLow, valueHigh: this.valueHigh }
      : { pos: mouseY, valueLow: this.valueLow, valueHigh: this.valueHigh };
  }

  mouseReleased() {
    if (this._dragging) {
      this._dragging  = null;
      this._dragStart = null;
      if (this.onRelease) this.onRelease({lo: this.valueLow, hi: this.valueHigh});
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (!this._dragging || !this._dragStart) return;

    if (this.horizontal) {
      const delta = (mouseX - this._dragStart.pos) / this._hTrackLen();
      const n0L   = this._norm(this._dragStart.valueLow);
      const n0H   = this._norm(this._dragStart.valueHigh);
      if (this._dragging === 'low') {
        this.valueLow  = this._fromNorm(constrain(n0L + delta, 0, this._normHigh()));
      } else {
        this.valueHigh = this._fromNorm(constrain(n0H + delta, this._normLow(), 1));
      }
    } else {
      const delta = (this._dragStart.pos - mouseY) / this._trackLen();
      const n0L   = this._norm(this._dragStart.valueLow);
      const n0H   = this._norm(this._dragStart.valueHigh);
      if (this._dragging === 'low') {
        this.valueLow  = this._fromNorm(constrain(n0L + delta, 0, this._normHigh()));
      } else {
        this.valueHigh = this._fromNorm(constrain(n0H + delta, this._normLow(), 1));
      }
    }
    if (this.onChange) this.onChange({lo: this.valueLow, hi: this.valueHigh});
  }

  mouseWheel(e) {
    if (this.disabled || !this._hovered) return;
    const delta = (e.deltaY ?? e.delta ?? 0) * 0.001;
    if (this.horizontal) {
      const lowX  = this._lowX();
      const highX = this._highX();
      if (abs(mouseX - lowX) <= abs(mouseX - highX)) {
        this.valueLow  = this._fromNorm(constrain(this._normLow()  + delta, 0, this._normHigh()));
      } else {
        this.valueHigh = this._fromNorm(constrain(this._normHigh() + delta, this._normLow(), 1));
      }
    } else {
      const lowY  = this._lowY();
      const highY = this._highY();
      if (abs(mouseY - lowY) <= abs(mouseY - highY)) {
        this.valueLow  = this._fromNorm(constrain(this._normLow()  - delta, 0, this._normHigh()));
      } else {
        this.valueHigh = this._fromNorm(constrain(this._normHigh() - delta, this._normLow(), 1));
      }
    }
    if (this.onChange) this.onChange({lo: this.valueLow, hi: this.valueHigh});
    return false;
  }
}

window.RangeSlider = RangeSlider;

// ─── Panel ───────────────────────────────────────────────────────────────────
// Container that hosts ProControls positioned relative to the panel's
// top-left. Use .add(control) to attach controls.  Clips content, draws
// scrollbars when children extend beyond the panel bounds.

class Panel extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.width      = opts.width  ?? 300;
    this.height     = opts.height ?? 200;
    this._visible    = opts.visible    !== false;
    this._minimized  = opts.minimized  ?? false;
    this.minimizable = opts.minimizable !== false;
    this.movable     = opts.movable     !== false;
    this.resizable   = opts.resizable   ?? false;
    this._children  = [];
    this._scrollX   = 0;
    this._scrollY   = 0;
    this._sbW          = 8;    // scrollbar thickness px
    this._btnSz        = 10;   // minimize toggle button size px
    this._gripSz       = 12;   // resize grip hit area px
    this._dragSB       = null; // 'v' | 'h' | null
    this._dragSBRef    = null;
    this._draggingPanel = false;
    this._dragPanelOff  = null; // {dx, dy} offset from panel origin at drag start
    this._resizing      = false;
    this._gripHovered   = false;
    this._initX        = this.x;       // store initial state for double-click reset
    this._initY        = this.y;
    this._initW        = this.width;
    this._initH        = this.height;
    this._initMinimized = this._minimized;
    this._autoLayout   = { nextX: 8, nextY: 8, rightEdge: 8 };  // panel-specific auto-placement
  }

  get visible()    { return this._visible; }
  set visible(v)   {
    this._visible = !!v;
    if (!this._visible) {
      for (const c of this._children) { c._hovered = false; c._active = false; }
    }
  }

  get minimized()  { return this._minimized; }
  set minimized(v) {
    this._minimized = !!v;
    if (this._minimized) {
      for (const c of this._children) { c._hovered = false; c._active = false; }
    }
  }

  get scrollX()  { return this._scrollX; }
  set scrollX(v) { this._scrollX = constrain(v, 0, this._maxScrollX()); }
  get scrollY()  { return this._scrollY; }
  set scrollY(v) { this._scrollY = constrain(v, 0, this._maxScrollY()); }

  // Title bar is present only when label is set.
  get _titleH() { return this.label ? 20 : 0; }

  // Bounding box of the minimize/maximize toggle button (right side of title bar).
  _btnRect() {
    const titleH = this._titleH;
    if (!titleH) return null;
    const bx = this.x + this.width - this._btnSz - 5;
    const by = this.y + (titleH - this._btnSz) / 2;
    return { bx, by, bsz: this._btnSz };
  }

  _hitBtn(mx, my) {
    const r = this._btnRect();
    if (!r) return false;
    return mx >= r.bx && mx <= r.bx + r.bsz && my >= r.by && my <= r.by + r.bsz;
  }

  // De-register a control from the global loop and adopt it into this panel.
  add(control) {
    control._detach();
    control._parentPanel = this;
    this._children.push(control);
    this._attachPanelNotify(control);
    return this;
  }

  get values() { return this._data(); }

  // Wire up a child control so changes/releases fire panel.onChange / panel.onRelease.
  _attachPanelNotify(control) {
    const notifyChange  = () => { if (this.onChange)  this.onChange(this._data()); };
    const notifyRelease = () => { if (this.onRelease) this.onRelease(this._data()); };

    if (control instanceof XYPad) {
      const ucX = control.onChangeX, ucY = control.onChangeY;
      control.onChangeX = (...a) => { if (ucX) ucX(...a); notifyChange(); };
      control.onChangeY = (...a) => { if (ucY) ucY(...a); notifyChange(); };
      const ucR = control.onRelease;
      control.onRelease = (...a) => { if (ucR) ucR(...a); notifyRelease(); };
    } else if (control instanceof IconButton) {
      const uc = control.onClick;
      control.onClick = (...a) => { if (uc) uc(...a); notifyChange(); notifyRelease(); };
    } else {
      const ucC = control.onChange,  ucR = control.onRelease;
      control.onChange  = (...a) => { if (ucC) ucC(...a); notifyChange(); };
      control.onRelease = (...a) => { if (ucR) ucR(...a); notifyRelease(); };
    }
  }

  // Returns an object snapshot of all child control values.
  // Field names come from the control's label (spaces/punctuation stripped),
  // or ClassName + counter when there is no label (e.g. AnalogSlider1).
  _data() {
    const result = {}, counters = {};
    for (const c of this._children) {
      const val = this._controlValue(c);
      if (val === undefined) continue;
      result[this._fieldKey(c, counters)] = val;
    }
    return result;
  }

  _fieldKey(c, counters) {
    const lbl = (c.label ?? '').trim();
    if (lbl) return lbl.replace(/[^a-zA-Z0-9]/g, '');
    const name = c.constructor.name;
    counters[name] = (counters[name] ?? 0) + 1;
    return name + counters[name];
  }

  _controlValue(c) {
    if (c instanceof Markup || c instanceof Menu || c instanceof Panel ||
        c instanceof VUMeter || c instanceof LEDMeter || c instanceof ADSRDisplay)
      return undefined;
    if (c instanceof RangeSlider) return { low: c.valueLow, high: c.valueHigh };
    if (c instanceof XYPad)       return { x: c.valueX, y: c.valueY };
    if (c instanceof TagSelector) return [...c.selected];
    if (c instanceof MultiSlider || c instanceof MultiDial || c instanceof GridPad)
      return c.values;
    if (c instanceof Switch)         return c.states?.[c.state] ?? c.state;
    if (c instanceof Selector)       return c.options?.[c.state] ?? c.state;
    if (c instanceof SliderSelector) return c.options?.[c.state] ?? c.state;
    if (c instanceof IconButton)     return c.state;
    return c.value ?? null;
  }

  remove() {
    super.remove();
    this._children = [];
  }

  // ── Content / scroll geometry ───────────────────────────────────────────────
  _contentW() {
    let m = 0;
    for (const c of this._children) m = Math.max(m, c.x + (c.width ?? c.size ?? 50));
    return m;
  }
  _contentH() {
    let m = 0;
    for (const c of this._children) m = Math.max(m, c.y + (c.height ?? c.size ?? 50));
    return m;
  }

  _bodyH()  { return this.height - this._titleH; }
  _needsV() { return this._contentH() > this._bodyH(); }
  _needsH() { return this._contentW() > this.width;    }
  _viewW()  { return this.width    - (this._needsV() ? this._sbW : 0); }
  _viewH()  { return this._bodyH() - (this._needsH() ? this._sbW : 0); }
  _maxScrollX() { return Math.max(0, this._contentW() - this._viewW()); }
  _maxScrollY() { return Math.max(0, this._contentH() - this._viewH()); }

  // Drawn height changes when minimized — only the title bar is shown.
  _drawnH() { return (this._minimized && this._titleH) ? this._titleH : this.height; }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this._drawnH();
  }
  _inResizeHandle(mx, my) {
    if (!this.resizable || this._minimized) return false;
    const rh = this._drawnH();
    return mx >= this.x + this.width - this._gripSz && mx <= this.x + this.width &&
           my >= this.y + rh - this._gripSz       && my <= this.y + rh;
  }
  _inViewport(mx, my) {
    if (this._minimized) return false;
    return mx >= this.x && mx <= this.x + this._viewW() &&
           my >= this.y + this._titleH && my <= this.y + this._titleH + this._viewH();
  }

  // Temporarily remap mouseX/mouseY to panel-local content coords while calling fn.
  _withOffsetMouse(fn) {
    const ox = window.mouseX, oy = window.mouseY;
    window.mouseX = ox - this.x + this._scrollX;
    window.mouseY = oy - (this.y + this._titleH) + this._scrollY;
    try { fn(); } finally { window.mouseX = ox; window.mouseY = oy; }
  }

  // ── Event handlers ──────────────────────────────────────────────────────────
  mouseMoved() {
    if (!this._visible) return;

    // Resize — stretch width/height to follow mouse
    if (this._resizing) {
      this.width  = Math.max(60, mouseX - this.x);
      this.height = Math.max(this._titleH + 40, mouseY - this.y);
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.style.cursor = 'nwse-resize';
      return;
    }

    // Panel drag — move origin to follow mouse
    if (this._draggingPanel && this._dragPanelOff) {
      this.x = mouseX - this._dragPanelOff.dx;
      this.y = mouseY - this._dragPanelOff.dy;
      return;
    }

    if (this._dragSB === 'v' && this._dragSBRef) {
      const dy    = mouseY - this._dragSBRef.my;
      const vh    = this._viewH();
      const cH    = this._contentH();
      const tH    = Math.max(20, (vh / cH) * vh);
      const range = vh - tH;
      if (range > 0) this._scrollY = constrain(this._dragSBRef.scrollY + dy * (this._maxScrollY() / range), 0, this._maxScrollY());
      return;
    }
    if (this._dragSB === 'h' && this._dragSBRef) {
      const dx    = mouseX - this._dragSBRef.mx;
      const vw    = this._viewW();
      const cW    = this._contentW();
      const tW    = Math.max(20, (vw / cW) * vw);
      const range = vw - tW;
      if (range > 0) this._scrollX = constrain(this._dragSBRef.scrollX + dx * (this._maxScrollX() / range), 0, this._maxScrollX());
      return;
    }

    if (this._inViewport(mouseX, mouseY)) {
      this._withOffsetMouse(() => { for (const c of this._children) c.mouseMoved(); });
    } else {
      const ox = window.mouseX, oy = window.mouseY;
      window.mouseX = -99999; window.mouseY = -99999;
      for (const c of this._children) c.mouseMoved();
      window.mouseX = ox; window.mouseY = oy;
    }

    // Resize cursor — only update on enter/leave to avoid stomping other controls' cursors
    if (this.resizable && !this._minimized) {
      const wasGrip = this._gripHovered;
      this._gripHovered = this._inResizeHandle(mouseX, mouseY);
      if (this._gripHovered !== wasGrip) {
        const canvas = document.querySelector('canvas');
        if (canvas) canvas.style.cursor = this._gripHovered ? 'nwse-resize' : '';
      }
    }
  }

  mousePressed() {
    if (!this._visible || !this._inBounds(mouseX, mouseY)) return;

    // Title bar interactions — double-click to reset, or minimize/drag
    if (this._titleH > 0 && mouseY < this.y + this._titleH) {
      // Double-click on title bar resets to initial position, size, and minimized state
      if (this._isDoubleClick() && (this.movable || this.resizable || this.minimizable)) {
        this.x = this._initX;
        this.y = this._initY;
        this.width = this._initW;
        this.height = this._initH;
        this.minimized = this._initMinimized;
        return;
      }

      // Minimize/maximize toggle button
      if (this.minimizable && this._hitBtn(mouseX, mouseY)) {
        this.minimized = !this._minimized;
        return;
      }

      // Title bar drag — grab anywhere else on the bar to move the panel
      if (this.movable) {
        this._draggingPanel = true;
        this._dragPanelOff  = { dx: mouseX - this.x, dy: mouseY - this.y };
        return;
      }
    }

    if (this._minimized) return;

    // Resize grip — takes priority over scrollbar drag in the corner
    if (this._inResizeHandle(mouseX, mouseY)) {
      this._resizing = true;
      return;
    }

    if (this._needsV() && mouseX >= this.x + this._viewW()) {
      this._dragSB    = 'v';
      this._dragSBRef = { my: mouseY, scrollY: this._scrollY };
      return;
    }
    if (this._needsH() && mouseY >= this.y + this._titleH + this._viewH()) {
      this._dragSB    = 'h';
      this._dragSBRef = { mx: mouseX, scrollX: this._scrollX };
      return;
    }
    if (this._inViewport(mouseX, mouseY)) {
      this._withOffsetMouse(() => { for (const c of this._children) c.mousePressed(); });
    }
  }

  mouseReleased() {
    if (!this._visible) return;
    if (this._resizing) {
      this._resizing    = false;
      this._gripHovered = false;
      const canvas = document.querySelector('canvas');
      if (canvas) canvas.style.cursor = '';
    }
    this._draggingPanel = false;
    this._dragPanelOff  = null;
    this._dragSB    = null;
    this._dragSBRef = null;
    if (!this._minimized) {
      this._withOffsetMouse(() => { for (const c of this._children) c.mouseReleased(); });
    }
  }

  mouseWheel(e) {
    if (!this._visible || this._minimized || !this._inBounds(mouseX, mouseY)) return;

    if (this._children.some(c => c._hovered)) {
      this._withOffsetMouse(() => { for (const c of this._children) c.mouseWheel(e); });
      return false;
    }

    const dy = e.deltaY ?? e.delta ?? 0;
    const dx = e.deltaX ?? 0;
    if (this._needsV()) this._scrollY = constrain(this._scrollY + dy * 0.4, 0, this._maxScrollY());
    if (this._needsH()) this._scrollX = constrain(this._scrollX + dx * 0.4, 0, this._maxScrollX());
    return false;
  }

  _tickSpring() {
    for (const c of this._children) c._tickSpring();
  }

  // ── Drawing ─────────────────────────────────────────────────────────────────
  draw() {
    if (!this._visible) return;

    const gc       = drawingContext;
    const { x, y, width, theme } = this;
    const titleH   = this._titleH;
    const drawnH   = this._drawnH();
    const contentY = y + titleH;

    // Outer border — shrinks to just titleH when minimized
    push();
    fill(theme.panel);
    stroke(theme.panelStroke);
    strokeWeight(1);
    rect(x, y, width, drawnH, 4);
    pop();

    // Title bar (only when label is set)
    if (titleH > 0) {
      _drawBevelTitleBar(theme, x, y, width, titleH, this._minimized, this.label);
      if (this.minimizable) this._drawToggleBtn();
    }

    if (this._minimized) return;

    // Clip content viewport and draw children
    const needsV  = this._needsV();
    const needsH  = this._needsH();
    const viewW   = this._viewW();
    const viewH   = this._viewH();

    gc.save();
    gc.beginPath();
    gc.rect(x + 1, contentY + 1, viewW - 2, viewH - 2);
    gc.clip();

    gc.save();
    gc.translate(x - this._scrollX, contentY - this._scrollY);
    for (const c of this._children) c.draw();
    gc.restore();

    gc.restore();

    if (needsV) this._drawVScrollBar(viewW, viewH, contentY);
    if (needsH) this._drawHScrollBar(viewW, viewH, contentY);
    if (this.resizable) this._drawResizeHandle();
  }

  _drawResizeHandle() {
    const { x, y, width, theme } = this;
    const rh  = this._drawnH();
    const hov = this._inResizeHandle(mouseX, mouseY) || this._resizing;
    const col = hov
      ? theme.capHighlight
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.9);
    push();
    noStroke();
    fill(col);
    // Six dots in a triangular grid at the bottom-right corner
    const cx = x + width, cy = y + rh;
    const d = 1.8, sp = 4;
    ellipse(cx - 3,        cy - 3,        d, d);
    ellipse(cx - 3 - sp,   cy - 3,        d, d);
    ellipse(cx - 3,        cy - 3 - sp,   d, d);
    ellipse(cx - 3 - sp*2, cy - 3,        d, d);
    ellipse(cx - 3 - sp,   cy - 3 - sp,   d, d);
    ellipse(cx - 3,        cy - 3 - sp*2, d, d);
    pop();
  }

  _drawToggleBtn() {
    const r = this._btnRect();
    if (!r) return;
    const { bx, by, bsz } = r;
    const hovered = mouseX >= bx && mouseX <= bx + bsz &&
                    mouseY >= by && mouseY <= by + bsz;
    const { theme } = this;

    push();
    // Button background
    noStroke();
    fill(hovered
      ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.5)
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.6));
    rect(bx, by, bsz, bsz, 2);

    // Icon: "–" when expanded, "+" when minimized
    stroke(theme.label);
    strokeWeight(1.5);
    noFill();
    const cx = bx + bsz / 2;
    const cy = by + bsz / 2;
    const arm = bsz * 0.28;
    line(cx - arm, cy, cx + arm, cy);           // horizontal bar (both states)
    if (this._minimized) line(cx, cy - arm, cx, cy + arm); // vertical bar (+ when minimized)
    pop();
  }

  _drawVScrollBar(viewW, viewH, contentY) {
    const { x, theme } = this;
    const cH   = this._contentH();
    const tH   = Math.max(20, (viewH / cH) * viewH);
    const maxS = this._maxScrollY();
    const ty   = contentY + (maxS > 0 ? (this._scrollY / maxS) * (viewH - tH) : 0);
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color(theme.track), 0.4));
    rect(x + viewW, contentY, this._sbW, viewH, 2);
    fill(lerpColor(color(theme.capBody), color(theme.capHighlight), 0.3));
    rect(x + viewW + 1, ty, this._sbW - 2, tH, 2);
    pop();
  }

  _drawHScrollBar(viewW, viewH, contentY) {
    const { x, theme } = this;
    const cW   = this._contentW();
    const tW   = Math.max(20, (viewW / cW) * viewW);
    const maxS = this._maxScrollX();
    const tx   = x + (maxS > 0 ? (this._scrollX / maxS) * (viewW - tW) : 0);
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color(theme.track), 0.4));
    rect(x, contentY + viewH, viewW, this._sbW, 2);
    fill(lerpColor(color(theme.capBody), color(theme.capHighlight), 0.3));
    rect(tx, contentY + viewH + 1, tW, this._sbW - 2, 2);
    pop();
  }
}

window.Panel = Panel;

// ─── Bevel ───────────────────────────────────────────────────────────────────
// Decorative separator line.  Pass x for a vertical bevel, y for horizontal.
// Values can be pixels (number) or percent strings ('50%') — percentages are
// resolved against the canvas or the parent Panel's content area.

class Bevel extends ProControl {
  constructor(opts = {}) {
    // Suppress auto-placement entirely — Bevel is a pure cosmetic element.
    super(Object.assign({ min: 0, max: 1, value: 0,
                          x: opts.x !== undefined ? (typeof opts.x === 'number' ? opts.x : 0) : 0,
                          y: opts.y !== undefined ? (typeof opts.y === 'number' ? opts.y : 0) : 0 },
                        opts));
    this._bx   = opts.x !== undefined ? opts.x : null; // null = no vertical bevel
    this._by   = opts.y !== undefined ? opts.y : null; // null = no horizontal bevel
    this.style = opts.style ?? 'thin'; // 'thin' | 'deep' | 'color'
    this.width  = 0;
    this.height = 0;
    this._parentPanel = null; // set by Panel.add()
    this._autoLayout   = { nextX: 8, nextY: 8, rightEdge: 8 };  // panel-specific auto-placement
  }

  // Resolve a px-or-percent value against a total dimension.
  _resolvePos(val, total) {
    if (val === null || val === undefined) return null;
    if (typeof val === 'string' && val.trim().endsWith('%')) {
      return total * (parseFloat(val) / 100);
    }
    return +val;
  }

  draw() {
    this._markDrawn();
    const containerW = this._parentPanel ? this._parentPanel._viewW() : width;
    const containerH = this._parentPanel ? this._parentPanel._viewH() : height;

    const bx = this._resolvePos(this._bx, containerW);
    const by = this._resolvePos(this._by, containerH);

    push();
    strokeWeight(1);
    noFill();

    if (this.style === 'color') {
      const c = color(this.theme.capIndicator);
      const r = red(c), g = green(c), b = blue(c);
      if (bx !== null) {
        stroke(r, g, b, 180); line(bx,     0, bx,     containerH);
        stroke(r, g, b,  60); line(bx + 1, 0, bx + 1, containerH);
      }
      if (by !== null) {
        stroke(r, g, b, 180); line(0, by,     containerW, by);
        stroke(r, g, b,  60); line(0, by + 1, containerW, by + 1);
      }
    } else if (this.style === 'deep') {
      if (bx !== null) {
        stroke(0, 0, 0, 90);      line(bx,     0, bx,     containerH);
        stroke(0, 0, 0, 60);      line(bx + 1, 0, bx + 1, containerH);
        stroke(255, 255, 255, 30); line(bx + 2, 0, bx + 2, containerH);
        stroke(255, 255, 255, 12); line(bx + 3, 0, bx + 3, containerH);
      }
      if (by !== null) {
        stroke(0, 0, 0, 90);      line(0, by,     containerW, by);
        stroke(0, 0, 0, 60);      line(0, by + 1, containerW, by + 1);
        stroke(255, 255, 255, 30); line(0, by + 2, containerW, by + 2);
        stroke(255, 255, 255, 12); line(0, by + 3, containerW, by + 3);
      }
    } else {
      if (bx !== null) {
        stroke(0, 0, 0, 60);      line(bx,     0, bx,     containerH);
        stroke(255, 255, 255, 30); line(bx + 1, 0, bx + 1, containerH);
      }
      if (by !== null) {
        stroke(0, 0, 0, 60);      line(0, by,     containerW, by);
        stroke(255, 255, 255, 30); line(0, by + 1, containerW, by + 1);
      }
    }

    // Label — rounded badge centered on the line
    if (this.label) {
      textSize(9);
      textStyle(NORMAL);
      if (this.theme.font) textFont(this.theme.font);
      textAlign(CENTER, CENTER);

      const pad     = 6;
      const rh      = 14;
      const radius  = rh / 2;
      const lineOff = this.style === 'deep' ? 1.5 : 0.5; // visual centre of bevel

      if (by !== null) {
        const cx  = containerW / 2;
        const mid = by + lineOff;
        const tw  = textWidth(this.label);
        const rw  = tw + pad * 2;
        fill(this.theme.panel);
        stroke(this.theme.panelStroke);
        strokeWeight(1);
        rect(cx - rw / 2, mid - rh / 2, rw, rh, radius);
        noStroke();
        fill(this.theme.scaleText);
        text(this.label, cx, mid);
      }

      if (bx !== null) {
        const cy  = containerH / 2;
        const mid = bx + lineOff;
        push();
        translate(mid, cy);
        rotate(-HALF_PI);
        const tw = textWidth(this.label);
        const rw = tw + pad * 2;
        fill(this.theme.panel);
        stroke(this.theme.panelStroke);
        strokeWeight(1);
        rect(-rw / 2, -rh / 2, rw, rh, radius);
        noStroke();
        fill(this.theme.scaleText);
        text(this.label, 0, 0);
        pop();
      }
    }

    pop();
  }

  // Bevel has no interaction
  mouseMoved()   {}
  mousePressed() {}
  mouseReleased(){}
  mouseDragged() {}
  mouseWheel()   {}
}

window.Bevel = Bevel;

// ─── MessageDialog ───────────────────────────────────────────────────────────
// A movable dialog that displays a formatted message and optional action buttons.
// opts: x, y, message, buttons[], label, width, movable,
//       onButton(index, label), theme

class MessageDialog extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.message  = opts.message  ?? 'Message';
    this.buttons  = opts.buttons  ?? ['OK'];
    this.movable  = opts.movable  !== false;
    this.onButton = opts.onButton ?? null;

    this._padX      = 14;
    this._padY      = 10;
    this._lineH     = 15;
    this._textSz    = 11;
    this._btnH      = 22;
    this._btnPadX   = 12;
    this._btnGap    = 6;
    this._btnRowH   = this.buttons.length > 0 ? this._btnH + this._padY + 8 : 0;

    this._draggingPanel = false;
    this._dragPanelOff  = null;
    this._hoveredBtn    = -1;
    this._wrappedLines  = [];
    this._layoutDirty   = true;

    // Estimate button row width at construction; height resolved on first draw
    const charPx    = 6.5;
    const btnWidths = this.buttons.map(b => Math.ceil(b.length * charPx) + this._btnPadX * 2);
    const btnRowW   = btnWidths.length > 0
      ? btnWidths.reduce((a, b) => a + b, 0) + (btnWidths.length - 1) * this._btnGap + this._padX * 2
      : 0;
    this.width  = opts.width ?? Math.max(220, btnRowW);
    this.height = opts.height ?? 100;  // updated on first draw
  }

  get _titleH() { return this.label ? 20 : 0; }

  _buildLayout() {
    this._layoutDirty = false;
    const contentW = this.width - this._padX * 2;
    push();
    textSize(this._textSz);
    if (this.theme.font) textFont(this.theme.font);
    this._wrappedLines = _dialogWrapText(this.message, contentW);
    pop();
    const textH = this._wrappedLines.length * this._lineH;
    this.height = this._titleH + this._padY + textH + this._padY + this._btnRowH;
  }

  _btnRects() {
    if (!this.buttons.length) return [];
    push();
    textSize(10);
    if (this.theme.font) textFont(this.theme.font);
    const widths = this.buttons.map(b => textWidth(b) + this._btnPadX * 2);
    pop();
    const totalW = widths.reduce((a, b) => a + b, 0) + (widths.length - 1) * this._btnGap;
    const rowY   = this.y + this.height - this._btnRowH + 8;
    let bx       = this.x + (this.width - totalW) / 2;
    return widths.map((w, i) => {
      const r = { x: bx, y: rowY, w, h: this._btnH, label: this.buttons[i] };
      bx += w + this._btnGap;
      return r;
    });
  }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _hitBtnIndex(mx, my) {
    const rects = this._btnRects();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
    }
    return -1;
  }

  draw() {
    this._markDrawn();
    if (this._layoutDirty) this._buildLayout();

    const gc              = drawingContext;
    const { x, y, width: w, height: h, theme } = this;
    const titleH          = this._titleH;

    // Outer panel
    push();
    fill(theme.panel);
    stroke(theme.panelStroke);
    strokeWeight(1);
    rect(x, y, w, h, 4);
    pop();

    // Title bar
    if (titleH > 0) {
      _drawBevelTitleBar(theme, x, y, w, titleH, false, this.label);
    }

    // Message text
    push();
    noStroke();
    fill(theme.label);
    textSize(this._textSz);
    textAlign(LEFT, TOP);
    if (theme.font) textFont(theme.font);
    const textStartY = y + titleH + this._padY;
    for (let i = 0; i < this._wrappedLines.length; i++) {
      text(this._wrappedLines[i], x + this._padX, textStartY + i * this._lineH);
    }
    pop();

    // Button row separator line
    if (this.buttons.length > 0) {
      push();
      stroke(theme.panelStroke);
      strokeWeight(1);
      line(x, y + h - this._btnRowH, x + w, y + h - this._btnRowH);
      pop();
    }

    // Buttons
    if (this.buttons.length > 0) {
      const rects = this._btnRects();
      push();
      textSize(10);
      textAlign(CENTER, CENTER);
      if (theme.font) textFont(theme.font);
      for (let i = 0; i < rects.length; i++) {
        const r   = rects[i];
        const hov = i === this._hoveredBtn;
        fill(hov
          ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.4)
          : lerpColor(color(theme.panel), color(theme.panelStroke), 0.25));
        stroke(theme.panelStroke);
        strokeWeight(1);
        rect(r.x, r.y, r.w, r.h, 3);
        noStroke();
        fill(hov ? theme.capHighlight : theme.label);
        text(r.label, r.x + r.w / 2, r.y + r.h / 2);
      }
      pop();
    }

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  mousePressed() {
    if (!this._inBounds(mouseX, mouseY)) return;

    // Title bar drag start
    if (this.movable && this._titleH > 0 && mouseY < this.y + this._titleH) {
      this._draggingPanel = true;
      this._dragPanelOff  = { dx: mouseX - this.x, dy: mouseY - this.y };
      return;
    }

    // Button click
    const bi = this._hitBtnIndex(mouseX, mouseY);
    if (bi !== -1) {
      if (this.onButton) this.onButton(bi, this.buttons[bi]);
      this.remove();
    }
  }

  mouseReleased() {
    this._draggingPanel = false;
    this._dragPanelOff  = null;
  }

  mouseMoved() {
    if (this._draggingPanel && this._dragPanelOff) {
      this.x = mouseX - this._dragPanelOff.dx;
      this.y = mouseY - this._dragPanelOff.dy;
      return;
    }
    this._hoveredBtn = this._inBounds(mouseX, mouseY)
      ? this._hitBtnIndex(mouseX, mouseY)
      : -1;
  }
}

window.MessageDialog = MessageDialog;

// ─── InputDialog ─────────────────────────────────────────────────────────────
// Like MessageDialog but adds a single-line text input between the message and
// the buttons.  Keyboard events are captured via a document listener while the
// field is focused; the listener is removed on blur or remove().
// opts: x, y, message, buttons[], label, inputValue, inputPlaceholder, width,
//       movable, onButton(index, label), onSubmit(value), theme

class InputDialog extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.message          = opts.message          ?? 'Enter a value:';
    this.buttons          = opts.buttons          ?? ['OK', 'Cancel'];
    this.movable          = opts.movable          !== false;
    this.onButton         = opts.onButton         ?? null;
    this.inputValue       = opts.inputValue       ?? '';
    this.inputPlaceholder = opts.inputPlaceholder ?? '';
    this.onSubmit         = opts.onSubmit         ?? null;

    this._padX        = 14;
    this._padY        = 10;
    this._lineH       = 15;
    this._textSz      = 11;
    this._inputH      = 26;
    this._btnH        = 22;
    this._btnPadX     = 12;
    this._btnGap      = 6;
    this._btnRowH     = this.buttons.length > 0 ? this._btnH + this._padY + 8 : 0;

    this._draggingPanel = false;
    this._dragPanelOff  = null;
    this._hoveredBtn    = -1;
    this._inputFocused  = false;
    this._cursorPos     = this.inputValue.length;
    this._cursorMs      = 0;
    this._textScrollX   = 0;
    this._wrappedLines  = [];
    this._layoutDirty   = true;

    const charPx    = 6.5;
    const btnWidths = this.buttons.map(b => Math.ceil(b.length * charPx) + this._btnPadX * 2);
    const btnRowW   = btnWidths.length > 0
      ? btnWidths.reduce((a, b) => a + b, 0) + (btnWidths.length - 1) * this._btnGap + this._padX * 2
      : 0;
    this.width  = opts.width ?? Math.max(220, btnRowW);
    this.height = opts.height ?? 100;

    this._initX = this.x;      // store initial position for double-click reset
    this._initY = this.y;
    this._initW = this.width;
    this._initH = this.height;

    this._keyHandler = (e) => this._handleKey(e);
  }

  get _titleH() { return this.label ? 20 : 0; }

  _buildLayout() {
    this._layoutDirty = false;
    push();
    textSize(this._textSz);
    if (this.theme.font) textFont(this.theme.font);
    this._wrappedLines = _dialogWrapText(this.message, this.width - this._padX * 2);
    pop();
    const textH  = this._wrappedLines.length * this._lineH;
    const msgGap = textH > 0 ? this._padY : 0;
    this.height  = this._titleH + this._padY + textH + msgGap
                 + this._inputH + this._padY + this._btnRowH;
  }

  _inputRect() {
    const textH  = this._wrappedLines.length * this._lineH;
    const msgGap = textH > 0 ? this._padY : 0;
    const iy     = this.y + this._titleH + this._padY + textH + msgGap;
    return { x: this.x + this._padX, y: iy, w: this.width - this._padX * 2, h: this._inputH };
  }

  _btnRects() {
    if (!this.buttons.length) return [];
    push();
    textSize(10);
    if (this.theme.font) textFont(this.theme.font);
    const widths = this.buttons.map(b => textWidth(b) + this._btnPadX * 2);
    pop();
    const totalW = widths.reduce((a, b) => a + b, 0) + (widths.length - 1) * this._btnGap;
    const rowY   = this.y + this.height - this._btnRowH + 8;
    let bx       = this.x + (this.width - totalW) / 2;
    return widths.map((w, i) => {
      const r = { x: bx, y: rowY, w, h: this._btnH, label: this.buttons[i] };
      bx += w + this._btnGap;
      return r;
    });
  }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  _hitBtnIndex(mx, my) {
    const rects = this._btnRects();
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) return i;
    }
    return -1;
  }

  _handleKey(e) {
    if (!this._inputFocused) return;
    const v   = this.inputValue;
    const pos = this._cursorPos;

    if (e.key === 'Enter') {
      const val = this.inputValue;
      if (this.onSubmit) this.onSubmit(val);
      if (this.onButton) this.onButton(this.buttons.length - 1, this.buttons[this.buttons.length - 1], val);
      this.remove();
      e.preventDefault();
      return;
    } else if (e.key === 'Backspace') {
      if (pos > 0) { this.inputValue = v.slice(0, pos - 1) + v.slice(pos); this._cursorPos = pos - 1; }
    } else if (e.key === 'Delete') {
      if (pos < v.length) this.inputValue = v.slice(0, pos) + v.slice(pos + 1);
    } else if (e.key === 'ArrowLeft')  { this._cursorPos = Math.max(0, pos - 1); }
    else if (e.key === 'ArrowRight')   { this._cursorPos = Math.min(v.length, pos + 1); }
    else if (e.key === 'Home')         { this._cursorPos = 0; }
    else if (e.key === 'End')          { this._cursorPos = v.length; }
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      this.inputValue = v.slice(0, pos) + e.key + v.slice(pos);
      this._cursorPos = pos + 1;
    } else { return; }

    this._cursorMs = millis();
    e.preventDefault();
  }

  _focus() {
    if (this._inputFocused) return;
    this._inputFocused = true;
    this._cursorMs     = millis();
    document.addEventListener('keydown', this._keyHandler);
  }

  _blur() {
    if (!this._inputFocused) return;
    this._inputFocused = false;
    document.removeEventListener('keydown', this._keyHandler);
  }

  remove() {
    super.remove();
    this._blur();
  }

  draw() {
    this._markDrawn();
    if (this._layoutDirty) this._buildLayout();

    const gc = drawingContext;
    const { x, y, width: w, height: h, theme } = this;
    const titleH = this._titleH;

    // Outer panel
    push();
    fill(theme.panel);
    stroke(theme.panelStroke);
    strokeWeight(1);
    rect(x, y, w, h, 4);
    pop();

    // Title bar
    if (titleH > 0) _drawBevelTitleBar(theme, x, y, w, titleH, false, this.label);

    // Message text
    if (this._wrappedLines.length > 0) {
      push();
      noStroke();
      fill(theme.label);
      textSize(this._textSz);
      textAlign(LEFT, TOP);
      if (theme.font) textFont(theme.font);
      const ty = y + titleH + this._padY;
      for (let i = 0; i < this._wrappedLines.length; i++) {
        text(this._wrappedLines[i], x + this._padX, ty + i * this._lineH);
      }
      pop();
    }

    // Input box background
    const ir      = this._inputRect();
    const focused = this._inputFocused;
    push();
    fill(focused ? lerpColor(color(theme.track), color(theme.panel), 0.4) : theme.track);
    stroke(focused ? theme.capIndicator : theme.panelStroke);
    strokeWeight(focused ? 1.5 : 1);
    rect(ir.x, ir.y, ir.w, ir.h, 3);
    pop();

    // Text + cursor, clipped to box interior
    const innerPad = 6;
    const maxW     = ir.w - innerPad * 2;

    push();
    textSize(11);
    if (theme.font) textFont(theme.font);
    const toCursor = textWidth(this.inputValue.slice(0, this._cursorPos));
    pop();

    if (toCursor - this._textScrollX > maxW) this._textScrollX = toCursor - maxW;
    if (toCursor < this._textScrollX)        this._textScrollX = toCursor;
    this._textScrollX = Math.max(0, this._textScrollX);

    gc.save();
    gc.beginPath();
    gc.rect(ir.x + 2, ir.y + 2, ir.w - 4, ir.h - 4);
    gc.clip();

    push();
    noStroke();
    textSize(11);
    textAlign(LEFT, CENTER);
    if (theme.font) textFont(theme.font);
    if (this.inputValue) {
      fill(theme.readout);
      text(this.inputValue, ir.x + innerPad - this._textScrollX, ir.y + ir.h / 2);
    } else if (this.inputPlaceholder && !focused) {
      fill(theme.scaleText);
      text(this.inputPlaceholder, ir.x + innerPad, ir.y + ir.h / 2);
    }
    if (focused && (millis() - this._cursorMs) % 1000 < 500) {
      const cx = ir.x + innerPad + toCursor - this._textScrollX;
      stroke(theme.capIndicator);
      strokeWeight(1.5);
      line(cx, ir.y + 5, cx, ir.y + ir.h - 5);
    }
    pop();

    gc.restore();

    // Button row separator + buttons
    if (this.buttons.length > 0) {
      push();
      stroke(theme.panelStroke);
      strokeWeight(1);
      line(x, y + h - this._btnRowH, x + w, y + h - this._btnRowH);
      pop();

      const rects = this._btnRects();
      push();
      textSize(10);
      textAlign(CENTER, CENTER);
      if (theme.font) textFont(theme.font);
      for (let i = 0; i < rects.length; i++) {
        const r   = rects[i];
        const hov = i === this._hoveredBtn;
        fill(hov
          ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.4)
          : lerpColor(color(theme.panel), color(theme.panelStroke), 0.25));
        stroke(theme.panelStroke);
        strokeWeight(1);
        rect(r.x, r.y, r.w, r.h, 3);
        noStroke();
        fill(hov ? theme.capHighlight : theme.label);
        text(r.label, r.x + r.w / 2, r.y + r.h / 2);
      }
      pop();
    }

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  mousePressed() {
    if (!this._inBounds(mouseX, mouseY)) { this._blur(); return; }

    // Title bar interactions — double-click to reset, or drag
    if (this._titleH > 0 && mouseY < this.y + this._titleH) {
      // Double-click on title bar resets to initial position and size
      if (this._isDoubleClick() && this.movable) {
        this.x = this._initX;
        this.y = this._initY;
        this.width = this._initW;
        this.height = this._initH;
        return;
      }

      // Title bar drag
      if (this.movable) {
        this._blur();
        this._draggingPanel = true;
        this._dragPanelOff  = { dx: mouseX - this.x, dy: mouseY - this.y };
        return;
      }
    }

    // Input field click — focus and position cursor
    const ir = this._inputRect();
    if (mouseX >= ir.x && mouseX <= ir.x + ir.w && mouseY >= ir.y && mouseY <= ir.y + ir.h) {
      this._focus();
      push();
      textSize(11);
      if (this.theme.font) textFont(this.theme.font);
      const clickX = mouseX - ir.x - 6 + this._textScrollX;
      let best = 0, bestDist = Math.abs(clickX);
      for (let i = 1; i <= this.inputValue.length; i++) {
        const d = Math.abs(textWidth(this.inputValue.slice(0, i)) - clickX);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      this._cursorPos = best;
      pop();
      return;
    }

    this._blur();

    // Button click
    const bi = this._hitBtnIndex(mouseX, mouseY);
    if (bi !== -1) {
      const val = this.inputValue;
      if (bi === this.buttons.length - 1 && this.onSubmit) this.onSubmit(val);
      if (this.onButton) this.onButton(bi, this.buttons[bi], val);
      this.remove();
    }
  }

  mouseReleased() {
    this._draggingPanel = false;
    this._dragPanelOff  = null;
    if (this.onRelease) this.onRelease(this.inputValue);
  }

  mouseMoved() {
    if (this._draggingPanel && this._dragPanelOff) {
      this.x = mouseX - this._dragPanelOff.dx;
      this.y = mouseY - this._dragPanelOff.dy;
      return;
    }
    this._hoveredBtn = this._inBounds(mouseX, mouseY)
      ? this._hitBtnIndex(mouseX, mouseY)
      : -1;
  }
}

window.InputDialog = InputDialog;

// ─── IconButton ───────────────────────────────────────────────────────────────
// A square push-button or toggle that renders a Material Symbols icon.
// Requires in <head>:
//   <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=block" rel="stylesheet">
// opts: x, y, icon (ligature string), size, label (inside button below icon),
//       toggle, state, iconSize, onClick(state?), disabled, theme

class IconButton extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.icon    = opts.icon    ?? 'star';
    this.size    = opts.size    ?? 44;
    this.toggle  = opts.toggle  ?? false;
    this.state   = opts.state   ?? false;
    this.onChange = opts.onChange ?? null;
    this.onRelease = opts.onRelease ?? null;
    this.onClick = opts.onClick ?? null;
    this._iconSz = opts.iconSize ?? Math.round(this.size * 0.58);
    this.width   = this.size;
    this.height  = this.size;
  }

  _containsPoint(mx, my) {
    return mx >= this.x && mx <= this.x + this.size &&
           my >= this.y && my <= this.y + this.size;
  }

  draw() {
    this._markDrawn();
    const { x, y, theme } = this;
    const sz   = this.size;
    const cx   = x + sz / 2;
    const cy   = y + sz / 2;
    const on   = this.toggle && this.state;
    const pr   = this._active;
    const r    = 5;
    const pad  = 3;  // inset from panel edge to button face
    const bx   = x + pad, by = y + pad;
    const bw   = sz - pad * 2, bh = sz - pad * 2;

    // Panel background
    this._drawPanel(x, y, sz, sz);

    // ── Button face ──────────────────────────────────────────────────────────
    const gc = drawingContext;
    gc.save();
    gc.beginPath();
    if (gc.roundRect) gc.roundRect(bx, by, bw, bh, r); else gc.rect(bx, by, bw, bh);
    gc.clip();

    // Base fill: capIndicator when on, capBody otherwise
    gc.fillStyle = on ? theme.capIndicator : theme.capBody;
    gc.fillRect(bx, by, bw, bh);

    // Hover tint
    if (this._hovered && !pr && !on && !this.disabled) {
      gc.fillStyle = 'rgba(255,255,255,0.10)';
      gc.fillRect(bx, by, bw, bh);
    }

    // Gradient overlay (top-light → bottom-dark when raised; reversed when pressed)
    const grad = gc.createLinearGradient(bx, by, bx, by + bh);
    if (pr) {
      grad.addColorStop(0,   'rgba(0,0,0,0.20)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.06)');
      grad.addColorStop(1,   'rgba(255,255,255,0.12)');
    } else {
      grad.addColorStop(0,   'rgba(255,255,255,0.30)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.08)');
      grad.addColorStop(1,   'rgba(0,0,0,0.22)');
    }
    gc.fillStyle = grad;
    gc.fillRect(bx, by, bw, bh);
    gc.restore();

    // ── Bevel edges ──────────────────────────────────────────────────────────
    gc.save();
    gc.lineWidth = 1;
    // Top + left
    gc.strokeStyle = pr ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.55)';
    gc.beginPath();
    gc.moveTo(bx + 1.5, by + bh - 1.5);
    gc.lineTo(bx + 1.5, by + 1.5);
    gc.lineTo(bx + bw - 1.5, by + 1.5);
    gc.stroke();
    // Bottom + right
    gc.strokeStyle = pr ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.40)';
    gc.beginPath();
    gc.moveTo(bx + 1.5, by + bh - 1.5);
    gc.lineTo(bx + bw - 1.5, by + bh - 1.5);
    gc.lineTo(bx + bw - 1.5, by + 1.5);
    gc.stroke();
    // Outer border
    gc.strokeStyle = theme.panelStroke;
    gc.beginPath();
    if (gc.roundRect) gc.roundRect(bx, by, bw, bh, r); else gc.rect(bx, by, bw, bh);
    gc.stroke();
    gc.restore();

    // ── Icon + label inside ───────────────────────────────────────────────────
    const hasLabel = !!(this.label);
    const labelSz  = 9;
    const shift    = pr ? 1 : 0;  // press-down shift
    // Icon vertical centre: raised when label shares space
    const iconCY = hasLabel ? cy - 5 + shift : cy + shift;

    gc.save();
    gc.font         = `${this._iconSz}px 'Material Symbols Outlined'`;
    gc.textAlign    = 'center';
    gc.textBaseline = 'middle';
    gc.fillStyle    = on          ? theme.readoutBg
                    : pr         ? theme.capHighlight
                    : this._hovered ? theme.label
                    :                 theme.scaleText;
    gc.fillText(this.icon, cx, iconCY);
    gc.restore();

    if (hasLabel) {
      push();
      noStroke();
      fill(on ? theme.readoutBg : pr ? theme.capHighlight : theme.scaleText);
      textSize(labelSz);
      textAlign(CENTER, TOP);
      if (theme.font) textFont(theme.font);
      text(this.label, cx, iconCY + this._iconSz * 0.50 + shift);
      pop();
    }

    if (this.disabled) this._drawDisabled(x, y, sz, sz);
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._containsPoint(mouseX, mouseY)) {
      this._active = true;
      const buttonLabel = this.label || this.icon;
      const callbackData = { buttonState: true, label: buttonLabel };
      if (this.onChange) this.onChange(callbackData);
    }
  }

  mouseReleased() {
    if (!this._active) return;
    if (this._containsPoint(mouseX, mouseY)) {
      if (this.toggle) {
        this.state = !this.state;
      }
      const buttonLabel = this.label || this.icon;
      const callbackData = { buttonState: false, label: buttonLabel };
      if (this.onChange) this.onChange(callbackData);
      if (this.onRelease) this.onRelease(callbackData);
      if (this.onClick) this.onClick(callbackData);
    }
    this._active = false;
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
  }
}

window.IconButton = IconButton;

// ─── Menu ─────────────────────────────────────────────────────────────────────
// A horizontal bar (top) or vertical bar (left) menu with optional submenus.
// items: array where each entry is either a string (leaf) or an array of strings
//   (submenu) where the first string is the top-level label and the rest are
//   the submenu items.
// opts: x, y, orientation ('top'|'bottom'|'left'|'right'), items, width, onChange

class Menu extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.items       = opts.items       ?? ['File', 'Edit', 'View'];
    this.orientation = opts.orientation ?? 'top';
    this.onChange    = opts.onChange    ?? null;

    this._barH      = 28;   // row height for each item / bar height
    this._itemPadX  = 12;   // label horizontal inset
    this._subItemH  = 24;   // submenu row height
    this._fontSize  = 11;

    this._openIdx     = -1; // index of top-level item whose submenu is open
    this._hoverIdx    = -1;
    this._hoverSubIdx = -1;

    this._layoutDirty  = true;
    this._itemRects    = [];
    this._subCache     = null;
    this._subCacheFor  = -1;

    this._explicitW = opts.width  != null ? opts.width  : null;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  _parsed(i) {
    const it = this.items[i];
    return Array.isArray(it)
      ? { label: it[0], sub: it.slice(1) }
      : { label: it,    sub: null };
  }

  _isHoriz() { return this.orientation === 'top' || this.orientation === 'bottom'; }

  // ── Layout ───────────────────────────────────────────────────────────────
  _buildLayout() {
    this._layoutDirty = false;
    this._itemRects   = [];
    this._subCache    = null;
    this._subCacheFor = -1;

    push();
    textSize(this._fontSize);
    if (this.theme.font) textFont(this.theme.font);

    if (this._isHoriz()) {
      // 'bottom' auto-sticks to the canvas bottom edge
      const by = this.orientation === 'bottom' ? height - this._barH : this.y;
      let ix = this.x;
      for (let i = 0; i < this.items.length; i++) {
        const { label, sub } = this._parsed(i);
        const w = Math.ceil(textWidth(label)) + this._itemPadX * 2 + (sub ? 14 : 0);
        this._itemRects.push({ x: ix, y: by, w, h: this._barH });
        ix += w;
      }
      this.width  = this._explicitW ?? (ix - this.x);
      this.height = this._barH;
    } else {
      // left / right — find widest label first
      let maxW = 60;
      for (let i = 0; i < this.items.length; i++) {
        const { label, sub } = this._parsed(i);
        const w = Math.ceil(textWidth(label)) + this._itemPadX * 2 + (sub ? 14 : 0);
        if (w > maxW) maxW = w;
      }
      const barW = this._explicitW ?? maxW;
      // 'right' auto-sticks to the canvas right edge; 'popup' uses x as-is
      const bx = this.orientation === 'right' ? width - barW : this.x;
      let iy = this.y;
      for (let i = 0; i < this.items.length; i++) {
        this._itemRects.push({ x: bx, y: iy, w: barW, h: this._barH });
        iy += this._barH;
      }
      this.width  = barW;
      this.height = iy - this.y;
    }
    pop();
  }

  _buildSubRects(idx) {
    if (this._subCacheFor === idx && this._subCache) return this._subCache;
    const { sub } = this._parsed(idx);
    if (!sub || !sub.length) return [];
    const ir = this._itemRects[idx];

    push();
    textSize(this._fontSize);
    if (this.theme.font) textFont(this.theme.font);
    let maxW = 80;
    for (const s of sub) {
      const w = Math.ceil(textWidth(s)) + this._itemPadX * 2;
      if (w > maxW) maxW = w;
    }
    pop();

    const sh = sub.length * this._subItemH;
    let sx, sy;
    switch (this.orientation) {
      case 'top':    sx = ir.x;          sy = ir.y + ir.h;      break;
      case 'bottom': sx = ir.x;          sy = ir.y - sh;        break;
      case 'left':   sx = ir.x + ir.w;   sy = ir.y;             break;
      case 'right':  sx = ir.x - maxW;   sy = ir.y;             break;
      case 'popup': {
        const onLeft = ir.x + ir.w / 2 < width / 2;
        sx = onLeft ? ir.x + ir.w : ir.x - maxW;
        sy = ir.y;
        break;
      }
      default:       sx = ir.x;          sy = ir.y + ir.h;
    }

    this._subCache    = sub.map((s, j) => ({
      x: sx, y: sy + j * this._subItemH, w: maxW, h: this._subItemH, label: s,
    }));
    this._subCacheFor = idx;
    return this._subCache;
  }

  // ── Hit testing ──────────────────────────────────────────────────────────
  _hitItem(mx, my) {
    for (let i = 0; i < this._itemRects.length; i++) {
      const r = this._itemRects[i];
      if (mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h) return i;
    }
    return -1;
  }

  _hitSub(mx, my) {
    if (this._openIdx < 0) return -1;
    const subs = this._buildSubRects(this._openIdx);
    for (let j = 0; j < subs.length; j++) {
      const r = subs[j];
      if (mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h) return j;
    }
    return -1;
  }

  // ── Events ───────────────────────────────────────────────────────────────
  mousePressed() {
    if (this.disabled || this._layoutDirty) return;

    const i = this._hitItem(mouseX, mouseY);
    if (i >= 0) {
      const { label, sub } = this._parsed(i);
      if (sub && sub.length) {
        this._openIdx    = this._openIdx === i ? -1 : i;
        this._subCache   = null;
        this._subCacheFor = -1;
      } else {
        if (this.onChange) this.onChange(label, [label]);
        this._openIdx = -1;
      }
      return;
    }

    if (this._openIdx >= 0) {
      const j = this._hitSub(mouseX, mouseY);
      if (j >= 0) {
        const parent = this._parsed(this._openIdx);
        const subLabel = parent.sub[j];
        if (this.onChange) this.onChange(subLabel, [parent.label, subLabel]);
        this._openIdx    = -1;
        this._subCache   = null;
        this._subCacheFor = -1;
        return;
      }
      // Click outside menu — close submenu
      this._openIdx    = -1;
      this._subCache   = null;
      this._subCacheFor = -1;
    }
  }

  mouseReleased() {
    if (this.onRelease) this.onRelease(null);
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hoverIdx    = this._hitItem(mouseX, mouseY);
    this._hoverSubIdx = this._hitSub(mouseX, mouseY);
  }

  mouseDragged() { this.mouseMoved(); }

  // ── Draw ─────────────────────────────────────────────────────────────────
  draw() {
    this._markDrawn();
    const { theme } = this;
    const gc = drawingContext;

    if (this._layoutDirty) this._buildLayout();

    // Use actual item rect origin — 'right'/'bottom' auto-position away from this.x/y
    const bx    = this._itemRects.length ? this._itemRects[0].x : this.x;
    const by    = this._itemRects.length ? this._itemRects[0].y : this.y;
    const horiz = this._isHoriz();
    const barW  = this.width;
    const barH  = horiz ? this._barH : this.height;

    // ── Bar background ────────────────────────────────────────────────────
    gc.save();
    gc.beginPath();
    if (gc.roundRect) gc.roundRect(bx, by, barW, barH, 3); else gc.rect(bx, by, barW, barH);
    gc.clip();
    gc.fillStyle = theme.capBody;
    gc.fillRect(bx, by, barW, barH);
    gc.restore();

    // Border
    push();
    noFill(); stroke(theme.panelStroke); strokeWeight(1);
    rect(bx, by, barW, barH, 3);

    // Item separators
    const sepC = lerpColor(color(theme.capBody), color(theme.panelStroke), 0.45);
    stroke(sepC); strokeWeight(1);
    for (let i = 1; i < this._itemRects.length; i++) {
      const ir = this._itemRects[i];
      if (horiz) {
        line(ir.x, by + 5, ir.x, by + this._barH - 5);
      } else {
        line(bx + 5, ir.y, bx + barW - 5, ir.y);
      }
    }
    pop();

    // ── Top-level items ──────────────────────────────────────────────────
    push();
    textSize(this._fontSize);
    if (theme.font) textFont(theme.font);
    noStroke();

    const arrows = { top: '▾', bottom: '▴', left: '▸', right: '◂' };

    // For 'popup', determine submenu direction once from the first item rect
    const popupOnLeft = this.orientation === 'popup' && this._itemRects.length
      ? this._itemRects[0].x + this._itemRects[0].w / 2 < width / 2
      : true;

    for (let i = 0; i < this.items.length; i++) {
      const { label, sub } = this._parsed(i);
      const ir = this._itemRects[i];
      const active = this._hoverIdx === i || this._openIdx === i;

      if (active) {
        fill(theme.capIndicator);
        rect(ir.x + 1, ir.y + 1, ir.w - 2, ir.h - 2, 2);
      }

      fill(active ? theme.readoutBg : theme.scaleText);
      textAlign(LEFT, CENTER);

      // Arrow goes on the left for 'right' orientation and for 'popup' on the right half
      const arrowOnLeft = this.orientation === 'right' ||
                          (this.orientation === 'popup' && !popupOnLeft);
      const labelX = (arrowOnLeft && sub) ? ir.x + 16 : ir.x + this._itemPadX;
      text(label, labelX, ir.y + ir.h / 2);

      if (sub) {
        if (arrowOnLeft) {
          textAlign(LEFT, CENTER);
          text('◂', ir.x + 4, ir.y + ir.h / 2);
        } else {
          const arrow = this.orientation === 'popup' ? '▸' : (arrows[this.orientation] ?? '▸');
          textAlign(RIGHT, CENTER);
          text(arrow, ir.x + ir.w - 5, ir.y + ir.h / 2);
        }
      }
    }
    pop();

    // ── Open submenu ─────────────────────────────────────────────────────
    if (this._openIdx >= 0) {
      const subs = this._buildSubRects(this._openIdx);
      if (subs.length) {
        const sx = subs[0].x;
        const sy = subs[0].y;
        const sw = subs[0].w;
        const sh = subs.length * this._subItemH;

        // Drop shadow + background
        gc.save();
        gc.shadowColor   = 'rgba(0,0,0,0.28)';
        gc.shadowBlur    = 10;
        gc.shadowOffsetX = 1;
        gc.shadowOffsetY = 3;
        gc.fillStyle     = theme.panel;
        gc.beginPath();
        if (gc.roundRect) gc.roundRect(sx, sy, sw, sh, 4); else gc.rect(sx, sy, sw, sh);
        gc.fill();
        gc.restore();

        // Border + row separators
        push();
        noFill(); stroke(theme.panelStroke); strokeWeight(1);
        rect(sx, sy, sw, sh, 4);
        stroke(lerpColor(color(theme.panel), color(theme.panelStroke), 0.35));
        for (let j = 1; j < subs.length; j++) {
          line(sx + 4, subs[j].y, sx + sw - 4, subs[j].y);
        }
        pop();

        // Sub-item labels
        push();
        textSize(this._fontSize);
        if (theme.font) textFont(theme.font);
        textAlign(LEFT, CENTER);
        noStroke();

        for (let j = 0; j < subs.length; j++) {
          const sr = subs[j];
          const hov = this._hoverSubIdx === j;
          if (hov) {
            fill(theme.capIndicator);
            rect(sr.x + 2, sr.y + 1, sr.w - 4, sr.h - 2, 2);
          }
          fill(hov ? theme.readoutBg : theme.scaleText);
          text(sr.label, sr.x + this._itemPadX, sr.y + sr.h / 2);
        }
        pop();
      }
    }

    if (this.disabled) this._drawDisabled(bx, by, barW, barH);
  }
}

window.Menu = Menu;

// ─── PopupMenu ───────────────────────────────────────────────────────────────
// Convenience wrapper: a Menu pre-configured with orientation:'popup'.
class PopupMenu extends Menu {
  constructor(opts = {}) {
    super(Object.assign({ orientation: 'popup' }, opts));
  }
}
window.PopupMenu = PopupMenu;

// ─── Markup ──────────────────────────────────────────────────────────────────
// Display panel that renders text with basic Wiki Markup syntax.
// Scroll with the mouse wheel when content overflows the panel.
//
// Supported syntax:
//   = Heading 1 =    == Heading 2 ==    === Heading 3 ===
//   '''bold'''    ''italic''    '''''bold italic'''''
//   [[link text]]  or  [[url|display text]]
//   * Bullet item    ** Sub-bullet
//   # Numbered item  ## Sub-numbered
//   : Indented block
//   ----  (horizontal rule)
//   (blank line = paragraph gap)
//
// Options:
//   x, y, width, height, text, fontSize, padding, lineSpacing, theme

class Markup extends ProControl {
  constructor(opts = {}) {
    super(opts);
    this.width       = opts.width       ?? 280;
    this.height      = opts.height      ?? 200;
    this.fontSize    = opts.fontSize    ?? 12;
    this.padding     = opts.padding     ?? 10;
    this.lineSpacing = opts.lineSpacing ?? 1.5;
    this._scrollY    = 0;
    this._contentH   = 0;
    this._hovered    = false;
    this._blocks     = [];
    this._links      = [];
    this._popupHref  = null;
    this.onClick     = opts.onClick ?? null;
    this.text = opts.text ?? '= Markup =\nWiki-formatted text panel.\n* Bold: \'\'\'bold\'\'\'\n* Italic: \'\'italic\'\'\n* Links: [[https://example.com|Label]]';
  }

  get text()  { return this._text; }
  set text(v) {
    this._text    = String(v);
    this._blocks  = this._parse(this._text);
    this._scrollY = 0;
  }

  get scrollY()  { return this._scrollY; }
  set scrollY(v) {
    const max = Math.max(0, this._contentH - (this.height - this.padding * 2));
    this._scrollY = constrain(v, 0, max);
  }

  _parse(src) {
    const blocks = [];
    let numIdx = 0, num2Idx = 0;

    for (const raw of src.split('\n')) {
      let m;

      if (/^\s*-{4,}\s*$/.test(raw)) {
        numIdx = 0; num2Idx = 0;
        blocks.push({ type: 'rule' });
        continue;
      }

      if ((m = raw.match(/^\s*(={1,6})\s*(.*?)\s*\1\s*$/))) {
        numIdx = 0; num2Idx = 0;
        const lvl = m[1].length;
        blocks.push({
          type: lvl === 1 ? 'h1' : lvl === 2 ? 'h2' : 'h3',
          tokens: this._inline(m[2])
        });
        continue;
      }

      if ((m = raw.match(/^\s*\*{2}\s+(.*)/))) {
        numIdx = 0; num2Idx = 0;
        blocks.push({ type: 'bullet2', tokens: this._inline(m[1]) });
        continue;
      }

      if ((m = raw.match(/^\s*\*\s+(.*)/))) {
        numIdx = 0; num2Idx = 0;
        blocks.push({ type: 'bullet', tokens: this._inline(m[1]) });
        continue;
      }

      if ((m = raw.match(/^\s*#{2}\s+(.*)/))) {
        blocks.push({ type: 'num2', n: ++num2Idx, tokens: this._inline(m[1]) });
        continue;
      }

      if ((m = raw.match(/^\s*#\s+(.*)/))) {
        num2Idx = 0;
        blocks.push({ type: 'num', n: ++numIdx, tokens: this._inline(m[1]) });
        continue;
      }

      if ((m = raw.match(/^\s*:\s*(.*)/))) {
        numIdx = 0; num2Idx = 0;
        blocks.push({ type: 'indent', tokens: this._inline(m[1]) });
        continue;
      }

      if (raw.trim() === '') {
        numIdx = 0; num2Idx = 0;
        blocks.push({ type: 'spacer' });
        continue;
      }

      blocks.push({ type: 'p', tokens: this._inline(raw) });
    }

    return blocks;
  }

  _inline(text) {
    const toks = [];
    let s = text;

    while (s.length > 0) {
      let m;

      if ((m = s.match(/^'{5}(.*?)'{5}([\s\S]*)$/))) {
        toks.push({ text: m[1], bold: true, italic: true });
        s = m[2];
        continue;
      }

      if ((m = s.match(/^'{3}(.*?)'{3}([\s\S]*)$/))) {
        toks.push({ text: m[1], bold: true });
        s = m[2];
        continue;
      }

      if ((m = s.match(/^'{2}(.*?)'{2}([\s\S]*)$/))) {
        toks.push({ text: m[1], italic: true });
        s = m[2];
        continue;
      }

      if ((m = s.match(/^\[\[([^\]|]+)\|([^\]]*)\]\]([\s\S]*)$/))) {
        toks.push({ text: m[2], link: true, href: m[1] });
        s = m[3];
        continue;
      }

      if ((m = s.match(/^\[\[([^\]]*)\]\]([\s\S]*)$/))) {
        toks.push({ text: m[1], link: true, href: m[1] });
        s = m[2];
        continue;
      }

      const n = s.search(/'{2}|\[\[/);
      if (n > 0) {
        toks.push({ text: s.slice(0, n) });
        s = s.slice(n);
      } else {
        toks.push({ text: s });
        break;
      }
    }

    return toks;
  }

  _font(bold, italic, size) {
    const fam = this.theme.font ?? 'system-ui, Arial, sans-serif';
    return `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${size}px ${fam}`;
  }

  _wrap(tokens, maxW, gc, size) {
    const lines = [];
    let cur = [], x = 0;
    const flush = () => {
      if (cur.length) {
        lines.push(cur);
        cur = [];
        x = 0;
      }
    };

    for (const tok of tokens) {
      gc.font = this._font(tok.bold, tok.italic, size);
      for (const part of tok.text.split(/(\s+)/)) {
        if (!part) continue;
        const pw = gc.measureText(part).width;
        if (x + pw > maxW && x > 0 && part.trim()) flush();
        cur.push({ text: part, bold: tok.bold, italic: tok.italic, link: tok.link, href: tok.href, x, w: pw });
        x += pw;
      }
    }

    flush();
    return lines;
  }

  _openLink(href) {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  _isValidUrl(href) {
    if (href.startsWith('/')) return true;
    try {
      const u = new URL(href);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  draw() {
    this._markDrawn();
    const { x, y, padding: pad, fontSize: fs, lineSpacing: ls } = this;
    const pw = this.width, ph = this.height;
    const lh = fs * ls;

    this._drawPanel(x, y, pw, ph);

    const gc  = drawingContext;
    const txt = this.theme.readout;
    const dim = this.theme.scaleText;
    const acc = this.theme.capIndicator;
    const maxW = pw - pad * 2;

    this._links = [];

    gc.save();
    gc.beginPath();
    gc.rect(x + 1, y + 1, pw - 2, ph - 2);
    gc.clip();
    gc.textBaseline = 'top';
    gc.textAlign    = 'left';

    let cy = y + pad - this._scrollY;

    for (const b of this._blocks) {
      if (b.type === 'spacer') {
        cy += lh * 0.6;
        continue;
      }

      if (b.type === 'rule') {
        if (cy > y + pad - 2 && cy < y + ph) {
          gc.save();
          gc.strokeStyle = dim;
          gc.lineWidth = 1;
          gc.globalAlpha = 0.45;
          gc.beginPath();
          gc.moveTo(x + pad, cy + 6);
          gc.lineTo(x + pw - pad, cy + 6);
          gc.stroke();
          gc.restore();
        }
        cy += 14;
        continue;
      }

      if (b.type === 'h1' || b.type === 'h2' || b.type === 'h3') {
        const sz  = b.type === 'h1' ? fs * 1.8 : b.type === 'h2' ? fs * 1.4 : fs * 1.15;
        const slh = sz * ls;
        if (b.type !== 'h3') cy += slh * 0.2;
        const lines = this._wrap(b.tokens, maxW, gc, sz);
        for (let li = 0; li < lines.length; li++) {
          if (cy + slh > y + pad && cy < y + ph) {
            for (const seg of lines[li]) {
              gc.font = this._font(true, seg.italic, sz);
              gc.fillStyle = seg.link ? acc : txt;
              gc.fillText(seg.text, x + pad + seg.x, cy);
              if (seg.link && seg.href) {
                this._links.push({ x: x + pad + seg.x, y: cy, w: seg.w, h: slh, href: seg.href });
                gc.fillRect(x + pad + seg.x, cy + sz - 1, seg.w, 1);
              }
            }
            if (b.type === 'h1' && li === lines.length - 1) {
              gc.save();
              gc.strokeStyle = dim;
              gc.lineWidth = 1;
              gc.globalAlpha = 0.3;
              gc.beginPath();
              gc.moveTo(x + pad, cy + slh * 0.92);
              gc.lineTo(x + pw - pad, cy + slh * 0.92);
              gc.stroke();
              gc.restore();
            }
          }
          cy += slh;
        }
        cy += slh * 0.1;
        continue;
      }

      if (b.type === 'bullet' || b.type === 'bullet2') {
        const sub   = b.type === 'bullet2';
        const indX  = x + pad + (sub ? 14 : 0);
        const textX = indX + 10;
        const lines = this._wrap(b.tokens, x + pw - pad - textX, gc, fs);
        for (let li = 0; li < lines.length; li++) {
          if (cy + lh > y + pad && cy < y + ph) {
            if (li === 0) {
              gc.fillStyle = acc;
              gc.beginPath();
              gc.arc(indX + 3, cy + lh * 0.48, sub ? 1.5 : 2.5, 0, Math.PI * 2);
              gc.fill();
            }
            for (const seg of lines[li]) {
              gc.font = this._font(seg.bold, seg.italic, fs);
              gc.fillStyle = seg.link ? acc : txt;
              gc.fillText(seg.text, textX + seg.x, cy);
              if (seg.link && seg.href) {
                this._links.push({ x: textX + seg.x, y: cy, w: seg.w, h: lh, href: seg.href });
                gc.fillRect(textX + seg.x, cy + fs - 1, seg.w, 1);
              }
            }
          }
          cy += lh;
        }
        continue;
      }

      if (b.type === 'num' || b.type === 'num2') {
        const sub   = b.type === 'num2';
        const indX  = x + pad + (sub ? 18 : 0);
        const textX = indX + 16;
        const lines = this._wrap(b.tokens, x + pw - pad - textX, gc, fs);
        for (let li = 0; li < lines.length; li++) {
          if (cy + lh > y + pad && cy < y + ph) {
            if (li === 0) {
              gc.font = this._font(false, false, fs - 1);
              gc.fillStyle = acc;
              gc.textAlign = 'right';
              gc.fillText(`${b.n}.`, indX + 14, cy + 1);
              gc.textAlign = 'left';
            }
            for (const seg of lines[li]) {
              gc.font = this._font(seg.bold, seg.italic, fs);
              gc.fillStyle = seg.link ? acc : txt;
              gc.fillText(seg.text, textX + seg.x, cy);
              if (seg.link && seg.href) {
                this._links.push({ x: textX + seg.x, y: cy, w: seg.w, h: lh, href: seg.href });
                gc.fillRect(textX + seg.x, cy + fs - 1, seg.w, 1);
              }
            }
          }
          cy += lh;
        }
        continue;
      }

      if (b.type === 'indent') {
        const textX = x + pad + 14;
        const lines = this._wrap(b.tokens, pw - pad * 2 - 14, gc, fs);
        for (const segs of lines) {
          if (cy + lh > y + pad && cy < y + ph) {
            gc.save();
            gc.fillStyle = dim;
            gc.globalAlpha = 0.4;
            gc.fillRect(x + pad + 2, cy + 2, 2, lh - 4);
            gc.globalAlpha = 1;
            for (const seg of segs) {
              gc.font = this._font(seg.bold, seg.italic, fs);
              gc.fillStyle = seg.link ? acc : dim;
              gc.fillText(seg.text, textX + seg.x, cy);
              if (seg.link && seg.href) {
                this._links.push({ x: textX + seg.x, y: cy, w: seg.w, h: lh, href: seg.href });
                gc.fillRect(textX + seg.x, cy + fs - 1, seg.w, 1);
              }
            }
            gc.restore();
          }
          cy += lh;
        }
        continue;
      }

      const lines = this._wrap(b.tokens, maxW, gc, fs);
      for (const segs of lines) {
        if (cy + lh > y + pad && cy < y + ph) {
          for (const seg of segs) {
            gc.font = this._font(seg.bold, seg.italic, fs);
            gc.fillStyle = seg.link ? acc : txt;
            gc.fillText(seg.text, x + pad + seg.x, cy);
            if (seg.link && seg.href) {
              this._links.push({ x: x + pad + seg.x, y: cy, w: seg.w, h: lh, href: seg.href });
              gc.fillRect(x + pad + seg.x, cy + fs - 1, seg.w, 1);
            }
          }
        }
        cy += lh;
      }
    }

    this._contentH = cy + this._scrollY - (y + pad);
    gc.restore();

    const maxScroll = Math.max(0, this._contentH - (ph - pad * 2));
    if (maxScroll > 0) {
      const trackH = ph - pad * 2;
      const thumbH = Math.max(trackH * (ph - pad * 2) / this._contentH, 16);
      const thumbY = y + pad + (this._scrollY / maxScroll) * (trackH - thumbH);
      push();
      noStroke();
      fill(lerpColor(color(this.theme.panel), color(this.theme.scaleText), 0.25));
      rect(x + pw - 4, y + pad, 3, trackH, 1);
      fill(this.theme.scaleText);
      rect(x + pw - 4, thumbY, 3, thumbH, 1);
      pop();
    }

    if (this._popupHref) {
      const popPad = 6;
      const popH   = 22;
      const popY   = y + ph - popH - 4;
      const arrow  = '↗ ';

      gc.save();
      gc.font = `11px ${this.theme.font ?? 'monospace, sans-serif'}`;
      const arrowW = gc.measureText(arrow).width;

      const maxUrlW = pw - pad * 2 - arrowW - popPad * 2;
      let url = this._popupHref;
      while (url.length > 1 && gc.measureText(url).width > maxUrlW)
        url = url.slice(0, -1);
      if (url !== this._popupHref) url = url.slice(0, -1) + '…';

      const boxW = Math.min(arrowW + gc.measureText(url).width + popPad * 2, pw - pad * 2);
      const popX = x + pad;

      gc.fillStyle = this.theme.tooltipBg;
      gc.beginPath();
      if (gc.roundRect) gc.roundRect(popX, popY, boxW, popH, 3);
      else gc.rect(popX, popY, boxW, popH);
      gc.fill();

      gc.textBaseline = 'middle';
      gc.textAlign    = 'left';
      gc.fillStyle    = acc;
      gc.fillText(arrow, popX + popPad, popY + popH / 2);
      gc.fillStyle    = this.theme.tooltip;
      gc.fillText(url, popX + popPad + arrowW, popY + popH / 2);
      gc.restore();
    }

    if (this.disabled) this._drawDisabled(x, y, pw, ph);
  }

  mouseMoved() {
    const wasHovered = this._hovered;
    this._hovered = mouseX >= this.x && mouseX <= this.x + this.width &&
                    mouseY >= this.y && mouseY <= this.y + this.height;

    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    if (this._hovered) {
      let overLink = false;
      for (const lnk of this._links) {
        if (mouseX >= lnk.x && mouseX <= lnk.x + lnk.w &&
            mouseY >= lnk.y && mouseY <= lnk.y + lnk.h) {
          overLink = true;
          break;
        }
      }
      canvas.style.cursor = overLink ? 'pointer' : '';
    } else if (wasHovered) {
      canvas.style.cursor = '';
    }
  }

  mousePressed() {
    if (!this._hovered) {
      this._popupHref = null;
      return;
    }

    for (const lnk of this._links) {
      if (mouseX >= lnk.x && mouseX <= lnk.x + lnk.w &&
          mouseY >= lnk.y && mouseY <= lnk.y + lnk.h) {
        if (this.onClick) {
          this._popupHref = lnk.href;
          this.onClick(lnk.href);
        } else if (this._isValidUrl(lnk.href)) {
          this._openLink(lnk.href);
        }
        return;
      }
    }

    this._popupHref = null;
    if (this.onClick) this.onClick(null);
  }

  mouseWheel(e) {
    if (!this._hovered) return;
    const maxScroll = Math.max(0, this._contentH - (this.height - this.padding * 2));
    if (maxScroll <= 0) return;
    this._scrollY = constrain(this._scrollY + (e.deltaY ?? e.delta ?? 0) * 0.4, 0, maxScroll);
    return false;
  }
}

window.Markup = Markup;

// ─── ConsolePanel ─────────────────────────────────────────────────────────────
// Intercepts console.log/warn/error/info, window errors, and unhandled promise
// rejections, displaying them as a scrollable, color-coded log panel.
//
// opts: x, y, width, height, label, movable, resizable, minimizable,
//       maxMessages, timestamps, intercept[], theme

// Draws a small LED indicator on the left side of a title bar.
// brightness is 0–1; call with (millis() - _ledLastFlash) / fadeMs each frame.
function _drawTitleLED(x, y, titleH, brightness) {
  const cx = x + 11;
  const cy = y + titleH / 2;
  const r  = 3;
  push();
  noStroke();
  const b = Math.max(0, Math.min(1, brightness));
  // Body: dark green → bright green
  fill(Math.round(b * 20), Math.round(40 + b * 215), Math.round(b * 100));
  if (b > 0.05) {
    drawingContext.shadowBlur  = 7 * b;
    drawingContext.shadowColor = `rgba(0,255,120,${b * 0.9})`;
  }
  ellipse(cx, cy, r * 2, r * 2);
  drawingContext.shadowBlur = 0;
  // Specular highlight
  fill(255, 255, 255, b > 0.15 ? b * 110 : 30);
  ellipse(cx - 0.6, cy - 0.9, r * 0.9, r * 0.9);
  pop();
}

class ConsolePanel extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0, x: 0, y: 0 }, opts));
    this.width       = opts.width       ?? (typeof width !== 'undefined' ? width : 400);
    this.height      = opts.height      ?? 90;
    this.label       = opts.label       ?? 'Console';
    this._visible    = opts.visible     !== false;
    this.movable     = opts.movable     !== false;
    this.resizable   = opts.resizable   !== false;
    this.minimizable = opts.minimizable !== false;
    this._minimized  = opts.minimized   ?? false;
    this._maxMsgs    = opts.maxMessages ?? 100;
    this._showTime   = opts.timestamps  !== false;

    this._msgs          = [];   // { type, text, time, count, lines, lineCount }
    this._scrollY       = 0;
    this._contentH      = 0;
    this._layoutDirty   = true;
    this._lastWidth     = this.width;
    this._pendingBottom = false;
    this._ledLastFlash  = -Infinity;

    this._rowH   = 13;
    this._padX   = 6;
    this._padY   = 4;
    this._sbW    = 6;
    this._gripSz = 12;
    this._btnSz  = 10;

    this._clrHov        = false;
    this._dragSB        = false;
    this._dragSBRef     = null;
    this._draggingPanel = false;
    this._dragPanelOff  = null;
    this._resizing      = false;
    this._gripHovered   = false;
    this._initX         = this.x;      // store initial position for double-click reset
    this._initY         = this.y;
    this._initW         = this.width;
    this._initH         = this.height;

    // Intercept console methods
    this._originals = {};
    const methods = opts.intercept ?? ['log', 'warn', 'error', 'info'];
    for (const m of methods) {
      this._originals[m] = console[m].bind(console);
      console[m] = (...args) => { this._originals[m](...args); this._addMsg(m, args); };
    }

    // Catch uncaught errors and unhandled rejections
    this._onErr = e => this._addMsg('error', [`${e.message}  (${e.filename}:${e.lineno})`]);
    this._onRej = e => this._addMsg('error', [`Unhandled rejection: ${e.reason}`]);
    window.addEventListener('error', this._onErr);
    window.addEventListener('unhandledrejection', this._onRej);
  }

  // ── Public API ────────────────────────────────────────────────────────────

  clear() {
    this._msgs        = [];
    this._scrollY     = 0;
    this._contentH    = 0;
    this._layoutDirty = true;
  }

  get visible()    { return this._visible; }
  set visible(v)   { this._visible = !!v; }
  get minimized()  { return this._minimized; }
  set minimized(v) { this._minimized = !!v; }

  get messages() { return [...this._msgs]; }

  remove() {
    super.remove();
    for (const [m, fn] of Object.entries(this._originals)) console[m] = fn;
    window.removeEventListener('error', this._onErr);
    window.removeEventListener('unhandledrejection', this._onRej);
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  _addMsg(type, args) {
    const text = args.map(a => {
      if (a === null)      return 'null';
      if (a === undefined) return 'undefined';
      if (a instanceof Error) return a.stack ?? String(a);
      if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
      return String(a);
    }).join(' ');

    const d    = new Date();
    const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;

    // Collapse consecutive identical messages — update count and timestamp
    const last = this._msgs.length > 0 ? this._msgs[this._msgs.length - 1] : null;
    if (last && last.text === text && last.type === type) {
      last.count++;
      last.time  = time;
      last.lines = null;   // invalidate so prefix re-renders with new count/time
      this._layoutDirty   = true;
      this._pendingBottom = true;
      return;
    }

    this._msgs.push({ type, text, time, count: 1, lines: null, lineCount: 1 });
    if (this._msgs.length > this._maxMsgs) this._msgs.shift();
    this._layoutDirty   = true;
    this._pendingBottom = true;
    this._ledLastFlash  = millis();
  }

  // ── Geometry ──────────────────────────────────────────────────────────────

  get _titleH()  { return 20; }
  _drawnH()      { return this._minimized ? this._titleH : this.height; }
  _bodyH()       { return this.height - this._titleH; }
  _needsScroll() { return this._contentH > this._bodyH(); }
  _maxScrollY()  { return Math.max(0, this._contentH - this._bodyH()); }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this._drawnH();
  }

  // Minimize toggle button — right side of title bar
  _btnRect() {
    const bx = this.x + this.width - this._btnSz - 5;
    const by = this.y + (this._titleH - this._btnSz) / 2;
    return { bx, by, bsz: this._btnSz };
  }

  _hitBtn(mx, my) {
    if (!this.minimizable) return false;
    const { bx, by, bsz } = this._btnRect();
    return mx >= bx && mx <= bx + bsz && my >= by && my <= by + bsz;
  }

  // CLR button — left of the minimize toggle button
  _clrBtnRect() {
    const bw = 24, bh = 14;
    const rightX = this.minimizable
      ? this.x + this.width - this._btnSz - 5 - 4 - bw
      : this.x + this.width - bw - 5;
    return { x: rightX, y: this.y + (this._titleH - bh) / 2, w: bw, h: bh };
  }

  _inClrBtn(mx, my) {
    const r = this._clrBtnRect();
    return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
  }

  _inResizeHandle(mx, my) {
    if (!this.resizable || this._minimized) return false;
    return mx >= this.x + this.width  - this._gripSz && mx <= this.x + this.width &&
           my >= this.y + this.height - this._gripSz && my <= this.y + this.height;
  }

  // ── Layout ────────────────────────────────────────────────────────────────

  _buildLayout() {
    this._layoutDirty = false;
    const sbExtra = this._needsScroll() ? this._sbW : 0;
    const availW  = this.width - this._padX * 2 - sbExtra;
    textSize(9);
    if (this.theme.font) textFont(this.theme.font);

    if (this._lastWidth !== this.width) {
      for (const m of this._msgs) m.lines = null;
      this._lastWidth = this.width;
    }

    let h = this._padY;
    for (const m of this._msgs) {
      if (!m.lines) {
        const countSuffix = m.count > 1 ? ` ×${m.count}` : '';
        const prefix = this._showTime ? `[${m.time}${countSuffix}] ` : (m.count > 1 ? `×${m.count} ` : '');
        m.lines     = _dialogWrapText(prefix + m.text, availW);
        m.lineCount = m.lines.length || 1;
      }
      h += m.lineCount * this._rowH;
    }
    this._contentH = h + this._padY;

    // Re-run if scrollbar appearance changed (affects available width)
    const needsNow = this._contentH > this._bodyH();
    if (needsNow !== this._hadScroll) {
      this._hadScroll = needsNow;
      for (const m of this._msgs) m.lines = null;
      this._buildLayout();
      return;
    }

    if (this._pendingBottom) {
      this._pendingBottom = false;
      this._scrollY = this._maxScrollY();
    }
  }

  _typeCol(type) {
    switch (type) {
      case 'error': return '#dd3333';
      case 'warn':  return '#cc8800';
      case 'info':  return this.theme.capIndicator;
      default:      return this.theme.label;
    }
  }

  // ── Drawing ───────────────────────────────────────────────────────────────

  draw() {
    if (!this._visible) { this._markDrawn(); return; }
    this._markDrawn();
    const { x, y, width, theme } = this;
    const drawnH   = this._drawnH();
    const contentY = y + this._titleH;

    push();
    fill(theme.panel);
    stroke(theme.panelStroke);
    strokeWeight(1);
    rect(x, y, width, drawnH, 4);
    pop();

    _drawBevelTitleBar(theme, x, y, width, this._titleH, this._minimized, this.label);
    _drawTitleLED(x, y, this._titleH, 1 - (millis() - this._ledLastFlash) / 400);
    this._drawClrBtn();
    if (this.minimizable) this._drawToggleBtn();

    if (this._minimized) return;

    push();
    textSize(9);
    if (this.theme.font) textFont(this.theme.font);
    if (this._layoutDirty) this._buildLayout();

    const bodyH = this._bodyH();
    const gc    = drawingContext;
    gc.save();
    gc.beginPath();
    gc.rect(x + 1, contentY + 1, width - 2, bodyH - 2);
    gc.clip();

    textAlign(LEFT, TOP);
    noStroke();
    let curY = contentY + this._padY - this._scrollY;
    for (const m of this._msgs) {
      if (!m.lines) continue;
      fill(this._typeCol(m.type));
      for (const line of m.lines) {
        if (curY + this._rowH > contentY && curY < contentY + bodyH) {
          text(line, x + this._padX, curY);
        }
        curY += this._rowH;
      }
    }
    gc.restore();
    pop();

    if (this._needsScroll()) this._drawScrollBar(contentY, bodyH);
    if (this.resizable) this._drawResizeGrip();
  }

  _drawToggleBtn() {
    const { bx, by, bsz } = this._btnRect();
    const hovered = mouseX >= bx && mouseX <= bx + bsz && mouseY >= by && mouseY <= by + bsz;
    const { theme } = this;
    push();
    noStroke();
    fill(hovered
      ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.5)
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.6));
    rect(bx, by, bsz, bsz, 2);
    stroke(theme.label);
    strokeWeight(1.5);
    noFill();
    const cx = bx + bsz / 2, cy = by + bsz / 2, arm = bsz * 0.28;
    line(cx - arm, cy, cx + arm, cy);
    if (this._minimized) line(cx, cy - arm, cx, cy + arm);
    pop();
  }

  _drawClrBtn() {
    const r = this._clrBtnRect();
    const { theme } = this;
    push();
    noStroke();
    fill(this._clrHov
      ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.5)
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.7));
    rect(r.x, r.y, r.w, r.h, 2);
    fill(theme.label);
    textSize(8);
    textAlign(CENTER, CENTER);
    if (this.theme.font) textFont(this.theme.font);
    text('CLR', r.x + r.w / 2, r.y + r.h / 2);
    pop();
  }

  _drawScrollBar(contentY, bodyH) {
    const { x, width, theme } = this;
    const sbX  = x + width - this._sbW;
    const tH   = Math.max(16, (bodyH / this._contentH) * bodyH);
    const maxS = this._maxScrollY();
    const ty   = contentY + (maxS > 0 ? (this._scrollY / maxS) * (bodyH - tH) : 0);
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color(theme.track), 0.4));
    rect(sbX, contentY, this._sbW, bodyH, 2);
    fill(lerpColor(color(theme.capBody), color(theme.capHighlight), 0.3));
    rect(sbX + 1, ty, this._sbW - 2, tH, 2);
    pop();
  }

  _drawResizeGrip() {
    const { x, y, width, height, theme } = this;
    const hov = this._inResizeHandle(mouseX, mouseY) || this._resizing;
    const col = hov
      ? theme.capHighlight
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.9);
    push();
    noStroke();
    fill(col);
    const cx = x + width, cy = y + height;
    const d = 1.8, sp = 4;
    ellipse(cx - 3,      cy - 3,      d, d);
    ellipse(cx - 3 - sp, cy - 3,      d, d);
    ellipse(cx - 3,      cy - 3 - sp, d, d);
    ellipse(cx - 3-sp*2, cy - 3,      d, d);
    ellipse(cx - 3 - sp, cy - 3 - sp, d, d);
    ellipse(cx - 3,      cy - 3-sp*2, d, d);
    pop();
  }

  // ── Events ────────────────────────────────────────────────────────────────

  mouseMoved() {
    if (!this._visible) return;

    if (this._resizing) {
      this.width  = Math.max(100, mouseX - this.x);
      this.height = Math.max(60,  mouseY - this.y);
      this._layoutDirty = true;
      const cv = document.querySelector('canvas');
      if (cv) cv.style.cursor = 'nwse-resize';
      return;
    }

    if (this._draggingPanel) {
      this.x = mouseX - this._dragPanelOff.dx;
      this.y = mouseY - this._dragPanelOff.dy;
      return;
    }

    if (this._dragSB) {
      const bodyH = this._bodyH();
      const tH    = Math.max(16, (bodyH / this._contentH) * bodyH);
      const range = bodyH - tH;
      if (range > 0) {
        const dy = mouseY - this._dragSBRef.my;
        this._scrollY = constrain(this._dragSBRef.scrollY + dy * (this._maxScrollY() / range), 0, this._maxScrollY());
      }
      return;
    }

    this._clrHov = this._inClrBtn(mouseX, mouseY);

    if (this.resizable && !this._minimized) {
      const was = this._gripHovered;
      this._gripHovered = this._inResizeHandle(mouseX, mouseY);
      if (this._gripHovered !== was) {
        const cv = document.querySelector('canvas');
        if (cv) cv.style.cursor = this._gripHovered ? 'nwse-resize' : '';
      }
    }
  }

  mousePressed() {
    if (!this._inBounds(mouseX, mouseY)) return;

    // Title bar interactions — double-click to reset, or drag/minimize
    if (mouseY < this.y + this._titleH) {
      // Double-click on title bar resets to initial position, size, and minimized state
      if (this._isDoubleClick() && (this.movable || this.resizable || this.minimizable)) {
        this.x = this._initX;
        this.y = this._initY;
        this.width = this._initW;
        this.height = this._initH;
        this._minimized = this._initMinimized;
        return;
      }

      // Clear button
      if (this._inClrBtn(mouseX, mouseY)) { this.clear(); return; }

      // Minimize toggle
      if (this._hitBtn(mouseX, mouseY)) {
        this._minimized = !this._minimized;
        return;
      }

      // Title bar drag
      if (this.movable) {
        this._draggingPanel = true;
        this._dragPanelOff  = { dx: mouseX - this.x, dy: mouseY - this.y };
        return;
      }
    }

    if (this._minimized) return;

    if (this._inResizeHandle(mouseX, mouseY)) { this._resizing = true; return; }

    if (this._needsScroll() && mouseX >= this.x + this.width - this._sbW) {
      this._dragSB    = true;
      this._dragSBRef = { my: mouseY, scrollY: this._scrollY };
    }
  }

  mouseReleased() {
    if (this._resizing) {
      this._resizing = this._gripHovered = false;
      const cv = document.querySelector('canvas');
      if (cv) cv.style.cursor = '';
    }
    this._draggingPanel = false;
    this._dragPanelOff  = null;
    this._dragSB        = false;
    this._dragSBRef     = null;
  }

  mouseWheel(e) {
    if (this._minimized || !this._inBounds(mouseX, mouseY)) return;
    const dy = e.deltaY ?? e.delta ?? 0;
    this._scrollY = constrain(this._scrollY + dy * 0.4, 0, this._maxScrollY());
    return false;
  }
}

window.ConsolePanel = ConsolePanel;

// ── Global ConsolePanel helpers ───────────────────────────────────────────────
// openConsolePanel(opts) — creates the panel on first call (accepting any
// ConsolePanel constructor options), then shows it on every subsequent call.
// closeConsolePanel()    — hides the panel without destroying it or its data.
// The panel object itself is accessible via the returned reference if needed.

let _globalConsolePanel = null;

window.openConsolePanel = function(opts = {}) {
  if (!_globalConsolePanel) {
    _globalConsolePanel = new ConsolePanel(opts);
  } else {
    _globalConsolePanel.visible = true;
  }
  return _globalConsolePanel;
};

window.closeConsolePanel = function() {
  if (_globalConsolePanel) _globalConsolePanel.visible = false;
};

// ─── TimeGraphPanel ───────────────────────────────────────────────────────────
// Scrolling time-series line graph. Push a number for a single variable, or
// an object {key:value, ...} to graph multiple named variables simultaneously.
//
// opts: x, y, width, height, label, movable, resizable, minimizable,
//       maxSamples, min, max, lineWidth, grid, legend, theme

function _fmtNum(v) {
  const a = Math.abs(v);
  if (a === 0)      return '0';
  if (a >= 10000)   return (v / 1000).toFixed(0) + 'k';
  if (a >= 1000)    return (v / 1000).toFixed(1) + 'k';
  if (a >= 100)     return v.toFixed(0);
  if (a >= 10)      return v.toFixed(1);
  if (a >= 1)       return v.toFixed(2);
  if (a >= 0.01)    return v.toFixed(3);
  return v.toPrecision(2);
}

function _fmtTime(s) {
  if (s < 60) return (s < 10 ? s.toFixed(1) : s.toFixed(0)) + 's';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}

class TimeGraphPanel extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.width       = opts.width       ?? 360;
    this.height      = opts.height      ?? 200;
    this.label       = opts.label       ?? 'Time Graph';
    this._visible    = opts.visible     !== false;
    this.movable     = opts.movable     !== false;
    this.resizable   = opts.resizable   !== false;
    this.minimizable = opts.minimizable !== false;
    this._minimized  = opts.minimized   ?? false;

    this._maxSamples  = opts.maxSamples  ?? 200;
    this._yMin        = opts.min !== undefined ? opts.min : null;
    this._yMax        = opts.max !== undefined ? opts.max : null;
    this._autoAdjustY = opts.autoAdjustY !== false;
    this._lineWidth   = opts.lineWidth  ?? 1.5;
    this._showGrid    = opts.grid       !== false;
    this._showLegend  = opts.legend     !== false;

    this._data     = [];
    this._keys     = [];
    this._isObj    = false;
    this._colorMap = {};

    this._palette = [
      '#00ccff', '#ff6644', '#44ee88', '#ffcc00',
      '#ff44cc', '#88aaff', '#ff8844', '#00ffcc',
    ];

    this._btnSz  = 10;
    this._gripSz = 12;

    this._resizing      = false;
    this._gripHovered   = false;
    this._draggingPanel = false;
    this._dragPanelOff  = null;

    this._startTime   = null;
    this._times       = [];
    this._hoverFrac   = null;
    this._hoverMouseX = null;
    this._ledLastFlash = -Infinity;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  push(value) {
    if (typeof value === 'object' && value !== null) {
      if (!this._isObj) { this._data = []; this._keys = []; this._colorMap = {}; }
      this._isObj = true;
      for (const k of Object.keys(value)) {
        if (!this._colorMap[k]) {
          this._colorMap[k] = this._palette[this._keys.length % this._palette.length];
          this._keys.push(k);
        }
      }
    } else {
      if (this._isObj) { this._data = []; this._keys = []; this._colorMap = {}; }
      this._isObj = false;
      if (!this._colorMap['value']) {
        this._colorMap['value'] = this._palette[0];
        this._keys = ['value'];
      }
    }
    if (this._startTime === null) this._startTime = Date.now();
    const ts = (Date.now() - this._startTime) / 1000;
    this._data.push(value);
    this._times.push(ts);
    if (this._data.length  > this._maxSamples) this._data.shift();
    if (this._times.length > this._maxSamples) this._times.shift();
    this._ledLastFlash = millis();
  }

  clear() {
    this._data = []; this._keys = []; this._colorMap = {}; this._isObj = false;
    this._times = []; this._startTime = null; this._hoverFrac = null; this._hoverMouseX = null;
  }

  get visible()       { return this._visible; }
  set visible(v)      { this._visible = !!v; }
  get minimized()     { return this._minimized; }
  set minimized(v)    { this._minimized = !!v; }
  get autoAdjustY()   { return this._autoAdjustY; }
  set autoAdjustY(v)  { this._autoAdjustY = !!v; }
  get data()          { return [...this._data]; }

  // ── Geometry ──────────────────────────────────────────────────────────────

  get _titleH() { return 20; }
  _drawnH()     { return this._minimized ? this._titleH : this.height; }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this._drawnH();
  }

  _btnRect() {
    const bx = this.x + this.width - this._btnSz - 5;
    const by = this.y + (this._titleH - this._btnSz) / 2;
    return { bx, by, bsz: this._btnSz };
  }

  _hitBtn(mx, my) {
    if (!this.minimizable) return false;
    const { bx, by, bsz } = this._btnRect();
    return mx >= bx && mx <= bx + bsz && my >= by && my <= by + bsz;
  }

  _inResizeHandle(mx, my) {
    if (!this.resizable || this._minimized) return false;
    return mx >= this.x + this.width  - this._gripSz && mx <= this.x + this.width &&
           my >= this.y + this.height - this._gripSz && my <= this.y + this.height;
  }

  // Plot area: left margin for Y labels, bottom margin for X time labels
  _plotRect() {
    const labW = 32, xLabH = 14;
    return {
      px: this.x + labW,
      py: this.y + this._titleH + 4,
      pw: this.width  - labW - 5,
      ph: this.height - this._titleH - 6 - xLabH,
    };
  }

  // Returns { perKey: bool, ranges: {key: {lo,hi}} }
  // perKey=true when autoAdjustY is on and multiple variables are present —
  // each variable is normalised independently so all fit the plot height.
  _computeRanges() {
    const keyRange = key => {
      let lo = Infinity, hi = -Infinity;
      for (const d of this._data) {
        const v = this._isObj ? d[key] : d;
        if (typeof v === 'number') { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      }
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      if (lo === hi)      { lo -= 0.5; hi += 0.5; }
      return { lo, hi };
    };

    if (!this._autoAdjustY) {
      const r = { lo: this._yMin ?? 0, hi: this._yMax ?? 1 };
      const ranges = {};
      for (const k of this._keys) ranges[k] = r;
      return { perKey: false, ranges };
    }

    if (this._isObj && this._keys.length > 1) {
      const ranges = {};
      for (const k of this._keys) ranges[k] = keyRange(k);
      return { perKey: true, ranges };
    }

    // Single variable — shared range
    const key = this._isObj ? this._keys[0] : 'value';
    const r = this._keys.length ? keyRange(key) : { lo: 0, hi: 1 };
    const ranges = {};
    for (const k of this._keys) ranges[k] = r;
    return { perKey: false, ranges };
  }

  // ── Drawing ───────────────────────────────────────────────────────────────

  draw() {
    if (!this._visible) { this._markDrawn(); return; }
    this._markDrawn();
    const { x, y, width, theme } = this;

    push();
    fill(theme.panel); stroke(theme.panelStroke); strokeWeight(1);
    rect(x, y, width, this._drawnH(), 4);
    pop();

    _drawBevelTitleBar(theme, x, y, width, this._titleH, this._minimized, this.label);
    _drawTitleLED(x, y, this._titleH, 1 - (millis() - this._ledLastFlash) / 400);
    if (this.minimizable) this._drawToggleBtn();
    if (this._minimized) return;

    const { px, py, pw, ph }    = this._plotRect();
    const { perKey, ranges }    = this._computeRanges();

    const gc = drawingContext;
    gc.save();
    gc.beginPath();
    gc.rect(px, py, pw, ph);
    gc.clip();

    // Slightly darkened plot background
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color('#000000'), 0.12));
    rect(px, py, pw, ph);
    pop();

    if (this._showGrid)         this._drawGrid(px, py, pw, ph);
    if (this._data.length >= 2) this._drawLines(px, py, pw, ph, ranges);
    if (this._hoverFrac !== null && this._data.length >= 2)
      this._drawHoverOverlay(px, py, pw, ph, ranges);

    gc.restore();

    this._drawYAxis(px, py, pw, ph, ranges, perKey);
    this._drawXAxis(px, py, pw, ph);
    if (this._showLegend && this._keys.length > 1) this._drawLegend(px, py, pw, ph);
    if (this._hoverFrac !== null && this._data.length >= 2)
      this._drawHoverTooltip(px, py, pw, ph);
    if (this.resizable) this._drawResizeGrip();
  }

  _drawGrid(px, py, pw, ph) {
    const { theme } = this;
    push();
    strokeWeight(0.5);
    stroke(lerpColor(color(theme.panel), color(theme.panelStroke), 0.5));
    noFill();
    for (let i = 1; i < 4; i++) {
      const sy = py + ph * (1 - i / 4);
      line(px, sy, px + pw, sy);
    }
    pop();
  }

  _drawLines(px, py, pw, ph, ranges) {
    const n  = this._data.length;
    const t0 = this._times[0]     ?? 0;
    const t1 = this._times[n - 1] ?? 0;
    const tSpan = t1 - t0;
    const xOf = i => tSpan > 0
      ? px + ((this._times[i] - t0) / tSpan) * pw
      : px + (i / (n - 1)) * pw;

    for (const key of this._keys) {
      const { lo, hi } = ranges[key];
      push();
      stroke(this._colorMap[key]);
      strokeWeight(this._lineWidth);
      noFill();
      beginShape();
      let open = false;
      for (let i = 0; i < n; i++) {
        const d = this._data[i];
        const v = this._isObj ? d[key] : d;
        if (typeof v !== 'number') {
          if (open) { endShape(); open = false; }
          continue;
        }
        const sy = constrain(py + ph - ((v - lo) / (hi - lo)) * ph, py - 1, py + ph + 1);
        vertex(xOf(i), sy);
        open = true;
      }
      if (open) endShape();
      pop();
    }
  }

  _drawYAxis(px, py, pw, ph, ranges, perKey) {
    const { theme } = this;
    push();
    textSize(8);
    if (theme.font) textFont(theme.font);
    textAlign(RIGHT, CENTER);
    noStroke();
    fill(theme.label);
    if (perKey) {
      // Normalised per-variable mode — Y axis shows percentage ticks
      const PCT = ['0%', '25%', '50%', '75%', '100%'];
      for (let i = 0; i <= 4; i++) {
        const sy = py + ph - (i / 4) * ph;
        text(PCT[i], px - 3, sy);
      }
    } else {
      const firstKey = this._keys[0] ?? 'value';
      const { lo, hi } = ranges[firstKey] ?? { lo: 0, hi: 1 };
      for (let i = 0; i <= 4; i++) {
        const t  = i / 4;
        const sy = py + ph - t * ph;
        text(_fmtNum(lo + t * (hi - lo)), px - 3, sy);
      }
    }
    strokeWeight(0.5);
    stroke(lerpColor(color(theme.panel), color(theme.panelStroke), 0.7));
    line(px, py, px, py + ph);
    pop();
  }

  _drawXAxis(px, py, pw, ph) {
    const n = this._times.length;
    if (n < 2) return;
    const t0 = this._times[0];
    const t1 = this._times[n - 1];
    const span = t1 - t0;
    if (span <= 0) return;

    const { theme } = this;
    const axisY = py + ph;

    // Compute a nice tick interval targeting ~4 ticks
    const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600];
    const raw = span / 4;
    const interval = steps.find(s => s >= raw) ?? steps[steps.length - 1];
    const firstTick = Math.ceil(t0 / interval) * interval;

    push();
    textSize(7);
    if (theme.font) textFont(theme.font);
    const axisCol = lerpColor(color(theme.panel), color(theme.panelStroke), 0.7);
    strokeWeight(0.5);
    stroke(axisCol);
    line(px, axisY, px + pw, axisY);

    for (let t = firstTick; t <= t1 + interval * 0.01; t += interval) {
      if (t < t0) continue;
      const tx = px + ((t - t0) / span) * pw;
      if (tx > px + pw + 1) break;
      stroke(axisCol); strokeWeight(0.5);
      line(tx, axisY, tx, axisY + 3);
      noStroke();
      fill(theme.label);
      textAlign(CENTER, TOP);
      text(_fmtTime(t), tx, axisY + 4);
    }
    pop();
  }

  _timeToFrac(t) {
    const n = this._times.length;
    if (n === 0) return 0;
    if (t <= this._times[0])     return 0;
    if (t >= this._times[n - 1]) return n - 1;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (this._times[mid] <= t) lo = mid; else hi = mid;
    }
    const span = this._times[hi] - this._times[lo];
    return span > 0 ? lo + (t - this._times[lo]) / span : lo;
  }

  _drawLegend(px, py, pw, ph) {
    const { theme } = this;
    const swSz = 6, gap = 3, rowH = 10, padX = 5, padY = 3;
    push();
    textSize(8);
    if (theme.font) textFont(theme.font);
    noStroke();

    let maxLW = 0;
    for (const k of this._keys) maxLW = Math.max(maxLW, textWidth(k));
    const bgW = swSz + gap + maxLW + padX * 2;
    const bgH = this._keys.length * rowH + padY * 2;
    const lx  = px + pw - 2;
    const ly  = py + 2;

    const pc = color(theme.panel);
    fill(red(pc), green(pc), blue(pc), 200);
    rect(lx - bgW, ly, bgW, bgH, 2);

    textAlign(LEFT, TOP);
    for (let i = 0; i < this._keys.length; i++) {
      const k  = this._keys[i];
      const ry = ly + padY + i * rowH;
      fill(this._colorMap[k]);
      rect(lx - bgW + padX, ry + 1, swSz, swSz - 2, 1);
      fill(theme.label);
      text(k, lx - bgW + padX + swSz + gap, ry);
    }
    pop();
  }

  _getHoverInfo(frac) {
    const i0 = Math.floor(frac);
    const i1 = Math.min(i0 + 1, this._data.length - 1);
    const t  = frac - i0;
    const t0 = this._times[i0] ?? 0;
    const t1 = this._times[i1] ?? t0;
    const hoverTime = t0 + (t1 - t0) * t;
    const values = {};
    for (const key of this._keys) {
      const v0 = this._isObj ? (this._data[i0]?.[key] ?? null) : this._data[i0];
      const v1 = this._isObj ? (this._data[i1]?.[key] ?? null) : this._data[i1];
      if (typeof v0 === 'number' && typeof v1 === 'number') values[key] = v0 + (v1 - v0) * t;
      else if (typeof v0 === 'number')                       values[key] = v0;
      else                                                   values[key] = null;
    }
    return { hoverTime, values };
  }

  _drawHoverOverlay(px, py, pw, ph, ranges) {
    const sx = this._hoverMouseX;
    if (sx === null) return;
    const { values } = this._getHoverInfo(this._hoverFrac);
    push();
    strokeWeight(1);
    stroke(255, 255, 255, 70);
    line(sx, py, sx, py + ph);
    for (const key of this._keys) {
      const v = values[key];
      if (v === null) continue;
      const { lo, hi } = ranges[key];
      const sy = constrain(py + ph - ((v - lo) / (hi - lo)) * ph, py, py + ph);
      noStroke();
      fill(this._colorMap[key]);
      ellipse(sx, sy, 6, 6);
      noFill();
      stroke(255, 255, 255, 150);
      strokeWeight(1);
      ellipse(sx, sy, 9, 9);
    }
    pop();
  }

  _drawHoverTooltip(px, py, pw, ph) {
    const sx = this._hoverMouseX;
    if (sx === null) return;
    const { theme } = this;
    const { hoverTime, values } = this._getHoverInfo(this._hoverFrac);

    const timeStr = hoverTime.toFixed(1) + 's';
    const lines   = this._keys.length === 1
      ? [timeStr + (values[this._keys[0]] !== null ? '  ' + _fmtNum(values[this._keys[0]]) : '')]
      : [timeStr, ...this._keys.filter(k => values[k] !== null)
                               .map(k => k + ': ' + _fmtNum(values[k]))];

    push();
    textSize(9);
    if (theme.font) textFont(theme.font);
    const padX = 5, padY = 4, rowH = 11;
    let maxW = 0;
    for (const l of lines) maxW = Math.max(maxW, textWidth(l));
    const bw = maxW + padX * 2;
    const bh = lines.length * rowH + padY * 2;

    const MARGIN = 6;
    let tx = sx + MARGIN;
    if (tx + bw > px + pw) tx = sx - MARGIN - bw;
    const ty = py + MARGIN;

    const pc = color(theme.panel);
    fill(red(pc), green(pc), blue(pc), 235);
    stroke(theme.panelStroke);
    strokeWeight(0.5);
    rect(tx, ty, bw, bh, 3);

    noStroke();
    textAlign(LEFT, TOP);
    const visibleKeys = this._keys.filter(k => values[k] !== null);
    for (let i = 0; i < lines.length; i++) {
      if (i === 0) {
        fill(theme.capHighlight ?? theme.label);
      } else {
        const key = visibleKeys[i - 1];
        fill(key ? this._colorMap[key] : theme.label);
      }
      text(lines[i], tx + padX, ty + padY + i * rowH);
    }
    pop();
  }

  _drawToggleBtn() {
    const { bx, by, bsz } = this._btnRect();
    const hov = mouseX >= bx && mouseX <= bx + bsz && mouseY >= by && mouseY <= by + bsz;
    const { theme } = this;
    push();
    noStroke();
    fill(hov
      ? lerpColor(color(theme.capBody), color(theme.capHighlight), 0.5)
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.6));
    rect(bx, by, bsz, bsz, 2);
    stroke(theme.label); strokeWeight(1.5); noFill();
    const cx = bx + bsz / 2, cy = by + bsz / 2, arm = bsz * 0.28;
    line(cx - arm, cy, cx + arm, cy);
    if (this._minimized) line(cx, cy - arm, cx, cy + arm);
    pop();
  }

  _drawResizeGrip() {
    const { x, y, width, height, theme } = this;
    const hov = this._inResizeHandle(mouseX, mouseY) || this._resizing;
    const col = hov
      ? theme.capHighlight
      : lerpColor(color(theme.panel), color(theme.panelStroke), 0.9);
    push();
    noStroke(); fill(col);
    const cx = x + width, cy = y + height;
    const d = 1.8, sp = 4;
    ellipse(cx-3,       cy-3,       d, d);
    ellipse(cx-3-sp,    cy-3,       d, d);
    ellipse(cx-3,       cy-3-sp,    d, d);
    ellipse(cx-3-sp*2,  cy-3,       d, d);
    ellipse(cx-3-sp,    cy-3-sp,    d, d);
    ellipse(cx-3,       cy-3-sp*2,  d, d);
    pop();
  }

  // ── Events ────────────────────────────────────────────────────────────────

  mouseMoved() {
    if (!this._visible) return;

    if (this._resizing) {
      this.width  = Math.max(120, mouseX - this.x);
      this.height = Math.max(80,  mouseY - this.y);
      const cv = document.querySelector('canvas');
      if (cv) cv.style.cursor = 'nwse-resize';
      return;
    }

    if (this._draggingPanel) {
      this.x = mouseX - this._dragPanelOff.dx;
      this.y = mouseY - this._dragPanelOff.dy;
      return;
    }

    if (this.resizable && !this._minimized) {
      const was = this._gripHovered;
      this._gripHovered = this._inResizeHandle(mouseX, mouseY);
      if (this._gripHovered !== was) {
        const cv = document.querySelector('canvas');
        if (cv) cv.style.cursor = this._gripHovered ? 'nwse-resize' : '';
      }
    }

    if (!this._minimized && this._data.length >= 2) {
      const { px, py, pw, ph } = this._plotRect();
      if (mouseX >= px && mouseX <= px + pw && mouseY >= py && mouseY <= py + ph) {
        this._hoverMouseX = mouseX;
        const n    = this._times.length;
        const t0   = this._times[0]     ?? 0;
        const t1   = this._times[n - 1] ?? 0;
        const span = t1 - t0;
        if (span > 0) {
          const hoverTime = t0 + ((mouseX - px) / pw) * span;
          this._hoverFrac = this._timeToFrac(hoverTime);
        } else {
          this._hoverFrac = (mouseX - px) / pw * (this._data.length - 1);
        }
      } else {
        this._hoverFrac = null;
        this._hoverMouseX = null;
      }
    } else {
      this._hoverFrac = null;
      this._hoverMouseX = null;
    }
  }

  mousePressed() {
    if (!this._inBounds(mouseX, mouseY)) return;
    if (this._hitBtn(mouseX, mouseY)) { this._minimized = !this._minimized; return; }
    if (this.movable && mouseY < this.y + this._titleH) {
      this._draggingPanel = true;
      this._dragPanelOff  = { dx: mouseX - this.x, dy: mouseY - this.y };
      return;
    }
    if (this._minimized) return;
    if (this._inResizeHandle(mouseX, mouseY)) this._resizing = true;
  }

  mouseReleased() {
    if (this._resizing) {
      this._resizing = this._gripHovered = false;
      const cv = document.querySelector('canvas');
      if (cv) cv.style.cursor = '';
    }
    this._draggingPanel = false;
    this._dragPanelOff  = null;
  }
}

window.TimeGraphPanel = TimeGraphPanel;
// ListView - scrollable list of strings with row selection
class ListView extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0, x: 0, y: 0 }, opts));
    this.width       = opts.width       ?? 280;
    this.height      = opts.height      ?? 200;
    this.fontSize    = opts.fontSize    ?? 12;
    this.padding     = opts.padding     ?? 8;
    this._rowH       = this.fontSize * 1.6;
    this._scrollY    = 0;
    this._contentH   = 0;
    this._selectedIdx = -1;
    this._hoverIdx   = -1;
    this._hovered    = false;
    this.onSelect    = opts.onSelect ?? null;
    this._items      = [];
    this.items       = opts.items ?? [];
  }

  get items()  { return this._items; }
  set items(v) {
    this._items  = Array.isArray(v) ? v : [];
    this._contentH = this._items.length * this._rowH;
    this._scrollY  = 0;
    this._selectedIdx = -1;
  }

  get scrollY()  { return this._scrollY; }
  set scrollY(v) {
    const max = Math.max(0, this._contentH - (this.height - this.padding));
    this._scrollY = constrain(v, 0, max);
  }

  get selectedIdx()  { return this._selectedIdx; }
  set selectedIdx(i) {
    i = constrain(i, -1, this._items.length - 1);
    this._selectedIdx = i;
    if (i >= 0) {
      const rowY = i * this._rowH;
      const visH = this.height - this.padding;
      if (rowY < this._scrollY) this._scrollY = rowY;
      if (rowY + this._rowH > this._scrollY + visH) {
        this._scrollY = rowY + this._rowH - visH;
      }
    }
  }

  draw() {
    this._markDrawn();
    const { x, y, padding, fontSize: fs } = this;
    const { width: w, height: h } = this;

    this._drawPanel(x, y, w, h);

    const gc = drawingContext;
    const txt = this.theme.readout;
    const acc = this.theme.capIndicator;
    const pan = this.theme.panel;

    gc.save();
    gc.beginPath();
    gc.rect(x + 1, y + 1, w - 2, h - 2);
    gc.clip();
    gc.textBaseline = 'top';
    gc.textAlign    = 'left';
    gc.font = this.theme.font ? `${fs}px ${this.theme.font}` : `${fs}px system-ui, Arial, sans-serif`;

    let cy = y + padding / 2 - this._scrollY;

    const gap = (this._rowH - fs) / 2;

    for (let i = 0; i < this._items.length; i++) {
      const itemY = cy + i * this._rowH;
      if (itemY + this._rowH < y + 1 || itemY > y + h - 1) continue;

      if (i === this._selectedIdx) {
        gc.fillStyle = lerpColor(color(pan), color(acc), 0.18);
        gc.fillRect(x + 1, itemY - gap / 2, w - 2, this._rowH);
      } else if (i === this._hoverIdx) {
        gc.fillStyle = lerpColor(color(pan), color(acc), 0.08);
        gc.fillRect(x + 1, itemY - gap / 2, w - 2, this._rowH);
      }

      gc.fillStyle = txt;
      gc.fillText(this._items[i], x + padding, itemY);
    }

    gc.restore();

    const maxScroll = Math.max(0, this._contentH - (h - padding));
    if (maxScroll > 0) {
      const sbW = 4, sbX = x + w - sbW;
      const trackH = h - padding;
      const thumbH = Math.max(trackH * (h - padding) / this._contentH, 16);
      const thumbY = y + padding / 2 + (this._scrollY / maxScroll) * (trackH - thumbH);

      push();
      noStroke();
      fill(lerpColor(color(this.theme.panel), color(this.theme.track), 0.4));
      rect(sbX, y + padding / 2, sbW, trackH, 1);
      fill(this.theme.capIndicator);
      rect(sbX, thumbY, sbW, thumbH, 1);
      pop();
    }

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  mouseMoved() {
    const wasHovered = this._hovered;
    this._hovered = mouseX >= this.x && mouseX <= this.x + this.width &&
                    mouseY >= this.y && mouseY <= this.y + this.height;

    if (this._hovered) {
      const i = Math.floor((mouseY - this.y - this.padding / 2 + this._scrollY) / this._rowH);
      this._hoverIdx = i >= 0 && i < this._items.length ? i : -1;
    } else {
      this._hoverIdx = -1;
    }
  }

  mousePressed() {
    if (!this._hovered) return;
    const i = Math.floor((mouseY - this.y - this.padding / 2 + this._scrollY) / this._rowH);
    if (i >= 0 && i < this._items.length) {
      this._selectedIdx = i;
      if (this.onSelect) this.onSelect(this._items[i], i);
    }
  }

  mouseReleased() {
    if (this._selectedIdx >= 0 && this.onRelease) {
      this.onRelease(this._items[this._selectedIdx], this._selectedIdx);
    }
  }

  mouseWheel(e) {
    if (!this._hovered) return;
    const maxScroll = Math.max(0, this._contentH - (this.height - this.padding));
    if (maxScroll <= 0) return;
    this._scrollY = constrain(this._scrollY + (e.deltaY ?? e.delta ?? 0) * 0.4, 0, maxScroll);
    return false;
  }
}

// GridView - scrollable table with static header and column auto-sizing
class GridView extends ProControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0, x: 0, y: 0 }, opts));
    this.width       = opts.width       ?? 400;
    this.height      = opts.height      ?? 220;
    this.fontSize    = opts.fontSize    ?? 12;
    this.padding     = opts.padding     ?? 8;
    this._headerH    = this.fontSize * 1.8;
    this._rowH       = this.fontSize * 1.6;
    this._scrollY    = 0;
    this._scrollX    = 0;
    this._contentH   = 0;
    this._selectedIdx = -1;
    this._hoverIdx   = -1;
    this._hovered    = false;
    this._items      = [];
    this._keys       = [];
    this._colWidths  = null;
    this._totalW     = 0;
    this._dragVSB    = false;
    this._dragHSB    = false;
    this._dragRef    = null;
    this.onSelect    = opts.onSelect ?? null;
    this.items       = opts.items ?? [];
  }

  get items()  { return this._items; }
  set items(v) {
    this._items  = Array.isArray(v) ? v : [];
    this._keys   = this._items.length > 0 ? Object.keys(this._items[0]) : [];
    this._colWidths = null;
    this._contentH  = this._items.length * this._rowH;
    this._scrollX   = 0;
    this._scrollY   = 0;
    this._selectedIdx = -1;
  }

  get scrollY()  { return this._scrollY; }
  set scrollY(v) {
    const max = Math.max(0, this._contentH - (this.height - this._headerH - this.padding));
    this._scrollY = constrain(v, 0, max);
  }

  get scrollX()  { return this._scrollX; }
  set scrollX(v) {
    const max = Math.max(0, this._totalW - (this.width - this.padding));
    this._scrollX = constrain(v, 0, max);
  }

  get selectedIdx()  { return this._selectedIdx; }
  set selectedIdx(i) {
    i = constrain(i, -1, this._items.length - 1);
    this._selectedIdx = i;
    if (i >= 0) {
      const rowY = i * this._rowH;
      const visH = this.height - this._headerH - this.padding;
      if (rowY < this._scrollY) this._scrollY = rowY;
      if (rowY + this._rowH > this._scrollY + visH) {
        this._scrollY = rowY + this._rowH - visH;
      }
    }
  }

  _computeCols(gc) {
    if (this._colWidths !== null || this._items.length === 0) return;

    this._colWidths = [];
    const boldFont = `bold ${this.fontSize}px ${this.theme.font ?? 'system-ui, Arial, sans-serif'}`;
    const normalFont = `${this.fontSize}px ${this.theme.font ?? 'system-ui, Arial, sans-serif'}`;

    for (const key of this._keys) {
      gc.font = boldFont;
      let w = gc.measureText(String(key)).width;

      gc.font = normalFont;
      for (const item of this._items) {
        const val = String(item[key] ?? '');
        w = Math.max(w, gc.measureText(val).width);
      }

      this._colWidths.push(w + this.padding * 2);
    }

    this._totalW = this._colWidths.reduce((a, b) => a + b, 0);
  }

  _drawCells(gc, rowY, item, isHeader, rowH, startX, endX) {
    const boldFont = `bold ${this.fontSize}px ${this.theme.font ?? 'system-ui, Arial, sans-serif'}`;
    const normalFont = `${this.fontSize}px ${this.theme.font ?? 'system-ui, Arial, sans-serif'}`;

    gc.textBaseline = 'top';
    gc.textAlign = 'left';

    let cellX = startX;
    for (let i = 0; i < this._keys.length; i++) {
      const colW = this._colWidths[i];
      const cellRight = cellX + colW;

      if (cellRight < startX || cellX > endX) {
        cellX += colW;
        continue;
      }

      gc.save();
      gc.beginPath();
      gc.rect(cellX, rowY, colW, rowH);
      gc.clip();

      gc.font = isHeader ? boldFont : normalFont;
      gc.fillStyle = isHeader ? this.theme.label : this.theme.readout;
      const val = isHeader ? this._keys[i] : String(item[this._keys[i]] ?? '');
      gc.fillText(val, cellX + this.padding, rowY);

      if (!isHeader && i < this._keys.length - 1) {
        gc.strokeStyle = lerpColor(color(this.theme.panel), color(this.theme.panelStroke), 0.3);
        gc.lineWidth = 1;
        gc.beginPath();
        gc.moveTo(cellRight, rowY);
        gc.lineTo(cellRight, rowY + rowH);
        gc.stroke();
      }

      gc.restore();
      cellX += colW;
    }
  }

  draw() {
    this._markDrawn();
    const { x, y, padding, fontSize: fs } = this;
    const { width: w, height: h } = this;

    this._drawPanel(x, y, w, h);
    this._computeCols(drawingContext);

    const gc = drawingContext;
    const pan = this.theme.panel;
    const stroke = this.theme.panelStroke;
    const acc = this.theme.capIndicator;

    const bodyY = y + 1 + this._headerH;
    const bodyH = h - 2 - this._headerH;
    const maxW = w - 2;
    const maxScrollX = Math.max(0, this._totalW - maxW);
    const maxScrollY = Math.max(0, this._contentH - (bodyH - padding));

    // Clamp scrolls
    this._scrollX = constrain(this._scrollX, 0, maxScrollX);
    this._scrollY = constrain(this._scrollY, 0, maxScrollY);

    // Draw header
    gc.save();
    gc.beginPath();
    gc.rect(x + 1, y + 1, w - 2, h - 2);
    gc.clip();

    const headerBg = lerpColor(color(pan), color(stroke), 0.55);
    gc.fillStyle = headerBg;
    gc.fillRect(x + 1, y + 1, w - 2, this._headerH);

    this._drawCells(gc, y + 1, null, true, this._headerH, x + 1 - this._scrollX, x + w - 1 - this._scrollX);

    gc.strokeStyle = lerpColor(color(stroke), color(pan), 0.5);
    gc.lineWidth = 1;
    gc.beginPath();
    gc.moveTo(x + 1, y + 1 + this._headerH);
    gc.lineTo(x + w - 1, y + 1 + this._headerH);
    gc.stroke();

    // Draw rows
    gc.beginPath();
    gc.rect(x + 1, bodyY, w - 2, bodyH - 1);
    gc.clip();

    let cy = bodyY + padding / 2 - this._scrollY;
    const gap = (this._rowH - fs) / 2;

    for (let i = 0; i < this._items.length; i++) {
      const rowY = cy + i * this._rowH;
      if (rowY + this._rowH < bodyY || rowY > y + h - 1) continue;

      if (i === this._selectedIdx) {
        gc.fillStyle = lerpColor(color(pan), color(acc), 0.18);
        gc.fillRect(x + 1, rowY - gap / 2, w - 2, this._rowH);
      } else if (i === this._hoverIdx) {
        gc.fillStyle = lerpColor(color(pan), color(acc), 0.08);
        gc.fillRect(x + 1, rowY - gap / 2, w - 2, this._rowH);
      }

      this._drawCells(gc, rowY, this._items[i], false, this._rowH, x + 1 - this._scrollX, x + w - 1 - this._scrollX);
    }

    gc.restore();

    // Vertical scrollbar
    const sbW = 4;
    if (maxScrollY > 0) {
      const sbX = x + w - sbW - 1;
      const trackH = bodyH - (maxScrollX > 0 ? sbW : 0);
      const thumbH = Math.max(trackH * bodyH / this._contentH, 16);
      const thumbY = bodyY + (this._scrollY / maxScrollY) * (trackH - thumbH);

      push();
      noStroke();
      fill(lerpColor(color(this.theme.panel), color(this.theme.track), 0.4));
      rect(sbX, bodyY, sbW, trackH, 1);
      fill(this.theme.capIndicator);
      rect(sbX, thumbY, sbW, thumbH, 1);
      pop();
    }

    // Horizontal scrollbar
    if (maxScrollX > 0) {
      const sbY = y + h - sbW - 1;
      const trackW = w - padding - (maxScrollY > 0 ? sbW : 0);
      const thumbW = Math.max(trackW * w / this._totalW, 16);
      const thumbX = x + padding / 2 + (this._scrollX / maxScrollX) * (trackW - thumbW);

      push();
      noStroke();
      fill(lerpColor(color(this.theme.panel), color(this.theme.track), 0.4));
      rect(x + padding / 2, sbY, trackW, sbW, 1);
      fill(this.theme.capIndicator);
      rect(thumbX, sbY, thumbW, sbW, 1);
      pop();
    }

    if (this.disabled) this._drawDisabled(x, y, w, h);
  }

  mouseMoved() {
    const wasHovered = this._hovered;
    this._hovered = mouseX >= this.x && mouseX <= this.x + this.width &&
                    mouseY >= this.y && mouseY <= this.y + this.height;

    const bodyY = this.y + 1 + this._headerH;
    const bodyH = this.height - 2 - this._headerH;

    if (this._dragVSB) {
      const dy = mouseY - this._dragRef.my;
      const maxScroll = Math.max(0, this._contentH - (bodyH - this.padding));
      if (maxScroll > 0) {
        const trackH = bodyH - (this._totalW > this.width - this.padding ? 4 : 0);
        this._scrollY = this._dragRef.sy + (dy / trackH) * maxScroll;
      }
    } else if (this._dragHSB) {
      const dx = mouseX - this._dragRef.mx;
      const maxScroll = Math.max(0, this._totalW - (this.width - this.padding));
      if (maxScroll > 0) {
        const trackW = this.width - this.padding - (this._contentH > bodyH - this.padding ? 4 : 0);
        this._scrollX = this._dragRef.sx + (dx / trackW) * maxScroll;
      }
    } else if (this._hovered && mouseY >= bodyY && mouseY < this.y + this.height) {
      const i = Math.floor((mouseY - bodyY - this.padding / 2 + this._scrollY) / this._rowH);
      this._hoverIdx = i >= 0 && i < this._items.length ? i : -1;
    } else {
      this._hoverIdx = -1;
    }
  }

  mousePressed() {
    if (!this._hovered) return;

    const bodyY = this.y + 1 + this._headerH;
    const bodyH = this.height - 2 - this._headerH;
    const maxScrollY = Math.max(0, this._contentH - (bodyH - this.padding));
    const maxScrollX = Math.max(0, this._totalW - (this.width - this.padding));

    // Check horizontal scrollbar
    if (maxScrollX > 0) {
      const sbY = this.y + this.height - 5;
      const trackW = this.width - this.padding - (maxScrollY > 0 ? 4 : 0);
      const thumbW = Math.max(trackW * this.width / this._totalW, 16);
      const thumbX = this.x + this.padding / 2 + (this._scrollX / maxScrollX) * (trackW - thumbW);

      if (mouseY >= sbY && mouseY < this.y + this.height && mouseX >= thumbX && mouseX < thumbX + thumbW) {
        this._dragHSB = true;
        this._dragRef = { mx: mouseX, sx: this._scrollX };
        return;
      }
    }

    // Check vertical scrollbar
    if (maxScrollY > 0) {
      const sbX = this.x + this.width - 5;
      const trackH = bodyH - (maxScrollX > 0 ? 4 : 0);
      const thumbH = Math.max(trackH * bodyH / this._contentH, 16);
      const thumbY = bodyY + (this._scrollY / maxScrollY) * (trackH - thumbH);

      if (mouseX >= sbX && mouseX < this.x + this.width && mouseY >= thumbY && mouseY < thumbY + thumbH) {
        this._dragVSB = true;
        this._dragRef = { my: mouseY, sy: this._scrollY };
        return;
      }
    }

    // Check row click
    if (mouseY >= bodyY) {
      const i = Math.floor((mouseY - bodyY - this.padding / 2 + this._scrollY) / this._rowH);
      if (i >= 0 && i < this._items.length) {
        this._selectedIdx = i;
        if (this.onSelect) this.onSelect(this._items[i], i);
      }
    }
  }

  mouseReleased() {
    this._dragVSB = false;
    this._dragHSB = false;
    if (this._selectedIdx >= 0 && this.onRelease) {
      this.onRelease(this._items[this._selectedIdx], this._selectedIdx);
    }
  }

  mouseWheel(e) {
    if (!this._hovered) return;
    const bodyH = this.height - 2 - this._headerH;
    const maxScroll = Math.max(0, this._contentH - (bodyH - this.padding));
    if (maxScroll <= 0) return;
    this._scrollY = constrain(this._scrollY + (e.deltaY ?? e.delta ?? 0) * 0.4, 0, maxScroll);
    return false;
  }
}

window.ListView = ListView;
window.GridView = GridView;
