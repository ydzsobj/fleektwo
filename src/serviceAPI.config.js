// const BASEURL = "https://www.easy-mock.com/mock/5ae2eeb23fbbf24d8cd7f0b6/SmileVue/"

if(process.env.NODE_ENV === 'development'){
    var LOCALURL =  "http://192.168.1.132:8081/"
}else if(process.env.NODE_ENV === 'test'){
    var LOCALURL =  "www.website-shop.cc/"
}else{
    var LOCALURL =  "http://shop.fleekfly.xyz/"
}
console.log(process.env.NODE_ENV)
const URL ={
    getShopingMallInfo : LOCALURL+'api/user/index',    //商城首页所有信息
    // getGoodsInfo : BASEURL+'getGoodsInfo', 
    registerUser : LOCALURL+'user/register',  //用户注册接口
    login : LOCALURL+'user/login',  //用户登录接口

    getDetailGoodsInfo : LOCALURL+'api/user/goods',  //获取商品详情
    getLang : LOCALURL+'api/user/configs',  //获取语言

    getCateGoryList : LOCALURL+'api/user/good_categories',  //得到大类信息
    getCateGorySubList : LOCALURL+'goods/getCategorySubList',  //得到小类信息
    getGoodsListByCategorySubID : LOCALURL+'api/user/goods',  //得到小类商品信息
    sendOrderInfo: LOCALURL+'api/user/good_orders'
}

module.exports = URL
