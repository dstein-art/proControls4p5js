// Maps directory to available sample files - only verified existing directories
const SAMPLE_FILES = {
  // Specific naming patterns
  bd: ["BT0A0A7.wav", "BT0A0D0.wav", "BT0A0D3.wav"],
  sn: ["ST0T0S0.wav", "ST0T0S3.wav", "ST0T0S7.wav"],
  hh: ["002_hh3hit1.wav", "003_hh3hit2.wav", "004_hh3hit3.wav"],
  hh27: ["000_hh27closedhh.wav", "001_hh27openhh.wav"],
  realclaps: ["1.wav", "2.wav", "3.wav"],
  perc: ["000_perc0.wav", "001_perc1.wav", "002_perc2.wav"],
  drum: ["000_drum1.wav", "001_drum2.wav", "002_drum3.wav"],
  linnhats: ["1.wav", "2.wav", "3.wav"],

  // Numbered files
  "808bd": ["1.wav", "2.wav", "3.wav"],
  clubkick: ["1.wav", "2.wav", "3.wav"],
  hardkick: ["1.wav", "2.wav", "3.wav"],
  popkick: ["1.wav", "2.wav", "3.wav"],
  reverbkick: ["1.wav", "2.wav", "3.wav"],
  kicklinn: ["1.wav", "2.wav", "3.wav"],
  tink: ["1.wav", "2.wav", "3.wav"],
  tok: ["1.wav", "2.wav", "3.wav"],
  coins: ["1.wav", "2.wav", "3.wav"],
  drumtraks: ["1.wav", "2.wav", "3.wav"],
  ifdrums: ["1.wav", "2.wav", "3.wav"],
  stomp: ["1.wav", "2.wav", "3.wav"],

  // Bass variations
  bass: ["000_bass1.wav", "001_bass2.wav"],
  bass0: ["1.wav", "2.wav", "3.wav"],
  bass1: ["1.wav", "2.wav", "3.wav"],
  bass2: ["1.wav", "2.wav", "3.wav"],
  bass3: ["1.wav", "2.wav", "3.wav"],
  bassdm: ["1.wav", "2.wav", "3.wav"],
  bassfoo: ["1.wav", "2.wav", "3.wav"],
  jungbass: ["1.wav", "2.wav", "3.wav"],
  jvbass: ["1.wav", "2.wav", "3.wav"],

  // Synths & Textures
  metal: ["000_0.wav", "001_1.wav"],
  glitch: ["000_BD.wav", "001_CB.wav"],
  glitch2: ["1.wav", "2.wav", "3.wav"],
  noise: ["000_noise.wav"],
  noise2: ["1.wav", "2.wav", "3.wav"],
  wind: ["000_wind1.wav", "001_wind10.wav"],

  // Percussion
  click: ["000_click0.wav", "001_click1.wav"],
  flick: ["000_square-p.wav", "001_1.wav"]
};

// Verified drum samples - only directories that actually exist with files
const AVAILABLE_SAMPLES = [
  // Kick drums
  { name: "Kick (bd)", dir: "bd" },
  { name: "Kick (808bd)", dir: "808bd" },
  { name: "Kick (clubkick)", dir: "clubkick" },
  { name: "Kick (hardkick)", dir: "hardkick" },
  { name: "Kick (popkick)", dir: "popkick" },
  { name: "Kick (reverbkick)", dir: "reverbkick" },
  { name: "Kick (kicklinn)", dir: "kicklinn" },

  // Snare drums
  { name: "Snare (sn)", dir: "sn" },
  { name: "Snare (realclaps)", dir: "realclaps" },

  // Hi-hats
  { name: "Hi-Hat (hh)", dir: "hh" },
  { name: "Hi-Hat (hh27)", dir: "hh27" },
  { name: "Hi-Hat (linnhats)", dir: "linnhats" },

  // Percussion
  { name: "Perc (perc)", dir: "perc" },
  { name: "Perc (click)", dir: "click" },
  { name: "Perc (tink)", dir: "tink" },
  { name: "Perc (tok)", dir: "tok" },
  { name: "Perc (coins)", dir: "coins" },
  { name: "Perc (flick)", dir: "flick" },

  // Drums
  { name: "Drum (drum)", dir: "drum" },
  { name: "Drum (drumtraks)", dir: "drumtraks" },
  { name: "Drum (ifdrums)", dir: "ifdrums" },
  { name: "Drum (stomp)", dir: "stomp" },

  // Bass
  { name: "Bass (bass)", dir: "bass" },
  { name: "Bass (bass0)", dir: "bass0" },
  { name: "Bass (bass1)", dir: "bass1" },
  { name: "Bass (bass2)", dir: "bass2" },
  { name: "Bass (bass3)", dir: "bass3" },
  { name: "Bass (bassdm)", dir: "bassdm" },
  { name: "Bass (bassfoo)", dir: "bassfoo" },
  { name: "Bass (jungbass)", dir: "jungbass" },
  { name: "Bass (jvbass)", dir: "jvbass" },

  // Synths & Textures
  { name: "Metal (metal)", dir: "metal" },
  { name: "Glitch (glitch)", dir: "glitch" },
  { name: "Glitch (glitch2)", dir: "glitch2" },
  { name: "Noise (noise)", dir: "noise" },
  { name: "Noise (noise2)", dir: "noise2" },
  { name: "Wind (wind)", dir: "wind" }
];

