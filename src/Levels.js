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
		this.inputManager = new InputManager('waiting');
		this.tutorialFinished = false;

		if (typeof this.levelData.tutorial != 'undefined') {
			this.currentTutorial = 0;
			this.startTutorial();
		} else {
			this.tutorialFinished = true;
			this.inputManager.state = 'ready';
		}
	},
	update: function() {
		this.graphicsManager.refresh();
		if (this.inputManager.state != 'ready' && this.inputManager.state != 'waiting') {
			this.results = this.gameLogic.gravitySwitch(this.inputManager.state);
			this.graphicsManager.updateGraphics(this.results);
			this.inputManager.state = 'waiting';
		}
		if (this.graphicsManager.areAnimationsFinished() && this.inputManager.state === 'waiting' && this.tutorialFinished) {
			this.inputManager.state = 'ready';
			if (this.results.endState === 'brainyEaten' || this.results.endState === 'brainyLost' || this.results.endState === 'brawnyLost') {
				this.state.start('level'+(this.level));
			} else if (this.results.endState === 'missionSuccess') {
				if (this.level+1 === Settings.levels.length) {
					this.state.start('MainMenu');
				} else {
					this.state.start('level'+(this.level+1));
				}
			}
		}
	},
	startTutorial: function() {
		this.fadeOutGraphic = BnBgame.add.graphics(0, 0);
	   	this.fadeOutGraphic.beginFill(0x000000, 0.8);
	    this.fadeOutGraphic.drawRect(0, 0, Settings.GAME.WIDTH, Settings.GAME.HEIGHT);
	    this.fadeOutGraphic.endFill();
    
		this.tutorialImage = BnBgame.add.sprite(Settings.GAME.WIDTH / 2, Settings.GAME.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
		this.tutorialImage.anchor = {x: 0.5, y: 0.5};
		this.tutorialImage.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
		
		BnBgame.input.onTap.add(function() {
			this.currentTutorial += 1;
			this.tutorialImage.destroy();

			if (this.currentTutorial === this.levelData.tutorial.length) {
				this.fadeOutGraphic.visible = false;
				this.tutorialFinished = true;
				this.inputManager.state = 'ready';
			} else {
				this.tutorialImage = BnBgame.add.sprite(Settings.GAME.WIDTH / 2, Settings.GAME.HEIGHT / 2, this.levelData.tutorial[this.currentTutorial]);
				this.tutorialImage.anchor = {x: 0.5, y: 0.5};
				this.tutorialImage.scale.multiply(Settings.GAME.SCALE, Settings.GAME.SCALE);
			}

		}, this);
	}
};