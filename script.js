'use strict';

let gl,
  program,
  squareVertexBuffer,
  squareIndexBuffer,
  indices;

function getShader(id) {
  const script = document.getElementById(id);
  const shaderString = script.text.trim();

  let shader;
  if (script.type === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else if (script.type === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initProgram() {
  const vertexShader = getShader('vertex-shader');
  const fragmentShader = getShader('fragment-shader');

  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Couldnae initialize shaders');
  }

  gl.useProgram(program);
  program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
}

function initBuffers() {
  const vertices = [
    -0.5, 0.5, 0,
    -0.5, -0.5, 0,
    0.5, -0.5, 0,
    0.5, 0.5, 0
  ];

  indices = [ 0, 1, 2, 0, 2, 3];

  squareVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  squareIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexBuffer);
  gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(program.aVertexPosition);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareIndexBuffer);

  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//function updateClearColor(...color) {
//  gl.clearColor(...color);
//  gl.clear(gl.COLOR_BUFFER_BIT);
//  gl.viewport(0, 0, 0, 0);
//}
//
//function checkKey(event) {
//  switch(event.keyCode) {
//    case 49: { // green
//      updateClearColor(0.2, 0.8, 0.2, 1.0);
//      break;
//    }
//    case 50: { // blue
//      updateClearColor(0.2, 0.2, 0.8, 1.0);
//      break;
//    }
//    case 51: { // random
//      updateClearColor(Math.random(), Math.random(), Math.random(), 1.0);
//      break;
//    }
//    case 52: { // get color
//      const color = gl.getParameter(gl.COLOR_CLEAR_VALUE);
//      console.log('clearColor is ', color[0].toFixed(1),  color[1].toFixed(1),  color[2].toFixed(1));
//      break;
//    }
//  }
//}

function init() {
  const canvas = document.getElementById('webgl-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (!canvas) {
    console.error('WOOF, nae canvas found');
    return;
  }

  gl = canvas.getContext('webgl2');
  gl.clearColor(0, 0, 0, 1);

  initProgram();
  initBuffers();
  draw();
  //console.log(message);
  //window.onkeydown = checkKey;
}

window.onload = init;
