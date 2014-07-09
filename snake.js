(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function getRandom(n, m) {

  return Math.floor(Math.random() * m) + n;

}

function getRandom2(n, m) {

  return Math.random() * m + n;

}


var Rect = (function() {
  'use strict';
  var Rect = function(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  Rect.prototype.getX = function() {
    return this.x;
  }

  Rect.prototype.getY = function() {
    return this.y;
  }

  Rect.prototype.setX = function(elem) {
    this.x = elem;
  }

  Rect.prototype.setY = function(elem) {
    this.y = elem;
  }

  Rect.prototype.getHeight = function() {
    return this.y * this.size + this.size;
  }

  Rect.prototype.getWidth = function() {
    return this.x * this.size + this.size;
  }

  Rect.prototype.getSize = function() {
    return this.size;
  }

  Rect.prototype.render = function(context, color) {
    if (!context) throw ('Nope')
    context.beginPath();
    context.rect(
      this.x * this.size,
      this.y * this.size,
      this.size,
      this.size);
    context.fillStyle = color || '#8ED6FF';
    context.fill();
    context.lineWidth = 0;
    context.strokeStyle = color || '#8ED6FF';
    context.stroke();
  }

  return Rect;

})();

var Snake = (function() {
  'use strict';
  var Snake = function(options) {

    this.body = [];

    for (var i = options.startSize - 1; i >= 0; i--) {
      this.body.push(new Rect((options.x * options.size) * i, options.y * options.size, options.size));

    }

    this.size = options.size;

    this.head = {
      x: options.x,
      y: options.y
    };

    this.nextDirection = options.dir;

    this.color = options.color;


    this.vectors = [];

    for (var i = 0; i < this.body.length; i++) {

      this.vectors.push({
        x: getRandom2(-1, 1),
        y: getRandom2(-1, 1)
      });

    }

  }

  Snake.prototype.setDirection = function(newDirection) {

    var allowedDirections;

    switch (this.nextDirection) {
      case 'left':
      case 'right':
        allowedDirections = ['up', 'down'];
        break;
      case 'up':
      case 'down':
        allowedDirections = ['left', 'right'];
        break;
      default:

    }

    if (allowedDirections.indexOf(newDirection) > -1) {
      this.nextDirection = newDirection;
    }

  }

  Snake.prototype.grow = function() {

    this.body.push(new Rect(0, 0, this.size));

    this.vectors.push({
      x: getRandom2(-1, 1),
      y: getRandom2(-1, 1)
    });

  }

  Snake.prototype.move = function() {

    if (this.nextDirection === 'up') this.head.y--;
    if (this.nextDirection === 'down') this.head.y++;
    if (this.nextDirection === 'right') this.head.x++;
    if (this.nextDirection === 'left') this.head.x--;

    var tail = this.body.pop();

    tail.setX(this.head.x);
    tail.setY(this.head.y);

    this.body.unshift(tail);

  }

  Snake.prototype.render = function(ctx) {

    for (var i = 0; i < this.body.length; i++) {
      this.body[i].render(ctx, this.color);
    }

  }

  Snake.prototype.isInsideTheWall = function(w, h) {
    return this.head.x > -1 && this.head.x * this.size < w && this.head.y > -1 && this.head.y * this.size < h;
  }

  Snake.prototype.isSelfEating = function() {

    var newArr = this.body.slice(1, this.body.length);

    return this.checkCollision(newArr).status;
  }

  Snake.prototype.checkCollision = function(array) {

    if (!array) throw ('No array');

    var check = false;
    var j;

    for (var i = 0; i < array.length; i++) {
      if (_checkCollision(this.body[0], array[i])) {
        check = true;
        j = i;
      }
    }

    return {
      status: check,
      index: j
    };

  }

  Snake.prototype.finale = function(w, h) {

    for (var i = 0; i < this.body.length; i++) {

      this.body[i].setX(this.body[i].getX() + this.vectors[i].x);
      this.body[i].setY(this.body[i].getY() + this.vectors[i].y);

      if (this.body[i].getX() <= 0 || this.body[i].getX() * this.size + this.size >= w) {
        this.vectors[i].x *= -1;
      }

      if (this.body[i].getY() <= 0 || this.body[i].getY() * this.size + this.size >= h) {
        this.vectors[i].y *= -1;
      }

    }

  }

  function _checkCollision(objA, objB) {

    return objA.getX() === objB.getX() && objA.getY() === objB.getY();

  }
  return Snake;

})();

(function(DataHandler) {
  'use strict';


  DataHandler.init = function(options) {
    host = options.host;
    load = options.load;
    send = options.send;
    console.info('DataHandler initialized');
  };

  DataHandler.load = function(callback) {

    console.log('Loading data from ' + host.concat(send));

    app.get(host.concat(load), null, function(returnData) {

      if (returnData) {
        if (callback && typeof(callback) === "function") {
          callback(returnData);
        }
      }

    }, true);


  };
  DataHandler.send = function(options, callback) {

    var options = options || {};

    console.log('Sending data to: ' + host.concat(send));

    app.post(host.concat(send), options.data || null, function(returnData) {
      
      if (returnData) {
        if (callback && typeof(callback) === "function") {
          callback(returnData);
        }
      }

    }, true);


  };

  var host, send, load;


})(window.DataHandler = window.DataHandler || {});

(function(SnakeGame) {
  'use strict';

  var optCache;

  //public:

  SnakeGame.init = function(options) {

    optCache = options;

    console.info('SnakeGame initialized ...');
    //uh oh, lehetne javítani
    clearInterval(finaleTimer);

    document.onkeydown = checkKey;

    canvas = document.getElementById(options.canvas);
    context = canvas.getContext('2d');

    canvas.width = screenWidth = options.width || 300;
    canvas.height = screenHeight = options.height || 300;

    loopTime = options.looptime || 200;

    size = options.size || 20;

    Plissken = new Snake({
      x: options.snake.x,
      y: options.snake.y,
      size: options.size,
      dir: options.snake.direction || 'right',
      color: options.snake.color,
      startSize: options.snake.startSize || 3
    });

    food = [];

    score = 0;

    isPaused = false;

    isOver = false;

    startTime = new Date().getTime();

    //megjegyzés: csak meg várhatóan minden lefut időben ...
    isInit = true;

  }

  SnakeGame.run = function() {
    if (!isInit) throw ('Init perhaps?');
    console.info('SnakeGame running ...')
    run();
    generateFood();
  }

  SnakeGame.pause = function() {
    console.info('SnakeGame paused ...')
    clearInterval(timer);
  }

  SnakeGame.score = function() {
    return typeof scoreCalc === 'undefined' ? 0 : scoreCalc;
  }

  //private:  

  function checkKey(e) {

    if (lock) return;

    e = e || window.event;

    if (e.keyCode == '38') {
      direction = 'up';

    } else if (e.keyCode == '40') {
      direction = 'down';
    } else if (e.keyCode == '37') {
      direction = 'left';
    } else if (e.keyCode == '39') {
      direction = 'right';
    } else if (e.keyCode == '32') {
      isPaused ? run() : pause()
    }
  }

  function pause() {
    clearInterval(timer);
    isPaused = true;
  }

  function run() {
    if (!isOver) {
      timer = setInterval(animate, loopTime);
      isPaused = false;
    }
  }
  var lock = true;

  function animate() {
    lock = true;

    currentTime = new Date().getTime() - startTime;

    context.clearRect(0, 0, canvas.width, canvas.height);

    Plissken.setDirection(direction);

    Plissken.move();
    Plissken.render(context);

    if (!Plissken.isInsideTheWall(screenWidth, screenHeight)) {
      gameOver();
    }

    if (Plissken.isSelfEating()) {
      gameOver();
    }

    var collison = Plissken.checkCollision(food);

    if (collison.status === true) {
      food.remove(collison.index);
      Plissken.grow();
      //score+= 1 +  ( score*score ) * 1/currentTime/100000 ;
      score++;
      scoreCalc = Math.round(10 * (score * 2 / (currentTime / 1000) + score));
    }

    for (var i = 0; i < food.length; i++) {
      food[i].render(context, '#DAED12');
    }
    //@todo test
    if (food.length === 0) {
      var newFood = generateFood();
      if (!Plissken.checkCollision(newFood).status) {
        food.push(newFood);
        //console.log('Pont:', score, scoreCalc, currentTime / 1000);
      }
    }
    lock = false;

  }

  function gameOver() {

    pause();

    isOver = true;
    isInit = false;

    finaleTimer = setInterval(function() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      Plissken.finale(screenWidth, screenHeight);
      Plissken.render(context);
    }, loopTime);


    (typeof scoreCalc === 'undefined' || scoreCalc === 0) ? showRestart() : showScore();

  }

  function showScore() {

    optCache.events.form(scoreCalc);

  }

  function showRestart() {
    SnakeGame.init(optCache);
    SnakeGame.run();
  }

  function generateFood() {

    return new Rect(getRandom(0, screenWidth / size - 1), getRandom(0, screenHeight / size - 1), size);

  }
  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  }
  //static
  var finaleTimer;
  var isInit = false;
  var score;
  var isOver;
  var canvas;
  var context;
  var timer;
  var isPaused;
  var loopTime;
  var direction;
  var food;
  var size;
  var score;
  var scoreCalc;
  var screenHeight, screenWidth;
  var startTime, currentTime;
  var Plissken;


})(window.SnakeGame = window.SnakeGame || {});

