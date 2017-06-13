/**
 * @author lionrock <https://github.com/lionrock/HTML5-Example/tree/master/wechat-divination>
 */

(function (createWhatWeWant) {
	window.deviceShakingDetectionService = createWhatWeWant();
})(function createWhatWeWant() {
	return new DeviceShakingDetectionService;







	function DeviceShakingDetectionService() {
		var motionDeltaTolerance = 25;
		var orientationDeltaTolerance = 5; // degrees

		var thisService = this;
		var promisedActions = [];

		var promisesWereJustFulfilled = false;
		var timeToWaitForNextDetection = 5000;

		var listenerOfDeviceMotionEvent;
		var listenerOfDeviceOrientationEvent;

		thisService.stop = stop.bind(thisService);
		thisService.promise = promise.bind(thisService);
		thisService.forget = forget.bind(thisService);
		thisService.clearPromises = clearPromises.bind(thisService);
		thisService.fulfillAllPromises = fulfillAllPromises.bind(thisService);

		_init.call(thisService);

		function _init() {
			setup.call(thisService);
		}

		function fulfillAllPromises(data) {
			for (var i = 0; i < promisedActions.length; i++) {
				var action = promisedActions[i];
				action(data);
			}

			promisesWereJustFulfilled = true;
			setTimeout(function () {
				promisesWereJustFulfilled = false;
			}, timeToWaitForNextDetection);
		}

		function promise(action) {
			if (typeof action === 'function') {
				promisedActions.push(action);
			}
		}

		function forget(actionToForget) {
			for (var i = 0; i < promisedActions.length; i++) {
				var action = promisedActions[i];
				if (action === actionToForget) {
					break;
				}
			}

			if (i<promisedActions.length) {
				promisedActions.splice(i, 1);
			}
		}

		function clearPromises() {
			promisedActions = [];
		}

		function setup() {
			//摇一摇(使用DeviceMotion事件, 推荐, 因为可以计算加速度)
			if (window.DeviceMotionEvent) {
				listenToDeviceMotionEvent();
			}

			//摇一摇(使用DeviceOrientation事件, 本质是计算偏转角)
			//测试中发现有些设备不支持(iphone5的微信内置浏览器, 魅族mx4的微信内置浏览器)
			if (window.DeviceOrientationEvent) {
				listenToDeviceOrientationEvent();
			}
		}

		function stop() {
			if (window.DeviceMotionEvent) {
				stopListeningToDeviceMotionEvent();
			}

			if (window.DeviceOrientationEvent) {
				stopListeningToDeviceOrientationEvent();
			}
		}

		function stopListeningToDeviceMotionEvent() {
			window.removeEventListener(
				'devicemotion',
				listenerOfDeviceMotionEvent
			);
		}

		function stopListeningToDeviceOrientationEvent() {
			window.removeEventListener(
				'deviceorientation',
				listenerOfDeviceOrientationEvent
			);
		}

		function listenToDeviceMotionEvent() {
			var x, y, z, lastX, lastY, lastZ;
			x = y = z = lastX = lastY = lastZ = 0;

			listenerOfDeviceMotionEvent = _listenerOfDeviceMotionEvent;
			window.addEventListener('devicemotion', listenerOfDeviceMotionEvent);


			function _listenerOfDeviceMotionEvent(event) {
				if (promisesWereJustFulfilled) {
					return true;
				}

				var acceleration = event.accelerationIncludingGravity;
				x = acceleration.x;
				y = acceleration.y;
				z = acceleration.z;

				var deltaTolerance = motionDeltaTolerance;

				var iThinkTheDeviceIsShaking =
						Math.abs(x - lastX) >= deltaTolerance
					||  Math.abs(y - lastY) >= deltaTolerance
					||  Math.abs(z - lastZ) >= deltaTolerance;

				if (iThinkTheDeviceIsShaking) {
					thisService.fulfillAllPromises(event);
				}

				lastX = x;
				lastY = y;
				lastZ = z;
			}
		}

		function listenToDeviceOrientationEvent() {
			var previousEvent;
			listenerOfDeviceOrientationEvent = _listenerOfDeviceOrientationEvent;
			window.addEventListener('deviceorientation', listenerOfDeviceOrientationEvent);


			function _listenerOfDeviceOrientationEvent(event) {
				if (promisesWereJustFulfilled) {
					return true;
				}

				if (!previousEvent) {
					previousEvent = event;
					return true;
				}

				var deltaTolerance = orientationDeltaTolerance;

				var delta1 = Math.abs(event.alpha - previousEvent.alpha);
				var delta2 = Math.abs(event.beta  - previousEvent.beta);
				var delta3 = Math.abs(event.gamma - previousEvent.gamma);

				var iThinkTheDeviceIsShaking =
						(delta1 > deltaTolerance && delta2 > deltaTolerance)
					||  (delta1 > deltaTolerance && delta3 > deltaTolerance)
					||  (delta2 > deltaTolerance && delta3 > deltaTolerance)
				;

				if (iThinkTheDeviceIsShaking) {
					thisService.fulfillAllPromises(event);
				}

				previousEvent = event;
			}
		}
	}
});