(function () {
	function draw() {
		controller.drawFrame();
		requestAnimationFrame(draw);
	}


	var canvas = document.querySelector('#test-canvas');
	// var activeAreaPadding = 50;
	var centerX = window.innerWidth / 2;
	var centerY = window.innerHeight / 2;
	var distributionRadius = Math.min(window.innerWidth, window.innerHeight) * 0.5 * 0.6;
	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
		window.setTimeout(func, 1000 / 45);
	};



	var controller = new wlcCanvasPointsAndConnections({
		canvas: canvas,
		maxDistanceToMakeConnection: 60,
		lineWidthDrawingThreshold: 0.25,
		pointsCount: 90,
		thickestLineWidth: 1,
		pointColorRGB: '64, 64, 80',
		lineColorRGB: '128, 128, 160',
		speedMin: 0.1,
		speedMax: 0.79,
		generateOnePoint: generateOnePointAroundACircle,
		updateOnePointOnIteration: updateOnePointOnIteration
	});

	function generateOnePointAroundACircle(point) {
		var r = (Math.random() * 0.6 + 0.7 ) * distributionRadius;
		var theta = Math.random() * Math.PI * 2;

		point.x = r * Math.sin(theta) + centerX;
		point.y = r * Math.cos(theta) + centerY;
		point.coreX = point.x;
		point.coreY = point.y;
	}

	function updateOnePointOnIteration(point, vmin, vmax) {
		var vx, vy;

		if (!point.hasOwnProperty('vx')) {
			vx = Math.random() * (vmax - vmin) + vmin;
			vy = Math.random() * (vmax - vmin) + vmin;
			point.forceRatioOverDistanceX = 600 * Math.random() + 600;
			point.forceRatioOverDistanceY = 600 * Math.random() + 600;
		} else {
			var distToCoreX = point.coreX - point.x;
			var distToCoreY = point.coreY - point.y;
			var forceX = distToCoreX * Math.abs(distToCoreX) / point.forceRatioOverDistanceX;
			var forceY = distToCoreY * Math.abs(distToCoreY) / point.forceRatioOverDistanceY;
			vx = point.vx + forceX;
			vy = point.vy + forceY;
		}

		point.vx = vx;
		point.vy = vy;
		// point.speed = Math.sqrt(vx * vx + vy * vy);
		// point.direction = Math.atan2(vy, vx);
	}

	window.addEventListener('resize', function () {
		controller.updateCanvasSize();
	});

	draw();
})();



