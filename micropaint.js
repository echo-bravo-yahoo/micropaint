for(var rowCounter = 0; rowCounter < 48; rowCounter++) {
	for(var colCounter = 0; colCounter < 64; colCounter++) {
		var temp = document.createElement('div');
		temp.id = 'pixel-' + (rowCounter * 64 + colCounter);
		temp.className = 'pixel';
		temp.className += ' off';
		if(colCounter === 0) {
			temp.className += ' firstPixel';
		} else if(colCounter === 63) {
			temp.className += ' lastPixel';
		}
		temp.onclick = function() {
			var temp = this.className.split(' ');
			console.log(this);
			if(document.getElementById(this.id).classList.contains('on')) {
				document.getElementById(this.id).classList.remove('on');
				document.getElementById(this.id).classList.add('off');
			} else if(document.getElementById(this.id).classList.contains('off')) {
				document.getElementById(this.id).classList.remove('off');
				document.getElementById(this.id).classList.add('on');
			}
			console.log(this.id.split('-').pop());
		};
		var parent = document.getElementById('parent');
		parent.appendChild(temp);
	}
}