/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   __                _     
  / /  _____   _____| |___ 
 / /  / _ \ \ / / _ \ / __|
/ /__|  __/\ V /  __/ \__ \
\____/\___| \_/ \___|_|___/
                           

Summary: Core gameplay state - manages all gameplay that occurs inside of a level. 

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Level = function(level,levelData) {
	this.level = level;
	if(typeof levelData != 'undefined') this.levelData = levelData;
};

Level.prototype = {
	/*
		Initialize manager - gameLogic, graphicsManager,inputManager
		Initialize all game variables
		Initialize HUD and gameplay space
	*/
	create: function() {
		if(Settings.GAME.LEVEL_MODE == 'normal')
		{
			this.levelData = JSON.parse(game.cache.getText('level'+this.level));
		}
		this.width = this.levelData.width;
		this.height = this.levelData.length;
		this.gameLogic = new GameLogic(this.levelData);
		this.graphicsManager = new GraphicsManager(this.levelData);
		this.inputManager = new InputManager('waiting');
		this.tutorialFinished = false;
		this.levelFinished = false;
		this.numMoves = 0;

		//set STAR levels
		this.currentStarLevel = 3;
      	this.starLevels = [20,10];
      	if(typeof this.levelData.starLevels != 'undefined'){
      		this.starLevels = this.levelData.starLevels;
      	}

		//DEBUG input
		this.nextKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
		this.nextKey.onUp.add(this.skipLevel,this);
		this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
		this.restartKey.onUp.add(this.restartLevel,this);
		this.printKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
		this.printKey.onUp.add(this.printMap,this);
		//end DEBUG input

		//HUD elements
		//this.spriteHUD = game.add.sprite(0,0,'imageHUD');
		//this.spriteHUD.width = Settings.GAME.WIDTH;
		this.levelText = game.add.text(100,15,('Level '+(this.level+1)), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
  	this.moveText = game.add.text(300,15,('Moves: '+"0/"+this.starLevels[1]), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
  	
  	this.restartButton = game.add.image(570,2,'rButton');
  	this.restartButtonBig = game.add.image(500,-30,'rButton');
  	this.restartButtonBig.scale.setTo(2.5,2.5);
  	this.restartButtonBig.inputEnabled = true;
  	this.restartButtonBig.events.onInputDown.add(this.restartLevel,this);
  	this.restartButtonBig.alpha = 0;
  	
  	this.menuButton = game.add.image(20,8,'mButton');
  	this.menuButton.scale.setTo(0.8,0.8);
  	this.menuButtonBig = game.add.image(0,-12,'mButton');
  	this.menuButtonBig.scale.setTo(2,2);
  	this.menuButtonBig.inputEnabled = true;
  	this.menuButtonBig.events.onInputDown.add(this.returnToLevelSelect,this);
  	this.menuButtonBig.alpha = 0;

  	this.starsHUD = game.add.group();  	
  	this.drawStarsHUD(3);


  	//TEMP: support level builder entry
  	if(Settings.GAME.LEVEL_MODE == 'builder')
  	{
  		//hide HUD
  		this.levelText.visible = false;
  		this.menuButton.visible = false;
  		this.menuButtonBig.visible = false;
  		this.restartButton.visible = false;
  		this.restartButtonBig.visible = false;
  		this.starsHUD.visible = false;

  		//add STOP button
  		this.stopButton = game.add.image(0,0,'stopButton');
	    this.stopButton.scale.setTo(0.1,0.1);
	    this.stopButton.inputEnabled=true;
	    this.stopButton.events.onInputDown.add(function(){this.state.start('LevelBuilder');},this);
  	}


		if (typeof this.levelData.tutorial != 'undefined') {
			this.currentTutorial = 0;
			this.startTutorial();
		} else {
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		}
	},

	/*
		CORE UPDATE (called each step)
		Control the game using a system of flags
	*/
	update: function() {
		this.graphicsManager.refresh();


		if (this.inputManager.state === 'swiping') {
            //dragging finger - shift BnB based on swiping offset
			var swipeOffset = this.inputManager.getSwipingOffset();
			var swipeDirection = getDirection(swipeOffset);
			if (swipeDirection === 'left' || swipeDirection === 'right') {
				this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.x);
			} else if (swipeDirection === 'up' || swipeDirection === 'down') {
				this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.y);
			}
		} else if (this.inputManager.state == 'moving') {
            //successful swipe - brainy & brawny are moving
			this.results = this.gameLogic.gravitySwitch(this.inputManager.direction);
			this.graphicsManager.updateGraphics(this.results);
			this.inputManager.state = 'waiting';
		}


		if (this.inputManager.state === 'waiting' && this.graphicsManager.areAnimationsFinished() && this.tutorialFinished && !this.levelFinished) {
			this.inputManager.state = 'ready';

			//if the move was successful (something moved) - update the move counter
			if(this.results.moveSuccess){
				playSound('thunk');
				//update MOVE counter
				if(this.numMoves<99)this.numMoves++;
				//Display # of Moves
				var moveTextDisplay = "";

			  moveTextDisplay = 'Moves: ' + this.numMoves;

			  if(this.numMoves <=this.starLevels[1]){
			  	moveTextDisplay += "/" + this.starLevels[1];	
			  }
			  else if(this.numMoves <=this.starLevels[0]){
			  	moveTextDisplay += "/" + this.starLevels[0];
			  }
			  this.moveText.text = moveTextDisplay;

			  if(this.currentStarLevel == 3 && this.numMoves > this.starLevels[1]){
			  	this.drawStarsHUD(2);
			  }
			  else if(this.currentStarLevel == 2 && this.numMoves > this.starLevels[0]){
			  	this.drawStarsHUD(1);
			  }
			}

			if (this.results.endState === 'brainyEaten' || this.results.endState === 'brainyLost' || this.results.endState === 'brawnyLost' || Settings.GAME.SPIKEY_DEATH) {
				playSound('death');
				Settings.GAME.SPIKEY_DEATH = false;//TEMP HACK
				this.restartLevel();
			} else if (this.results.endState === 'missionSuccess'){
                this.loadVictory();
			}
		}
	},

	/*
		Draw a "tutorial screen" on top of the game (player taps to continue)
	*/
	startTutorial: function() {
		playSound('select');
		this.fadeOutGraphic = game.add.graphics(0, 0);
	   	this.fadeOutGraphic.beginFill(0x000000, 0.8);
	    this.fadeOutGraphic.drawRect(0, 0, Settings.GAME.WIDTH, Settings.GAME.HEIGHT);
	    this.fadeOutGraphic.endFill();
    
		this.tutorialImage = game.add.sprite(Settings.GAME.WIDTH / 2, Settings.GAME.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
		this.tutorialImage.anchor = {x: 0.5, y: 0.5};
		this.tutorialImage.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		
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

		playSound('select');

		this.currentTutorial += 1;
		this.tutorialImage.destroy();

		if (this.currentTutorial === this.levelData.tutorial.length) {
			this.fadeOutGraphic.visible = false;
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		} else {
			this.tutorialImage = game.add.sprite(Settings.GAME.WIDTH / 2, Settings.GAME.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
			this.tutorialImage.anchor = {x: 0.5, y: 0.5};
			this.tutorialImage.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		}
	},

	/*
		upon level completion - load a VICTORY screen over the game
	*/
	loadVictory: function()
	{
		if(this.tutorialFinished){
			playSound('finish');
			this.levelFinished = true;
			this.inputManager.state = 'waiting';

			if(this.currentStarLevel > SaveData.levelStatus[this.level]){
				SaveData.levelStatus[this.level] = this.currentStarLevel;
			}
			if(SaveData.levelStatus[this.level+1] == -1){
				SaveData.levelStatus[this.level+1] = 0; //unlocked
			}

			this.fadeOutGraphic = game.add.graphics(0, 0);
    	   	this.fadeOutGraphic.beginFill(0x000000, 0.8);
    	    this.fadeOutGraphic.drawRect(0, 0, Settings.GAME.WIDTH, Settings.GAME.HEIGHT);
    	    this.fadeOutGraphic.endFill();

    	    this.victoryImage = game.add.sprite(Settings.GAME.WIDTH / 2, Settings.GAME.HEIGHT / 3, ('star'+this.currentStarLevel));
			this.victoryImage.anchor = {x: 0.5, y: 0.5};
			// this.victoryImage.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
	  
			//input for next level
			// game.input.onTap.add(this.nextLevel, this);
			// game.input.keyboard.addCallbacks(this,null,this.nextLevel);
			this.newGroup = game.add.group();

			this.restartButtonBig.alpha = 1;
			this.restartButtonBig.x = 80;
			this.restartButtonBig.y = 600;
			this.newGroup.add(this.restartButtonBig);

			this.playButton = game.add.image(400,600,'pButton');
			this.playButton.scale.setTo(2.5,2.5);
			this.playButton.inputEnabled = true;
  		    this.playButton.events.onInputDown.add(this.nextLevel,this);
			this.newGroup.add(this.playButton);
		}
	},

	/*
		load the next level state
	*/
	nextLevel: function()
	{
        if(Settings.GAME.LEVEL_MODE == 'builder'){
            this.state.start('LevelBuilder');
        }
		else if(this.tutorialFinished)
		{
			playSound('select');
			game.input.keyboard.addCallbacks(this,null,null);
			//load next level (unless we're at the end)
			if (this.level+1 === Settings.levels.length) {
				this.state.start('LevelSelect');
			} else {
				this.state.start('level'+(this.level+1));
			}
		}
	},

	/*
		restart the current level state
	*/
	restartLevel: function()
	{
		if(this.tutorialFinished){
			playSound('select');

			if(Settings.GAME.LEVEL_MODE == 'normal')
			{
				this.state.start('level'+this.level);
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
			playSound('select');
			this.state.start('LevelSelect')
		}
	},

	/*
		SKIP the current level (jump to then next level)
	*/
	skipLevel: function()
	{
		this.numMoves = 99;
		if(SaveData.levelStatus[this.level] < 1) SaveData.levelStatus[this.level] = 1;
		if(SaveData.levelStatus[this.level+1] == -1){
			SaveData.levelStatus[this.level+1] = 0; //unlocked
		}
		this.nextLevel();
	},

	/*
		Draw 1-3 stars in the HUD (based on number of player moves)
	*/
	drawStarsHUD: function(numStars)
	{
		this.currentStarLevel = numStars;
		this.starsHUD.removeAll(true);

		var starX = 510;
		var starY = 30;

		if(numStars == 3){
			var scale = 0.5;

			var star1 = game.add.image(0,0,'star');
			star1.anchor = {x: 0.5, y: 0.5};
			star1.scale.setTo(scale,scale);
			var star2 = game.add.image(0,0,'star');
			star2.anchor = {x: 0.5, y: 0.5};
			star2.scale.setTo(scale,scale);
			var star3 = game.add.image(0,0,'star');
			star3.anchor = {x: 0.5, y: 0.5};
			star3.scale.setTo(scale,scale);

			star1.x = starX-13;
			star1.y = starY-10;
			star2.x = starX+13;
			star2.y = starY-10;
			star3.x = starX;
			star3.y = starY+10;

			this.starsHUD.add(star1);
			this.starsHUD.add(star2);
			this.starsHUD.add(star3);
		} else if(numStars == 2){
			var scale = 0.5;

			var star1 = game.add.image(0,0,'star');
			star1.anchor = {x: 0.5, y: 0.5};
			star1.scale.setTo(scale,scale);
			var star2 = game.add.image(0,0,'star');
			star2.anchor = {x: 0.5, y: 0.5};
			star2.scale.setTo(scale,scale);

			this.starsHUD.add(star1);
			this.starsHUD.add(star2);

			star1.x = starX-10;
			star1.y = starY;
			star2.x = starX+15;
			star2.y = starY;
		} else {
			var scale = 0.5;

			var star1 = game.add.image(0,0,'star');
			star1.anchor = {x: 0.5, y: 0.5};
			star1.scale.setTo(scale,scale);

			this.starsHUD.add(star1);

			star1.x = starX;
			star1.y = starY;
		}
	},

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
