var canvas = document.querySelector('canvas'),
gl = canvas.getContext('webgl2');

var frameID = void 0;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createVertexShader(gl, source) {
  return createShader(gl, gl.VERTEX_SHADER, source);
}

function createFragmentShader(gl, source) {
  return createShader(gl, gl.FRAGMENT_SHADER, source);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

function createProgramFromSource(gl, vertexShaderSource, fragmentShaderSource) {
  return createProgram(
  gl,
  createVertexShader(gl, vertexShaderSource),
  createFragmentShader(gl, fragmentShaderSource));

}

function createBuffer(gl, data) {var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : gl.ARRAY_BUFFER;var usage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : gl.STATIC_DRAW;
  var buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, usage);
  return buffer;
}

function getProgramAttributes(gl, program) {
  var count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  var attributes = new Map();
  for (var index = 0; index < count; index++) {var _gl$getActiveAttrib =
    gl.getActiveAttrib(program, index),name = _gl$getActiveAttrib.name,size = _gl$getActiveAttrib.size,type = _gl$getActiveAttrib.type;
    var location = gl.getAttribLocation(program, name);
    attributes.set(name, { index: index, name: name, size: size, type: type, location: location });
  }
  return attributes;
}

function getProgramUniforms(gl, program) {
  var count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  var uniforms = new Map();
  for (var index = 0; index < count; index++) {var _gl$getActiveUniform =
    gl.getActiveUniform(program, index),name = _gl$getActiveUniform.name,size = _gl$getActiveUniform.size,type = _gl$getActiveUniform.type;
    var location = gl.getUniformLocation(program, name);
    uniforms.set(name, { index: index, name: name, size: size, type: type, location: location });
  }
  return uniforms;
}

function getProgramLocations(gl, program) {
  return {
    uniforms: getProgramUniforms(gl, program),
    attributes: getProgramAttributes(gl, program) };

}

function createLineGrid(width, height) {
  var halfWidth = width * 0.5,
  halfHeight = height * 0.5;
  var lines = [];
  for (var y = -halfHeight; y < halfHeight; ++y) {
    var vertices = [];
    for (var x = -halfWidth; x < halfWidth; ++x) {
      vertices.push(x, 0, y);
    }
    lines.push(vertices);
  }
  return lines;
}

function createGrid(width, height) {
  var halfWidth = width * 0.5,
  halfHeight = height * 0.5;
  var vertices = [];
  for (var y = -halfHeight; y < halfHeight; ++y) {
    for (var x = -halfWidth; x < halfWidth; ++x) {
      vertices.push(x, 0, y);
    }
  }
  return vertices;
}

var program = createProgramFromSource(
gl, '\nprecision highp float;\n\nattribute vec3 a_position;\nvarying vec3 v_position;\nuniform mat4 u_modelViewProjection;\nuniform float u_time;\nuniform float u_stretch;\n\nfloat rand(float n) {\n  return fract(sin(n) * 43758.5453123);\n}\n\nfloat rand(vec2 n) { \n\treturn fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);\n}\n\nfloat noise(float p) {\n\tfloat fl = floor(p);\n  float fc = fract(p);\n\treturn mix(\n    rand(fl), \n    rand(fl + 1.0), \n    fc\n  );\n}\n\t\nfloat noise(vec2 n) {\n\tconst vec2 d = vec2(0.0, 1.0);\n  vec2 b = floor(n)\n     , f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n\treturn mix(\n    mix(\n      rand(b),\n      rand(b + d.yx), \n      f.x\n    ), \n    mix(\n      rand(b + d.xy), \n      rand(b + d.yy), \n      f.x\n    ), \n    f.y\n  );\n}\n\nvoid main(void) {\n  vec4 v_pos = vec4(\n    a_position.x * 0.25, \n    noise(\n      vec2(\n        a_position.x * 0.05,\n        a_position.z * 0.25 - floor(u_time * 0.25)\n      )\n    )\n    *\n    4.0 * abs(a_position.x * a_position.x) / 4096.0,\n    a_position.z,\n    1.0\n  );\n  gl_Position = u_modelViewProjection * v_pos;\n  v_position = v_pos.xyz;\n}\n', '\nprecision highp float;\n\nvarying vec3 v_position;\n\nvoid main() {\n  float channel = (v_position.z + 64.0) / 32.0;\n  gl_FragColor = vec4(channel * 0.4, channel * 0.3, channel, 1.0);\n}\n');












































































var locations = getProgramLocations(gl, program);
console.log(locations);

var lineGrid = createLineGrid(512, 128);
var buffers = lineGrid.map(function (line) {return createBuffer(gl, new Float32Array(line));});
//const buffer = createBuffer(gl, new Float32Array(createGrid(128, 128)))

var model = mat4.create(),
view = mat4.create(),
inverseView = mat4.create(),
modelView = mat4.create(),
viewProjection = mat4.create(),
modelViewProjection = mat4.create(),
perspective = mat4.create(),
orthogonal = mat4.create(),
translation = vec3.fromValues(0, -6, -64);

function frame(frameTime) {
  var nearPlane = 0.1,
  farPlane = 1000.0,
  aspectRatio = gl.canvas.width / gl.canvas.height;

  mat4.perspective(perspective, Math.PI * 0.25, aspectRatio, nearPlane, farPlane);
  mat4.ortho(orthogonal, gl.canvas.width, 0, gl.canvas.height, 0, nearPlane, farPlane);

  vec3.set(translation, 0, -3 - (1.0 + Math.sin(frameTime / 1000)) * 0.5 * 6, -64);

  mat4.identity(view);
  mat4.identity(model);
  mat4.translate(model, model, translation);

  mat4.multiply(modelView, model, view);
  mat4.multiply(modelViewProjection, perspective, modelView);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  gl.uniform1f(locations.uniforms.get('u_time').location, frameTime / 16.66);
  gl.uniformMatrix4fv(locations.uniforms.get('u_modelViewProjection').location, gl.FALSE, modelViewProjection);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {

    for (var _iterator = buffers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var buffer = _step.value;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(locations.attributes.get('a_position').location);
      gl.vertexAttribPointer(locations.attributes.get('a_position').location, 3, gl.FLOAT, gl.FALSE, 0, 0);

      gl.drawArrays(gl.LINE_STRIP, 0, 512);
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

  frameID = window.requestAnimationFrame(frame);
}

function resize() {
  gl.canvas.width = gl.canvas.clientWidth;
  gl.canvas.height = gl.canvas.clientHeight;
}

function start() {
  window.addEventListener('resize', resize);
  window.dispatchEvent(new Event('resize'));

  frameID = window.requestAnimationFrame(frame);
}

start();