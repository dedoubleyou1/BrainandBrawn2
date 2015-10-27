MainMenu = function() {};
MainMenu.prototype = {
	create: function() {
		var background = this.add.sprite(Settings.GAME.WIDTH/2, Settings.GAME.HEIGHT/2, 'imageTitle');
		background.anchor = {x: 0.5, y: 0.5};

		// background.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		background.scale.multiply(Settings.GAME.WIDTH/background.width,Settings.GAME.HEIGHT/background.height)

		this.state.add('levelEdit', new LevelEditor());
		this.state.add('levelSelect',new LevelSelect(Settings.levels.length));

		BnBgame.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
			BnBgame.levelStatus.push(-1);
		};
		BnBgame.levelStatus[0] = 0; //unlock first level
		// BnBgame.levelStatus[1] = 1; //unlock first level
		// BnBgame.levelStatus[2] = 2; //unlock first level
		// BnBgame.levelStatus[3] = 3; //unlock first level


		BnBgame.input.onTap.add(this.startGame, this);
		BnBgame.input.keyboard.addCallbacks(this,null,this.startGame);

	},
	startGame: function(){
		BnBgame.input.keyboard.addCallbacks(this,null,null);
		this.state.start('levelSelect');
	}
};