LevelEditor = function() {
	this.width = 8;
	this.height = 10;
	this.touchMap = []
	this.map = {
		active: [],
		fixed: [],
		background: []
	};


	for (var y = 0; y < this.height; y++) {
		this.touchMap = []
		for (element in this.map) {
			this.map[element][y] = [];
		}
		for (var x = 0; x < this.width; x++) {
			for (element in this.map) {
				this.map[element][y][x] = {
					type: ' '
				};
			}
		}
	}
};

LevelEditor.prototype = {
	create: function() {
		this.convertValues = this.getConvertValues();

		this.layers = {}

  	for (element in this.map) {
  		this.layers[element] = BnBgame.add.group();
  	}

  	var activeCoordinate;
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				//this.touchMap[y][x] =;
				activeCoordinate = this.gridToPixel({x: x, y: y})


				for (element in this.map) {
					this.map[element][y][x].sprite = BnBgame.add.sprite(activeCoordinate.x, activeCoordinate.y, 'spritesheet', this.graphicsKeyLookup(this.map[element][y][x].type).image);
	        this.layers[element].add(this.map[element][y][x].sprite);
	        this.map[element][y][x].sprite.scale.setTo(this.convertValues.spriteScale, this.convertValues.spriteScale);
	        this.map[element][y][x].sprite.anchor = {x: 0.5, y: 0.5};
	        //this.map[element][y][x].sprite.customZ = y * 10 + this.graphicsKeyLookup(activeSpriteType).order;
	      }
			}
		}
  	

	},
	update: function() {

	}
};

LevelEditor.prototype.initializeSprites = function(map) {
  var activeCoordinate;
  var fixedLookup;
  var activeSpriteType;
  for (var y = 0; y < map.height; y++) {
    this.fixed[y] = [];
    for (var x = 0; x < map.width; x++) {
      activeSpriteType = map.active[y][x];
      activeCoordinate = this.gridToPixel({x: x, y: y})
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

LevelEditor.prototype.getConvertValues = function() {
  var screenRatio = Settings.GAME.WIDTH / Settings.GAME.HEIGHT;

  var levelRatio = (this.width + 0.5) / (this.height + 0.5);

  var convertValues = {};

  if (screenRatio > levelRatio) {
    //base on level height
    convertValues.fitType = 'height';
    convertValues.scaledTileSize = Math.floor(Settings.GAME.HEIGHT / (this.height + 0.5));
  } else {
    //base on level width
    convertValues.fitType = 'width';
    convertValues.scaledTileSize = Math.floor(Settings.GAME.WIDTH / (this.width + 0.5));
  }
 
  console.log(convertValues.scaledTileSize);
  convertValues.spriteScale = convertValues.scaledTileSize / Settings.GRAPHICS.TILESIZE;

  return convertValues;
};

//manages grid to pixel conversion
LevelEditor.prototype.gridToPixel = function(coordinate) {
  

  //Math.floor((Settings.GRAPHICS.TILESIZE + Settings.GRAPHICS.TILESIZE) * (coordinate.x + 0.5) / 2)


  return {
    x: (0.25 * Settings.GRAPHICS.TILESIZE) + ((coordinate.x + 0.5) * this.convertValues.scaledTileSize),
    y: (0.1875 * Settings.GRAPHICS.TILESIZE) + ((coordinate.y + 0.5) * this.convertValues.scaledTileSize)
  }    
  
};

LevelEditor.prototype.pixelToGrid = function(coordinate) {
  return {
    x: Math.floor((coordinate.x - (0.25 * Settings.GRAPHICS.TILESIZE)) / this.convertValues.scaledTileSize),
    y: Math.floor((coordinate.y - (0.1875 * Settings.GRAPHICS.TILESIZE)) / this.convertValues.scaledTileSize)
  }
}

Level.prototype.updateGraphics = function(){

}

LevelEditor.prototype.graphicsKeyLookup = function(key) {
 
	var keyLookup = {
    'b':{
      order: 2,
      image: 'brainandbrawn_brainy'
    },
    'B':{
      order: 4,
      image: 'brainandbrawn_brawny'
    },
    ' ':{
    	order: 0,
      image: 'brainandbrawn_blank'
    },
    '#':{
      order: 0,
      image: 'brainandbrawn_block'
    },
    '.':{
      order: 0,
      image: 'brainandbrawn_blank' 
    },
    'E':{
      order: 3,
      image: 'brainandbrawn_alien'
    },
    'g':{
      order: 0,
      image: 'brainandbrawn_goalBrainy'
    },
    'G':{
      order: 0,
      image: 'brainandbrawn_goalBrawny'
    },
    '0':{
      order: 0,
      image: 'brainandbrawn_pipe0'
    },
    '1':{
      order: 0,
      image: 'brainandbrawn_switchNew1A'
    },
    '2':{
      order: 0,
      image: 'brainandbrawn_switchNew1B'
    },
    '3':{
      order: 0,
      image: 'brainandbrawn_gateNew1C'
    },
    '4':{
      order: 0,
      image: 'brainandbrawn_gateNew1D'
    },
    '5':{
      order: 0,
      image: 'brainandbrawn_switchNew2A'
    },
    '6':{
      order: 0,
      image: 'brainandbrawn_switchNew2B'
    },
    '7':{
      order: 0,
      image: 'brainandbrawn_gateNew2C'
    },
    '8':{
      order: 0,
      image: 'brainandbrawn_gateNew2D'
    },
    '9':{
      order: 0,
      image: 'brainandbrawn_switchNew3A'
    },
    '10':{
      order: 0,
      image: 'brainandbrawn_switchNew3B'
    },
    '11':{
      order: 0,
      image: 'brainandbrawn_gateNew3C'
    },
    '12':{
      order: 0,
      image: 'brainandbrawn_gateNew3D'
    },
    '13':{
      order: 0,
      image: 'brainandbrawn_switchNew4A'
    },
    '14':{
      order: 0,
      image: 'brainandbrawn_switchNew4B'
    },
    '15':{
      order: 0,
      image: 'brainandbrawn_gateNew4C'
    },
    '16':{
      order: 0,
      image: 'brainandbrawn_gateNew4D'
    }
  }

  return keyLookup[key];
}
