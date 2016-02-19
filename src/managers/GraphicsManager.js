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
    this.activeObjs = [];
    this.fixed = [];
    this.isFinished = true;
    this.missionSuccess = false;

    //Set grid dimensions
    this.gridWidth = map.width;
    this.gridHeight = map.height;

    //set up groups to hold SPRITE objects
    // var levelGroup = game.add.group();
    // levelGroup.enableBody = true;
    this.starLayer = game.add.group();
    this.backgroundGroup = game.add.group(); //floor layer
    this.mainGroup = game.add.group(); //holds everything
    this.mainGroup.enableBody = true;

    //Get graphics conversion values
    this.convertValues = this.getConvertValues();
    
    //initialize sprites
    if (BnB.C.ENABLE_STARS) {
      this.starGenerator();
    }
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
            var self = this.fixed[position.y][position.x];
            if(self.type == 'E' || self.type == 'm'){
                BnB.AudioManager.playSound('kill');
            }
            else if(self.type == '+'){
                BnB.AudioManager.playSound('shatter');
            }
            self.sprite.destroy();
        },
        killActiveTarget: function(target){
            BnB.AudioManager.playSound('kill');
            this.activeObjs[target].alive = false;
            // this.activeObjs[target].sprite.destroy();
            this.activeObjs[target].sprite.visible = false;
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
                if(typeSelf == '2'){
                    BnB.AudioManager.playSound('switch1');
                }
                else if(typeSelf == '6'){
                    BnB.AudioManager.playSound('switch2');
                }
                else if(typeSelf == '10'){
                    BnB.AudioManager.playSound('switch3');
                }
                else if(typeSelf == '14'){
                    BnB.AudioManager.playSound('switch4');
                }


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
                for (var i = foundPegs.length-1; i >=0 ; i--) {
                    foundPegs[i].sprite.destroy();
                };
            };
        }
    }
 
    var keyLookup = {
        //active
        'b':{
          order: 2,
          image: 'SpriteSheet0074',
          'b': {},
          'B': {},
          '$': triggers.killActiveTarget
        },
        'B':{
          order: 4,
          image: 'SpriteSheet0074',
          'b': {},
          'B': {},
          'm': triggers.killActiveTarget,
          '$': triggers.killActiveTarget
        },
        'm':{
          order: 3,
          image: 'brainandbrawn_alien4',
          'b': {},
          'B': triggers.killActiveTarget,
          '$': triggers.killActiveTarget
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
          'B': {},
          'm': triggers.killActiveTarget,
        },


        //fixed
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

        // '^':{
        //   order: 0,
        //   image: 'brainandbrawn_switchNew1A',
        //   'b': {},
        //   'B': {}
        // },
        // 'V':{
        //   order: 0,
        //   image: 'brainandbrawn_switchNew2A',
        //   'b': {},
        //   'B': {}
        // },
        // '<':{
        //   order: 0,
        //   image: 'brainandbrawn_switchNew3A',
        //   'b': {},
        //   'B': {}
        // },
        // '>':{
        //   order: 0,
        //   image: 'brainandbrawn_switchNew4A',
        //   'b': {},
        //   'B': {}
        // },
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
                var activeSprite = game.add.sprite(activeCoordinate.x, activeCoordinate.y, spritesheet, this.graphicsKeyLookup(activeSpriteType).image);
                activeSprite.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
                activeSprite.anchor = {x: 0.5, y: 0.5};
                activeSprite.customZ = y * 10 + this.graphicsKeyLookup(activeSpriteType).order;
                activeSprite.priority = true;

                this.mainGroup.add(activeSprite);
                this.activeObjs.push({
                    type: activeSpriteType,
                    alive: true,
                    sprite: activeSprite,
                });

                

                //If Brainy or Brawny - set up animations
                if (activeSpriteType === 'b' || activeSpriteType === 'B') {
                    activeSprite.animations.add('moveRight', Phaser.Animation.generateFrameNames('SpriteSheet', 0, 10, '', 4), 24, false, false);
                    activeSprite.animations.add('moveDown', Phaser.Animation.generateFrameNames('SpriteSheet', 10, 20, '', 4), 24, false, false);
                    activeSprite.animations.add('moveUp', Phaser.Animation.generateFrameNames('SpriteSheet', 20, 30, '', 4), 24, false, false);
                    activeSprite.animations.add('beamIn', Phaser.Animation.generateFrameNames('SpriteSheet', 74, 69, '', 4), 24, false, false);
                    activeSprite.animations.add('beamOut', Phaser.Animation.generateFrameNames('SpriteSheet', 69, 74, '', 4), 24, false, false);
                    activeSprite.animations.play('beamIn'); 
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

    for (element in this.activeObjs) {
        this.activeObjs[element].sprite.anchor = {x: offsetX, y: offsetY};
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

    if (gameStateChanges.endState === 'missionSuccess') {
          this.missionSuccess = true;
    }

    //Callback - called every frame of movement tweens
    var checkGraphicalTriggers = function(gridPosArray, target, type){
        return function() {
            /*
                TODO: Revamp this system to only work in one direction (state changes -> graphics).
                Risks of the currently implemented bi-direcitonal system include:
                -missing a graphical trigger due to lag (which can already be seen if the game is lagging in a larger level)
                -calling the same graphical trigger multiple times (because several update frames fall in the same gridPos)
            */

            //get current grid position of sprite
            var gridPos = this.pixelToGrid({x: this.activeObjs[target].sprite.x, y: this.activeObjs[target].sprite.y});
            if(type == 'm') console.log(gridPos);
            if(gridPos.y == 7) debugger;

            //loop through coordinates
            for (var i = 1; i < gridPosArray.length-1; i++) 
            {
                if (gridPosArray[i].x === gridPos.x && gridPosArray[i].y === gridPos.y) 
                {
                    //get graphical trigger and call it
                    var trigger = this.graphicsKeyLookup(gridPosArray[i].eventType)[type];
                    if (typeof trigger === 'function') {
                        if(typeof gridPosArray[i].killTarget != 'undefined'){
                            results = trigger.call(this, gridPosArray[i].killTarget);
                        }
                        else{
                            results = trigger.call(this, {x: gridPos.x, y: gridPos.y});
                        }
                    }
                }

            };
            //console.log(gameStateChanges, target, gridPos);
        }
    };

    //loop through char element in this.activeObjs array
    for (var i=0;i<this.activeObjs.length;i++) 
    {
        if(!this.activeObjs[i].alive) continue;

        var activeSprite = this.activeObjs[i].sprite;
        var element = this.activeObjs[i].type;

        var gridPosArray = gameStateChanges.activeChanges[i];

        //get ending position
        var finalGridPos = gridPosArray[gridPosArray.length - 1];
        var finalPixelPos = this.gridToPixel(finalGridPos);

        //get distance (in cells) between two grid coordinates
        var gridDist = BnB.Util.pointDist(gameStateChanges.gravity, gridPosArray[0], finalGridPos);

        //Tween sprite to CENTER of cell?
        recenter = game.add.tween(activeSprite.anchor);
        recenter.to({x: 0.5, y: 0.5}, 250, Phaser.Easing.Sinusoidal.In, true);

        //If the active element must move at least one cell - animate it
        if (gridDist > 0) {
            this.isFinished = false;
            //create movement tween
            var moveTween = game.add.tween(activeSprite);
            moveTween.to({x: finalPixelPos.x, y: finalPixelPos.y}, 180, Phaser.Easing.Sinusoidal.In, true);

            //If active obj is Brainy or Brawny - run animations
            if (element === 'b' || element === 'B'){
                if (activeSprite.x - finalPixelPos.x < 0) {
                    activeSprite.scale.x = Math.abs(activeSprite.scale.x); //Reset flip
                    activeSprite.animations.play('moveRight');
                } else if (activeSprite.x - finalPixelPos.x > 0){
                    activeSprite.scale.x = -1 * Math.abs(activeSprite.scale.x); //Flip animation
                    activeSprite.animations.play('moveRight'); 
                } else if (activeSprite.y - finalPixelPos.y < 0){
                    activeSprite.animations.play('moveDown'); 
                } else if (activeSprite.y - finalPixelPos.y > 0){
                    activeSprite.animations.play('moveUp'); 
                }
            }

            //keep track of how many tweens need to run
            this.animationCounter += 1;

            //get moveUpdatecallback
            var moveUpdateCallback = checkGraphicalTriggers(gridPosArray, i, element);

            
            
            //set up callback for when moveTween finishes
            moveTween.onComplete.add((function(moveUpdateCallback){
                return function(){
                  moveUpdateCallback.call(this);
                  this.animationCounter -= 1;
                }
            })(moveUpdateCallback), this);

            //set up callbakc for WHILE tween is playing
            moveTween.onUpdateCallback(moveUpdateCallback, this)
        } else {
          activeSprite.animations.play('leanReset'); 
        }
    };

};

/*
  -Called at the start of each update step
  -Sorts graphics Z order
*/
BnB.GraphicsManager.prototype.refresh = function() {
    if (BnB.C.ENABLE_STARS) {
      this.starUpdate(this.gravityDirection);
    }
    for (element in this.activeObjs) {
      this.activeObjs[element].sprite.customZ = ((this.activeObjs[element].sprite.y - (this.convertValues.borderY)) / this.convertValues.scaledTileSize) * 10 + this.graphicsKeyLookup(element).order;
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
      if (this.isFinished) {
        this.gravityFinished = undefined;
        return true;
      } else {
        if(BnB.C.ENABLE_SCREEN_SHAKE) this.screenShake(this.gravityDirection);
        this.isFinished = true;
        if (this.missionSuccess) {
          for (var i=0;i<this.activeObjs.length;i++) {
            if(!this.activeObjs[i].alive) continue;

            if (this.activeObjs[i].type === 'b' || this.activeObjs[i].type === 'B'){
              this.animationCounter += 1;
              this.activeObjs[i].sprite.animations.getAnimation('beamOut').onComplete.add(function(){
                this.animationCounter -= 1;
              }, this);
              this.activeObjs[i].sprite.animations.play('beamOut'); 
            }

          }
        }
      }

      
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
    this.backgroundGroup.x += animateProperties.x;
    this.backgroundGroup.y += animateProperties.y;

    var callback = (function(animateProperties){
      return function () {
        this.mainGroup.x -= animateProperties.x;
        this.mainGroup.y -= animateProperties.y;
        this.backgroundGroup.x -= animateProperties.x;
        this.backgroundGroup.y -= animateProperties.y;
      }
    })(animateProperties).bind(this);

    setTimeout(callback, 32);

    // var quakeFront = game.add.tween(this.mainGroup);
    // var quakeBack = game.add.tween(this.backgroundGroup);
    // quakeFront.to(animateProperties, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);
    // quakeBack.to(animateProperties, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 0, true);

    return true
};
BnB.GraphicsManager.prototype.starGenerator = function() {
  var makeCircle = function(size){
    var circle = game.add.bitmapData(size, size);
      circle.ctx.beginPath();
      circle.ctx.arc(size/2, size/2, size/2, 0, 2 * Math.PI, false)
      circle.ctx.fillStyle = '#ffffff';
      circle.ctx.fill();
    return circle;
  }

  // var emitter = game.add.emitter(game.world.centerX, 0, 400);
  // this.starLayer.add(emitter);

  // emitter.width = game.world.width;
  // // emitter.angle = 30; // uncomment to set an angle for the rain.

  // emitter.makeParticles(circle);

  // emitter.minParticleScale = 0.1;
  // emitter.maxParticleScale = 0.5;

  // emitter.setYSpeed(300, 500);
  // emitter.setXSpeed(0, 0);

  // emitter.minRotation = 0;
  // emitter.maxRotation = 0;

  // emitter.start(false, 1600, 5, 0);

    //  This is the sprite that will be drawn to the texture
    //  Note that we 'make' it, not 'add' it, as we don't want it on the display list
    this.star = game.make.sprite(0, 0, makeCircle(1));
    this.star2 = game.make.sprite(0, 0, makeCircle(2));
    this.star3 = game.make.sprite(0, 0, makeCircle(4));

    this.stars = [];

    //  For this effect we'll create a vertical scrolling starfield with 300 stars split across 3 layers.
    //  This will use only 3 textures / sprites in total.
    var texture1 = game.add.renderTexture(game.width, game.height, makeCircle(1));
    var texture2 = game.add.renderTexture(game.width, game.height, makeCircle(2));
    var texture3 = game.add.renderTexture(game.width, game.height, makeCircle(4));
    
    var tex1 = game.add.sprite(0, 0, texture1);
    var tex2 = game.add.sprite(0, 0, texture2);
    var tex3 = game.add.sprite(0, 0, texture3);
    this.starLayer.add(tex1);
    this.starLayer.add(tex2);
    this.starLayer.add(tex3);

    var t = texture1;
    var s = 2;

    //  100 sprites per layer
    for (var i = 0; i < 280; i++)
    {
        if (i == 160) {
            //  With each 100 stars we ramp up the speed a little and swap to the next texture
            s = 4;
            t = texture2;
        }
        else if (i == 240) {
            s = 6;
            t = texture3;
        }

        this.stars.push( { x: game.world.randomX, y: game.world.randomY, speed: s, texture: t });
    }
};

BnB.GraphicsManager.prototype.starUpdate = function(direction) {
    if (typeof direction === 'undefined') {
      direction = 'up';
    }
    var directionVector = BnB.Util.directionLookup[direction];
    for (var i = 0; i < 280; i++){
      //  Update the stars position based on its speed
      this.stars[i].y += directionVector.y * this.stars[i].speed;
      this.stars[i].x += directionVector.x * this.stars[i].speed;

      if (this.stars[i].y < -32 ) {
          //  Off the bottom of the screen? Then wrap around to the top
          this.stars[i].x = game.world.randomX;
          this.stars[i].y = game.height + 32;
      } else if (this.stars[i].y > game.height + 32 ) {
          //  Off the bottom of the screen? Then wrap around to the top
          this.stars[i].x = game.world.randomX;
          this.stars[i].y = -32;
      } else if (this.stars[i].x < -32 ) {
          //  Off the bottom of the screen? Then wrap around to the top
          this.stars[i].y = game.world.randomY;
          this.stars[i].x = game.width + 32;
      } else if (this.stars[i].x > game.width + 32 ) {
          //  Off the bottom of the screen? Then wrap around to the top
          this.stars[i].y = game.world.randomX;
          this.stars[i].x = -32;
      }

      if (i == 0) {
          //  If it's the first star of the layer then we clear the texture
          this.stars[i].texture.renderXY(this.star, this.stars[i].x, this.stars[i].y, true);
      } else if (i == 160) {
          //  If it's the first star of the layer then we clear the texture
          this.stars[i].texture.renderXY(this.star2, this.stars[i].x, this.stars[i].y, true);
      } else if (i == 240) {
          //  If it's the first star of the layer then we clear the texture
          this.stars[i].texture.renderXY(this.star3, this.stars[i].x, this.stars[i].y, true);
      }
      else {
          //  Otherwise just draw the star sprite where we need it
          if (i < 160) {
              this.stars[i].texture.renderXY(this.star, this.stars[i].x, this.stars[i].y, false);
          } else if (i < 240) {
              this.stars[i].texture.renderXY(this.star2, this.stars[i].x, this.stars[i].y, false);
          } else {
              this.stars[i].texture.renderXY(this.star3, this.stars[i].x, this.stars[i].y, false);
          }
      }
    }
};


BnB.GraphicsManager.prototype.setLeaning = function(direction, amount) {

    amount = Math.abs(amount * 10);
    if (amount === 0) {
      amount = 1;
    }
    //adjusts the amount to be a value between 0 and 1
    var normalizedAmount = 1 - (amount/Math.pow(amount, 2));
    if (normalizedAmount < 0) {
      normalizedAmount = 0
    }

    var activeSprite;
    var element;

    for (var i=0;i<this.activeObjs.length;i++) {
        if(!this.activeObjs[i].alive) continue;

        activeSprite = this.activeObjs[i].sprite;
        element = this.activeObjs[i].type;

        if (element === 'b' || element === 'B'){
            if (direction === 'right') {
                activeSprite.scale.x = Math.abs(activeSprite.scale.x); //Reset flip
                activeSprite.animations.frame = 30 + Math.floor(normalizedAmount * 12);
                activeSprite.animations.add(
                  'leanReset', 
                  Phaser.Animation.generateFrameNames('SpriteSheet', 30 + Math.floor(normalizedAmount * 12), 30, '', 4),
                  24,
                  false,
                  false
                );
            } else if (direction === 'left'){
                activeSprite.scale.x = -1 * Math.abs(activeSprite.scale.x); //Flip animation
                activeSprite.animations.frame = 30 + Math.floor(normalizedAmount * 12);
                activeSprite.animations.add(
                  'leanReset', 
                  Phaser.Animation.generateFrameNames('SpriteSheet', 30 + Math.floor(normalizedAmount * 12), 30, '', 4),
                  24,
                  false,
                  false
                );
            } else if (direction === 'down'){
                activeSprite.animations.frame = 43 + Math.floor(normalizedAmount * 12); 
                activeSprite.animations.add(
                  'leanReset', 
                  Phaser.Animation.generateFrameNames('SpriteSheet', 43 + Math.floor(normalizedAmount * 12), 43, '', 4),
                  24,
                  false,
                  false
                );
            } else if (direction === 'up'){
                activeSprite.animations.frame = 56 + Math.floor(normalizedAmount * 12);
                activeSprite.animations.add(
                  'leanReset', 
                  Phaser.Animation.generateFrameNames('SpriteSheet', 56 + Math.floor(normalizedAmount * 12), 56, '', 4),
                  24,
                  false,
                  false
                );
            }
        }

    }

}
BnB.GraphicsManager.prototype.resetLeaning = function() {

    for (var i=0;i<this.activeObjs.length;i++) {
        if(!this.activeObjs[i].alive) continue;

        if (this.activeObjs[i].type === 'b' || this.activeObjs[i].type === 'B'){
            this.activeObjs[i].sprite.animations.play('leanReset'); 
        }

    }

}
                  
