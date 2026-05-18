let control;

function setup() {
  createCanvas(600, 600);
  //pad = new XYPad({x:10,y:50,springBack:true,springDuration:10,minX:0.5,maxX:1.5,minY:0.5,maxY:1.5});  
  //pad = new Selector({x:10,y:50,options:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']});
  //control = new AnalogSlider({x:10,y:50,width:200,min:0,max:1,value:0.5});
  //control.label = 'TEST';
  //control.onChange = message;
  //control.onRelease = mousePressedX;

  const ms = new MultiSlider();
  ms.onRelease = (value) => {
    print('multi slider released',value);
  }


  const doc = new Markup({
    x: 220, y: 15,
    width: 240, height: 200,
    fontSize: 11,
    text: `= ProControls =
  A hardware-inspired UI library for [[https://p5js.org|p5.js]].
  
  == Features ==
  * '''Real-time''' audio controls
  * '''8 built-in''' themes
  ** black, stainless, white, brushed
  ** red, blue, yellow, dimpled
  
  == Usage ==
  # Add the script tag
  # Call ''new AnalogSlider()''
  # Wire up '''onChange'''
  
  == Testing ==
  * Link: [[https://www.google.com|Google Search]]
  
  ----
  : '''''Scroll for more'''''
  This panel supports '''bold''', ''italic'', and '''''bold italic''''' text inline with normal paragraphs. Long lines wrap automatically within the panel width.`
  });

  doc.onMouseOver = (url) => {
    print('mouse over',url);
  }

  doc.onMouseOut = (url) => {
    print('mouse out',url);
  }
  const multiDial = new MultiDial({x:10,y:10,width:20,height:100,dials:{"One Bass":0.5,"Two Mid":0.5,"Three Treble":0.5}});
  const multiSlider = new MultiSlider({x:10,y:110,width:20,height:100,sliders:{"One":0.5,"Two":0.5,"Three":0.5}});
  const myPanel = new Panel({
    x: 20, y: 300,
    label: 'My Panel',
    width: 240, height: 240,
    fontSize: 11,
    resizable: true,
    text: `= My Panel =
  This is my panel.`,
  });

  const myXYPad = new XYPad({x:110,y:110,width:50,height:100,valueX:0.5,valueY:0.5});

  myPanel.add(multiDial);
  myPanel.add(multiSlider);
  myPanel.add(myXYPad);
  myPanel.onRelease = (value) => {
    print('panel changed',myPanel.values);
  }

 // const consolePanel = new ConsolePanel({x:220,y:300,width:240,height:200});
}

function message() {
  print('message',control.value);
  x=messy();
}

function mousePressedX() {
  // control.valueX = mouseX/width;
  // control.valueY = mouseY/height;
  print(control.value);
}

function draw() {
  background(220);
  print("Hello World");
}