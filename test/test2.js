let pad1;
let osc1, osc2;
let started=false;

let myPanel;

let mySlider;
let heatmap;

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
  openConsolePanel();

  myPanel = new Panel();
  setupPanel(myPanel);

  let newPanel = new Panel();
  setupPanel(newPanel);
  newPanel.position(10,300);

  mySlider=new AnalogSlider();

  // HeatMapView test
  const sampleData = [
    {product:'cars', brand:'ford', trim:'Taurus', quantity:1423},
    {product:'cars', brand:'ford', trim:'F-150', quantity:3200},
    {product:'cars', brand:'ford', trim:'Mustang', quantity:2850},
    {product:'cars', brand:'honda', trim:'Civic', quantity:2100},
    {product:'cars', brand:'honda', trim:'Accord', quantity:1950},
    {product:'cars', brand:'toyota', trim:'Camry', quantity:3400},
    {product:'cars', brand:'toyota', trim:'Corolla', quantity:2650},
    {product:'trucks', brand:'chevy', trim:'Silverado', quantity:1800},
    {product:'trucks', brand:'chevy', trim:'Colorado', quantity:950},
    {product:'trucks', brand:'ford', trim:'F-250', quantity:2100},
    {product:'trucks', brand:'ram', trim:'1500', quantity:2750},
  ];

  heatmap = new HeatMapView({
    x: 450, y: 10,
    width: 500, height: 360,
    fields: ['product', 'brand', 'trim'],
    valueField: 'quantity',
    items: sampleData,
    label: 'Sales by Product/Brand/Trim',
    onSelect: (d) => {
      console.log('Selected:', d.path.join(' > '), 'Value:', d.value, 'Items:', d.items.length);
    }
  });

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


function draw() {
  background(220);
  //print(mySlider.value);
}