const DIRT_SAMPLES_URL = "https://cdn.jsdelivr.net/gh/tidalcycles/Dirt-Samples@master";
const STEP_COUNT = 16;
const DRUM_KEYS = ["bd", "sn", "hh", "clap", "perc", "drum"];
const DRUM_COUNT = DRUM_KEYS.length;

let sequencer = {};
let sounds = {};
let loadedSounds = 0;
let isPlaying = false;
let currentStep = 0;
let tempo = 120;
let swing = 0;
let volume = 0.6;

// UI components
let gridPad;
let tempoSlider;
let volumeSlider;
let swingSlider;
let statusPanel;
let playBtn;
let stopBtn;
let clearBtn;
let selectors = {};
let currentSamples = {}; // Track which sample is selected for each drum

// Default selections
const DEFAULT_SAMPLES = {
  bd: "bd",
  sn: "sn",
  hh: "hh",
  clap: "realclaps",
  perc: "perc",
  drum: "drum"
};

function preload() {
  // Initialize current samples to defaults
  for (let drum of DRUM_KEYS) {
    currentSamples[drum] = DEFAULT_SAMPLES[drum];
  }
  loadDrumSounds();
}

function loadDrumSounds() {
  for (let drum of DRUM_KEYS) {
    const dir = currentSamples[drum];
    sounds[drum] = [];

    const files = SAMPLE_FILES[dir];
    if (!files || files.length === 0) {
      console.warn(`No files mapped for ${dir}, skipping`);
      continue;
    }

    for (let file of files) {
      const url = `${DIRT_SAMPLES_URL}/${dir}/${file}`;
      try {
        const sound = loadSound(url,
          () => {
            loadedSounds++;
            console.log(`Loaded: ${dir}/${file}`);
          },
          (err) => {
            console.warn(`Failed to load ${dir}/${file}, trying next...`);
          }
        );
        sounds[drum].push(sound);
      } catch(e) {
        console.warn(`Error loading ${dir}/${file}`);
      }
    }
  }
}

