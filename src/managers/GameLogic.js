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
};

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
};

/*
  Given: game object key, movement direciton
  Retrun: Data for collision and graphics triggers
*/
BnB.GameLogic.prototype.mapKeyLookup = function(key) {

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

        //Called when a fixed object kills an active obj
        killActive: function(position,activeIndex){
            //add "kill" event to moving
            this.gameStateChanges.activeChanges[activeIndex].push({
                x: position.x,
                y: position.y,
                eventType: this.gameplayMap.fixed[position.y][position.x],
                killTarget: activeIndex,
                fired: false,
            });

            this.killActiveObj(activeIndex,position);
        },

        //Called when Brainy or Brawny is killed
        killHero: function(killType) {
            return function(position,activeIndex) {
                this.killActiveObj(activeIndex,position);
                return killType;
            };
        },

        //Active-Active -> kill active1 (moving)
        killActiveMover: function(position,active1Index,active1,active2) {
            //add "kill" event to moving
            this.gameStateChanges.activeChanges[active1Index].push({
                x: position.x,
                y: position.y,
                eventType: active2,
                killTarget: active1Index,
                fired: false,
            });

            this.killActiveObj(active1Index,position);

            return 'death';
        },

        //Active-Active -> Kill active2 (stationary)
        killActiveStationary: function(position,active1Index,active1,active2) {
            var active2Index = this.getIndexOfActiveObj(position.x,position.y);

            //add "kill" event for killer
            this.gameStateChanges.activeChanges[active1Index].push({
                x: position.x,
                y: position.y,
                eventType: active2,
                killTarget: active2Index,
                fired: false,
            });

            this.killActiveObj(active2Index,position);

            return 'clear';
        },
    };

    var keyLookup = {
        //ACTIVE chars
        'b':{
            'b': {isSolid: true},//impossible
            'B': {isSolid: true},
            '@': {isSolid: true}, 
            '$': {isSolid: false, trigger: triggers.killHero('spikey')},
            'm': {isSolid: false, trigger: triggers.killHero('eaten')},
        },
        'B':{
            'b': {isSolid: true},
            'B': {isSolid: true},//impossible
            '@': {isSolid: true}, 
            '$': {isSolid: false, trigger: triggers.killHero('spikey')},
            'm': {isSolid: false, trigger: triggers.killActiveMover}
        },
        '@':{
            'b': {isSolid: true},
            'B': {isSolid: true},
            '@': {isSolid: true}, 
            '$': {isSolid: true},
            'm': {isSolid: true}
        },
        '$':{
            'b': {isSolid: false, trigger: triggers.killHero('spikey')},
            'B': {isSolid: false, trigger: triggers.killHero('spikey')},
            '@': {isSolid: true}, 
            '$': {isSolid: true},
            'm': {isSolid: false, trigger: triggers.killActiveMover}
        },
        'm':{
            'b': {isSolid: false, trigger: triggers.killHero('eaten')},
            'B': {isSolid: false, trigger: triggers.killActiveStationary},
            '@': {isSolid: true}, 
            '$': {isSolid: false, trigger: triggers.killActiveStationary},
            'm': {isSolid: true}
        },


        //FIXED chars
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
          'b': {isSolid: false, trigger: triggers.killHero('space')},
          'B': {isSolid: false, trigger: triggers.killHero('space')},
          '@': {isSolid: false}, 
          '$': {isSolid: false},
          'm': {isSolid: false}      
        },
        'E':{
          'b': {isSolid: false, trigger: triggers.killHero('eaten')},
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
          'b': {isSolid: false, trigger: triggers.killHero('spikey')},
          'B': {isSolid: false, trigger: triggers.killHero('spikey')},
          '@': {isSolid: true}, 
          '$': {isSolid: true},
          'm': {isSolid: false, trigger: triggers.killActive} 
        },
        //breakable block
        '+':{
          'b': {isSolid: true},
          'B': {isSolid: false, trigger: triggers.killFixed},
          '@': {isSolid: true}, 
          '$': {isSolid: false, trigger: triggers.killFixed},
          'm': {isSolid: true}
        },
    };
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
        if(this.gameStateChanges.endState != 'none') break;
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
};

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
    this.checkFixedTriggers(stepResults);
    stepResults.moveSuccess = moveSuccess;

    return stepResults;
};

/*
  Attempt to move a target ACTIVE object in the chosen direction.
*/
BnB.GameLogic.prototype.attemptMove = function(direction, x, y) {
    //1. get active activeChar at specified location
    var activeChar = this.gameplayMap.active[y][x];
    if(activeChar == ' ') return false;

    //2. get index of active object
    var activeIndex = this.getIndexOfActiveObj(x,y);
    if(activeIndex == -1){
        //This active object is dead.
        return false;
    }

    //3. get new position
    var newPosition = {
        x: BnB.Util.directionLookup[direction].x + x,
        y: BnB.Util.directionLookup[direction].y + y
    };

    //4. Check for collisions (clear, death, blocked)
    var activeResult = this.isPositionClear(activeChar, activeIndex, newPosition.x, newPosition.y)

    if(activeResult == 'blocked'){
        //activeChar was blocked - move failed
        return false;
    }

    //Remove activeChar from old gridPos
    this.gameplayMap.active[y][x] = ' ';

    if(activeResult == 'clear'){
        //get activeChar at new gridPos
        var oldChar = this.gameplayMap.active[newPosition.y][newPosition.x];

        //If not green alien moving into death
        if(activeChar != 'm' || (oldChar!='B' && oldChar!='$')){
            this.gameplayMap.active[newPosition.y][newPosition.x] = activeChar;
            this.activeObjects[activeIndex].gridPos = newPosition;
        }
    }

    return true;
};

