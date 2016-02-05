//Main Game Object
var BnB = {
    //properties for game-wide use
    levels: [],
    scale: 1,

    levelBuilderX: 8,
    levelBuilderY: 8,
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

    //mode
    LEVEL_MODE: 'normal',
    MODE: 'test',//test, demo, normal

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

    // BUILDER_START_X,
    // BUILDER_START_Y,


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

        //TEST
        // 'levels/test/openlevel.json',
        // 'levels/test/startlevel4.json',
        // 'levels/test/test_reorientation2.json',

        //Basic
        ' levels/startlevel5.json',
        'levels/splitlevel.json',
        'levels/startlevel3.json',

        'levels/test_reorientation0_v2.json',
        'levels/test/teamlevel.json',
        'levels/test/reorientation04_snake.json',
        'levels/fliplevel_v2.json',
        'levels/test_reorientation3.json',

        'levels/enemylevel2.json',
        'levels/enemylevel1.json',

        'levels/test/passagelevel.json',

        'levels/wallgatelevel.json',
        'levels/gatelevel.json',
        'levels/gatetunnellevel.json',
        'levels/test_colors1.json',

        'levels/test/passagelevel.json',
        'levels/gates1.json',

        //open
        'levels/test/openlevel0.json',

        'levels/test_breakable0.json',
        'levels/test_breakable1.json',
        'levels/test_breakable2.json',


        'levels/test_spikedBlock0.json',
        'levels/test_spike1.json',
        'levels/test_spike2.json',

        'levels/test_spikedBall0.json',
        'levels/test_spikedBall1.json',
        'levels/test_spikedBall2.json',

        'levels/test_movable2.json',
        'levels/test_movable3.json',
        'levels/test_movable1.json',
        'levels/test_moveBlock0.json',
    ]
};