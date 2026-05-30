function setup() {
  createCanvas(600, 600);

  // Debug: check what print is
  console.log('DEBUG: typeof print:', typeof print);
  console.log('DEBUG: typeof window.print:', typeof window.print);
  console.log('DEBUG: print.toString():', print.toString().substring(0, 100));

  openConsolePanel();
  let c=new AnalogSlider();
  let d=new Dial();
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