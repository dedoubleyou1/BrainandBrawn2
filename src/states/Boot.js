BnB.Boot = function() {};

BnB.Boot.prototype = {
    //initialize game settings
    init: function() 
    {
        BnB.C.SCALE = BnB.C.WIDTH / BnB.C.STANDARD_WIDTH;

        //If in demo mode - reassign levels array
        if(BnB.C.MODE == 'demo')
        {
          BnB.C.levels = BnB.C.levels_demo;
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