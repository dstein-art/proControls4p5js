let samples=["https://ihearyoucancode.com/assets/superdirt/000_BD.wav",
  "https://ihearyoucancode.com/assets/superdirt/001_CB.wav",
  "https://ihearyoucancode.com/assets/superdirt/002_FX.wav",
  "https://ihearyoucancode.com/assets/superdirt/003_HH.wav",
  "https://ihearyoucancode.com/assets/superdirt/004_OH.wav",
  "https://ihearyoucancode.com/assets/superdirt/005_P1.wav",
  "https://ihearyoucancode.com/assets/superdirt/006_P2.wav",
  "https://ihearyoucancode.com/assets/superdirt/007_SN.wav"];


let drums=[];
function preload() {
  for (let i = 0; i < samples.length; i++) {
    drums.push(loadSound(samples[i]));
  }
}

function setup() {
  print("Started");
  createCanvas(300, 300);
  new GridPad({label:"Click To Play",rows:2, cols:4,mode:"button",
              onRelease: gridChanged});
}

function gridChanged(data1,data2,data3) {
  print(data1,data2,data3.lastCell);
}

function draw() {
  background(30);
}
