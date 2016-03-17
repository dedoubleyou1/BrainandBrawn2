/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  _____                   _                                              
  \_   \_ __  _ __  _   _| |_    /\/\   __ _ _ __   __ _  __ _  ___ _ __ 
   / /\/ '_ \| '_ \| | | | __|  /    \ / _` | '_ \ / _` |/ _` |/ _ \ '__|
/\/ /_ | | | | |_) | |_| | |_  / /\/\ \ (_| | | | | (_| | (_| |  __/ |   
\____/ |_| |_| .__/ \__,_|\__| \/    \/\__,_|_| |_|\__,_|\__, |\___|_|   
             |_|                                         |___/           

Summary: Handles player input (via touch, mouse, and keyboard)

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

/*
	Constructor for initializing Input Manager - cursor & touch input
*/
BnB.InputManager = function(initialState) {
	this.state = initialState;
	this.direction = 'none';

	this.cursors = game.input.keyboard.createCursorKeys();

	this.cursors.left.onDown.add(this.setDirection('left'), this);
	this.cursors.right.onDown.add(this.setDirection('right'), this);
	this.cursors.up.onDown.add(this.setDirection('up'), this);
	this.cursors.down.onDown.add(this.setDirection('down'), this);

	this.startPoint = {}
	game.input.onDown.add(function(pointer) {
		if(this.state === 'ready'){
			this.startPoint.x = pointer.clientX;
			this.startPoint.y = pointer.clientY;
			if(BnB.C.SWIPING_OFFSET || BnB.C.SWIPING_LEANING){
				this.state = 'swiping';
			}
		}
	}, this);

	game.input.onUp.add(function(pointer) {
        if(this.state === 'swiping'){
            this._isSwipeGood(this.startPoint, {x: pointer.clientX, y: pointer.clientY});
        }
	}, this);
};

BnB.InputManager.prototype = {
    /*
        Set input state to a chosen direction
    */
    setDirection: function(direction){
        return function() {
            if(this.state == 'ready' || this.state == 'swiping'){
                this.direction = direction;
                this.state = 'moving';
            }
        };
    },

    /*
        Checks to see if touch movement counts as a valid cardinal swipe (called by onUp)
    */
    _isSwipeGood: function(startPosition, endPosition) {
        //set touch vector (endPos-startPos)
        var differences = {
            x: endPosition.x - startPosition.x,
            y: endPosition.y - startPosition.y
        }

        //If the swipe distance is great enough - set the movement direction
        if (Math.abs(differences.x) > 15 || Math.abs(differences.y) > 15) {
            if (differences.x < 0 && Math.abs(differences.x) > Math.abs(differences.y)) {
                this.setDirection('left').call(this);
                return true;
            } else if (differences.x > 0 && Math.abs(differences.x) > Math.abs(differences.y)){
                this.setDirection('right').call(this);
                return true;
            } else if (differences.y < 0 && Math.abs(differences.y) > Math.abs(differences.x)){
                this.setDirection('up').call(this);
                return true;
            } else if (differences.y > 0 && Math.abs(differences.y) > Math.abs(differences.x)){
                this.setDirection('down').call(this);
                return true;
            } else {
                this.onUpCallback();
            }
        }

        //swipe not good - set state back to 'ready'
        this.state = 'ready';
        return false; 
    },

    /*
        get the "swiping offset" vector
        (how far the player's finger has been dragged from its starting point)
    */
    getSwipingOffset: function(){
        return {x: (game.input.activePointer.clientX - this.startPoint.x) / BnB.C.WIDTH,
        y: (game.input.activePointer.clientY - this.startPoint.y) / BnB.C.WIDTH};
    },
    onUpCallback: function(){

    },
}