const shouldMinifyFiles = true;
let shouldBuildSourceMaps = false;
const shouldPreserveTempFilesForInspection = false;


const appSourceGlobHtml = ['source/app/index.html'];
const appSourceHtmlSnippetsPath = 'source/app/html-snippets';
const appSourceGlobCss = ['source/app/**/*.scss', 'source/app/**/*.css'];
const appSourceGlobJs = ['source/app/**/*.js'];
const appSourceGlobAssets = ['source/app/images/**/*'];
const thirdPartySourceFolder = 'source/3rd-party/';
const thirdPartySourceGlobCss = [
	thirdPartySourceFolder + 'fullpagejs/**/*.css',
	// thirdPartySourceFolder + 'swiperjs/**/*.css',
];
const thirdPartySourceGlobJs = [
	thirdPartySourceFolder + 'jquery/**/*.js',
	thirdPartySourceFolder + 'fullpagejs/**/*.js',
	thirdPartySourceFolder + 'wlcCanvasAnimationController/**/*.js',
	// thirdPartySourceFolder + 'swiperjs/**/*.js',
];
const targetFolder = 'build';
const buildCacheFolder = '_temp';

const outputHtmlFileName = 'index.html';
const outputCssFileName = 'app.css';
const outputJsFileName = 'app.js';

const appSourceGlobToWatch = [
	'gulpfile.js',
	'source/**/*'
];

const htmlInjectionCouples = [{
	file: 'shake-device-to-start.html', name: 'shake-device-to-start:html'
}];
for (var index = 1; index <= 10; index++) {
	htmlInjectionCouples.push({
		file: 'ppt-'+index+'.html',
		name: 'ppt-'+index+':html'
	});
}










const gulp = require('gulp');
const runTasksInSequence = require('gulp-sequence');
const deleteFiles = require('del');
const sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
const compileSass = require('gulp-sass');
const minifyCss = require('gulp-csso');
const minifyJs = require('gulp-uglify');
const minifyHtml = require('gulp-html-minify');
const concatInto = require('gulp-concat');
const pump = require('pump');
const pathTool = require('path');



if (!shouldMinifyFiles) shouldBuildSourceMaps = false;



(function 定义针对样式的任务() {
	gulp.task('build: css: app', (onThisTaskDone) => {
		var actionsToTake = [];

		actionsToTake.push(gulp.src(appSourceGlobCss));

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.init());
		}

		actionsToTake.push(compileSass().on('error', compileSass.logError));

		if (shouldMinifyFiles) {
			actionsToTake.push(minifyCss());
		}

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.write('.'));
		}

		actionsToTake.push(gulp.dest(buildCacheFolder));

		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: css: merge', (onThisTaskDone) => {
		var actionsToTake = [
			gulp.src(thirdPartySourceGlobCss.concat([
				pathTool.join(buildCacheFolder, '**/*.css')
			]))
		];

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.init());
		}

		actionsToTake.push(concatInto(outputCssFileName));

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.write('.'));
		}

		actionsToTake.push(gulp.dest(targetFolder));

		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: css: all', (onThisTaskDone) => {
		runTasksInSequence(
			'build: css: app',
			'build: css: merge'
		)(onThisTaskDone);
	});
})();


(function 定义针对脚本的任务() {
	gulp.task('build: js: app', (onThisTaskDone) => {
		var actionsToTake = [
			gulp.src(appSourceGlobJs)
		];

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.init());
		}

		if (shouldMinifyFiles) {
			actionsToTake.push(minifyJs());
		}

		if (shouldBuildSourceMaps) {
			actionsToTake.push(sourcemaps.write('.'));
		}

		actionsToTake.push(gulp.dest(buildCacheFolder));

		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: js: merge', (onThisTaskDone) => {
		var actionsToTake = [
			gulp.src(thirdPartySourceGlobJs.concat([
				pathTool.join(buildCacheFolder, '**/*.js')
			]))
		];

		// if (shouldBuildSourceMaps) {
		// 	actionsToTake.push(sourcemaps.init());
		// }

		actionsToTake.push(concatInto(outputJsFileName));

		// if (shouldBuildSourceMaps) {
		// 	actionsToTake.push(sourcemaps.write('.'));
		// }

		actionsToTake.push(gulp.dest(targetFolder));

		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: js: all', (onThisTaskDone) => {
		runTasksInSequence(
			'build: js: app',
			'build: js: merge'
		)(onThisTaskDone);
	});
})();


