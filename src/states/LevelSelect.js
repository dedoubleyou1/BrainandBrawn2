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
    init: function()
    {
        //reset on entry (just in case the array changed...)
        this.numLevels = BnB.levels.length;
    },

	/*
		TEMP: Populate a numbered grid of boxes
		Based on player progress - Highlight, add STARS, and add tap handlers
	*/
	create: function() 
	{

		var offsetY = 0;

		//Debug/Demo only
		if(BnB.buildType == 'demo' || BnB.buildType == 'test')
		{
			offsetY = 110; //create space for the back button

			//set up KEYBOARD CHEATS
			this.restartKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
			this.restartKey.onUp.add(this.resetLevels,this);
			this.unlockKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
			this.unlockKey.onUp.add(this.unlockLevels,this);

			//Back Button
			var back = this.add.image(10,10,'backArrow');
			back.scale.setTo(0.4);
			back.inputEnabled = true;
			back.events.onInputDown.add(this.onBack,this);

			//Unlock ALL
			var myFont = { font: "30px Quicksand", fill: "#ffffff", align: "center"}
			this.unlockText = this.add.text(200,40,"Unlock All",myFont);
			this.unlockText.inputEnabled = true;
			this.unlockText.events.onInputDown.add(this.unlockLevels,this);

			//reset 
			this.resetText = this.add.text(500,40,"Reset All",myFont);
			this.resetText.inputEnabled = true;
			this.resetText.events.onInputDown.add(this.resetLevels,this);
		}

		//Set up level buttons
		BnB.levelType = 'normal';
		BnB.C.BOUNDS_DEATH = true;

		this.buttons = this.add.group();
		this.buttonTexts = this.add.group();

		var buttonSize = 100;
		var buttonGapX = 23;
		var buttonGapY = 60;

		for (var i=0;i<this.numLevels;i++)
		{
			var newButton = this.add.image(50,50,'spritesheet', 'brainandbrawn_block');
			newButton.width = buttonSize;
			newButton.height = buttonSize;
			newButton.levelID = i;

			if(BnB.SaveData.levelStatus[i] < 0){
				newButton.alpha = 0.3;
			}
			else{
				newButton.inputEnabled = true;
  			newButton.events.onInputDown.add(this.loadLevel,this);
			}

			this.buttons.add(newButton);

			var newText = this.add.text(50,50,(i+1), { font: "bold 25px Quicksand", fill: "#ffffff", align: "center" });
			newText.anchor = {x: 0.5, y: 0.5};
			this.buttonTexts.add(newText);
		}
		
		var totalColumns = 5;
		var currentRow = 0;
		//rows of five!
		for(var i=0;i<this.buttons.length;i++)
		{
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
			if(BnB.SaveData.levelStatus[i] == 1){
                this.createStar(buttonX+buttonSize/2,buttonY+buttonSize/2-13);
                this.createStar(buttonX+buttonSize/2,buttonY+buttonSize/2-13);
			}
			else if(BnB.SaveData.levelStatus[i] == 2){
                this.createStar(buttonX+buttonSize*.33, buttonY+buttonSize/2-13);
                this.createStar(buttonX+buttonSize*.67, buttonY+buttonSize/2-13);
			}
			else if(BnB.SaveData.levelStatus[i] == 3){
                this.createStar(buttonX+buttonSize*.33, buttonY+buttonSize*.25);
                this.createStar(buttonX+buttonSize*.67,buttonY+buttonSize*.25);
                this.createStar(buttonX+buttonSize*.5,buttonY+buttonSize*.5);
			}		
		}

	},

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
		this.state.start('LevelSelect');
	},

	//unlock all levels + restart state
	unlockLevels: function()
	{
		BnB.SaveData.unlockAll();
		this.state.start('LevelSelect');
	},

	//handler for BACK button
	onBack: function()
	{
		this.state.start('MainMenu');
	},


};