function wlcCanvasPointsAndConnections(constructorOptions) {
	var thisController = this;

	var canvas = constructorOptions.canvas;
	var canvasContext = canvas.getContext('2d');


	var lineWidthDrawingThreshold = 0.2;
	var pointSize = 6;
	var thickestLineWidth = 2;
	var maxDistanceToMakeConnection = 160;
	var pointsCount = 60;
	var speedMin = 0.8;
	var speedMax = 2.4;
	var pointColorRGB = '0,0,0';
	var lineColorRGB = '0,0,0';
	var pointsAreRounded = true;
	var shouldBounceAtBoundary = true;

	var activeAreaX1 = 0;
	var activeAreaY1 = 0;
	var activeAreaX2 = 0;
	var activeAreaY2 = 0;
	var mouseCursorX = null;
	var mouseCursorY = null;
	var maxDistanceToMakeConnection2 = 100000;

	var allPoints = [];
	var theDrawPointMethod;

	var random = Math.random;


	thisController.generateOnePoint = _generateOnePointDefaultMethod;
	thisController.updateOnePointOnIteration = _updateOnePointOnIterationDefaultMethod;
	thisController.drawFrame = drawFrame.bind(thisController);
	thisController.updateCanvasSize = updateCanvasSize.bind(thisController);
	thisController.setActiveArea = setActiveArea.bind(thisController);


	init(constructorOptions);




	var hasBeenInitialized = false;

	function init(initOptions) {
		config(initOptions);
		setupMouseEvents();
		updateCanvasSize();
		_generateAllPoints();

		hasBeenInitialized = true;
	}

	function config(options) {
		options = options || {};

		if (typeof options.pointsAreRounded === 'boolean') pointsAreRounded = options.pointsAreRounded;
		if (typeof options.shouldBoundAtBoundary === 'boolean') shouldBounceAtBoundary = options.shouldBoundAtBoundary;

		if (options.pointSize) pointSize = options.pointSize;
		if (options.thickestLineWidth) thickestLineWidth = options.thickestLineWidth;
		if (options.maxDistanceToMakeConnection) maxDistanceToMakeConnection = options.maxDistanceToMakeConnection;
		if (options.pointsCount) pointsCount = options.pointsCount;
		if (options.pointColorRGB) pointColorRGB = options.pointColorRGB;
		if (options.lineColorRGB) lineColorRGB = options.lineColorRGB;
		if (options.lineWidthDrawingThreshold) lineWidthDrawingThreshold = options.lineWidthDrawingThreshold;
		if (options.speedMin) speedMin = options.speedMin;
		if (options.speedMax) speedMax = options.speedMax;

		maxDistanceToMakeConnection2 = maxDistanceToMakeConnection * maxDistanceToMakeConnection;

		theDrawPointMethod = pointsAreRounded ? _drawPointAsRoundedDot : _drawPointAsSqure;

		if (options.hasOwnProperty('updateOnePointOnIteration')) {
			if (typeof options.updateOnePointOnIteration === 'function') {
				thisController.updateOnePointOnIteration = options.updateOnePointOnIteration;
			} else {
				thisController.updateOnePointOnIteration = _updateOnePointOnIterationDefaultMethod;
			}
		}

		var oldGenerateOnePointMethod = thisController.generateOnePoint;
		if (options.hasOwnProperty('generateOnePoint')) {
			if (typeof options.generateOnePoint === 'function') {
				thisController.generateOnePoint = options.generateOnePoint;
			} else {
				thisController.generateOnePoint = _generateOnePointDefaultMethod;
			}
		}

		if (hasBeenInitialized && oldGenerateOnePointMethod !== thisController.generateOnePoint) {
			_generateAllPoints();
		}
	}

	function setupMouseEvents() {
		window.addEventListener('mousemove', function (event) {
			mouseCursorX = event.clientX;
			mouseCursorY = event.clientY;
		});

		window.addEventListener('mouseout', function () {
			mouseCursorX = null;
			mouseCursorY = null;
		});
	}


	function updateCanvasSize(toUpdateActiveArea) {
		var html = document.documentElement;
		var body = document.body;

		canvas.width = window.innerWidth || html.clientWidth || body.clientWidth,
		canvas.height = window.innerHeight || html.clientHeight || body.clientHeight;

		if (typeof toUpdateActiveArea === 'function') {
			toUpdateActiveArea(canvas);
		} else {
			setActiveArea(0, 0, canvas.width, canvas.height);
		}
	}


	function setActiveArea(x1, y1, x2, y2) {
		activeAreaX1 = Math.min(x1, x2);
		activeAreaX2 = Math.max(x1, x2);
		activeAreaY1 = Math.min(y1, y2);
		activeAreaY2 = Math.max(y1, y2);
	}

	function drawFrame() {
		var px, py, comparingPoint;


		canvasContext.clearRect(0, 0, canvas.width, canvas.height);


		allPoints.forEach(function (point, pointIndex) {
			thisController.updateOnePointOnIteration(point);


			point.x += point.vx;
			point.y += point.vy;


			px = point.x;
			py = point.y;


			if (shouldBounceAtBoundary) {
				if (px > activeAreaX2) {
					point.vx = Math.abs(point.vx) * -1;
				}
				if (py > activeAreaY2) {
					point.vy = Math.abs(point.vy) * -1;
				}
				if (px < activeAreaX1) {
					point.vx = Math.abs(point.vx);
				}
				if (py < activeAreaY1) {
					point.vy = Math.abs(point.vy);
				}
			}


			var i = pointIndex + 1;
			for ( ; i < allPoints.length; i++) {
				comparingPoint = allPoints[i];

				drawLine(
					px, py, comparingPoint.x, comparingPoint.y,
					evaluateDistanceRatio(px, py, comparingPoint.x, comparingPoint.y)
				);

				if (mouseCursorX !== null) {
					drawLine(
						px, py, mouseCursorX, mouseCursorY,
						evaluateDistanceRatio(px, py, mouseCursorX, mouseCursorY)
					);
				}
			}


			theDrawPointMethod(px, py);
		});


		if (mouseCursorX !== null) {
			theDrawPointMethod(mouseCursorX, mouseCursorY);
		}
	}

	function _drawPointAsRoundedDot(px, py) {
		canvasContext.fillStyle = 'rgba(' + pointColorRGB + ',' + 1 + ')';
		canvasContext.beginPath();
		canvasContext.arc(px, py, pointSize/2, 0, Math.PI * 2);
		canvasContext.fill();
	}

	function _drawPointAsSqure(px, py) {
		canvasContext.fillRect(px - pointSize/2, py - pointSize/2, pointSize, pointSize);
	}

	function drawLine(p1x, p1y, p2x, p2y, distanceRatio) {
		var lineWidthRatio = 1 - distanceRatio;
		var lineWidth = thickestLineWidth * lineWidthRatio;
		if (lineWidth < lineWidthDrawingThreshold) return;

		var lineColor =  'rgba(' + lineColorRGB + ',' + Math.min(1, lineWidthRatio + 0.5) + ')';

		canvasContext.lineWidth = lineWidth;
		canvasContext.strokeStyle = lineColor;

		canvasContext.beginPath();
		canvasContext.moveTo(p1x, p1y);
		canvasContext.lineTo(p2x, p2y);
		canvasContext.stroke();
	}

	function _generateAllPoints() {
		allPoints.length = 0;

		for (var i = 0; i < pointsCount; i++) {
			var point = {};
			
			thisController.generateOnePoint(
				point, pointsCount, activeAreaX1, activeAreaY1, activeAreaX2, activeAreaY2
			);

			thisController.updateOnePointOnIteration(
				point, speedMin, speedMax, pointsCount, activeAreaX1, activeAreaY1, activeAreaX2, activeAreaY2
			);

			allPoints.push(point);
		}
	}

	function _generateOnePointDefaultMethod(point) {
		point.x = random() * (activeAreaX2 - activeAreaX1) + activeAreaX1;
		point.y = random() * (activeAreaY2 - activeAreaY1) + activeAreaY1;
	}

	function _updateOnePointOnIterationDefaultMethod(point) {
		var speed, direction;


		if (!point.hasOwnProperty('vx')) {
			speed = random() * (speedMax - speedMin) + speedMin;
			direction = random() * 2 * Math.PI;
		} else {
			var oldSpeed = point.speed;
			var oldDirection = point.direction;
			// var oldVx = point.vx;
			// var oldVy = point.vy;

			speed = oldSpeed * (random() * 0.1 + 0.95);
			direction = oldDirection + (random() * 8 - 4) / 360 * Math.PI;
		}


		point.speed = speed;
		point.direction = direction;
		point.vx = speed * Math.sin(direction);
		point.vy = speed * Math.cos(direction);
	}

	function evaluateDistanceRatio(p1x, p1y, p2x, p2y) {
		var dx = p1x - p2x;
		var dy = p1y - p2y;
		var distance2 = dx * dx + dy * dy;
		return Math.min(1, distance2 / maxDistanceToMakeConnection2);
	}
}