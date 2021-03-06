/*
    The first state - initialize settings and preload the preloading bar!
*/
BnB.Boot = function() {};
BnB.Boot.prototype = {
    //initialize game settings
    init: function() 
    {
        BnB.scale = BnB.C.WIDTH / BnB.C.STANDARD_WIDTH;

        //If in demo mode - reassign levels array
        if(BnB.buildType == 'demo')
        {
            BnB.levels = BnB.C.LEVELS_DEMO;
        }
        else{
            BnB.levels = BnB.C.LEVELS_NORMAL;
        }

        //initialize level status
        BnB.SaveData.init();
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //set up kinetic scrolling (used in Level Select only)
        game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);
        game.kineticScrolling.configure({
            kineticMovement: true,
            timeConstantScroll: 325, //325 really mimic iOS
            horizontalScroll: false,
            verticalScroll: true,
            horizontalWheel: false,
            verticalWheel: true,
            deltaWheel: 40
        });
    },

    // Preload loading bar images.
    preload: function() 
    {
        this.load.image('loadingBar','images/loadingBar.png');
        this.load.image('loadingBack','images/loadingBarBack.png');
    },

    //Load the PRELOADER
    create: function() 
    {
        //start perloading
        game.state.start('Preloader');
    }
};