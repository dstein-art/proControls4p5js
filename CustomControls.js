// CustomControls.js — example extensions (load after AnalogControls.js)

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
      this._active = true;
      this._updateXY(mouseX, mouseY);
    }
  }

  mouseReleased() {
    if (this._active) {
      this._active = false;
      if (this.onRelease) this.onRelease(this.valueX, this.valueY);
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
    const c = color(hexStr);
    return color(red(c) * 0.12, green(c) * 0.12, blue(c) * 0.12);
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

// ─── RotarySelector ──────────────────────────────────────────────────────────
// Mechanical drum-style selector. Drag up/down on the control (or use the
// scroll wheel) to cycle through options. A gear wheel on the right rotates
// as you scroll. Only the selected option is fully visible at rest; adjacent
// options peek in at the drum edges during a drag.

class RotarySelector extends AnalogControl {
  constructor(opts = {}) {
    super(opts);
    this.options  = opts.options ?? ['A', 'B', 'C'];
    this.state    = opts.state   ?? 0;
    this.width    = opts.width   ?? 140;
    this.height   = opts.height  ?? 40;

    this._gearAngle   = 0;
    this._drumOffset  = 0;   // px shift applied to drum items during drag
    this._dragY       = null;
    this._stateAtDrag = 0;
    this._angleAtDrag = 0;
  }

  // ── geometry ───────────────────────────────────────────────────────────────

  _teethW()   { return Math.max(14, Math.round(this.height * 0.28)); }
  _dispW()    { return this.width - this._teethW() - 9; }
  _panelH()   { return this.height + (this.label ? 16 : 4); }
  _spacing()  { return Math.round((this.height - 4) * 0.62); }
  // pxPerStep matches the visual item spacing so snap threshold (~50%) feels natural
  _pxPerStep(){ return this._spacing(); }

  // ── drawing ────────────────────────────────────────────────────────────────

  draw() {
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
    // Exposed drum edge: horizontal ridges that scroll as the drum rotates.
    // Left shadow and right highlight suggest the cylindrical surface curving
    // away from the viewer on the left and catching light on the right rim.
    const gc    = drawingContext;
    const pitch = 6;   // pixels between ridge centres
    const nMax  = Math.ceil(th / pitch) + 2;

    // _gearAngle accumulates one tooth-step (2π/14) per selection step.
    // Mapping to pixels: one step = pxPerStep of linear travel.
    // Negate so dragging down (advancing) scrolls ridges upward.
    const scrollPx = -(this._gearAngle * (this._pxPerStep() * 14 / (Math.PI * 2)));
    const off      = ((scrollPx % pitch) + pitch) % pitch;

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

    // Ridges
    const cc = color(this.theme.capBody);
    const cr = red(cc) | 0, cg = green(cc) | 0, cb = blue(cc) | 0;
    for (let i = -1; i < nMax; i++) {
      const ry = ty + i * pitch + off;
      // top highlight
      gc.fillStyle = 'rgba(255,255,255,0.30)';
      gc.fillRect(tx + 1, ry, tw - 2, 1);
      // ridge body
      gc.fillStyle = `rgba(${cr},${cg},${cb},0.85)`;
      gc.fillRect(tx + 1, ry + 1, tw - 2, pitch - 3);
      // bottom shadow
      gc.fillStyle = 'rgba(0,0,0,0.22)';
      gc.fillRect(tx + 1, ry + pitch - 2, tw - 2, 1);
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

  // ── input ──────────────────────────────────────────────────────────────────

  mousePressed() {
    if (this.disabled) return;
    if (this._containsPoint(mouseX, mouseY)) {
      this._active       = true;
      this._dragY        = mouseY;
      this._stateAtDrag  = this.state;
      this._angleAtDrag  = this._gearAngle;
      this._drumOffset   = 0;
      // Record whether the press landed in the teeth column and which half
      this._teethPress   = this._inTeeth(mouseX, mouseY);
      this._teethPressBot = mouseY >= this.y + this.height / 2;
    }
  }

  mouseReleased() {
    if (this._active) {
      if (this._dragY !== null) {
        const pxPerStep = this._pxPerStep();
        const n         = this.options.length;
        const dy        = this._dragY - mouseY;

        let newState;
        // Short click on the teeth column: step one position and animate
        if (this._teethPress && Math.abs(dy) < pxPerStep * 0.3) {
          const dir = this._teethPressBot ? -1 : 1;  // bottom=down, top=up
          newState = (this.state + dir + n) % n;
          // Start the drum offset at the adjacent position so it eases to centre
          this._drumOffset = dir * this._spacing();
          // Rotate the teeth ridges by one tooth
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
      this._active      = false;
      this._dragY       = null;
      this._teethPress  = false;
      if (this.onRelease) this.onRelease(this.state, this.options[this.state]);
    }
  }

  mouseMoved() {
    if (this.disabled) return;
    this._hovered = this._containsPoint(mouseX, mouseY);
    if (!this._active || this._dragY === null) return;

    const dy        = this._dragY - mouseY;  // reversed: down = lower index
    const pxPerStep = this._pxPerStep();
    const teeth     = 14;
    const n         = this.options.length;

    // Integer steps crossed (trunc keeps direction symmetric)
    const steps      = Math.trunc(dy / pxPerStep);
    // Sub-step offset drives the drum scroll animation
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
    const dir   = e.delta > 0 ? -1 : 1;
    const n     = this.options.length;
    const teeth = 14;
    this.state       = (this.state + dir + n) % n;
    this._gearAngle += dir * ((Math.PI * 2) / teeth);
    if (this.onChange) this.onChange(this.state, this.options[this.state]);
  }
}

window.VUMeter        = VUMeter;
window.XYPad          = XYPad;
window.VUDial         = VUDial;
window.LEDMeter       = LEDMeter;
window.RotarySelector = RotarySelector;
