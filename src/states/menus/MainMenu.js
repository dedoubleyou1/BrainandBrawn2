/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
              _                                 
  /\/\   __ _(_)_ __     /\/\   ___ _ __  _   _ 
 /    \ / _` | | '_ \   /    \ / _ \ '_ \| | | |
/ /\/\ \ (_| | | | | | / /\/\ \  __/ | | | |_| |
\/    \/\__,_|_|_| |_| \/    \/\___|_| |_|\__,_|

Summary: List of buttons to navigate to different states: PLAY, OPTIONS, ABOUT

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.MainMenu = function() {};
BnB.MainMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function()
	{
		var myItems = ["Play","Options","Create Levels","About"];
		var myFont = { font: "50px Quicksand", fill: "#ffffff", align: "center"}
		var textGroup = BnB.Util.createMenu(myItems,myFont);

		//add handlers
		textGroup.getChildAt(0).events.onInputDown.add(this.onPlay,this);
		textGroup.getChildAt(1).events.onInputDown.add(this.onOptions,this);
		textGroup.getChildAt(2).events.onInputDown.add(this.onLevel,this);
		textGroup.getChildAt(3).events.onInputDown.add(this.onAbout,this);
	},


	/*
		Play button handler - start game!
	*/
	onPlay: function()
	{
		BnB.Util.playSound('select');
		this.state.start('LevelSelect',true,false,C.levels.length);
	},

	/*
		Options button handler - vew options
	*/
	onOptions: function()
	{
		this.state.start('OptionsMenu');
	},

	onLevel: function()
	{
		this.state.start('LevelBuilder')
	},

	/*
		About button handler - vew ABOUT page
	*/
	onAbout: function()
	{
		this.state.start('AboutMenu');
	},
};
