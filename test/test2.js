function setup() {
  createCanvas(600, 600);

  // Debug: check what print is
  console.log('DEBUG: typeof print:', typeof print);
  console.log('DEBUG: typeof window.print:', typeof window.print);
  console.log('DEBUG: print.toString():', print.toString().substring(0, 100));

  let myPanel=new Panel({x:10,y:10,width:200,height:250,resizable:true,label:'My Panel'});

  openConsolePanel();
  let c=new RangeSlider();
  let d=new Dial();
  let a=new AnalogSlider({x:120});

  myPanel.add(c);
  myPanel.add(d);

  let newPanel=myPanel.copy();

  console.log('My Panel children:');
  for (const c of myPanel._children) {
    console.log(c.constructor.name, c.label,c.x,c.y);
  } 

  console.log('New Panel children:');
  for (const c of newPanel._children) {
    console.log(c.constructor.name, c.label,c.x,c.y);
  } 



  d.onChange = (value) => {
    console.log('DEBUG: onChange called');
    print(value);
  }
  d.onRelease = (value) => {
    print('release', value);
  }
  c.onChange = (value) => {
    print(value);
  }
  c.onRelease = (value) => {
    print('release', value);
  }
}

function draw() {
  background(200);

}