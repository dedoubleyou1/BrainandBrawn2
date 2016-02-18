/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  _____       _ _   _       _ _              
  \_   \_ __ (_) |_(_) __ _| (_)_______ _ __ 
   / /\/ '_ \| | __| |/ _` | | |_  / _ \ '__|
/\/ /_ | | | | | |_| | (_| | | |/ /  __/ |   
\____/ |_| |_|_|\__|_|\__,_|_|_/___\___|_|   
                                             

Summary: Entry point for the game - called from the HTML body

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */


//Phaser Game Object
var ratio = window.innerHeight/window.innerWidth; // Gets screen ratio
var height = (BnB.C.WIDTH * ratio > BnB.C.HEIGHT) ? BnB.C.WIDTH * ratio : BnB.C.HEIGHT;
var game = new Phaser.Game(BnB.C.WIDTH, height); //Stretch height to fill device

//add states
game.state.add('Boot', BnB.Boot);
game.state.add('Preloader', BnB.Preloader);
game.state.add('TitleScreen', BnB.TitleScreen);
game.state.add('MainMenu', BnB.MainMenu);
game.state.add('LevelSelect', BnB.LevelSelect);
game.state.add('LevelBuilder', BnB.LevelBuilder);
game.state.add('Level',BnB.Level);

//start BOOT.js
game.state.start('Boot');