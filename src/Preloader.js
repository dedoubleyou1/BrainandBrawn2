Preloader = function() {};

Preloader.prototype = {
    preload: function() {
        // // Loading Bars
        // this.preloadBg = this.add.sprite(BnBthis.width/2, BnBthis.height/2, 'preloaderBg');
        // this.preloadBar = this.add.sprite(BnBthis.width/2, BnBthis.height/2, 'preloaderBar');
        // this.load.setPreloadSprite(this.preloadBar);

        // Dynamic Images
        
        //
        //this.load.atlasJSONArray('levelImages', 'images/level_images.png', 'images/level_images.json');
        this.load.atlasJSONArray('spritesheet', 'images/spritesheet.png', 'images/spritesheet.json');



        //load blocks + floor
        //this.load.image('floor','images/floor.png'); //1,0
        // this.load.image('block', 'images/block.png'); //0,0

        // //load Brainy and Brawny (player avatars)
        // // this.load.image('brainy', 'images/pBrainy.png'); //0,2
        // // this.load.image('brawny', 'images/pBrawny.png'); //0,3
        // this.load.image('brainy', 'images/pBrainy.png'); //0,2
        // this.load.image('brawny', 'images/pBrawny.png'); //0,3

        // //load goal images
        // this.load.image('goalBrainy','images/goalBrainy.png'); //1,2
        // this.load.image('goalBrawny','images/goalBrawny.png'); //1,3

        // //Switch Images
        // this.load.image('switch1On','images/switch1On.png'); //2,0
        // this.load.image('switch1Off','images/switch1Off.png'); //2,1
        // this.load.image('switch2On','images/switch2On.png'); //2,2
        // this.load.image('switch2Off','images/switch2Off.png'); //2,3
        // this.load.image('switch3On','images/switch3On.png'); //3,0
        // this.load.image('switch3Off','images/switch3Off.png'); //3,1
        // this.load.image('switch4On','images/switch4On.png'); //3,2
        // this.load.image('switch4Off','images/switch4Off.png'); //3,3

        // //gate images
        // this.load.image('gate0','images/gate0.png'); //0,1
        // this.load.image('gate1On','images/gate1On.png'); //4,0
        // this.load.image('gate1Off','images/gate1Off.png'); //4,1
        // this.load.image('gate2On','images/gate2On.png'); //4,2
        // this.load.image('gate2Off','images/gate2Off.png'); //4,3
        // this.load.image('gate3On','images/gate3On.png'); //5,0
        // this.load.image('gate3Off','images/gate3Off.png'); //5,1
        // this.load.image('gate4On','images/gate4On.png'); //5,2
        // this.load.image('gate4Off','images/gate4Off.png'); //5,3

        // //enemy image
        // this.load.image('enemy','images/octopus.png'); //2,2

        // Static Images

        //instruction slides
        this.load.image('slidesIntro1','images/screens_mobile-03.png');
        this.load.image('slidesIntro2','images/screens_mobile-04.png');
        this.load.image('slidesIntro3','images/screens_mobile-05.png');
        this.load.image('slidesIntro4','images/screens_mobile-06.png');

        this.load.image('slidesEnemy1','images/screens_mobile-09.png');
        this.load.image('slidesEnemy2','images/screens_mobile-10.png');

        this.load.image('slidesEdges1','images/screens_mobile-07.png');
        this.load.image('slidesEdges2','images/screens_mobile-08.png');


        this.load.image('slidesGates1','images/screens_mobile-11.png');
        this.load.image('slidesGates2','images/screens_mobile-12.png');

        this.load.image('slidesSwitches1','images/screens_mobile-13.png');
        this.load.image('slidesSwitches2','images/screens_mobile-14.png');

        this.load.image('missionFailScreen1','images/screens_mobile-15.png');
        this.load.image('missionFailScreen2','images/screens_mobile-17.png');
        this.load.image('missionSuccessScreen','images/screens_mobile-16.png');

        //HUD & Title && reset button
        // this.load.image('imageHUD','images/HUD-02.png');
        // this.load.spritesheet('rButton', 'images/HUD-04.png',60,60);
        this.load.image('imageTitle','images/screens_mobile-01.png');

        // Sound

        this.load.audio('thunk','sound/rs.mp3');
        this.load.audio('select','sound/select_2.wav');
        this.load.audio('switch','sound/switch_2.wav');
        this.load.audio('death','sound/death_2.wav');
        this.load.audio('finish','sound/finish_2.wav');
        this.load.audio('kill','sound/kill_2.wav');

        // Levels

        Settings.levels.forEach(function(element, index){
            this.load.text('level'+index, element);
        }, this)

    },
    create: function() {
        this.state.start('MainMenu');
    }
};