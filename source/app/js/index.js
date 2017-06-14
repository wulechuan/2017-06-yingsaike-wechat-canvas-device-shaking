(function (buildWhatWeWant) {
	var global = window;
	var errorStringAbsentPrefix = 'window.';
	var errorStringAbsent = ' 是必须模块，但缺失了。';

	var require1 = 'jQuery';
	var require2 = 'wlcCanvasAnimationController';
	var require3 = 'CanvasStarryNight2D';
	var require4 = 'deviceShakingDetectionService';

	if (!global[require1])
		throw ReferenceError(errorStringAbsentPrefix + require1 + errorStringAbsent);


	// Below line means $(function () {}),
	// because global[require1] is exactly jQuery.
	global[require1](function () {
		if (typeof global[require2] !== 'function')
			throw ReferenceError(errorStringAbsentPrefix + require2 + errorStringAbsent);

		if (typeof global[require3] !== 'function')
			throw ReferenceError(errorStringAbsentPrefix + require3 + errorStringAbsent);

		if (typeof global[require4] !== 'object')
			throw ReferenceError(errorStringAbsentPrefix + require4 + errorStringAbsent);

		buildWhatWeWant(
			global[require1],
			global[require2],
			global[require3],
			global[require4]
		);
	});
})(function buildWhatWeWant($, wlcCanvasAniCtrl, CanvasStarryNight2D, deviceShakingDetectionService) {
	var stage1Element = document.querySelector('.stage.shake-device-to-start');
	var stage2Element = document.querySelector('.stage.ppt');
	if (!stage1Element || !stage2Element) return;


	var app = {
		settings: {
			maxSecondsToWaitForUserShakingDevice: 5,			
		},
		state: {},

		init: function() {
			this.showStage(1);
			this.listenToDeviceShaking();
		},

		showStage: function (index) {
			if (index===1) {
				stage1.elements.root.style.display = '';
				stage2.elements.root.style.display = 'none';
				stage1.onShow();
			} else {
				stage1.elements.root.style.display = 'none';
				stage2.elements.root.style.display = '';	
				stage2.onShow();
			}
		},

		listenToDeviceShaking: function () {
			this.onDeviceShaking = (function onShaking(/* event */) {
				stage1.openShutterOnce();
				this.playShutterSoundOnce();
				this.stopListeningToDeviceShaking();
			}).bind(this);

			deviceShakingDetectionService.promise(this.onDeviceShaking);

			this.state.timeoutForDeviceShaking = setTimeout(
				this.onDeviceShaking,
				1000 * this.settings.maxSecondsToWaitForUserShakingDevice
			);
		},

		stopListeningToDeviceShaking: function() {
			deviceShakingDetectionService.forget(this.onDeviceShaking);
			clearTimeout(this.state.timeoutForDeviceShaking);
		},

		playShutterSoundOnce: function() {
			// do something here
		}
	};

	var stage1 = {
		name: 'stage1',
		elements: {
			root: stage1Element
		},
		state: {},

		onShow: function() {
			this.setup();
		},

		setup: function () {
			if (this.state.hasBeenSetup) return;
			this.setupShakingShutter();
			this.setupCallToActionButton();
			this.state.hasBeenSetup = true;
		},

		setupShakingShutter: function () {
			var elements = this.elements;
			elements.hintMasks = elements.root.querySelectorAll('.shaking-hint .mask');
			elements.$flyingSymbolOuterEl = $('.symbol-thrown-out-outer');
			elements.$flyingSymbolInnerEl = $('.symbol-thrown-out-inner');
		},

		setupCallToActionButton: function() {
			var elements = this.elements;
			var callToActionButton = elements.root.querySelector('.call-to-action');
			if (!callToActionButton) throw ReferenceError('call-to-action button not found.');

			callToActionButton.addEventListener('click', function () {
				app.showStage(2);
			});
		},

		openShutterOnce: function () {
			var animatingCssName = 'animating';
			var state = this.state;
			var hintMasks = this.elements.hintMasks;

			if (state.hintMasksIsAnimating) return;
			state.hintMasksIsAnimating = true;

			for (var i=0; i<hintMasks.length; i++) {
				hintMasks[i].classList.add(animatingCssName);
			}

			this.throwOutCallToActionButton();

			setTimeout(function () {
				for (var i=0; i<hintMasks.length; i++) {
					hintMasks[i].classList.remove(animatingCssName);
				}

				state.hintMasksIsAnimating = false;
			}, 0.4 * 1000);
		},

		throwOutCallToActionButton: function () {
			var animatingCssName = 'animating';
			var state = this.state;
			var elements = this.elements;

			if (state.flyingSymbolHasBeenThrown) return;
			state.flyingSymbolHasBeenThrown = true;

			elements.$flyingSymbolOuterEl.show();
			elements.$flyingSymbolInnerEl.addClass(animatingCssName);

			setTimeout(function () {
				elements.$flyingSymbolInnerEl.removeClass(animatingCssName);
			}, 0.4 * 1000);
		}
	};

	var stage2 = {
		name: 'stage2',
		elements: {
			root: stage2Element
		},
		state: {},
		controllers: {},

		onShow: function() {
			this.setup();
		},

		setup: function () {
			if (this.state.hasBeenSetup) return;
			this.setupFullPage();
			this.setupAllCanvases();
			this.controllers.animation.startAnimation();			

			this.state.hasBeenSetup = true;
		},

		setupFullPage: function () {
			var lastShownSlide = -1;
			var $root = $(this.elements.root);
			var $slides = $root.find('.ppt-pages-container .ppt-page');
			// console.log($slides);
			
			$root.find('.ppt-pages-container').fullpage({
				sectionSelector: '.ppt-page',
				// slideSelector: '',

				lazyLoading: false,
				dragAndMove: false,
				autoScrolling: true,
				loop: false,
				// onLeave: function(index, nextIndex, direction){},
				afterLoad: onFullPageJsPageLoaded,
				// afterRender: function(){},
				// afterResize: function(){},
				// afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
				// onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
			});

			function onFullPageJsPageLoaded(anchorLink, index) {
				$($slides[index-1]).find('.actor')
					.removeClass('leaving')
					.addClass('acting entering');

				if (lastShownSlide>=0) {
					$(lastShownSlide).find('.actor')
						.removeClass('entering')
						.addClass('acting leaving');
				}

				lastShownSlide = index;
			}
		},

		setupAllCanvases: function() {
			this.setupSourceCanvas();
			this.setupDuplicatedCanvases();
		},

		setupSourceCanvas: function() {
			var elements = this.elements;
			var sourceCanvas = $(elements.root).find('canvas.bg-rendering-source')[0];
			if (!sourceCanvas) {
				throw ReferenceError('source canvas not found.');
			}

			elements.sourceCanvas = sourceCanvas;
			sourceCanvas.width  = sourceCanvas.clientWidth;
			sourceCanvas.height = sourceCanvas.clientHeight;

			var stage = this;

			// var skySourceImg = $('.bg-image-the-earth')[0];

			var starryNight = new CanvasStarryNight2D(sourceCanvas, {
				starsCount: 100,
				starSpeed: 0.01,

				shootingStarHeadColor: '#1ffe7f',
				shootingStarTailColor: '#02c2ff',
				shootingStarsCount: 3,
				shootingStarsExpectedSpeed: 9,
				shouldDrawSky: false,
				// drawSky: function(canvas, ctx, timeInSeconds) {
				// 	ctx.drawImage(skySourceImg, 0, 0, canvas.width, canvas.height);
				// }
			});

			var animationController = new wlcCanvasAniCtrl(sourceCanvas, {
				// shouldClearCanvasBeforeDrawing: true,
				bgColor: ''
			});

			animationController.drawFrame = function(/* canvas, ctx, localTimeInSeconds */) {
				stage.sourceCanvasDrawFrame.apply(stage, arguments);
				stage.copyImageFromSourceCanvasToDuplicationCanvases();
			};

			// save these for later use
			stage.controllers.animation = animationController;
			stage.controllers.starryNight = starryNight;
		},

		setupDuplicatedCanvases: function() {
			var elements = this.elements;
			var $duplicationCanvases = $(elements.root).find('canvas.bg-duplication');

			$duplicationCanvases.each(function () {
				this.width  = this.clientWidth;
				this.height = this.clientHeight;
			});

			elements.$duplicationCanvases = $duplicationCanvases;
		},

		sourceCanvasDrawFrame: function(canvas, ctx, localTimeInSeconds) {
			this.controllers.starryNight.drawFrame(canvas, ctx, localTimeInSeconds);
		},

		copyImageFromSourceCanvasToDuplicationCanvases: function() {
			var stage = this;
			stage.elements.$duplicationCanvases.each(function () {
				var canvas = this;
				var ctx = canvas.getContext('2d');
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(stage.elements.sourceCanvas, 0, 0);
			});
		}
	};



	app.init();
	app.showStage(2);
});