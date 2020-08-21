# Webpack的配置文件

目的:   在项目根目录定义配置文件,通过自定义配置文件,还原以上功能

##### 文件名称:    webpack.config.js <src的同级目录下>

##### 文件 的内容

````js
/* 
此文件是是webpack的配置文件,用于指定webpack去执行那些任务
*/
let {resolve}  = require('path');

module.exports = {
    entry:'./src/js/index.js',//入口文件
    output:{
        path:resolve(__dirname,'dist/js'),//输出的路径
        filename: "index.js",//输出的文件的名字
    },
    mode:'production',//配置工作的模式
}
````

#### 运行指令 : webpack

----------

--------

### 5__打包less资源

##### 概述: less文件webpack不能解析,需要借助loader编译解析

##### 创建less文件

=>src/less/test_1.less

=>src/less/test_2.less

##### 入口文件index.js:

​    引入less资源

##### 安装loader

=>     cnpm install css-loader style-loader less-loader less --save-dev

##### 配置loader

````js
		//__less-loader以下配置不完美因为没有生成单独的文件
            {
                test: /\.less$/,//匹配所有的less文件
                use: [//数组中的loader执行时从上到下 从右到左执行的
                   "style-loader",//用于在HTML文档中创建一个style标签,将样式塞进去
                    "css-loader",//将less编译后的css转换成为CommentJs的一个模块
                   "less-loader"//将less编译为css,但是不生成单独的css文件,在内存中.
                ],
            },
````

##### 运行指令 :   webpack



^

------

#### 6__js语法检查

##### 概述: 对js基本语法错误/隐患,进行提前检查

##### 安装loader:

cnpm install eslint-loader eslint --save-dev

##### =>备注1: 在eslint.org网站中=>userGuide=>Configuring ESLint 查看如何配置

##### =>备注2: 在eslint.org网站中=>userGuide=>Rules 查看所有规则

##### 配置loader:

```js
			///使用eslint-loader解析,js语法检查
            {
                test:/\.js$/,//匹配所有js文件
                exclude:/node_modules/,//排除node_modules文件夹
                enforce:"pre",//提前加载使用
                use:{//使用eslint-loader解析
                    loader:"eslint-loader",
                },
            },
```

##### 修改package.json(需要删除注释才能生效)

```js
 "eslintConfig": {
    "parserOptions": {
      "ecmaVersion": 6,//支持ES6
      "sourceType": "module"//使用ES6模块化
    },
    "env": {//设置环境
      "browser": true,//支持浏览器环境,能够使用windows上的全局变量
      "node": true//支持服务器环境,能够使用node上global的全局变量
    },
    "globals": {//声明使用全局变量,这样即使没有定义也不会报错了
      "$": "readonly",//$ 只读变量
      "Promise": "readonly"
    },
    "rules": {//eslint检查规则 0 忽略   1 警告   2 错误
      "no-console": 0,//不检查console
      "eqeqeq": 0,//不用===而用== 就会报错
      "no-alert": 0//不能使用alert
    },
    "extends": "eslint:recommended"//使用eslint推荐的默认规则https://cn.eslint.org/docs/rules
  },

```

##### 运行指令:  webpack

^

-----

#### 7__js语法转换

##### 概述: 将不浏览器不能识别的新语法转换成原来识别的旧语法,做浏览器兼容性处理

##### 安装loader

==>cnpm install babel-loader @babel/core @bable/preset-env --save-dev

##### 配置loader

````js
            //js兼容性处理(语法转换)
            {
                test: /\.js$/, //值检测js文件
                exclude: /(node_modules)/,//除了node_module文件夹
                use: {
                    loader: 'babel-loader',
                    options: {
                        //预设： 只是babel做怎么样的兼容性处理
                        presets: [
                            '@babel/preset-env',
                        ],
                    }
                }
            },
````

##### 运行指令:   webpack

^

___

### 8___js兼容性处理

#### 第一种方法:使用经典的polyfil

##### 安装包:    cnpm install @babel/polyfill

##### 使用:   [入口文件中导入]index.js

````js
import '@babel/polyfill';//包含ES6的高级语法
````

##### 优点:解决babel只能转换部分低级语法的问题(如:let/const/结构赋值..),引入polyfill可接解决高级语法(如:Promise)

