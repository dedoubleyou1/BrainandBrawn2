Settings.GAME.WIDTH = window.innerWidth * window.devicePixelRatio;
Settings.GAME.HEIGHT = window.innerHeight * window.devicePixelRatio;

  var screenRatio = Settings.GAME.WIDTH / Settings.GAME.HEIGHT;

  var defaultRatio = Settings.GAME.STANDARD_WIDTH / Settings.GAME.STANDARD_HEIGHT;

  var convertValues = {};

  if (screenRatio > defaultRatio) {
    //base on level height
    Settings.GAME.STRETCH = 'height';
    Settings.GAME.SCALE = Settings.GAME.HEIGHT / Settings.GAME.STANDARD_HEIGHT;
  } else {
    //base on level width
    Settings.GAME.STRETCH = 'width';
    Settings.GAME.SCALE = Settings.GAME.WIDTH / Settings.GAME.STANDARD_WIDTH;
  }


var BnBgame = new Phaser.Game(Settings.GAME.WIDTH, Settings.GAME.HEIGHT, Phaser.CANVAS, 'game', {
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