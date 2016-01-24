/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Location (temporary) to hold save data
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BrainAndBrawn.SaveData = {
	workingLevel: {},

	levelStatus: [],//-1=locked, 0=unlocked, 1-3=star completion
	
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