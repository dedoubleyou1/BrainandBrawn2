/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 _____ _ _   _        __                          
/__   (_) |_| | ___  / _\ ___ _ __ ___  ___ _ __  
  / /\/ | __| |/ _ \ \ \ / __| '__/ _ \/ _ \ '_ \ 
 / /  | | |_| |  __/ _\ \ (__| | |  __/  __/ | | |
 \/   |_|\__|_|\___| \__/\___|_|  \___|\___|_| |_|
                                                  

Summary: Displays the starting logo - tap to enter the game

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.TitleScreen = function() {};
BnB.TitleScreen.prototype = {

	/*
		Create and display background (title screen)
		TEMP: Initialize Level states
	*/
	create: function() {
		// BnB.AudioManager.createAudio('select');
        BnB.AudioManager.createAudio('gameplayMusic', true);

		//set up background image
		var background = this.add.sprite(BnB.C.WIDTH/2, BnB.C.HEIGHT/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};
		background.scale.multiply(BnB.C.WIDTH/background.width,BnB.C.HEIGHT/background.height)

		//add input to start the game
		this.input.onTap.add(this.startGame, this);
	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
        BnB.AudioManager.playSound('gameplayMusic');
		if(BnB.buildType == 'test'){
            // BnB.AudioManager.playSound('select');
            this.state.start('MainMenu');
        }
        else{
            BnB.Util.goToLevel(0);
        }
	}
};