/*
  Checks whether the chosen XY coord is clear for a specified ACTIVE character
*/
BnB.GameLogic.prototype.isPositionClear = function(activeChar, activeIndex, x, y) {
    //Check Bounds
    if (x < 0 || y < 0 || x >= this.gameplayMap.width || y >= this.gameplayMap.height)
    {
        //- - - - TEMP HACK - - - -//
        //should be a part of triggers
        if(BnB.C.BOUNDARY_DEATH){
            //Deal with hero death
            var end = this.gameStateChanges.endState;
            if (end == 'none') {
                if(activeChar == 'b'){
                    this.gameStateChanges.endState = 'brainySpace';
                }
                else if(activeChar == 'B'){
                    this.gameStateChanges.endState = 'brawnySpace';
                }
            }
            else if((end == 'brawnySpace' && activeChar == 'b') || end == 'brainySpace' && activeChar == 'B'){
                this.gameStateChanges.endState = 'bothSpace';
            }

            //TEMP HACK - will replace with cleaner method
            //Send activeObj to an offscreen coordinate
            var buffer = 3;
            if(x < 0) x = -buffer;
            if(y < 0) y = -buffer*2;
            if(x >= this.gameplayMap.width) x = this.gameplayMap.width+buffer;
            if(y >= this.gameplayMap.height) y = this.gameplayMap.height+buffer;
            //END TEMP HACK

            //Kill in Logic
            this.killActiveObj(activeIndex,{x:x,y:y});
        }
        //- - - END TEMP HACK - - - //

        return 'blocked';
    }

    //Check for a solid fixed object
    if (this.mapKeyLookup(this.gameplayMap.fixed[y][x])[activeChar].isSolid === true) 
    {
        return 'blocked';
    }

    //Check active-active collisions
    if(this.gameplayMap.active[y][x] != ' ')
    {
        //colliding with another active object
        return this.checkActiveTriggers(activeChar,activeIndex,this.gameplayMap.active[y][x],x,y);
    }

    //Position is clear!
    return 'clear';
};

BnB.GameLogic.prototype.checkActiveTriggers = function(active1,active1Index,active2,x,y)
{
    if(this.mapKeyLookup(active2)[active1].isSolid === true){
        return 'blocked';
    }

    //get trigger for this collision
    var trigger = this.mapKeyLookup(active2)[active1].trigger;
    if (typeof trigger === 'function') 
    {
        //Call trigger function + setup results
        var results = trigger.call(this,{x: x, y: y},active1Index,active1,active2);
        
        if (typeof results === 'string') {
            if(results == 'clear' || results == 'death'){
                return results;
            }
            
            //otherwise - brainy/brawny just died
            if(this.gameStateChanges.endState === 'none'){
                this.gameStateChanges.endState = results;
            }
        }
    }

    return 'clear';
};

/*
    Check for trigger functions that need to activate due to various collisions
    (Collision = overlapping active and fixed objects)
*/
BnB.GameLogic.prototype.checkFixedTriggers = function(stepResults) {
    for(var i=0;i<this.activeObjects.length;i++)
    {
        var activeObj = this.activeObjects[i];

        if(!activeObj.alive) continue;

        var x = activeObj.gridPos.x;
        var y = activeObj.gridPos.y;

        var fixed = this.gameplayMap.fixed[y][x];

        //get trigger for this collision
        var trigger = this.mapKeyLookup(fixed)[activeObj.type].trigger;
        if (typeof trigger === 'function') 
        {
            //Call trigger function + setup results
            results = trigger.call(this, {x: x, y: y},i);
            
            if (typeof results === 'string' && this.gameStateChanges.endState === 'none') {
                this.gameStateChanges.endState = results;
            }

            //add trigger to gameStateChanges
            var newGridPos = {
                x: x,
                y: y,
                eventType: fixed,
                fired: false,
            };
            this.gameStateChanges.activeChanges[i].push(newGridPos);
        }
    }
};

/*
    Given: gridX and gridY
    Return the index of an activeObj
*/
BnB.GameLogic.prototype.getIndexOfActiveObj = function(gridX,gridY)
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
};

/*
    Given: Index of an active object
    Kill target active object
*/
BnB.GameLogic.prototype.killActiveObj = function(targetIndex,position,isMovingDeath)
{
    //check range of index
    if(targetIndex < 0 || targetIndex >= this.activeObjects.length) return;
    
    //push final coordinates
    this.gameStateChanges.activeChanges[targetIndex].push({
        x: position.x,
        y: position.y,
    });

    var obj = this.activeObjects[targetIndex];
    obj.alive = false;
    this.gameplayMap.active[obj.gridPos.y][obj.gridPos.x] = ' ';
    obj.gridPos = {x:-1,y:-1};
};

