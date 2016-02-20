BnB.AudioManager = {
    allowMusic: true,
    allowSFX: true,

    currentMusic: 'gameplayMusic',//TEMP 

    soundAssets: {
        //music
        'gameplayMusic': 'sound/BrainBrawnTheme.mp3',
        'menuMusic': 'sound/MenuTheme.mp3',

        // 'select': 'sound/SwitchHit4.mp3',
        'finish': 'sound/finish_2.wav',
        'thunk': 'sound/rs.mp3', //'sound/Wall Hit 3.mp3',
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
            this.createAudio(keyList[i]);
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

    playMusic: function(key,isLooped)
    {
        if(!this.allowMusic) return;
        this.stopSound(this.currentMusic);
        this.currentMusic = key;
        this.playSound(key,isLooped);
    },

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