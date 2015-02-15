GraphicsManager = function(map) {
  this.active = {};
  this.fixed = [];

  this.levelGroup = BnBgame.add.group();
  this.levelGroup.enableBody = true;
  this.backgroundGroup = BnBgame.add.group(this.levelGroup)
  this.fixedGroup = BnBgame.add.group(this.levelGroup);
  //this.activeGroup = BnBgame.add.group(this.levelGroup);

  this.width = map.width;
  this.height = map.height;
  this.convertValues = this.getConvertValues();
  this.initializeSprites(map);

  this.animationCounter = 0
}

GraphicsManager.prototype.graphicsKeyLookup = function(key) {
  var triggers = {
    killSelf: function(position) {
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
        var foundObjects = filter2d(this.fixed, function(element){
          if (element.type === this.type) {
            return true;
          }
        }, context);

        for (var i = 0; i < foundObjects.length; i++) {
          foundObjects[i].sprite.frameName = this.graphicsKeyLookup(typeTo).image;
        };
      };
    },
    switchBoth: function(typeSelf, typeOther, typeToOther) {
      var context = {
        type: typeOther,
        typeTo: typeToOther
      };
      return function(position) {
        this.fixed[position.y][position.x].sprite.frameName = this.graphicsKeyLookup(typeSelf).image;

        var foundObjects = filter2d(this.fixed, function(element){
          if (element.type === this.type) {
            return true;
          }
        }, context);

        for (var i = 0; i < foundObjects.length; i++) {
          foundObjects[i].sprite.frameName = this.graphicsKeyLookup(typeToOther).image;
        };
      };
    }
  }

	var keyLookup = {
    'b':{
      order: 2,
      image: 'brainandbrawn_brainy',
      animations: {},
      'b': {},
      'B': {}
    },
    'B':{
      order: 4,
      image: 'brainandbrawn_brawny',
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
      image: 'brainandbrawn_alien',
      'b': {},
      'B': triggers.killSelf
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
      'b': triggers.switchBoth('2', '3', '4'),
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
      'b': triggers.switchBoth('6', '7', '8'),
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
      'b': triggers.switchBoth('10', '11', '12'),
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
      'b': triggers.switchBoth('14', '15', '16'),
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
    }
  }

  return keyLookup[key];
}

GraphicsManager.prototype.initializeSprites = function(map) {
  var activeCoordinate;
  var fixedLookup;
  var activeSpriteType;
  var bgSpriteHolder;
  for (var y = 0; y < map.height; y++) {
    this.fixed[y] = [];
    for (var x = 0; x < map.width; x++) {

      activeSpriteType = map.active[y][x];
      activeCoordinate = this.gridToPixel({x: x, y: y})

      bgSpriteHolder = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', 'brainandbrawn_floor');
      this.backgroundGroup.add(bgSpriteHolder);
      bgSpriteHolder.anchor = {x: 0.5, y: 0.5};
      bgSpriteHolder.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);


      if (activeSpriteType != ' ') {
        this.active[activeSpriteType] = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', this.graphicsKeyLookup(activeSpriteType).image);
        this.fixedGroup.add(this.active[activeSpriteType]);
        this.active[activeSpriteType].scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
        this.active[activeSpriteType].anchor = {x: 0.5, y: 0.5};
        this.active[activeSpriteType].customZ = y * 10 + this.graphicsKeyLookup(activeSpriteType).order;
        this.active[activeSpriteType].priority = true;
      }

      fixedLookup = this.graphicsKeyLookup(map.fixed[y][x]);
      this.fixed[y][x] = {
        type: map.fixed[y][x]
      };
      
      if (typeof fixedLookup.image === 'string') {
        this.fixed[y][x].sprite = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', fixedLookup.image);
        this.fixedGroup.add(this.fixed[y][x].sprite);
        this.fixed[y][x].sprite.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
        this.fixed[y][x].sprite.anchor = {x: 0.5, y: 0.5};
        this.fixed[y][x].sprite.customZ = y * 10 + fixedLookup.order;
        this.fixed[y][x].sprite.priority = false;

      }
    }
  }
};