##### 缺点:将所有的高级语法都进行了转换,但实际上可能只是用一部分

##### 解决: 需要按需加载(使用什么高级语法就转换什么)

#### 第二种方法: 借助按需引入core-js按需引入

##### 安装包;===>   cnpm install core-js

##### 配置loader

````js
			//js兼容性处理(语法转换)
            {
                test: /\.js$/, //值检测js文件
                exclude: /(node_modules)/,//除了node_module文件夹
                use: {
                    loader: 'babel-loader',
                    options: {
                        //预设： 只是babel做怎么样的兼容性处理
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',//按需加载和全部加载不能同时进行
                                    corejs: {//指定core-js版本
                                        version: 3
                                    },
                                    targets: {//指定兼容性做到那个版本的浏览器
                                        chrome: '60', //兼容版本大于60的chrome浏览器
                                        firefox: '60',
                                        ie: '9',
                                        safari: '10',
                                        edge: '17'
                                    }
                                }
                            ]
                        ],
                        cacheDirectory:true,//开启babel缓存
                    }
                }
            },
````

##### 运行指令 : webpack

^

----

### 9__url-loader打包样式文件中的图片资源

##### 概述:

==>图片问阿金webpack不能解析,需要借助loader编译解析

##### 添加2张图片:

=>小于8kb : src/imges/test1.png

=>大于8kb: src/imges/test2.pug

在less文件中通过背景图片的方式引入图片

##### 安装loader:

=>cnpm install file-loader url-loader --save-dev

##### ==补充:url-loader是对象file-loader的上层封装,使用时需配合file-loader使用

##### 配置loader

````js
/* 
此文件是是webpack的配置文件,用于指定webpack去执行那些任务
*/
let {resolve}  = require('path')

module.exports = {
    entry:'./src/js/index.js',//入口文件
    output:{
        path:resolve(__dirname,'dist'),//输出的路径
        filename: "./js/index.js",//输出的文件的名字
    },
    mode:'development',//配置工作的模式
    //所有的Loader都要配置在module对象中的rules属性中
    //rules是一个数组,数组中的每一个对象就是一个Loader,
    //Loader的特点:下载后无需引入,只需声明
    module: {
        rules: [
            //使用url-loader处理样式文件中的图片,url-loader比file-loader多一个图片转换base64的功能
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit:8192,//8kb--->8kb以下的图片会base64处理
                            publicPath:'../dist/images',//决定图片的url路径
                            outputPath:'images',//决定文件本地输出路径
                            name:'[hash:5].[ext]',//修改文件的名称[hash:5] hash值的前5位,[ext] 文件的扩展名
                        },
                    }
                ]
            }
        ],
};
````

^                        

------

#### 10__打包HTML文件

##### 概述:

==>html问阿金webpack不能解析,需要借助插件编译解析

##### 添加html文件

==>src/index.html

==>注意:  不要在HTML中引入任何css 和 js文件

##### 安装插件Plugins

==>cnpm install html-webpack-plugin --save-dev

##### 在webpack.config.js中引入插件(插件都需要手动引入,而loader会自动加载)

=>const HTMLWebpackPlugin = require('html-webpack-plugin');

##### 配置插件

````js

/* 
此文件是是webpack的配置文件,用于指定webpack去执行那些任务
*/
let {resolve}  = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:'./src/js/index.js',//入口文件
    output:{
        path:resolve(__dirname,'dist'),
        filename: "./js/index.js",
    },
    mode:'development',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader:'url-loader',
                        options: {
                            limit:8192,
                            publicPath:'../dist/images',
                            outputPath:'images',
                            name:'[hash:5].[ext]',
                        },
                    }
                ]
            },
        ],
    },
    //===============插件的配置===============
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",//以当期文件下为模板创建爱你新的HTML(1.结构和以前一样2,会自动引入打包资源)
        })
    ]
};



````

##### 运行指令webpack

^

-----

#### 11__打包HTML中图片的资源

##### 概述:

==>html中的图片url-loader没法处理,它只能处理js中引入的样式中的图片/图片,不能处理html标签,需要引入其他html-loader处理

##### 添加图片:

==>在src/index.html添加 img标签

##### 安装loader

=>cnpm install html-loader --save-dev

##### 配置loader

