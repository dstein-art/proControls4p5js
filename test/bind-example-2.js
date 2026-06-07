// bind-example-2.js: Multi-control binding with Panel
// Example of binding multiple controls in a panel with auto field matching

const audioSettings = {
  masterVolume: 0.7,
  bassEQ: 0.4,
  trebleEQ: 0.6
};

let panel;

function setup() {
  createCanvas(600, 400);

  // Create panel with controls
  panel = new Panel({
    x: 50,
    y: 50,
    width: 300,
    height: 300
  });

  // Add sliders - name must match audioSettings properties
  let volumeSlider = new AnalogSlider({
    name: 'masterVolume',  // Matches audioSettings.masterVolume
    label: 'Master Volume',
    min: 0,
    max: 1,
    value: audioSettings.masterVolume
  });
  panel.add(volumeSlider);

  let bassSlider = new AnalogSlider({
    name: 'bassEQ',        // Matches audioSettings.bassEQ
    label: 'Bass EQ',
    min: 0,
    max: 1,
    value: audioSettings.bassEQ
  });
  panel.add(bassSlider);

  let trebleSlider = new AnalogSlider({
    name: 'trebleEQ',      // Matches audioSettings.trebleEQ
    label: 'Treble EQ',
    min: 0,
    max: 1,
    value: audioSettings.trebleEQ
  });
  panel.add(trebleSlider);

  // Bind entire panel - auto-matches all child controls to data properties
  panel.bind(audioSettings);

  openStatusPanel();
}

function draw() {
  background(220);

  // All audioSettings properties are in sync
  fill(0);
  textSize(14);
  text('Audio Settings:', 400, 100);
  text('Master: ' + nf(audioSettings.masterVolume, 1, 2), 400, 130);
  text('Bass: ' + nf(audioSettings.bassEQ, 1, 2), 400, 160);
  text('Treble: ' + nf(audioSettings.trebleEQ, 1, 2), 400, 190);

  // Demonstrate data → control binding
  if (keyIsPressed) {
    if (key === '1') {
      audioSettings.masterVolume = 0.9;
      audioSettings.bassEQ = 0.7;
      audioSettings.trebleEQ = 0.3;
      openStatusPanel().text = 'Loaded preset: Warm';
    }
    if (key === '2') {
      audioSettings.masterVolume = 0.8;
      audioSettings.bassEQ = 0.3;
      audioSettings.trebleEQ = 0.8;
      openStatusPanel().text = 'Loaded preset: Bright';
    }
  }

  text('Press 1 for Warm preset', 400, 250);
  text('Press 2 for Bright preset', 400, 270);
}
