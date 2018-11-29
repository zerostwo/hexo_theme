var burst = new mojs.Burst({
  left: 0, top: 0,
  radius: { 0: 90 },
  count: 14,
  children: {
    shape: 'circle',
    fill: { 'grey': 'red' },
    strokeWidth: { 1: 0 },
    angle: { 360: 0 },
    radius: { 30: 5 },
    duration: 1000 } });



var check = document.querySelector('label');
var checked = check.checked;


function heartBurst(e) {
  if (!checked) {
    var pos = this.getBoundingClientRect();

    var timeline = new mojs.Timeline({ speed: 1.5 });

    timeline.add(burst);

    burst.tune({
      'left': '50%',
      'top': '50%' });


    timeline.play();
  }
  checked = !checked;

}

check.addEventListener('click', heartBurst);