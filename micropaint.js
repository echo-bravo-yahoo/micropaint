var isMouseDown = false;
var drawMode = 'TOGGLE';
var frameCounter = 1;

document.onmousedown = function() {
	isMouseDown = true;
}

document.onmouseup = function() {
	isMouseDown = false;
}

function homebrewTime(callback) {
	var startTime = performance.now();
	callback();
	var endTime = performance.now();
	//console.log('homebrew: '+String(endTime - startTime));
	return(endTime - startTime);
}

function loopTimer(loops, callback) {
	var time = homebrewTime(function() {
		for(var i = 0; i < loops; i++) {
			callback();
		}
	});
	console.log('total time: '+ String(time));
	console.log('per loop: '+String(time / loops));
}

function clearScreen() {
	for(var i =0; i < 3072; i++) {
		document.getElementById('pixel-'+i).classList.remove('on');
		document.getElementById('pixel-'+i).classList.add('off');
	}
	saveState();
}

function fillScreen() {
	for(var i =0; i < 3072; i++) {
		document.getElementById('pixel-'+i).classList.remove('off');
		document.getElementById('pixel-'+i).classList.add('on');
	}
	saveState();
}

function saveState() {
	localStorage.setItem('state', exportToHeader());
}

function loadState() {
	if(localStorage.getItem('state') !== null) {
		importFromHeader(localStorage.getItem('state'));	
	}
}

function setupButtons() {
	document.getElementById('drawModeButton').onclick = function() {
		if(drawMode === 'TOGGLE') {
			drawMode = 'POSITIVE';
			//this.value = 'Draw mode: \'Positive\'';
			document.getElementById('drawModeButton').innerHTML = 'Draw mode: Positive';
		} else if(drawMode === 'POSITIVE') {
			drawMode = 'NEGATIVE';
			//this.value = 'Draw mode: \'Negative\'';
			document.getElementById('drawModeButton').innerHTML = 'Draw mode: Negative';
		} else if(drawMode === 'NEGATIVE') {
			drawMode = 'TOGGLE';
			//this.value = 'Draw mode: \'Toggle\'';
			document.getElementById('drawModeButton').innerHTML = 'Draw mode: Toggle';
		}
	}
	document.getElementById('clearScreenButton').onclick = function() {
		if(confirm('Are you sure you want to clear the screen?')) {
			clearScreen();	
		}
	}
	document.getElementById('fillScreenButton').onclick = function() {
		if(confirm('Are you sure you want to fill the screen?')) {
			fillScreen();
		}
	}

	document.getElementById('addFrameButton').onclick = function() {
		//alert('Add frame button pressed!');
		//document.getElementById('addFrameButton').prepend()

		$('#addFrameButton').before('<div id=frame'+frameCounter+' class=\'frame\'></div>');
		generateScreen('frame'+frameCounter, false);
		frameCounter++;
	}

	$('#exportModal').on('shown.bs.modal', function () {
		$('#exportModalTextArea').val("char sprite[] = " + String(exportToHeader()));
		$('#exportModalTextArea').focus();
		$('#exportModalTextArea').select();
		$('#exportButton').blur()
	})
	$('#exportModal').on('hidden.bs.modal', function () {
		$('#exportButton').blur();
	});

	$('#openingTabGuard').on('focus', function () {
		$('#importButton').focus();
	});

	$('#closingTabGuard').on('focus', function () {
		$('#drawModeButton').focus();
	});

	$('#importModal').on('shown.bs.modal', function() {
		$('#importModalTextArea').focus();
	});

	$('#importModal').on('hide.bs.modal', function() {
		if($('#importModalTextArea').val().trim() !== '') {
			importFromHeader($('#importModalTextArea').val());
			saveState();
		}
	});

	$('#importModal').on('hidden.bs.modal', function() {
		$('#importModalTextArea').val('');
	});
}

//TO-DO: Make this function more efficient!
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

	// loop for each entry
	for (var tokenCounter = 0; tokenCounter < 384; tokenCounter++) {
		// NOTE: get rid of 384 / magic numbers
		var temp = ("00000000" + parseInt(tokenList[tokenCounter]).toString(2)).slice(-8);
		for (var bitCounter = 0; bitCounter < 8; bitCounter++) {
			if(parseInt(temp[7-bitCounter], 2) === 1) {
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.add('on');
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.remove('off');
			} else {
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.add('off');
				document.getElementById('pixel-'+String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071))).classList.remove('on');
			}
		}
	}
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
				//if(document.getElementById('pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).classList.contains('on')) {
				//	console.log('pixel '+String(rowOffset + byteCounter + (bitCounter<<6)));
				//}
				bitArray[bitCounter] = document.getElementById('pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).classList.contains('on') | 0;
			}
			result += '0x'+((bitArray[0] << 0) + (bitArray[1] << 1) + (bitArray[2] << 2) + (bitArray[3] << 3) + (bitArray[4] << 4) + (bitArray[5] << 5) + (bitArray[6] << 6) + (bitArray[7] << 7)).toString(16) + ', ';
		}
	}
	// console.timeEnd('header');
	return result.substring(0, result.length-2) + ' };';
}

function generateScreen(parentID, isMainScreen) {
	for(var rowCounter = 0; rowCounter < 48; rowCounter++) {
		for(var colCounter = 0; colCounter < 64; colCounter++) {
			var temp = document.createElement('div');
			temp.id = 'pixel-' + (rowCounter * 64 + colCounter);
			temp.className = 'pixel';
			temp.className += ' off';
			temp.className += ' unselectable';
			//if(colCounter === 0) {
			//	temp.className += ' firstPixel';
			//} else if(colCounter === 63) {
			//	temp.className += ' lastPixel';
			//}
			if(isMainScreen) {
				temp.onmousedown = function() {
					//console.log(this);
					// if the pixel is on and our drawmode is TOGGLE or NEGATIVE, then turn the pixel off
					if(this.classList.contains('on') && (drawMode === 'TOGGLE' || drawMode === 'NEGATIVE')) {
						this.classList.remove('on');
						this.classList.add('off');
						saveState();
					// if the pixel is on and our drawmode is POSITIVE, then do nothing
					} else if(this.classList.contains('on') && drawMode === 'POSITIVE') {
						//pass
					// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
					} else if(this.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
						this.classList.remove('off');
						this.classList.add('on');
						saveState();
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
							saveState();
						// if the pixel is on and our drawmode is POSITIVE, then do nothing
						} else if(this.classList.contains('on') && drawMode === 'POSITIVE') {
							//pass
						// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
						} else if(this.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
							this.classList.remove('off');
							this.classList.add('on');
							saveState();
						// if the pixel is on and our drawmode is POSITIVE, then do nothing
						} else if(this.classList.contains('off') && drawMode === 'NEGATIVE') {
							//pass
						}
						//console.log(this.id.split('-').pop());
					}
				}
			}
			var pixelParent = document.getElementById(parentID.toString());
			pixelParent.appendChild(temp);
		}
	}
}

generateScreen('pixelParent', true);
generateScreen('frame0', false);
setupButtons();
loadState();