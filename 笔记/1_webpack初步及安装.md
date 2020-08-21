# webpack初步

### 构建工具 项目构建

#### 源代码 : 程序员写的没有经过任何加工的代码

##### src <文件夹>:  = >源代码-------写好的代码没有经过加工的代码

##### dist<文件夹>:  = >加工之后的代码 --- 经过层层加工处理的代码 

构建: = > 将程序写的源代码,经过编译,压缩,语法检查,兼容处理,生成浏览器可以高效的,稳定运行的代码

### 什么是webpack?

=>webpack是一个模块打包器(bundle);

=>在webpack看来,前端的所有资源文件(js/json/css/img/less)都会作为,模块处理

=>他根据模块的依赖程度关系进行静态分析,生成对应的静态资源

### webpack的五个核心的概念:

=>Entry : 入口起点(entry point)指示webpack应该使用哪个模块,来作为构建其内部依赖图的开始

=>Outout : output属性告诉webpack在哪里输出它所创建的bundles,以及如何命名这些文件,默认值为./dist

=>Loader : loader让webpack能够去处理那些非javascript/json文件(webpack自身只能解析javascript/json)

=>Pugins : 插件则可以用于执行范围更广的任务,插件的范围包括=>>>从打包_优化和压缩,一直到重新定义环境中的变量等

=>Mode : 模式 ;生产模式<production>和开发者模式<development>

## 开启项目

#### 初始化项目:

##### 生成package.json文件

webpack init

````json
{
"name":"kobe",
"version":"1.1.0"
}
````



##### 安装webpack

=>cnpm install webpack webpack-cli -g //====全局安装,作为指令使用

=>cnpm install webpack webpack-cli -D //====本地安装,作为本地依赖使用

#### 编译打包应用

1=>创建js文件

	>>src/js/app.js
	>>
	>>src/js/module1.js
	>>
	>>src/js/module2.js
	>>
	>>src/js/module3.js

2=>创建json文件

> >src/json/data.json

3=>创建主页面

> >src/index.html

4=>运行指令

====>开发配置指令: webpack src/js/index.js -o dist/js/index.js --mode=development

​			功能:webpack能够编译打包js和json文件,并且能将es6的模块化语法转换成浏览器能识别的语法

====>生产配置指令:webpack src/js/index.js -o dist/js/index.js --mode=development --mode=production

​			功能:在开发配置上加上一个压缩代码

#### 结论:

=>>webpack能够编译打包js和json文件

=>>能够将es6的模块化语法转换成浏览器能够识别的语法

=>>能压缩代码

#### 缺点:

=>>不能编译打包css,img等文件

=>>不能讲js的es6语法转换为es5以下的语法

#### 改善:使用webpack配置文件解决,自定义功能



