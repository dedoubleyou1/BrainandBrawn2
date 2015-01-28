GraphicsManager = function(map) {
  this.active = {};
  this.fixed = [];
  this.skinnyWalls = map.skinnyWalls;
  console.log(this.skinnyWalls);

  this.levelGroup = BnBgame.add.group();
  this.levelGroup.enableBody = true;
  this.fixedGroup = BnBgame.add.group(this.levelGroup);
  this.activeGroup = BnBgame.add.group(this.levelGroup);

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
      image: 'brainandbrawn_brainy',
      animations: {},
      'b': {},
      'B': {}
    },
    'B':{
      image: 'brainandbrawn_brawny',
      'b': {},
      'B': {}
    },
    ' ':{
      'b': {},
      'B': {}
    },
    '#':{
      image: 'brainandbrawn_block',
      'b': {},
      'B': {}
    },
    '|':{
      image: 'brainandbrawn_wall-tall',
      'b': {},
      'B': {}
    },
    '-':{
      image: 'brainandbrawn_wall-long',
      'b': {},
      'B': {}
    },
    '.':{
      image: 'brainandbrawn_cornerA',
      'b': {},
      'B': {}      
    },
    'E':{
      image: 'brainandbrawn_alien',
      'b': {},
      'B': triggers.killSelf
    },
    'g':{
      image: 'brainandbrawn_goalBrainy',
      'b': {},
      'B': {}
    },
    'G':{
      image: 'brainandbrawn_goalBrawny',
      'b': {},
      'B': {}
    },
    '0':{
      image: 'brainandbrawn_gate',
      'b': {},
      'B': {}
    },
    '1':{
      image: 'brainandbrawn_switch1A',
      'b': triggers.switchBoth('2', '3', '4'),
      'B': {}
    },
    '2':{
      image: 'brainandbrawn_switch1B',
      'b': {},
      'B': {}
    },
    '3':{
      image: 'brainandbrawn_gate1A',
      'b': {},
      'B': {}
    },
    '4':{
      image: 'brainandbrawn_gate1B',
      'b': {},
      'B': {}
    },
    '5':{
      image: 'brainandbrawn_switch2A',
      'b': triggers.switchBoth('6', '7', '8'),
      'B': {}
    },
    '6':{
      image: 'brainandbrawn_switch2B',
      'b': {},
      'B': {}
    },
    '7':{
      image: 'brainandbrawn_gate2A',
      'b': {},
      'B': {}
    },
    '8':{
      image: 'brainandbrawn_gate2B',
      'b': {},
      'B': {}
    },
    '9':{
      image: 'brainandbrawn_switch3A',
      'b': triggers.switchAll('10', '11', '12'),
      'B': {}
    },
    '10':{
      image: 'brainandbrawn_switch3B',
      'b': {},
      'B': {}
    },
    '11':{
      image: 'brainandbrawn_gate3A',
      'b': {},
      'B': {}
    },
    '12':{
      image: 'brainandbrawn_gate3B',
      'b': {},
      'B': {}
    }
  }

  return keyLookup[key];
}

GraphicsManager.prototype.initializeSprites = function(map) {
  var activeCoordinate;
  var fixedSprite;
  var activeSpriteType;
  for (var y = 0; y < map.height; y++) {
    this.fixed[y] = [];
    for (var x = 0; x < map.width; x++) {
      activeSpriteType = map.active[y][x];
      activeCoordinate = this.gridToPixel({x: x, y: y})
      if (activeSpriteType != ' ') {
        this.active[activeSpriteType] = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', this.graphicsKeyLookup(activeSpriteType).image);
        this.activeGroup.add(this.active[activeSpriteType]);
        this.active[activeSpriteType].scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
        this.active[activeSpriteType].anchor = {x: 0.5, y: 0.5};
      }

      fixedSprite = this.graphicsKeyLookup(map.fixed[y][x]).image;
      this.fixed[y][x] = {
        type: map.fixed[y][x]
      };
      
      if (typeof fixedSprite === 'string') {
        this.fixed[y][x].sprite = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', fixedSprite);
        this.fixedGroup.add(this.fixed[y][x].sprite);
        this.fixed[y][x].sprite.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
        this.fixed[y][x].sprite.anchor = {x: 0.5, y: 0.5};
      }
    }
  }
};

GraphicsManager.prototype.getConvertValues = function() {
  var screenRatio = Settings.GAME.WIDTH / Settings.GAME.HEIGHT;

  var levelWidth;
  var levelHeight;
  if (this.skinnyWalls) {
    levelWidth = (Settings.GRAPHICS.SKINNYSIZE * (this.width + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (this.width + 0.5) / 2);
    levelHeight = (Settings.GRAPHICS.SKINNYSIZE * (this.height + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (this.height + 0.5) / 2);
  } else {
    levelWidth = this.width;
    levelHeight = this.height;
  }
  var levelRatio = levelWidth / levelHeight;


  var convertValues = {};

  if (screenRatio > levelRatio) {
    //base on level height
    convertValues.fitType = 'height';
    convertValues.mapRatio = Settings.GAME.HEIGHT / this.height;
  } else {
    //base on level width
    convertValues.fitType = 'width';
    convertValues.mapRatio = Settings.GAME.WIDTH / this.width;
  }

  if (this.skinnyWalls) {
      if (convertValues.fitType === 'height') {
      //base on level height
      
      convertValues.spriteScale = Settings.GAME.HEIGHT / levelHeight;
    } else {
      //base on level width
      convertValues.spriteScale = Settings.GAME.WIDTH / levelWidth;
    }
    

    //var levelRatio = ((Settings.GRAPHICS.SKINNYSIZE * (this.width + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (this.width + 0.5) / 2)) / ((Settings.GRAPHICS.SKINNYSIZE * (this.height + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (this.height + 0.5) / 2))
  } else {
    convertValues.spriteScale = convertValues.mapRatio / Settings.GRAPHICS.TILESIZE;
  }

  return convertValues;
};

//manages grid to pixel conversion
GraphicsManager.prototype.gridToPixel = function(coordinate) {
  

  //Math.floor((Settings.GRAPHICS.TILESIZE + Settings.GRAPHICS.TILESIZE) * (coordinate.x + 0.5) / 2)

  if (this.skinnyWalls) {
    return {
      x: ((Settings.GRAPHICS.SKINNYSIZE * (coordinate.x + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (coordinate.x + 0.5) / 2)) * this.convertValues.spriteScale,
      y: ((Settings.GRAPHICS.SKINNYSIZE * (coordinate.y + 1) / 2) + (Settings.GRAPHICS.TILESIZE * (coordinate.y + 0.5) / 2)) * this.convertValues.spriteScale,
    }  
  } else {
    return {
      x: (coordinate.x + 0.5) * this.convertValues.mapRatio,
      y: (coordinate.y + 0.5) * this.convertValues.mapRatio
    }    
  }

};

GraphicsManager.prototype.pixelToGrid = function(coordinate) {
  return {
    x: Math.floor(coordinate.x / this.convertValues.mapRatio),
    y: Math.floor(coordinate.y / this.convertValues.mapRatio)
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

GraphicsManager.prototype.areAnimationsFinished = function() {
  if (this.animationCounter === 0) {
    return true;
  } else {
    return false;
  }
};

