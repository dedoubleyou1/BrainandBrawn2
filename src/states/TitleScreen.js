/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 _____ _ _   _        __                          
/__   (_) |_| | ___  / _\ ___ _ __ ___  ___ _ __  
  / /\/ | __| |/ _ \ \ \ / __| '__/ _ \/ _ \ '_ \ 
 / /  | | |_| |  __/ _\ \ (__| | |  __/  __/ | | |
 \/   |_|\__|_|\___| \__/\___|_|  \___|\___|_| |_|
                                                  

Summary: Displays the starting logo - tap to enter the game

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BrainAndBrawn.TitleScreen = function() {};
BrainAndBrawn.TitleScreen.prototype = {

	/*
		Create and display background (title screen)
		TEMP: Initialize Level states
	*/
	create: function() {

		//set up background image
		var background = this.add.sprite(C.WIDTH/2, C.HEIGHT/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};
		// background.scale.multiply(C.SCALE, C.SCALE);
		background.scale.multiply(C.WIDTH/background.width,C.HEIGHT/background.height)

		//add input to start the game
		this.input.onTap.add(this.startGame, this);
	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
		// Util.playSound('select');

		//TEMP - skip main menu
		// this.state.start('level0');
		this.state.start('MainMenu');
	}
};