



var stringRandom = (function() {

    var data = {
        isScrolling : false,
        repeat : 0,
        target : [],
        letters : '*+-/@_$[%£!XO1&>',
        originalStrings : '',
        singleLetters : []
    }

    Array.prototype.shuffle = function() {
        var input = this;
         
        for (var i = input.length-1; i >=0; i--) {
         
            var randomIndex = Math.floor(Math.random()*(i+1)); 
            var itemAtIndex = input[randomIndex]; 
             
            input[randomIndex] = input[i]; 
            input[i] = itemAtIndex;
        }
        return input;
    }

    function checkLength(x) {
        return Array.from(document.querySelectorAll(x)).length > 0;
    }

    function addListener(evt, fx) {
        window.addEventListener(evt, fx);    
    }

    function changeLetter(letter) {
        if(letter.textContent != ' ') {
            letter.classList.add('is-changing');
            letter.style.animationDuration = Math.random().toFixed(2) + 's';
            
            var newChar = data.letters.substr( Math.random() * data.letters.length, 1);

            letter.textContent = newChar;
            letter.setAttribute('data-txt', newChar);
        }
    }

    function resetLetter(letter, value) {
            letter.classList.remove('is-changing');
            letter.textContent = value;
            letter.setAttribute('data-txt', value);
    }


    // divide le singole lettere delle stringhe e le wrappa in span
    function divideLetters() {

        data.target.forEach( (element, index) => {
            
            var text = element.textContent;
            var textDivided = '';

            data.originalStrings = text;

            for(var i = 0; i < text.length; i++) {
                textDivided += `<span class="el-sp el-st-${index}-span-${i}" data-txt="${text.substr(i, 1)}">${text.substr(i, 1)}</span>`;
            }

            element.innerHTML = textDivided;
        }); 
        data.singleLetters = document.querySelectorAll('.el-sp');
    }

    // changes letters
    function changeLetters() {
        if(data.isScrolling) {
            data.singleLetters.forEach(function(el, index){
                changeLetter(el);
            });
        }

        setTimeout(changeLetters, 10);
    }

    // reset to initial letters
    function resetLetters() {

        var randomArray = [];  
        for(var i = 0; i < data.singleLetters.length;i++) {
            randomArray.push(i);
        }

        randomArray.shuffle();

        randomArray.forEach(function(el, index){

            setTimeout(function(){
                resetLetter(data.singleLetters[el], data.originalStrings.substring(el, el + 1));
            }, (index * 20 * (Math.random() * 5))).toFixed(2);
                
        });
    }

    // event listener sullo scroll
    function updateScrollState() {
        clearTimeout(delay);
        data.isScrolling = true;
        
        var delay = setTimeout(function() {
            data.isScrolling = false;
            resetLetters();
        }, 300);
    };

    return {
        init: function(selector){

            // controllo che ci siano stringhe su cui agire
            if(checkLength(selector)) {

                // salvo le stringhe
                data.target = Array.from(document.querySelectorAll(selector));
                
                // divido le singole stringhe in lettere
                divideLetters();

                // lancio la funzione che si ripete
                changeLetters();

                // aggiungo il listener allo scroll
                addListener('scroll', updateScrollState);

            }
        }
    }

})();

stringRandom.init('.el-st');