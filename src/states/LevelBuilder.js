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
// var BrainAndBrawn.SaveData.workingLevel = {};

BrainAndBrawn.LevelBuilder = function() {
  BrainAndBrawn.SaveData.workingLevel.saved = false;
};

BrainAndBrawn.LevelBuilder.prototype = {

    init: function()
    {
        //Settings
        C.BOUNDS_DEATH = false;

        //brush panel variables
        this.brushWidth = C.WIDTH/9;
        this.brushHeight = this.brushWidth;

        this.gridWidth = C.GRID_X;
        this.gridHeight = C.GRID_Y;

        //play space offsetY
        var playY = this.brushHeight*3;

        if(this.gridWidth*50 >= this.gridHeight*62.5)
        {
            //base on width
            this.cellWidth = C.WIDTH / this.gridWidth;
            this.cellHeight = this.cellWidth/50*62.50;
        }
        else
        {
            //base on height
            this.cellHeight = (C.HEIGHT-playY) / this.gridHeight;
            this.cellWidth = (this.cellHeight)/62.5*50;//62.5;
        }

        var playX = (C.WIDTH - this.gridWidth*this.cellWidth)/2;
        this.playArea = {x:playX,y:playY, w: this.cellWidth*this.gridWidth, h: this.cellHeight*this.gridHeight};
        // this.playArea = {x:playX,y:25, w: this.cellWidth*this.gridWidth, h: this.cellHeight*this.gridHeight};

        this.brushes;
        this.currentBrush = 'brainy';
        this.brushDisplay;

        this.gridImages;
        this.eraserOn = false;
    },

    create: function() {
        C.LEVEL_MODE = 'builder';
        this.state.add('AdjustMenu',BrainAndBrawn.AdjustMenu);

        //Phaser this.graphics drawing engine 
        this.graphics = game.add.graphics(0,0);

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
        this.brushes = game.add.group();
        this.createBrushPalette();

        this.gridImages = game.add.group();

        //grid images (placeholder)
        if(BrainAndBrawn.SaveData.workingLevel.saved) 
        {
            for(var i=0;i<this.gridHeight;i++)
            {
                if(i >= BrainAndBrawn.SaveData.workingLevel.height){
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
                        var currentFixedKey = BrainAndBrawn.SaveData.workingLevel.fixed[i][j];
                        var currentActiveKey = BrainAndBrawn.SaveData.workingLevel.active[i][j];
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
        game.input.onTap.add(function() {
          this.useBrush();
        }, this);   

    },

    update: function() {
        // if(mouseJustPressed)
        // {
        //   this.useBrush();
        // }
    },





    createBrushPalette: function()
    {
        //show current brush
        this.brushDisplay = game.add.image(2,2,'brainy');
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
        this.playButton = game.add.image(0,this.brushHeight*1.1,'playButton');
        //this.playButton = game.add.button(this.cellWidth+15,0,'button', this.printMap, this, 2, 1, 0, 1);
        // this.playButton.scale.setTo(0.3,0.3);
        this.playButton.width = this.brushWidth;
        this.playButton.height = this.brushHeight;
        this.playButton.inputEnabled=true;
        this.playButton.events.onInputDown.add(this.playLevel,this);

        this.eraseButton = game.add.image(0,this.brushHeight*2.1,'eraser');
        // this.eraseButton.scale.setTo(1.3,1.3);
        this.eraseButton.width = this.brushWidth;
        this.eraseButton.height = this.brushHeight;
        this.eraseButton.inputEnabled=true;
        this.eraseButton.events.onInputDown.add(this.toggleEraser,this);

        //Create Dimensions button
        this.sizeButton = game.add.image(C.WIDTH-this.brushWidth,this.brushHeight*2,'dimensions');
        this.sizeButton.width = this.brushWidth;
        this.sizeButton.height = this.brushHeight;
        this.sizeButton.inputEnabled = true;
        this.sizeButton.events.onInputDown.add(this.changeDimensions,this);

        //create save button
        this.saveButton = game.add.image(C.WIDTH-this.brushWidth,0,'saveIcon');
        this.saveButton.width = this.brushWidth;
        this.saveButton.height = this.brushHeight;
        this.saveButton.inputEnabled = true;
        this.saveButton.events.onInputDown.add(this.saveLevel,this);

        //create flip button
        this.flipButton = game.add.image(C.WIDTH-this.brushWidth,this.brushHeight,'flipIcon');
        this.flipButton.width = this.brushWidth;
        this.flipButton.height = this.brushHeight;
        this.flipButton.inputEnabled = true;
        this.flipButton.events.onInputDown.add(this.flipLevel,this);

        return this.brushHeight*3;
    },



    selectBrush: function(image)
    {
        // console.log("selected: " + image.key);
        this.currentBrush = image.key;
        console.log("selected brush: " + this.currentBrush);


        this.eraserOn = false;
        this.brushDisplay.loadTexture(this.currentBrush);
        this.brushDisplay.visible = true;
    },

    useBrush: function()
    {
        var mouseX = game.input.x;
        var mouseY = game.input.y;

        if(mouseX >= this.playArea.x && mouseX <= (this.playArea.x+this.playArea.w) && mouseY >= this.playArea.y && mouseY <= (this.playArea.y+this.playArea.h))
        {
            var gridCoordinates = this.screenToGridCoordinates(mouseX,mouseY);
            this.drawBrushImage(gridCoordinates.x,gridCoordinates.y);
        }

        if(game.input.keyboard.isDown(Phaser.Keyboard.P))
        {
           // this.printMap();
        }
    },

    drawBrushImage: function(cellX,cellY)
    {
        // if(keyIsDown('E'))
        if(game.input.keyboard.isDown(Phaser.Keyboard.E) || this.eraserOn)
        {
            this.gridImages.getAt(cellY*this.gridWidth+cellX).visible = false;
            this.gridImages.getAt(cellY*this.gridWidth+cellX).loadTexture('floor');
        }
        else
        {
            this.gridImages.getAt(cellY*this.gridWidth+cellX).visible = true;
            this.gridImages.getAt(cellY*this.gridWidth+cellX).loadTexture(this.currentBrush);
        }
    },


    screenToGridCoordinates: function(screenX,screenY)
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
    },

    //update saved data & print to console
    printMap: function()
    {
        //save to global
        C.GRID_X = this.gridWidth;
        C.GRID_Y = this.gridHeight;

        //save to save data
        BrainAndBrawn.SaveData.workingLevel.name = "test";
        BrainAndBrawn.SaveData.workingLevel.height = this.gridHeight;
        BrainAndBrawn.SaveData.workingLevel.width =this.gridWidth;
        BrainAndBrawn.SaveData.workingLevel.active = [];
        BrainAndBrawn.SaveData.workingLevel.fixed = [];

        //If no star levels - save some!
        if(typeof BrainAndBrawn.SaveData.workingLevel.starLevels == 'undefined' || BrainAndBrawn.SaveData.workingLevel.starLevels.length != 2)
        {
            //TEMP - placeholder #s
            BrainAndBrawn.SaveData.workingLevel.starLevels = [12,8];
        }

        var string1 = "{\n";
        string1 += "\"name\": \"Exported Level\",\n";
        string1 += "\"width\": " + this.gridWidth +",\n";
        string1 += "\"height\": " + this.gridHeight + ",\n";

        //ACTIVE array
        var string2 = "\"active\": [\n";
        for(var i=0;i<this.gridHeight;i++)
        {
            string2 += "[";
            BrainAndBrawn.SaveData.workingLevel.active.push([]);
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

                BrainAndBrawn.SaveData.workingLevel.active[i].push(stringToAdd);
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
            BrainAndBrawn.SaveData.workingLevel.fixed.push([]);
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

                BrainAndBrawn.SaveData.workingLevel.fixed[i].push(stringToAdd);
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
        var passingData = Phaser.Utils.extend(true,BrainAndBrawn.SaveData.workingLevel);
        this.state.add('testLevel',new BrainAndBrawn.Level(0,passingData));

        BrainAndBrawn.SaveData.workingLevel.saved = true;
    },

    changeDimensions: function()
    {
        this.printMap();
        this.state.start('AdjustMenu');
    },

    toggleEraser: function()
    {
        this.eraserOn = true;
        this.brushDisplay.visible = false;
    },

    saveLevel: function()
    {
        //update saved data json
        this.printMap();

        var data = BrainAndBrawn.SaveData.workingLevel;

        //turn data into BLOB
        var json = JSON.stringify(data);
        var blob = new Blob([json], {type: "application/json"});
        var url  = URL.createObjectURL(blob);

        //create new window + add DOWNLOAD link
        var myWindow = window.open("", '_blank');
        myWindow.document.write("<a href=\"" + url + "\" download=\"my_level.json\">DOWNLOAD</a>");
    },

    flipLevel: function()
    {
        //save key array (current dimensions)
        var keys = [];
        for(var i=0;i<this.gridWidth;i++)
        {
            for(var j=0;j<this.gridHeight;j++)
            {
                keys.push(this.gridImages.getAt(j*this.gridWidth+i).key);
            }
        }

        //flip dimensions
        var w = this.gridHeight;
        var h = this.gridWidth;
        this.gridHeight = h;
        this.gridWidth = w;

        //dump gridImages and refill
        this.gridImages.removeAll(true);
        for(var i=0;i<h;i++)
        {
            for(var j=0;j<w;j++)
            {
                //add new image to gridImages
                var currentKey = keys[i*w+j];
                this.gridImages.create(0,0,currentKey);
                //NOTE: position doesn't matter because we are not adding
            }
        }

        //save changes to temp object
        this.printMap();

        //restart state to SEE the changes
        game.state.start('LevelBuilder');
    },

    playLevel: function()
    {
        this.printMap();
        this.state.start('testLevel');
    },
};