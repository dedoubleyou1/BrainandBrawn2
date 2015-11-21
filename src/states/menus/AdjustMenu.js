/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
              _                                 
  /\/\   __ _(_)_ __     /\/\   ___ _ __  _   _ 
 /    \ / _` | | '_ \   /    \ / _ \ '_ \| | | |
/ /\/\ \ (_| | | | | | / /\/\ \  __/ | | | |_| |
\/    \/\__,_|_|_| |_| \/    \/\___|_| |_|\__,_|

Summary: List of buttons to navigate to different states: PLAY, OPTIONS, ABOUT

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

AdjustMenu = function() {};
AdjustMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function()
	{
		var w = Settings.GAME.WIDTH;
		var h = Settings.GAME.HEIGHT;


		//dimensions text
		var myFont = { font: "80px Arial", fill: "#ffffff", align: "center"}
		this.widthText = BnBgame.add.text(w/2,200,Settings.BUILDER.GRID_X,myFont);
		this.widthText.anchor.setTo(0.5);
		this.heightText = BnBgame.add.text(w/2,615,Settings.BUILDER.GRID_Y,myFont);
		this.heightText.anchor.setTo(0.5);

		var left = BnBgame.add.image(w/2-150,200,'arrow');
		left.inputEnabled = true;
		left.anchor.setTo(0.5);
		left.events.onInputDown.add(this.onDownX,this);

		var right = BnBgame.add.image(w/2+150,200,'arrow');
		right.inputEnabled = true;
		right.events.onInputDown.add(this.onUpX,this);
		right.anchor.setTo(0.5);
		right.rotation = Math.PI;

		var up = BnBgame.add.image(w/2,480,'arrow');
		up.inputEnabled = true;
		up.events.onInputDown.add(this.onUpY,this);
		up.anchor.setTo(0.5);
		up.rotation = Math.PI/2;

		var down = BnBgame.add.image(w/2,750,'arrow');
		down.inputEnabled = true;
		down.events.onInputDown.add(this.onDownY,this);
		down.anchor.setTo(0.5);
		down.rotation = 3*Math.PI/2;

		//toggle off-screen death
		myFont = { font: "30px Arial", fill: "#ffffff", align: "center"}
		this.boundsText = BnBgame.add.text(300,0,"Boundary Death: " + Settings.GAME.BOUNDARY_DEATH,myFont);
		this.boundsText.inputEnabled = true;
		this.boundsText.events.onInputDown.add(this.toggleBounds,this);

		//back arrow
		var back = BnBgame.add.image(10,10,'backArrow');
		back.scale.setTo(0.5);
		back.inputEnabled = true;
		back.events.onInputDown.add(this.onBack,this);
	},

	onUpX: function()
	{
		if(Settings.BUILDER.GRID_X < 10){
			Settings.BUILDER.GRID_X++;
			this.widthText.text = Settings.BUILDER.GRID_X;
		}
	},

	onDownX: function()
	{
		if(Settings.BUILDER.GRID_X > 3){
			Settings.BUILDER.GRID_X--;
			this.widthText.text = Settings.BUILDER.GRID_X;
		}
	},

	onUpY: function()
	{
		if(Settings.BUILDER.GRID_Y < 16){
			Settings.BUILDER.GRID_Y++;
			this.heightText.text = Settings.BUILDER.GRID_Y;
		}
	},

	onDownY: function()
	{
		if(Settings.BUILDER.GRID_Y > 3){
			Settings.BUILDER.GRID_Y--;
			this.heightText.text = Settings.BUILDER.GRID_Y;
		}
	},

	toggleBounds: function()
	{
		Settings.GAME.BOUNDARY_DEATH = !Settings.GAME.BOUNDARY_DEATH;
		this.boundsText.text = "Boundary Death: " + Settings.GAME.BOUNDARY_DEATH;
	},


	//handler for BACK button
	onBack: function(){
		this.state.start('LevelBuilder');
	},
};
