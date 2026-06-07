// bind-example-3.js: GridPad binding with drum pattern
// Example of binding a GridPad to a data object with arrays

const drumPattern = {
  kick: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  snare: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};

let gridPad;
let playhead = 0;
let lastPlayTime = 0;

function setup() {
  createCanvas(800, 400);

  // Create GridPad with row names matching drum pattern
  gridPad = new GridPad({
    x: 50,
    y: 50,
    rows: 3,
    cols: 16,
    cellSize: 25,
    cellGap: 4,
    names: ['kick', 'snare', 'hihat'],  // Must match drumPattern keys
    mode: 'toggle',
    label: 'Drum Sequencer',
    values: [
      drumPattern.kick,
      drumPattern.snare,
      drumPattern.hihat
    ]
  });

  // Bind GridPad - auto-matches rows to data object properties
  gridPad.bind(drumPattern);

  openStatusPanel();
  openConsolePanel();
}

function draw() {
  background(220);

  // Drum pattern is always in sync with GridPad
  fill(0);
  textSize(14);
  text('Edit the pattern by clicking the grid', 50, 300);
  text('Grid changes update drumPattern automatically', 50, 330);

  // Display current pattern
  console.log('Pattern updated:', {
    kick: drumPattern.kick.join(' '),
    snare: drumPattern.snare.join(' '),
    hihat: drumPattern.hihat.join(' ')
  });

  // Simple playback visualization
  const now = millis();
  if (now - lastPlayTime > 200) {
    playhead = (playhead + 1) % 16;
    lastPlayTime = now;

    // Play sounds based on pattern
    if (drumPattern.kick[playhead]) console.log('Kick!');
    if (drumPattern.snare[playhead]) console.log('Snare!');
    if (drumPattern.hihat[playhead]) console.log('HiHat!');
  }

  // Draw playhead indicator
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  const cellSize = gridPad.cellSize;
  const cellGap = gridPad.cellGap;
  const x = gridPad.x + 6 + playhead * (cellSize + cellGap);
  for (let r = 0; r < 3; r++) {
    const y = gridPad.y + 6 + r * (cellSize + cellGap);
    rect(x, y, cellSize, cellSize, 2);
  }
}
