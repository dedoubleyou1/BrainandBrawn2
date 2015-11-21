var activeKeyChar = {
  brainy: 'b',
  brawny: 'B',
  moveable: '@',
  spikey: '$',
};

var fixedKeyChar = {
  block: '#',
  alien: 'E',
  goalBrainy: 'g',
  goalBrawny: 'G',
  pipe0: '0',
  spikedBlock: 'X',
  breakable: '+',

  switchNew1A: '1',
  switchNew2A: '5',
  switchNew3A: '9',
  switchNew4A: '13',
  gateNew1C: '3',
  gateNew2C: '7',
  gateNew3C: '11',
  gateNew4C: '15',
};

var bigKeyLookup = {
    'b': 'brainy' ,
    'B': 'brawny',
    '@': 'moveable',
    '$': 'spikey',

    '#': 'block',         
    'E': 'alien',         
    'g': 'goalBrainy',    
    'G': 'goalBrawny',    
    '0': 'pipe0',         
    'X': 'spikedBlock',  
    '+': 'breakable', 
    
    '1': 'switchNew1A',   
    '5': 'switchNew2A',   
    '9': 'switchNew3A',   
    '13':'switchNew4A',   
    '3': 'gateNew1C',     
    '7': 'gateNew2C',     
    '11':'gateNew3C',     
    '15':'gateNew4C',      
};



//global object to save the data (temp)
// var Settings.BUILDER.DATA = {};

LevelBuilder = function() 
{
  Settings.BUILDER.DATA.saved = false;
};

LevelBuilder.prototype = {

  init: function()
  {
    //Settings
    Settings.GAME.BOUNDS_DEATH = false;

    //brush panel variables
    this.brushWidth = Settings.GAME.WIDTH/9;
    this.brushHeight = this.brushWidth;

    this.gridWidth = Settings.BUILDER.GRID_X;
    this.gridHeight = Settings.BUILDER.GRID_Y;

    //play space offsetY
    var playY = this.brushHeight*3;

    if(this.gridWidth*50 >= this.gridHeight*62.5)
    {
      //base on width
      this.cellWidth = Settings.GAME.WIDTH / this.gridWidth;
      this.cellHeight = this.cellWidth/50*62.50;
    }
    else
    {
      //base on height
      this.cellHeight = (Settings.GAME.HEIGHT-playY) / this.gridHeight;
      this.cellWidth = (this.cellHeight)/62.5*50;//62.5;
    }

    var playX = (Settings.GAME.WIDTH - this.gridWidth*this.cellWidth)/2;
    this.playArea = {x:playX,y:playY, w: this.cellWidth*this.gridWidth, h: this.cellHeight*this.gridHeight};
    // this.playArea = {x:playX,y:25, w: this.cellWidth*this.gridWidth, h: this.cellHeight*this.gridHeight};

    this.brushes;
    this.currentBrush = 'brainy';
    this.brushDisplay;

    this.gridImages;
    this.eraserOn = false;
  },

  create: function() {
    Settings.GAME.LEVEL_MODE = 'builder';
    this.state.add('AdjustMenu',AdjustMenu);

    //Phaser this.graphics drawing engine 
    this.graphics = BnBgame.add.graphics(0,0);

    //draw grid
    this.graphics.lineStyle(2, 0xDDDDDD,0.5);

    //draw horizontal lines
    for(var i=0;i<=this.gridHeight;i++)
    {
        this.graphics.moveTo(this.playArea.x,this.playArea.y+i*this.cellHeight);
        this.graphics.lineTo(this.playArea.x + this.playArea.w,this.playArea.y+i*this.cellHeight);
    }

    //draw vertical lines
    for(var i=0;i<=this.gridWidth;i++)
    {
        this.graphics.moveTo(this.playArea.x+i*this.cellWidth,this.playArea.y);
        this.graphics.lineTo(this.playArea.x+i*this.cellWidth,this.playArea.y + this.playArea.h)
    }

    //brush palette
    this.brushes = BnBgame.add.group();
    this.createBrushPalette();

    this.gridImages = BnBgame.add.group();

    //grid images (placeholder)
    if(Settings.BUILDER.DATA.saved) 
    {
      for(var i=0;i<this.gridHeight;i++)
      {
        if(i >= Settings.BUILDER.DATA.height){
          for(var j=0;j<this.gridWidth;j++)
          {
            var newImage = this.gridImages.create(this.playArea.x+j*this.cellWidth,this.playArea.y+i*this.cellHeight,'floor')
            newImage.width = this.cellWidth;
            newImage.height = this.cellHeight;
            newImage.visible = false;
          }
        }
        else{
          for(var j=0;j<this.gridWidth;j++)
          {
            var currentFixedKey = Settings.BUILDER.DATA.fixed[i][j];
            var currentActiveKey = Settings.BUILDER.DATA.active[i][j];
            var newImage;
            if(currentFixedKey in bigKeyLookup)
            {
              newImage = this.gridImages.create(this.playArea.x+j*this.cellWidth,this.playArea.y+i*this.cellHeight,bigKeyLookup[currentFixedKey])
              newImage.visible = true;
            }
            else if(currentActiveKey in bigKeyLookup)
            {
              newImage = this.gridImages.create(this.playArea.x+j*this.cellWidth,this.playArea.y+i*this.cellHeight,bigKeyLookup[currentActiveKey])
              newImage.visible = true;
            }
            else
            {
              newImage = this.gridImages.create(this.playArea.x+j*this.cellWidth,this.playArea.y+i*this.cellHeight,'floor')
              newImage.visible = false;
            }
            
            newImage.width = this.cellWidth;
            newImage.height = this.cellHeight;
          }
        }
      }

      //overwerite old map in case of new dimensions
      this.printMap();
    }
    else
    {
      for(var i=0;i<this.gridHeight;i++)
      {
        for(var j=0;j<this.gridWidth;j++)
        {
          var newImage = this.gridImages.create(this.playArea.x+j*this.cellWidth,this.playArea.y+i*this.cellHeight,'floor')
          newImage.width = this.cellWidth;
          newImage.height = this.cellHeight;
          newImage.visible = false;
        }
      }
    }

    //ADD INPUT
    BnBgame.input.onTap.add(function() {
      this.useBrush();
    }, this);   

  },
  update: function() {
    // if(mouseJustPressed)
    // {
    //   this.useBrush();
    // }
  }
};





