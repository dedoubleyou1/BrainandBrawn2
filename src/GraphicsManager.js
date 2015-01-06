GraphicsManager = function(map) {
  this.active = {};
  this.fixed = []

  this.levelGroup = BnBgame.add.group();
  this.fixedGroup = BnBgame.add.group();
  this.levelGroup.add(this.fixedGroup);
  this.activeGroup = BnBgame.add.group();
  this.levelGroup.add(this.activeGroup);

  this.width = map.width;
  this.height = map.height;
  this.convertValues = this.getConvertValues();
  this.initializeSprites(map);
}

GraphicsManager.prototype.graphicsKeyLookup = function(key) {
	var keyLookup = {
    'b':{
      image: 'pBrainy.png',
      animations: {},
      'b': {},
      'B': {}
    },
    'B':{
      image: 'pBrawny.png',
      'b': {},
      'B': {}
    },
    ' ':{
      'b': {},
      'B': {}
    },
    '#':{
      image: 'block.png',
      'b': {},
      'B': {}
    },
    '.':{
      'b': {},
      'B': {}      
    },
    'E':{
      image: 'octopus.png',
      'b': {},
      'B': {}
    },
    'g':{
      image: 'goalBrainy.png',
      'b': {},
      'B': {}
    },
    'G':{
      image: 'goalBrawny.png',
      'b': {},
      'B': {}
    },
    '0':{
      image: 'gate0.png',
      'b': {},
      'B': {}
    },
    '1':{
      image: 'switch1On.png',
      'b': {},
      'B': {}
    },
    '2':{
      image: 'gate1On.png',
      'b': {},
      'B': {}
    },
    '3':{
      image: 'gate1Off.png',
      'b': {},
      'B': {}
    },
    '4':{
      image: 'switch2On.png',
      'b': {},
      'B': {}
    },
    '5':{
      image: 'gate2On.png',
      'b': {},
      'B': {}
    },
    '6':{
      image: 'gate2Off.png',
      'b': {},
      'B': {}
    },
    '7':{
      image: 'switch3On.png',
      'b': {},
      'B': {}
    },
    '8':{
      image: 'gate3On.png',
      'b': {},
      'B': {}
    },
    '9':{
      image: 'gate3Off.png',
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
        this.active[activeSpriteType] = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'levelImages', this.graphicsKeyLookup(activeSpriteType).image);
        this.activeGroup.add(this.active[activeSpriteType]);
        this.active[activeSpriteType].scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
      }

      fixedSprite = this.graphicsKeyLookup(map.fixed[y][x]).image;
      if (typeof fixedSprite === 'string') {
        this.fixed[y][x] = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'levelImages', fixedSprite);
        this.fixedGroup.add(this.fixed[y][x]);
        this.fixed[y][x].scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
      }
    }
  }
};

GraphicsManager.prototype.getConvertValues = function() {
  var screenRatio = Settings.GAME.WIDTH / Settings.GAME.HEIGHT;
  var levelRatio = this.width / this.height;
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
  convertValues.spriteScale = convertValues.mapRatio / Settings.GRAPHICS.TILESIZE;

  return convertValues;
};

//manages grid to pixel conversion
GraphicsManager.prototype.gridToPixel = function(coordinate) {
  return {
    x: coordinate.x * this.convertValues.mapRatio,
    y: coordinate.y * this.convertValues.mapRatio
  }
};

GraphicsManager.prototype.updateGraphics = function(gameStateChanges, callback, context) {
  for (element in this.active) {
    var newCoord = this.gridToPixel(gameStateChanges[element][gameStateChanges[element].length - 1]);
    var move = BnBgame.add.tween(this.active[element]);
    move.to({x: newCoord.x, y: newCoord.y}, 800, easingFunctions[element], true);
    //move.onComplete.add(function(){}, this);
    //move.start();
  };
  // var screenShake = BnBgame.add.tween(this.levelGroup);
  // var shakeTo = directionLookup[gameStateChanges.gravity]
  // screenShake.to({x: shakeTo.x * 1, y: shakeTo.y * 1}, 100, wiggle2, true, 210, 0, true);

  //callback.call(context);
  BnBgame.time.events.add(800, callback, context);
};

