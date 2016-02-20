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
        //reset on entry (just in case the array changed...)
        this.numLevels = BnB.levels.length - startingID;
        this.startingID = startingID;

        if(this.numLevels > BnB.C.LEVELS_PER_PAGE){
            this.numLevels = 25;
        }
    },

	/*
		TEMP: Populate a numbered grid of boxes
		Based on player progress - Highlight, add STARS, and add tap handlers
	*/
	create: function() 
	{
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
			this.unlockText = this.add.text(200,20,"Unlock All",myFont);
			this.unlockText.inputEnabled = true;
			this.unlockText.events.onInputDown.add(this.unlockLevels,this);

			//reset 
			this.resetText = this.add.text(400,20,"Reset All",myFont);
			this.resetText.inputEnabled = true;
			this.resetText.events.onInputDown.add(this.resetLevels,this);
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

		var buttonSize = 100;
		var buttonGapX = 23;
		var buttonGapY = 60;

        //populate level buttons
		for (var i=0;i<this.numLevels;i++)
		{
            var currentID = this.startingID + i;
            var newButton = this.createButton(buttonSize,currentID);

            //Determine button state/status from SaveData
			if(BnB.SaveData.getStars(currentID) < 0){
				newButton.alpha = 0.3;
			}
			else{
				newButton.inputEnabled = true;
                newButton.events.onInputDown.add(this.loadLevel,this);
			}

            //set up text
			var newText = this.add.text(50,50,(currentID+1), { font: "bold 25px Quicksand", fill: "#ffffff", align: "center" });
			newText.anchor = {x: 0.5, y: 0.5};
			this.buttonTexts.add(newText);
		}
		
		
        //position level buttons
        var totalColumns = 5;
		var currentRow = 0;
		for(var i=0;i<this.buttons.length;i++)
		{
            var currentID = this.startingID + i;

            //get row and column
			var currentColumn = i%totalColumns;
			if(currentColumn == 0 && i!=0) currentRow++;

            //get desired button coordinates
			var buttonX = currentColumn*(buttonSize+buttonGapX)+buttonGapX;
			var buttonY = currentRow*(buttonSize+buttonGapY)+buttonGapX + offsetY;

            //set button position
			this.buttons.getAt(i).x = buttonX;
			this.buttons.getAt(i).y = buttonY;

            //set button text position
			this.buttonTexts.getAt(i).x = this.buttons.getAt(i).x+this.buttons.getAt(i).width/2;
			this.buttonTexts.getAt(i).y = this.buttons.getAt(i).y+this.buttons.getAt(i).height+15;
			
            //CREATE STARS
            var numStars = BnB.SaveData.getStars(currentID);
			if(numStars == 1){
                this.createStar(buttonX+buttonSize/2,buttonY+buttonSize/2-13);
                this.createStar(buttonX+buttonSize/2,buttonY+buttonSize/2-13);
			}
			else if(numStars == 2){
                this.createStar(buttonX+buttonSize*.33, buttonY+buttonSize/2-13);
                this.createStar(buttonX+buttonSize*.67, buttonY+buttonSize/2-13);
			}
			else if(numStars == 3){
                this.createStar(buttonX+buttonSize*.33, buttonY+buttonSize*.25);
                this.createStar(buttonX+buttonSize*.67,buttonY+buttonSize*.25);
                this.createStar(buttonX+buttonSize*.5,buttonY+buttonSize*.5);
			}		
		}

        this.game.world.setBounds(0, 0, this.game.width, this.game.height*2);
        this.game.kineticScrolling.start();
	},

    shutdown: function()
    {
        this.game.kineticScrolling.stop();
    },

    //helper function to create a BUTTON
    createButton: function(buttonSize,id)
    {
        //set up button
        var newButton = this.add.image(50,50,'spritesheet', 'brainandbrawn_block');
        newButton.width = buttonSize;
        newButton.height = buttonSize;
        newButton.levelID = id;
        this.buttons.add(newButton);
        return newButton;
    },

    //helper function to create a STAR
    createStar: function(starX,starY)
    {
        var star = this.add.image(starX,starY,'star');
        star.anchor = {x: 0.5, y: 0.5};
        star.scale.setTo(0.7,0.7);
    },

	/*
		When player taps a specific image - load the associated level
	*/
	loadLevel: function(image) 
	{
        BnB.Util.goToLevel(image.levelID)
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


};
