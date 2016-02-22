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
        BnB.AudioManager.createAudioList([
            'finish',
            'thunk',   
            'shatter', 
            'brainySpace',
            'brawnySpace',    
            'eaten',   
            'spikey',  
            'switch1', 
            'switch2', 
            'switch3', 
            'switch4', 
            'kill',    
        ]);

		//set up level data
        if(BnB.levelType == 'normal')
		{
			this.levelData = JSON.parse(game.cache.getText('level'+this.level));
		}
		this.gridWidth = this.levelData.width;
		this.gridHeight = this.levelData.length;

        //initialize settings
        this.tutorialFinished = false;
        this.levelFinished = false;
        this.numMoves = 0;

        //set STAR levels
        this.currentStarLevel = 3;
        this.starLevels = [90,20,10];//defult
        if(typeof this.levelData.starLevels != 'undefined'){
            this.starLevels = this.levelData.starLevels;
        }

        //set up managers
		this.gameLogic = new BnB.GameLogic(this.levelData);
		this.graphicsManager = new BnB.GraphicsManager(this.levelData);
		this.inputManager = new BnB.InputManager('waiting');
		this.inputManager.onUpCallback = this.graphicsManager.resetLeaning.bind(this.graphicsManager);

		//Set up the HUD
		this.setUpHUD();

        //set up HUD elements for screens
        this.initializeScreens();

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

        //enable music
        if(BnB.fromState == 'LevelSelect'){
            BnB.AudioManager.playMusic('gameplayMusic',true);
            this.game.world.setBounds(0,0,this.game.width,this.game.height);
        }

        BnB.fromState = 'Level';
	},

    /*
        called from CREATE - set up HUD elements
    */
    setUpHUD: function(){
        var levelName = "";
        if(this.levelData.name != "test" && this.levelData.name != "Exported Level"){
            levelName = ": " + this.levelData.name;
        }

        this.moveText = this.add.text(200,15,('Moves: '+ this.starLevels[0]), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
        this.levelText = this.add.text(15,game.height-30,('Level '+(this.level+1) + levelName), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
        
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

        this.settingsButton = this.add.image(this.game.width-80,this.game.height-80,'settingsButton');
        this.settingsButton.scale.setTo(0.3);
        this.settingsButton.inputEnabled = true;
        this.settingsButton.events.onInputDown.add(this.showSettings,this);

        //Create HUD elements for SETTINGS screen (and hide)
        

        this.starsHUD = this.add.group();
        // this.starsHUD.visible = false; //TEMP
        this.setUpStars();
    },

    initializeScreens: function()
    {  
        var myFont = { font: "30px Quicksand", fill: "#ffffff", align: "center"};

        //Add graphics filter (over game, behind HUD)
        this.fadeOutGraphic = this.add.graphics(0, 0);
        this.fadeOutGraphic.clear(); //move to state clear function
        this.fadeOutGraphic.beginFill(0x000000, 0.8);
        this.fadeOutGraphic.drawRect(0, 0, this.game.width, this.game.height);
        this.fadeOutGraphic.endFill();
        this.fadeOutGraphic.visible = false;

        //Audio toggles

        this.toggleMusicText = this.add.text(250,100,"Music: On",myFont);
        this.toggleMusicText.inputEnabled = true;
        this.toggleMusicText.events.onInputDown.add(function(){
            BnB.AudioManager.toggleMusic();
            this.updateToggleStrings();
        },this)

        this.toggleSFXText = this.add.text(250,150,"SFX: On",myFont);
        this.toggleSFXText.inputEnabled = true;
        this.toggleSFXText.events.onInputDown.add(function(){
            BnB.AudioManager.toggleSFX();
            this.updateToggleStrings();
        },this)

        this.toggleGroup = this.add.group();
        this.toggleGroup.add(this.toggleMusicText);
        this.toggleGroup.add(this.toggleSFXText);
        this.toggleGroup.visible = false;
        this.updateToggleStrings();//set initial properties

        //Credits
        var creditsX = 250;
        var creditsY = 400;
        this.creditsGroup = this.add.group();
        this.creditsGroup.add(this.add.text(creditsX,creditsY,"CREDITS:",myFont));
        this.creditsGroup.add(this.add.text(creditsX,creditsY+40,"Rohit Crasta",myFont));
        this.creditsGroup.add(this.add.text(creditsX,creditsY+80,"David Wallin",myFont));
        this.creditsGroup.add(this.add.text(creditsX,creditsY+120,"Michael Hoffman",myFont));
        this.creditsGroup.visible = false;

        //continue button
        this.continueButton = this.add.image(300,600,'pButton');
        this.continueButton.scale.setTo(2.5,2.5);
        this.continueButton.inputEnabled = true;
        this.continueButton.events.onInputDown.add(this.hideSettings,this);
        this.continueButton.visible = false;
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
		} else if (this.inputManager.state === 'moving') {
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
        	if (BnB.C.SWIPING_OFFSET) {
        		this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.x);
        	}
        	if (BnB.C.SWIPING_LEANING) {
        		this.graphicsManager.setLeaning(swipeDirection, swipeOffset.x);
        	}
        } else if (swipeDirection === 'up' || swipeDirection === 'down') {
            if (BnB.C.SWIPING_OFFSET) {
        		this.graphicsManager.setActiveOffset(swipeDirection, swipeOffset.y);
        	}
        	if (BnB.C.SWIPING_LEANING) {
        		this.graphicsManager.setLeaning(swipeDirection, swipeOffset.y);
        	}
        }
    },

    //start player/gravity movement
    startMoving: function()
    {
        //update logic and set the RESULTS
        this.results = this.gameLogic.gravitySwitch(this.inputManager.direction);
        console.log(this.results);

        //update graphics based on the results
        this.graphicsManager.updateGraphics(this.results);
        
        //disable settings button
        // this.settingsButton.alpha = 0.8; //Too distracting!
        this.settingsButton.inputEnabled = false;

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
            //disable settings button
            this.settingsButton.alpha = 1;
            this.settingsButton.inputEnabled = true;

            //Ready for more input!
            this.inputManager.state = 'ready';
        }
    },

    //Called when animations finish and a successful move was completed
    onMoveComplete: function()
    {
        BnB.AudioManager.playSFX('thunk');
        
        //update # of moves
        if(this.numMoves<99){
            this.numMoves++;
        }
        
        this.updateHUD();
    },

    //Based on results - check if we shoudl end the level (good or bad)
    checkEndState: function()
    {
        if (this.results.endState != 'none' && this.results.endState != 'missionSuccess') {
            //use end state to determine sound effect
            BnB.AudioManager.playSFX(this.results.endState);

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
        if(this.currentStarLevel > 0){
            var movesLeft = this.starLevels[0] - this.numMoves;
            var moveTextDisplay = "Moves: " + movesLeft;
            this.moveText.text = moveTextDisplay;
        }

        //update stars in the HUD
        if(this.currentStarLevel == 3 && this.numMoves > this.starLevels[2]){
            this.currentStarLevel = 2;
        }
        else if(this.currentStarLevel == 2 && this.numMoves > this.starLevels[1]){
            this.currentStarLevel = 1;
        }
        else if(this.currentStarLevel == 1 && this.numMoves >= this.starLevels[0]){
            this.moveText.visible = false;
            this.starsHUD.visible = false;
            this.currentStarLevel = 0;
        }
    },

    /*
        Draw 1-3 stars in the HUD (based on number of player moves)
    */
    setUpStars: function(numStars)
    {
        var numStars = BnB.SaveData.getStars(this.level) + 1;
        if(numStars > 3) return;

        var starX = 450;
        var starY = 30;

        if(numStars == 3){
            this.createStar(starX-13,starY-10);
            this.createStar(starX+13,starY-10);
            this.createStar(starX,starY+10);
        } else if(numStars == 2){
            this.createStar(starX-10,starY);
            this.createStar(starX+15,starY);
        } else if(numStars == 1){
            this.createStar(starX-100,starY);
        }

        //starText
        if(numStars > 1){
            var starText = this.add.text(starX+30,starY-15," = " + (this.starLevels[0]-this.starLevels[numStars-1]), { font: "bold 25px Quicksand", fontSize: 25, fill: "#ffffff", align: "left" });
            this.starsHUD.add(starText);
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
		// BnB.AudioManager.playSFX('select');
		this.fadeOutGraphic.visible = true;
    
		this.tutorialImage = this.add.sprite(this.game.width / 2, this.game.height / 2, this.levelData.tutorial[this.currentTutorial]);
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

		// BnB.AudioManager.playSFX('select');

		this.currentTutorial += 1;
		this.tutorialImage.destroy();

		if (this.currentTutorial === this.levelData.tutorial.length) {
			this.fadeOutGraphic.visible = false;
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		} else {
			this.tutorialImage = this.add.sprite(this.game.width / 2, this.game.height / 2, this.levelData.tutorial[this.currentTutorial]);
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
			BnB.AudioManager.playSFX('finish');
			this.levelFinished = true;
			this.inputManager.state = 'finished';

			//Save stars
			if(this.currentStarLevel > BnB.SaveData.getStars(this.level)){
                BnB.SaveData.setStars(this.level,this.currentStarLevel);
			}

			//unlock next level
			if(this.level+1 < BnB.SaveData.getNumLevels())
			{
				if(BnB.SaveData.getStars(this.level+1) == -1){
                    BnB.SaveData.setStars(this.level+1,0);//unlocked
				}
			}

			//show background filter
            this.fadeOutGraphic.visible = true;

            if(this.currentStarLevel > 0){
                this.victoryImage = this.add.sprite(this.game.width / 2, this.game.height / 3, ('star'+this.currentStarLevel));
                this.victoryImage.anchor = {x: 0.5, y: 0.5};
            }
	  
			//input for next level
			this.newGroup = this.add.group();

			this.restartButtonBig.alpha = 1;
			this.restartButtonBig.x = 80;
			this.restartButtonBig.y = this.game.height*0.6;
			this.newGroup.add(this.restartButtonBig);

			this.playButton = this.add.image(400,this.game.height*0.6,'pButton');
			this.playButton.scale.setTo(2.5,2.5);
			this.playButton.inputEnabled = true;
  		    this.playButton.events.onInputDown.add(this.nextLevel,this);
			this.newGroup.add(this.playButton);
		}
	},

    showSettings: function()
    {
        this.inputManager.state = 'none';

        //show elements
        this.fadeOutGraphic.visible = true;
        this.continueButton.visible = true;
        this.creditsGroup.visible = true;
        this.toggleGroup.visible = true;
    },

    hideSettings: function()
    {
        this.inputManager.state = 'ready';

        //hide elements
        this.fadeOutGraphic.visible = false;
        this.continueButton.visible = false;
        this.creditsGroup.visible = false;
        this.toggleGroup.visible = false;
    },

    updateToggleStrings: function()
    {
        if(BnB.AudioManager.allowMusic){
            this.toggleMusicText.text = "Music: On";
        }
        else {
            this.toggleMusicText.text = "Music: Off";
        }

        if(BnB.AudioManager.allowSFX){
            this.toggleSFXText.text = "SFX: On";
        }
        else{
            this.toggleSFXText.text = "SFX: Off";
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
			// BnB.AudioManager.playSFX('select');
			game.input.keyboard.addCallbacks(this,null,null);
			//load next level (unless we're at the end)
			if (this.level+1 === BnB.levels.length) {
				this.state.start('Victory');
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
			// BnB.AudioManager.playSFX('select');

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
			// BnB.AudioManager.playSFX('select');

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
        if(!this.levelFinished){
            //overwrite with 0
            BnB.SaveData.setStars(this.level,0);
        }

		//unlock next level if necessary
		if(this.level+1 < BnB.SaveData.getNumLevels())
		{
			if(BnB.SaveData.getStars(this.level+1) == -1){
                BnB.SaveData.setStars(this.level+1,0);
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
