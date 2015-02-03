var isMouseDown = false;
var drawMode = 'TOGGLE';
var frameCounter = 0;
var activeFrame = 0;
var frameList = [];

document.onmousedown = function() {
	isMouseDown = true;
}

document.onmouseup = function() {
	isMouseDown = false;
}

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

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
		$('#pixel-'+i).removeClass('on');
		$('#pixel-'+i).addClass('off');
	}
	saveState(true);
}

function fillScreen() {
	for(var i =0; i < 3072; i++) {
		$('#pixel-'+i).removeClass('off');
		$('#pixel-'+i).addClass('on');
	}
	saveState(true);
}

function saveState() {
	console.log('saved');
	localStorage.setItem('state', exportToHeader());
}

var saveStateDebounced = debounce(saveState, 1000);

function loadState() {
	if(localStorage.getItem('state') !== null) {
		importFromHeader(localStorage.getItem('state'));	
	}
}

function setupButtons() {
	$('#drawModeButton').click(function() {
		if(drawMode === 'TOGGLE') {
			drawMode = 'POSITIVE';
			//this.value = 'Draw mode: \'Positive\'';
			$('#drawModeButton').html('Draw mode: Positive');
		} else if(drawMode === 'POSITIVE') {
			drawMode = 'NEGATIVE';
			//this.value = 'Draw mode: \'Negative\'';
			$('#drawModeButton').html('Draw mode: Negative');
		} else if(drawMode === 'NEGATIVE') {
			drawMode = 'TOGGLE';
			//this.value = 'Draw mode: \'Toggle\'';
			$('#drawModeButton').html('Draw mode: Toggle');
		}
	});

	$('#clearScreenButton').click(function() {
		if(confirm('Are you sure you want to clear the screen?')) {
			clearScreen();	
		}
	});

	$('#fillScreenButton').click(function() {
		if(confirm('Are you sure you want to fill the screen?')) {
			fillScreen();
		}
	});

	$('#addFrameButton').click(function() {
		frameCounter++;
		$('#addFrameButton').before('<div id=frame-'+frameCounter+' class=\'frame\'></div>');
		generateScreen('frame-'+frameCounter, false);
	});

	$('#exportModal').on('shown.bs.modal', function () {
		$('#exportModalTextArea').val("char sprite[] = " + String(exportToHeader()));
		$('#exportModalTextArea').focus();
		$('#exportModalTextArea').select();
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
			saveState(false);
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
			var id = String(Math.min(tokenCounter%64 + bitCounter*64 + Math.floor(tokenCounter/64)*8*64, 3071));
			var pixel = $('#pixel-'+id)
			var littlePixel = $('#frame-'+activeFrame+'-little-pixel-'+id);
			if(parseInt(temp[7-bitCounter], 2) === 1) {
				pixel.addClass('on');
				pixel.removeClass('off');
				littlePixel.addClass('on');
				littlePixel.removeClass('off');
			} else {
				pixel.addClass('off');
				pixel.removeClass('on');
				littlePixel.addClass('off');
				littlePixel.removeClass('on');
			}
		}
	}
}

function exportToHeader() {
	// console.time('header');
	var result = '{ ';
	var rowSize = 1;
	var columnSize = 48;
	for(var rowCounter = 0; rowCounter < 6; rowCounter++) {
		for(var byteCounter = 0; byteCounter < 64; byteCounter++) {
			//var bit0, bit1, bit2, bit3, bit4, bit5, bit6, bit7;
			var bitArray = [];
			var rowOffset = (rowCounter << 9);
			for(var bitCounter = 0; bitCounter < 8; bitCounter++) {
				//if(document.getElementById('pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).classList.contains('on')) {
				//	console.log('pixel '+String(rowOffset + byteCounter + (bitCounter<<6)));
				//}
				bitArray[bitCounter] = $('#pixel-'+Math.min(rowOffset + byteCounter + (bitCounter << 6), 3071)).hasClass('on') | 0;
			}
			result += '0x'+((bitArray[0] << 0) + (bitArray[1] << 1) + (bitArray[2] << 2) + (bitArray[3] << 3) + (bitArray[4] << 4) + (bitArray[5] << 5) + (bitArray[6] << 6) + (bitArray[7] << 7)).toString(16) + ', ';
		}
	}
	// console.timeEnd('header');
	return result.substring(0, result.length-2) + ' };';
}

