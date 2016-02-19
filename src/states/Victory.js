/*
    Summary: This state is initiated when the player has completed all the levels in the game. TAP to 
*/
BnB.Victory = function() {};
BnB.Victory.prototype = {

	/*
		Create text buttons
	*/
	create: function()
	{
        //Victory image
        var background = this.add.sprite(BnB.C.WIDTH/2, BnB.C.HEIGHT/2, 'victory');
        background.anchor = {x: 0.5, y: 0.5};
        background.scale.multiply(BnB.C.WIDTH/background.width,BnB.C.HEIGHT/background.height)

        //add input to start the game
        this.input.onTap.add(this.onReturn, this);
	},

    onReturn: function()
    {
        this.state.start('LevelSelect',true,false,0);
    },
};
