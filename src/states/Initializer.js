/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  _____       _ _   _       _ _              
  \_   \_ __ (_) |_(_) __ _| (_)_______ _ __ 
   / /\/ '_ \| | __| |/ _` | | |_  / _ \ '__|
/\/ /_ | | | | | |_| | (_| | | |/ /  __/ |   
\____/ |_| |_|_|\__|_|\__,_|_|_/___\___|_|   
                                             

Summary: Entry point for the game. Initializes Phaser.Game, canvas, game states, and more!

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


/*
  Initialize the game (Phaser.Game object)
*/
var game = new Phaser.Game(Settings.GAME.WIDTH, Settings.GAME.HEIGHT, Phaser.AUTO, 'game', {
	
  //initialize game settings
  init: function() 
  {
    Settings.GAME.SCALE = Settings.GAME.WIDTH / Settings.GAME.STANDARD_WIDTH;

    //If in demo mode - reassign levels array
    if(Settings.GAME.MODE == 'demo')
    {
      Settings.levels = Settings.levels_demo;
    }
  },

  // Preload loading bar images.
  preload: function() 
  {
		this.load.image('loadingBar','images/loadingBar.png');
    this.load.image('loadingBack','images/loadingBarBack.png');
	},

  //set up Phaser states and star the Preloader
	create: function() 
  {
    //add core states
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.state.add('Preloader', Preloader);
		this.state.add('TitleScreen', TitleScreen);
    this.state.add('MainMenu', MainMenu);
    this.state.add('OptionsMenu', OptionsMenu);
    this.state.add('AboutMenu', AboutMenu);
    this.state.add('LevelSelect',new LevelSelect(Settings.levels.length));
    this.state.add('LevelBuilder', LevelBuilder);

    //Add each level as a separate state
    SaveData.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
    for (var i = 0; i < Settings.levels.length; i++) {
      this.state.add('level'+i, new Level(i));
      SaveData.levelStatus.push(-1);
    };
    SaveData.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)

    //start perloading
		this.state.start('Preloader');
	}
});