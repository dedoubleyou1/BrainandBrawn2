Level = function(level) {
	this.level = level;
};

Level.prototype = {
	create: function() {
		this.levelData = JSON.parse(BnBgame.cache.getText('level'+this.level));
		this.width = this.levelData.width;
		this.height = this.levelData.length;
		this.gameLogic = new GameLogic(this.levelData);
		this.cursors = BnBgame.input.keyboard.createCursorKeys();
	},
	update: function() {
		this.cursors.left.onDown.add(this.inputLeft, this);
		this.cursors.right.onDown.add(this.inputRight, this);
		this.cursors.up.onDown.add(this.inputUp, this);
		this.cursors.down.onDown.add(this.inputDown, this);

	}
};

Level.prototype.inputLeft = function() {
	this.inputManager('left');
}
Level.prototype.inputRight = function() {
	this.inputManager('right');
}
Level.prototype.inputUp = function() {
	this.inputManager('up');
}
Level.prototype.inputDown = function() {
	this.inputManager('down');
}

Level.prototype.inputManager = function(direction){
	var results = this.gameLogic.gravitySwitch(direction);
	if (results.endState === 'brainyEaten' || results.endState === 'brainyLost' || results.endState === 'brawnyLost') {
		this.state.start('level'+(this.level));
	} else if (results.endState === 'missionSuccess') {
		this.state.start('level'+(this.level+1));
	}

}