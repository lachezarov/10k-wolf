var wolf, parts, button, body;
var partsData = [];
var max = 800;
var scattered = false;
var animated = false;

addEventListener('DOMContentLoaded', function() {
	body = document.getElementsByTagName('body')[0];
	wolf = document.getElementById('wolf');
	parts = wolf.querySelectorAll('polygon, path, rect');
	button = document.createElement('button');

	button.id = 'toggle';
	button.innerHTML = 'Assemble';
	button.title = 'Toggle Animation';

	var nav = document.createElement('nav');
	nav.appendChild(button);

	body.appendChild(nav);

	prepare(parts);

	scatterParts(partsData);

	setRandomBackground();

	animateParts(partsData);

	button.addEventListener('click', function(event) {
		if( !animated ) {
			if( scattered ) {
				resetParts(partsData);
			} else {
				scatterParts(partsData);
			}

			setRandomBackground();

			animateParts(partsData);
		}
	});

	addEventListener('mousemove', function(event) {
		var halfWidth = window.innerWidth / 2;
		var halfHeight = window.innerHeight / 2;

		var x = (event.pageX - halfWidth) / halfWidth * 30;
		var y = (event.pageY - halfHeight) / halfHeight * -30;

		wolf.style.transform = 'rotateX(' + y + 'deg) rotateY(' + x + 'deg)';
	});

	addEventListener('touchmove', function(event) {
		event.preventDefault();
	});

	if( typeof DeviceMotionEvent !== 'undefined' && DeviceMotionEvent ) {
		addEventListener('devicemotion', function(event) {
			var halfWidth = window.innerWidth / 2;
			var halfHeight = window.innerHeight / 2;

			// console.log(orientation);
			var x = event.accelerationIncludingGravity.x * -7;
			var y = event.accelerationIncludingGravity.y * 5;

			if( orientation === 90 || orientation === -90 ) {
				wolf.style.transform = 'rotateY(' + y + 'deg)';
			} else {
				wolf.style.transform = 'rotateY(' + x + 'deg)';
			}
		});
	}
});

function prepare(parts) {
	for( var i = 0; i < parts.length; i++ ) {
		var part = parts[i];

		partsData[i] = {
			el: part,
			startX: 0,
			endX: 0,
			startY: 0,
			endY: 0,
			startRotation: 0,
			endRotation: 0,
			startOpacity: 1,
			endOpacity: 1
		};
	}
}

function animateParts(parts) {
	var duration = 1000;
	var elapsed = Date.now();
	var end = elapsed + duration;

	animated = true;

	requestAnimationFrame(function() {
		elapsed = Date.now();

		partsStep(parts, duration, elapsed, end);
	});
}

function partsStep(parts, duration, elapsed, end) {
	for( var i = 0; i < parts.length; i++ ) {
		var part = parts[i];

		var percentage = (duration - (end - elapsed)) / duration * 100;

		if( percentage > 100 ) {
			percentage = 100;
		}

		percentage /= 100;

		var x, y, rotation, opacity;

		if( part.endX === 0 ) {
			if( part.startX > 0 ) {
				x = part.startX - part.startX * percentage;
			} else {
				x = part.startX + Math.abs(part.startX) * percentage;
			}
		} else {
			x = part.endX * percentage;
		}

		if( part.endY === 0 ) {
			if( part.startY > 0 ) {
				y = part.startY - part.startY * percentage;
			} else {
				y = part.startY + Math.abs(part.startY) * percentage;
			}
		} else {
			y = part.endY * percentage;
		}

		if( part.endRotation === 0 ) {
			rotation = part.startRotation - part.startRotation * percentage;
		} else {
			rotation = part.endRotation * percentage;
		}

		if( part.endOpacity === 1 ) {
			opacity = part.endOpacity * percentage;

			if( opacity < part.startOpacity ) {
				opacity = part.startOpacity;
			}
		} else {
			opacity = (part.endOpacity - part.startOpacity) * percentage + part.startOpacity;
		}

		(function(part, x, y, rotation, opacity) {
			setPartTransform(part.el, x, y, rotation);
			setPartOpacity(part.el, opacity);
		})(part, x, y, rotation, opacity);
	}

	if( elapsed <= end ) {
		requestAnimationFrame(function() {
			elapsed = Date.now();

			partsStep(parts, duration, elapsed, end);
		});
	} else {
		animated = false;
	}
}

function scatterParts(parts) {
	for( i = 0; i < parts.length; i++ ) {
		var part = parts[i];
		
		(function(part) {
			scatterPart(part);
		})(part);
	}

	button.innerHTML = 'Assemble';
	wolf.classList.add('scattered');

	wolf.setAttribute('title', 'Scattered Particles');

	scattered = true;
}

function scatterPart(part, mild) {
	var randomX  = getRandom(max) - 300;
	var randomY  = getRandom(max) - 300;
	var rotation = getRandom(80);
	var randomOpacity = (getRandom(100) / 100);

	if( mild ) {
		randomX /= 30;
		randomY /= 30;
		rotation /= 20;
	}

	part.startX = 0;
	part.startY = 0;
	part.startRotation = 0;
	part.startOpacity = 1;

	part.endX = randomX;
	part.endY = randomY;
	part.endRotation = rotation;
	part.endOpacity = randomOpacity;
}

function setPartTransform(part, x, y, rotation) {
	var transformVal = 'translate(' + x + ', ' + y + ') rotate(' + rotation + ')';

	part.setAttribute('transform', transformVal);
}

function setPartOpacity(part, opacity) {
	part.setAttribute('fill-opacity', opacity);
}

function resetParts(parts) {
	for( var i = 0; i < parts.length; i++ ) {
		var part = parts[i];

		(function(part) {
			resetPart(part);
		})(part);
	}

	button.innerHTML = 'Scatter';
	wolf.classList.remove('scattered');

	wolf.setAttribute('title', 'Wolf Head');

	scattered = false;
}

function resetPart(part) {
	part.startX = part.endX;
	part.startY = part.endY;
	part.startRotation = part.endRotation;
	part.startOpacity = part.endOpacity;

	part.endX = 0;
	part.endY = 0;
	part.endRotation = 0;
	part.endOpacity = 1;
}

function getRandom(max) {
	return Math.floor( Math.random() * max );
}

function randomBackground() {
	var r = Math.floor( Math.random() * 255 );
	var g = Math.floor( Math.random() * 255 );
	var b = Math.floor( Math.random() * 255 );

	return 'rgb(' + r + ', ' + g + ', ' + b + ')'; 
}

function setRandomBackground() {
	body.style.backgroundColor = randomBackground();
}