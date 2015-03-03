function init() {
	var canvas = document.getElementById('game_canvas');
    var ctx = canvas.getContext('2d');
    
	var img = new Image();
	img.addEventListener("load", function() {
		ctx.drawImage(img, 322, 2, 464, 136, 0, 0, 464, 136);
		ctx.drawImage(img, 83, 23, 13, 14, 15, 29, 13, 14);
	}, false);
	img.src = 'pacman10-hp-sprite.png';

}