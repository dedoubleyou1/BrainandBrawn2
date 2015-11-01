/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  _____       _ _   _       _ _              
  \_   \_ __ (_) |_(_) __ _| (_)_______ _ __ 
   / /\/ '_ \| | __| |/ _` | | |_  / _ \ '__|
/\/ /_ | | | | | |_| | (_| | | |/ /  __/ |   
\____/ |_| |_|_|\__|_|\__,_|_|_/___\___|_|   
                                             

Summary: Entry point for the game. Initializes Phaser.Game, canvas, game states, and more!

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*
  Initialize the BnBgame (Phaser.Game object)
*/
var BnBgame = new Phaser.Game(Settings.GAME.WIDTH, Settings.GAME.HEIGHT, Phaser.AUTO, 'game', {
	init: function() 
  {
    Settings.GAME.SCALE = Settings.GAME.WIDTH / Settings.GAME.STANDARD_WIDTH;
  },
  preload: function() 
  {
		// Preload loading bar images.
		this.load.image('loadingBar','images/loadingBar.png');
    this.load.image('loadingBack','images/loadingBarBack.png');
	},
	create: function() 
  {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.state.add('Preloader', Preloader);
		this.state.add('TitleScreen', TitleScreen);
    this.state.add('MainMenu', MainMenu);
    this.state.add('OptionsMenu', OptionsMenu);
    this.state.add('AboutMenu', AboutMenu);
    this.state.add('LevelSelect',new LevelSelect(Settings.levels.length));

    //start perloading
		this.state.start('Preloader');
	}
});