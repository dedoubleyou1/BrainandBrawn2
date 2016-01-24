
BnB.AboutMenu = function() {};
BnB.AboutMenu.prototype = {

	/*
		Create text buttons
	*/
	create: function(){
		var myItems = ["Created by:","Rohit Crasta","David Wallin"];
		var myFont = { font: "50px Quicksand", fill: "#ffffff", align: "center"};
		var textGroup = BnB.Util.createMenu(myItems,myFont);

		//back arrow
		var back = game.add.image(10,10,'backArrow');
		back.scale.setTo(0.5);
		back.inputEnabled = true;
		back.events.onInputDown.add(this.onBack,this);
	},

	//handler for BACK button
	onBack: function(){
		this.state.start('MainMenu');
	},
};
