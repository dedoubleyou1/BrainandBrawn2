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
        this.numLevels = BnB.C.levels.length;
    },

	/*
		TEMP: Populate a numbered grid of boxes
		Based on player progress - Highlight, add STARS, and add tap handlers
	*/
	create: function() 
	{

		var offsetY = 0;

		//Debug/Demo only
		if(BnB.C.MODE == 'demo' || BnB.C.MODE == 'test')
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
		BnB.C.LEVEL_MODE = 'normal';
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
			var currentColumn = i%totalColumns;
			if(currentColumn == 0 && i!=0) currentRow++;

			var buttonX = currentColumn*(buttonSize+buttonGapX)+buttonGapX;
			var buttonY = currentRow*(buttonSize+buttonGapY)+buttonGapX + offsetY;

			this.buttons.getAt(i).x = buttonX;
			this.buttons.getAt(i).y = buttonY;

			this.buttonTexts.getAt(i).x = this.buttons.getAt(i).x+this.buttons.getAt(i).width/2;
			this.buttonTexts.getAt(i).y = this.buttons.getAt(i).y+this.buttons.getAt(i).height+15;

			
			if(BnB.SaveData.levelStatus[i] == 1){
				var star1 = this.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				// star1.scale.setTo(0.7,0.7);
				star1.x = buttonX+this.buttons.getAt(i).width/2;
				star1.y = buttonY+this.buttons.getAt(i).height/2-13;
			}
			else if(BnB.SaveData.levelStatus[i] == 2){
				var star1 = this.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				star1.scale.setTo(0.7,0.7);
				var star2 = this.add.image(0,0,'star');
				star2.anchor = {x: 0.5, y: 0.5};
				star2.scale.setTo(0.7,0.7);

				star1.x = buttonX+buttonSize*.33;
				star1.y = buttonY+buttonSize/2-13;
				star2.x = buttonX+buttonSize*.67;
				star2.y = buttonY+buttonSize/2-13;
			}
			else if(BnB.SaveData.levelStatus[i] == 3){
				var star1 = this.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				star1.scale.setTo(0.7,0.7);
				var star2 = this.add.image(0,0,'star');
				star2.anchor = {x: 0.5, y: 0.5};
				star2.scale.setTo(0.7,0.7);
				var star3 = this.add.image(0,0,'star');
				star3.anchor = {x: 0.5, y: 0.5};
				star3.scale.setTo(0.7,0.7);

				star1.x = buttonX+buttonSize*.33;
				star1.y = buttonY+buttonSize*.25;
				star2.x = buttonX+buttonSize*.67;
				star2.y = buttonY+buttonSize*.25;
				star3.x = buttonX+buttonSize*.5;
				star3.y = buttonY+buttonSize*.5;
			}		
		}

	},

	/*
		When player taps a specific image - load the associated level
	*/
	loadLevel: function(image) 
	{
        this.state.start('Level',true,false,image.levelID);
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
