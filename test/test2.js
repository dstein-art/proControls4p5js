function setup() {
  createCanvas(600, 600);
  let c = new IconButton({states:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']});
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