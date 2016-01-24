//Main Game Object
var BrainAndBrawn = {
    //Constants
    
};

BrainAndBrawn.Boot = function() {};

BrainAndBrawn.Boot.prototype = {
    //initialize game settings
    init: function() 
    {
        C.SCALE = C.WIDTH / C.STANDARD_WIDTH;

        //If in demo mode - reassign levels array
        if(C.MODE == 'demo')
        {
          C.levels = C.levels_demo;
        }
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
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