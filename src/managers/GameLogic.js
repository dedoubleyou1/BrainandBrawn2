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

    //populate array of active objects
    this.initializeActiveObjects();

    //Shows game map in console if true;
    this.debugMode = BnB.buildType == 'test';

    if (this.debugMode) {
        this.consoleLogMap();
    }
}

BnB.GameLogic.prototype.initializeActiveObjects = function()
{
    this.activeObjects = [];
    for (var y = 0; y < this.gameplayMap.height; y++) {
        for (var x = 0; x < this.gameplayMap.width; x++) {
            var currentChar = this.gameplayMap.active[y][x];
            if (currentChar != ' ') {
                var activeObj = {
                    type: currentChar,
                    alive: true,
                    gridPos: {x: x, y: y},
                };
                this.activeObjects.push(activeObj);
            } 
        }
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
        unlockGates: function(resultSwitch, gate, resultGate, peg) {
            return function(position) {
                //Disable switch
                this.gameplayMap.fixed[position.y][position.x] = resultSwitch;
                
                //Disable connected gate
                BnB.Util.indexOfAll2d(this.gameplayMap.fixed, gate).forEach(function(element) {
                    this.gameplayMap.fixed[element.y][element.x] = resultGate;
                }, this);

                //Disable connected pegs
                BnB.Util.indexOfAll2d(this.gameplayMap.fixed, peg).forEach(function(element) {
                    this.gameplayMap.fixed[element.y][element.x] = ' ';
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
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        'n':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '#':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        // '|':{
        //   'b': {isSolid: true},
        //   'B': {isSolid: true},
        //   '@': {isSolid: false}, 
        //   '$': {isSolid: false},
        //   'm': {isSolid: false}
        // },
        // '-':{
        //   'b': {isSolid: true},
        //   'B': {isSolid: true},
        //   '@': {isSolid: false}, 
        //   '$': {isSolid: false},
        //   'm': {isSolid: false}
        // },
        '.':{
          'b': {isSolid: false, trigger: triggers.killActive('space')},
          'B': {isSolid: false, trigger: triggers.killActive('space')},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}      
        },
        'E':{
          'b': {isSolid: false, trigger: triggers.killActive('eaten')},
          'B': {isSolid: false, trigger: triggers.killFixed},
          '@': {isSolid: true}, 
          '$': {isSolid: false, trigger: triggers.killFixed},
          'm': {isSolid: true},
        },
        'g':{
          'b': {isSolid: false, trigger: triggers.checkWin},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        'G':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '0':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '1':{
          'b': {isSolid: false, trigger: triggers.unlockGates('2','3','4','17')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '2':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '3':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true},
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '4':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '5':{
          'b': {isSolid: false, trigger: triggers.unlockGates('6','7','8','18')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '6':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '7':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '8':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '9':{
          'b': {isSolid: false, trigger: triggers.unlockGates('10','11','12','19')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '10':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '11':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '12':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '13':{
          'b': {isSolid: false, trigger: triggers.unlockGates('14','15','16','20')},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '14':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },
        '15':{
          'b': {isSolid: true},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '16':{
          'b': {isSolid: false},
          'B': {isSolid: false},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}
        },


        //colored pegs
        '17':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '18':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '19':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },
        '20':{
          'b': {isSolid: false},
          'B': {isSolid: true},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true}
        },


        //spikes (4-way)
        'X':{
          'b': {isSolid: false, trigger: triggers.killActive('spikey')},
          'B': {isSolid: false, trigger: triggers.killActive('spikey')},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: true} 
        },
        //breakable block
        '+':{
          'b': {isSolid: true},
          'B': {isSolid: false, trigger: triggers.killFixed},
          '@': {isSolid: true}, 
          '$': {isSolid: false, trigger: triggers.killFixed},
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
    this.gameStateChanges = {
        activeChanges: [],
        gravity: direction,
        endState: 'none',
        moveSuccess: false,
    };
    this.populateActiveChanges();

    //set temporary variables
    var stepResults = {
        moveSuccess: true,
    };

    //Attempt a gravity switch - one tile-step at a time
    while (stepResults.moveSuccess === true) {
        //atempt a single move step
        stepResults = this.stepOnce(direction);

        if(stepResults.moveSuccess) this.gameStateChanges.moveSuccess = true;
    }

    //Add final positions
    for(var i=0; i<this.activeObjects.length;i++)
    {
        var element = this.activeObjects[i];
        if(element.gridPos.x != -1 && element.gridPos.y != -1){
            this.gameStateChanges.activeChanges[i].push(element.gridPos);
        }
    }

    if (this.debugMode) {
        console.log(this.gameStateChanges);
        console.log(direction);
        this.consoleLogMap();
    }

    //return changes to the game state
    return this.gameStateChanges;
};

BnB.GameLogic.prototype.populateActiveChanges = function()
{
    for(var i=0;i<this.activeObjects.length;i++)
    {
        //array to hold all significant grid positions
        var positions = [];

        //add initial position
        positions.push(this.activeObjects[i].gridPos);

        //push to main array
        this.gameStateChanges.activeChanges.push(positions);
    }
}

/*
  Move all active objects a single cell in the specified direction.
*/
BnB.GameLogic.prototype.stepOnce = function(direction) {
    var moveSuccess = false;
    var stepResults = {};

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

    //Now that everything is in its "new" position - check all fixed triggers
    this.checkFixedTriggers(direction,stepResults);
    stepResults.moveSuccess = moveSuccess;

    return stepResults;
}

/*
  Attempt to move a target ACTIVE object in the chosen direction.
*/
BnB.GameLogic.prototype.attemptMove = function(direction, x, y) {
    //cget active character at specified location
    var character = this.gameplayMap.active[y][x];
    if(character == ' ') return false;

    //get index of active object
    var target = this.getActiveObjectAtGridPos(x,y);
    if(target == -1) return false;

    //get new position
    var newPosition = {
        x: BnB.Util.directionLookup[direction].x + x,
        y: BnB.Util.directionLookup[direction].y + y
    };

    if (this.isPositionClear(character, target, newPosition.x, newPosition.y)) 
    {
        //Move active char to new spot
        this.gameplayMap.active[y][x] = ' ';
        this.gameplayMap.active[newPosition.y][newPosition.x] = character;
        
        this.activeObjects[target].gridPos = newPosition;

        return true;
    } 

    return false;
};

/*
  Checks whether the chosen XY coord is clear for a specified ACTIVE character
*/
BnB.GameLogic.prototype.isPositionClear = function(character, target, x, y) {
    //First check if we are in bounds
    if (x < 0 || y < 0 || x >= this.gameplayMap.width || y >= this.gameplayMap.height)
    {
        //Active object is leaving the boundaries

        //- - - - TEMP HACK - - - -//
        //should be a part of triggers
        if(BnB.C.BOUNDARY_DEATH){
            var end = this.gameStateChanges.endState;
            if (end == 'none') {
                if(character == 'b'){
                    this.gameStateChanges.endState = 'brainySpace';
                }
                else if(character == 'B'){
                    this.gameStateChanges.endState = 'brawnySpace';
                }
            }
            else if(end == 'brawnySpace' || end == 'brainySpace'){
                this.gameStateChanges.endState = 'bothSpace';
            }
        }
        //- - - END TEMP HACK - - - //

        return false;
    } 
    else if (this.mapKeyLookup(this.gameplayMap.fixed[y][x])[character].isSolid === true) 
    {
        //Active object is colliding with something
        return false;
    }
    else if(this.gameplayMap.active[y][x] != ' ')
    {
        //colliding with another active object
        return this.checkActiveTriggers(character,target,this.gameplayMap.active[y][x],x,y);
    }

    //Position is clear!
    return true;
};


/*
    active1 - object moving INTO the specified cell
    active2 - object already in the specified cell (should have stopped moving)
*/
BnB.GameLogic.prototype.checkActiveTriggers = function(active1,active1Index,active2,x,y)
{
    //- - - - TEMP HACK - - - -//
    //TODO: work this functionality into TRIGGERS
    if((active1 == '$' || active2 == '$') && (active1 == 'b' || active2 == 'b' || active1 == 'B' || active2 == 'B'))
    {
        //purple moving alien
        if (this.gameStateChanges.endState === 'none') {
            this.gameStateChanges.endState = 'spikey';
        }
        return true;
    }
    else if(active1 == 'm' || active2 == 'm')
    {
        //green moving alien
        if(active1 == 'b' || active2 == 'b')
        {
            if (this.gameStateChanges.endState === 'none') {
                this.gameStateChanges.endState = 'eaten';
            }
            return true;
        }
        else if(active1 == 'B' || active1 == '$')
        {
            //Brawny moving into green alien

            //add final position for killed active2
            var active2Index = this.getActiveObjectAtGridPos(x,y);
            this.gameStateChanges.activeChanges[active2Index].push({x,y});
            this.killActiveObj(active2Index);

            //add "kill" event for killer
            this.gameStateChanges.activeChanges[active1Index].push({
                x: x,
                y: y,
                eventType: active2,
                killTarget: active2Index,
            });
            
            return true;
        }
        else if(active2 == 'B' || active2 == '$'){
            //add "kill" event to killed
            this.gameStateChanges.activeChanges[active1Index].push({
                x: x,
                y: y,
                eventType: active2,
                killTarget: active1Index,
            });

            //push final coordinates a second time
            this.gameStateChanges.activeChanges[active1Index].push({x,y});

            this.killActiveObj(active1Index);

            return false;
        }
    }

    return false;
    //- - - END TEMP HACK - - - //
}

/*
    Check for trigger functions that need to activate due to various collisions
    (Collision = overlapping active and fixed objects)
*/
BnB.GameLogic.prototype.checkFixedTriggers = function(direction,stepResults) {
    

    for(var i=0;i<this.activeObjects.length;i++)
    {
        var activeObj = this.activeObjects[i];

        if(!activeObj.alive) return;

        var x = activeObj.gridPos.x;
        var y = activeObj.gridPos.y;

        var fixed = this.gameplayMap.fixed[y][x];

        //get trigger for this collision
        var trigger = this.mapKeyLookup(fixed,direction)[activeObj.type].trigger;
        if (typeof trigger === 'function') 
        {
            //Call trigger function + setup results
            results = trigger.call(this, {x: x, y: y});
            
            if (typeof results === 'string' && this.gameStateChanges.endState === 'none') {
                this.gameStateChanges.endState = results;
            }

            //update game state changes
            var newGridPos = {
                x: x,
                y: y,
                eventType: fixed
            };
            this.gameStateChanges.activeChanges[i].push(newGridPos);
        }
    }
}

BnB.GameLogic.prototype.getActiveObjectAtGridPos = function(gridX,gridY)
{
    for(var i=0;i<this.activeObjects.length;i++)
    {
        var activeObj = this.activeObjects[i];
        if(activeObj.alive && activeObj.gridPos.x == gridX && activeObj.gridPos.y == gridY)
        {
            return i;
        }
    }

    //something went wrong
    return -1;
}

BnB.GameLogic.prototype.killActiveObj = function(target)
{
    if(target >= 0 && target < this.activeObjects.length)   
    {
        var obj = this.activeObjects[target];
        obj.alive = false;
        this.gameplayMap.active[obj.gridPos.y][obj.gridPos.x] = ' ';
        obj.gridPos = {x:-1,y:-1};
    }
}

