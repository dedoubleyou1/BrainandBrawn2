BnB.AudioManager = {
    allowMusic: true,
    allowSFX: true,

    currentMusic: 'gameplayMusic',//TEMP 

    soundAssets: {
        //music
        'gameplayMusic': 'sound/BrainBrawnTheme.mp3',
        'menuMusic': 'sound/MenuTheme.mp3',
        'star1': 'sound/Stage Clear 1 Star.mp3',
        'star2': 'sound/Stage Clear 2 Star.mp3',
        'star3': 'sound/Stage Clear 3 Star.mp3',
        'ambience1': 'sound/Space Ambience 1.ogg',
        'ambience2': 'sound/Space Ambience 2.ogg',

        //ui
        'select': 'sound/UI Tap.mp3',
        'next-slide': 'sound/UI Continue Tap.mp3',
        'menu-start': 'sound/Menu Start Chime.mp3',

        'teleportIn': 'sound/Teleport In (Short).mp3',
        'teleportOut': 'sound/Teleport Out (Short).mp3',
        'finish': 'sound/finish_2.wav',

        //impact
        'thunk': 'sound/Wall Hit (v2).mp3', //'thunk': 'sound/rs.mp3',
        'shatter': 'sound/Block Smash.mp3',

        //death sounds
        'brainySpace': 'sound/Brainy in Space.mp3',
        'brawnySpace': 'sound/Brawny in Space.mp3',
        'eaten': 'sound/AlienEatingv2.mp3',
        'spikey': 'sound/Metal Spike Wall Hit.mp3',

        //switch sounds
        'switch1': 'sound/SwitchHit1.mp3',
        'switch2': 'sound/SwitchHit2.mp3',
        'switch3': 'sound/SwitchHit3.mp3',
        'switch4': 'sound/SwitchHit4.mp3',

        'kill': 'sound/Alien Splatted.mp3',
    }, 

    //collection of ADDED audio (filled dynamically)
    soundBank: {},

    //pass in preloader state - preload sound assets
    preload: function(preloader)
    {
        for(var key in this.soundAssets)
        {
            if (this.soundAssets.hasOwnProperty(key)) 
            {
                preloader.load.audio(key,this.soundAssets[key]);
            }
        }
    },

    //Turn on/off all music
    toggleMusic: function()
    {
        this.allowMusic = !this.allowMusic;

        //TODO: pause/resume music
        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            if(this.allowMusic){
                this.soundBank[this.currentMusic].resume();
            }
            else{
                this.soundBank[this.currentMusic].pause();
            }
        }
    },

    toggleSFX: function()
    {
        this.allowSFX = !this.allowSFX;

        //TODO: stop sfx
    },

    //given a list of keys, add audio to game
    createAudioList: function(keyList)
    {
        for(var i=0;i<keyList.length;i++)
        {
            if(keyList[i] != this.currentMusic){
                this.createAudio(keyList[i]);
            }
        }
    },

    //add an audio track
    createAudio: function(key, isLooped)
    {
        if (typeof isLooped === 'undefined') {
            isLooped = false
        }
        if(this.soundAssets.hasOwnProperty(key))
        {
            var snd = game.add.audio(key, 1, isLooped);
            this.soundBank[key] = snd;
            return true;
        }
        return false
    },

    /*
        Crossfade from old to new music
    */
    switchToMusic: function(key,isLooped)
    {
        if(!this.allowMusic) return;

        //fade out current
        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            this.soundBank[this.currentMusic].fadeTo(BnB.DURATION_CROSS_FADE,0);
        }

        //fade in new
        this.currentMusic = key;
        this.playSound(key,isLooped);
        this.soundBank[this.currentMusic].volume = 0;
        this.soundBank[this.currentMusic].fadeTo(BnB.DURATION_CROSS_FADE,1);
    },

    /*
        Immediately play music track
    */
    playMusic: function(key,isLooped)
    {
        if(!this.allowMusic) return;

        //stop current
        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            this.soundBank[this.currentMusic].stop();
        }

        //fade in new
        this.currentMusic = key;
        this.playSound(key,isLooped);
    },

    //pause current background music
    pauseMusic: function()
    {
        if(!this.allowMusic) return;

        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            this.soundBank[this.currentMusic].pause();
        }
    },

    //resume current background music
    resumeMusic: function()
    {
        if(!this.allowMusic) return;

        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            this.soundBank[this.currentMusic].resume();
        }
    },

    //dim to target volume (used for settings + finish)
    fadeMusicTo: function(duration,target)
    {
        if(!this.allowMusic) return;
        if(this.soundBank.hasOwnProperty(this.currentMusic)){
            this.soundBank[this.currentMusic].fadeTo(duration,target);
        }
    },

    //helper function to quickly restore music to full volume
    restoreMusic: function(duration)
    {
        if(!this.allowMusic) return;
        if(typeof duration == 'undefined') duration = 500;//ms
        this.fadeMusicTo(duration,1);
    },

    //Given a key - stop target sound!
    stopSound: function(key)
    {
        if(this.soundBank.hasOwnProperty(key)){
            this.soundBank[key].stop();
        }
    },

    playSFX: function(key,isLooped)
    {
        if(!this.allowSFX) return;
        this.playSound(key,isLooped);
    },

    //INTERNAL - given a key, attempt to play a sound
    playSound: function(key, isLooped)
    {
        if(key == 'bothSpace'){
            //SPECIAL case
            this.playSound('brainySpace');
            this.playSound('brawnySpace');
        }
        else if(this.soundBank.hasOwnProperty(key))
        {
            //play
            this.soundBank[key].play();
        }
        else
        {
            //oops! create and play
            if(this.createAudio(key, isLooped))
            {
                this.playSoundDirect(key);
            }     
        }
    },

    //screw the rules - just play the sound!
    playSoundDirect: function(key)
    {
        this.soundBank[key].play();
    },

};