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
        BnB.AudioManager.createAudio('menuMusic', true);

		//set up background image
		var background = this.add.sprite(this.game.width/2, this.game.height/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};
		background.scale.multiply(BnB.C.WIDTH/background.width,BnB.C.HEIGHT/background.height)

		//add input to start the game
		this.input.onTap.add(this.startGame, this);
		BnB.AudioManager.playMusic('menuMusic',true);

		//hack to solve animation problem on first level run
		game.add.sprite(game.width, game.height, 'brawny_SpriteSheet');
        game.add.sprite(game.width, game.height, 'brainy_SpriteSheet');
	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
		if(BnB.buildType == 'test'){
            // BnB.AudioManager.playSFX('select');
            this.state.start('MainMenu');
        }
        else{
            this.state.start('LevelSelect',true,false,0);
        }
	}
};