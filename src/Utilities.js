
// Returns first coordinate in a 2d array with a given value
var indexOf2d = function(array2d, value) {
	return array2d.reduce(function(previousValue, currentValue, index){
		var returnValue = currentValue.indexOf(value);
		if (returnValue != -1) {
			previousValue.y = index;
			previousValue.x = returnValue;
		}
		return previousValue;
	}, { //Passes in negative coordinates at initial previousValue
		x: -1,
		y: -1
	})
};

// Returns an array of all coordinates in a 2d array with a given value
var indexOfAll2d = function(array2d, value) {
	return array2d.reduce(function(previousValue, currentElement, index){
		var yIndex = index;
		currentElement.forEach(function(element, index){
			if (element === value) {
				previousValue.push({
					y: yIndex,
					x: index
				});
			}
		})
		return previousValue;
	}, []);
};

var directionLookup = {
  up: {
    x: 0,
    y: -1
  },
  down: {
    x: 0,
    y: 1
  },
  left: {
    x: -1,
    y: 0
  },
  right: {
    x: 1,
    y: 0
  }
};

var easingFunctions = {
	b: function ( t ) {
		var p = 0.8;
	    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
	},
	B: function ( t ) {
		var p = 0.9;
	    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
	}
}

var customBounceEasingb = function ( t ) {
	var p = 0.8;
    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
};

var customBounceEasingB = function ( t ) {
	var p = 0.9;
    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
};

var customBounceEasing2 = function ( t ) {
	var p = 3;
    return 1 - (Math.pow(1 - t, 4) * Math.sin((t + (1 / p)) *  Math.PI * (p / 2))) ;
};

var wiggle = function ( t ) {
	var p = 4;
	return 1 / (Math.pow(2 * p, Math.pow((t - 0.5) * p, 2))) + t;
}

var wiggle2 = function ( t ) {
	var p = 4;
	return 1 / (Math.pow(2 * p, Math.pow((t - 0.6) * p, 2))) +  Math.sin(Math.PI * t / 2);
}

var customSin = function ( ratio ){
	var yMult = Phaser.Easing.Sinusoidal.In(ratio);
	return function ( t ) {
		return Phaser.Easing.Sinusoidal.In(t * ratio) / yMult ;
	};
}

var pointDist = function(direction, pointA, pointB) {
	var axis;
	if (direction === 'up' || direction === 'down') {
		axis = 'y';
	} else if (direction === 'left' || direction === 'right') {
		axis = 'x'
	}
	return Math.abs(pointA[axis] - pointB[axis]);
}