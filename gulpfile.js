const gulp = require('gulp'),
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
    del = require('del'),
    sequence = require('gulp-sequence'),
    order = require('gulp-order');

// 清空compile
gulp.task('clean:compile', () => 
    del(['compile'])
);
// 压缩合并css文件
gulp.task('compile:sass', () => 
     gulp.src('src/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(order([
            'src/**/reset.css',
            'src/**/base.css',
            'src/**/*.css'
        ], { base: './' }))
        .pipe(concat('index.css'))
        .pipe(gulp.dest('compile'))
);

// 压缩html文件
gulp.task('compile:min-html', () => 
     gulp.src('src/**/*.html')
        .pipe(htmlmin())
        .pipe(gulp.dest('compile'))
);

// 压缩js文件，并将es6语法转换为es5
gulp.task('compile:uglify-script', () => 
    gulp.src(['src/**/*.js', '!src/vendor/**/*.js'])
        .pipe(sourcemap.init())
        .pipe(babel({
            presets:['es2015']
        }))
        .pipe(uglify())
        .pipe(sourcemap.write('sourcemap'))
        .pipe(gulp.dest('compile'))
);

// 将插件复制到compile中
gulp.task('compile:vendor', () => 
     gulp.src('src/vendor/**/*.js')
        .pipe(gulp.dest('compile/vendor'))
)

// 复制index.html到compile
gulp.task('compile:index', () => 
    gulp.src('src/index.html')
        .pipe(gulp.dest('compile'))
);

// 复制静态文件到compile
gulp.task('compile:static', () =>
    gulp.src(['src/**/*.html', 'src/images/**/*'])
        .pipe(gulp.dest('compile'))
);

// index.html注入css文件
gulp.task('compile:inject-style', () => 
    gulp.src('compile/index.html')
        .pipe(inject(gulp.src(['compile/index.css'], {read: false})))
        .pipe(gulp.dest('compile'))
);

// index.html中注入js文件
gulp.task('compile:inject-script', () => 
     gulp.src('compile/index.html')
        .pipe(inject(gulp.src(['compile/**/*.js'], {read: false}).pipe(order(['compile/vendor/**/*.js', '!compile/vendor/**/*.js'], { base: './' }))))        
        .pipe(gulp.dest('compile'))
);
// 编译任务集合
gulp.task('compile', sequence('clean:compile',['compile:sass', 'compile:uglify-script'], 
                            ['compile:vendor',  'compile:static'], 'compile:inject-style', 'compile:inject-script'));
