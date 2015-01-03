
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