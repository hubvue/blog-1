const { Koa } = require('./koa/index.js');


const app = new Koa();

let readfile = function () {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('读取文件完毕')
            resolve('file content......')
        }, 3000);
    })
}
let checkLogin = function () {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('校验登陆完毕')
            resolve(true)
        }, 1000);
    })
}
let action1 = async (ctx, next) => {
    console.log(1);
    let isLogin = await checkLogin();
    if (isLogin) {
        let fileContent = await next();
        console.log(4)
        ctx.status = 200;
        ctx.body = fileContent;
    } else {
        ctx.status = 401;
        ctx.body = 'Please Login~~~';
    }
}


let action2 = async (ctx, next) => {
    console.log(3);
    return readfile();
}

let action3 = (ctx, next) => {
    console.log(5)
    ctx.body = "Hello World!"
}


// 使用Koa
app.use(action1);
app.use(action2);
app.listen(3001);

