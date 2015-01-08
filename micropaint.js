var isMouseDown = false;
var drawMode = 'TOGGLE';

document.body.onmousedown = function() {
	isMouseDown = true;
}

document.body.onmouseup = function() {
	isMouseDown = false;
	document.body.style.cursor = 'crosshair';
}

function homebrewTime(callback) {
	var startTime = performance.now();
	callback();
	var endTime = performance.now();
	//console.log('homebrew: '+String(endTime - startTime));
	return(endTime - startTime);
}

function exportDriver(loops) {
	var time = homebrewTime(function() {
		for(var i = 0; i < loops; i++) {
			exportToHeader();
		}
	});
	console.log('total time: '+ String(time));
	console.log('per loop: '+String(time / loops));
}

function importFromHeader(header) {
	var tokenList;
	// trim char * declaration
	if (header.indexOf('=') !== -1) {
		header = header.split('=').pop();
		header = header.trim();
	}
	// trim opening brace
	// NOTE: This obsoletes the trimming above it in all cases?
	if (header.indexOf('{') !== -1) {
		header = header.split('{').pop();
		header = header.trim();
	}
	// trim closing brace and potential semi-colon
	if (header.indexOf('}') !== -1) {
		header = header.split('{')[0];
		header = header.trim();
	}
	if (header.indexOf(';') !== -1) {
		header = header.split(';')[0];
		header = header.trim();
	}
	// split on commas
	tokenList = header.split(',');

	// clear each pixel on screen
	// loop for each entry
	for (var tokenCounter = 0; tokenCounter < 384; tokenCounter++) {
		//var bitArray = [];
		// input in the form 0x4 or 0xff
		// NOTE: get rid of 384 / magic numbers
		// trim each tokenized entry
		//("00" + tokenList[tokenCounter].trim().split('0x').pop()).slice(-2)
		var temp = parseInt(tokenList[tokenCounter]).toString(2);
		console.log(tokenList);
		for (var bitCounter = 0; bitCounter < 8; bitCounter++) {
			//bitArray[]
			if(parseInt(temp[bitCounter], 2) === 1) {
				try {
					document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.add('on');
					document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.remove('off');
				} catch(err) {
					console.log(tokenCounter+' '+bitCounter+' '+String(tokenCounter*8+bitCounter*64));
					throw(err);
				}
			} else {
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.add('off');
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.remove('on');
			}
		}
		// parse to integer from hex
		// process tokenList[tokenCounter]
	}
	// setting the right pixels high
}

function exportToHeader() {
	// console.time('header');
	var result = '{ ';
	var rowSize = 1;
	var columnSize = 48;
	// console.log(document.querySelectorAll('.pixel'));
	for(var rowCounter = 0; rowCounter < 6; rowCounter++) {
		for(var byteCounter = 0; byteCounter < 64; byteCounter++) {
			//var bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7;
			var bitArray = [];
			var rowOffset = (rowCounter << 9);
			for(var bitCounter = 0; bitCounter < 8; bitCounter++) {
				if(document.getElementById('pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).classList.contains('on')) {
					console.log('pixel '+String(rowOffset + byteCounter + (bitCounter<<6)));
				}
				bitArray[bitCounter] = document.getElementById('pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).classList.contains('on') | 0;
			}
			result += '0x'+((bitArray[0] << 0) + (bitArray[1] << 1) + (bitArray[2] << 2) + (bitArray[3] << 3) + (bitArray[4] << 4) + (bitArray[5] << 5) + (bitArray[6] << 6) + (bitArray[7] << 7)).toString(16) + ', ';
		}
	}
	// console.timeEnd('header');
	return result.substring(0, result.length-2) + ' };';
}

for(var rowCounter = 0; rowCounter < 48; rowCounter++) {
	for(var colCounter = 0; colCounter < 64; colCounter++) {
		var temp = document.createElement('div');
		temp.id = 'pixel-' + (rowCounter * 64 + colCounter);
		temp.className = 'pixel';
		temp.className += ' off';
		temp.className += ' unselectable';
		if(colCounter === 0) {
			temp.className += ' firstPixel';
		} else if(colCounter === 63) {
			temp.className += ' lastPixel';
		}
		temp.onmousedown = function() {
			//console.log(this);
			// if the pixel is on and our drawmode is TOGGLE or NEGATIVE, then turn the pixel off
			if(this.classList.contains('on') && (drawMode === 'TOGGLE' || drawMode === 'NEGATIVE')) {
				this.classList.remove('on');
				this.classList.add('off');
			// if the pixel is on and our drawmode is POSITIVE, then do nothing
			} else if(this.classList.contains('on') && drawMode === 'POSITIVE') {
				//pass
			// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
			} else if(this.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
				this.classList.remove('off');
				this.classList.add('on');
			// if the pixel is on and our drawmode is POSITIVE, then do nothing
			} else if(this.classList.contains('off') && drawMode === 'NEGATIVE') {
				//pass
			}
			//console.log(this.id.split('-').pop());
		};
		temp.onmouseover = function() {
			if(isMouseDown) {
				//console.log(this);
				// if the pixel is on and our drawmode is TOGGLE or NEGATIVE, then turn the pixel off
				if(this.classList.contains('on') && (drawMode === 'TOGGLE' || drawMode === 'NEGATIVE')) {
					this.classList.remove('on');
					this.classList.add('off');
				// if the pixel is on and our drawmode is POSITIVE, then do nothing
				} else if(this.classList.contains('on') && drawMode === 'POSITIVE') {
					//pass
				// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
				} else if(this.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
					this.classList.remove('off');
					this.classList.add('on');
				// if the pixel is on and our drawmode is POSITIVE, then do nothing
				} else if(this.classList.contains('off') && drawMode === 'NEGATIVE') {
					//pass
				}
				//console.log(this.id.split('-').pop());
			}
		}
		var parent = document.getElementById('parent');
		parent.appendChild(temp);
	}
}