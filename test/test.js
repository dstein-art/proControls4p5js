let myData  = {};
let myPData = {};

function setup() {
  createCanvas(600, 600);
  openConsolePanel();

  let myPanel = new Panel({label:"myPanel",resizable:true});
  myPanel.add(new AnalogSlider({name:"dave1"}));
  myPanel.add(new AnalogSlider({name:"dave2"}));
  myPanel.add(new Selector({options:["Guitar","Bass","Keyboards"]}));
  myPanel.bind(myPData);

  let newPanel = new Panel({label:"newPanel",resizable:true});

  let slider = new MultiDial();
  slider.bind(myData);
  slider.onChange = (v) => { print("MultiDial changed:", v); };

  // RangeSlider styles
  new RangeSlider({label:"range knob", style:"knob", x:320, y:20});
  new RangeSlider({label:"range button", style:"button", x:380, y:20});
  new RangeSlider({label:"h knob",   style:"knob",   horizontal:true, x:320, y:220});
  new RangeSlider({label:"h button", style:"button", horizontal:true, x:320, y:280});
}

function draw() {
  background(220);
  fill(0);
  noStroke();
  textSize(14);
  text("myPData: " + JSON.stringify(myPData), 10, 400);
  text("myData:  " + JSON.stringify(myData),  10, 420);
}
