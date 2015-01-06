var isMouseDown = false;
var drawMode = 'POSITIVE';

document.body.onmousedown = function() {
	isMouseDown = true;
}

document.body.onmouseup = function() {
	isMouseDown = false;
	document.body.style.cursor = 'crosshair';
}

function exportToHeader() {
	var result = "";
	console.log(document.querySelectorAll('.pixel'));
	for(var rowCounter = 0; row < 6; row++) {
		for(var byteCounter = 0; byteCounter < 64; byteCounter++) {
			result.append()
		}
	}
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