var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};
var internals = {
  svg: {},
  controls: {},
  puppetScale: 1.25,
  commonDraggableArgs: {
    bounds: { top: -40, left: -40, width: 860, height: 480 },
    edgeResistance: 0.65,
    type: 'x, y' } };



internals.svg.main = document.getElementById('main-svg');
internals.svg.puppet = internals.svg.main.querySelector('.puppet');
internals.svg.pStick = internals.svg.puppet.querySelector('.puppet-stick');
internals.svg.pTorso = internals.svg.puppet.querySelector('.puppet-torso');
internals.svg.pRightHand = internals.svg.puppet.querySelector('.puppet-rh');
internals.svg.pLeftHand = internals.svg.puppet.querySelector('.puppet-lh');
internals.svg.moon = internals.svg.main.querySelector('.moon');
internals.svg.cat = internals.svg.main.querySelector('.cat');
internals.svg.tree = internals.svg.main.querySelector('.tree');
internals.svg.house = internals.svg.main.querySelector('.house');
internals.svg.background = internals.svg.main.querySelector('.background');
internals.svg.bat1 = internals.svg.main.querySelector('.bat1');
internals.svg.bat2 = internals.svg.main.querySelector('.bat2');
internals.svg.ground = internals.svg.main.querySelector('.ground');

internals.controls.main = document.querySelector('.controls');
internals.controlsFlip = internals.controls.main.querySelector('.controls-flip');
internals.controlsHands = internals.controls.main.querySelector('.controls-hands');
internals.controlsFillBg = internals.controls.main.querySelector('.controls-fill-bg');
internals.controlsPickerBg = internals.controls.main.querySelector('.controls-picker-bg');
internals.controlsFillFg = internals.controls.main.querySelector('.controls-fill-fg');
internals.controlsPickerFg = internals.controls.main.querySelector('.controls-picker-fg');

// ---

TweenMax.defaultEase = Power0.easeNone;
TweenLite.set(internals.svg.puppet, { transformOrigin: '105px 190px', scale: internals.puppetScale });
TweenLite.set(internals.svg.pStick, { transformOrigin: 'center bottom' });
TweenLite.set(internals.svg.pRightHand, { transformOrigin: '86px 40px' });
TweenLite.set(internals.svg.pLeftHand, { transformOrigin: '13px 20px' });
TweenLite.set(internals.svg.moon, { y: -40 });
TweenLite.set(internals.svg.ground, { x: -2 });

var M = Draggable.create(internals.svg.puppet, _extends({},
internals.commonDraggableArgs, {
  trigger: internals.svg.pTorso }));


var R = Draggable.create(internals.svg.puppet, {
  type: 'rotation',
  trigger: internals.svg.pStick });


Draggable.create(internals.svg.moon, internals.commonDraggableArgs);
Draggable.create(internals.svg.cat, internals.commonDraggableArgs);
Draggable.create(internals.svg.tree, internals.commonDraggableArgs);
Draggable.create(internals.svg.house, internals.commonDraggableArgs);
Draggable.create(internals.svg.bat1, internals.commonDraggableArgs);
Draggable.create(internals.svg.bat2, internals.commonDraggableArgs);
Draggable.create(internals.svg.pRightHand, { type: 'rotation' });
Draggable.create(internals.svg.pLeftHand, { type: 'rotation' });

Draggable.create(internals.controlsHands, {
  type: 'rotation',
  bounds: { minRotation: 0, maxRotation: 0 },
  onPress: function onPress() {return handsUp();},
  onRelease: function onRelease() {return handsDown();} });


// ---

var htl = new TimelineLite();
var flipped = internals.puppetScale;

function enableMove(ev) {
  R[0].disable();
  M[0].enable().startDrag(ev);
}

function enableDrag(ev) {
  M[0].disable();
  R[0].enable().startDrag(ev);
}

function handsUp() {
  htl = new TimelineLite();
  htl.to(internals.svg.pRightHand, .15, { rotation: 95 }, 0);
  htl.to(internals.svg.pLeftHand, .15, { rotation: -45 }, 0);
}

function flip() {
  flipped = flipped * -1;
  TweenMax.to(internals.svg.puppet, .2, { scaleX: flipped * -1 });
}

function handsDown() {
  htl.kill();
  htl.reverse();
}

function showPickerBg() {
  internals.controlsPickerBg.click();
}

function showPickerFg() {
  internals.controlsPickerFg.click();
}

function changeBgFill(ev) {
  internals.svg.background.style.fill = ev.currentTarget.value;
}

function changeFgFill(ev) {
  internals.svg.main.style.fill = ev.currentTarget.value;
}

internals.svg.pTorso.addEventListener('mousedown', enableMove);
internals.svg.pStick.addEventListener('mousedown', enableDrag);
internals.svg.pTorso.addEventListener('touchstart', enableMove);
internals.svg.pStick.addEventListener('touchstart', enableDrag);
internals.controlsFlip.addEventListener('click', flip);
internals.controlsFillBg.addEventListener('click', showPickerBg);
internals.controlsFillFg.addEventListener('click', showPickerFg);
internals.controlsPickerBg.addEventListener('change', changeBgFill);
internals.controlsPickerFg.addEventListener('change', changeFgFill);