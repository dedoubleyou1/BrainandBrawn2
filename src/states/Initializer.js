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
game.state.add('Boot', BnB.Boot);
game.state.add('Preloader', BnB.Preloader);
game.state.add('TitleScreen', BnB.TitleScreen);
game.state.add('MainMenu', BnB.MainMenu);
game.state.add('OptionsMenu', BnB.OptionsMenu);
game.state.add('AboutMenu', BnB.AboutMenu);
game.state.add('LevelSelect', BnB.LevelSelect);
game.state.add('LevelBuilder', BnB.LevelBuilder);

//Add each level as a separate state
BnB.SaveData.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
for (var i = 0; i < C.levels.length; i++) {
  game.state.add('level'+i, new BnB.Level(i));
  BnB.SaveData.levelStatus.push(-1);
};
BnB.SaveData.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)

//start BOOT.js
game.state.start('Boot');