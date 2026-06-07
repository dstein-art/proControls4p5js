let control;

function setup() {
  createCanvas(600, 600);
  openStatusPanel();
  openConsolePanel();
  let myPanel = new Panel({x:10,y:10,width:200,height:200});
  myPanel.add(new AnalogSlider({name:"dave1"}));
  myPanel.add(new AnalogSlider({name:"dave2"}));
  myPanel.add(new AnalogSlider({name:"dave3"}));
  myPanel.onChange=myHandler;
}

function myHandler(value) {
  print(value);
}

function draw() {
  background(220);
}