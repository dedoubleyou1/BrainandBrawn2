Level = function(level) {
	this.level = level;
};

Level.prototype = {
	create: function() {
		this.levelData = JSON.parse(BnBgame.cache.getText('level'+this.level));
		this.width = this.levelData.width;
		this.height = this.levelData.length;
		this.gameLogic = new GameLogic(this.levelData);
		this.graphicsManager = new GraphicsManager(this.levelData);
		this.inputManager = new InputManager();
	},
	update: function() {
		if (this.inputManager.state != 'ready' && this.inputManager.state != 'waiting') {
			this.results = this.gameLogic.gravitySwitch(this.inputManager.state);
			this.graphicsManager.updateGraphics(this.results);
			this.inputManager.state = 'waiting';
		}
		if (this.graphicsManager.areAnimationsFinished() && this.inputManager.state === 'waiting') {
			this.inputManager.state = 'ready';
			if (this.results.endState === 'brainyEaten' || this.results.endState === 'brainyLost' || this.results.endState === 'brawnyLost') {
				this.state.start('level'+(this.level));
			} else if (this.results.endState === 'missionSuccess') {
				this.state.start('level'+(this.level+1));
			}
		}
	}
};