import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import url from '@/serviceAPI.config.js'
import deviceData from '@/divcedata.js'

import Main from '@/views/pages/Main'
import Register from '@/views/pages/Register'
import Login from '@/views/pages/Login'

Vue.use(Router)

let router = new Router({
  routes: [
    {path:'/', redirect: '/main' , name:'Main', component:Main,
    children:[
      {path:'/', name:'ShoppingMall', component: () => import('@/views/pages/ShoppingMall')},
      {path:'CategoryList',name:'CategoryList',component: () => import('@/views/pages/CategoryList')},
      {path:'Cart',name:'Cart',component: () => import('@/views/pages/Cart')},
      {path:'goods',name:'Goods',component: () => import('@/views/pages/goods')},
      // {path:'/Member',name:'Member',component:Member},
    ]
    },
    {path:'/register',name:'Register',component:Register},
    {path:'/login',name:'login',component:Login},
    {path:'/order',name:'order',component: () => import('@/views/pages/OrderSuccess')},
    {path:'*',redirect: '/'}

  ],
  mode: 'history'
})
// 每次变换路由发送用户行为
router.beforeEach((to, from, next) => {
    deviceData.good_id= null
    if(to.name==='Goods'){
       deviceData.good_id = to.query.goodsId-0 || null
    }
    if(!from.name){
      deviceData.referer_url = document.referrer
    }else{
      deviceData.referer_url = location.origin + from.fullPath 
    }

    deviceData.access_url = location.origin + to.fullPath 
    axios({
        url:url.sendDecicedata,
        method:'post',
        data: deviceData
    })
    next()
})

export default router
