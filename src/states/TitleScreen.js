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
        BnB.AudioManager.createAudioList([
            'ambience1',
            'select',
        ]);


		//set up background image
		var background = this.add.sprite(this.game.width/2, this.game.height/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};
		background.scale.multiply(BnB.C.WIDTH/background.width,BnB.C.HEIGHT/background.height)

		//hack to solve animation problem on first level run
		game.add.sprite(game.width, game.height, 'brawny_SpriteSheet');
        game.add.sprite(game.width, game.height, 'brainy_SpriteSheet');

        //hack to solve font loading issue
        this.add.text(game.width, game.height, 'text', {font: "12px Quicksand"});

        //add input to start the game
        this.input.onTap.add(this.startGame, this);

        //start music
        BnB.AudioManager.playMusic('ambience1',true);
	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
		BnB.AudioManager.playSFX('menu-start');

        if(BnB.buildType == 'test'){
            this.state.start('MainMenu');
        }
        else{
            this.state.start('LevelSelect',true,false,0);
        }
	}
};