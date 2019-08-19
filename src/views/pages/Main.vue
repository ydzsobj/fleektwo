<template>
    <div>
        <div class="main-div">
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
        <van-tabbar class="left50" v-model="active" @change="changeTabbar(active)">
            <van-tabbar-item icon="shop">{{ $t('home') }}</van-tabbar-item>
            <van-tabbar-item icon="records">{{ $t('list') }}</van-tabbar-item>
            <van-tabbar-item icon="cart" :info="cartNum">{{ $t('shopCart') }}</van-tabbar-item>
            <!-- <van-tabbar-item icon="contact">会员中心</van-tabbar-item> -->
        </van-tabbar>
    </div>
</template>

<script>
    import axios from 'axios'
    import checkoutLang from '@/lang.js'
    import url from '@/serviceAPI.config.js'
    import {Toast} from 'vant'
    export default {
       data() {
           return {
               active: 0,
               nowPath:'',  //当前路径
               cartNum: ''
           }
       }, 
        watch: {
            '$route' () {
               this.cartNumFun()
            }
        },
       created(){
           this.changeTabBarActive()
           this.getlang()
            this.cartNumFun()
       },
       updated(){
           this.changeTabBarActive()
       },
       methods: {
            getlang() {
                axios({
                    url:url.getLang,
                    method:'get',
                    params:{}
                })
                .then(response=>{
                    if(response.status== 200 && response.data.data){
                      this.$i18n.locale= response.data.data.config.lang
                      checkoutLang('en-US')
                    }else{
                        Toast(this.$t('serveError'))
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
            },
           changeTabBarActive(){
               this.nowPath = this.$route.name
               if(this.nowPath=='Cart'){
                   this.active=2
               }else if(this.nowPath=='ShoppingMall'){
                   this.active=0
               }else if(this.nowPath=='CategoryList'){
                   this.active=1
               }else if(this.nowPath=='Member'){
                   this.active=3
               }
           },
           changeTabbar(active) {
               console.log(active)
               switch(active){
                   case 0:
                        this.$router.push({name:'ShoppingMall'})
                        break;
                   case 1:
                        this.$router.push({name:'CategoryList'})
                        break;
                   case 2:
                        this.$router.push({name:'Cart'})
                        break;
                    case 3:
                        this.$router.push({name:'Member'})
                        break;

                
               }
           },
           cartNumFun() {
                this.cartNum = localStorage.cartInfo ? (JSON.parse(localStorage.cartInfo).length===0?'':JSON.parse(localStorage.cartInfo).length) : ''
           }
       }
    }
</script>

<style scoped>

</style>