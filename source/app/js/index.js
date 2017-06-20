(function (startApp) {
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

		startApp(
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
		settings: {
			companyHistoricEvents: {
				shouldAutoScrollTimeline: true,
				autoScrollingTimelineCssClass: 'should-auto-scroll-timeline'
			}
		},
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

			this.createPPT2RollingItemsCSSAnimations();
			this.setupPPT5HistoricEvents();
			this.setupPPT9();
			this.setupFullPage();
			this.setupAllCanvases();
			this.controllers.animation.startAnimation();

			this.state.hasBeenSetup = true;
		},

		setupFullPage: function () {
			var $root = $(this.elements.root);
			var $slides = $root.find('.ppt-pages-container .ppt-page');
			var normalScrollElements = '';

			if (!this.settings.companyHistoricEvents.shouldAutoScrollTimeline) {
				normalScrollElements += ' .fp-scrollable';
			}

			normalScrollElements += '.popup-layer';


			$root.find('.ppt-pages-container').fullpage({
				sectionSelector: '.ppt-page',
				normalScrollElements: normalScrollElements,

				// lazyLoading: false,
				dragAndMove: false,
				autoScrolling: true,
				loop: false,

				onLeave: onLeave,
				afterLoad: afterLoad,
				// afterRender: function(){},
				// afterResize: function(){},
				// afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
				// onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
			});

			$('.swiping-hint').on('click', function () {
				$.fn.fullpage.moveSectionDown();
			});

			function afterLoad(anchorLink, index) {
				$($slides[index-1]).find('.actor')
					.removeClass('leaving')
					.addClass('acting entering');
			}

			function onLeave(index /*, nextIndex, direction */) {
				$($slides[index-1]).find('.actor')
					.removeClass('entering')
					.addClass('acting leaving');
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
				shootingStarsExpectedSpeed: 8.7,
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
		},

		createPPT2RollingItemsCSSAnimations: function() {
			var selectorOfSection = '.ppt-page-2 .do-you-know';
			var selectorOfRoot = selectorOfSection + ' .rolling-items';
			var cssLengthUnit = 'rem';

			var itemCount = $(selectorOfSection + ' .transformation-compensation').length;
			var shouldSkipEnteringForFirstItem = false;
			var shouldKeepLastItemOnStage = true;


			var itemHeight = 2;
			// var fontSizeRatio = 0.66; // fontSize = fontSizeRatio * itemHeigt
			var itemRotationXDelta = 6; // angle in degrees
			var itemOpacityInit = 0;
			var itemOpacityAfterFadeOut = 0.4;
			var itemOpacityOnDisappear = 0;


			var animationNamePrefix = 'page-2-do-you-know-scrolling-items-';
			var allAnimationOverallDelay = 2; // time in seconds
			var itemRollingDuration = 0.5; // time in seconds
			var itemPauseDuration = 1.5; // time in seconds
			var itemFadeInDuration = 0.4; // time in seconds
			var itemFadeOutDuration = 0.3; // time in seconds
			var itemDisappearDuration = 12; // time in seconds


			var styleElementInnerHTML = _doIt();
			// console.log(styleElementInnerHTML);

			var styleElement = document.createElement('style');
			styleElement.innerHTML = styleElementInnerHTML;
			document.head.appendChild(styleElement);




			function _doIt() {
				var indention = '    ';

				var itemCountToAnimate = itemCount + 1;

				if (shouldSkipEnteringForFirstItem) {
					itemCountToAnimate--;
				}

				if (shouldKeepLastItemOnStage) {
					itemCountToAnimate--;
				}

				var eachItemFadeInAndStayTotalDuration = itemRollingDuration + itemPauseDuration;

				var itemHeightCss = itemHeight + cssLengthUnit;

				var itemRotationOriginOffsetZ = 2.5 * Math.ceil(itemHeight / Math.abs(Math.sin(itemRotationXDelta)));
				var itemRotationOriginOffsetZCss = itemRotationOriginOffsetZ + cssLengthUnit;


				var cssKeyframes = [];
				var cssRules = [];
				var animationName;
				var selector;

				var allItemsScrollingTotalDuration =
					(itemRollingDuration + itemPauseDuration) * itemCountToAnimate;

				var itemRollingDurationPercentage =
					100 * itemRollingDuration / allItemsScrollingTotalDuration;

				var itemPauseDurationPercentage =
					100 * itemPauseDuration / allItemsScrollingTotalDuration;






				cssRules.push(
					_generateSectionElementSetup(0)
				);

				cssRules.push(
					_generateRootElementSetup(0)
				);

				selector = selectorOfRoot + ' .locator.position-locator';
				cssRules.push(
					_generateLocationOffsetElementSetup(0, selector)
				);




				animationName = animationNamePrefix + 'all-items-roll-together';
				selector = selectorOfRoot + ' .actor.all-items-rotation.acting.entering';
				cssKeyframes.push(
					_createKeyframesOfAllItemsRotating(0, animationName)
				);
				cssRules.push(
					_generateAnimationSetupOfRootRotator(0, selector, animationName, 'linear')
				);




				selector = selectorOfRoot + ' .locator.transformation-compensation';
				cssRules.push(
					_generateAllRotationCompensationForEachItems(0, selector)
				);



				animationName = animationNamePrefix + 'one-item-change-opacity';
				cssKeyframes.push(
					_createKeyframesOfAllItemsOpacityChanging(0, animationName)
				);
				cssRules.push(
					_generateOpacityChangingAnimationsSetup(0, selector, animationName, 'linear')
				);









				cssKeyframes = cssKeyframes.join('\n') + '\n\n\n\n\n';
				cssRules = cssRules.join('\n');

				var styleElementInnerHTML = [
					cssKeyframes,
					cssRules
				].join('\n');


				return styleElementInnerHTML;






				function _createKeyframesOfAllItemsRotating(indentionCount, animationName) {
					var cssKeyframesDefinition = [];

					cssKeyframesDefinition.push('@keyframes '+animationName+' {\n');


					var currentDuration = 0;
					var currentRotationX = 0;
					if (!shouldSkipEnteringForFirstItem) {
						currentRotationX = -itemRotationXDelta;
					}

					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, currentDuration, currentRotationX)
					);

					for (var i=0; i<itemCountToAnimate; i++) {
						currentDuration += itemRollingDurationPercentage;
						currentRotationX += itemRotationXDelta;

						cssKeyframesDefinition.push(
							_generateOneKeyFrame(1, currentDuration, currentRotationX)
						);

						currentDuration += itemPauseDurationPercentage;

						cssKeyframesDefinition.push(
							_generateOneKeyFrame(1, currentDuration, currentRotationX)
						);
					}

					cssKeyframesDefinition.push('}\n');

					cssKeyframesDefinition = cssKeyframesDefinition.join('');

					return cssKeyframesDefinition;


					function _generateOneKeyFrame(indentionCount, durationPercentage, rotationX) {
						var keframeString = [];

						if (rotationX !== 0) rotationX = rotationX+'deg';

						var indentionPrefix = '';
						for (var j=0; j<indentionCount; j++) {
							indentionPrefix += indention;
						}

						keframeString.push(
							indentionPrefix + durationPercentage+'% {\n'
						);

						keframeString.push(
							indentionPrefix + indention + 'transform: rotateX('+rotationX+');\n'
						);

						keframeString.push(indentionPrefix + '}\n');

						return keframeString.join('');
					}
				}

				function _createKeyframesOfAllItemsOpacityChanging(indentionCount, animationName) {
					var cssKeyframesDefinition = [];
					var eachItemAnimationTotalDuration = eachItemFadeInAndStayTotalDuration + itemFadeOutDuration + itemDisappearDuration;
					var timePoints = [
						0,
						100 * itemFadeInDuration / eachItemAnimationTotalDuration,
						100 - 100 * (itemFadeOutDuration + itemDisappearDuration) / eachItemAnimationTotalDuration,
						100 - 100 * itemDisappearDuration / eachItemAnimationTotalDuration,
						100
					];

					cssKeyframesDefinition.push('@keyframes '+animationName+' {\n');
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[0], itemOpacityInit)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[1], 1)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[2], 1)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[3], itemOpacityAfterFadeOut)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[4], itemOpacityOnDisappear)
					);
					cssKeyframesDefinition.push('}\n');


					cssKeyframesDefinition.push('\n');


					cssKeyframesDefinition.push('@keyframes '+animationName+'-last-item {\n');
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[0], itemOpacityInit)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, timePoints[1], 1)
					);
					cssKeyframesDefinition.push(
						_generateOneKeyFrame(1, 100, 1)
					);
					cssKeyframesDefinition.push('}\n');

					return cssKeyframesDefinition.join('');


					function _generateOneKeyFrame(indentionCount, durationPercentage, opacity) {
						var keframeString = [];

						var indentionPrefix1 = '';
						for (var j=0; j<indentionCount; j++) {
							indentionPrefix1 += indention;
						}
						var indentionPrefix2 = indentionPrefix1 + indention;

						keframeString.push(indentionPrefix1 +
							durationPercentage+'% {\n'
						);
						keframeString.push(indentionPrefix2 +
							'opacity: '+opacity+';\n'
						);
						keframeString.push(indentionPrefix1 +
							'}\n'
						);

						return keframeString.join('');
					}
				}




				function _generateSectionElementSetup(indentionCount) {
					var cssRule = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;


					cssRule.push(indentionPrefix1 +
						selectorOfSection + ' {\n'
					);
					cssRule.push(indentionPrefix2 +
						'height: '+itemHeightCss+';\n'
					);
					cssRule.push(indentionPrefix1 +
						'}'
					);


					return cssRule.join('');
				}

				function _generateRootElementSetup(indentionCount) {
					var cssRule = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;

					// var fontSize = fontSizeRatio * itemHeight + 'rem';

					cssRule.push(indentionPrefix1 +
						selectorOfRoot + ' {\n'
					);
					// cssRule.push(indentionPrefix2 +
					// 	'font-size: '+fontSize+';\n'
					// );
					cssRule.push(indentionPrefix2 +
						'line-height: '+itemHeightCss+';\n'
					);
					cssRule.push(indentionPrefix1 +
						'}'
					);


					return cssRule.join('');
				}

				function _generateLocationOffsetElementSetup(indentionCount, selector) {
					var cssRule = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;

					cssRule.push(indentionPrefix1 +
						selector + ' {\n'
					);
					cssRule.push(indentionPrefix2 +
						'transform: translateZ(-'+itemRotationOriginOffsetZCss+');\n'
					);
					cssRule.push(indentionPrefix1 +
						'}'
					);

					return cssRule.join('');
				}

				function _generateAnimationSetupOfRootRotator(indentionCount, selector, animationName, timingFunction) {
					var cssRuleForAnimationSetup = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;

					cssRuleForAnimationSetup.push(indentionPrefix1 +
						selector + ' {\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix2 +
						'animation-name: ' + animationName + ';\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix2 +
						'animation-delay: ' + allAnimationOverallDelay + 's;\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix2 +
						'animation-duration: ' + allItemsScrollingTotalDuration + 's;\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix2 +
						'animation-timing-function: '+timingFunction+';\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix2 +
						'animation-fill-mode: both;\n'
					);
					cssRuleForAnimationSetup.push(indentionPrefix1 +
						'}'
					);

					return cssRuleForAnimationSetup.join('');
				}

				function _generateAllRotationCompensationForEachItems(indentionCount, selector) {
					var cssRulesForAllItems = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;


					var c, thisSelector;
					for (c = 0; c < itemCount; c++) {
						thisSelector = selector + ':nth-child(' + (c+1) + ')';
						var thisRotationX = itemRotationXDelta * -c;
						if (thisRotationX!==0) thisRotationX = thisRotationX+'deg';

						cssRulesForAllItems.push(indentionPrefix1 +
							thisSelector + ' {\n'
						);

						cssRulesForAllItems.push(indentionPrefix2 +
							'transform: rotateX(' + thisRotationX + ');\n'
						);

						cssRulesForAllItems.push(indentionPrefix1 +
							'}\n'
						);
					}



					return cssRulesForAllItems.join('');
				}

				function _generateOpacityChangingAnimationsSetup(indentionCount, selectorOfNth, animationName, timingFunction) {
					var cssRulesForAllItems = [];
					var indentionPrefix1 = '';
					for (var j=0; j<indentionCount; j++) {
						indentionPrefix1 += indention;
					}
					var indentionPrefix2 = indentionPrefix1 + indention;
					var selectorBase = '.actor.change-opacity';
					var commonSelector = selectorOfRoot + ' ' + selectorBase;
					var eachItemAnimationTotalDuration = eachItemFadeInAndStayTotalDuration + itemFadeOutDuration + itemDisappearDuration;




					cssRulesForAllItems.push(indentionPrefix1 +
						commonSelector + ' {\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'transform: translateZ(' + itemRotationOriginOffsetZCss + ');\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'opacity: ' + itemOpacityInit + ';\n'
					);
					cssRulesForAllItems.push(indentionPrefix1 +
						'}\n'
					);



					cssRulesForAllItems.push(indentionPrefix1 +
						commonSelector + '.acting.entering' + ' {\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'animation-name: ' + animationName + ';\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'animation-duration: ' + eachItemAnimationTotalDuration + 's;\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'animation-timing-function: '+timingFunction+';\n'
					);
					cssRulesForAllItems.push(indentionPrefix2 +
						'animation-fill-mode: both;\n'
					);
					cssRulesForAllItems.push(indentionPrefix1 +
						'}\n'
					);




					// animation delay for each item
					var overallDelay = allAnimationOverallDelay + 0;
					if (shouldSkipEnteringForFirstItem) {
						overallDelay -= itemRollingDuration + itemPauseDuration;
					}

					for (var c = 0; c < itemCount; c++) {
						var thisSelector = selectorOfNth + ':nth-child(' + (c+1) + ') ' + selectorBase;
						thisSelector += '.acting.entering';

						var thisDelay = overallDelay + c * eachItemFadeInAndStayTotalDuration - itemFadeInDuration * 0.25;

						cssRulesForAllItems.push(indentionPrefix1 +
							thisSelector + ' {\n'
						);
						cssRulesForAllItems.push(indentionPrefix2 +
							'animation-delay: ' + thisDelay + 's;\n'
						);

						if (c === itemCount-1 && shouldKeepLastItemOnStage) {
							cssRulesForAllItems.push(indentionPrefix2 +
								'animation-name: ' + animationName + '-last-item;\n'
							);
						}

						cssRulesForAllItems.push(indentionPrefix1 +
							'}\n'
						);
					}


					return cssRulesForAllItems.join('');
				}
			}
		},

		setupPPT5HistoricEvents: function() {
			var s = this.settings.companyHistoricEvents;
			if (s.shouldAutoScrollTimeline) {
				$('.ppt-page-5')
					.addClass(s.autoScrollingTimelineCssClass)
					.find('.timeline').addClass('actor');
			}
		},

		setupPPT9: function() {
			var thisStage = this;
			var $pageRoot = $('.ppt-page-9');
			var $ppt9AllOpeningPositions = $pageRoot.find('.opening-position');
			var $ppt9AllPopupLayersRoot = $pageRoot.find('.popup-layers');
			var $ppt9AllPopupLayers = $ppt9AllPopupLayersRoot.find('.popup-layer');

			thisStage.elements.$ppt9OpeningPositions = $ppt9AllOpeningPositions;

			var ppt9AllPopupLayers = {};

			$ppt9AllPopupLayers.each(function () {
				var $popupLayer = $(this);
				var $popupWindow = $popupLayer.find('.popup-window');
				var popupLayerId = this.id;

				ppt9AllPopupLayers[popupLayerId] = $popupLayer;
				$popupLayer.$popupLayersRoot = $ppt9AllPopupLayersRoot;
				$popupLayer.$popupWindow = $popupWindow;

				var $buttonX = $popupLayer.find('.button-x');

				$buttonX.on('click', function () {
					thisStage.hidePopupLayer($popupLayer);
				});
			});

			$ppt9AllOpeningPositions.each(function () {
				var $openingPosition = $(this);
				var popupLayerId = $openingPosition.attr('data-popup-layer-id');
				var $popupLayer = ppt9AllPopupLayers[popupLayerId];

				$openingPosition.on('click', function () {
					thisStage.showPopupLayer($popupLayer);
				});
			});
		},

		showPopupLayer: function ($popupLayer) {
			var cssClassNameForShowingUp = 'showing';
			var cssClassNameForLeaving = 'leaving';
			var timeToWaitForAnimation = 600;

			var $popupWindow = $popupLayer.$popupWindow;

			$.fn.fullpage.setAllowScrolling(false);
			$.fn.fullpage.setKeyboardScrolling(false);

			$popupWindow
				.removeClass(cssClassNameForLeaving)
				.addClass(cssClassNameForShowingUp);

			$popupLayer.show();

			setTimeout(function () {
				$popupLayer.removeClass(cssClassNameForShowingUp);
			}, timeToWaitForAnimation);
		},

		hidePopupLayer: function ($popupLayer) {
			var cssClassNameForShowingUp = 'showing';
			var cssClassNameForLeaving = 'leaving';
			var timeToWaitForAnimation = 600;

			var $popupWindow = $popupLayer.$popupWindow;

			$popupWindow
				.removeClass(cssClassNameForShowingUp)
				.addClass(cssClassNameForLeaving);

			setTimeout(function () {
				$popupWindow.removeClass(cssClassNameForLeaving);

				$popupLayer.hide();
				// $popupLayersRoot.hide();

				$.fn.fullpage.setAllowScrolling(true);
				$.fn.fullpage.setKeyboardScrolling(true);
			}, timeToWaitForAnimation);
		}
	};



	app.init();
	// app.showStage(2);
});