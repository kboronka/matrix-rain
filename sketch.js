var symoblSize = 15;
var streams = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  textStyle(BOLD);
  textSize(symoblSize);

  c1 = color('hsl(87, 100%, 34%)');
  c2 = color('hsl(87, 100%, 14%)');
  c3 = color('hsl(87, 100%, 8%)');
  c4 = color('hsl(87, 100%, 4%)');
  c5 = color('hsl(0, 0%, 0%)');

  for (var i = 0; i < window.innerWidth / symoblSize; i++) {
    var stream = new Stream(i * symoblSize);
    streams[i] = stream;
    streams[i].y = round(random(-10, height / symoblSize)) * symoblSize;
  }

  //noLoop();
}

function draw() {
  for (var i = 0; i < this.streams.length; i++) {
    if (this.streams[i].isDone()) {
      this.streams[i] = new Stream(i * symoblSize);
    }

    this.streams[i].render();
  }
}

function Symbol(x, y) {
  this.x = x;
  this.y = y;
  this.birthTime = millis();
  this.background = round(random(1, 10));

  var lastColor = -1;
  var lastValue = -1;

  this.value;
  this.switchInterval = round(random(1000, 4000));

  this.setToRandomSymbol = function() {
    // Katakana unicode block (96 characters)
    // https://en.wikipedia.org/wiki/Katakana_(Unicode_block)
    this.value = String.fromCharCode(0x30A0 + round(random(0, 96)));
  };

  this.render = function(color) {
    if (millis() - this.birthTime > this.switchInterval) {
      this.birthTime = millis();
      this.setToRandomSymbol();
    }

    if (lastColor != color || lastValue != this.value) {
      if (color === c5) {
        fill(0);
      } else {
        fill(this.background);
      }
      rect(this.x, this.y, symoblSize, -symoblSize);
      fill(color);
      text(this.value, this.x, this.y);
      lastColor = color;
      lastValue = this.value;
    }
  }

  this.setToRandomSymbol();
}

function Stream(x) {
  this.startTime = millis();
  this.decentRate = random(50, 250);

  this.x = x;
  this.y = 0;
  this.speed = round(random(150, 250));
  this.length = 0;
  this.maxLength = round(random(4, 30));
  this.symbols = [];

  this.generateStartSymbol = function() {
    symbol = new Symbol(this.x, 0);
    this.symbols.push(symbol);
  }

  this.colorPicker = function(index) {
    var color = c2;

    if (index == this.symbols.length - 1) {
      color = c1;
    } else if (index == 2 && this.symbols.length >= this.maxLength - 2) {
      color = c3;
    } else if (index == 1 && this.symbols.length >= this.maxLength - 1) {
      color = c4;
    } else if (index == 0 && this.symbols.length >= this.maxLength) {
      color = c5;
    }

    return color;
  };

  this.render = function() {
    var speed = this.speed;
    var time = millis() - this.startTime;

    if (time > this.decentRate) {
      this.startTime += this.decentRate;
      this.y += symoblSize;
      this.spawnNewSymbol(this.y);
    }

    for (var i = 0; i < this.symbols.length; i++) {
      var symbol = this.symbols[i];
      if (symbol.y > height) {} else {
        symbol.render(this.colorPicker(i));
      }
    }
  };

  this.spawnNewSymbol = function(y) {
    symbol = new Symbol(this.x, y);
    this.symbols.push(symbol);

    if (++this.length > this.maxLength) {
      this.symbols.shift();
    }
  };

  this.isDone = function() {
    return this.length > 0 && this.symbols[0].y > height;
  }
  this.generateStartSymbol();
}