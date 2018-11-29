let animation, _synth;

fetch("https://codevember18.alejo.st/animations/05.json")
  .then(response => response.json())
  .then(animationJson => {
  animation = lottie.loadAnimation({
    container: document.getElementById('animation'),
    autoplay: true,
    loop: true,
    animationData: animationJson
  });

  animation.addEventListener("DOMLoaded", () => {
    _synth = new Tone.Synth().toMaster();
    console.log(document.querySelector("svg #C"))
    document.querySelector("svg #C").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([0,30], true);           
      _synth.triggerAttackRelease('C4', '8n');
    });
    document.querySelector("svg #D").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([30,60], true);           
      _synth.triggerAttackRelease('D4', '8n');
    });
    document.querySelector("svg #E").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([60,90], true);           
      _synth.triggerAttackRelease('E4', '8n');
    });
    document.querySelector("svg #F").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([90,120], true);           
      _synth.triggerAttackRelease('F4', '8n');
    });
    document.querySelector("svg #G").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([120,150], true);           
      _synth.triggerAttackRelease('G4', '8n');
    });
    document.querySelector("svg #A").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([150,180], true);           
      _synth.triggerAttackRelease('A4', '8n');
    });
    document.querySelector("svg #B").addEventListener("mouseenter", () => {
      animation.loop = false;
      animation.playSegments([180,210], true);           
      _synth.triggerAttackRelease('B4', '8n');
    });    
  });
});