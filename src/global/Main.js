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

    spikeDeath: false,
    boundsDeath: false,

    //
    fromState: 'TitleScreen',
};

/*
    Constants for game-wide use
*/
BnB.C = {
    LEVELS_PER_PAGE: 100,

    //Core constants
    //sizing
    STANDARD_WIDTH: 1536,
    STANDARD_HEIGHT: 2048,
    WIDTH: 640,
    HEIGHT: 900,//900, 1136
    STRETCH: 'width',

    //Game Variables
    BOUNDARY_DEATH: true,

    //Visuals
    ENABLE_LEVEL_NAMES: true,
    ENABLE_STARS: true,
    SWIPING_OFFSET: false,
    SWIPING_LEANING: true,
    ENABLE_SCREEN_SHAKE: true,
    ENABLE_SEAMLESS_WALLS: true,

    //constants for the GraphicManager state
    TILESIZE: 256,
    OFFSET: 0.25,
    SKINNYSIZE: 32,
    
    //TODO: Set dynamically with screen size
    HUD_HEIGHT: 80,
    BOTTOM_HUD_HEIGHT: 40,
    BORDER_X: 30,
    HIDE_STARS: false,

    //Audio
    VOLUME_SETTINGS: 0.3,
    VOLUME_FINISH: 0.15,
    DURATION_CROSS_FADE: 800,


    LEVELS_DEMO: [
        //Basic
        'levels/splitlevel_starter.json',
        'levels/startlevel3_v2.json',

        'levels/test_reorientation0_v2.json',
        'levels/fliplevel_v2.json',

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
        // 'levels/test/AlienC_test.json',//TEST

        //Basic + Spatial 
        'levels/idiot_proof.json',
        'levels/starterB.json',
        'levels/splitlevel.json',
        'levels/rotate_simple.json',
        'levels/test_reorientation0_v2b.json',
        'levels/teamlevel.json',
        'levels/dots_v1.json',
        'levels/test_reorientation3.json',

        //enemy
        'levels/alienA_basic.json', //NEW
        'levels/alienA_basic2.json', //NEW
        'levels/alienA_basic3.json', //NEW
        //Split enemy00 up into basic and basic 2. Concept was good but we need to show the new sprite more clearly first since it's a new mechanic.
        //'levels/enemy00.json', 
        'levels/rotateEnemy.json',
        'levels/enemy02.json',
        'levels/rampage_v3.json',
        'levels/tower_v2.json',

        //switches
        'levels/wallgatelevel_v2.json',
        'levels/switches_basic1.json', 
        'levels/gatetunnellevel.json',
        'levels/gatelevel.json',
        'levels/test_colors1.json',
        'levels/musicalscale.json',
        'levels/openbutton_00.json',

        //open
        'levels/openlevel0_v2.json',
        'levels/openLevel02.json',
        'levels/openLevel03.json',
        'levels/tetris_v2.json',
        'levels/switchCenter_v1.json',
        'levels/scatterplot.json',

        //pegs
        'levels/rotatePegs.json',
        'levels/gates1.json',
        'levels/passagelevel.json',
        'levels/pegBridge_v2.json',

        //breakable
        'levels/breakspace.json',
        'levels/test_breakable0.json',
        'levels/test_breakable1.json',
        'levels/test_breakable2.json',
        'levels/switchCracked.json',
        'levels/brokenBridge.json', 
        'levels/test_breakable3.json',

        //colored pegs
        'levels/switchPegs01.json',
        'levels/switchPegs02.json',
        'levels/switchPegs03.json',

        //spike
        'levels/test_spikedBlock0.json',
        'levels/rotateSpike02.json',
        'levels/test_spike1_v2.json',
        'levels/spikeCrack02.json',

        //moving green alien
        'levels/greenMover.json',
        'levels/activealien.json',
        'levels/brawnypit.json',

        //movable
        'levels/test_movable2.json',
        'levels/test_movable3.json',
        'levels/moveBlock01.json',
        'levels/test_movable1_v2.json',
        'levels/test_moveBlock0.json',

        //moving spikey alien
        'levels/test_spikedBall0.json',
        'levels/test_spikedBall1.json',
        'levels/test_spikedBall2.json',

        //hard levels
        'levels/holycrap.json',
        'levels/superHard.json',
    ],

    LEVELS_TEST: [
    ]
};