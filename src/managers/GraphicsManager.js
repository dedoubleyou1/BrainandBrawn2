/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   ___                 _     _                                                     
  / _ \_ __ __ _ _ __ | |__ (_) ___ ___    /\/\   __ _ _ __   __ _  __ _  ___ _ __ 
 / /_\/ '__/ _` | '_ \| '_ \| |/ __/ __|  /    \ / _` | '_ \ / _` |/ _` |/ _ \ '__|
/ /_\\| | | (_| | |_) | | | | | (__\__ \ / /\/\ \ (_| | | | | (_| | (_| |  __/ |   
\____/|_|  \__,_| .__/|_| |_|_|\___|___/ \/    \/\__,_|_| |_|\__,_|\__, |\___|_|   
                |_|                                                |___/      

Summary: Handles all graphical updates (based on game state changes)

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*
  Constructor for initializing Graphics Manager
*/
BnB.GraphicsManager = function(map) {
    this.active = {};
    this.fixed = [];

    //Set grid dimensions
    this.gridWidth = map.width;
    this.gridHeight = map.height;

    //set up groups to hold SPRITE objects
    // var levelGroup = game.add.group();
    // levelGroup.enableBody = true;
    this.backgroundGroup = game.add.group(); //floor layer
    this.mainGroup = game.add.group(); //holds everything
    this.mainGroup.enableBody = true;

    //Get graphics conversion values
    this.convertValues = this.getConvertValues();
    
    //initialize sprites
    this.initializeSprites(map);

    //used to track 
    this.animationCounter = 0
    this.gravityDirection;
}

/*
  Given: a game object key
  Return: Data for display with visual trigger functions
*/
BnB.GraphicsManager.prototype.graphicsKeyLookup = function(key) {
    var triggers = {
        killSelf: function(position) {
            if(this.fixed[position.y][position.x].type == 'E'){
                BnB.Util.playSound('kill');
            }
            this.fixed[position.y][position.x].sprite.destroy();
        },
        switchTo: function(type) {
            return function(position) {
                this.fixed[position.y][position.x].sprite.frameName = this.graphicsKeyLookup(type).image;
            };
        },
        switchAll: function(type, typeTo) {
            var context = {
                type: type,
                typeTo: typeTo
            };
            return function() {
                var foundObjects = BnB.Util.filter2d(this.fixed, function(element) {
                    if (element.type === this.type) {
                        return true;
                    }
                }, context);

                for (var i = 0; i < foundObjects.length; i++) {
                    foundObjects[i].sprite.frameName = this.graphicsKeyLookup(typeTo).image;
                };
            };
        },
        switchBoth: function(typeSelf, typeOther, typeToOther,typePeg) {
            var context = {
                type: typeOther,
                typeTo: typeToOther,
                typePeg: typePeg
            };
            return function(position) {
                BnB.Util.playSound('switch');
                this.fixed[position.y][position.x].sprite.frameName = this.graphicsKeyLookup(typeSelf).image;

                //get gates
                var foundObjects = BnB.Util.filter2d(this.fixed, function(element){
                    if (element.type === this.type) {
                        return true;
                    }
                }, context);

                //disable gates
                for (var i = 0; i < foundObjects.length; i++) {
                    foundObjects[i].sprite.frameName = this.graphicsKeyLookup(typeToOther).image;
                };

                //get pegs
                var foundPegs = BnB.Util.filter2d(this.fixed, function(element){
                    if (element.type === this.typePeg) {
                        return true;
                    }
                }, context);

                //disable gates
                for (var i = 0; i < foundPegs.length; i++) {
                    foundPegs[i].sprite.destroy();
                };
            };
        }
    }

    var keyLookup = {
        'b':{
          order: 2,
          image: 'SpriteSheet0000',
          'b': {},
          'B': {}
        },
        'B':{
          order: 4,
          image: 'SpriteSheet0000',
          'b': {},
          'B': {}
        },
        ' ':{
          'b': {},
          'B': {}
        },
        '#':{
          order: 0,
          image: 'brainandbrawn_block',
          'b': {},
          'B': {}
        },
        '.':{
          order: 0,
          'b': {},
          'B': {}      
        },
        'E':{
          order: 3,
          image: 'brainandbrawn_alien-b',
          'b': {},
          'B': triggers.killSelf,
          '$': triggers.killSelf
        },
        'g':{
          order: 0,
          image: 'brainandbrawn_goalBrainy',
          'b': {},
          'B': {}
        },
        'G':{
          order: 0,
          image: 'brainandbrawn_goalBrawny',
          'b': {},
          'B': {}
        },
        '0':{
          order: 0,
          image: 'brainandbrawn_pipe0',
          'b': {},
          'B': {}
        },
        '1':{
          order: 0,
          image: 'brainandbrawn_switchNew1A',
          'b': triggers.switchBoth('2', '3', '4','17'),
          'B': {}
        },
        '2':{
          order: 0,
          image: 'brainandbrawn_switchNew1B',
          'b': {},
          'B': {}
        },
        '3':{
          order: 0,
          image: 'brainandbrawn_gateNew1C',
          'b': {},
          'B': {}
        },
        '4':{
          order: 0,
          image: 'brainandbrawn_gateNew1D',
          'b': {},
          'B': {}
        },
        '5':{
          order: 0,
          image: 'brainandbrawn_switchNew2A',
          'b': triggers.switchBoth('6', '7', '8','18'),
          'B': {}
        },
        '6':{
          order: 0,
          image: 'brainandbrawn_switchNew2B',
          'b': {},
          'B': {}
        },
        '7':{
          order: 0,
          image: 'brainandbrawn_gateNew2C',
          'b': {},
          'B': {}
        },
        '8':{
          order: 0,
          image: 'brainandbrawn_gateNew2D',
          'b': {},
          'B': {}
        },
        '9':{
          order: 0,
          image: 'brainandbrawn_switchNew3A',
          'b': triggers.switchBoth('10', '11', '12','19'),
          'B': {}
        },
        '10':{
          order: 0,
          image: 'brainandbrawn_switchNew3B',
          'b': {},
          'B': {}
        },
        '11':{
          order: 0,
          image: 'brainandbrawn_gateNew3C',
          'b': {},
          'B': {}
        },
        '12':{
          order: 0,
          image: 'brainandbrawn_gateNew3D',
          'b': {},
          'B': {}
        },
        '13':{
          order: 0,
          image: 'brainandbrawn_switchNew4A',
          'b': triggers.switchBoth('14', '15', '16','20'),
          'B': {}
        },
        '14':{
          order: 0,
          image: 'brainandbrawn_switchNew4B',
          'b': {},
          'B': {}
        },
        '15':{
          order: 0,
          image: 'brainandbrawn_gateNew4C',
          'b': {},
          'B': {}
        },
        '16':{
          order: 0,
          image: 'brainandbrawn_gateNew4D',
          'b': {},
          'B': {}
        },

        //colored pegs (TEST)
        '17':{
          order: 0,
          image: 'brainandbrawn_coloredPeg1',
          'b': {},
          'B': {}
        },
        '18':{
          order: 0,
          image: 'brainandbrawn_coloredPeg2',
          'b': {},
          'B': {}
        },
        '19':{
          order: 0,
          image: 'brainandbrawn_coloredPeg3',
          'b': {},
          'B': {}
        },
        '20':{
          order: 0,
          image: 'brainandbrawn_coloredPeg4',
          'b': {},
          'B': {}
        },


        //spikes
        'X':{
          order: 0,
          image: 'brainandbrawn_alien2',
          'b': {},
          'B': {}
        },
        '+':{
          order: 0,
          image: 'brainandbrawn_wallDamaged',
          'b': {},
          'B': triggers.killSelf,
          '$': triggers.killSelf
        },
        '^':{
          order: 0,
          image: 'brainandbrawn_switchNew1A',
          'b': {},
          'B': {}
        },
        'V':{
          order: 0,
          image: 'brainandbrawn_switchNew2A',
          'b': {},
          'B': {}
        },
        '<':{
          order: 0,
          image: 'brainandbrawn_switchNew3A',
          'b': {},
          'B': {}
        },
        '>':{
          order: 0,
          image: 'brainandbrawn_switchNew4A',
          'b': {},
          'B': {}
        },
        '@':{
          order: 3,
          image: 'brainandbrawn_slidingBlock',
          'b': {},    
          'B': {}
        },
        '$':{
          order: 0,
          image: 'brainandbrawn_alien3',
          'b': {},
          'B': {}
        },
    }

    return keyLookup[key];
}

/*
  Loop through map grid and add sprites to the game (layer by layer)
*/
BnB.GraphicsManager.prototype.initializeSprites = function(map) {
    for (var y = 0; y < map.height; y++) {
        this.fixed[y] = [];
        for (var x = 0; x < map.width; x++) {
            //get active sprite key
            var activeSpriteType = map.active[y][x];
            var activeCoordinate = this.gridToPixel({x: x, y: y})

            //Add the FLOOR
            var bgSpriteHolder = game.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', 'brainandbrawn_floor');
            this.backgroundGroup.add(bgSpriteHolder);
            bgSpriteHolder.anchor = {x: 0.5, y: 0.5};
            bgSpriteHolder.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
            

            //If there is an active object...
            if (activeSpriteType != ' ') {
                //Choose the spritesheet to draw from
                var spritesheet;
                if (activeSpriteType === 'b') {
                    spritesheet = 'brainy_SpriteSheet';
                } else if (activeSpriteType === 'B') {
                    spritesheet = 'brawny_SpriteSheet';
                } else {
                    spritesheet = 'spritesheet';
                }
                
                //Set up the ACTIVE sprite
                this.active[activeSpriteType] = game.add.sprite(activeCoordinate.x, activeCoordinate.y, spritesheet, this.graphicsKeyLookup(activeSpriteType).image);
                this.mainGroup.add(this.active[activeSpriteType]);
                this.active[activeSpriteType].scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
                this.active[activeSpriteType].anchor = {x: 0.5, y: 0.5};
                this.active[activeSpriteType].customZ = y * 10 + this.graphicsKeyLookup(activeSpriteType).order;
                this.active[activeSpriteType].priority = true;
                

                //If Brainy or Brawny - set up animations
                if (activeSpriteType === 'b' || activeSpriteType === 'B') {
                    this.active[activeSpriteType].animations.add('moveRight', Phaser.Animation.generateFrameNames('SpriteSheet', 0, 10, '', 4), 24, false, false);
                    this.active[activeSpriteType].animations.add('moveDown', Phaser.Animation.generateFrameNames('SpriteSheet', 20, 30, '', 4), 24, false, false);
                    this.active[activeSpriteType].animations.add('moveUp', Phaser.Animation.generateFrameNames('SpriteSheet', 40, 50, '', 4), 24, false, false);
                }
            }

            //Set the fixed char at this gridPos
            this.fixed[y][x] = {
                type: map.fixed[y][x]
            };

            //Add the fixed sprite
            var fixedLookup = this.graphicsKeyLookup(map.fixed[y][x]);
            if (typeof fixedLookup.image === 'string') {
                this.fixed[y][x].sprite = game.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', fixedLookup.image);
                this.mainGroup.add(this.fixed[y][x].sprite);
                this.fixed[y][x].sprite.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
                this.fixed[y][x].sprite.anchor = {x: 0.5, y: 0.5};
                this.fixed[y][x].sprite.customZ = y * 10 + fixedLookup.order;
                this.fixed[y][x].sprite.priority = false;
            }
        }
    }
};

/*
    Uses MAP dimensions and SCREEN size to determine graphics scaling values:
    -fitType ('height' or 'width')
    -scaledTileSize
    -spriteScale
    -borderX & borderY
*/
BnB.GraphicsManager.prototype.getConvertValues = function() {
    var convertValues = {
        //Determine the size of the "play space"
        w: BnB.C.WIDTH-BnB.C.BORDER_X*2,
        h: game.height-BnB.C.HUD_HEIGHT-BnB.C.BOTTOM_HUD_HEIGHT,
    };

    //get screen and grid ratios
    var screenRatio = convertValues.w / convertValues.h;
    var levelRatio = (this.gridWidth + 0.5) / (this.gridHeight + 0.5); 
    
    //TODO: account for difference between height and width of individual cells

    //Determine fit type and scaling
    if (screenRatio > levelRatio) {
        //base on level height
        convertValues.fitType = 'height';
        convertValues.scaledTileSize = convertValues.h/ this.gridHeight;
    } else {
        // base on level width
        convertValues.fitType = 'width';
        convertValues.scaledTileSize = convertValues.w / this.gridWidth;
    }
    
    //set remaining values
    convertValues.spriteScale = Math.ceil(convertValues.scaledTileSize) / BnB.C.TILESIZE;
    convertValues.scaledTileSize = Math.floor(convertValues.scaledTileSize);
    convertValues.borderX = (convertValues.w - this.gridWidth*convertValues.scaledTileSize)/2 + BnB.C.BORDER_X;
    convertValues.borderY = (convertValues.h - this.gridHeight*convertValues.scaledTileSize)/2 + BnB.C.HUD_HEIGHT;

    return convertValues;
};

/*
  Given: grid coord
  Return: screen coord
*/
BnB.GraphicsManager.prototype.gridToPixel = function(coordinate) {
    //Math.floor((BnB.C.TILESIZE + BnB.C.TILESIZE) * (coordinate.x + 0.5) / 2)
    return {
        x: Math.round(this.convertValues.borderX + ((coordinate.x + 0.5) * this.convertValues.scaledTileSize)),
        y: Math.round(this.convertValues.borderY + ((coordinate.y + 0.5) * this.convertValues.scaledTileSize))
    }    
};

/*
  Given: screen coord
  Return: grid coord
*/
BnB.GraphicsManager.prototype.pixelToGrid = function(coordinate) {
  return {
    x: Math.floor((coordinate.x - (this.convertValues.borderX)) / this.convertValues.scaledTileSize),
    // y: Math.floor((coordinate.y - (this.convertValues.borderY)) / this.convertValues.scaledTileSize)
    y: Math.floor((coordinate.y - this.convertValues.borderY) / this.convertValues.scaledTileSize)
  }
}

/*
  Sets offset for previewing drag direction by changing anchor. amount should be a number between -1 and 1.
*/
BnB.GraphicsManager.prototype.setActiveOffset = function(direction, amount) {
    var offsetX = 0.5;
    var offsetY = 0.5;

    if (direction === 'left' || direction === 'right'){
        offsetX = 0.5 - (amount * 0.25);
    } else if (direction === 'up' || direction === 'down'){
        offsetY = 0.5 - (amount * 0.25);
    }

    for (element in this.active) {
        this.active[element].anchor = {x: offsetX, y: offsetY};
        //console.log(element, element.anchor);
    }
}

/*
  Given: game state changes
  Update all graphics to communicate game state changes
  (called every step)
*/
BnB.GraphicsManager.prototype.updateGraphics = function(gameStateChanges) {
    this.gravityDirection = gameStateChanges.gravity;

    //Callback - called every frame of movement tweens
    var checkGraphicalTriggers = function(gameStateChanges, element){
        return function() {
            var gridPos = this.pixelToGrid({x: this.active[element].x, y: this.active[element].y});
            for (var i = 1; i < gameStateChanges[element].length - 1; i++) 
            {
                if (gameStateChanges[element][i].x === gridPos.x && gameStateChanges[element][i].y === gridPos.y) 
                {
                    //get graphical trigger and call it
                    var trigger = this.graphicsKeyLookup(gameStateChanges[element][i].eventType)[element];
                    if (typeof trigger === 'function') {
                        results = trigger.call(this, {x: gridPos.x, y: gridPos.y});
                    }
                }

            };
            //console.log(gameStateChanges, element, gridPos);
        }
    };

    //loop through char element in this.active array
    for (element in this.active) {
        console.log(element);

        //get ending position
        var finalGridPos = gameStateChanges[element][gameStateChanges[element].length - 1];
        var finalPixelPos = this.gridToPixel(finalGridPos);

        //get distance (in cells) between two grid coordinates
        var gridDist = BnB.Util.pointDist(gameStateChanges.gravity, gameStateChanges[element][0], finalGridPos);

        //Tween sprite to CENTER of cell?
        recenter = game.add.tween(this.active[element].anchor);
        recenter.to({x: 0.5, y: 0.5}, 180, Phaser.Easing.Sinusoidal.In, true);

        //If the active element must move at least one cell - animate it
        if (gridDist > 0) {
            //create movement tween
            var moveTween = game.add.tween(this.active[element]);
            moveTween.to({x: finalPixelPos.x, y: finalPixelPos.y}, 180, Phaser.Easing.Sinusoidal.In, true);

            //If active obj is Brainy or Brawny - run animations
            if (element === 'b' || element === 'B'){
                if (this.active[element].x - finalPixelPos.x < 0) {
                    this.active[element].scale.x = Math.abs(this.active[element].scale.x); //Reset flip
                    this.active[element].animations.play('moveRight');
                } else if (this.active[element].x - finalPixelPos.x > 0){
                    this.active[element].scale.x = -1 * Math.abs(this.active[element].scale.x); //Flip animation
                    this.active[element].animations.play('moveRight'); 
                } else if (this.active[element].y - finalPixelPos.y < 0){
                    this.active[element].animations.play('moveDown'); 
                } else if (this.active[element].y - finalPixelPos.y > 0){
                    this.active[element].animations.play('moveUp'); 
                }
            }

            //keep track of how many tweens need to run
            this.animationCounter += 1;

            //get moveUpdatecallback
            var moveUpdateCallback = checkGraphicalTriggers(gameStateChanges, element);
            
            //set up callback for when moveTween finishes
            moveTween.onComplete.add((function(moveUpdateCallback){
                return function(){
                  moveUpdateCallback.call(this);
                  this.animationCounter -= 1;
                }
            })(moveUpdateCallback), this);

            //set up callbakc for WHILE tween is playing
            moveTween.onUpdateCallback(moveUpdateCallback, this)
        }
    };

};

/*
  -Called at the start of each update step
  -Sorts graphics Z order
*/
BnB.GraphicsManager.prototype.refresh = function() {
    for (element in this.active) {
      this.active[element].customZ = ((this.active[element].y - (this.convertValues.borderY)) / this.convertValues.scaledTileSize) * 10 + this.graphicsKeyLookup(element).order;
    };
    this.mainGroup.sort('customZ', Phaser.Group.SORT_ASCENDING)

    // this.mainGroup.customSort(function(childA, childB){
    //   return 0;
    // });

    // this.mainGroup.customSort(function(child1, child2) {
    //   // var child1YOffset = 1;
    //   // var child2YOffset = 1;
    //   // if (child1.priority === true) {
    //   //   child1YOffset = BnB.C.TILESIZE;
    //   // }
    //   // if (child2.priority === true) {
    //   //   child2YOffset = BnB.C.TILESIZE;
    //   // }
    //   if (child1.y > child2.y) {
    //     return 1;
    //   } else if (child1.y < child2.y) {
    //     return -1;
    //   } else {
    //     return 0;
    //   }
    // }, this)
}

/*
  Checks to see if ALL movement tweens are finished
*/
BnB.GraphicsManager.prototype.areAnimationsFinished = function() {
    if (this.animationCounter === 0) {

      // NEED TO CREATE BETTER PLACE TO CALL THIS, SHAKES EVEN WHEN NOTHING MOVED
      if(BnB.C.ENABLE_SCREEN_SHAKE) this.screenShake(this.gravityDirection);
      this.gravityFinished = undefined;

        return true;
    } else {
        return false;
    }
};

/*
  Shakes the screen
*/
BnB.GraphicsManager.prototype.screenShake = function(direction) {
    var animateProperties;

    if (direction === 'up') {
      animateProperties = {x: 0, y: -1};
    } else if (direction === 'down') {
      animateProperties = {x: 0, y: 1};
    } else if (direction === 'left') {
      animateProperties = {x: -1, y: 0};
    } else if (direction === 'right') {
      animateProperties = {x: 1, y: 0};
    } else {
      return false;
    }

    this.mainGroup.x += animateProperties.x;
    this.mainGroup.y += animateProperties.y;

    var callback = (function(animateProperties){
      return function () {
        this.mainGroup.x -= animateProperties.x;
        this.mainGroup.y -= animateProperties.y;
      }
    })(animateProperties).bind(this);

    setTimeout(callback, 32);

    // var quakeFront = game.add.tween(this.mainGroup);
    // var quakeBack = game.add.tween(this.backgroundGroup);
    // quakeFront.to(animateProperties, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
    // quakeBack.to(animateProperties, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);

    return true
};
                  
