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
    
    PATH_LEVELS: 'levels/',
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
        'splitlevel_starter',
        'startlevel3_v2',

        'test_reorientation0_v2',
        'fliplevel_v2',

        'enemy00',

        'wallgatelevel_v2',
        'gatelevel',
        'test_colors1',

        'gates1',
        'gatetunnellevel',

        //open
        'openlevel0_v2',

        'test_spike1_v2',

        'test_spikedBall0',

        'test_movable3',
        'test_movable1_v2',
    ],

    /*
    Array of level paths to load. 
    Order of array = order of levels
    */
    LEVELS_NORMAL: [

        //TEST - EH
        // 'test/startlevel4',
        // 'test/test_reorientation2',
        // 'test/001',
        // 'test/AlienC_test',//TEST

        //Basic + Spatial 
        'idiot_proof',
        'starterB',
        'splitlevel',
        'rotate_simple',
        'test_reorientation0_v2b',
        'teamlevel',
        'dots_v1',
        'test_reorientation3',

        //enemy
        'alienA_basic', //NEW
        'alienA_basic2', //NEW
        'alienA_basic3', //NEW
        'rotateEnemy',
        'enemy02',
        'rampage_v3',
        'tower_v2',

        //switches
        'wallgatelevel_v2',
        'switches_basic1', //NEW
        'gatetunnellevel',
        'gatelevel',
        'test_colors1',
        'musicalscale',
        'openbutton_00', //NEW

        //open
        'openlevel0_v2',
        'openLevel02',
        'openLevel03',
        'tetris_v2',
        'switchCenter_v1',
        'scatterplot',

        //pegs
        'rotatePegs',
        'gates1',
        'passagelevel',
        'pegBridge_v2',

        //breakable
        'breakspace',
        'test_breakable0',
        'test_breakable1',
        'test_breakable2',
        'switchCracked',
        'brokenBridge', 
        'test_breakable3',

        //colored pegs
        'switchPegs01',
        'switchPegs02',
        'switchPegs03',

        //spike
        'test_spikedBlock0',
        'rotateSpike02',
        'test_spike1_v2',
        'spikeCrack02',

        //moving green alien
        'greenMover',
        'activealien',
        'brawnypit',

        //movable
        'test_movable2',
        'test_movable3',
        'moveBlock01',
        'test_movable1_v2',
        'test_moveBlock0',

        //moving spikey alien
        'test_spikedBall0',
        'test_spikedBall1',
        'test_spikedBall2',

        //hard levels
        'holycrap',
        'superHard',
    ],

    LEVELS_TEST: [
    ]
};