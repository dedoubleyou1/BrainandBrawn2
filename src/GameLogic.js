// Converts the level data into a format more suitable for gameplay
GameLogic = function(map) {
  this.gameplayMap = (map);

  //Shows game map in console if true;
  this.debugMode = true;

  if (this.debugMode) {
    this.consoleLogMap();
  }
}

GameLogic.prototype.mapKeyLookup = function(key) {

  // These are functions used by tile triggers.
  var triggers = {
    checkWin: function() {
      var otherGoal = indexOf2d(this.gameplayMap.fixed, 'G');
      var otherChar = indexOf2d(this.gameplayMap.active, 'B');
      if (otherChar.x == otherGoal.x && otherChar.y == otherGoal.y) {
        return 'missionSuccess';
      }
    },
    unlockGates: function(gate, resultGate) {
      return function() {
        indexOfAll2d(this.gameplayMap.fixed, gate).forEach(function(element) {
            this.gameplayMap.fixed[element.y][element.x] = resultGate;
        }, this);
      };
    }
  };

  var keyLookup = {
    ' ':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '#':{
      'b': {isSolid: true},
      'B': {isSolid: true}
    },
    'E':{
      'b': {isSolid: false, trigger: function(){}},
      'B': {isSolid: false, trigger: function(){}}
    },
    'g':{
      'b': {isSolid: false, trigger: triggers.checkWin},
      'B': {isSolid: false}
    },
    'G':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '0':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '1':{
      'b': {isSolid: false, trigger: triggers.unlockGates('2','3')},
      'B': {isSolid: false}
    },
    '2':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '3':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '4':{
      'b': {isSolid: false, trigger: triggers.unlockGates('5','6')},
      'B': {isSolid: false}
    },
    '5':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '6':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '7':{
      'b': {isSolid: false, trigger: triggers.unlockGates('8','9')},
      'B': {isSolid: false}
    },
    '8':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '9':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    }
  }
  return keyLookup[key];
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


// Display map in console for debugging purposes
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
    'b': [indexOf2d(this.gameplayMap.active, 'b')],
    'B': [indexOf2d(this.gameplayMap.active, 'B')],
    gravity: direction,
    endState: 'none'
  };

  var results = {
    moveSuccess: true,
  }

  while (results.moveSuccess === true) {
    results = this.moveOnce(direction)
    if (typeof results.endState === 'string') {
      gameStateChanges.endState = results.endState;
    }
    if (typeof results.b != 'undefined') {
      gameStateChanges.b.push(results.b)
    }
    if (typeof results.B != 'undefined') {
      gameStateChanges.B.push(results.b)
    }
  }

  //Add final positions
  gameStateChanges.b.push(indexOf2d(this.gameplayMap.active, 'b'));
  gameStateChanges.B.push(indexOf2d(this.gameplayMap.active, 'B'));  

  if (this.debugMode) {
    console.log(direction);
    this.consoleLogMap();
  }
  return gameStateChanges;
};

GameLogic.prototype.isPositionClear = function(character, x, y) {
  if (this.mapKeyLookup(this.gameplayMap.fixed[y][x])[character].isSolid === true || this.gameplayMap.active[y][x] != ' ') {
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
  var moveSuccess = false;
  // Characters closer to the gravitational "floor" move first.
  if (direction === 'up' || direction === 'left'){
    for (var i = 0; i < this.gameplayMap.height; i++) {
      for (var j = 0; j < this.gameplayMap.width; j++) { 
        if (this.attemptMove(direction, j, i)) {
          moveSuccess = true;
        }
      }
    }
  } else if (direction === 'down' || direction === 'right'){
    for (var i = this.gameplayMap.height - 1; i >= 0; i--) {
      for (var j = this.gameplayMap.width - 1; j >= 0; j--) { 
        if (this.attemptMove(direction, j, i)) {
          moveSuccess = true;
        }
      }
    }
  }
  var triggerResults = this.checkTriggers();
  triggerResults.moveSuccess = moveSuccess;
  return triggerResults;
}


GameLogic.prototype.checkTriggers = function() {
  var triggerResults = {};
  var active;
  var fixed;
  var results;
  for (var i = 0; i < this.gameplayMap.height; i++) {
    for (var j = 0; j < this.gameplayMap.width; j++) {
      active = this.gameplayMap.active[i][j];
      fixed = this.gameplayMap.fixed[i][j]
      if (active != ' ') {
        var trigger = this.mapKeyLookup(fixed)[active].trigger;
        if (typeof trigger === 'function') {
          results = trigger.call(this);
          if (typeof results === 'string') {
            triggerResults.endState = results;
          }
          triggerResults[active] = {
            x: j,
            y: i,
            eventType: fixed
          };
        }
      }
    }
  }
  return triggerResults;
}





