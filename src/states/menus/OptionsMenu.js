
OptionsMenu = function() {};
OptionsMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function(){
		//options title
		var myFont = { font: "80px Quicksand", fill: "#ffffff", align: "center"}
		var optionsTitle = BnBgame.add.text(this.world.centerX,this.world.centerY,'Options',myFont);
		optionsTitle.anchor = {x:0.5,y:0.5};

		//back arrow
		var back = BnBgame.add.image(10,10,'backArrow');
		back.scale.setTo(0.5);
		back.inputEnabled = true;
		back.events.onInputDown.add(this.onBack,this);
	},

	//handler for BACK button
	onBack: function(){
		this.state.start('MainMenu');
	},

};
