<template>
    <div style="background-color: #fff;">
        <top-nav :keywordsVal="keywords"></top-nav>
        <van-search placeholder="请输入搜索关键词" v-model="value" shape="round" @search="onSearch" class='search left50'/>
        <!--swiper area-->
        <div class="swiper-area">
            <van-swipe :autoplay="1000" @change="onChange">
                <van-swipe-item v-for="( banner ,index) in bannerPicArray" :key="index" >
                    <img v-lazy="banner.image" width="100%" @click="goGoodsPage(banner.good_id)"/>
                </van-swipe-item>
                <div class="custom-indicator" slot="indicator">
                    {{ current + 1 }}/{{bannerPicArray.length}}
                </div>
            </van-swipe>
            <!-- <div class="swiper-span"></div> -->
        </div>  
        <div>

        </div>
        <!--type bar-->
        <div class="type-bar">
            <div v-for="(cate,index) in category" :key="index"  @click="golistPage(cate.mallCategoryId,index)">
                <img :src="cate.image_url" width="90%">
                <span>{{cate.mallCategoryName}}</span>
            </div>
        </div>
        <mainFooter></mainFooter>
        
    </div>
</template>

<script>
    import axios from 'axios'
    import 'swiper/dist/css/swiper.css'
    import {swiper , swiperSlide} from 'vue-awesome-swiper'
 
    import floorComponent from '../component/floorComponent'
    import mainFooter from '../component/mainFooter'
    import { toMoney , int,num} from '@/filter/moneyFilter.js'
    import goodsInfo from '../component/goodsInfoComponent'
    import topNav from '../component/topNav'
    import url from '@/serviceAPI.config.js'
   
    export default {
        data() {
            return {
                keywords:'',
                value:'',
                bar_fixed:true,
                navLeft_show:false,
                activeKey:9999999,
                show:false,
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
                nav_img:[require('../../assets/images/cartempty.png')],
                current: 0,
              
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
        components:{swiper,swiperSlide,floorComponent,goodsInfo,mainFooter,topNav},
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
            onSearch(v){
            // console.log(v)
            if(this.$route.name !='CategoryList'&&v!=''){
                this.$router.push({name:'CategoryList',params:{keywords:v}})
                this.$emit('nav_Search',v)
            }else{
                this.$emit('nav_Search',v)
            }
        },
            golistPage(id,index) {
                this.show=false
                this.navLeft_show=false
                this.$router.push({name:'CategoryList',params:{categorySubId:id,index:index}})
            },
            goGoodsPage(id) {
                console.log(id)
                this.$router.push({name:'Goods',query:{goodsId:id}})
            },
            onClickNavLeft(){
                this.show=!this.show
                this.navLeft_show=!this.navLeft_show
            },
            onChange(index) {
                this.current = index;
            },
            onSeek(){
                this.$router.push({name:'seek'})
            },
            tocart(){
                this.$router.push({name:'Cart'})
            }
        },
        mounted(){
            let winHeight = document.documentElement.clientHeight
            document.getElementById("navLeft").style.height=winHeight -46 +'px'
        },
        computed: {
           cartNumCount() {
             return this.$store.state.cartNum
           }
        },
        activated(){
            this.$store.state.cartNum = localStorage.cartInfo ? (JSON.parse(localStorage.cartInfo).length===0?'':JSON.parse(localStorage.cartInfo).length) : ''
        },
       
    }
</script>

<style scoped>
    .van-sidebar-item--select {
        border-color: #f8f8f8;
        background-color: #f8f8f8;
        color: #7d7e80;
    }
    .van-nav-bar .van-icon {
        font-size: 26px;
        /* color:#ef3470 */
    }
    .hot-title{
        color:#ef3470
    }
    #navLeft{
        position: fixed;
        top: 46px;
        left: 0;
        z-index: 3;
        background: #f8f8f8;
        overflow-y: auto;
        width:80%
    }
    .van-overlay{
        z-index: 2!important;
    }

    .location-icon{
        padding-top:.2rem;
        padding-left:.3rem;
    }
    .swiper-area{
        position: relative;
        clear:both;
        max-height:600px;
        overflow: hidden;
    }
    .custom-indicator{
        position: absolute;
        right: 5px;
        bottom: 25px;
        padding: 2px 5px;
        color: #fff;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.1);
    }
    .van-swipe{
        max-height:600px;
    }
/* .search{
    padding: 8px 16px;
    background-color: rgb(255, 255, 255);
    position: relative;
}
.search i{
    position: absolute;
    top: 16px;
    left: 24px;
}
.search input{
    width: 100%;
    border: none;
    background-color: rgb(240, 240, 240);
    padding: 6px;
    padding-left: 31px;
    border-radius: 12px;
    box-sizing: border-box;
    font-size: 1rem;
} */
.type-bar>div{
    text-align: center;
    border-bottom: 1px solid #eae8e4;
    padding: 20px 0
}
.type-bar img{
    margin: 0 auto;
    display: block;
    margin-bottom: 20px;
}
.search{
    position: fixed;
    top: 45px;
    z-index: 1;
    width: 100%;
}

</style>
