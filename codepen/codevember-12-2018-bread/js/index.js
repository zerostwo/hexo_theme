 /**
               * Noel Delgado | @pixelia_me
               *
               * Original work by Jonas Mosesson
               * https://www.behance.net/gallery/43627687/Moody-Foodies-Animated-Stickers
               */var _console =

console,log = _console.log;

log('🍞');

internals = {};

// -------

internals.toaster = document.getElementById('toaster');
internals.eyesA = document.getElementById('eyes-a');
internals.breadA = document.getElementById('bread-a');
internals.face = document.getElementById('face');
internals.eyesB = document.getElementById('eyes-b');
internals.breadB = document.getElementById('bread-b');
internals.foot = document.getElementById('foot-sm');
internals.footExt = document.getElementById('foot-ext');
internals.controlClipPath = document.querySelector('#clippath-control > path');
internals.controlLeft = document.getElementById('control-left');
internals.controlRight = document.getElementById('control-right');
internals.ease = CustomEase.create('custom', 'M0,0 C0.061,0 0.261,0.123 0.328,0.23 0.405,0.354 0.447,0.757 0.542,0.868 0.626,0.966 0.939,0.998 1,1');
internals.footExtended = '0 0 0 34 8 34';

// -------

TweenLite.defaultEase = Expo.easeInOut;
TweenMax.set(internals.toaster, { transformOrigin: 'center bottom', scaleX: 1 });
TweenMax.set(internals.breadA, { transformOrigin: 'center' });
TweenMax.set(internals.breadB, { transformOrigin: 'center' });
TweenMax.set(internals.eyesB, { transformOrigin: 'center' });
TweenMax.set(internals.foot, { transformOrigin: 'center bottom' });

// -------

internals.timeline = new TimelineMax({
  repeat: 1,
  yoyo: true,
  onComplete: function onComplete() {return internals.timeline2.restart();} });


internals.timeline2 = new TimelineMax({
  paused: true,
  repeat: 1,
  yoyo: true,
  onComplete: function onComplete() {return internals.timeline.restart();} });


internals.timeline.
to(internals.toaster, 0.5, { rotation: 3, y: -7, scaleY: 1.15, scaleX: .96, ease: Back.easeInOut.config(1) }).
to(internals.foot, 0.5, { morphSVG: internals.footExt }, 0).
to(internals.controlLeft, 0.5, { y: -68, ease: internals.ease }, 0).
to(internals.controlRight, 0.5, { y: -68, ease: internals.ease }, 0).
to(internals.breadA, 0.5, { y: 46, rotation: -12, ease: internals.ease }, 0).
to(internals.face, 0.5, { y: -14 }, 0).
to(internals.eyesA, 0, { autoAlpha: 0 }, 0.2).
to(internals.eyesB, 0, { autoAlpha: 1, scaleX: 1.15 }, 0.2);

internals.timeline2.
to(internals.toaster, 0.5, { rotation: -3, y: -7, scaleY: 1.1, scaleX: .96, ease: Back.easeInOut.config(1) }).
to(internals.foot, 0.5, { morphSVG: internals.footExt }, 0).
to(internals.controlLeft, 0.5, { y: -68, ease: internals.ease }, 0).
to(internals.controlRight, 0.5, { y: -68, ease: internals.ease }, 0).
to(internals.breadB, 0.5, { y: 60, rotation: 12, ease: internals.ease }, 0).
to(internals.face, 0.5, { y: -14 }, 0).
to(internals.eyesA, 0, { autoAlpha: 0 }, 0.2).
to(internals.eyesB, 0, { autoAlpha: 1, scaleX: 1.15 }, 0.2);