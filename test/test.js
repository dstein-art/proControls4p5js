let myData  = {};
let myPData = {dave1: 0.9631578947368421, dave2: 0.5657894736842106, Selector1: 0};

let myMenu;
let myGrid;
let hlRow = 0, hlCol = 0;

function setup() {
  createCanvas(700, 600);
  openConsolePanel();
  openStatusPanel();

  document.oncontextmenu = () => false;

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

  myMenu = new PopupMenu({
    x: 20, y: 20,
    items: [
      'File',
      ['Edit', 'Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
      'View',
      ['Help', 'About', 'Docs'],
    ],
    onChange: ({label, path}) => console.log(path),
  });
  myMenu.draw();

  // GridPad highlight demo
  myGrid = new GridPad({ x: 480, y: 20, rows: 5, cols: 5, cellSize: 26, label: 'GridPad highlights' });

  myGrid.highlightRow(hlRow, true);
  myGrid.highlightCol(hlCol, true);
  myGrid.highlightCell(2, 2, true);

  new AnalogSlider({
    label: 'hl row', x: 480, y: 200,
    min: 0, max: 4, step: 1, value: hlRow,
    onChange: (v) => {
      myGrid.highlightRow(hlRow, false);
      hlRow = Math.round(v);
      myGrid.highlightRow(hlRow, true);
    }
  });
  new AnalogSlider({
    label: 'hl col', x: 560, y: 200,
    min: 0, max: 4, step: 1, value: hlCol,
    onChange: (v) => {
      myGrid.highlightCol(hlCol, false);
      hlCol = Math.round(v);
      myGrid.highlightCol(hlCol, true);
    }
  });
}

function mousePressed() {
  myPData.dave1 = mouseX / width;
  myPData.dave2 = mouseY / height;
}

function draw() {
  background(220);
  if (mouseIsPressed && mouseButton === RIGHT) {
    myMenu.x=mouseX;
    myMenu.y=mouseY;
  }

  if (mouseX < 300) {
    myGrid.highlightRow(hlRow, false);
  } else if ( mouseX > 200) {
    myGrid.highlightCol(hlCol, true);
  }
  fill(0);
  noStroke();
  textSize(14);
  text("myPData: " + JSON.stringify(myPData), 10, 400);
  text("myData:  " + JSON.stringify(myData),  10, 420);
  print(myData);
  print(myPData);
}
