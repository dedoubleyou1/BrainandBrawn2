/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   ___          _                 _           
  / _ \_ __ ___| | ___   __ _  __| | ___ _ __ 
 / /_)/ '__/ _ \ |/ _ \ / _` |/ _` |/ _ \ '__|
/ ___/| | |  __/ | (_) | (_| | (_| |  __/ |   
\/    |_|  \___|_|\___/ \__,_|\__,_|\___|_|   
                                              

Summary: Entry point for the game. Initializes Phaser.Game, canvas, game states, and more!

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.Preloader = function() {};

BnB.Preloader.prototype = {

    /*
        Called before preload
    */
    init: function(){
        //TODO: fix awkward SHIFT on page resize
        this.loadingBar = this.add.image(this.world.centerX,this.world.centerY,'loadingBar');
        this.loadingBar.x = this.world.centerX - this.loadingBar.width/2;
        this.loadingBar.anchor.y = 0.5;

        this.loadingBack = this.add.image(this.world.centerX - this.loadingBar.width/2,this.world.centerY,'loadingBack');
        this.loadingBack.anchor.y = 0.5;
    },


    /*
        Core preload function - load spritesheet, images, audio, and level JSONs
    */
    preload: function() {
        
        //load in Spritesheets
        this.load.atlasJSONArray('spritesheet', 'images/spritesheet.png', 'images/spritesheet.json');
        this.load.atlasJSONArray('brainy_SpriteSheet', 'images/Brainy_SpriteSheet.png', 'images/Brainy_SpriteSheet.json');
        this.load.atlasJSONArray('brawny_SpriteSheet', 'images/Brawny_SpriteSheet.png', 'images/Brawny_SpriteSheet.json');
        this.load.atlasJSONArray('block_SpriteSheet', 'images/seamlessWalls.png', 'images/seamlessWalls.json');


        // Static Images
        this.load.image('backArrow','images/back-arrow.png');
        this.load.image('forwardArrow','images/forward-arrow.png');
        this.load.image('arrow','images/arrow.png');
        this.load.image('dimensions','images/dimensions.png');
        this.load.image('saveIcon','images/saveButton.png');
        this.load.image('flipIcon','images/flipButton.png');
        this.load.image('flipVertIcon','images/flipButtonVert.png');
        this.load.image('settingsButton','images/settingsButton.png');

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
        this.load.image('victory','images/missionSuccess.png');
        this.load.image('star','images/star.png');
        this.load.image('star1','images/star1.png');
        this.load.image('star2','images/star2.png');
        this.load.image('star3','images/star3.png');

        // Sound
        // this.load.audio('thunk','sound/rs.mp3');
        // this.load.audio('select','sound/select_2.wav');
        // this.load.audio('death','sound/death_2.wav');
        // this.load.audio('finish','sound/finish_2.wav');
        // this.load.audio('kill','sound/kill_2.wav');
        // this.load.audio('switch','sound/switch_2.wav');
        BnB.AudioManager.preload(this);


        //TEMP: FOR LEVEL EDITOR
        this.load.image('floor','images/spritesheet/brainandbrawn_floor.png');
        this.load.image('brainy','images/spritesheet/brainandbrawn_brainy-b.png');
        this.load.image('brawny','images/spritesheet/brainandbrawn_brawny-b.png');
        this.load.image('block','images/spritesheet/brainandbrawn_block.png');
        this.load.image('alien','images/spritesheet/brainandbrawn_alien-b.png');
        this.load.image('alienRoller','images/spritesheet/brainandbrawn_alien4.png');
        this.load.image('goalBrainy','images/spritesheet/brainandbrawn_goalBrainy.png');
        this.load.image('goalBrawny','images/spritesheet/brainandbrawn_goalBrawny.png');
        this.load.image('moveable','images/spritesheet/brainandbrawn_slidingBlock.png');
        this.load.image('pipe0','images/spritesheet/brainandbrawn_pipe0.png');
        this.load.image('spikedBlock','images/spritesheet/brainandbrawn_alien2.png');
        this.load.image('switchNew1A','images/spritesheet/brainandbrawn_switchNew1A.png');
        this.load.image('switchNew1B','images/spritesheet/brainandbrawn_switchNew1B.png');
        this.load.image('switchNew2A','images/spritesheet/brainandbrawn_switchNew2A.png');
        this.load.image('switchNew2B','images/spritesheet/brainandbrawn_switchNew2B.png');
        this.load.image('switchNew3A','images/spritesheet/brainandbrawn_switchNew3A.png');
        this.load.image('switchNew3B','images/spritesheet/brainandbrawn_switchNew3B.png');
        this.load.image('switchNew4A','images/spritesheet/brainandbrawn_switchNew4A.png');
        this.load.image('switchNew4B','images/spritesheet/brainandbrawn_switchNew4B.png');
        this.load.image('gateNew1C','images/spritesheet/brainandbrawn_gateNew1C.png');
        this.load.image('gateNew1D','images/spritesheet/brainandbrawn_gateNew1D.png');
        this.load.image('gateNew2C','images/spritesheet/brainandbrawn_gateNew2C.png');
        this.load.image('gateNew2D','images/spritesheet/brainandbrawn_gateNew2D.png');
        this.load.image('gateNew3C','images/spritesheet/brainandbrawn_gateNew3C.png');
        this.load.image('gateNew3D','images/spritesheet/brainandbrawn_gateNew3D.png');
        this.load.image('gateNew4C','images/spritesheet/brainandbrawn_gateNew4C.png');
        this.load.image('gateNew4D','images/spritesheet/brainandbrawn_gateNew4D.png');
        this.load.image('spikey','images/spritesheet/brainandbrawn_alien3.png');
        this.load.image('breakable','images/spritesheet/brainandbrawn_wallDamaged.png');
        this.load.image('coloredPeg1','images/spritesheet/brainandbrawn_peg1.png');
        this.load.image('coloredPeg2','images/spritesheet/brainandbrawn_peg2.png');
        this.load.image('coloredPeg3','images/spritesheet/brainandbrawn_peg3.png');
        this.load.image('coloredPeg4','images/spritesheet/brainandbrawn_peg4.png');
        this.load.image('playButton', 'images/playButton.png');
        this.load.image('stopButton', 'images/stopButton.png');
        this.load.image('eraser','images/eraserTool.png');
        this.load.image('empty','images/cancel.png');
        //END TEMP FOR LEVEL EDITOR

        // Levels
        BnB.levels.forEach(function(element, index){
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