function setup() {
  ControlStyle = 'red';
  createCanvas(1700, 700);

  // Initialize sequencer object for each drum
  for (let drum of DRUM_KEYS) {
    sequencer[drum] = Array(STEP_COUNT).fill(0);
  }

  // Initialize sequencer values
  const initialValues = DRUM_KEYS.map(() => Array(STEP_COUNT).fill(0));

  // Create GridPad first (so we can use its properties for alignment)
  gridPad = new GridPad({
    x: 200,
    y: 20,
    rows: DRUM_COUNT,
    cols: STEP_COUNT,
    cellSize: 30,
    cellGap: 4,
    mode: 'toggle',
    label: 'Drum Sequencer',
    values: initialValues,
  });
  gridPad.onChange = handleGridChange;

  // Now create selectors for sample selection (aligned with gridPad rows)
  const options = AVAILABLE_SAMPLES.map(s => s.name);

  for (let i = 0; i < DRUM_COUNT; i++) {
    const drum = DRUM_KEYS[i];
    const defaultIndex = AVAILABLE_SAMPLES.findIndex(s => s.dir === DEFAULT_SAMPLES[drum]);

    // Calculate Y position to align with gridPad rows
    const rowY = gridPad.y + 6 + i * (gridPad.cellSize + gridPad.cellGap);

    selectors[drum] = new Selector({
      x: 20,
      y: rowY,
      label: drum.toUpperCase(),
      options: options,
      state: defaultIndex >= 0 ? defaultIndex : 0,
      style: 'arrow',
      width: 140,
      height: 40,
    });

    // Set up onChange handler for this selector
    selectors[drum].onChange = () => {
      const newIndex = selectors[drum].state;
      console.log(`Selector ${drum} changed to index ${newIndex}`);
      if (newIndex >= 0 && newIndex < AVAILABLE_SAMPLES.length) {
        const newDir = AVAILABLE_SAMPLES[newIndex].dir;
        currentSamples[drum] = newDir;
        console.log(`${drum}: ${DEFAULT_SAMPLES[drum]} -> ${newDir}`);
        reloadDrumSamples(drum);
      } else {
        console.warn(`Invalid index ${newIndex} for drum ${drum}`);
      }
    };
  }

  // Create tempo slider
  tempoSlider = new AnalogSlider({
    x: 1050,
    y: 50,
    label: 'Tempo',
    min: 40,
    max: 240,
    value: tempo,
    decimals: 0,
    width: 50,
    height: 150,
  });
  tempoSlider.onChange = (v) => {
    tempo = v;
  };

  // Create volume slider
  volumeSlider = new AnalogSlider({
    x: 1120,
    y: 50,
    label: 'Volume',
    min: 0,
    max: 1,
    value: volume,
    decimals: 2,
    width: 50,
    height: 150,
  });
  volumeSlider.onChange = (v) => {
    volume = v;
    setMasterVolume(v);
  };

  // Create swing slider
  swingSlider = new AnalogSlider({
    x: 1190,
    y: 50,
    label: 'Swing',
    min: 0,
    max: 50,
    value: swing,
    decimals: 0,
    width: 50,
    height: 150,
  });
  swingSlider.onChange = (v) => {
    swing = v;
  };

  // Create icon buttons
  playBtn = new IconButton({
    x: 1050,
    y: 230,
    icon: 'play_arrow',
    label: 'Play',
    size: 44,
    onClick: () => {
      if (!isPlaying) startSequencer();
    }
  });

  stopBtn = new IconButton({
    x: 1050,
    y: 290,
    icon: 'stop',
    label: 'Stop',
    size: 44,
    onClick: () => {
      if (isPlaying) stopSequencer();
    }
  });

  clearBtn = new IconButton({
    x: 1050,
    y: 350,
    icon: 'delete_outline',
    label: 'Clear',
    size: 44,
    onClick: () => {
      clearPattern();
    }
  });

  // Status panel
  openStatusPanel();
  updateStatus(`Ready • ${Math.round(tempo)} BPM • Loading...`);
  console.log('RoastBeats initialized');
}

function draw() {
  const theme = ProControlThemes[ControlStyle];
  background(color(theme.bg));

  // Draw selectors for each drum
  for (let drum of DRUM_KEYS) {
    selectors[drum].draw();
  }

  // Draw grid pad
  gridPad.draw();

  // Draw controls
  tempoSlider.draw();
  volumeSlider.draw();
  swingSlider.draw();

  // Draw icon buttons
  playBtn.draw();
  stopBtn.draw();
  clearBtn.draw();

  // Update status bar
  let statusMsg;
  if (loadedSounds < DRUM_COUNT * 3) {
    statusMsg = `Loading... ${loadedSounds}/${DRUM_COUNT * 3} samples`;
  } else if (isPlaying) {
    statusMsg = `▶ Playing • ${Math.round(tempo)} BPM`;
  } else {
    statusMsg = `Ready • ${Math.round(tempo)} BPM`;
  }
  updateStatus(statusMsg);

  // Highlight current step during playback
  if (isPlaying) {
    highlightCurrentStep();
  }
}

function handleGridChange() {
  const values = gridPad.values;
  for (let r = 0; r < DRUM_COUNT; r++) {
    const drumKey = DRUM_KEYS[r];
    sequencer[drumKey] = values[r].map(v => v > 0 ? 1 : 0);
  }
}

function highlightCurrentStep() {
  const cellSize = gridPad.cellSize;
  const cellGap = gridPad.cellGap;
  const colX = gridPad.x + 6 + currentStep * (cellSize + cellGap);

  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  for (let r = 0; r < DRUM_COUNT; r++) {
    const rowY = gridPad.y + 6 + r * (cellSize + cellGap);
    rect(colX, rowY, cellSize, cellSize, 2);
  }
}

