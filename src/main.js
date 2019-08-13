import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Locale } from 'vant';

import VueI18n from 'vue-i18n'
import zh from './lang/zh';
import en from './lang/en';

import enUS from 'vant/lib/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';

import {RadioGroup, Radio , Divider , SwipeCell , SubmitBar , Card , Checkbox , CheckboxGroup , Image , Icon , Sku , GoodsAction, GoodsActionIcon, GoodsActionButton ,Cell, CellGroup ,Tabbar,TabbarItem,PullRefresh,Stepper,Tab,Tabs,Button, Row, Col, Swipe, SwipeItem , Lazyload ,List ,Field, NavBar } from 'vant'
Vue.use(RadioGroup).use(Radio).use(Divider).use(SwipeCell).use(SubmitBar).use(Card).use(Checkbox).use(CheckboxGroup).use(Image).use(Icon).use(Sku).use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton).use(Cell).use(CellGroup).use(Tabbar).use(TabbarItem).use(Stepper).use(PullRefresh).use(Tab).use(Tabs).use(Field).use(NavBar).use(Button).use(Row).use(Col).use(Swipe).use(SwipeItem).use(Lazyload).use(List)

Vue.config.productionTip = false

Locale.use('zh-CN', zhCN); //组件语言切换

Vue.use(VueI18n) // 通过插件的形式挂载
const i18n = new VueI18n({
  locale: 'zh-CN',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh-CN': zh,   // 中文语言包
    'en-US': en    // 英文语言包
  }
})


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
