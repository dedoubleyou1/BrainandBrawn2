// Converts the level data into a format more suitable for gameplay
GameLogic = function(map) {
  this.gameplayMap = (map);

  //Turns on console.log gameplay
  this.debugMode = true;

  if (this.debugMode) {
    this.consoleLogMap();
  }
}

GameLogic.prototype.mapKey = {
  'b':{type: 'active'},
  'B':{type: 'active'},
  '#':{
    type: 'fixed', 
    'b': {isSolid: true, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  'E':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: true}
  },
  'g':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: false}
  },
  'G':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: false, isTrigger: true}
  },
  '1':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: false}
  },
  '2':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: false}
  },
  '3':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: false}
  },
  '4':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: true},
    'B': {isSolid: false, isTrigger: false}
  },
  '9':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  '8':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  '7':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  '6':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  '5':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: true, isTrigger: false}
  },
  ' ':{
    type: 'fixed', 
    'b': {isSolid: false, isTrigger: false},
    'B': {isSolid: false, isTrigger: false}
  }
};

GameLogic.prototype.directionLookup = {
  up: {
    x: 0,
    y: -1
  },
  down: {
    x: 0,
    y: 1
  },
  left: {
    x: -1,
    y: 0
  },
  right: {
    x: 1,
    y: 0
  }
};


// Display in console for debugging purposes
GameLogic.prototype.consoleLogMap = function() {
  var mapStrings = [];
  var tempChar;
  var atCoordinate;
  for (var i = 0; i < this.gameplayMap.height; i++) {
    mapStrings[i] = ""+i+"|";
    for (var j = 0; j < this.gameplayMap.width; j++) {

      // Checks if any active characters are on a given coordinate      
      if ((this.gameplayMap.active[i][j]) != ' ') {
        mapStrings[i] += this.gameplayMap.active[i][j];
      } else {
        mapStrings[i] += this.gameplayMap.fixed[i][j];
      }
    }
  }
  mapStrings.forEach(function(element) {
    console.log(element);
  })
  return true;
};

GameLogic.prototype.gravitySwitch = function(direction) {

  var gameStateChanges = {
    'b': [],
    'B': [],
    state: 'ready'
  };

  while (this.moveOnce(direction)) {
  }

  if (this.debugMode) {
    console.log(direction);
    this.consoleLogMap();
  }

  return gameStateChanges;
};

GameLogic.prototype.isPositionClear = function(character, x, y) {
  if (this.mapKey[this.gameplayMap.fixed[y][x]][character].isSolid === true || this.gameplayMap.active[y][x] != ' ') {
    return false
  } else {
    return true
  }
};

GameLogic.prototype.attemptMove = function(direction, x, y) {
  var character = this.gameplayMap.active[y][x];
  var newPosition = {
    x: this.directionLookup[direction].x + x,
    y: this.directionLookup[direction].y + y
  };
  if (character != ' ' && this.isPositionClear(character, newPosition.x, newPosition.y)) {
    // MOVE TO IT's NEW SPOT
    this.gameplayMap.active[y][x] = ' ';
    this.gameplayMap.active[newPosition.y][newPosition.x] = character;
    return true;
  } else {
    return false;
  }
};

GameLogic.prototype.moveOnce = function(direction) {
  var success = false;
  // Characters closer to the "floor" move first.
  if (direction === 'up' || direction === 'left'){
    for (var i = 0; i < this.gameplayMap.height; i++) {
      for (var j = 0; j < this.gameplayMap.width; j++) { 
        if (this.attemptMove(direction, j, i)) {
          success = true;
        }
      }
    }
  } else if (direction === 'down' || direction === 'right'){
    for (var i = this.gameplayMap.height - 1; i >= 0; i--) {
      for (var j = this.gameplayMap.width - 1; j >= 0; j--) { 
        if (this.attemptMove(direction, j, i)) {
          success = true;
        }
      }
    }
  }
  return success;
}



