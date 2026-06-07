// bind-example-1.js: Single control binding
// Simple example of binding a single slider to a data property

const audioConfig = { volume: 0.5 };

function setup() {
  createCanvas(600, 300);

  let volumeSlider = new AnalogSlider({
    x: 50,
    y: 50,
    label: 'Volume',
    min: 0,
    max: 1,
    value: audioConfig.volume
  });

  // Bind slider to audioConfig.volume
  // - Slider moves → audioConfig.volume updates
  // - audioConfig.volume changes → slider display updates
  volumeSlider.bind(audioConfig, 'volume');

  openStatusPanel();
}

function draw() {
  background(220);

  // audioConfig.volume is always in sync
  fill(0);
  textSize(16);
  text('Volume: ' + nf(audioConfig.volume, 1, 2), 50, 150);
  text('Try dragging the slider →', 50, 180);

  // Demonstrate data → control binding
  if (keyIsPressed && key === ' ') {
    audioConfig.volume = 0.9;
    openStatusPanel().text = 'Volume set to 0.9 from code!';
  }
}
