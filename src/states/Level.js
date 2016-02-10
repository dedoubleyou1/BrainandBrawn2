/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   __                _     
  / /  _____   _____| | 
 / /  / _ \ \ / / _ \ |
/ /__|  __/\ V /  __/ |
\____/\___| \_/ \___|_|
                           

Summary: Core gameplay state - manages all gameplay that occurs inside of a level. 

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.Level = function() {};

BnB.Level.prototype = {

// - - - - - - - - - - - - //
// SETUP functions
// - - - - - - - - - - - - //

    init: function(level,levelData){
        this.level = level;
        if(typeof levelData != 'undefined') this.levelData = levelData;
    },

    /*
		Initialize manager - gameLogic, graphicsManager,inputManager
		Initialize all game variables
		Initialize HUD and gameplay space
	*/
	create: function() {
		//set up level data
        if(BnB.levelType == 'normal')
		{
			this.levelData = JSON.parse(game.cache.getText('level'+this.level));
		}
		this.width = this.levelData.width;
		this.height = this.levelData.length;

        //set up managers
		this.gameLogic = new BnB.GameLogic(this.levelData);
		this.graphicsManager = new BnB.GraphicsManager(this.levelData);
		this.inputManager = new BnB.InputManager('waiting');
		
        //initialize settings
        this.tutorialFinished = false;
		this.levelFinished = false;
		this.numMoves = 0;

		//set STAR levels
		this.currentStarLevel = 3;
      	this.starLevels = [20,10];//defult
      	if(typeof this.levelData.starLevels != 'undefined'){
      		this.starLevels = this.levelData.starLevels;
      	}

		//Set up the HUD
		this.setUpHUD();

      	//TEMP: support level builder entry
      	if(BnB.levelType == 'builder') this.enableBuilderMode();

        //start tutorial if it exists
		if (typeof this.levelData.tutorial != 'undefined') {
			this.currentTutorial = 0;
			this.startTutorial();
		} else {
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		}

        //Set up DEBUG input
        this.nextKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
        this.nextKey.onUp.add(this.skipLevel,this);
        this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.restartKey.onUp.add(this.restartLevel,this);
        this.printKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.printKey.onUp.add(this.printMap,this);
        //end DEBUG input
	},

    /*
        called from CREATE - set up HUD elements
    */
    setUpHUD: function(){
        var levelName = "";
        if(this.levelData.name != "test" && this.levelData.name != "Exported Level"){
            levelName = ": " + this.levelData.name;
        }

        this.moveText = this.add.text(200,15,('Moves: '+"0/"+this.starLevels[1]), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
        this.levelText = this.add.text(15,BnB.C.HEIGHT-30,('Level '+(this.level+1) + levelName), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
        
        this.restartButton = this.add.image(570,2,'rButton');
        this.restartButtonBig = this.add.image(500,-30,'rButton');
        this.restartButtonBig.scale.setTo(2.5,2.5);
        this.restartButtonBig.inputEnabled = true;
        this.restartButtonBig.events.onInputDown.add(this.restartLevel,this);
        this.restartButtonBig.alpha = 0;
        
        this.menuButton = this.add.image(20,8,'mButton');
        this.menuButton.scale.setTo(0.8,0.8);
        this.menuButtonBig = this.add.image(0,-12,'mButton');
        this.menuButtonBig.scale.setTo(2,2);
        this.menuButtonBig.inputEnabled = true;
        this.menuButtonBig.events.onInputDown.add(this.returnToLevelSelect,this);
        this.menuButtonBig.alpha = 0;

        this.starsHUD = this.add.group();   
        this.updateStars(3);
    },

    /*
        This is a test level accesed from the BUILDER
    */
    enableBuilderMode: function()
    {
        //hide HUD
        this.levelText.visible = false;
        this.menuButton.visible = false;
        this.menuButtonBig.visible = false;
        this.restartButton.visible = false;
        this.restartButtonBig.visible = false;
        this.starsHUD.visible = false;

        //add STOP button
        this.stopButton = this.add.image(0,0,'stopButton');
        this.stopButton.scale.setTo(0.1,0.1);
        this.stopButton.inputEnabled=true;
        this.stopButton.events.onInputDown.add(function(){this.state.start('LevelBuilder');},this);
    },


// - - - - - - - - - - - - //
// UPDATE functions
// - - - - - - - - - - - - //

	/*
		CORE UPDATE (called each step)
		Control the game using a system of flags
	*/
	update: function() {
		//refresh graphics
        this.graphicsManager.refresh();

        if(this.inputManager.state == 'ready'){
            //Do nothing
        }
		else if (this.inputManager.state === 'swiping') {
            //player is dragging finger
            this.doSwipingOffset();
		} else if (this.inputManager.state == 'moving') {
            //player completed a successful swipe
            this.startMoving();
		}
		else if (this.inputManager.state === 'waiting' && this.graphicsManager.areAnimationsFinished() && this.tutorialFinished && !this.levelFinished) {
			this.finishMoving();
		}
	},

    //offset player chars during player finger drag
    doSwipingOffset: function()
    {
        //dragging finger - shift BnB based on swiping offset
        var swipeOffset = this.inputManager.getSwipingOffset();
        var swipeDirection = BnB.Util.getDirection(swipeOffset);
        if (swipeDirection === 'left' || swipeDirection === 'right') {
            this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.x);
        } else if (swipeDirection === 'up' || swipeDirection === 'down') {
            this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.y);
        }
    },

    //start player/gravity movement
    startMoving: function()
    {
        //update logic and set the RESULTS
        this.results = this.gameLogic.gravitySwitch(this.inputManager.direction);

        //update graphics based on the results
        this.graphicsManager.updateGraphics(this.results);

        //WAIT for movement to finish
        this.inputManager.state = 'waiting';
    },

    //called when all animations are complete
    finishMoving: function()
    {
        //Check for a successful move
        if(this.results.moveSuccess){
            this.onMoveComplete();
        }

        //check for the END state (possible without a successful move?)
        if(!this.checkEndState()){
            //Ready for more input!
            this.inputManager.state = 'ready';
        }
    },

    //Called when animations finish and a successful move was completed
    onMoveComplete: function()
    {
        BnB.Util.playSound('thunk');
        
        //update # of moves
        if(this.numMoves<99)this.numMoves++;
        
        this.updateHUD();
    },

    //Based on results - check if we shoudl end the level (good or bad)
    checkEndState: function()
    {
        if (this.results.endState === 'brainyEaten' || this.results.endState === 'brainyLost' || this.results.endState === 'brawnyLost' || BnB.C.SPIKEY_DEATH) {
            BnB.Util.playSound('death');
            BnB.C.SPIKEY_DEATH = false;//TEMP HACK
            this.restartLevel();
            return true;
        } else if (this.results.endState === 'missionSuccess'){
            this.loadVictory();
            return true;
        }

        return false;
    },

    /*
        Called when a successul move is completed
    */
    updateHUD: function()
    {
        //Display # of Moves
        var moveTextDisplay = "Moves: " + this.numMoves;
        if(this.numMoves <=this.starLevels[1]){
            moveTextDisplay += "/" + this.starLevels[1];    
        }
        else if(this.numMoves <=this.starLevels[0]){
            moveTextDisplay += "/" + this.starLevels[0];
        }
        this.moveText.text = moveTextDisplay;

        //update stars in the HUD
        if(this.currentStarLevel == 3 && this.numMoves > this.starLevels[1]){
            this.updateStars(2);
        }
        else if(this.currentStarLevel == 2 && this.numMoves > this.starLevels[0]){
            this.updateStars(1);
        }
    },

    /*
        Draw 1-3 stars in the HUD (based on number of player moves)
    */
    updateStars: function(numStars)
    {
        this.currentStarLevel = numStars;
        this.starsHUD.removeAll(true);

        var starX = 510;
        var starY = 30;

        if(numStars == 3){
            this.createStar(starX-13,starY-10);
            this.createStar(starX+13,starY-10);
            this.createStar(starX,starY+10);
        } else if(numStars == 2){
            this.createStar(starX-10,starY);
            this.createStar(starX+15,starY);
        } else {
            this.createStar(starX,starY);
        }
    },

    /*
        Dynamically create a star
    */
    createStar: function(posX,posY)
    {
        var star = this.add.image(posX,posY,'star');
        star.anchor = {x: 0.5, y: 0.5};
        star.scale.setTo(0.5,0.5);
        this.starsHUD.add(star);
    },





// - - - - - - - - - - - - //
// SCREENS
// - - - - - - - - - - - - //

	/*
		Draw a "tutorial screen" on top of the game (player taps to continue)
	*/
	startTutorial: function() {
		BnB.Util.playSound('select');
		this.fadeOutGraphic = this.add.graphics(0, 0);
	   	this.fadeOutGraphic.beginFill(0x000000, 0.8);
	    this.fadeOutGraphic.drawRect(0, 0, BnB.C.WIDTH, BnB.C.HEIGHT);
	    this.fadeOutGraphic.endFill();
    
		this.tutorialImage = this.add.sprite(BnB.C.WIDTH / 2, BnB.C.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
		this.tutorialImage.anchor = {x: 0.5, y: 0.5};
		this.tutorialImage.scale.multiply(BnB.scale, BnB.scale);
		
		//If player taps OR presses any key - change slides
		game.input.onTap.add(this.nextTutorial, this);
		game.input.keyboard.addCallbacks(this,null,this.nextTutorial);
	},

	/*
		onTap - load the next tutorial screen OR start the level 
	*/
	nextTutorial: function()
	{
		if(this.tutorialFinished) return;

		BnB.Util.playSound('select');

		this.currentTutorial += 1;
		this.tutorialImage.destroy();

		if (this.currentTutorial === this.levelData.tutorial.length) {
			this.fadeOutGraphic.visible = false;
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		} else {
			this.tutorialImage = this.add.sprite(BnB.C.WIDTH / 2, BnB.C.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
			this.tutorialImage.anchor = {x: 0.5, y: 0.5};
			this.tutorialImage.scale.multiply(BnB.scale, BnB.scale);
		}
	},

	/*
		upon level completion - load a VICTORY screen over the game
	*/
	loadVictory: function()
	{
		if(this.tutorialFinished){
			BnB.Util.playSound('finish');
			this.levelFinished = true;
			this.inputManager.state = 'waiting';

			//Save stars
			if(this.currentStarLevel > BnB.SaveData.levelStatus[this.level]){
				BnB.SaveData.levelStatus[this.level] = this.currentStarLevel;
			}

			//unlock next level
			if(this.level+1 < BnB.SaveData.levelStatus.length)
			{
				if(BnB.SaveData.levelStatus[this.level+1] == -1){
					BnB.SaveData.levelStatus[this.level+1] = 0; //unlocked
				}
			}

			this.fadeOutGraphic = this.add.graphics(0, 0);
    	   	this.fadeOutGraphic.beginFill(0x000000, 0.8);
    	    this.fadeOutGraphic.drawRect(0, 0, BnB.C.WIDTH, BnB.C.HEIGHT);
    	    this.fadeOutGraphic.endFill();

    	    this.victoryImage = this.add.sprite(BnB.C.WIDTH / 2, BnB.C.HEIGHT / 3, ('star'+this.currentStarLevel));
			this.victoryImage.anchor = {x: 0.5, y: 0.5};
			// this.victoryImage.scale.multiply(BnB.scale, BnB.scale);
	  
			//input for next level
			// game.input.onTap.add(this.nextLevel, this);
			// game.input.keyboard.addCallbacks(this,null,this.nextLevel);
			this.newGroup = this.add.group();

			this.restartButtonBig.alpha = 1;
			this.restartButtonBig.x = 80;
			this.restartButtonBig.y = 600;
			this.newGroup.add(this.restartButtonBig);

			this.playButton = this.add.image(400,600,'pButton');
			this.playButton.scale.setTo(2.5,2.5);
			this.playButton.inputEnabled = true;
  		this.playButton.events.onInputDown.add(this.nextLevel,this);
			this.newGroup.add(this.playButton);
		}
	},





// - - - - - - - - - - - - //
// STATE CHANGE functions
// - - - - - - - - - - - - //

	/*
		load the next level state
	*/
	nextLevel: function()
	{
    if(BnB.levelType == 'builder'){
        this.state.start('LevelBuilder');
    }
		else if(this.tutorialFinished)
		{
			BnB.Util.playSound('select');
			game.input.keyboard.addCallbacks(this,null,null);
			//load next level (unless we're at the end)
			if (this.level+1 === BnB.levels.length) {
				this.state.start('LevelSelect',true,false,0);
			} else {
                BnB.Util.goToLevel(this.level+1);
			}
		}
	},

	/*
		restart the current level state
	*/
	restartLevel: function()
	{
		if(this.tutorialFinished){
			BnB.Util.playSound('select');

			if(BnB.levelType == 'normal')
			{
                BnB.Util.goToLevel(this.level);
			}
			else
			{
				this.state.start('LevelBuilder');
			}
		}
	},

	/*
		Return to the level select menu
	*/
	returnToLevelSelect: function()
	{
		if(this.tutorialFinished){
			BnB.Util.playSound('select');

            var pageNum = Math.floor(this.level/BnB.C.LEVELS_PER_PAGE);

			this.state.start('LevelSelect',true,false,pageNum*BnB.C.LEVELS_PER_PAGE);
		}
	},

	/*
		SKIP the current level (jump to then next level)
	*/
	skipLevel: function()
	{
		this.numMoves = 0;
		BnB.SaveData.levelStatus[this.level] = 0;

		//unlock next level if necessary
		if(this.level+1 < BnB.SaveData.levelStatus.length)
		{
			if(BnB.SaveData.levelStatus[this.level+1] == -1){
				BnB.SaveData.levelStatus[this.level+1] = 0; //unlocked
			}
		}

		this.nextLevel();
	},




// - - - - - - - - - - - - //
// DEBUG functions
// - - - - - - - - - - - - //

	/*
		PRINT the coordinate grid in the console
		(TODO: check if redundant with graphics manager?)
	*/
	printMap: function()
	{
	  var string1 = "{\n";
	  string1 += "\"name\": \"Exported Level\",\n";
	  string1 += "\"width\": " + this.levelData.height +",\n";
	  string1 += "\"height\": " + this.levelData.width + ",\n";
	  
	  //ACTIVE array
	  var string2 = "\"active\": [\n";
	  for(var i=0;i<this.levelData.width;i++)
	  {
	    string2 += "[";
	    for(var j=0;j<this.levelData.height;j++)
	    {
	      var stringToAdd = this.levelData.active[j][i];
	      string2 += "\"" + stringToAdd + "\"";

	      //add comma if not the last element
	      if(j < this.levelData.height-1) string2 += ","; 
	    }
	    if(i < this.levelData.width-1) {
	      string2 += "],\n";
	    }
	    else{
	      string2 += "]\n";
	    }
	  } 
	  string2 += "],\n" 

	  //FIXED array
	  var string3 = "\"fixed\": [\n";
	  for(var i=0;i<this.levelData.width;i++)
	  {
	    string3 += "[";
	    for(var j=0;j<this.levelData.height;j++)
	    {
	      var stringToAdd = this.levelData.fixed[j][i];
	      string3 += "\"" + stringToAdd + "\"";

	      //add comma if not the last element
	      if(j < this.levelData.height-1) string3 += ","; 


	    }
	    if(i < this.levelData.width-1) {
	      string3 += "],\n";
	    }
	    else{
	      string3 += "]\n";
	    }

	  } 
	  string3 += "]\n" 

	  console.log(string1 + "\n" + string2 + "\n" + string3 + "\n}");
	},

};
