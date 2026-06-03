let pad1;
let osc1, osc2;
let started=false;

let myPanel;

let mySlider;
let heatmap;
let myModal;

function setupPanel(p) {
  p.add(new XYPad({x:10,y:10,springBack:true,springDuration:30,min:-40,max:40}));
  p.started=false;
  p.osc1 = new p5.Oscillator("square");
  p.osc1.amp(1); 
  p.osc2 = new p5.Oscillator("square");
  p.osc2.amp(1); 
  p.startFreqSlider=new AnalogSlider({x:180,y:10,height:150,min:100,max:500,value:100});
  p.add(p.startFreqSlider);
  p.onChange =panelChanged;
}

function setup() {
  createCanvas(1000, 600);
  openStatusPanel();
  openConsolePanel();

  myPanel = new Panel();
  setupPanel(myPanel);

  let newPanel = new Panel();
  setupPanel(newPanel);
  newPanel.position(10,300);

  mySlider=new AnalogSlider();

  // HeatMapView test — sector size by value, color by % change
  const portfolio = [
    {sector:'Technology', stock:'AAPL', value:3000, change:  5},
    {sector:'Technology', stock:'MSFT', value:2800, change: -2},
    {sector:'Technology', stock:'NVDA', value:1500, change: 18},
    {sector:'Energy',     stock:'XOM',  value: 450, change: -9},
    {sector:'Energy',     stock:'CVX',  value: 300, change:-14},
    {sector:'Energy',     stock:'COP',  value: 150, change: -6},
    {sector:'Healthcare', stock:'JNJ',  value: 500, change:  2},
    {sector:'Healthcare', stock:'PFE',  value: 350, change: -7},
    {sector:'Finance',    stock:'JPM',  value: 600, change:  5},
    {sector:'Finance',    stock:'GS',   value: 280, change:  8},
  ];

  heatmap = new HeatMapView({
    x: 450, y: 10,
    width: 500, height: 360,
    fields: ['sector', 'stock'],
    areaMetric:  'value',
    colorMetric: 'change',
    colorRange:  ['red', 'gray', 'green'],
    items: portfolio,
    label: 'Portfolio by Sector',
    onSelect: (d) => {
      console.log('Selected:', d.path.join(' > '), 'Value:', d.value, 'Items:', d.items.length);
    }
  });

  // ModalPanel test
  myModal = new ModalPanel({ label: 'Settings', width: 340 });
  myModal.add(new AnalogSlider({ name: 'volume', label: 'Volume', value: 75, min: 0, max: 100 }));
  myModal.add(new Switch({ name: 'muted', label: 'Muted', state: 0 }));

  // PianoPad test
  let piano = new PianoPad({
    x: 20, y: 400,
    width: 600, height: 140,
    firstNote: 'C3',
    noteCount: 20,
    highlightedNotes: ['C3', 'E3', 'G3'],
    label: 'Piano Keyboard (C major chord highlighted)',
    onChange: (d) => {
      console.log('Piano onChange:', d.note, 'MIDI:', d.midi, 'state:', d.state);
    },
    onRelease: (d) => {
      console.log('Piano onRelease:', d.note, 'MIDI:', d.midi, 'state:', d.state);
    }
  });

}

function panelChanged(value,o) {

  //print(o.startFreq.value);
  let f1=o.values.XYPad1.x+o.startFreqSlider.value;
  let f2=o.values.XYPad1.y+o.startFreqSlider.value;

  o.osc1.freq(f1);
  o.osc2.freq(f2);

  if (!o.started) {
    o.osc1.start();
    o.osc2.start();
    o.started=true;
  }
}


async function mousePressed() {
  if (myModal.isOpen) return;
  const result = await myModal.show();
  if (result !== null) {
    console.log('Modal saved:', result);
  } else {
    console.log('Modal cancelled');
  }
}

function draw() {
  background(220);
  //print(mySlider.value);
}