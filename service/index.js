const Koa = require('koa')
const app = new Koa()
//引入connect
const {connect , initSchemas} = require('./database/init.js')
const mongoose = require('mongoose')
// 接收post请求
const bodyParser = require('koa-bodyparser')
app.use(bodyParser());
// 跨域
const cors = require('koa2-cors')
app.use(cors())

// 路由
const Router = require ('koa-router')
const router = new Router();

let user = require('./appApi/user.js')
let goods = require('./appApi/goods.js')

router.use('/user',user.routes())
router.use('/goods',goods.routes())
app
  .use(router.routes())
  .use(router.allowedMethods());

app.use(async(ctx)=>{
    ctx.body='<h1>laofan hello</h1>'+ctx.request.url
});

(async () =>{
    await connect()

    initSchemas()
    // const User = mongoose.model('User')
    // let oneUser = new User({userName:'jspang01',password:'123456'})
    // oneUser.save().then(()=>{
    //     console.log('插入成功')
    // })
    // let message = await User.findOne({}).exec()
    // console.log('+++++++++'+ message +'+++++++++++')

})()

app.listen(3000,()=>{
    console.log('starting at port 3000!!!')
})