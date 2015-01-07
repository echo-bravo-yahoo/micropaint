var isMouseDown = false;
var drawMode = 'TOGGLE';

document.body.onmousedown = function() {
	isMouseDown = true;
}

document.body.onmouseup = function() {
	isMouseDown = false;
	document.body.style.cursor = 'crosshair';
}

function exportToHeader() {
	var result = '{ ';
	var rowSize = 1;
	var columnSize = 48;
	console.log(document.querySelectorAll('.pixel'));
	for(var rowCounter = 0; rowCounter < 6; rowCounter++) {
		for(var byteCounter = 0; byteCounter < 64; byteCounter++) {
			//var temp = 0;
			// for(var bitCounter = 0; bitCounter < 8; bitCounter++) {
			// 	//temp+bitCounter*byteCounter
			// 	console.log((rowCounter*64*8 + byteCounter*8 + bitCounter));
			// 	if(document.getElementById('pixel-'+(rowCounter*64*8 + byteCounter*8 + bitCounter)).classList.contains('on')) {
			// 		//console.log('Pixel '+(byteCounter*6 + bitCounter)+' is on.');
			// 	}
			// }
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 0*64, 3071)).classList.contains('on')) {
				var bit0 = 1;
			} else {
				var bit0 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 1*64, 3071)).classList.contains('on')) {
				var bit1 = 1;
			} else {
				var bit1 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 2*64, 3071)).classList.contains('on')) {
				var bit2 = 1;
			} else {
				var bit2 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 3*64, 3071)).classList.contains('on')) {
				var bit3 = 1;
			} else {
				var bit3 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 4*64, 3071)).classList.contains('on')) {
				var bit4 = 1;
			} else {
				var bit4 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 5*64, 3071)).classList.contains('on')) {
				var bit5 = 1;
			} else {
				var bit5 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 6*64, 3071)).classList.contains('on')) {
				var bit6 = 1;
			} else {
				var bit6 = 0;
			}
			if(document.getElementById('pixel-'+Math.min(rowCounter*64*8 + byteCounter + 7*64, 3071)).classList.contains('on')) {
				var bit7 = 1;
			} else {
				var bit7 = 0;
			}
			result += '0x'+((bit0 << 0) + (bit1 << 1) + (bit2 << 2) + (bit3 << 3) + (bit4 << 4) + (bit5 << 5) + (bit6 << 6) + (bit7 << 7)).toString(16) + ', ';
		}
	}
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