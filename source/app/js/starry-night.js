(function (createWhatWeWant) {
	window.CanvasStarryNight2D = createWhatWeWant();
})(function createWhatWeWant() {
	function CanvasStarryNight2D(canvas, constructorOptions) {
		var thisNight = this;

		thisNight.drawSky = undefined;
		thisNight.buildScene = buildScene.bind(thisNight);
		thisNight.drawFrame = drawFrame.bind(thisNight);

		var canvasContext = null;
		var canvasWidth = 0;
		var canvasHeight = 0;
		var allStarsOfAllTypes = [];

		var starsCount = Math.ceil(canvasHeight * 0.97);
		var shootingStarsCount = Math.max(3, Math.ceil(canvasHeight * 0.02));

		var shouldDrawSky = true;
		thisNight.skyColor1 = '#110E19';

		_init.call(thisNight, canvas, constructorOptions);

		function _init(canvas, initOptions) {
			initOptions = initOptions || {};

			var tempInput;

			tempInput = parseInt(initOptions.starsCount);
			if (!isNaN(tempInput) && tempInput > -1) {
				starsCount = tempInput;
			}

			tempInput = parseInt(initOptions.shootingStarsCount);
			if (!isNaN(tempInput) && tempInput > -1) {
				shootingStarsCount = tempInput;
			}

			if (initOptions.hasOwnProperty('shouldDrawSky')) {
				shouldDrawSky = !!initOptions.shouldDrawSky;
			}

			if (typeof initOptions.drawSky === 'function') {
				thisNight.drawSky = initOptions.drawSky;
			}

			buildScene.call(thisNight, canvas, initOptions);
		}

		function buildScene(canvas, options) {
			options = options || {};

			if (canvas) {
				canvasContext = canvas.getContext('2d');
				canvasWidth = canvas.width;
				canvasHeight = canvas.height;
			}


			// clear existing entries
			allStarsOfAllTypes = [];


			var i;

			// create the stars
			for (i = 0; i < starsCount; i++) {
				allStarsOfAllTypes.push(
					new Star(canvas, {
						starSpeed: options.starSpeed
					})
				);
			}

			// Create shooting stars that just cycle.
			for (i = 0; i < shootingStarsCount; i++) {
				allStarsOfAllTypes.push(
					new ShootingStar(canvas, {
						headColor: options.shootingStarHeadColor,
						tailColor: options.shootingStarTailColor,
						expectedSpeed: options.shootingStarsExpectedSpeed
					})
				);
			}
		}

		function drawFrame(canvas, ctx, localTimeInSeconds) {
			if (shouldDrawSky) {
				_drawSky.apply(thisNight, arguments);
			}

			var count = allStarsOfAllTypes.length;
			while (count--) {
				allStarsOfAllTypes[count].draw(localTimeInSeconds);
			}
		}

		function _drawSky(canvas, ctx, localTimeInSeconds) {
			if (typeof thisNight.drawSky === 'function') {
				thisNight.drawSky(canvas, ctx, localTimeInSeconds);
			} else {
				_drawSkyDefault.call(thisNight);
			}
		}

		function _drawSkyDefault() {
			canvasContext.fillStyle = thisNight.skyColor1;
			canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
		}
	}


	function Star(canvas, constructorOptions) {
		var thisStar = this;

		var canvasWidth = 0;
		// var canvasHeight = 0;
		var canvasContext = null;

		var color = 'white';
		var size = 0;

		var x = 0;
		var y = 0;

		var speed = Math.random() * .05;

		thisStar.draw = draw.bind(thisStar);

		_init.call(thisStar, canvas, constructorOptions);

		function _init(canvas, initOptions) {
			if (!canvas) {
				throw ReferenceError('Invalid canvas for a Star');
			}

			canvasWidth = canvas.width;
			// canvasHeight = canvas.height;
			canvasContext = canvas.getContext('2d');


			initOptions = initOptions || {};
			var tempInput;

			tempInput = parseFloat(initOptions.starSpeed);
			if (!isNaN(tempInput) && tempInput > -1) {
				speed = tempInput;
			}

			// color = initOptions.color;
			size = Math.random() * 2;

			x = Math.random() * canvas.width;
			y = Math.random() * canvas.height;
		}

		function draw(localTimeInSeconds) {
			x -= speed;
			if (x < 0) {
				x = canvasWidth;
			} else {
				canvasContext.fillStyle = color;
				canvasContext.fillRect(x, y, size, size);
			}
		}
	}


	function ShootingStar(canvas, constructorOptions) {
		var thisShootingStar = this;

		var canvasWidth = 0;
		var canvasHeight = 0;
		var canvasContext = null;

		var headColor = 'white';
		var tailColor = 'white';
		var headSize = 0;
		var tailThickness = 0;
		var tailLengthX = 0;
		var tailLengthY = 0;

		var x = 0;
		var y = 0;

		var timeToStartShooting = NaN;
		var isShooting = false;
		var expectedSpeed = (Math.random() * 10) + 6;
		var currentlyUsedSpeedX = 0;
		var currentlyUsedSpeedY = 0;

		thisShootingStar.draw = draw.bind(thisShootingStar);

		_init.call(thisShootingStar, canvas, constructorOptions);

		function _init(canvas, initOptions) {
			if (!canvas) {
				throw ReferenceError('Invalid canvas for a Star');
			}

			canvasWidth = canvas.width;
			canvasHeight = canvas.height;
			canvasContext = canvas.getContext('2d');


			initOptions = initOptions || {};
			var tempInput;

			tempInput = parseFloat(initOptions.expectedSpeed);
			if (!isNaN(tempInput) && tempInput > -1) {
				expectedSpeed = tempInput;
			}

			if (initOptions.headColor) {
				headColor = initOptions.headColor;
			}

			if (initOptions.tailColor) {
				tailColor = initOptions.tailColor;
			}

			prepareForNextShooting.call(thisShootingStar);
		}

		function prepareForNextShooting() {
			var speedVarRatio = 0.05;
			var currentlyUsedSpeed = expectedSpeed *
				(Math.random() * speedVarRatio * 2 - speedVarRatio + 1);

			currentlyUsedSpeedX = currentlyUsedSpeed;
			currentlyUsedSpeedY = currentlyUsedSpeed;

			x = canvasWidth * (Math.random() * 2.5 - 0.5);
			y = 0;

			headSize = (Math.random() * 3) + 0.2;
			tailThickness = headSize * 0.4;

			var tailLength = (Math.random() * 50) + 40;
			tailLengthX = tailLength;
			tailLengthY = tailLength;

			var timeToWait = Math.ceil(3500 * Math.random() + 1000);
			timeToStartShooting = new Date().getTime() + timeToWait;
		}

		function draw(localTimeInSeconds) {
			if (!isShooting) {
				// Still waiting for next shooting
				if (new Date().getTime() >= timeToStartShooting) {
					isShooting = true;
				}
				return;
			}

			x -= currentlyUsedSpeedX;
			y += currentlyUsedSpeedY;

			var halfHeadSize = headSize / 2;

			// draw tail
			canvasContext.strokeStyle = tailColor;
			canvasContext.lineWidth = tailThickness;
			canvasContext.beginPath();
			canvasContext.moveTo(x, y);
			canvasContext.lineTo(x + tailLengthX, y - tailLengthY);
			canvasContext.stroke();

			// draw head
			canvasContext.fillStyle = headColor;
			canvasContext.beginPath();
			canvasContext.moveTo(x,                y - halfHeadSize);
			canvasContext.lineTo(x - halfHeadSize, y);
			canvasContext.lineTo(x,                y + halfHeadSize);
			canvasContext.lineTo(x + halfHeadSize, y);
			canvasContext.fill();

			if (x+tailLengthX < 0 || y-tailLengthY >= canvasHeight) {
				isShooting = false;
				prepareForNextShooting.call(thisShootingStar);
				return;
			}
		}
	}


	CanvasStarryNight2D.components = {
		Star: Star,
		ShootingStar: ShootingStar
	};

	return CanvasStarryNight2D;
});