/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Location (temporary) to hold save data
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.SaveData = {
	workingLevel: {},

	levelStatus: [],//-1=locked, 0=unlocked, 1-3=star completion

    init: function()
    {
        //Add each level as a separate state
        this.levelStatus = []; //-1=locked, 0=unlocked, 1-3=star completion
        for (var i = 0; i < BnB.levels.length; i++) {
          this.levelStatus.push(-1);
        };
        this.levelStatus[0] = 0; //unlock first level with 0 stars (incomplete)
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
	},

	//reset leveling progress
	reset: function()
	{
		for(var i=0;i<this.levelStatus.length;i++)
		{
			this.levelStatus[i] = -1;
		}
		this.levelStatus[0] = 0; //unlock first level
	},
};