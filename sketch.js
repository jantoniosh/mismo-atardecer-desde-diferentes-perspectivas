let theShader;

let ata = new Array(4);

let play;

const osc = new Tone.FatOscillator(440, "sine", 40).toDestination();
const filter = new Tone.Filter(1500, "highpass").toDestination();
filter.frequency.rampTo(20000, 10);
osc.connect(filter);
console.log(osc);

function preload() {
  // load the shader
  theShader = loadShader('effect.vert', 'effect.frag');
  for (let i = 0; i < ata.length; i++) {
    ata[i] = loadImage(`data/ata0${i}.jpg`);
  }
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(864, 864, WEBGL);
  noStroke();
  play = false;
}

function draw() {
  shader(theShader);

  let factor = map(sin(frameCount * 0.01), -1, 1, 0.1, 4);
  let freq = map(sin(frameCount * 0.01), -1, 1, 400, 100);

  osc.set({
    frequency: freq
  });

  for (let i = 0; i < ata.length; i++) {
    theShader.setUniform(`u_tex${i}`, ata[i]);
  }
  theShader.setUniform('u_resolution', [width, height]);
  theShader.setUniform('u_mouse', [mouseX, mouseY]);
  theShader.setUniform('u_time', frameCount * 0.01);
  theShader.setUniform('factor', factor);

  rect(0, 0, width, height);
}

function mouseClicked() {
  if (!play) {
    osc.start();
  }
  else {
    osc.stop();
  }
  play = !play;
}