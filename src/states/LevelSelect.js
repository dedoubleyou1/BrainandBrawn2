/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   __                _   __      _           _   
  / /  _____   _____| | / _\ ___| | ___  ___| |_ 
 / /  / _ \ \ / / _ \ | \ \ / _ \ |/ _ \/ __| __|
/ /__|  __/\ V /  __/ | _\ \  __/ |  __/ (__| |_ 
\____/\___| \_/ \___|_| \__/\___|_|\___|\___|\__|
                                                 

Summary: Level Select State ("World Map") - player chooses from a set of unlocked levels. 
Completed levels display star counts.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.LevelSelect = function() {};

BnB.LevelSelect.prototype = {
    init: function(startingID)
    {
        this.numSections = 12;

        //reset on entry (just in case the array changed...)
        this.numLevels = BnB.levels.length - startingID;
        this.startingID = startingID;

        if(this.numLevels > BnB.C.LEVELS_PER_PAGE){
            this.numLevels = BnB.C.LEVELS_PER_PAGE;
        }
    },

	/*
		TEMP: Populate a numbered grid of boxes
		Based on player progress - Highlight, add STARS, and add tap handlers
	*/
	create: function() 
	{
        //set bounds
        this.bounds = {
            x: 0,
            y: BnB.C.HEIGHT-BnB.C.HEIGHT*this.numSections, 
            width: this.game.width,
            height: BnB.C.HEIGHT*this.numSections
        };
        this.game.world.setBounds(this.bounds.x,this.bounds.y,this.bounds.width,this.bounds.height);

        //set up starry background
        this.starLayer = this.add.group();
        this.initializeStars();

        //place map images
        for(var i=1;i<=this.numSections;i++)
        {
            var keyStr = "";
            if(i < 10) keyStr = "0" + i;
            else keyStr = i;

            var startY = -BnB.C.HEIGHT*this.numSections + BnB.C.HEIGHT*i;
            var newMap = this.add.image(0,startY,'levelmap' + keyStr);
            newMap.width = this.game.width;
            newMap.height = BnB.C.HEIGHT;
        }


		var offsetY = 60;

		//Debug/Demo only
		// if(BnB.buildType == 'demo' || BnB.buildType == 'test')
		// {
			//set up KEYBOARD CHEATS
			this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
			this.restartKey.onUp.add(this.resetLevels,this);
			this.unlockKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			this.unlockKey.onUp.add(this.unlockLevels,this);

			//Unlock ALL
			var myFont = { font: "30px Quicksand", fill: "#ffffff", align: "center"}
			this.unlockText = this.add.text(30,game.height - 60,"Unlock All",myFont);
			this.unlockText.inputEnabled = true;
			this.unlockText.events.onInputDown.add(this.unlockLevels,this);
            this.unlockText.fixedToCamera = true;

			//reset 
			this.resetText = this.add.text(480, game.height-60,"Reset All",myFont);
			this.resetText.inputEnabled = true;
			this.resetText.events.onInputDown.add(this.resetLevels,this);
            this.resetText.fixedToCamera = true;

		// }

        if(this.startingID != 0)
        {
            //Back Button
            var back = this.add.image(10,10,'backArrow');
            back.scale.setTo(0.4);
            back.inputEnabled = true;
            back.events.onInputDown.add(this.onBack,this);
        }

        if(BnB.levels.length - this.startingID > BnB.C.LEVELS_PER_PAGE)
        {
            var forward = this.add.image(0,10,'forwardArrow');
            forward.scale.setTo(0.4);

            forward.inputEnabled = true;
            forward.events.onInputDown.add(this.onForward,this);
            forward.x = BnB.C.WIDTH - forward.width;
        }

		//Set up level buttons
		BnB.levelType = 'normal';
		BnB.C.BOUNDS_DEATH = true;

		this.buttons = this.add.group();
		this.buttonTexts = this.add.group();


        //populate level buttons
        var startY = BnB.C.HEIGHT*0.666;
        var buttonGapY = 128;

		for (var i=0;i<this.numLevels;i++) {
            var currentID = this.startingID + i;
            var newButton = this.createButton(currentID, this.game.width/2, startY - i*buttonGapY);
		}

        //enable kinetic scrolling
        this.game.kineticScrolling.start();

        //enable music
        if(BnB.fromState == 'Level'){
            BnB.AudioManager.playMusic('menuMusic',true);
        }

        BnB.fromState = 'LevelSelect';
	},

    update: function()
    {
        this.updateStars();
    },

    shutdown: function()
    {
        this.game.kineticScrolling.stop();
    },

    //helper function to create a BUTTON
    createButton: function(id, xPos, yPos) {
        var numStars = BnB.SaveData.getStars(id);
        var starGraphics = ['ui_level_lock','ui_level_unlock','ui_level_star1','ui_level_star2','ui_level_star3']
        var buttonSize = 96;

        var levelButton = this.add.group();
        console.log(levelButton);

        var buttonGraphic = this.add.image(xPos,yPos,'ui', starGraphics[numStars+1]);
        buttonGraphic.anchor = {x: 0.5, y: 0.5};
        buttonGraphic.width = buttonSize;
        buttonGraphic.height = buttonSize;
        buttonGraphic.inputEnabled = true;
        buttonGraphic.events.onInputDown.add(this.loadLevel,this);
        buttonGraphic.levelID = id;

        var newText = this.add.text(xPos, yPos - 12, id + 1, {font: "48px Quicksand", fill: "#5C6466"});
        newText.anchor = {x: 0.5, y: 0.5};

        levelButton.add(buttonGraphic);
        levelButton.add(newText);

        return levelButton;


        //this.buttonTexts.add(newText);
    },


	/*
		When player taps a specific image - load the associated level
	*/
	loadLevel: function(image) 
	{
        if (BnB.SaveData.getStars(image.levelID) >= 0) {
            this.game.kineticScrolling.stop();
            BnB.Util.goToLevel(image.levelID);        
        }
	},

	//reset levels + restart state
	resetLevels: function()
	{
		BnB.SaveData.reset();
		this.state.start('LevelSelect',true,false,0);
	},

	//unlock all levels + restart state
	unlockLevels: function()
	{
		BnB.SaveData.unlockAll();
		this.state.start('LevelSelect',true,false,this.startingID);
	},

	//handler for BACK button
	onBack: function()
	{
        var newStart = this.startingID-BnB.C.LEVELS_PER_PAGE;
		this.state.start('LevelSelect',true,false,newStart);
	},

    onForward: function()
    {
        var newStart = this.startingID+BnB.C.LEVELS_PER_PAGE;
        this.state.start('LevelSelect',true,false,newStart);
    },



    initializeStars: function() 
    {
        //var rect = this.bounds;
        this.spaceC = game.add.tileSprite(0, 0, game.width, game.height, 'spaceC');
        this.spaceB = game.add.tileSprite(0, 0, game.width, game.height, 'spaceB');
        this.spaceA = game.add.tileSprite(0, 0, game.width, game.height, 'spaceA');

        this.spaceC.fixedToCamera = true;
        this.spaceB.fixedToCamera = true;
        this.spaceA.fixedToCamera = true;

        this.starLayer.add(this.spaceC);
        this.starLayer.add(this.spaceB);
        this.starLayer.add(this.spaceA);
    },

    updateStars: function()
    {

        var directionVector = BnB.Util.directionLookup['down'];
        this.spaceC.tilePosition.x += directionVector.x;
        this.spaceC.tilePosition.y += directionVector.y;
        this.spaceB.tilePosition.x += 2 * directionVector.x;
        this.spaceB.tilePosition.y += 2 * directionVector.y;
        this.spaceA.tilePosition.x += 4 * directionVector.x;
        this.spaceA.tilePosition.y += 4 * directionVector.y;
    },
};
