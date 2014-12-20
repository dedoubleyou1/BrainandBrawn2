var BnBgame = new Phaser.Game(640, 960, Phaser.AUTO, 'game', {
	preload: function() {
		// Preload loading bar images.
		// this.load.image('preloaderBg','images/preloaderBg.png');
        // this.load.image('preloaderBar', 'images/preloaderBar.png');
	},
	create: function() {
		this.state.add('Preloader', Preloader);
		this.state.add('MainMenu', MainMenu);
		this.state.start('Preloader');
	}
});