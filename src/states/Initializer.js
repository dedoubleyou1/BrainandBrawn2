/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  _____       _ _   _       _ _              
  \_   \_ __ (_) |_(_) __ _| (_)_______ _ __ 
   / /\/ '_ \| | __| |/ _` | | |_  / _ \ '__|
/\/ /_ | | | | | |_| | (_| | | |/ /  __/ |   
\____/ |_| |_|_|\__|_|\__,_|_|_/___\___|_|   
                                             

Summary: Entry point for the game. Initialize Phaser.Game and adds states

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


//Phaser Game Object
var game = new Phaser.Game(C.WIDTH, C.HEIGHT);

//add states
game.state.add('Boot', BrainAndBrawn.Boot);
game.state.add('Preloader', BrainAndBrawn.Preloader);
game.state.add('TitleScreen', BrainAndBrawn.TitleScreen);
game.state.add('MainMenu', BrainAndBrawn.MainMenu);
game.state.add('OptionsMenu', BrainAndBrawn.OptionsMenu);
game.state.add('AboutMenu', BrainAndBrawn.AboutMenu);
game.state.add('LevelSelect', BrainAndBrawn.LevelSelect);
game.state.add('LevelBuilder', BrainAndBrawn.LevelBuilder);

//Add each level as a separate state
BrainAndBrawn.SaveData.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
for (var i = 0; i < C.levels.length; i++) {
  game.state.add('level'+i, new BrainAndBrawn.Level(i));
  BrainAndBrawn.SaveData.levelStatus.push(-1);
};
BrainAndBrawn.SaveData.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)

//start BOOT.js
game.state.start('Boot');