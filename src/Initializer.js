var BnBgame = new Phaser.Game(Settings.GAME.WIDTH, Settings.GAME.HEIGHT, Phaser.AUTO, 'game', {
	preload: function() {
		// Preload loading bar images.
		// this.load.image('preloaderBg','images/preloaderBg.png');
        // this.load.image('preloaderBar', 'images/preloaderBar.png');
	},
	create: function() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.state.add('Preloader', Preloader);
		this.state.add('MainMenu', MainMenu);
		this.state.start('Preloader');
	}
});