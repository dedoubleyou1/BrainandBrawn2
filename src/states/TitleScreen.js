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
		TEMP: Initialize LevelSelect and Level states
	*/
	create: function() {
		var background = this.add.sprite(Settings.GAME.WIDTH/2, Settings.GAME.HEIGHT/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};

		// background.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		background.scale.multiply(Settings.GAME.WIDTH/background.width,Settings.GAME.HEIGHT/background.height)

		this.state.add('levelSelect',new LevelSelect(Settings.levels.length));

		BnBgame.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
			BnBgame.levelStatus.push(-1);
		};
		BnBgame.levelStatus[0] = 0; //unlock first level with 0 starts (incomplete)


		BnBgame.input.onTap.add(this.startGame, this);
		BnBgame.input.keyboard.addCallbacks(this,null,this.startGame);

	},

	/*
		onTap - start the game!
	*/
	startGame: function(){
		BnBgame.input.keyboard.addCallbacks(this,null,null);
		this.state.start('levelSelect');
	}
};