LevelBuilder.prototype.createBrushPalette = function()
{
  //show current brush
  this.brushDisplay = BnBgame.add.image(2,2,'brainy');
  this.brushDisplay.width = this.brushWidth;
  this.brushDisplay.height = this.brushHeight;
  this.graphics.lineStyle(3, 0x00FFFF, 1);
  this.graphics.drawRect(0, 0, this.brushWidth+4, this.brushHeight+4);

  this.brushes.create(0,0,'brainy');
  this.brushes.create(0,0,'brawny');
  this.brushes.create(0,0,'goalBrainy');
  this.brushes.create(0,0,'goalBrawny');
  this.brushes.create(0,0,'block');
  this.brushes.create(0,0,'spikedBlock');
  this.brushes.create(0,0,'pipe0');
  this.brushes.create(0,0,'breakable');

  this.brushes.create(0,0,'switchNew1A');
  this.brushes.create(0,0,'switchNew2A');
  this.brushes.create(0,0,'switchNew3A');
  this.brushes.create(0,0,'switchNew4A');
  this.brushes.create(0,0,'gateNew1C');
  this.brushes.create(0,0,'gateNew2C');
  this.brushes.create(0,0,'gateNew3C');
  this.brushes.create(0,0,'gateNew4C');

  this.brushes.create(0,0,'alien');
  this.brushes.create(0,0,'moveable');
  this.brushes.create(0,0,'spikey');

  // var refWidth = this.brushWidth;
  // var refHeight = this.brushHeight;
  // var refBrush = this.selectBrush;

  for(var i=0;i<this.brushes.length;i++)
  {
    var image = this.brushes.getAt(i);

    console.log("I was here!");
    image.inputEnabled=true;
    image.events.onInputDown.add(this.selectBrush, this);

    image.width = this.brushWidth;
    image.height = this.brushHeight;
  }
  // this.brushes.forEach(function(image)
  // {  
  //   console.log("I was here!");
  //   image.inputEnabled=true;
  //   image.events.onInputDown.add(refBrush, this);

  //   image.width = refWidth;
  //   image.height = refHeight;
  // });

  var brushX = this.brushWidth;
  var totalRows = 3;
  var currentColumn = 0;
  for(var i=0;i<this.brushes.length;i++)
  {
    var currentRow = i%totalRows;
    if(currentRow==0 && i!=0) currentColumn++;

    this.brushes.getAt(i).x = currentColumn*this.brushWidth+brushX;
    this.brushes.getAt(i).y = currentRow*this.brushHeight;
  }

  //Create PLAY button
  this.playButton = BnBgame.add.image(0,this.brushHeight*1.1,'playButton');
  //this.playButton = BnBgame.add.button(this.cellWidth+15,0,'button', this.printMap, this, 2, 1, 0, 1);
  // this.playButton.scale.setTo(0.3,0.3);
  this.playButton.width = this.brushWidth;
  this.playButton.height = this.brushHeight;
  this.playButton.inputEnabled=true;
  this.playButton.events.onInputDown.add(this.playLevel,this);

  this.eraseButton = BnBgame.add.image(0,this.brushHeight*2.1,'eraser');
  // this.eraseButton.scale.setTo(1.3,1.3);
  this.eraseButton.width = this.brushWidth;
  this.eraseButton.height = this.brushHeight;
  this.eraseButton.inputEnabled=true;
  this.eraseButton.events.onInputDown.add(this.toggleEraser,this);

  //Create Dimensions button
  this.sizeButton = BnBgame.add.image(Settings.GAME.WIDTH-this.brushWidth,this.brushHeight*2,'dimensions');
  this.sizeButton.width = this.brushWidth;
  this.sizeButton.height = this.brushHeight;
  this.sizeButton.inputEnabled = true;
  this.sizeButton.events.onInputDown.add(this.changeDimensions,this);

  //create save button
  this.saveButton = BnBgame.add.image(Settings.GAME.WIDTH-this.brushWidth,this.brushHeight,'saveIcon');
  this.saveButton.width = this.brushWidth;
  this.saveButton.height = this.brushHeight;
  this.saveButton.inputEnabled = true;
  this.saveButton.events.onInputDown.add(this.saveLevel,this);

  return this.brushHeight*3;
}



