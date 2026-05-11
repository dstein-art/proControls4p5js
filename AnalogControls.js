// AnalogControls.js — base class + Slider for p5.js

// Set AnalogStyle before creating controls to choose a built-in look.
// Per-control overrides still work via opts.theme.
//   AnalogStyle = 'black';     // dark electronic (default)
//   AnalogStyle = 'stainless'; // polished chrome/steel
//   AnalogStyle = 'white';     // Swiss/Braun minimalist
//   AnalogStyle = 'brushed';   // brushed aluminum

let AnalogStyle = 'black';

const AnalogThemes = {
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
};

// Backward-compatible alias — still usable as a per-control theme override base
const AnalogTheme = AnalogThemes.black;

function analogBackground() {
  const theme = AnalogThemes[AnalogStyle] ?? AnalogThemes.black;
  background(theme.bg);
  if (AnalogStyle === 'brushed')   _drawBrushedOverlay(theme);
  if (AnalogStyle === 'stainless') _drawStainlessOverlay(theme);
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

const _analogRegistry  = [];
const _drawnThisFrame  = new Set();
let   _analogWired      = false;
let   _analogWasPressed = false;
const _analogWheelQ     = [];

// Clear all registrations — call at the top of buildControls() when rebuilding.
function analogReset() {
  _analogRegistry.length = 0;
  _drawnThisFrame.clear();
  _analogWasPressed = false;
}

// p5.prototype.registerMethod only supports lifecycle hooks (pre/post/init/remove),
// NOT event names. Instead we use a single 'pre' hook that fires each frame after
// p5 has already updated mouseX, mouseY, mouseIsPressed from DOM events.
p5.prototype.registerMethod('pre', function () {
  // One-time canvas setup
  if (!_analogWired) {
    _analogWired = true;
    const canvas = this.canvas ?? document.querySelector('canvas');
    if (canvas) {
      canvas.style.touchAction = 'none';
      // Wheel has no p5 global for delta, so queue it via native listener
      canvas.addEventListener('wheel', e => {
        _analogWheelQ.push(e);
        e.preventDefault();
      }, { passive: false });
    }
  }

  // Dispatch hover / drag (safe to call every frame — uses current mouseX/mouseY)
  for (const c of _analogRegistry) c.mouseMoved();

  // Detect press / release edge transitions using p5's mouseIsPressed global
  const down = mouseIsPressed;
  if (down && !_analogWasPressed) {
    for (const c of _analogRegistry) c.mousePressed();
  } else if (!down && _analogWasPressed) {
    for (const c of _analogRegistry) c.mouseReleased();
  }
  _analogWasPressed = down;

  // Drain wheel queue
  for (const e of _analogWheelQ) {
    for (const c of _analogRegistry) c.mouseWheel(e);
  }
  _analogWheelQ.length = 0;
});

// Auto-draw: render every registered control that wasn't explicitly drawn
// this frame. Fires after the sketch's draw() so background is already set.
p5.prototype.registerMethod('post', function () {
  for (const c of _analogRegistry) {
    if (!_drawnThisFrame.has(c)) c.draw();
  }
  _drawnThisFrame.clear();
});

// ─── Base ────────────────────────────────────────────────────────────────────

class AnalogControl {
  constructor(opts = {}) {
    this.x        = opts.x        ?? 20;
    this.y        = opts.y        ?? 20;
    this.min      = opts.min      ?? 0;
    this.max      = opts.max      ?? 1;
    this.value    = opts.value    ?? this.min;
    this.label    = opts.label    ?? '';
    this.disabled = opts.disabled ?? false;
    this.onChange  = opts.onChange  ?? null;
    this.onRelease = opts.onRelease ?? null;
    this.scale    = opts.scale    ?? 'linear'; // 'linear' | 'log' (log requires min > 0)
    const base    = AnalogThemes[AnalogStyle] ?? AnalogThemes.black;
    this.theme    = Object.assign({}, base, opts.theme ?? {});
    this._hovered = false;
    this._active  = false;
    _analogRegistry.push(this);
  }

  // Unregister this control so it no longer receives events.
  remove() {
    const i = _analogRegistry.indexOf(this);
    if (i !== -1) _analogRegistry.splice(i, 1);
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
    rect(cx - w / 2, y, w, 13, 2);
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

  // Subclasses override these
  draw()          {}
  mousePressed()  {}
  mouseReleased() {}
  mouseMoved()    {}
  mouseWheel(_e)  {}
}

// ─── Slider ──────────────────────────────────────────────────────────────────

class AnalogSlider extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.height    = opts.height   ?? 180;
    this.readout   = opts.readout  ?? 'raw';  // 'raw' | 'percent' | 'db'
    this.decimals  = opts.decimals ?? 2;
    this.showScale = opts.showScale ?? true;
    this.showFader = opts.showFader ?? true;

    if (opts.width !== undefined) {
      this.width = opts.width;
    } else if (this.showScale) {
      // Auto-size width so scale labels fit inside the panel.
      // Labels are drawn right of the track centre:
      //   cx + trackW/2 + gap + tickLen + gap = cx + 12  (text start)
      // So the right half of the panel must be >= 12 + labelWidth + margin.
      const charPx   = 4;   // empirical px per char at textSize(7)
      const txtOff   = 12;  // distance from track centre to first text pixel
      const rPad     = 4;   // right margin
      const maxChars = Math.max(
        (this.min).toFixed(1).length,
        (this.max).toFixed(1).length
      );
      this.width = Math.max(44, Math.ceil((txtOff + maxChars * charPx + rPad) * 2));
    } else {
      this.width = 40;
    }

    // internal
    this._capH      = 24;
    this._trackPad  = this._capH / 2 + 2;
    this._dragStart = null; // { my, value }
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
    const cx = this._trackX();
    const { x, y, width: w, height: h } = this;

    // panel
    this._drawPanel(x, y, w, h);

    // hover glow
    if (this._hovered && !this.disabled) {
      push();
      noStroke();
      fill(this.theme.hoverGlow);
      rect(x, y, w, h, 4);
      pop();
    }

    // track groove
    const trackW  = 6;
    const trackX  = cx - trackW / 2;
    push();
    fill(this.theme.track);
    stroke(this.theme.trackStroke);
    strokeWeight(1);
    rect(trackX, this._trackTop(), trackW, this._trackLen(), 2);
    pop();

    // scale marks
    if (this.showScale) this._drawScale(cx, trackW);

    // fader cap
    if (this.showFader) this._drawCap(cx, this._capY());

    // readout
    this._drawReadout(cx, y + h - 12, this._formatReadout());

    // label
    this._drawLabel(cx, y + 2);

    // tooltip while dragging
    if (this._active) {
      this._drawTooltip(cx, this._capY(), this._formatReadout());
    }

    // disabled overlay
    if (this.disabled) this._drawDisabled(x, y, w, h);
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
    const cy = this._capY();
    return abs(my - cy) <= this._capH / 2 &&
           mx >= this.x && mx <= this.x + this.width;
  }

  mousePressed() {
    if (this.disabled) return;
    if (this._capHit(mouseX, mouseY)) {
      this._active    = true;
      this._dragStart = { my: mouseY, value: this.value };
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active    = false;
      this._dragStart = null;
      if (this.onRelease) this.onRelease(this.value);
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);

    if (this._active && this._dragStart) {
      const dy        = this._dragStart.my - mouseY;
      const normDelta = dy / this._trackLen();
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
    return false; // prevent page scroll
  }
}

// ─── Dial ────────────────────────────────────────────────────────────────────

class Dial extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.size      = opts.size      ?? 70;
    this.readout   = opts.readout   ?? 'raw';
    this.decimals  = opts.decimals  ?? 2;
    this.showScale = opts.showScale ?? false;
    this.showKnob  = opts.showKnob  ?? true;

    this._startAngle = 3 * Math.PI / 4;  // 7:30 o'clock (min)
    this._sweepAngle = 3 * Math.PI / 2;  // 270° clockwise sweep
    this._dragStart  = null;
  }

  _cx()     { return this.x + this.size / 2; }
  _cy()     { return this.y + this.size / 2; }
  _arcR()   { return this.size * 0.36; }
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
    if (this.showKnob) this._drawKnob(cx, cy);

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
      line(cx + ca * (r + 3), cy + sa * (r + 3),
           cx + ca * (r + 7), cy + sa * (r + 7));
      noStroke();
      text(nf(this._fromNorm(n), 1, 1), cx + ca * (r + 14), cy + sa * (r + 14));
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
      this._active    = true;
      this._dragStart = { my: mouseY, value: this.value };
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active    = false;
      this._dragStart = null;
      if (this.onRelease) this.onRelease(this.value);
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

