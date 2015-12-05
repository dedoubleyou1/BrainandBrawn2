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
        BOUNDARY_DEATH: true,
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
        'levels/fliplevel.json',
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
}