GraphicsManager.prototype.getConvertValues = function() {
  var screenRatio = Settings.GAME.WIDTH / Settings.GAME.HEIGHT;

  var levelRatio = (this.width + 0.5) / (this.height + 0.5);

  var convertValues = {};

  if (screenRatio > levelRatio) {
    //base on level height
    convertValues.fitType = 'height';
    convertValues.scaledTileSize = Math.floor(Settings.GAME.HEIGHT / (this.height + Settings.GRAPHICS.BORDER_SIZE * 2 + Settings.GRAPHICS.OFFSET));
    // this.xOffset = Settings.GAME.WIDTH - (convertValues.scaledTileSize * this.width)
    // this.yOffset = 0;
  } else {
    //base on level width
    convertValues.fitType = 'width';
    convertValues.scaledTileSize = Math.floor(Settings.GAME.WIDTH / (this.width + Settings.GRAPHICS.BORDER_SIZE * 2));
  }
 
  console.log(convertValues.scaledTileSize);
  convertValues.spriteScale = convertValues.scaledTileSize / Settings.GRAPHICS.TILESIZE;
  convertValues.borderX = Settings.GRAPHICS.BORDER_SIZE * convertValues.scaledTileSize;
  convertValues.borderY = (Settings.GRAPHICS.BORDER_SIZE + (Settings.GRAPHICS.OFFSET / 2)) * convertValues.scaledTileSize;

  return convertValues;
};

//manages grid to pixel conversion
GraphicsManager.prototype.gridToPixel = function(coordinate) {
  

  //Math.floor((Settings.GRAPHICS.TILESIZE + Settings.GRAPHICS.TILESIZE) * (coordinate.x + 0.5) / 2)


  return {
    x: (this.convertValues.borderX) + ((coordinate.x + 0.5) * this.convertValues.scaledTileSize),
    y: (this.convertValues.borderY) + ((coordinate.y + 0.5) * this.convertValues.scaledTileSize)
  }    
  
};

GraphicsManager.prototype.pixelToGrid = function(coordinate) {
  return {
    x: Math.floor((coordinate.x - (this.convertValues.borderX)) / this.convertValues.scaledTileSize),
    y: Math.floor((coordinate.y - (this.convertValues.borderY)) / this.convertValues.scaledTileSize)
  }
}

GraphicsManager.prototype.updateGraphics = function(gameStateChanges) {

  var callbackTest = function(gameStateChanges, element){
    return function() {
      var gridPos = this.pixelToGrid({x: this.active[element].x, y: this.active[element].y});
      for (var i = 1; i < gameStateChanges[element].length - 1; i++) {
        if (gameStateChanges[element][i].x === gridPos.x && gameStateChanges[element][i].y === gridPos.y) {
          var trigger = this.graphicsKeyLookup(gameStateChanges[element][i].eventType)[element];
          if (typeof trigger === 'function') {
            results = trigger.call(this, {x: gridPos.x, y: gridPos.y});
          }
        }

      };

      //console.log(gameStateChanges, element, gridPos);
    }
  };

  var lastPosition;
  var newCoord;
  var dist;
  var move;
  var thisCallback;

  for (element in this.active) {
    console.log(element);

    lastPosition = gameStateChanges[element][gameStateChanges[element].length - 1];
    newCoord = this.gridToPixel(lastPosition);

    var dist = pointDist(gameStateChanges.gravity, gameStateChanges[element][0], lastPosition);
    if (dist > 0) {
      move = BnBgame.add.tween(this.active[element]);
      move.to({x: newCoord.x, y: newCoord.y}, 180, Phaser.Easing.Sinusoidal.In, true);
      this.animationCounter += 1;

      thisCallback = callbackTest(gameStateChanges, element);
      //thisCallback.call(this);

      move.onComplete.add((function(thisCallback){
        return function(){
          thisCallback.call(this);
          this.animationCounter -= 1;
        }

      })(thisCallback), this);

      move.onUpdateCallback(thisCallback, this)
    }
  };

};

GraphicsManager.prototype.refresh = function() {
    for (element in this.active) {
      this.active[element].customZ = ((this.active[element].y - (this.convertValues.borderY)) / this.convertValues.scaledTileSize) * 10 + this.graphicsKeyLookup(element).order;
    };
    this.fixedGroup.sort('customZ', Phaser.Group.SORT_ASCENDING)

    // this.fixedGroup.customSort(function(childA, childB){
    //   return 0;
    // });

    // this.fixedGroup.customSort(function(child1, child2) {
    //   // var child1YOffset = 1;
    //   // var child2YOffset = 1;
    //   // if (child1.priority === true) {
    //   //   child1YOffset = Settings.GRAPHICS.TILESIZE;
    //   // }
    //   // if (child2.priority === true) {
    //   //   child2YOffset = Settings.GRAPHICS.TILESIZE;
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

GraphicsManager.prototype.areAnimationsFinished = function() {
  if (this.animationCounter === 0) {
    return true;
  } else {
    return false;
  }
};

