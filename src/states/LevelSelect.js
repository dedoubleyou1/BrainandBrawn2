/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   __                _   __      _           _   
  / /  _____   _____| | / _\ ___| | ___  ___| |_ 
 / /  / _ \ \ / / _ \ | \ \ / _ \ |/ _ \/ __| __|
/ /__|  __/\ V /  __/ | _\ \  __/ |  __/ (__| |_ 
\____/\___| \_/ \___|_| \__/\___|_|\___|\___|\__|
                                                 

Summary: Level Select State ("World Map") - player chooses from a set of unlocked levels. 
Completed levels display star counts.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

LevelSelect = function(numLevels) {
	this.numLevels = numLevels;
};

LevelSelect.prototype = {

	/*
		TEMP: Populate a numbered grid of boxes
		Based on player progress - Highlight, add STARS, and add tap handlers
	*/
	create: function() {
		Settings.GAME.LEVEL_MODE = 'normal';
		Settings.GAME.BOUNDS_DEATH = true;

		this.buttons = BnBgame.add.group();
		this.buttonTexts = BnBgame.add.group();

		var buttonSize = 100;
		var buttonGapX = 23;
		var buttonGapY = 60;

		for (var i=0;i<this.numLevels;i++)
		{
			var newButton = BnBgame.add.image(50,50,'spritesheet', 'brainandbrawn_block');
			newButton.width = buttonSize;
			newButton.height = buttonSize;
			newButton.levelID = i;

			if(BnBgame.levelStatus[i] < 0){
				newButton.alpha = 0.3;
			}
			else{
				newButton.inputEnabled = true;
  			newButton.events.onInputDown.add(this.loadLevel,this);
			}

			this.buttons.add(newButton);

			var newText = BnBgame.add.text(50,50,(i+1), { font: "bold 25px Quicksand", fill: "#ffffff", align: "center" });
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
			var buttonY = currentRow*(buttonSize+buttonGapY)+buttonGapX;

			this.buttons.getAt(i).x = buttonX
			this.buttons.getAt(i).y = buttonY

			this.buttonTexts.getAt(i).x = this.buttons.getAt(i).x+this.buttons.getAt(i).width/2;
			this.buttonTexts.getAt(i).y = this.buttons.getAt(i).y+this.buttons.getAt(i).height+15;

			
			if(BnBgame.levelStatus[i] == 1){
				var star1 = BnBgame.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				// star1.scale.setTo(0.7,0.7);
				star1.x = buttonX+this.buttons.getAt(i).width/2;
				star1.y = buttonY+this.buttons.getAt(i).height/2-13;
			}
			else if(BnBgame.levelStatus[i] == 2){
				var star1 = BnBgame.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				star1.scale.setTo(0.7,0.7);
				var star2 = BnBgame.add.image(0,0,'star');
				star2.anchor = {x: 0.5, y: 0.5};
				star2.scale.setTo(0.7,0.7);

				star1.x = buttonX+buttonSize*.33;
				star1.y = buttonY+buttonSize/2-13;
				star2.x = buttonX+buttonSize*.67;
				star2.y = buttonY+buttonSize/2-13;
			}
			else if(BnBgame.levelStatus[i] == 3){
				var star1 = BnBgame.add.image(0,0,'star');
				star1.anchor = {x: 0.5, y: 0.5};
				star1.scale.setTo(0.7,0.7);
				var star2 = BnBgame.add.image(0,0,'star');
				star2.anchor = {x: 0.5, y: 0.5};
				star2.scale.setTo(0.7,0.7);
				var star3 = BnBgame.add.image(0,0,'star');
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
	loadLevel: function(image) {
		this.state.start('level'+(image.levelID));
	}



};
