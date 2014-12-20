MainMenu = function() {};
MainMenu.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'imageTitle');
		//this.startButton = this.add.button((320-146)/2, 200, 'button-start', this.startGame, this, 1, 0, 2);
		// instructions = this.game.add.text(
		// 	60, 250, "Use arrow keys on desktop, \n  accelerometer on mobile",
		// 	{ font: "16px Arial", fill: "#b921fe", stroke: "#22053a", strokeThickness: 3 }
		// );

		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
		};

		this.state.start('level0');
	}
};