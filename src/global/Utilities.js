/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
       _   _ _ _ _   _           
 /\ /\| |_(_) (_) |_(_) ___  ___ 
/ / \ \ __| | | | __| |/ _ \/ __|
\ \_/ / |_| | | | |_| |  __/\__ \
 \___/ \__|_|_|_|\__|_|\___||___/
                                 
Summary: Static utility functions for game-wide use

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

BnB.Util = {
    //
    goToLevel: function(id)
    {
        game.state.start('Level',true,false,id);
    },

    goToCustomLevel: function(id,saveData)
    {
        game.state.start('Level',true,false,id,saveData);
    },

    //Given a file, play audio
    playSound: function(snd)
    {
        var sound = game.add.audio(snd);
        sound.play();
    },

    //adds state based on uploaded file
    handleFiles: function(files)
    {   
        var reader = new FileReader();
        reader.onload = BnB.Util.onReaderLoad;
        reader.readAsText(files[0]);

        // //assumes a JSON
        // var data = files[0];//JSON.parse(files[0]);
        // data.saved = true;
        // BnB.SaveData.workingLevel = data;
    },

    onReaderLoad: function(event){
        BnB.SaveData.workingLevel = JSON.parse(event.target.result);

        BnB.levelBuilderX = BnB.SaveData.workingLevel.width;
        BnB.levelBuilderY = BnB.SaveData.workingLevel.height;
        BnB.SaveData.workingLevel.saved = true;
        game.state.start('LevelBuilder');
    },


    //Creates a very simple menu of text items
    createMenu: function(items,myFont)
    {
        var textGroup = game.add.group();

        //create text objects
        var menuX = game.world.centerX;
        for(var i=0;i<items.length;i++){
            textGroup.add(game.add.text(menuX,0,items[i],myFont));  
        }

        //place text
        var menuY = game.world.centerY -textGroup.length*textGroup.getChildAt(0).height/2;
        for (var i = 0; i < textGroup.length; i++)
        {
            var textItem = textGroup.getChildAt(i);
            textItem.anchor = {x: 0.5, y: 0.5};
            textItem.y = menuY + i*textItem.height;
            textItem.inputEnabled = true;
            textItem.font = 'Quicksand';
        }

        return textGroup;
    },

    // Returns first coordinate in a 2d array with a given value
    indexOf2d: function(array2d, value) {
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
    },

    // Returns an array of all coordinates in a 2d array with a given value
    indexOfAll2d: function(array2d, value) {
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
    },

    // Returns an array of all objects in a 2d array for which a given function returns as true
    filter2d: function(array2d, passedFunction, that) {
        var newArray = [];
        for (var i = 0; i < array2d.length; i++) {
            for (var j = 0; j < array2d[i].length; j++) {
                if (passedFunction.call(that, array2d[i][j])) {
                    newArray.push(array2d[i][j]);
                }
            }       
        }
        return newArray;
    },

    //XY product values for different directions
    directionLookup: {
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
    },

    /*
        Given a 2D vector, get the cardinal direction
    */
    getDirection: function(vector) {
        if (vector.x < 0 && Math.abs(vector.x) >= Math.abs(vector.y)) {
            return 'left';
        } else if (vector.x >= 0 && Math.abs(vector.x) >= Math.abs(vector.y)){
            return 'right';
        } else if (vector.y <= 0 && Math.abs(vector.y) >= Math.abs(vector.x)){
            return 'up';
        } else if (vector.y > 0 && Math.abs(vector.y) >= Math.abs(vector.x)){
            return 'down';
        }
    },

    pointDist: function(direction, pointA, pointB) {
        var axis;
        if (direction === 'up' || direction === 'down') {
            axis = 'y';
        } else if (direction === 'left' || direction === 'right') {
            axis = 'x'
        }
        return Math.abs(pointA[axis] - pointB[axis]);
    },
}

// var easingFunctions = {
// 	b: function ( t ) {
// 		var p = 0.8;
// 	    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
// 	},
// 	B: function ( t ) {
// 		var p = 0.9;
// 	    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
// 	}
// }

// var customBounceEasingb: function ( t ) {
// 	var p = 0.8;
//     return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
// };

// var customBounceEasingB: function ( t ) {
// 	var p = 0.9;
//     return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
// };

// var customBounceEasing2: function ( t ) {
// 	var p = 3;
//     return 1 - (Math.pow(1 - t, 4) * Math.sin((t + (1 / p)) *  Math.PI * (p / 2))) ;
// };

// var wiggle: function ( t ) {
// 	var p = 4;
// 	return 1 / (Math.pow(2 * p, Math.pow((t - 0.5) * p, 2))) + t;
// }

// var wiggle2: function ( t ) {
// 	var p = 4;
// 	return 1 / (Math.pow(2 * p, Math.pow((t - 0.6) * p, 2))) +  Math.sin(Math.PI * t / 2);
// }

// var customSin: function ( ratio ){
// 	var yMult = Phaser.Easing.Sinusoidal.In(ratio);
// 	return function ( t ) {
// 		return Phaser.Easing.Sinusoidal.In(t * ratio) / yMult ;
// 	};
// }