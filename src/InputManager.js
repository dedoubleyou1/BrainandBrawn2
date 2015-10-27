InputManager = function(initialState) {
	this.state = initialState;

	this.cursors = BnBgame.input.keyboard.createCursorKeys();

	this.cursors.left.onDown.add(this.setDirection('left'), this);
	this.cursors.right.onDown.add(this.setDirection('right'), this);
	this.cursors.up.onDown.add(this.setDirection('up'), this);
	this.cursors.down.onDown.add(this.setDirection('down'), this);

	this.startPoint = {}
	BnBgame.input.onDown.add(function(pointer) {
		if (this.state === 'ready') {
			this.startPoint.x = pointer.clientX;
			this.startPoint.y = pointer.clientY;
			this.state = 'swiping';
		}
	}, this);

	BnBgame.input.onUp.add(function(pointer) {
		if (this.state === 'swiping') {
			this._isSwipeGood(this.startPoint, {x: pointer.clientX, y: pointer.clientY});
		}
	}, this);
}

InputManager.prototype.setDirection = function(direction){
	return function() {
		if (this.state === 'swiping') {
			this.state = direction;
		}
	};
};

InputManager.prototype._isSwipeGood = function(startPosition, endPosition) {
	var differences = {
		x: endPosition.x - startPosition.x,
		y: endPosition.y - startPosition.y
	}
	if (Math.abs(differences.x) > 15 || Math.abs(differences.y) > 15) {
		if (differences.x < 0 && Math.abs(differences.x) > Math.abs(differences.y)) {
			this.setDirection('left').call(this);
		} else if (differences.x > 0 && Math.abs(differences.x) > Math.abs(differences.y)){
			this.setDirection('right').call(this);
		} else if (differences.y < 0 && Math.abs(differences.y) > Math.abs(differences.x)){
			this.setDirection('up').call(this);
		} else if (differences.y > 0 && Math.abs(differences.y) > Math.abs(differences.x)){
			this.setDirection('down').call(this);
		}
	}
}

InputManager.prototype.getSwipingOffset = function(){
	return {x: (BnBgame.input.activePointer.clientX - this.startPoint.x) / Settings.GAME.WIDTH,
	y: (BnBgame.input.activePointer.clientY - this.startPoint.y) / Settings.GAME.WIDTH};
};

