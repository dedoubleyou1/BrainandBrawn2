// Converts the level data into a format more suitable for gameplay
GameLogic = function(map) {
  this.gameplayMap = (map);


  this.activeChars = []
  for (var y = 0; y < this.gameplayMap.height; y++) {
    for (var x = 0; x < this.gameplayMap.width; x++) {
      if (this.gameplayMap.active[y][x] != ' ') {
        this.activeChars.push(this.gameplayMap.active[y][x]);
      } 
    }
  }

  //Shows game map in console if true;
  this.debugMode = true;

  if (this.debugMode) {
    this.consoleLogMap();
  }
}

GameLogic.prototype.mapKeyLookup = function(key) {

  // These are functions used by tile triggers. They are passed in the coordinate of the trigger action.
  var triggers = {
    checkWin: function() {
      var otherGoal = indexOf2d(this.gameplayMap.fixed, 'G');
      var otherChar = indexOf2d(this.gameplayMap.active, 'B');
      if (otherChar.x == otherGoal.x && otherChar.y == otherGoal.y) {
        return 'missionSuccess';
      }
    },
    unlockGates: function(resultSwitch, gate, resultGate) {
      return function(position) {
        this.gameplayMap.fixed[position.y][position.x] = resultSwitch;
        indexOfAll2d(this.gameplayMap.fixed, gate).forEach(function(element) {
            this.gameplayMap.fixed[element.y][element.x] = resultGate;
        }, this);
      };
    },
    killFixed: function(position){
      this.gameplayMap.fixed[position.y][position.x] = ' ';
    },
    killActive: function(killType) {
      return function() {
        return killType;
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
    '|':{
      'b': {isSolid: true},
      'B': {isSolid: true}
    },
    '-':{
      'b': {isSolid: true},
      'B': {isSolid: true}
    },
    '.':{
      'b': {isSolid: false, trigger: triggers.killActive('brainyLost')},
      'B': {isSolid: false, trigger: triggers.killActive('brawnyLost')}      
    },
    'E':{
      'b': {isSolid: false, trigger: triggers.killActive('brainyEaten')},
      'B': {isSolid: false, trigger: triggers.killFixed}
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
      'b': {isSolid: false, trigger: triggers.unlockGates('2','3','4')},
      'B': {isSolid: false}
    },
    '2':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '3':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '4':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '5':{
      'b': {isSolid: false, trigger: triggers.unlockGates('6','7','8')},
      'B': {isSolid: false}
    },
    '6':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '7':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '8':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '9':{
      'b': {isSolid: false, trigger: triggers.unlockGates('10','11','12')},
      'B': {isSolid: false}
    },
    '10':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    },
    '11':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '12':{
      'b': {isSolid: false},
      'B': {isSolid: false}
    }
  }
  return keyLookup[key];
};


// Display map in console for debugging purposes
GameLogic.prototype.consoleLogMap = function() {
  var mapStrings = [];
  var tempChar;
  var atCoordinate;
  for (var y = 0; y < this.gameplayMap.height; y++) {
    mapStrings[y] = ""+y+"|";
    for (var x = 0; x < this.gameplayMap.width; x++) {

      // Checks if any active characters are on a given coordinate      
      if ((this.gameplayMap.active[y][x]) != ' ') {
        mapStrings[y] += this.gameplayMap.active[y][x];
      } else {
        mapStrings[y] += this.gameplayMap.fixed[y][x];
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
  };
  var thisChar;
  var theseChanges;

  while (results.moveSuccess === true) {
    results = this.moveOnce(direction)
    if (typeof results.endState === 'string' && gameStateChanges.endState === 'none') {
      gameStateChanges.endState = results.endState;
    }
    for (var i = this.activeChars.length - 1; i >= 0; i--) {
      thisChar = this.activeChars[i];
      theseChanges = gameStateChanges[thisChar];

      if (typeof results[thisChar] != 'undefined' && typeof theseChanges[theseChanges.length - 1] != 'undefined') {
        if (results[thisChar].x != theseChanges[theseChanges.length - 1].x || results[thisChar].y != theseChanges[theseChanges.length - 1].y) {
          gameStateChanges[thisChar].push(results[thisChar])          
        }
      }
    };
  }

  //Add final positions
  this.activeChars.forEach(function(element){
    gameStateChanges[element].push(indexOf2d(this.gameplayMap.active, element));
  }, this)

  if (this.debugMode) {
    console.log(gameStateChanges);
    console.log(direction);
    this.consoleLogMap();
  }
  return gameStateChanges;
};


GameLogic.prototype.isPositionClear = function(character, x, y) {
  if (x < 0 || y < 0 || x >= this.gameplayMap.width || y >= this.gameplayMap.height) {
    return false
  } else if (this.mapKeyLookup(this.gameplayMap.fixed[y][x])[character].isSolid === true || this.gameplayMap.active[y][x] != ' ') {
    return false
  } else {
    return true
  }
};


GameLogic.prototype.attemptMove = function(direction, x, y) {

  var character = this.gameplayMap.active[y][x];
  if (this.gameplayMap.skinnyWalls) {
    var newPosition1 = {
      x: directionLookup[direction].x + x,
      y: directionLookup[direction].y + y
    };
    var newPosition2 = {
      x: directionLookup[direction].x * 2 + x,
      y: directionLookup[direction].y * 2 + y
    };
    if (character != ' ' && this.isPositionClear(character, newPosition1.x, newPosition1.y) && this.isPositionClear(character, newPosition2.x, newPosition2.y)) {
      // MOVE TO IT's NEW SPOT
      this.gameplayMap.active[y][x] = ' ';
      this.gameplayMap.active[newPosition2.y][newPosition2.x] = character;
      return true;
    } else {
      return false;
    }
  
  } else {
    var newPosition = {
      x: directionLookup[direction].x + x,
      y: directionLookup[direction].y + y
    };
    if (character != ' ' && this.isPositionClear(character, newPosition.x, newPosition.y)) {
      // MOVE TO IT's NEW SPOT
      this.gameplayMap.active[y][x] = ' ';
      this.gameplayMap.active[newPosition.y][newPosition.x] = character;
      return true;
    } else {
      return false;
    }
  }
  
};


GameLogic.prototype.moveOnce = function(direction) {
  var moveSuccess = false;
  // Characters closer to the gravitational "floor" move first.
  if (direction === 'up' || direction === 'left'){
    for (var y = 0; y < this.gameplayMap.height; y++) {
      for (var x = 0; x < this.gameplayMap.width; x++) { 
        if (this.attemptMove(direction, x, y)) {
          moveSuccess = true;
        }
      }
    }
  } else if (direction === 'down' || direction === 'right'){
    for (var y = this.gameplayMap.height - 1; y >= 0; y--) {
      for (var x = this.gameplayMap.width - 1; x >= 0; x--) { 
        if (this.attemptMove(direction, x, y)) {
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
  for (var y = 0; y < this.gameplayMap.height; y++) {
    for (var x = 0; x < this.gameplayMap.width; x++) {
      active = this.gameplayMap.active[y][x];
      fixed = this.gameplayMap.fixed[y][x]
      if (active != ' ') {
        var trigger = this.mapKeyLookup(fixed)[active].trigger;
        if (typeof trigger === 'function') {
          results = trigger.call(this, {x: x, y: y});
          if (typeof results === 'string') {
            triggerResults.endState = results;
          }
          triggerResults[active] = {
            x: x,
            y: y,
            eventType: fixed
          };
        }
      }
    }
  }
  return triggerResults;
}

