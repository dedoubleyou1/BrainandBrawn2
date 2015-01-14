InputManager = function() {
		this.state = 'ready';

		this.cursors = BnBgame.input.keyboard.createCursorKeys();

		this.cursors.left.onDown.add(this.setDirection('left'), this);
		this.cursors.right.onDown.add(this.setDirection('right'), this);
		this.cursors.up.onDown.add(this.setDirection('up'), this);
		this.cursors.down.onDown.add(this.setDirection('down'), this);
}

InputManager.prototype.setDirection = function(direction){
	return function() {
		if (this.state === 'ready') {
			this.state = direction;
		}
	};
};