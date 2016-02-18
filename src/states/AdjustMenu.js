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
		var w = BnB.C.WIDTH;
		var h = BnB.C.HEIGHT;


		//dimensions text
		var myFont = { font: "80px Quicksand", fill: "#ffffff", align: "center"}
		this.widthText = this.add.text(w/2,200,BnB.levelBuilderX,myFont);
		this.widthText.anchor.setTo(0.5);
		this.heightText = this.add.text(w/2,615,BnB.levelBuilderY,myFont);
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
		this.boundsText = this.add.text(300,0,"Boundary Death: " + BnB.C.BOUNDARY_DEATH,myFont);
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
		if(BnB.levelBuilderX < 10){
			BnB.levelBuilderX++;
			this.widthText.text = BnB.levelBuilderX;
		}
	},

	onDownX: function()
	{
		if(BnB.levelBuilderX > 3){
			BnB.levelBuilderX--;
			this.widthText.text = BnB.levelBuilderX;
		}
	},

	onUpY: function()
	{
		if(BnB.levelBuilderY < 16){
			BnB.levelBuilderY++;
			this.heightText.text = BnB.levelBuilderY;
		}
	},

	onDownY: function()
	{
		if(BnB.levelBuilderY > 3){
			BnB.levelBuilderY--;
			this.heightText.text = BnB.levelBuilderY;
		}
	},

	toggleBounds: function()
	{
		BnB.C.BOUNDARY_DEATH = !BnB.C.BOUNDARY_DEATH;
		this.boundsText.text = "Boundary Death: " + BnB.C.BOUNDARY_DEATH;
	},


	//handler for BACK button
	onBack: function(){
		this.state.start('LevelBuilder');
	},
};