function generateScreen(parentID, isMainScreen) {
	if(isMainScreen) {
		$('#'+parentID).mousedown(function(event) {
			var target = event.target;
			var littleTarget = $('#frame-'+activeFrame+'-little-pixel-'+event.target.id.split('-').pop())[0];
			//console.log(this);
			// if the pixel is on and our drawmode is TOGGLE or NEGATIVE, then turn the pixel off
			if(target.classList.contains('on') && (drawMode === 'TOGGLE' || drawMode === 'NEGATIVE')) {
				target.classList.remove('on');
				target.classList.add('off');
				littleTarget.classList.remove('on');
				littleTarget.classList.add('off');
				saveStateDebounced();
			// if the pixel is on and our drawmode is POSITIVE, then do nothing
			} else if(target.classList.contains('on') && drawMode === 'POSITIVE') {
				//pass
			// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
			} else if(target.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
				target.classList.remove('off');
				target.classList.add('on');
				littleTarget.classList.remove('off');
				littleTarget.classList.add('on');
				saveStateDebounced();
			// if the pixel is on and our drawmode is POSITIVE, then do nothing
			} else if(target.classList.contains('off') && drawMode === 'NEGATIVE') {
				//pass
			}
			//console.log(this.id.split('-').pop());
		});
		$('#'+parentID).mouseover(function(event) {
			var target = event.target;
			var littleTarget = $('#frame-'+activeFrame+'-little-pixel-'+event.target.id.split('-').pop())[0];
			if(isMouseDown) {
				//console.log(target);
				// if the pixel is on and our drawmode is TOGGLE or NEGATIVE, then turn the pixel off
				if(target.classList.contains('on') && (drawMode === 'TOGGLE' || drawMode === 'NEGATIVE')) {
					target.classList.remove('on');
					target.classList.add('off');
					littleTarget.classList.remove('on');
					littleTarget.classList.add('off');
					saveStateDebounced();
				// if the pixel is on and our drawmode is POSITIVE, then do nothing
				} else if(target.classList.contains('on') && drawMode === 'POSITIVE') {
					//pass
				// if the pixel is off and our drawmode is TOGGLE or POSITIVE, then turn the pixel on
				} else if(target.classList.contains('off') && (drawMode === 'TOGGLE' || drawMode === 'POSITIVE')) {
					target.classList.remove('off');
					target.classList.add('on');
					littleTarget.classList.remove('off');
					littleTarget.classList.add('on');
					saveStateDebounced();
				// if the pixel is on and our drawmode is POSITIVE, then do nothing
				} else if(target.classList.contains('off') && drawMode === 'NEGATIVE') {
					//pass
				}
				//console.log(target.id.split('-').pop());
			}
		});
	} else {
		$('#'+parentID).click(function(event) {
			if(activeFrame !== parseInt(this.id.split('-').pop())) {
				$('#frame-'+activeFrame).removeClass('activeFrame');
				activeFrame = parseInt(this.id.split('-').pop());
				$('#frame-'+activeFrame).addClass('activeFrame');
				generateScreen('pixelParent', true);
			}
		});
	}
	for(var rowCounter = 0; rowCounter < 48; rowCounter++) {
		for(var colCounter = 0; colCounter < 64; colCounter++) {
			if( isMainScreen && !$('#pixel-' + (rowCounter * 64 + colCounter))[0] || !isMainScreen && !$('#'+parentID+'-little-pixel-' + (rowCounter * 64 + colCounter))[0]) {
				var temp = document.createElement('div');
				if(isMainScreen) {
					temp.id = 'pixel-' + (rowCounter * 64 + colCounter);
					temp.className = 'pixel';
					temp.className += ' off';
					temp.className += ' unselectable';
				} else {
					temp.id = parentID+'-little-pixel-' + (rowCounter * 64 + colCounter);
					temp.className = 'little-pixel';
					temp.className += ' off';
					temp.className += ' unselectable';
				}
				if(colCounter === 0) {
					temp.className += ' firstPixel';
				} else if(colCounter === 63) {
					temp.className += ' lastPixel';
				}
				$('#' + parentID.toString()).append(temp);
			}
		}
	}
}

generateScreen('pixelParent', true);
generateScreen('frame-0', false);
$('#frame-'+activeFrame).addClass('activeFrame');
setupButtons();
loadState();