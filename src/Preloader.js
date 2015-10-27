Preloader = function() {};

Preloader.prototype = {
    preload: function() {
 
        this.load.atlasJSONArray('spritesheet', 'images/spritesheet.png', 'images/spritesheet.json');


        // Static Images


        // New Tutorial images
        this.load.image('tutorial1','images/tutorials-01.png');
        this.load.image('tutorial2','images/tutorials-02.png');
        this.load.image('tutorial3','images/tutorials-03.png');
        this.load.image('tutorial4','images/tutorials-04.png');
        this.load.image('tutorial5','images/tutorials-05.png');
        this.load.image('tutorial6','images/tutorials-06.png');
        this.load.image('tutorial7','images/tutorials-07.png');
        this.load.image('tutorial8','images/tutorials-08.png');
        this.load.image('tutorial9','images/tutorials-09.png');


        //instruction slides
        // this.load.image('slidesIntro1','images/screens_mobile-03.png');
        // this.load.image('slidesIntro2','images/screens_mobile-04.png');
        // this.load.image('slidesIntro3','images/screens_mobile-05.png');
        // this.load.image('slidesIntro4','images/screens_mobile-06.png');

        // this.load.image('slidesEnemy1','images/screens_mobile-09.png');
        // this.load.image('slidesEnemy2','images/screens_mobile-10.png');

        // this.load.image('slidesEdges1','images/screens_mobile-07.png');
        // this.load.image('slidesEdges2','images/screens_mobile-08.png');


        // this.load.image('slidesGates1','images/screens_mobile-11.png');
        // this.load.image('slidesGates2','images/screens_mobile-12.png');

        // this.load.image('slidesSwitches1','images/screens_mobile-13.png');
        // this.load.image('slidesSwitches2','images/screens_mobile-14.png');

        // this.load.image('missionFailScreen1','images/screens_mobile-15.png');
        // this.load.image('missionFailScreen2','images/screens_mobile-17.png');
        // this.load.image('missionSuccessScreen','images/screens_mobile-16.png');

        //HUD & Title && reset button
        this.load.image('imageHUD','images/HUD-04.png'); //800x51
        // this.load.spritesheet('rButton', 'images/HUD-04.png',60,60);
        this.load.image('rButton', 'images/restart-button.png');
        this.load.image('pButton', 'images/play-button.png');
        this.load.image('mButton', 'images/menu-button-02.png');
        // this.load.image('imageTitle','images/titlescreen-01.png');
        this.load.image('imageTitle','images/titlescreen-03.png');

        this.load.image('star','images/star.png');
        this.load.image('star1','images/star1.png');
        this.load.image('star2','images/star2.png');
        this.load.image('star3','images/star3.png');

        // Sound

        this.load.audio('thunk','sound/rs.mp3');
        this.load.audio('select','sound/select_2.wav');
        this.load.audio('death','sound/death_2.wav');
        this.load.audio('finish','sound/finish_2.wav');
        this.load.audio('kill','sound/kill_2.wav');

        this.load.audio('switch','sound/switch_2.wav');

        // Levels

        Settings.levels.forEach(function(element, index){
            this.load.text('level'+index, element);
        }, this)

    },
    create: function() {
        this.state.start('MainMenu');
    }
};