LevelBuilder.prototype.selectBrush = function(image)
{
  // console.log("selected: " + image.key);
  this.currentBrush = image.key;
  console.log("selected brush: " + this.currentBrush);
  

  this.eraserOn = false;
  this.brushDisplay.loadTexture(this.currentBrush);
  this.brushDisplay.visible = true;
}

LevelBuilder.prototype.useBrush = function()
{
  var mouseX = BnBgame.input.x;
  var mouseY = BnBgame.input.y;

  if(mouseX >= this.playArea.x && mouseX <= (this.playArea.x+this.playArea.w) && mouseY >= this.playArea.y && mouseY <= (this.playArea.y+this.playArea.h))
  {
    var gridCoordinates = this.screenToGridCoordinates(mouseX,mouseY);
    this.drawBrushImage(gridCoordinates.x,gridCoordinates.y);
  }

  if(BnBgame.input.keyboard.isDown(Phaser.Keyboard.P))
  {
    // this.printMap();
  }
}

LevelBuilder.prototype.drawBrushImage = function(cellX,cellY)
{
  // if(keyIsDown('E'))
  if(BnBgame.input.keyboard.isDown(Phaser.Keyboard.E) || this.eraserOn)
  {
    this.gridImages.getAt(cellY*this.gridWidth+cellX).visible = false;
    this.gridImages.getAt(cellY*this.gridWidth+cellX).loadTexture('floor');
  }
  else
  {
    this.gridImages.getAt(cellY*this.gridWidth+cellX).visible = true;
    this.gridImages.getAt(cellY*this.gridWidth+cellX).loadTexture(this.currentBrush);
  }
}


