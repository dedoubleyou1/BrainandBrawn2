/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Location (temporary) to hold save data
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.SaveData = {
	//Temp holder of BUILDER level
    workingLevel: {},

	levelStatus: {},//-1=locked, 0=unlocked, 1-3=star completion

    init: function()
    {
        if(!this.loadGame()){
            this.reset();
        } 
    },

    //get # levels in level status array
    getNumLevels: function()
    {
        //Does not account for older level keys in this.levelStatus
        return BnB.levels.length;
    },

    //get star count for a specific level index
    getStars: function(levelNum)
    {
        if(levelNum >=0 && levelNum<BnB.levels.length){
            var key = BnB.levels[levelNum];
            if(!this.levelStatus.hasOwnProperty(key)) return -1;
            return this.levelStatus[key];
        }
        return -1;
    },

    //set star count for a specific level index
    setStars: function(levelNum,starCount)
    {
        if(levelNum >=0 && levelNum<BnB.levels.length){
            //get/check key
            var key = BnB.levels[levelNum];
            if(!this.levelStatus.hasOwnProperty(key)) return;

            //set star count and save
            this.levelStatus[key] = starCount;
            this.saveGame();
        }
    },
	
	//unlock all levels
	unlockAll: function()
	{
        for(var key in this.levelStatus)
        {
            if(this.levelStatus.hasOwnProperty(key) && this.levelStatus[prop] == -1)
            {
                this.levelStatus[key] = 0;
            }
        }
        this.saveGame();
	},

	//Use BnB.levels to initialize this.levelStatus
	reset: function()
	{
        //-1=locked, 0=unlocked, 1-3=star completion
        this.levelStatus = {};
        for (var i = 0; i < BnB.levels.length; i++) {
            var key = BnB.levels[i];

            if(i == 0){
                this.levelStatus[key] = 0;
            }
            else{
                this.levelStatus[key] = -1;
            }
        };
        this.saveGame();
	},

    /*
        Used to deal with level reordering. Unlocks all levels up to the last level with saved data.
        Called by loadGame.
    */
    unlockMiddles: function()
    {
        //1. Get the last unlocked level
        var target = 0;
        for(var i=BnB.levels.length-1;i>=0;i--){
            var key = BnB.levels[i];

            //Check to see if this level has a star count
            if(this.levelStatus.hasOwnProperty(key) && this.levelStatus[key] > 0){
                target = i+1;
                break;
            }
        }

        //2. Unlock all unplayed levels between 0 and target
        for(var i=0;i<BnB.levels.length;i++){
            var key = BnB.levels[i];
            
            if(!this.levelStatus.hasOwnProperty(key) || this.levelStatus[key] < 1){
                if(i <= target){
                    this.levelStatus[key] = 0;
                }
                else{
                    this.levelStatus[key] = -1;
                }
            }
        }
    },

    //Load save data from local storage
    loadGame: function()
    {
        var data = localStorage.getItem('BnBLevelData-v1.7.0');

        if(data != null){
            this.levelStatus = JSON.parse(data);
            this.unlockMiddles();
            return true;
        }

        return false;
    },

    //save game to local storage
    saveGame: function()
    {
        localStorage.setItem('BnBLevelData-v1.7.0',JSON.stringify(this.levelStatus))
    },
};