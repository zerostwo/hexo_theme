let animation;

fetch("https://codevember18.alejo.st/animations/24.json")
  .then(response => response.json())
  .then(animationJson => {
  animation = lottie.loadAnimation({
    container: document.getElementById('animation'),
    autoplay: true,
    loop: true,
    animationData: animationJson
  });

  animation.addEventListener("DOMLoaded", () => {
    animation.stop();
  });

  animation.addEventListener("complete", () => {
    input.style.display = "block";
    input.focus();
    animation.goToAndStop(0);
  });

  let input = document.getElementById('day24_input');
  input.addEventListener("keydown", (event) => {                 
    if(event.key === 'Enter') {
      if (input.value != "") {                  
        animation.renderer.elements[2].updateDocumentData({t:input.value});
      } else {
        animation.renderer.elements[2].updateDocumentData({t:"YOU’RE FIRED!!!"});                  
      }

      input.style.display = "none";
      animation.loop = false;
      animation.play();
      input.value = "";             
    }
  });
});