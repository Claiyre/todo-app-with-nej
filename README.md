# todo-app-with-nej
A todo web application with nej

### 技术栈

- 前端： nej
- 后端：Nodejs + express + MongoDB

### 启动方法

1. 本地启动
    - 安装MongoDB，Node
    - 在27017端口（默认）启动MongoDB
    - 在项目目录下依次执行 `npm install` 和`npm run test`
    - 访问 http://localhost:3000/ 即可看到
2. 线上访问

    已将这个项目放到一个服务器上，可访问 http://10.170.61.46:3000 查看

### 目录结构
```
|- routes   路由、接口相关
|- views    ejs模板
|- webapp   前端静态文件css, js等
|--------|- assets
         |- css
         |- js
         |- nej
         |----|- pro 项目的js文件
              |- nej NEJ的源文件
|-db        封装的数据路连接、操作等函数
|-app.js    启动服务
|-README.md 
|-... 一些配置文件

```