(function(ViewHandler) {

  //form
  var error = document.getElementById('error');
  var ultimatez = document.getElementById('ultimate');

  ViewHandler.showForm = function(score) {
    if (localStorage.getItem('name')) {
      document.getElementById('input-name').value = localStorage.getItem('name');
    }

    fadeIn(document.getElementById('modal'));
    document.getElementById('input-score').value = '' + score + ' pont';
  }
  ViewHandler.hideModal = function() {

    document.getElementById('modal').style.display = 'none';

  }

  ViewHandler.processForm = function(e) {
    e.preventDefault();
    console.log('submit');
    var name = document.getElementById('input-name');
    if (name.value === '') {
      ViewHandler.showError('Nevet plz');
      return;
    } else {
      localStorage.setItem('name', name.value);
      DataHandler.send({
          data: {
            name: name.value,
            score: SnakeGame.score()
          },
        },
        function(data) {
          console.log(data)
          if (data.status === 'success') {
            //lol!
            ViewHandler.showError('Mentve.');
            ViewHandler.hideModal();
          } else {
            ViewHandler.showError('Nem sikerült elmenteni :(((');
          }

        }
      );
    }
  }

  ViewHandler.showList = function(data) {



    var body = document.getElementById("ultimate").getElementsByTagName("tbody")[0];
    clearElement(body);

    if (data.length > 0) {

      for (var i = 0; i < data.length; i++) {
      
        appendUltimatez(body, {
          number: i+1,
          name: data[i].name,
          score: data[i].score
        });

      };

      fadeIn(document.getElementById("ultimate"));


    } else {
      ViewHandler.showError('Nincs még ranglista!');
    }

  }

  ViewHandler.showError = function(message) {

    clearElement(error);
    fadeIn(error);
    var h = document.createElement('h3');
    var text = document.createTextNode(message);
    h.appendChild(text);
    error.appendChild(h);

  }

  ViewHandler.hideForm = function() {

    if (error.style.opacity > 0) error.style.display = 'none';
    if (ultimatez.style.opacity > 0) ultimatez.style.display = 'none';

  }

  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function appendUltimatez(element, opt) {

    var newRow = document.createElement('tr');
    var newColNumber = document.createElement('td');
    var newColName = document.createElement('td');
    var newColScore = document.createElement('td');

    newColNumber.appendChild(document.createTextNode(opt.number));
    newColName.appendChild(document.createTextNode(opt.name));
    newColScore.appendChild(document.createTextNode(opt.score));
    newRow.appendChild(newColNumber);
    newRow.appendChild(newColName);
    newRow.appendChild(newColScore);
    element.appendChild(newRow);

  }

  function fadeIn(element) {
    element.style.display = 'block';
    var op = 0.1; // initial opacity
    var timer = setInterval(function() {
      if (op >= 0.9) {
        clearInterval(timer);
        //element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
    }, 5);
  }

})(window.ViewHandler = window.ViewHandler || {});

//felső becslés
//console.log(Math.round(10 * (500 * 2 / (200 / 1000) + 500)))
//
console.log('Piton Game Corporation 2013 | hajnaldavid@elte.hu')

var optInit = {
  canvas: 'myCanvas',
  width: 300,
  height: 300,
  loopTime: 1,
  size: 25,
  snake: {
    x: 2,
    y: 2,
    color: '#FF2B6E',
    startSize: 3
  },
  events: {
    form: ViewHandler.showForm
  }
};

SnakeGame.init(optInit);

//SnakeGame.run();

var isRestart = false;

app.on(document.getElementById('game-pause'), "click", function() {
  SnakeGame.pause();
});

app.on(document.getElementById('game-run'), "click", function() {
  if (isRestart) SnakeGame.init(optInit);
  SnakeGame.run();
  isRestart = false;
});


var form = document.getElementById('form-score');
var cancel = document.getElementById('cancel');
app.on(form, "submit", function(e){
  ViewHandler.processForm(e);
  isRestart = true;
});
app.on(cancel, "click", function() {
  ViewHandler.hideModal();
  isRestart = true;
});

DataHandler.init({
  host: 'http://hajnaldavid.web.elte.hu/snake/snake-rest/',
  send: 'scores',
  load: 'scores',
});

app.on(document.body, "click", ViewHandler.hideForm);

app.on(document.getElementById('ultimatez'), "click",

  function() {

    DataHandler.load(function(data) {

      if (data.status === 'success') {
        ViewHandler.showList(data.message);
      } else {
        ViewHandler.showError(data.message);
      }

    });

  });