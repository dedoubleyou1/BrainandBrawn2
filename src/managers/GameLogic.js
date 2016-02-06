/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   ___                         __             _      
  / _ \__ _ _ __ ___   ___    / /  ___   __ _(_) ___ 
 / /_\/ _` | '_ ` _ \ / _ \  / /  / _ \ / _` | |/ __|
/ /_\\ (_| | | | | | |  __/ / /__| (_) | (_| | | (__ 
\____/\__,_|_| |_| |_|\___| \____/\___/ \__, |_|\___|
                                        |___/        

Summary: Manages the game state, independent from graphics and input

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*
  Converts the level data into a format more suitable for gameplay
*/
BnB.GameLogic = function(map) {
    this.gameplayMap = map;

    //populate active map (WHY NOT FIXED?)
    this.activeChars = []
    for (var y = 0; y < this.gameplayMap.height; y++) {
        for (var x = 0; x < this.gameplayMap.width; x++) {
            if (this.gameplayMap.active[y][x] != ' ') {
                this.activeChars.push(this.gameplayMap.active[y][x]);
            } 
        }
    }

    //Shows game map in console if true;
    this.debugMode = BnB.buildType == 'test';

    if (this.debugMode) {
        this.consoleLogMap();
    }
}

/*
  Given: game object key, movement direciton
  Retrun: Data for collision and graphics triggers
*/
BnB.GameLogic.prototype.mapKeyLookup = function(key,direction) {

    // These are functions used by tile triggers. They are passed in the coordinate of the trigger action.
    var triggers = {
        //Called when Brainy collides with a goal
        checkWin: function() {
            //check to see if Brawny is also colliding with a goal
            var otherGoal = BnB.Util.indexOf2d(this.gameplayMap.fixed, 'G');
            var otherChar = BnB.Util.indexOf2d(this.gameplayMap.active, 'B');
            if (otherChar.x == otherGoal.x && otherChar.y == otherGoal.y) {
                //we did it!
                return 'missionSuccess';
            }
        },

        //Called when Brainy collides with a switch
        unlockGates: function(resultSwitch, gate, resultGate) {
            return function(position) {
                //Disable switch
                this.gameplayMap.fixed[position.y][position.x] = resultSwitch;
                
                //Get all connected gates
                BnB.Util.indexOfAll2d(this.gameplayMap.fixed, gate).forEach(function(element) {
                    //Disable connected gate
                    this.gameplayMap.fixed[element.y][element.x] = resultGate;
                }, this);
            };
        },

        //Called when a fixed object shoudld be destroyed
        killFixed: function(position){
            this.gameplayMap.fixed[position.y][position.x] = ' ';
        },

        //Called when an active object shoudld be destroyed
        killActive: function(killType) {
            return function() {
                return killType;
            };
        },

        //UNUSED
        killActiveDirectional: function(killDirection,killType) {
            if(killDirection == direction){
                return function() {
                    return killType;
                };
            }
        }
    };

    var keyLookup = {
        ' ':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '#':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true}
        },
        '|':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '-':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '.':{
          'b': {isSolid: false, trigger: triggers.killActive('brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActive('brawnyLost')},
          '@': {isSolid: false}, 
          '$': {isSolid: false}      
        },
        'E':{
          'b': {isSolid: false, trigger: triggers.killActive('brainyEaten')},
          'B': {isSolid: false, trigger: triggers.killFixed},
          '@': {isSolid: true}, 
          '$': {isSolid: false, trigger: triggers.killFixed}
        },
        'g':{
          'b': {isSolid: false, trigger: triggers.checkWin},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        'G':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '0':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true}
        },
        '1':{
          'b': {isSolid: false, trigger: triggers.unlockGates('2','3','4')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '2':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '3':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true},
          '$': {isSolid: true}
        },
        '4':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '5':{
          'b': {isSolid: false, trigger: triggers.unlockGates('6','7','8')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '6':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '7':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true}
        },
        '8':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '9':{
          'b': {isSolid: false, trigger: triggers.unlockGates('10','11','12')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '10':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '11':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true}
        },
        '12':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '13':{
          'b': {isSolid: false, trigger: triggers.unlockGates('14','15','16')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '14':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '15':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true}
        },
        '16':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },

        //spikes (4-way)
        'X':{
          'b': {isSolid: false, trigger: triggers.killActive('brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActive('brawnyLost')},
          '@': {isSolid: true}, 
          '$': {isSolid: true} 
        },
        //breakable block
        '+':{
          'b': {isSolid: true},
          'B': {isSolid: false, trigger: triggers.killFixed},
          '@': {isSolid: true}, 
          '$': {isSolid: false, trigger: triggers.killFixed},
        },

        //unused
        '^':{
          'b': {isSolid: false, trigger: triggers.killActiveDirectional('down','brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActiveDirectional('down','brawnyLost')},
          '@': {isSolid: false}, 
          '$': {isSolid: false} 
        },
        'V':{
          'b': {isSolid: false, trigger: triggers.killActiveDirectional('up','brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActiveDirectional('up','brawnyLost')},
          '@': {isSolid: false}, 
          '$': {isSolid: false} 
        },
        '>':{
          'b': {isSolid: false, trigger: triggers.killActiveDirectional('left','brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActiveDirectional('left','brawnyLost')},
          '@': {isSolid: false}, 
          '$': {isSolid: false}
        },
        '<':{
          'b': {isSolid: false, trigger: triggers.killActiveDirectional('right','brainyLost')},
          'B': {isSolid: false, trigger: triggers.killActiveDirectional('right','brawnyLost')},
          '@': {isSolid: false}, 
          '$': {isSolid: false} 
        },
    }
    return keyLookup[key];
};


// Display map in console for debugging purposes
BnB.GameLogic.prototype.consoleLogMap = function() {
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





// - - - - - - - - - - - - //
// Gravity Switch Functions
// - - - - - - - - - - - - //

/*
  Given a desired direction, update the game state
*/
BnB.GameLogic.prototype.gravitySwitch = function(direction) {
    //final return object
    var gameStateChanges = {
        'b': [BnB.Util.indexOf2d(this.gameplayMap.active, 'b')],
        'B': [BnB.Util.indexOf2d(this.gameplayMap.active, 'B')],
        '@': [BnB.Util.indexOf2d(this.gameplayMap.active, '@')],
        '$': [BnB.Util.indexOf2d(this.gameplayMap.active, '$')],
        gravity: direction,
        endState: 'none',
        moveSuccess: false,
    };

    //set temporary variables
    var tempResults = {
        moveSuccess: true,
    };
    var thisChar;
    var theseChanges;

    //Attempt a gravity switch - one tile-step at a time
    while (tempResults.moveSuccess === true) {
        //atempt a single move step
        tempResults = this.moveOnce(direction);

        if(tempResults.moveSuccess) gameStateChanges.moveSuccess = true;

        if (typeof tempResults.endState === 'string' && gameStateChanges.endState === 'none') {
            gameStateChanges.endState = tempResults.endState;
        }
        for (var i = this.activeChars.length - 1; i >= 0; i--) {
            thisChar = this.activeChars[i];
            theseChanges = gameStateChanges[thisChar];

            if (typeof tempResults[thisChar] != 'undefined' && typeof theseChanges[theseChanges.length - 1] != 'undefined') {
                if (tempResults[thisChar].x != theseChanges[theseChanges.length - 1].x || tempResults[thisChar].y != theseChanges[theseChanges.length - 1].y) {
                    gameStateChanges[thisChar].push(tempResults[thisChar])          
                }
            }
        };
    }

    //Add final positions
    this.activeChars.forEach(function(element){
        gameStateChanges[element].push(BnB.Util.indexOf2d(this.gameplayMap.active, element));
    }, this)

    if (this.debugMode) {
        console.log(gameStateChanges);
        console.log(direction);
        this.consoleLogMap();
    }

    //return changes to the game state
    return gameStateChanges;
};

/*
  Move all active objects a single cell in the specified direction.
*/
BnB.GameLogic.prototype.moveOnce = function(direction) {
    var moveSuccess = false;

    /* 
        Move all active objects one cell in the chosen direction
        (Characters closer to the gravitational "floor" move first.)
    */
    if (direction === 'up' || direction === 'left'){
        //floor = top or left
        for (var y = 0; y < this.gameplayMap.height; y++) {
            for (var x = 0; x < this.gameplayMap.width; x++) { 
                if (this.attemptMove(direction, x, y)) {
                    moveSuccess = true;
                }
            }
        }
    }
    else if (direction === 'down' || direction === 'right')
    {
        //floor = bottom or right
        for (var y = this.gameplayMap.height - 1; y >= 0; y--) {
            for (var x = this.gameplayMap.width - 1; x >= 0; x--) { 
                if (this.attemptMove(direction, x, y)) {
                    moveSuccess = true;
                }
            }
        }
    }

    //Now that everything is in its "new" position - check all triggers
    var triggerResults = this.checkTriggers(direction);
    triggerResults.moveSuccess = moveSuccess;

    return triggerResults;
}

/*
  Attempt to move a target ACTIVE object in the chosen direction.
*/
BnB.GameLogic.prototype.attemptMove = function(direction, x, y) {

    var character = this.gameplayMap.active[y][x];

    //get new position
    var newPosition = {
        x: BnB.Util.directionLookup[direction].x + x,
        y: BnB.Util.directionLookup[direction].y + y
    };

    if (character != ' ' && this.isPositionClear(character, newPosition.x, newPosition.y)) 
    {
        //Move active char to new spot
        this.gameplayMap.active[y][x] = ' ';
        this.gameplayMap.active[newPosition.y][newPosition.x] = character;
        return true;
    } 

    return false;
};

/*
  Checks whether the chosen XY coord is clear for a specified ACTIVE character
*/
BnB.GameLogic.prototype.isPositionClear = function(character, x, y) {
    if (x < 0 || y < 0 || x >= this.gameplayMap.width || y >= this.gameplayMap.height)
    {
        //Active object is leaving the boundaries

        //- - - - TEMP HACK - - - -//
        //should be a part of triggers
        BnB.C.SPIKEY_DEATH = BnB.C.BOUNDARY_DEATH;
        //- - - END TEMP HACK - - - //

        return false;
    } 
    else if (this.mapKeyLookup(this.gameplayMap.fixed[y][x])[character].isSolid === true || this.gameplayMap.active[y][x] != ' ') 
    {
        //Active object is colliding with something solid

        //- - - - TEMP HACK - - - -//
        //should be a part of triggers
        if(character == '$' || this.gameplayMap.active[y][x] == '$')
        {
            if(character == 'b' || this.gameplayMap.active[y][x] == 'b' || character == 'B' || this.gameplayMap.active[y][x] == 'B')
            {
                BnB.C.SPIKEY_DEATH = true;
            }
        }
        //- - - END TEMP HACK - - - //

        return false;
    }

    //Position is clear!
    return true;
};

/*
    Check for trigger functions that need to activate due to various collisions
    (Collision = overlapping active and fixed objects)
*/
BnB.GameLogic.prototype.checkTriggers = function(direction) {
    var triggerResults = {};
    var active;
    var fixed;
    var results;
    for (var y = 0; y < this.gameplayMap.height; y++) 
    {
        for (var x = 0; x < this.gameplayMap.width; x++) 
        {
            //Get overlapping active + fixed objects at this gridPos
            active = this.gameplayMap.active[y][x];
            fixed = this.gameplayMap.fixed[y][x]

            if (active != ' ') 
            {
                //get trigger for this collision
                var trigger = this.mapKeyLookup(fixed,direction)[active].trigger;
                if (typeof trigger === 'function') 
                {
                    //Call trigger function + setup results
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

