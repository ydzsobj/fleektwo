const BASEURL = "https://www.easy-mock.com/mock/5ae2eeb23fbbf24d8cd7f0b6/SmileVue/"
const LOCALURL =  "http://shop.fleekfly.xyz/"
// const LOCALURL =  "http://192.168.1.132:8081/"
const URL ={
    getShopingMallInfo : LOCALURL+'api/user/index',    //商城首页所有信息
    getGoodsInfo : BASEURL+'getGoodsInfo', 
    registerUser : LOCALURL+'user/register',  //用户注册接口
    login : LOCALURL+'user/login',  //用户登录接口

    getDetailGoodsInfo : LOCALURL+'api/user/goods',  //获取商品详情

    getCateGoryList : LOCALURL+'api/user/good_categories',  //得到大类信息
    getCateGorySubList : LOCALURL+'goods/getCategorySubList',  //得到小类信息
    getGoodsListByCategorySubID : LOCALURL+'api/user/goods',  //得到小类商品信息
    sendOrderInfo: LOCALURL+'api/user/good_orders'
}

module.exports = URL