(function 定义针对图片和字体的任务() {
	gulp.task('build: assets: images', (onThisTaskDone) => {
		var actionsToTake = [];
		actionsToTake.push(gulp.src(appSourceGlobAssets));
		actionsToTake.push(gulp.dest(pathTool.join(targetFolder, 'images')));
		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: assets: all', (onThisTaskDone) => {
		runTasksInSequence(
			'build: assets: images'
		)(onThisTaskDone);
	});
})();


(function 定义针对HTML的任务() {
	gulp.task('build: html: inject snippets', () => {
		var stream = gulp.src(appSourceGlobHtml.concat([
			'!source/app/html-snippets/**/*' // 我们要排除的是源文件夹的片段，而不是临时文件夹的片段
		]));

		for (var i = 0; i < htmlInjectionCouples.length; i++) {
			var injection = htmlInjectionCouples[i];
			var filePath = pathTool.join(appSourceHtmlSnippetsPath, injection.file);
			var starttag = '<!-- inject:' + injection.name + ' -->';

			stream = stream.pipe(inject(gulp.src([filePath]), {
				starttag: starttag,
				transform: changeSnippetContentAsNeeded,
				removeTags: true,
				quiet: true
			}));
		}

		return stream.pipe(gulp.dest(buildCacheFolder));


		function changeSnippetContentAsNeeded(/* fullPathName, snippetFile, index, count, targetFile */) {
			var changedString = replaceSrcAndHrefStrings.apply(null, arguments);
			return changedString;

			function replaceSrcAndHrefStrings(fullPathName, snippetFile, index, count, targetFile) {
				var snippetString = snippetFile.contents ? snippetFile.contents.toString('utf8') : '';
				var fileRelativePathName = targetFile.path.slice(targetFile.base.length);
				var _slashPos = fileRelativePathName.search(/\/|\\/);
				if (_slashPos < 0) {
					// console.log('An HTML file at root folder is met:');
					snippetString = snippetString.replace(/\=\s*\"\.\.\//g, '=\"');
				}
				return snippetString;
			}
		}
	});

	gulp.task('build: html: merge', (onThisTaskDone) => {
		var actionsToTake = [];
		actionsToTake.push(gulp.src([
			pathTool.join(buildCacheFolder, '*.html')
		]));
		actionsToTake.push(concatInto(outputHtmlFileName));
		actionsToTake.push(gulp.dest(buildCacheFolder));
		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: html: minify', (onThisTaskDone) => {
		var actionsToTake = [];
		actionsToTake.push(gulp.src([
			pathTool.join(buildCacheFolder, '*.html')
		]));
		if (shouldMinifyFiles) {
			actionsToTake.push(minifyHtml({
				removeComments: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: false,
				removeRedundantAttributes: true,
				removeEmptyAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				// removeOptionalTags: true
			}));
		}
		actionsToTake.push(gulp.dest(targetFolder));
		pump(actionsToTake, onThisTaskDone);
	});

	gulp.task('build: html: all', (onThisTaskDone) => {
		runTasksInSequence(
			'build: html: inject snippets',
			'build: html: merge',
			'build: html: minify'
		)(onThisTaskDone);
	});
})();


(function 定义二级公共任务() {
	gulp.task('clear old build', () => {
		return deleteFiles(pathTool.join(targetFolder, '/**/*'));
	});

	gulp.task('clear build cache', (onThisTaskDone) => {
		setTimeout(()=> {
			deleteFiles(buildCacheFolder);
			onThisTaskDone();
		}, 2222);
	});

	gulp.task('build: all', (onThisTaskDone) => {
		var tasksToRun = [
			'clear old build',
			[
				'build: css: all',
				'build: js: all',
				'build: assets: all',
				'build: html: all'
			]
		];

		if (!shouldPreserveTempFilesForInspection) {
			tasksToRun.push('clear build cache');
		}

		runTasksInSequence.apply(null, tasksToRun)(onThisTaskDone);
	});

	gulp.task('watch', [], () => {
		return gulp.watch(appSourceGlobToWatch, ['build: all']);
	});
})();


(function 定义所谓顶级任务() {
	gulp.task('default', (onThisTaskDone) => {
		runTasksInSequence('build: all', 'watch')(onThisTaskDone);
	});

	gulp.task('test', () => {
		// nothing yet
	});
})();