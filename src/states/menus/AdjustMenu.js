/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
              _                                 
  /\/\   __ _(_)_ __     /\/\   ___ _ __  _   _ 
 /    \ / _` | | '_ \   /    \ / _ \ '_ \| | | |
/ /\/\ \ (_| | | | | | / /\/\ \  __/ | | | |_| |
\/    \/\__,_|_|_| |_| \/    \/\___|_| |_|\__,_|

Summary: List of buttons to navigate to different states: PLAY, OPTIONS, ABOUT

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.AdjustMenu = function() {};
BnB.AdjustMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function()
	{
		var w = C.WIDTH;
		var h = C.HEIGHT;


		//dimensions text
		var myFont = { font: "80px Quicksand", fill: "#ffffff", align: "center"}
		this.widthText = this.add.text(w/2,200,C.GRID_X,myFont);
		this.widthText.anchor.setTo(0.5);
		this.heightText = this.add.text(w/2,615,C.GRID_Y,myFont);
		this.heightText.anchor.setTo(0.5);

		var left = this.add.image(w/2-150,200,'arrow');
		left.inputEnabled = true;
		left.anchor.setTo(0.5);
		left.events.onInputDown.add(this.onDownX,this);

		var right = this.add.image(w/2+150,200,'arrow');
		right.inputEnabled = true;
		right.events.onInputDown.add(this.onUpX,this);
		right.anchor.setTo(0.5);
		right.rotation = Math.PI;

		var up = this.add.image(w/2,480,'arrow');
		up.inputEnabled = true;
		up.events.onInputDown.add(this.onUpY,this);
		up.anchor.setTo(0.5);
		up.rotation = Math.PI/2;

		var down = this.add.image(w/2,750,'arrow');
		down.inputEnabled = true;
		down.events.onInputDown.add(this.onDownY,this);
		down.anchor.setTo(0.5);
		down.rotation = 3*Math.PI/2;

		//toggle off-screen death
		myFont = { font: "30px Quicksand", fill: "#ffffff", align: "center"}
		this.boundsText = this.add.text(300,0,"Boundary Death: " + C.BOUNDARY_DEATH,myFont);
		this.boundsText.inputEnabled = true;
		this.boundsText.events.onInputDown.add(this.toggleBounds,this);

		//back arrow
		var back = this.add.image(10,10,'backArrow');
		back.scale.setTo(0.5);
		back.inputEnabled = true;
		back.events.onInputDown.add(this.onBack,this);
	},

	onUpX: function()
	{
		if(C.GRID_X < 10){
			C.GRID_X++;
			this.widthText.text = C.GRID_X;
		}
	},

	onDownX: function()
	{
		if(C.GRID_X > 3){
			C.GRID_X--;
			this.widthText.text = C.GRID_X;
		}
	},

	onUpY: function()
	{
		if(C.GRID_Y < 16){
			C.GRID_Y++;
			this.heightText.text = C.GRID_Y;
		}
	},

	onDownY: function()
	{
		if(C.GRID_Y > 3){
			C.GRID_Y--;
			this.heightText.text = C.GRID_Y;
		}
	},

	toggleBounds: function()
	{
		C.BOUNDARY_DEATH = !C.BOUNDARY_DEATH;
		this.boundsText.text = "Boundary Death: " + C.BOUNDARY_DEATH;
	},


	//handler for BACK button
	onBack: function(){
		this.state.start('LevelBuilder');
	},
};
