////////////////
// helpers
////////////////

function getDistance(obj1, obj2) {
  return Math.floor(
    Math.sqrt(Math.pow(obj1.cx - obj2.cx, 2) + Math.pow(obj1.cy - obj2.cy, 2))
  );
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function comparator(a, b) {
  if (a[1] < b[1]) return -1;
  if (a[1] > b[1]) return 1;
  return 0;
}

function difference(source, toRemove) {
  return source.filter(function(value) {
    return toRemove.indexOf(value) == -1;
  });
}





////////////////
// vars
////////////////





var svg = document.getElementById("svg");
var screenW = window.innerWidth;
var screenH = window.innerHeight;
var stepX = 1;
var stepY = 1;






////////////////
// line constructor
////////////////





function Line(id1, id2) {
  this.isVisible = false;
  this.startDot = id1;
  this.endDot = id2;
  this.el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  this.class = "line";
  this.update = function() {
    this.el.setAttribute("x1", app.dots.list[this.startDot].cx);
    this.el.setAttribute("y1", app.dots.list[this.startDot].cy);
    this.el.setAttribute("x2", app.dots.list[this.endDot].cx);
    this.el.setAttribute("y2", app.dots.list[this.endDot].cy);
    this.setAttr("class", this.class);
  };
  
  this.updatePreline = function() {
    this.el.setAttribute("x1", app.dots.list[this.startDot].cx);
    this.el.setAttribute("y1", app.dots.list[this.startDot].cy);
    this.el.setAttribute("x2", app.mouseX);
    this.el.setAttribute("y2", app.mouseY);
  };
  
  this.setAttr = function(attr, value) {
    this.el.setAttribute(attr, value);
  };
  
  this.append = function() {
    svg.insertBefore(this.el, svg.firstChild);
  };
  
  this.move = function() {
      if(this.isVisible) {
        this.update();
      }
  };
  
  this.movePreline = function() {
      if(this.isVisible) {
        this.updatePreline(app.dots.selected.cx, app.dots.selected.cy, app.mouseX, app.mouseY);
      }
  };
  
}





////////////////
// dot constructor
////////////////





function Dot(r, cx, cy) {
  this.r = r;
  this.cx = cx;
  this.cy = cy;
  this.canMove = true;
  this.direction = [1, 3];
  this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  this.class = "dot";
  this.update = function(r, cx, cy) {
    this.el.setAttribute("r", r || this.r);
    this.el.setAttribute("cx", cx || this.cx);
    this.el.setAttribute("cy", cy || this.cy);
  };

  // sets attribute to element
  this.setAttr = function(attr, value) {
    this.el.setAttribute(attr, value);
  };

  // gets attribute to element
  this.getAttr = function(attr) {
    return this.el.getAttribute(attr);
  };

  // appends element to svg and attaches event listeners
  this.append = function() {
    svg.appendChild(this.el);
    this.el.addEventListener("click", this.onClick);
  };
  
  // activates the dot
  this.activate = function() {
    for (i = 0; i < app.dots.num; i++) {
      app.dots.list[i].setAttr("data-selected", "false");
    }
    this.setAttr("data-selected", "true");
  };
  
  // sets the dot as visited
  this.visited = function() {
    this.setAttr("data-visited", "true");
  };
  
  // manages the movement
  this.move = function() {
    if (this.canMove) {
      if (this.cx < this.r || this.cx > screenW - this.r) {
        this.direction[0] = -this.direction[0];
      }
      if (this.cy < this.r || this.cy > screenH - this.r) {
        this.direction[1] = -this.direction[1];
      }
      this.cx += this.direction[0];
      this.cy += this.direction[1];
    }
    this.update();
  };
  
  // the click
  this.onClick = function(event) {
    
    
    // gets the element
    var thisId = Number(event.target.getAttribute("data-id").substr(3, 2));
    var thisEl = app.dots.list[thisId];
    
    
    // gets elements coords
    var thisCx = thisEl.cx;
    var thisCy = thisEl.cy;

    
    // gets distances
    var distances = [];
    for (i = 0; i < app.dots.number; i++) {
      distances[i] = [i, getDistance(app.dots.list[app.dots.selected.id], app.dots.list[i])];
    }
    distances.sort(comparator);
    distances.splice(0, 1);
    var distancesLeft = [];
    for (i = 0; i < distances.length; i++) {
      if (app.dots.left.includes(distances[i][0])) {
        distancesLeft.push(distances[i][0]);
      }
    }
    
    // if the dot is the nearest
    if (thisId == distancesLeft[0] && app.dots.left.includes(thisId)) {
          
      //manages styles 
      thisEl.activate();
      thisEl.visited();
      
      app.score(1);
      
      
      for(i=0; i<app.lines.list.length; i++) {
        if(app.lines.list[i].isVisible == false) {
          app.lines.list[i].isVisible = true;
          app.lines.list[i].startDot = app.dots.selected.id;
          app.lines.list[i].endDot = thisId;
          break;
        }
      }
      
      
      
      
      //saves the selected dots coordinates
      app.dots.selected.id = thisId;
      app.dots.selected.cx = thisCx;
      app.dots.selected.cy = thisCy;
      
      app.preline.startDot = app.dots.selected.id;

      
      //removes the dot from the list of remaining dots
      for (i = 0; i < app.dots.left.length; i++) {
        if (app.dots.left[i] === thisId) {
          app.dots.left.splice(i, 1);
        }
      }
      
      if (app.dots.left.length == 0) {
        app.end(true);
      }
      
    } else {
      app.end(false);
    }
  }
}





////////////////
// the app
////////////////





var app = {};


// dots
app.dots = {};
app.dots.selected = {};
app.dots.selected.id = app.dots.starting;
app.dots.selected.cx;
app.dots.selected.cy;
app.dots.list = [];
app.dots.left = [];
app.dots.starting = 0;
app.dots.number = 4;


// lines
app.lines = {}
app.lines.list = [];


//preline
app.preline;
app.mouseX = 0;
app.mouseY = 0;

//UI
app.UI = {};

app.UI.score = document.getElementById('ui-score');
app.UI.scoreEnd = document.getElementById('ui-score-end');

app.UI.screen = {}
app.UI.screen.start = document.getElementById('ui-screen--start');
app.UI.screen.end = document.getElementById('ui-screen--end');
app.UI.screen.level = document.getElementById('ui-screen--level');

app.UI.btn = {}

app.UI.btn.autoplay;
app.UI.btn.start = {}
app.UI.btn.start.el = document.getElementById('ui-btn--start');
app.UI.btn.start.fn = function(){
  clearTimeout(app.UI.btn.autoplay);
  app.UI.screen.start.classList.remove('is-visible');
  app.start(app.dots.number);
  app.UI.btn.start.el.removeEventListener('click', app.UI.btn.start.fn);
}
app.UI.btn.start.el.addEventListener('click', app.UI.btn.start.fn);

app.UI.btn.end = {}
app.UI.btn.end.el = document.getElementById('ui-btn--end');
app.UI.btn.end.fn = function(){
  clearTimeout(app.UI.btn.autoplay);
  app.UI.screen.end.classList.remove('is-visible');
  app.start(app.dots.number);
  app.UI.btn.end.el.removeEventListener('click', app.UI.btn.end.fn);
}
app.UI.btn.end.el.addEventListener('click', app.UI.btn.end.fn);

app.UI.btn.level = {}
app.UI.btn.level.el = document.getElementById('ui-btn--level');
app.UI.btn.level.fn = function(){
  clearTimeout(app.UI.btn.autoplay);
  app.UI.screen.level.classList.remove('is-visible');
  app.start(app.dots.number);
  app.UI.btn.level.el.removeEventListener('click', app.UI.btn.level.fn);
}

app.UI.btn.level.el.addEventListener('click', app.UI.btn.level.fn);

app.UI.manage = function(screen, btn){
  
  app.UI.btn.autoplay = setTimeout(btn.fn, 4000);
  
  app.UI.screen.start.classList.remove('is-visible');
  app.UI.screen.end.classList.remove('is-visible');
  app.UI.screen.level.classList.remove('is-visible');
  btn.el.addEventListener('click', btn.fn);
  screen.classList.add('is-visible');
}




//game
app.repeater;

app.timer = {};
app.timer.index = 2;
app.timer.el = document.getElementById('ui-timer');
app.timer.left = app.dots.number * app.timer.index;
app.timer.reset = function(){
  app.timer.el.classList.remove('is-expiring');
  app.timer.left = app.dots.number * app.timer.index;
  app.timer.el.textContent = app.timer.left + ' sec';
}


app.start = function(dotsNumber) {
  
  app.timer.countdown = setInterval(function() {
    app.timer.el.textContent = app.timer.left + ' sec';
    --app.timer.left;
    
    if(app.timer.left < 6) {
      app.timer.el.classList.add('is-expiring');
    }
    
    if(app.timer.left < 0) {
      clearInterval(app.timer.countdown);
      app.timer.reset();
      app.end(false);
    }
  },1000);
  
  app.dots.number = dotsNumber;
  
  for (i = 0; i < app.dots.number; i++) {
    var cx = getRandomArbitrary(10, screenW - 10);
    var cy = getRandomArbitrary(10, screenH - 10);
    app.dots.list[i] = new Dot(16, cx, cy);
    app.dots.list[i].direction[0] =  getRandomArbitrary(-2, 2) || getRandomArbitrary(-2, 2);
    app.dots.list[i].direction[1] =  getRandomArbitrary(-2, 2) || getRandomArbitrary(-2, 2);
    app.dots.list[i].setAttr("class", "dot dot--" + i%5);
    app.dots.list[i].setAttr("data-id", "id-" + i);
    app.dots.list[i].update();
    app.dots.list[i].append();
    
    // fills the dots left list
    app.dots.left.push(i);
    
    //sets the starting dot
    if (i == app.dots.starting) {
      app.dots.selected.id = app.dots.starting;
      app.dots.selected.cx = app.dots.list[app.dots.starting].cx;
      app.dots.selected.cy = app.dots.list[app.dots.starting].cy;
      app.dots.list[app.dots.starting].setAttr("data-starting", "true");
      app.dots.left.splice(i, 1);
    }
    
    // and now we create the lines!
    if(i>0) {
      app.lines.list.push(
        new Line(
          app.dots.starting,
          app.dots.starting
          )
       );
    }  
  }
  for(i=0;i < app.lines.list.length;i++) {
      app.lines.list[i].update();
      app.lines.list[i].append();
    }
  
  // the "preline"
  
  app.preline = new Line(
    app.dots.starting,
    app.dots.starting,
  );
  
  app.preline.append();  
  app.preline.setAttr('class', 'line line--preline');
  
  svg.addEventListener("mouseenter", function prelineMove(e) {
    app.preline.setAttr('class', 'line line--preline is-visible');  
  });
  
  svg.addEventListener("mousemove", function prelineMove(e) {
      app.mouseX = e.pageX;
      app.mouseY = e.pageY;
      app.preline.updatePreline(app.dots.selected.cx, app.dots.selected.cy, app.mouseX, app.mouseY);
  });
  
  
  
  app.preline.updatePreline(app.dots.selected.cx, app.dots.selected.cy, app.mouseX, app.mouseY);
  
  // this makes everything move
  app.repeater = setInterval(function() {
    for (i = 0; i < app.dots.number; i++) {
      app.dots.list[i].move();
    }
    for (i = 0; i < app.lines.list.length; i++) {
      app.lines.list[i].move();
    }
    app.preline.updatePreline(app.dots.selected.cx, app.dots.selected.cy, app.mouseX, app.mouseY);
  }, 30);
};


app.end = function(win) {
  
  clearInterval(app.repeater);
  
  if (win) {
    app.dots.number += 2;
  } else {
    app.dots.number = 4;
  }
  
  clearInterval(app.timer.countdown);
  app.timer.reset();

  app.dots.list = [];
  app.dots.selected = {};
  app.dots.left.length = 0;
  app.lines.list = [];
  svg.innerHTML = "";

  if (win) {
  app.UI.manage(app.UI.screen.level, app.UI.btn.level);  
  } else {
    app.score("reset");
    app.UI.manage(app.UI.screen.end, app.UI.btn.end);  
  }
};

app.score = function(points) {
  if (points == "reset") {
    app.UI.scoreEnd.textContent = sessionStorage.getItem("score");
    sessionStorage.setItem("score", 0);
  } else {
    if (!sessionStorage.getItem("score")) {
      sessionStorage.setItem("score", points);
    } else {
      var newscore = parseInt(sessionStorage.getItem("score")) + points;
      sessionStorage.setItem("score", newscore);
    }
  }
  app.UI.score.classList.toggle('is-changing')
  app.UI.score.textContent = sessionStorage.getItem("score");
};


//app.start(4);