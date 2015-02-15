MainMenu = function() {};
MainMenu.prototype = {
	create: function() {
		var background = this.add.sprite(0, 0, 'imageTitle');
		background.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);

		//this.startButton = this.add.button((320-146)/2, 200, 'button-start', this.startGame, this, 1, 0, 2);
		// instructions = this.game.add.text(
		// 	60, 250, "Use arrow keys on desktop, \n  accelerometer on mobile",
		// 	{ font: "16px Arial", fill: "#b921fe", stroke: "#22053a", strokeThickness: 3 }
		// );
		this.state.add('levelEdit', new LevelEditor());

		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
		};

		BnBgame.input.onTap.add(function() {
			this.state.start('level0');
		}, this);

	}
};