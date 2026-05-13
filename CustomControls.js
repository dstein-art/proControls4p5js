// CustomControls.js — example extensions (load after AnalogControls.js)

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
// Extends AnalogControl directly — no fader involved.
// Exposes valueX / valueY and fires onChangeX / onChangeY.

class XYPad extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.width  = opts.width  ?? 160;
    this.height = opts.height ?? 160;
    this.minX   = opts.minX  ?? this.min;
    this.maxX   = opts.maxX  ?? this.max;
    this.minY   = opts.minY  ?? this.min;
    this.maxY   = opts.maxY  ?? this.max;
    this.valueX = opts.valueX ?? (this.minX + this.maxX) / 2;
    this.valueY = opts.valueY ?? (this.minY + this.maxY) / 2;
    this.scaleX    = opts.scaleX    ?? 'linear'; // 'linear' | 'log' (log requires minX > 0)
    this.scaleY    = opts.scaleY    ?? 'linear'; // 'linear' | 'log' (log requires minY > 0)
    this.onChangeX = opts.onChangeX ?? null;
    this.onChangeY = opts.onChangeY ?? null;
    this.crosshairColor = opts.crosshairColor ?? this.theme.capIndicator;
    this._pad = 10;
    this._springDefaultX = this.valueX;
    this._springDefaultY = this.valueY;
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
        this.valueX = this._springDefaultX;
        this.valueY = this._springDefaultY;
        if (this.onChangeX) this.onChangeX(this.valueX);
        if (this.onChangeY) this.onChangeY(this.valueY);
        if (this.onChange) this.onChange(this.valueX, this.valueY);
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
      if (this.onRelease) this.onRelease(this.valueX, this.valueY);
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
    this.valueX = lerp(this._springFromX, this._springDefaultX, ease);
    this.valueY = lerp(this._springFromY, this._springDefaultY, ease);
    if (this.onChange)  this.onChange(this.valueX, this.valueY);
    if (this.onChangeX) this.onChangeX(this.valueX);
    if (this.onChangeY) this.onChangeY(this.valueY);
    if (t >= 1) {
      this.valueX = this._springDefaultX;
      this.valueY = this._springDefaultY;
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
    const prevX = this.valueX;
    const prevY = this.valueY;
    this.valueX = this.scaleX === 'log'
      ? this.minX * Math.pow(this.maxX / this.minX, nx)
      : this.minX + nx * (this.maxX - this.minX);
    this.valueY = this.scaleY === 'log'
      ? this.minY * Math.pow(this.maxY / this.minY, ny)
      : this.minY + ny * (this.maxY - this.minY);
    if (this.valueX !== prevX && this.onChangeX) this.onChangeX(this.valueX);
    if (this.valueY !== prevY && this.onChangeY) this.onChangeY(this.valueY);
    if ((this.valueX !== prevX || this.valueY !== prevY) && this.onChange)
      this.onChange(this.valueX, this.valueY);
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

class LEDMeter extends AnalogControl {
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

class ADSRDisplay extends AnalogControl {
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

class Selector extends AnalogControl {
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
    if (this.onChange) this.onChange(this.state, this.options[this.state]);
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
      if (this.onChange) this.onChange(this.state, this.options[this.state]);
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
      if (this.onRelease) this.onRelease(this.state, this.options[this.state]);
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
          if (this.onChange) this.onChange(this.state, this.options[this.state]);
        }
      }
      this._active     = false;
      this._dragY      = null;
      this._teethPress = false;
      if (this.onRelease) this.onRelease(this.state, this.options[this.state]);
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
        this.onChange(this.state, this.options[this.state]);
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
      if (this.onChange) this.onChange(this.state, this.options[this.state]);
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
    if (this.onChange) this.onChange(this.state, this.options[this.state]);
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

class MultiSlider extends AnalogControl {
  constructor(opts = {}) {
    super({ x: opts.x, y: opts.y, label: opts.label ?? '', theme: opts.theme });

    this.onChange   = opts.onChange  ?? null;
    this.onRelease  = opts.onRelease ?? null;
    this.horizontal = opts.horizontal ?? false;

    const sliders = opts.sliders ?? {};
    const keys    = Object.keys(sliders);
    const gap     = opts.gap ?? 4;

    this._names    = keys;
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

    let curX = this.x;
    let curY = this.y;
    for (const name of keys) {
      const raw   = sliders[name];
      const isObj = (typeof raw === 'object' && raw !== null);
      const val   = isObj ? (raw.value ?? base.min) : raw;
      const over  = isObj ? raw : {};

      const s = new AnalogSlider({
        ...base,
        ...over,
        x:         this.horizontal ? this.x : curX,
        y:         this.horizontal ? curY   : this.y,
        value:     val,
        label:     name,
        onChange:  () => { if (this.onChange)  this.onChange(this._values()); },
        onRelease: () => { if (this.onRelease) this.onRelease(this._values()); },
      });
      // Children stay in _analogRegistry — they handle their own events
      // independently, just like standalone sliders.
      this._children.push(s);
      if (this.horizontal) {
        curY += s.height + gap;
      } else {
        curX += s.width + gap;
      }
    }
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

  draw() {
    this._markDrawn();
    const bb = this._bb();
    if (bb) _drawBevelGroup(this.theme, bb.x, bb.y, bb.w, bb.h);
    for (const s of this._children) s.draw();
  }

  remove() {
    super.remove();
    for (const s of this._children) s.remove();
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

class MultiDial extends AnalogControl {
  constructor(opts = {}) {
    super({ x: opts.x, y: opts.y, label: opts.label ?? '', theme: opts.theme });

    this.onChange   = opts.onChange   ?? null;
    this.onRelease  = opts.onRelease  ?? null;
    this.horizontal = opts.horizontal ?? true; // true = row, false = column

    const dials = opts.dials ?? {};
    const keys  = Object.keys(dials);
    const gap   = opts.gap ?? 4;

    this._names    = keys;
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

    let curX = this.x;
    let curY = this.y;
    for (const name of keys) {
      const raw   = dials[name];
      const isObj = (typeof raw === 'object' && raw !== null);
      const val   = isObj ? (raw.value ?? base.min) : raw;
      const over  = isObj ? raw : {};

      const d = new Dial({
        ...base,
        ...over,
        x:         this.horizontal ? curX   : this.x,
        y:         this.horizontal ? this.y : curY,
        value:     val,
        label:     name,
        onChange:  () => { if (this.onChange)  this.onChange(this._values()); },
        onRelease: () => { if (this.onRelease) this.onRelease(this._values()); },
      });
      // Children stay in _analogRegistry — they handle their own events.
      this._children.push(d);
      if (this.horizontal) {
        curX += d.size + gap;
      } else {
        curY += d._panelH() + gap;
      }
    }
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

  draw() {
    this._markDrawn();
    const bb = this._bb();
    if (bb) _drawBevelGroup(this.theme, bb.x, bb.y, bb.w, bb.h);
    for (const d of this._children) d.draw();
  }

  remove() {
    super.remove();
    for (const d of this._children) d.remove();
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

class GridPad extends AnalogControl {
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

class TagSelector extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.words     = opts.words    ?? [];
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

// ─── RangeSlider ─────────────────────────────────────────────────────────────
// A two-handle slider that defines a low/high range.
// opts: x, y, width, height, min, max, valueLow, valueHigh, label,
//       readout ('raw'|'percent'|'db'), decimals, horizontal,
//       showScale, showFader, onChange(low,high), onRelease(low,high), theme

class RangeSlider extends AnalogControl {
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
      if (this.onChange) this.onChange(this.valueLow, this.valueHigh);
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
      if (this.onRelease) this.onRelease(this.valueLow, this.valueHigh);
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
    if (this.onChange) this.onChange(this.valueLow, this.valueHigh);
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
    if (this.onChange) this.onChange(this.valueLow, this.valueHigh);
    return false;
  }
}

window.RangeSlider = RangeSlider;

// ─── Panel ───────────────────────────────────────────────────────────────────
// Container that hosts AnalogControls positioned relative to the panel's
// top-left. Use .add(control) to attach controls.  Clips content, draws
// scrollbars when children extend beyond the panel bounds.

class Panel extends AnalogControl {
  constructor(opts = {}) {
    super(Object.assign({ min: 0, max: 1, value: 0 }, opts));
    this.width     = opts.width  ?? 300;
    this.height    = opts.height ?? 200;
    this._visible  = opts.visible !== false;
    this._children = [];
    this._scrollX  = 0;
    this._scrollY  = 0;
    this._sbW      = 8;         // scrollbar thickness px
    this._dragSB   = null;      // 'v' | 'h' | null
    this._dragSBRef = null;
  }

  get visible()  { return this._visible; }
  set visible(v) {
    this._visible = !!v;
    if (!this._visible) {
      for (const c of this._children) { c._hovered = false; c._active = false; }
    }
  }

  get scrollX()  { return this._scrollX; }
  set scrollX(v) { this._scrollX = constrain(v, 0, this._maxScrollX()); }
  get scrollY()  { return this._scrollY; }
  set scrollY(v) { this._scrollY = constrain(v, 0, this._maxScrollY()); }

  // Remove control from the global registry and adopt it into this panel.
  add(control) {
    control.remove();
    this._children.push(control);
    return this;
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

  _needsV() { return this._contentH() > this.height; }
  _needsH() { return this._contentW() > this.width;  }
  _viewW()  { return this.width  - (this._needsV() ? this._sbW : 0); }
  _viewH()  { return this.height - (this._needsH() ? this._sbW : 0); }
  _maxScrollX() { return Math.max(0, this._contentW() - this._viewW()); }
  _maxScrollY() { return Math.max(0, this._contentH() - this._viewH()); }

  _inBounds(mx, my) {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }
  _inViewport(mx, my) {
    return mx >= this.x && mx <= this.x + this._viewW() &&
           my >= this.y && my <= this.y + this._viewH();
  }

  // Temporarily remap mouseX/mouseY to panel-local coords while calling fn.
  _withOffsetMouse(fn) {
    const ox = window.mouseX, oy = window.mouseY;
    window.mouseX = ox - this.x + this._scrollX;
    window.mouseY = oy - this.y + this._scrollY;
    try { fn(); } finally { window.mouseX = ox; window.mouseY = oy; }
  }

  // ── Event handlers ──────────────────────────────────────────────────────────
  mouseMoved() {
    if (!this._visible) return;

    // Scrollbar dragging uses raw canvas coords
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
      // Mouse is outside — clear hover/active on all children
      const ox = window.mouseX, oy = window.mouseY;
      window.mouseX = -99999; window.mouseY = -99999;
      for (const c of this._children) c.mouseMoved();
      window.mouseX = ox; window.mouseY = oy;
    }
  }

  mousePressed() {
    if (!this._visible || !this._inBounds(mouseX, mouseY)) return;

    if (this._needsV() && mouseX >= this.x + this._viewW()) {
      this._dragSB  = 'v';
      this._dragSBRef = { my: mouseY, scrollY: this._scrollY };
      return;
    }
    if (this._needsH() && mouseY >= this.y + this._viewH()) {
      this._dragSB  = 'h';
      this._dragSBRef = { mx: mouseX, scrollX: this._scrollX };
      return;
    }
    if (this._inViewport(mouseX, mouseY)) {
      this._withOffsetMouse(() => { for (const c of this._children) c.mousePressed(); });
    }
  }

  mouseReleased() {
    if (!this._visible) return;
    this._dragSB    = null;
    this._dragSBRef = null;
    this._withOffsetMouse(() => { for (const c of this._children) c.mouseReleased(); });
  }

  mouseWheel(e) {
    if (!this._visible || !this._inBounds(mouseX, mouseY)) return;

    // If a child control is hovered, let it consume the scroll
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

    const gc     = drawingContext;
    const { x, y, width, height, theme } = this;
    const needsV = this._needsV();
    const needsH = this._needsH();
    const viewW  = this._viewW();
    const viewH  = this._viewH();

    // Panel border + background
    push();
    fill(theme.panel);
    stroke(theme.panelStroke);
    strokeWeight(1);
    rect(x, y, width, height, 4);
    pop();

    // Clip viewport, translate to panel-local coordinate space, draw children
    gc.save();
    gc.beginPath();
    gc.rect(x + 1, y + 1, viewW - 2, viewH - 2);
    gc.clip();

    gc.save();
    gc.translate(x - this._scrollX, y - this._scrollY);
    for (const c of this._children) c.draw();
    gc.restore();

    gc.restore();

    if (needsV) this._drawVScrollBar(viewW, viewH);
    if (needsH) this._drawHScrollBar(viewW, viewH);
    if (this.label) this._drawLabel(x + width / 2, y + height + 3);
  }

  _drawVScrollBar(viewW, viewH) {
    const { x, y, theme } = this;
    const cH   = this._contentH();
    const tH   = Math.max(20, (viewH / cH) * viewH);
    const maxS = this._maxScrollY();
    const ty   = y + (maxS > 0 ? (this._scrollY / maxS) * (viewH - tH) : 0);
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color(theme.track), 0.4));
    rect(x + viewW, y, this._sbW, viewH, 2);
    fill(lerpColor(color(theme.capBody), color(theme.capHighlight), 0.3));
    rect(x + viewW + 1, ty, this._sbW - 2, tH, 2);
    pop();
  }

  _drawHScrollBar(viewW, viewH) {
    const { x, y, theme } = this;
    const cW   = this._contentW();
    const tW   = Math.max(20, (viewW / cW) * viewW);
    const maxS = this._maxScrollX();
    const tx   = x + (maxS > 0 ? (this._scrollX / maxS) * (viewW - tW) : 0);
    push();
    noStroke();
    fill(lerpColor(color(theme.panel), color(theme.track), 0.4));
    rect(x, y + viewH, viewW, this._sbW, 2);
    fill(lerpColor(color(theme.capBody), color(theme.capHighlight), 0.3));
    rect(tx, y + viewH + 1, tW, this._sbW - 2, 2);
    pop();
  }
}

window.Panel = Panel;