function setMasterVolume(vol) {
  for (let drum of DRUM_KEYS) {
    for (let i = 0; i < sounds[drum].length; i++) {
      if (sounds[drum][i] && sounds[drum][i].isLoaded && sounds[drum][i].isLoaded()) {
        sounds[drum][i].setVolume(vol);
      }
    }
  }
}

function reloadDrumSamples(drum) {
  console.log(`Changing ${drum} to new samples...`);

  // Stop any playing sounds from this drum
  if (sounds[drum]) {
    for (let i = 0; i < sounds[drum].length; i++) {
      if (sounds[drum][i] && sounds[drum][i].isPlaying && sounds[drum][i].isPlaying()) {
        sounds[drum][i].stop();
      }
    }
  }

  // Load new samples
  const dir = currentSamples[drum];
  sounds[drum] = [];

  const files = SAMPLE_FILES[dir];
  if (!files || files.length === 0) {
    console.warn(`No files mapped for ${dir}`);
    updateStatus(`No samples for ${dir} • ${Math.round(tempo)} BPM`);
    return;
  }

  let loadCount = 0;

  for (let file of files) {
    const url = `${DIRT_SAMPLES_URL}/${dir}/${file}`;
    try {
      const sound = loadSound(url,
        () => {
          loadCount++;
          console.log(`Reloaded: ${dir}/${file}`);
          if (loadCount === 1) {
            updateStatus(`Changed to ${dir} • ${Math.round(tempo)} BPM`);
          }
        },
        (err) => {
          console.warn(`Failed to load ${dir}/${file}`);
        }
      );
      sounds[drum].push(sound);
    } catch(e) {
      console.warn(`Error loading ${dir}/${file}`);
    }
  }
}

function startSequencer() {
  if (loadedSounds < DRUM_COUNT * 3) {
    console.warn('Sounds still loading');
    updateStatus('Sounds still loading...');
    return;
  }
  isPlaying = true;
  currentStep = 0;
  updateStatus(`▶ Playing • ${Math.round(tempo)} BPM`);
  sequencerLoop();
}

function stopSequencer() {
  isPlaying = false;
  currentStep = 0;
  updateStatus(`■ Stopped • ${Math.round(tempo)} BPM`);

  for (let drum of DRUM_KEYS) {
    for (let i = 0; i < sounds[drum].length; i++) {
      if (sounds[drum][i] && sounds[drum][i].isPlaying && sounds[drum][i].isPlaying()) {
        sounds[drum][i].stop();
      }
    }
  }
}

function sequencerLoop() {
  if (!isPlaying) return;

  const beatTime = (60 / tempo / 4) * 1000;
  let delayMs = beatTime;

  if (currentStep % 2 === 1) {
    delayMs += (swing / 100) * beatTime * 0.5;
  }

  // Trigger sounds for current step
  for (let drum of DRUM_KEYS) {
    if (sequencer[drum] && sequencer[drum][currentStep]) {
      playDrumSound(drum);
    }
  }

  currentStep = (currentStep + 1) % STEP_COUNT;
  setTimeout(() => sequencerLoop(), delayMs);
}

function playDrumSound(drum) {
  if (!sounds[drum] || sounds[drum].length === 0) return;

  // Always use the first variation for consistency across the row
  const sound = sounds[drum][0];

  if (sound && sound.isLoaded && sound.isLoaded()) {
    console.log(`Playing: ${drum} (${currentSamples[drum]})`);
    sound.rate(1);
    sound.setVolume(volume);
    sound.play();
  } else {
    console.warn(`Sound not ready: ${drum}`);
  }
}

function clearPattern() {
  if (isPlaying) stopSequencer();

  for (let drum of DRUM_KEYS) {
    sequencer[drum] = new Array(STEP_COUNT).fill(0);
  }

  for (let r = 0; r < DRUM_COUNT; r++) {
    for (let c = 0; c < STEP_COUNT; c++) {
      gridPad.setValue(r, c, 0);
    }
  }

  updateStatus(`Pattern cleared • ${Math.round(tempo)} BPM`);
}

function updateStatus(message) {
  if (statusPanel) {
    statusPanel.text = message;
  }
}
