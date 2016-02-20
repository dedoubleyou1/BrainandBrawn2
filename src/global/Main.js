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
};

/*
    Constants for game-wide use
*/
BnB.C = {
    LEVELS_PER_PAGE: 100,

    //Core constants
    //sizing
    STANDARD_WIDTH: 2048,
    STANDARD_HEIGHT: 1536,
    WIDTH: 640,
    HEIGHT: 900,//900, 1136
    STRETCH: 'width',

    //Game Variables
    BOUNDARY_DEATH: true,

    //Visuals
    ENABLE_STARS: false,
    SWIPING_OFFSET: false,
    SWIPING_LEANING: true,
    ENABLE_SCREEN_SHAKE: true,

    //constants for the GraphicManager state
    TILESIZE: 256,
    OFFSET: 0.25,
    SKINNYSIZE: 32,
    
    //TODO: Set dynamically with screen size
    HUD_HEIGHT: 80,
    BOTTOM_HUD_HEIGHT: 40,
    BORDER_X: 30,


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

        //TEST - 2

        //REMOVED

        //Basic
        'levels/starterA.json',//NEW
        'levels/starterB.json',//NEW
        'levels/starterC.json',//NEW
        'levels/splitlevel_starter.json',
        'levels/startlevel3_v2.json',

        //spatial
        'levels/rotate_simple.json',
        'levels/test_reorientation0_v2b.json',
        'levels/teamlevel.json',
        'levels/reorientation04_snake.json',
        'levels/rotation.json',
        'levels/fliplevel_v2.json',
        'levels/doubleBrain.json',
        'levels/test_reorientation3.json',

        //enemy
        'levels/enemy00.json',
        'levels/rotateEnemy.json',
        'levels/enemy02.json',
        'levels/enemy03_Rampage01_v2.json',
        'levels/tower.json',

        //switches
        'levels/wallgatelevel_v2.json',
        'levels/gatelevel.json',
        'levels/gatetunnellevel.json',
        'levels/test_colors1.json',

        //pegs
        'levels/passagelevel.json',
        'levels/rotatePegs.json',
        'levels/gates1.json',
        'levels/pegBridge.json',

        //open
        'levels/openlevel0_v2.json',
        'levels/openLevel02.json',
        'levels/openLevel03.json',
        'levels/tetris.json',

        //colored pegs
        'levels/switchPegs01.json',//put enemy in center
        'levels/switchPegs02.json',
        'levels/switchPegs03.json',

        //breakable
        'levels/test_breakable0.json',
        'levels/test_breakable1.json',
        'levels/test_breakable2.json',
        'levels/switchCracked.json',

        //spike
        'levels/test_spikedBlock0.json',
        'levels/rotateSpike02.json',
        'levels/test_spike1_v2.json',
        'levels/test_spike2.json',
        'levels/spikeCrack02.json',

        //moving green alien

        //moving psikey alien
        'levels/test_spikedBall0.json',
        'levels/test_spikedBall1.json',
        'levels/test_spikedBall2.json',

        //movable
        'levels/test_movable2.json',
        'levels/test_movable3.json',
        'levels/moveBlock01.json',
        'levels/test_movable1_v2.json',
        'levels/test_moveBlock0.json',

        //moveable + 
        //superHard - FINISH LEVEL!
    ],

    LEVELS_TEST: [
    ]
};