const gulp = require('gulp'),
    {COMPILE, SRC, CONFIG} = require('./gulp.config.js'),
    sass = require('gulp-sass'),// 解析scss文件
    htmlmin = require('gulp-htmlmin'),// 压缩html文件
    concat = require('gulp-concat'),// 合并文件
    uglify = require('gulp-uglify'),// 压缩js文件
    babel = require('gulp-babel'),// es6语法转换es5
    imagemin = require('gulp-imagemin'),// 压缩图片
    autoprefixer = require('gulp-autoprefixer'),// 为css添加前缀
    clean_css = require('gulp-clean-css'),// 压缩css
    changed = require('gulp-changed'),// 仅传递更改过的文件
    gulpif = require('gulp-if'),// 添加条件判断
    file_include = require('gulp-file-include'),// 分离公共部分模板
    inject = require('gulp-inject'),// 文件注入
    sourcemap = require('gulp-sourcemaps'),// 发布后调试
    del = require('del'),// 删除文件
    sequence = require('gulp-sequence'),// 顺序执行任务
    order = require('gulp-order'),// 按照order属性进行文件执行
    gulpWatch = require('gulp-watch');// 实时监测执行

// 清空compile
gulp.task('clean:compile', () => 
    del([COMPILE])
);
// 压缩合并css文件
gulp.task('compile:sass', () => 
     gulp.src(CONFIG.src.style)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(order(CONFIG.src.orderStyle, { base: './' }))
        .pipe(concat('index.css'))
        .pipe(gulp.dest(COMPILE))
);

// 压缩html文件
gulp.task('compile:min-html', () => 
     gulp.src(CONFIG.src.html)
        .pipe(gulpif(CONFIG.src.noIndex, htmlmin()))
        .pipe(gulp.dest(COMPILE))
);

// 压缩js文件，并将es6语法转换为es5
gulp.task('compile:uglify-script', () => 
    gulp.src(CONFIG.src.script)
        .pipe(gulpif(CONFIG.src.noVendor, sourcemap.init()))
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(gulpif(CONFIG.src.noVendor, uglify()))
        .pipe(sourcemap.write('sourcemap'))
        .pipe(gulp.dest(COMPILE))
);

// 将插件复制到compile中
gulp.task('compile:vendor', () => 
     gulp.src(CONFIG.src.vendor)
        .pipe(gulp.dest(COMPILE))
)

// 复制index.html到compile
gulp.task('compile:index', () => 
    gulp.src(CONFIG.src.index)
        .pipe(gulp.dest(COMPILE))
);

// 复制静态文件到compile
gulp.task('compile:static', () =>
    gulp.src(CONFIG.src.static)
        .pipe(gulp.dest(COMPILE))
);

// index.html注入css文件
gulp.task('compile:inject-style', () => 
    gulp.src(CONFIG.compile.index)
        .pipe(inject(gulp.src([CONFIG.compile.finalStyle], {read: false})))
        .pipe(gulp.dest(COMPILE))
);

// index.html中注入js文件
gulp.task('compile:inject-script', () => 
     gulp.src(CONFIG.compile.index)
        .pipe(inject(gulp.src([CONFIG.compile.script], {read: false}).pipe(order([CONFIG.compile.vendor, CONFIG.compile.noVendor], { base: './' }))))        
        .pipe(gulp.dest('compile'))
);
// 编译任务集合
gulp.task('compile', () => sequence('clean:compile', ['compile:sass', 'compile:uglify-script'], 
                            ['compile:vendor',  'compile:static'], 'compile:inject-style', 'compile:inject-script')());
// 实时编译
gulp.task('watch',() => 
    gulpWatch('src/**/*')
        .on('add', () => gulp.start(['compile']))
        .on('change', () => gulp.start(['compile']))
)

// 默认命令
gulp.task('default',sequence('compile','watch'));
