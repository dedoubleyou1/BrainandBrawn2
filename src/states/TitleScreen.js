/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 _____ _ _   _        __                          
/__   (_) |_| | ___  / _\ ___ _ __ ___  ___ _ __  
  / /\/ | __| |/ _ \ \ \ / __| '__/ _ \/ _ \ '_ \ 
 / /  | | |_| |  __/ _\ \ (__| | |  __/  __/ | | |
 \/   |_|\__|_|\___| \__/\___|_|  \___|\___|_| |_|
                                                  

Summary: Displays the starting logo - tap to enter the game

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

TitleScreen = function() {};
TitleScreen.prototype = {

	/*
		Create and display background (title screen)
		TEMP: Initialize Level states
	*/
	create: function() {

		//set up background image
		var background = this.add.sprite(Settings.GAME.WIDTH/2, Settings.GAME.HEIGHT/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};
		// background.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		background.scale.multiply(Settings.GAME.WIDTH/background.width,Settings.GAME.HEIGHT/background.height)


		//Add each level as a separate state
		SaveData.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
			SaveData.levelStatus.push(-1);
		};
		SaveData.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)

		//add input to start the game
		this.input.onTap.add(this.startGame, this);
	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
		// playSound('select');

		//TEMP - skip main menu
		// this.state.start('level0');
		this.state.start('MainMenu');
	}
};