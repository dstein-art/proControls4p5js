let myData  = {};
let myPData = {};

function setup() {
  createCanvas(600, 600);
  openConsolePanel();

  let myPanel = new Panel({label:"myPanel"});
  myPanel.add(new AnalogSlider({name:"dave1"}));
  myPanel.add(new AnalogSlider({name:"dave2"}));
  myPanel.add(new Selector({options:["Guitar","Bass","Keyboards"]}));
  myPanel.bind(myPData);

  let slider = new MultiDial();
  slider.bind(myData);
  slider.onChange = (v) => { print("MultiDial changed:", v); };
}

function draw() {
  background(220);
  fill(0);
  noStroke();
  textSize(14);
  text("myPData: " + JSON.stringify(myPData), 10, 400);
  text("myData:  " + JSON.stringify(myData),  10, 420);
}
