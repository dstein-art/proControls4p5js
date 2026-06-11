let myData  = {};
let myPData = {dave1: 0.9631578947368421, dave2: 0.5657894736842106, Selector1: 0};



let myMenu;
let myGrid;
let hlRow = 0, hlCol = 0;

function setup() {
  createCanvas(700, 600);
  openConsolePanel();
  openStatusPanel();

  let tgData= [];
  for (let i = 0; i < 100; i++) {
    tgData.push({data: Math.sin(i * 0.1)});
  }

  let tg = new TimeGraphPanel({axisLabels:true});
  for (let i = 0; i < 100; i++) {
    tg.push(Math.sin(i*2*PI/100));
  }

}


function draw() {
  background(220);
}
