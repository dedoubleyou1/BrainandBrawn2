/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   ___          _                 _           
  / _ \_ __ ___| | ___   __ _  __| | ___ _ __ 
 / /_)/ '__/ _ \ |/ _ \ / _` |/ _` |/ _ \ '__|
/ ___/| | |  __/ | (_) | (_| | (_| |  __/ |   
\/    |_|  \___|_|\___/ \__,_|\__,_|\___|_|   
                                              

Summary: Entry point for the game. Initializes Phaser.Game, canvas, game states, and more!

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Preloader = function() {};

Preloader.prototype = {

    /*
        Called before preload
    */
    init: function(){

        //TODO: fix awkward SHIFT on page resize
        this.loadingBar = BnBgame.add.image(this.world.centerX,this.world.centerY,'loadingBar');
        this.loadingBar.x = this.world.centerX - this.loadingBar.width/2;
        this.loadingBar.anchor.y = 0.5;

        this.loadingBack = BnBgame.add.image(this.world.centerX - this.loadingBar.width/2,this.world.centerY,'loadingBack');
        this.loadingBack.anchor.y = 0.5;
    },


    /*
        Core preload function - load spritesheet, images, audio, and level JSONs
    */
    preload: function() {
        
        //load in main spritehseet
        this.load.atlasJSONArray('spritesheet', 'images/spritesheet.png', 'images/spritesheet.json');

        // Static Images

        // New Tutorial images
        this.load.image('tutorial1','images/tutorials-01.png');
        this.load.image('tutorial2','images/tutorials-02.png');
        this.load.image('tutorial3','images/tutorials-03.png');
        this.load.image('tutorial4','images/tutorials-04.png');
        this.load.image('tutorial5','images/tutorials-05.png');
        this.load.image('tutorial6','images/tutorials-06.png');
        this.load.image('tutorial7','images/tutorials-07.png');
        this.load.image('tutorial8','images/tutorials-08.png');
        this.load.image('tutorial9','images/tutorials-09.png');

        //HUD & Title && reset button
        this.load.image('imageHUD','images/HUD-04.png'); //800x51
        // this.load.spritesheet('rButton', 'images/HUD-04.png',60,60);
        this.load.image('rButton', 'images/restart-button.png');
        this.load.image('pButton', 'images/play-button.png');
        this.load.image('mButton', 'images/menu-button-02.png');
        // this.load.image('imageTitle','images/titlescreen-01.png');
        this.load.image('imageTitle','images/titlescreen-03.png');
        this.load.image('star','images/star.png');
        this.load.image('star1','images/star1.png');
        this.load.image('star2','images/star2.png');
        this.load.image('star3','images/star3.png');

        // Sound
        this.load.audio('thunk','sound/rs.mp3');
        this.load.audio('select','sound/select_2.wav');
        this.load.audio('death','sound/death_2.wav');
        this.load.audio('finish','sound/finish_2.wav');
        this.load.audio('kill','sound/kill_2.wav');
        this.load.audio('switch','sound/switch_2.wav');

        // Levels
        Settings.levels.forEach(function(element, index){
            this.load.text('level'+index, element);
        }, this)

        //Add handler to update loading %
        this.load.onFileComplete.add(this.fileLoaded, this);
    },

    /*
        As files are loaded, update the size of the loading bar
    */
    fileLoaded: function (progress) {
        this.loadingBar.scale.setTo(progress/100,1);
    },

    /*
        When preloading is finished - start the Title Screen!
    */
    create: function() {
        this.state.start('TitleScreen');
    }
};