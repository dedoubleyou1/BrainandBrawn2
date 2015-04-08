MainMenu = function() {};
MainMenu.prototype = {
	create: function() {
		var background = this.add.sprite(0, 0, 'imageTitle');
		background.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);

		this.state.add('levelEdit', new LevelEditor());

		for (var i = 0; i < Settings.levels.length; i++) {
			this.state.add('level'+i, new Level(i));
		};

		BnBgame.input.onTap.add(function() {
			this.state.start('level0');
		}, this);

	}
};