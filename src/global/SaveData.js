/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Location (temporary) to hold save data
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.SaveData = {
	//Temp holder of BUILDER level
    workingLevel: {},

	levelStatus: [],//-1=locked, 0=unlocked, 1-3=star completion

    init: function()
    {
        if(!this.loadGame()){
            //Add each level as a separate state
            //-1=locked, 0=unlocked, 1-3=star completion
            for (var i = 0; i < BnB.levels.length; i++) {
              this.levelStatus.push(-1);
            };
            this.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)
        } 
    },

    //get # levels in level status array
    getNumLevels: function()
    {
        return this.levelStatus.length;
    },

    //get star count for a specific level index
    getStars: function(levelNum)
    {
        if(levelNum >=0 && levelNum<this.levelStatus.length){
            return this.levelStatus[levelNum];
        }
        return -1;
    },

    //set star count for a specific level index
    setStars: function(levelNum,starCount)
    {
        if(levelNum >=0 && levelNum<this.levelStatus.length){
            this.levelStatus[levelNum] = starCount;
            this.saveGame();
        }
    },
	
	//unlock all levels
	unlockAll: function()
	{
		for(var i=0;i<this.levelStatus.length;i++)
		{
			if(this.levelStatus[i] == -1)
			{
				this.levelStatus[i] = 0;
			}
		}
        this.saveGame();
	},

	//reset leveling progress
	reset: function()
	{
        this.levelStatus = [];
        for (var i = 0; i < BnB.levels.length; i++) {
            this.levelStatus.push(-1);
        };
        this.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)
        this.saveGame();
	},

    loadGame: function()
    {
        var data = localStorage.getItem('BnBLevelData');

        if(data != null){
            this.levelStatus = JSON.parse(data);
            return true;
        }

        return false;
    },

    saveGame: function()
    {
        localStorage.setItem('BnBLevelData',JSON.stringify(this.levelStatus))
    },
};