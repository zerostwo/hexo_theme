// Utility function
function Util() {};

/* 
	class manipulation functions
*/
Util.hasClass = function (el, className) {
  if (el.classList) return el.classList.contains(className);
  else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function (el, className) {
  var classList = className.split(' ');
  if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function (el, className) {
  var classList = className.split(' ');
  if (el.classList) el.classList.remove(classList[0]);
  else if (Util.hasClass(el, classList[0])) {
    var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function (el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

/* 
	Animate height of an element
*/
Util.setHeight = function (start, to, element, duration, cb) {
  var change = to - start,
    currentTime = null;

  var animateHeight = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    var val = parseInt((progress / duration) * change + start);
    element.setAttribute("style", "height:" + val + "px;");
    if (progress < duration) {
      window.requestAnimationFrame(animateHeight);
    } else {
      cb();
    }
  };

  //set the height of the element before starting animation -> fix bug on Safari
  element.setAttribute("style", "height:" + start + "px;");
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function (final, duration) {
  var start = window.scrollY || document.documentElement.scrollTop,
    currentTime = null;

  var animateScroll = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    window.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if (!element) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function (array, el) {
  return Array.prototype.indexOf.call(array, el);
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

(function () {
  this.Tab = function (element) {
    this.element = element;
    this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
    this.listItems = this.tabList.getElementsByTagName('li');
    this.triggers = this.tabList.getElementsByTagName('a');
    this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
    this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
    this.showClass = 'tabs__panel--selected';
    this.activeClass = 'tabs__control--selected';
    this.initTab();
  };

  Tab.prototype.initTab = function () {
    //set initial aria attributes
    this.tabList.setAttribute('role', 'tablist');
    for (var i = 0; i < this.triggers.length; i++) {
      var bool = (i == 0),
        panelId = this.panels[i].getAttribute('id');
      this.listItems[i].setAttribute('role', 'presentation');
      Util.setAttributes(this.triggers[i], {
        'role': 'tab',
        'aria-selected': bool,
        'aria-controls': panelId,
        'id': 'tab-' + panelId
      });
      Util.addClass(this.triggers[i], 'js-tabs__trigger');
      Util.setAttributes(this.panels[i], {
        'role': 'tabpanel',
        'aria-labelledby': 'tab-' + panelId
      });
      Util.toggleClass(this.panels[i], 'tab__panel--is-hidden', !bool);

      if (!bool) this.triggers[i].setAttribute('tabindex', '-1');
    }

    //listen for Tab events
    this.initTabEvents();
  };

  Tab.prototype.initTabEvents = function () {
    var self = this;
    //click on a new tab -> select content
    this.tabList.addEventListener('click', function (event) {
      if (event.target.closest('.js-tabs__trigger')) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
    });
    //arrow keys to navigate through tabs 
    this.tabList.addEventListener('keydown', function (event) {
      if (!event.target.closest('.js-tabs__trigger')) return;
      if (event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight') {
        self.selectNewTab('next');
      } else if (event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft') {
        self.selectNewTab('prev');
      }
    });
  };

  Tab.prototype.selectNewTab = function (direction) {
    var selectedTab = this.tabList.getElementsByClassName(this.activeClass)[0],
      index = Util.getIndexInArray(this.triggers, selectedTab);
    index = (direction == 'next') ? index + 1 : index - 1;
    //make sure index is in the correct interval 
    //-> from last element go to first using the right arrow, from first element go to last using the left arrow
    if (index < 0) index = this.listItems.length - 1;
    if (index >= this.listItems.length) index = 0;
    this.triggerTab(this.triggers[index]);
    this.triggers[index].focus();
  };

  Tab.prototype.triggerTab = function (tabTrigger, event) {
    var self = this;
    event && event.preventDefault();
    var index = Util.getIndexInArray(this.triggers, tabTrigger);
    //no need to do anything if tab was already selected
    if (Util.hasClass(this.triggers[index], this.activeClass)) return;

    for (var i = 0; i < this.triggers.length; i++) {
      var bool = (i == index);
      Util.toggleClass(this.triggers[i], this.activeClass, bool);
      Util.toggleClass(this.panels[i], this.showClass, bool);
      this.triggers[i].setAttribute('aria-selected', bool);
      bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
    }
  };

  //initialize the Tab objects
  var tabs = document.getElementsByClassName('js-tabs');
  if (tabs.length > 0) {
    for (var i = 0; i < tabs.length; i++) {
      (function (i) {
        new Tab(tabs[i]);
      })(i);
    }
  }
}());