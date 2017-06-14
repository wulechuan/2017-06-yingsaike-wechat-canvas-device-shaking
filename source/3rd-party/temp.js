/* global $ */
function ShakeOpen(e, s, t) {
	function a() {
		var e = 'shake-open';
		if (!r.pages[e]) {
			var s = $('<div class="shake-open">')
				, t = $('<div class="shake-content">');
			s.append(t);
			var a = $('<div class="shake-content-tag-center">');
			a.css('background-image', 'url("' + l.shake + '")'),
				t.append(a),
				r.shakes.shake = a;
			var n = $('<div class="shake-content-tag-flower">');
			n.css('background-image', 'url("' + l.shakeConent + '")'),
				t.append(n),
				r.shakes.content = n;
			var i = $('<div class="shake-content-tag-bottom">');
			i.css('background-image', 'url("' + l.shake + '")'),
				t.append(i),
				r.shakes.bottomOpen = i;
			var o = $('<div class="shake-content-tag-top">');
			o.css('background-image', 'url("' + l.shake + '")'),
				t.append(o),
				r.shakes.topOpen = o;
			var u = $('<div class="shake-content-loading">');
			u.append('<i class="loading"></i>正在搜索附近信息...'),
				t.append(u),
				r.shakes.search = u;
			var h = $('<div class="shake-result">');
			s.append(h),
				g && (r.shakes.hasShake = !0,
					h.css({
						display: 'block',
						opacity: 1,
						top: '62%'
					}));
			var c = $('<div class="shake-result-content-photo"><img src="' + l.photo + '">');
			h.append(c);
			var d = $('<div class="shake-result-content-message">');
			d.html(l.message || '用人人秀做微信活动！'),
				h.append(d),
				r.shakes.result = h,
				p.append(s),
				r.pages[e] = s;
		}
	}
	function n(e) {
		e ? (r.shakes.hasBgMusic = d.getBackgroundMusicState(),
			r.shakes.hasBgMusic && d.stopBackgroundMusic(!0)) : r.shakes.hasBgMusic && d.playBackgroundMusic();
	}
	function i(e) {
		e.autoplay = 'autoplay',
			e.currentTime = 0,
			e.paused && (d.isWeixin() === !0 && 'undefined' != typeof WeixinJSBridge ? WeixinJSBridge.invoke('getNetworkType', {}, function () {
				e.paused && e.play();
			}) : e.play());
	}
	function o() {
		r.shakes.searchMusic = new Audio,
			r.shakes.searchMusic.src = l.shakeMusic,
			r.shakes.searchMusic.preload = 'auto',
			p.append(r.shakes.searchMusic),
			r.shakes.successMusic = new Audio,
			r.shakes.successMusic.src = l.shakeSuccessMusic,
			r.shakes.successMusic.preload = 'auto',
			p.append(r.shakes.successMusic);
	}
	function u() {
		r.shakes.hasShake || (g || n(!0),
			r.shakes.shake.unbind().bind(k, h),
			d.bindEvent(r.shakes.shake, h, 'shake'));
	}
	function h() {
		if (!r.shakes.hasShake) {
			r.shakes.hasShake = !0,
				o(),
				i(r.shakes.searchMusic);
			var e = $(this);
			e.hide(),
				r.shakes.content.show(),
				r.shakes.topOpen.show(),
				r.shakes.bottomOpen.show(),
				r.shakes.topOpen.animate({
					top: '-10%'
				}, 'normal'),
				r.shakes.bottomOpen.animate({
					top: '50%'
				}, 'normal'),
				setTimeout(function () {
					r.shakes.topOpen.animate({
						top: '0'
					}, 'normal'),
						r.shakes.bottomOpen.animate({
							top: '41%'
						}, 'normal'),
						setTimeout(function () {
							e.show(),
								r.shakes.content.hide(),
								r.shakes.topOpen.hide(),
								r.shakes.bottomOpen.hide(),
								setTimeout(function () {
									r.shakes.search.show(),
										setTimeout(function () {
											c();
										}, 1e3);
								}, 200);
						}, 500);
				}, 1e3);
		}
	}
	function c() {
		i(r.shakes.successMusic),
			r.shakes.search.hide(),
			r.shakes.result.show(),
			r.shakes.result.animate({
				top: '62%',
				opacity: 1
			}, 'normal'),
			setTimeout(function () {
				n(!1),
					r.shakes.result.unbind().bind(k, function () {
						d.gotoNextPage();
					});
			}, 500);
	}
	var r = this
		, p = $(e)
		, l = s.data
		, d = s.api
		, g = (s.property,
			s.isEdit);
	r.pages = [],
	r.shakes = {
		hasShake: !1,
		content: null,
		shake: null,
		topOpen: null,
		bottomOpen: null,
		search: null,
		result: null,
		searchMusic: null,
		successMusic: null
	};
	var k = ('?host=' + window.location.host,
		'click');
	return r.init = function () {
		a();
	}
		,
		r.load = function () {
			u();
		}
		,
		r.hasShake = function () {
			return r.shakes.hasShake;
		}
		,
		r;
}
!function () {
	var e = !1
		, s = null
		, t = function () {
			function e(e) {
				return e && (t.template = e),
					new s;
			}
			function s() {
				this.domain = null,
					this.template = t.template,
					this.api = null,
					this.property = null,
					this.target = null,
					this.data = null,
					this.isEdit = !1,
					this.wsiteGuid = '',
					this.delayTimeId = null,
					this.wxqrThumb = '@!200x200',
					this.pluginCopyright = '免费制作插件→人人秀';
			}
			var t = {
				template: '<div class="plugin-shakeOpen-container"><div class="plugin-content">{{name}}</div></div>'
			};
			return s.prototype = {
				getFile: function (e, s) {
					return s = s || 'assets',
						this.domain + s + '/' + e;
				},
				replaceParams: function () {
					for (var e = arguments, s = e[0], t = 1; t < e.length; t += 2)
						s = s.replace(e[t], e[t + 1]);
					return s;
				},
				setFullScreen: function (e) {
					e ? (this.api.stopFlip(),
						this.api.getWsiteCanvas().find('div.pt-wrapper').css('z-index', 3e3),
						this.api.getWsiteCanvas().find('div.pt-progress').css('opacity', 0)) : (this.api.resetFlip(),
							this.api.getWsiteCanvas().find('div.pt-wrapper').css('z-index', 'auto'),
							this.api.getWsiteCanvas().find('div.pt-progress').css('opacity', 1));
				}
			},
			{
				get: e
			};
		}()
		, a = function () { }
		, n = function (s) {
			if (console.log('pageId-', s),
				!e) {
				var t = u.game();
				if (t.game && t.game.hasShake())
					return;
				t.plugin.setFullScreen(!0),
					t.game.load();
			}
		}
		, i = function () {
			if (!e) {
				var s = u.game();
				s.game && s.game.hasShake() && s.plugin.setFullScreen(!1);
			}
		}
		, o = function (a, n, i, o, h) {
			var c = null;
			c = t.get(),
				s = i,
				c.api = i,
				c.domain = i.getPluginDomain(a.content.token, a.content.version),
				c.property = {
					x: a.left,
					y: a.top,
					width: a.width,
					height: a.height,
					display: a.display,
					id: a.id
				},
				c.target = n,
				e = i.isEditing(),
				c.isEdit = e,
				c.isPageThumb = h,
				c.data = a.content,
				i.loadCss(c.getFile('index.css', 'css'));
			var r = template.compile(c.template)
				, p = r({
					name: c.data.name
				})
				, l = $(p);
			n.html(l),
				u.fnInit(c);
		}
		, u = function () {
			function e() {
				return i;
			}
			function s(e) {
				n = $.extend({}, n, e),
					i = new a(n),
					i.fnInit();
			}
			function t(e, s) {
				e.delayTimeId && clearTimeout(e.delayTimeId),
					e.isEdit || 'none' == e.data.noteType || (e.delayTimeId = setTimeout(function () {
						switch (e.data.noteType) {
							case 'event':
								e.api.triggerEvent(e.data.noteValue, s);
						}
					}, 1e3 * e.data.delayTime));
			}
			function a(e) {
				this.plugin = e,
					this.currents = {
						targetId: 'gameCanvas',
						target: null,
						gameTarget: null,
						assets: []
					},
					this.game = null;
			}
			var n = {}
				, i = null;
			return a.prototype = {
				fnInit: function () {
					this.fnLoad(),
						this.gameInit();
				},
				fnLoad: function () {
					this.currents.targetId = this.currents.targetId + '-' + this.plugin.property.id,
						this.currents.target = this.plugin.target.find('.plugin-content'),
						!this.currents.target || this.currents.target.length <= 0 || (this.currents.target.html(''),
							this.currents.gameTarget = $('<div>').attr({
								id: this.currents.targetId
							}),
							this.currents.target.append(this.currents.gameTarget),
							this.plugin.isEdit && this.currents.target.css('pointer-events', 'none'));
				},
				gameInit: function () {
					var e = function (e) {
						t(u.game().plugin, e);
					};
					this.game = new ShakeOpen(this.currents.gameTarget[0], this.plugin, e),
						this.game.init();
				}
			},
			{
				fnInit: s,
				game: e
			};
		}();
	window.wePluginInit = o;
	window.wePluginLoad = n;
	window.wePluginPreLoad = a;
	window.wePluginLeave = i;
}();
