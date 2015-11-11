/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
 __      _   _   _                 
/ _\ ___| |_| |_(_)_ __   __ _ ___ 
\ \ / _ \ __| __| | '_ \ / _` / __|
_\ \  __/ |_| |_| | | | | (_| \__ \
\__/\___|\__|\__|_|_| |_|\__, |___/
                         |___/     

Summary: Global values for game-wide use

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Settings = {
    DEBUG: {
        MODE: 'demo',
        SWIPING_OFFSET: false,
    },
    //Core settings
    GAME: {
        STANDARD_WIDTH: 2048,
        STANDARD_HEIGHT: 1536,
        WIDTH: 640,
        HEIGHT: 900,//1136,//960,
        SCALE: 1,
        STRETCH: 'width',
        SPIKEY_DEATH: false,
        LEVEL_MODE: 'normal',
    },

    //Settings for the GraphicManager state
    GRAPHICS: {
        BORDER_SIZE: 0.375,
        TILESIZE: 256,
        OFFSET: 0.25,
        SKINNYSIZE: 32,
        HUD_HEIGHT: 50,
    },

    //Settings for the LevelEditor state
    EDITOR: {
        MAP_XOFFSET: 0,
        MAP_YOFFSET: 500,
        MAP_WIDTH: 2048,
        MAP_HEIGHT: 1536
    },

    BUILDER: {
        DATA: {},
        GRID_X: 8,
        GRID_Y: 8,
    },


    empty_levels: [
        'emptyLevel.json',
    ],

    /*
    Array of level paths to load. 
    Order of array = order of levels
    */
    levels: [

        //CUT LEVELS
        // //'levels/startlevel0.json', - - CUT
        // // 'levels/startlevel1.json', - - CUT
        // 'levels/openlevel.json', - - CUT
        // 'levels/openlevel2.json', - - CUT
        // 'levels/passagelevel.json', - - CUT
        // 'levels/startlevel2.json', - - CUT
        // 'levels/startlevel4.json', - - CUT
        // 'levels/startlevel_skinny.json', - - CUT
        // 'levels/test_reorientation1.json', --CUT
        // 'levels/test_spikedBlock.json',--CUT
        // 'levels/test_spikedBall.json',
        // 'levels/test_moveBlock.json', --CUT
        // 'levels/test_breakable.json',--CUT

        // 'levels/test_reorientation2.json',--TEMPREMOVE
        // 'levels/teamlevel.json', --TEMPREMOVE
        // 'levels/test_random1.json', --TEMPREMOVE

        //ACTUAL test levels
        // 'levels/testReal_01.json',

        //TEST LOAD LEVEL
        // 'levels/my_level.json',

        //Basic
        'levels/startlevel5.json',
        'levels/splitlevel.json',
        'levels/startlevel3.json',

        'levels/test_reorientation0.json',
        'levels/fliplevel.json',


        'levels/enemylevel2.json',
        'levels/enemylevel1.json',

        'levels/wallgatelevel.json',
        'levels/gatelevel.json',
        'levels/gatetunnellevel.json',
        'levels/test_colors1.json',

        'levels/gates1.json',
        // 'levels/openlevel0.json',

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
}