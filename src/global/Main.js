//Main Game Object
var BnB = {
    //properties for game-wide use
    levels: [],
    scale: 1,

    levelBuilderX: 8,
    levelBuilderY: 8,

    //mode
    levelType: 'normal',
    buildType: 'normal',//normal, test, demo
};

/*
    Constants for game-wide use
*/
BnB.C = {
    //Core constants
    //sizing
    STANDARD_WIDTH: 2048,
    STANDARD_HEIGHT: 1536,
    WIDTH: 640,
    HEIGHT: 900,//900, 1136
    STRETCH: 'width',

    //Game Variables
    SPIKEY_DEATH: false,
    BOUNDARY_DEATH: true,

    //Visuals
    SWIPING_OFFSET: false,

    //constants for the GraphicManager state
    BORDER_SIZE: 0.375,
    TILESIZE: 256,
    OFFSET: 0.25,
    SKINNYSIZE: 32,
    HUD_HEIGHT: 50,


    LEVELS_DEMO: [
        //Basic
        'levels/splitlevel_starter.json',
        'levels/startlevel3_v2.json',

        'levels/test_reorientation0_v2.json',
        'levels/fliplevel_v2.json',

        // 'levels/enemylevel2.json',
        'levels/enemy00.json',

        'levels/wallgatelevel_v2.json',
        'levels/gatelevel.json',
        'levels/test_colors1.json',

        'levels/gates1.json',
        'levels/gatetunnellevel.json',

        //open
        'levels/openlevel0_v2.json',

        'levels/test_spike1_v2.json',

        'levels/test_spikedBall0.json',

        'levels/test_movable3.json',
        'levels/test_movable1_v2.json',
    ],

    /*
    Array of level paths to load. 
    Order of array = order of levels
    */
    LEVELS_NORMAL: [

        //TEST - EH
        // 'levels/test/startlevel4.json',
        // 'levels/test/test_reorientation2.json',
        // 'levels/test/001.json',

        //TEST - 2

        //REMOVED
        // 'levels/enemylevel2.json',
        // 'levels/enemylevel1.json',

        //Basic
        'levels/splitlevel_starter.json',
        'levels/startlevel3_v2.json',

        'levels/test_reorientation0_v2.json',
        'levels/teamlevel.json',
        'levels/reorientation04_snake.json',
        'levels/fliplevel_v2.json',
        'levels/test_reorientation3.json',

        'levels/enemy00.json',
        'levels/test/enemy02.json',
        'levels/test/enemy03_Rampage01_v2.json',

        'levels/wallgatelevel_v2.json',
        'levels/gatelevel.json',
        'levels/gatetunnellevel.json',
        'levels/test_colors1.json',

        //pegs
        'levels/passagelevel.json',
        'levels/gates1.json',
        'levels/test/pegBridge.json',

        //open
        'levels/openlevel0_v2.json',
        'levels/test/openLevel02.json',
        'levels/test/openLevel03.json',

        //colored 
        'levels/test/switchPegs01.json',
        'levels/test/switchPegs02.json',
        'levels/test/switchPegs03.json',

        //breakable
        'levels/test_breakable0.json',
        'levels/test_breakable1.json',
        'levels/test_breakable2.json',

        //spike
        'levels/test_spikedBlock0.json',
        'levels/test_spike1_v2.json',
        'levels/test_spike2.json',

        //spiked ball
        'levels/test_spikedBall0.json',
        'levels/test_spikedBall1.json',
        'levels/test_spikedBall2.json',

        //movable
        'levels/test_movable2.json',
        'levels/test_movable3.json',
        'levels/test_movable1_v2.json',
        'levels/test_moveBlock0.json',
    ],

    LEVELS_TEST: [
    ]
};