````js
//使用html-loader处理HTML中的标签资源
{
	test:/\.(html)$/,
	use:{
		loader:'html-loader'
	}
}
````

##### 运行指令  :  webpack

^

-----

### 12__打包其他资源

##### 概述: 其他资源webpack不能解析,需要借助loader编译解析

##### 添加字体文件

=>src/media/iconfont/eot

=>src/media/iconfont/svg

=>src/media/iconfont/ttf

=>src/media/iconfont/woff

=>src/media/iconfont/woff2

##### 修改样式

````less
//在src/css/iconfont.less文件
@font-face {font-family: "iconfont";
  src: url('../font/iconfont.eot?t=1597930280067'); /* IE9 */
  src: url('../font/iconfont.eot?t=1597930280067#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAVMAAsAAAAACiwAAAT+AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDFAqHaIYwATYCJAMQCwoABCAFhG0HTRufCMgOJcHAwAAAoFBACNFaZm7ngQqkQBGoenasUFVV1YhqYF9lq0Q9G/FDuGkXpBI2x7f/T1WgM6kb7eZYQqmFhbx4ujn991TNkTeR/zlmunw+sPyrdMkKHO0NsAJoQNt10FEk2J3e6QHaDWMXl3E3gbZpnqDd0OhkYCNpBwXiWqtRAJuYVZbgQtNQzzkzQTwDtmb1gLEKgCf39+MfSMMGqNQK0I48vgpRA/+v2M+uMan/KXDFRgBZf24w51GwAkjiMtd7gelnVzC1JX6WNUBddlZfcZ9d+/9/APqUuFbmKZv/P16lEHWgabsQu24u9kpmsgi+4sTQ5+satCoQnfs30Sb2AIg3gJ1sqUnR2uVsfB4/xmfX1Yy6MWrUMJ4zIVuwOFSbQ2eNSJVJARu4ySn5MGw0JgOOTsBQxc5xjiyV07f1EIATIn2o2XypWQmeXy4oKMCulkMl6IlanOrqmpqcJo3KhhGPlgqouETQUOeU18SrGxjpOCQoEAhKxOIc19QwEC3rMLvz84tJq8kkM/rSsKEetg07m41Cmksb12sUFlaJamGzOSP3KLdyisfLKxLSNdp6Xbl0IaDK6DULB/n5/OblI4NGEVXIpXudzZDFkroAcW9iL2Q2P03xG+l8AZTj3rDg0jBhgY8a2JOS71jr6DhvCM7n55sdjZJJQJnGlpzqnBoP09xa2DAsLh7m8w10Xt5wqibzgUVDfbkCgYyi+WYzlJPaY4my5MqWTBLT+YlKv2N6qXg8PjyczYb6eLfU5C/fXZimRdcr3C0Pgi5ehIIm5XL/SjllI6OSXtD+XhIls6Hklf5y+SQUdPGiCurmu4DsoZfqzpx6MvlOWIFSgjNUUPntTb8YPPVfOuAViJnNgx/b4Zc8UvTqL050cmXyQZFoD5vH5BwNuPFTYNsHfrcYgQ13/po56+qsczNMQM+BkOubbFvR0NcFn/gzvQLjzsecLk6+c/zuWmmUQi1oUX+gAzu6e/EPqcS/O6ibs685dH9r7p6DjvusBAHQx73/2a+9P30w4PBegazYGQg3Q5jVb7xRHTTG+uefHMMiW2wpwy/jTFCvNX951/Onb22fPvnldnv5RIwwWhL2gUzk/+vXQxVXsvXXBua/DBSxhAHBW2ESQVTsS/mWbXVK3xZjHzfcUiXoqtp9+7jGTzL38tUr2KkCl6lpkNT+9qe7ns1fvPbUaWw7IcELO/2LofLyVNtRH9DRWssNE9CfLHrWH4C+0dVBL2mP20efuXF975lfbTgPZ+ZTXeqCIv3JBPVrNFUwsr9QVrMnZYVmyxSVplSpTe+AzYs1a+sJ+kALjnivD/14ba1fXD8eQqVhCoqmGWRiV6CmYx3qmjagbVnY+R2jCEyRtoAldwCEIR1QGfABxZA1ZGLfhZoJ30LdUDCh7SQOXrFjLrRwEIEqSFSNKJ9EtCo8GzMcJOw1JqKaRzMVRFTh4lNQQq9NIBJv32QhDM1GiT6O0T+mkZIkhmAEnoWEgvuhmZk4oiPwdFRFeqeRpO6Ujw+W90zeKjwLwHYQUAoklBpC6UkILRVcNsweTIJTP58IpfGoTApESVdJOAWKoKddHyHhzbcGMkybXavrXLbrPUZDikTC8H4YAi4LIhS6UZl6FofQ5e+WDqVC8pbWIq1zig/qh9XVeo+vz7rCK9Cm7ZTBgJgQC2KD1r7HvEhUf1ZSv0dCPVIAAAAA') format('woff2'),
  url('../font/iconfont.woff?t=1597930280067') format('woff'),
  url('../font/iconfont.ttf?t=1597930280067') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('../font/iconfont.svg?t=1597930280067#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-icon-test:before {
  content: "\e64e";
}

.icon-icon-test1:before {
  content: "\e64f";
}

.icon-icon-test2:before {
  content: "\e65e";
}


````

##### 并且在src/js/index.js  入口文件内引入iconfont.less ==>import '../css/iconfont.less'

##### 运行指令: webpack

^^

------

### 13__自动编译打包运行

##### 安装loader:

==>cnpm install webpack-dev-server --save-dev

##### 详细配置官网: 指南->开发环境->使用webpack-dev-server

##### 修改webpack配置对象(注意不是loader)

```js
//配置自动化编译
    devServer: {
        open:true,//自动打开浏览器
        contentBase: './dist',//启动gzip压缩
        port:5000
    },
```

##### 在package.json中

````json
"scripts": {
    "start": "webpack-dev-server"
  },
````

##### 修改url-loader部分配置

因为构建工具以服务器跟目录作为起点,无需再找build

```js
publicPath:'../build/images/'  ===>   publicPath:'images/'
```

##### 运行指令: = > npm run start

##### 	注意webpack-dev-server 指令才能启动devServer配置,然后配置到package.json中才行

^

---

### 14_热模替换功能

##### 概述:热模替换(HMR)是webpack提供的最有用的功能之一,它允许在运行时更新所有类型的模块,无需完全刷新(只更新变化的模块)

##### 详细配置见官网:指南==>模块热替换

##### 修改devServer配置

````js
//配置自动化编译
    devServer: {
        open:true,//自动打开浏览器
        contentBase: './dist',//启动gzip压缩
        port:3000,//端口号
        hot:true  //开启热模替换功能HMR
    },
````

##### 并且在webpack.config.js中修改入口文件==>问题是HTML文法自动更新,需要增加一个入口为HTML的地址

```js
/* 
此文件是是webpack的配置文件,用于指定webpack去执行那些任务
*/
let {resolve}  = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    //问题是HTML文法自动更新,需要增加一个入口
    entry:['./src/js/index.js','./src/index.html'],
    output:{
        path:resolve(__dirname,'dist'),
        filename: "./js/index.js",
    },
    mode:'development',
    module: {
            {
                test:/\.(html)$/,
                use:{
                    loader:'html-loader'
                }
            },
 
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
        })
    ],
    devServer: {
        open:true,
        contentBase: './dist',
        port:3000,
        hot:true,
    },
};



```

##### 代码执行  :   npm run start

^

----

### 15___devtool

##### 概述:一种将压缩/编译文件中的代码映射回源文件中的原始位置的技术,让我们调试代码不在困难

##### 详细配置见官网:  配置 ==> devtool

##### 介绍:

==>cheap只保留行,编译速度快

==>eval webpack生成的代码(每个模块彼此分开,并使用模块名进行注释),编译速度快

==>inline 以base64方式将source-map嵌入到代码中,缺点造成编译后代码体积很大

##### 推荐使用:

=>开发环境 :  cheap-module-eval-source-map   ======   mode:'development',//配置工作的模式  -->开发

=>生产环境 :  cheap-module-source-map           ======   mode:'production',//配置工作的模式  -->生产

> ##### 以上就是webpack开发环境的配置,可以在内存中自动打包所有类型文件并有自动编译运行,热更新等功能
>
> ##### 举例代表作用: 如果代码出现错误,则会报错在编译压缩后的文件中,使用了devtool以后,则会在源文件中报错

^

-----









