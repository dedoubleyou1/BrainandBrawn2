/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
              _                                 
  /\/\   __ _(_)_ __     /\/\   ___ _ __  _   _ 
 /    \ / _` | | '_ \   /    \ / _ \ '_ \| | | |
/ /\/\ \ (_| | | | | | / /\/\ \  __/ | | | |_| |
\/    \/\__,_|_|_| |_| \/    \/\___|_| |_|\__,_|

Summary: List of buttons to navigate to different states: PLAY, OPTIONS, ABOUT

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

MainMenu = function() {};
MainMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function(){
		var myItems = ["Play","Options","About"];
		var myFont = { font: "50px Arial", fill: "#ffffff", align: "center"}
		var textGroup = createMenu(myItems,myFont);

		//add handlers
		textGroup.getChildAt(0).events.onInputDown.add(this.onPlay,this);
		textGroup.getChildAt(1).events.onInputDown.add(this.onOptions,this);
		textGroup.getChildAt(2).events.onInputDown.add(this.onAbout,this);
	},


	/*
		Play button handler - start game!
	*/
	onPlay: function(){
		playSound('select');
		this.state.start('LevelSelect');
	},

	/*
		Options button handler - vew options
	*/
	onOptions: function(){
		console.log("enter Options");
	},

	/*
		About button handler - vew ABOUT page
	*/
	onAbout: function(){
		console.log("enter ABOUT");
	},
};
