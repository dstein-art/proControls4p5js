// AnalogControls.js — base class + Slider for p5.js

// Set AnalogStyle before creating controls to choose a built-in look.
// Per-control overrides still work via opts.theme.
//   AnalogStyle = 'black';     // dark electronic (default)
//   AnalogStyle = 'stainless'; // polished chrome/steel
//   AnalogStyle = 'white';     // Swiss/Braun minimalist
//   AnalogStyle = 'brushed';   // brushed aluminum
//   AnalogStyle = 'red';       // deep red studio console
//   AnalogStyle = 'blue';      // deep navy broadcast
//   AnalogStyle = 'yellow';    // warm amber/golden

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

  // Advance spring-back animations
  for (const c of _analogRegistry) c._tickSpring();

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

    this.springBack     = opts.springBack     ?? false;
    this.springDuration = opts.springDuration ?? 1.0;
    this._springActive  = false;
    this._springStartMs = 0;
    this._springFrom    = null;
    this._springDefault  = opts.springDefault ?? this.value; // subclasses may override
    this._lastPressTime  = -9999;

    _analogRegistry.push(this);
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

class AnalogSlider extends AnalogControl {
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

class Dial extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.size      = opts.size      ?? 70;
    this.readout   = opts.readout   ?? 'raw';
    this.decimals  = opts.decimals  ?? 2;
    this.showScale = opts.showScale ?? false;
    this.showKnob  = opts.showKnob  ?? true;
    this.style = opts.style ?? opts.dialStyle ?? 'classic'; // 'classic' | 'rubber' | 'grooved' | 'pointer'

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
      const ga  = (i / nG) * Math.PI * 2;
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
      if (this._isDoubleClick()) {
        this._cancelSpring();
        this.value = this._springDefault;
        if (this.onChange) this.onChange(this.value);
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

class Switch extends AnalogControl {
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
        if (this.onChange) this.onChange(this.state, this.states[this.state]);
      }
      return;
    }
    if (this._isDoubleClick()) {
      this._cancelSpring();
      this.state = this._springDefault;
      if (this.onChange) this.onChange(this.state, this.states[this.state]);
      return;
    }
    this._cancelSpring();
    if (this.states.length === 2) {
      this.state = this.state === 0 ? 1 : 0;
    } else {
      this.state = slot;
    }
    if (this.onChange) this.onChange(this.state, this.states[this.state]);
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
        this.onChange(this.state, this.states[this.state]);
    }
  }

  mouseWheel(_e)  {}
}

// ─── Export (global scope for p5 sketches) ───────────────────────────────────
window.AnalogStyle       = AnalogStyle;    // read-only reflection; set via AnalogStyle = '...'
window.AnalogThemes      = AnalogThemes;
window.analogBackground  = analogBackground;
window.analogReset       = analogReset;
window.analogControls    = function() { return [..._analogRegistry]; };
window.analogFullReset   = function() { _analogRegistry.length = 0; _drawnThisFrame.clear(); _analogWasPressed = false; _analogWired = false; };
window.AnalogControl     = AnalogControl;
window.AnalogSlider      = AnalogSlider;
window.Switch            = Switch;
window.AnalogSwitch      = Switch;        // backward-compat alias
window.Dial              = Dial;
