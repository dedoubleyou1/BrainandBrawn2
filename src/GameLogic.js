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

  // These are functions used by tile triggers
  var triggers = {
    checkWin: function() {
      var otherGoal = indexOf2d(this.gameplayMap.fixed, 'G');
      var otherChar = indexOf2d(this.gameplayMap.active, 'B');
      console.log(otherChar,otherGoal);
      if (otherChar.x == otherGoal.x && otherChar.y == otherGoal.y) {
        return 'missionSuccess';
      }
    }
  };

  var keyLookup = {
    ' ':{
      'b': {isSolid: false, trigger: function(){}},
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
      'B': {isSolid: false, trigger: function(){}}
    },
    '1':{
      'b': {isSolid: false, trigger: function(){}},
      'B': {isSolid: false}
    },
    '2':{
      'b': {isSolid: false, trigger: function(){}},
      'B': {isSolid: false}
    },
    '3':{
      'b': {isSolid: false, trigger: function(){}},
      'B': {isSolid: false}
    },
    '4':{
      'b': {isSolid: false, trigger: function(){}},
      'B': {isSolid: false}
    },
    '9':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '8':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '7':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '6':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    },
    '5':{
      'b': {isSolid: false},
      'B': {isSolid: true}
    }}
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
    'b': [],
    'B': [],
    gravity: direction,
    endState: 'none'
  };

  var results = {
    success: true,
    endState: 'none'
  }
  while (results.success === true) {
    results = this.moveOnce(direction)
  }

  gameStateChanges.endState = results.endState;

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
  var results = {success: false, endState: 'none'};
  // Characters closer to the "floor" move first.
  if (direction === 'up' || direction === 'left'){
    for (var i = 0; i < this.gameplayMap.height; i++) {
      for (var j = 0; j < this.gameplayMap.width; j++) { 
        if (this.attemptMove(direction, j, i)) {
          results.success = true;
        }
      }
    }
  } else if (direction === 'down' || direction === 'right'){
    for (var i = this.gameplayMap.height - 1; i >= 0; i--) {
      for (var j = this.gameplayMap.width - 1; j >= 0; j--) { 
        if (this.attemptMove(direction, j, i)) {
          results.success = true;
        }
      }
    }
  }
  
  var triggerResults = this.checkTriggers();
  if (typeof triggerResults === 'string') {
    results.endState = triggerResults;
  };

  return results;
}
GameLogic.prototype.checkTriggers = function() {
  for (var i = 0; i < this.gameplayMap.height; i++) {
    for (var j = 0; j < this.gameplayMap.width; j++) {
      var active = this.gameplayMap.active[i][j];
      var fixed = this.gameplayMap.fixed[i][j]
      if (active != ' ') {
        var trigger = this.mapKeyLookup(fixed)[active].trigger;
        if (typeof trigger === 'function') {
          var triggerResults = trigger.call(this);
          // Checks if the trigger returns a value that indicates a game ending state.
          if (typeof triggerResults === 'string') {
            return triggerResults;
          }
        }
      }
    }
  }
}





