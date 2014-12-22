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

}