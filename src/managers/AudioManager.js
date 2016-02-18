BnB.AudioManager = {
    soundAssets: {
        'select': 'sound/select_2.wav',

        'thunk': 'sound/rs.mp3',
        'death': 'sound/death_2.wav',
        'finish': 'sound/finish_2.wav',
        'kill': 'sound/kill_2.wav',
        'switch': 'sound/switch_2.wav',
    }, 

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

    //given a list of keys, add audio to game
    createAudioList: function(keyList)
    {
        for(var i=0;i<keyList.length;i++)
        {
            this.createAudio(keyList[i]);
        }
    },

    createAudio: function(key)
    {
        if(this.soundAssets.hasOwnProperty(key))
        {
            var snd = game.add.audio(key);
            this.soundBank[key] = snd;
            return true;
        }
        return false
    },

    //given a key, attempt to play a sound
    playSound: function(key)
    {
        if(this.soundBank.hasOwnProperty(key))
        {
            //play
            this.soundBank[key].play();
        }
        else
        {
            //oops! create and play
            if(this.createAudio(key))
            {
                this.playSoundDirect(key);
            }     
        }
    },

    playSoundDirect: function(key)
    {
        this.soundBank[key].play();
    }

};