LevelBuilder.prototype.screenToGridCoordinates = function(screenX,screenY)
{
  if(screenX >= this.playArea.x && screenX <= (this.playArea.x+this.playArea.w) && screenY >= this.playArea.y && screenY <= (this.playArea.y+this.playArea.h))
  {
    //get relative screen coordinates
    var relX = screenX-this.playArea.x;
    var relY = screenY-this.playArea.y;

    cellX = 0;
    for(var i=0;i<=this.gridWidth;i++)
    {
      if(relX > i*this.cellWidth)
      {
        cellX = i;
      }
    }

    for(var i=0;i<=this.gridHeight;i++)
    {
      if(relY > i*this.cellHeight)
      {
        cellY = i;
      }
    }

    console.log("cell: (" + cellX + "," + cellY + ")");
    return {x:cellX,y:cellY};
  }
  else
  {
    //something went wrong!
    console.log("something went wrong!");
  }
}

//update saved data & print to console
LevelBuilder.prototype.printMap = function()
{
  Settings.BUILDER.DATA.name = "test";
  Settings.BUILDER.DATA.height = this.gridHeight;
  Settings.BUILDER.DATA.width =this.gridWidth;
  Settings.BUILDER.DATA.active = [];
  Settings.BUILDER.DATA.fixed = [];

  var string1 = "{\n";
  string1 += "\"name\": \"Exported Level\",\n";
  string1 += "\"width\": " + this.gridWidth +",\n";
  string1 += "\"height\": " + this.gridHeight + ",\n";
  
  //ACTIVE array
  var string2 = "\"active\": [\n";
  for(var i=0;i<this.gridHeight;i++)
  {
    string2 += "[";
    Settings.BUILDER.DATA.active.push([]);
    for(var j=0;j<this.gridWidth;j++)
    {
      var key = this.gridImages.getAt(i*this.gridWidth+j).key;
      var stringToAdd = " ";
      if(key in activeKeyChar){
        stringToAdd = activeKeyChar[key];
      }
      
      string2 += "\"" + stringToAdd + "\"";

      //add comma if not the last element
      if(j < this.gridWidth-1) string2 += ","; 
      
      Settings.BUILDER.DATA.active[i].push(stringToAdd);
    }
    if(i < this.gridHeight-1) {
      string2 += "],\n";
    }
    else{
      string2 += "]\n";
    }
  } 
  string2 += "],\n" 

  //FIXED array
  var string3 = "\"fixed\": [\n";
  for(var i=0;i<this.gridHeight;i++)
  {
    string3 += "[";
    Settings.BUILDER.DATA.fixed.push([]);
    for(var j=0;j<this.gridWidth;j++)
    {
      var key = this.gridImages.getAt(i*this.gridWidth+j).key;
      var stringToAdd = " ";
      if(key in fixedKeyChar){
        stringToAdd = fixedKeyChar[key];
      }
      string3 += "\"" + stringToAdd + "\"";

      //add comma if not the last element
      if(j < this.gridWidth-1) string3 += ","; 

      Settings.BUILDER.DATA.fixed[i].push(stringToAdd);
    }
    if(i < this.gridHeight-1) {
      string3 += "],\n";
    }
    else{
      string3 += "]\n";
    }

  } 
  string3 += "]\n" 

  console.log(string1 + "\n" + string2 + "\n" + string3 + "\n}");


  //create copy of saved level data + save it to STATE
  var passingData = Phaser.Utils.extend(true,Settings.BUILDER.DATA);
  this.state.add('testLevel',new Level(0,passingData));

  Settings.BUILDER.DATA.saved = true;
};

LevelBuilder.prototype.changeDimensions = function()
{
  this.printMap();
  this.state.start('AdjustMenu');
}

LevelBuilder.prototype.toggleEraser = function()
{
  this.eraserOn = true;
  this.brushDisplay.visible = false;
}

LevelBuilder.prototype.saveLevel = function()
{
  //update saved data json
  this.printMap();

  var data = Settings.BUILDER.DATA;

  //turn data into BLOB
  var json = JSON.stringify(data);
  var blob = new Blob([json], {type: "application/json"});
  var url  = URL.createObjectURL(blob);

  //create new window + add DOWNLOAD link
  var myWindow = window.open("", '_blank');
  myWindow.document.write("<a href=\"" + url + "\" download=\"my_level.json\">DOWNLOAD</a>");
}

LevelBuilder.prototype.playLevel = function()
{
  this.printMap();
  this.state.start('testLevel');
};