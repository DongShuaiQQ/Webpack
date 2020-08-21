/* 
此文件是是webpack的配置文件,用于指定webpack去执行那些任务
*/
let {resolve}  = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:['./src/js/index.js','./src/index.html'],//入口文件
    output:{
        path:resolve(__dirname,'dist'),//输出的路径
        filename: "./js/index.js",//输出的文件的名字
    },
    mode:'development',//配置工作的模式=>开发
    //mode:'production',//配置工作的模式  ==>生产
    //所有的Loader都要配置在module对象中的rules属性中
    //rules是一个数组,数组中的每一个对象就是一个Loader,
    //Loader的特点:下载后无需引入,只需声明
    module: {
        rules: [
            //__less-loader以下配置不完美因为没有生成单独的文件
            {
                test: /\.less$/,//匹配所有的less文件
                use: [
                   "style-loader",//用于在HTML文档中创建一个style标签,将样式塞进去
                    "css-loader",//将less编译后的css转换成为CommentJs的一个模块
                   "less-loader"//将less编译为css,但是不生成单独的css文件,在内存中.
                ],
            },
            ///使用eslint-loader解析,js语法检查
            {
                test:/\.js$/,//匹配所有js文件
                exclude:/node_modules/,//排除node_modules文件夹
                enforce:"pre",//提前加载使用
                use:{//使用eslint-loader解析
                    loader:"eslint-loader",
                },
            },
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
            //使用url-loader处理样式文件中的图片
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        //loader: 'file-loader',
                        loader:'url-loader',//url-loader比file-loader多一个图片转换base64的功能
                        options: {
                            limit:8192,//8kb--->8kb以下的图片会base64处理
                            publicPath:'images/',//决定图片的url路径
                            outputPath:'images',//决定文件本地输出路径
                            name:'[hash:5].[ext]',//修改文件的名称[hash:5] hash值的前5位,[ext] 文件的扩展名
                        },
                    }
                ]
            },
            //使用html-loader处理HTML中的标签资源
            {
                test:/\.(html)$/,
                use:{
                    loader:'html-loader'
                }
            },
            //使用file-loader 处理其他资源[字体...]
            {
                test:/\.(eot|svg|woff|woff2|ttf|mp3|mp4|avi)$/,
                loader:'file-loader',
                options: {
                    outputPath:'media',
                    name:'[hash:5].[ext]'
                }
            }
        ],
    },
    /*
    插件的使用 : 1,引入 2,实例化
    */
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",//以当期文件下为模板创建爱你新的HTML(1.结构和以前一样2,会自动引入打包资源)
        })
    ],
    //配置自动化编译
    devServer: {
        open:true,//自动打开浏览器
        contentBase: './dist',//启动gzip压缩
        port:3000,//端口号
        hot:true,//开启热模替换HMR
    },
    devtool:'cheap-module-eval-source-map',
};


