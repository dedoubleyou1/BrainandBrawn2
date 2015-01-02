
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
// var indexOfAll2d = function(array2d, value) {
// 	return array2d
// 	.map(function(currentValue, index){
// 		var testValue = currentValue.indexOf(value);
// 		if (testValue != -1) {
// 			console.log('found',index, testValue);
// 			return {

// 			};
// 		}
// 	})
// 	.filter(function(element) {
// 		if (typeof element === 'undefined') {
// 			return false;
// 		} else {
// 			return true;
// 		}
// 	});
// }

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