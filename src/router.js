import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/views/pages/Main'
import Register from '@/views/pages/Register'
import Login from '@/views/pages/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/', redirect: '/main' , name:'Main', component:Main,
    children:[
      {path:'/', name:'ShoppingMall', component: () => import('@/views/pages/ShoppingMall')},
      {path:'CategoryList',name:'CategoryList',component: () => import('@/views/pages/CategoryList')},
      {path:'Cart',name:'Cart',component: () => import('@/views/pages/Cart')},
      // {path:'/Member',name:'Member',component:Member},
    ]
    },
    {path:'/register',name:'Register',component:Register},
    {path:'/login',name:'login',component:Login},
    {path:'/goods',name:'Goods',component: () => import('@/views/pages/goods')},
    {path:'/order',name:'order',component: () => import('@/views/pages/OrderSuccess')}

  ]
})
