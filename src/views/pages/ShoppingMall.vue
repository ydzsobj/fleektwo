<template>
    <div>
        <!-- <div class="search-bar">
            <van-row>
                <van-col span="3">
                    <img :src="locationIcon" width="80%" class="location-icon"/>
                </van-col>
                <van-col span="16">
                    <input type="text" class="search-input" />
                </van-col>
                <van-col span="5">
                    <van-button size="mini">查找</van-button>
                </van-col>
            </van-row>
        </div> -->
        <!--swiper area-->
        <div class="swiper-area">
            <van-swipe :autoplay="1000">
                <van-swipe-item v-for="( banner ,index) in bannerPicArray" :key="index" >
                    <img v-lazy="banner.image" width="100%" @click="goGoodsPage(banner.good_id)"/>
                </van-swipe-item>
            </van-swipe>
        </div>  
        <!--type bar-->
        <div class="type-bar">
            <div v-for="(cate,index) in category" :key="index"  @click="golistPage(cate.mallCategoryId,index)">
                <img :src="cate.image_url" width="90%">
                <span>{{cate.mallCategoryName}}</span>
            </div>
        </div>  
        <!--adbanner area-->
        <!-- <div>
            <img v-lazy="adBanner" width="100%" />
        </div> -->
        <!--Recommend goods area-->
        <!-- <div class="recommend-area">
            <div class="recommend-title">
                商品推荐
            </div>
            <div class="recommend-body">
                <swiper :options="swiperOption">
                   <swiper-slide v-for="(item,index) in recommendGoods " :key="index" >
                       <div class="recommend-item">
                           <img :src="item.image" width="80%">
                           <div>{{item.goodsName}}</div>
                           <div>￥{{item.price | moneyFilter}}(￥{{item.mallPrice  | moneyFilter}})</div>
                       </div>
                   </swiper-slide> 
                </swiper>
            </div>
        </div> -->
        <floor-component v-for="(item, index) in floorData" :floorData="item.floor " :floorTitle="item.name" :key="index"></floor-component>
        <div class="hot-area">
            <div class="hot-title">{{ $t('hotgoods') }}</div>
            <div class="hot-goods">
            <!--这里需要一个list组件-->
                <van-list>
                    <van-row gutter="20">
                        <van-col span="12" v-for="(item , index) in hotGoods" :key="index">
                                <goods-info :goodsId="item.goodsId" :goodsImage="item.image" :goodsName="item.name" :goodsPrice="item.price">

                                </goods-info>
                        </van-col>
                    </van-row>
                </van-list>
            </div>
        </div>
        
       
        
    </div>
</template>

<script>
    import axios from 'axios'
    import 'swiper/dist/css/swiper.css'
    import {swiper , swiperSlide} from 'vue-awesome-swiper'
 
    import floorComponent from '../component/floorComponent'
    import { toMoney , int,num} from '@/filter/moneyFilter.js'
    import goodsInfo from '../component/goodsInfoComponent'
    import url from '@/serviceAPI.config.js'
   
    export default {
        data() {
            return {
                swiperOption:{
                    slidesPerView:3
                },
                msg: 'Shopping Mall',
                locationIcon: require('../../assets/images/location.png'),
                bannerPicArray:[],
                category:[],
                adBanner:'',
                recommendGoods:[],
                floorData:[],
                floor1:[],
                floor2:[],
                floor3:[],
                floorName:{},
                hotGoods:[],  //热卖商品
                nav_img:[require('../../assets/images/cartempty.png')]
              
            }
        },
        filters:{
            moneyFilter(money){
                return toMoney(money)
            },
            int(money){
                return int(money)
            },
            num(money){
                return num(money)
            }
        },
        components:{swiper,swiperSlide,floorComponent,goodsInfo},
        created(){
            axios({
                url:url.getShopingMallInfo,
                method:'get',
            })
            .then(response=>{
                console.log(response)
                if(response.status==200){
                    this.category=response.data.data.category;
                    // this.adBanner = response.data.data.advertesPicture.PICTURE_ADDRESS;
                    this.bannerPicArray= response.data.data.slides;
                    // this.recommendGoods = response.data.data.recommend;
                    this.floorData = response.data.data.floorData;
                    this.hotGoods = response.data.data.hotGoods;
            
                }
            })
            .catch(error=>{
                console.log(error)
            })
        },
        methods:{
            golistPage(id,index) {
                this.$router.push({name:'CategoryList',params:{categorySubId:id,index:index}})
            },
            goGoodsPage(id) {
                console.log(id)
                this.$router.push({name:'Goods',query:{goodsId:id}})
            }
        }
       
    }
</script>

<style scoped>
    .search-bar{
        height:2.2rem;
        background-color: #e5017d;
        line-height: 2.2rem;
        overflow: hidden;
    }
    .search-input{
        width:100%;
        height: 1.3rem;
        border-top:0px;
        border-left:0px;
        border-right:0px;
        border-bottom:1px solid #fff !important;
        background-color: #e5017d;
        color:#fff;
    }
    .location-icon{
        padding-top:.2rem;
        padding-left:.3rem;
    }
    .swiper-area{
        clear:both;
        max-height:15rem;
        overflow: hidden;
    }

    .type-bar{
        background-color: #fff;
        margin:0 .3rem .3rem .3rem;
        border-radius: .3rem;
        font-size:14px;
        display:flex;
        flex-direction:row;
        flex-wrap:nowrap;
    }
    .type-bar div{
        padding:.3rem;
        font-size:12px;
        text-align: center;
        flex:1;
    }
    .type-bar div span{
        display: inline-block
    }
    .type-bar div img{
        border-radius: 50%;
    }
    .recommend-area{
        background-color: #fff;
        margin-top:.3rem;
    }
    .recommend-title{
        border-bottom:1px solid #eee;
        font-size:14px;
        padding:.2rem;
        color:#e5017d;
    }
    .recommend-body{
        border-bottom:1px solid #eee;
    }
    .recommend-item{
        width:99%;
        border-right:1px solid #eee;
        font-size:12px;
        text-align: center;
    }
    .hot-area{
        text-align: center;
        font-size:14px;
        /* height: 1.8rem; */
        line-height:1.8rem;
        padding-bottom: 50px
    }
    .hot-goods{
        /* height: 130rem; */
        overflow: hidden;
        background-color: #fff;
    }
    




</style>