// ─── AnalogSwitch ─────────────────────────────────────────────────────────────

class AnalogSwitch extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    // states: array of labels, e.g. ['OFF','ON'] or ['A','B','C']
    this.states   = opts.states   ?? ['OFF', 'ON'];
    this.state    = opts.state    ?? 0;           // index into states[]
    this.width    = opts.width    ?? 48;
    this.height   = opts.height   ?? (this.states.length > 2 ? this.states.length * 26 + 20 : 70);
    this.onChange = opts.onChange ?? null;        // called with (stateIndex, stateLabel)
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
    const n = this.states.length;
    return Math.floor((my - this.y) / (this.height / n));
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
  }

  mousePressed() {
    if (this.disabled) return;
    const slot = this._slotAt(mouseX, mouseY);
    if (slot < 0) return;
    if (this.states.length === 2) {
      // Toggle between 0 and 1
      this.state = this.state === 0 ? 1 : 0;
    } else {
      this.state = slot;
    }
    if (this.onChange) this.onChange(this.state, this.states[this.state]);
  }

  mouseReleased() {}
  mouseWheel(_e)  {}
}

// ─── Export (global scope for p5 sketches) ───────────────────────────────────
window.AnalogStyle       = AnalogStyle;    // read-only reflection; set via AnalogStyle = '...'
window.AnalogThemes      = AnalogThemes;
window.AnalogTheme       = AnalogTheme;   // backward compat (black preset)
window.analogBackground  = analogBackground;
window.analogReset       = analogReset;
window.analogControls    = function() { return [..._analogRegistry]; };
window.analogFullReset   = function() { _analogRegistry.length = 0; _drawnThisFrame.clear(); _analogWasPressed = false; _analogWired = false; };
window.AnalogControl     = AnalogControl;
window.AnalogSlider      = AnalogSlider;
window.Slider            = AnalogSlider;  // backward-compat alias
window.AnalogSwitch      = AnalogSwitch;
window.Dial              = Dial;
