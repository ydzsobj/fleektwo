<template>
    <div>
        <div class="navbar-div">
            <van-nav-bar :title="$t('classlist')"/>
        </div>

        <div>
          <van-row>
              <van-col span="5">
                  <!-- <div id="leftNav">
                       <ul>
                           <li @click="clickCategory(index,item.category_id)" :class="{categoryActice:categoryIndex==index}" v-for="(item , index) in category" :key="index">
                               {{item.name}}
                           </li>
                       </ul>
                  </div> -->
                  <van-sidebar v-model="categoryIndex" id="leftNav">
                    <van-sidebar-item :title="item.name" v-for="(item , index) in category" :key="index" @click="clickCategory(index,item.category_id)"/>
                  </van-sidebar>
                 
              </van-col>
              <van-col span="19">

                  <!-- <div class="tabCategorySub">
                      <van-tabs v-model="active" @click="onClickCategorySub">
                          <van-tab v-for="(item,index) in categorySub" :key="index" :title="item.MALL_SUB_NAME">

                          </van-tab>
                      </van-tabs>
                  </div> -->
                  
                <div id="list-div">
                    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                        <van-list
                            v-model="loading"
                            :finished="finished"
                            @load="onLoad"
                            :offset="10"
                            :finished-text="$t('outfloor')"
                        >
                            <!-- :immediate-check="false" -->
                            <div class="list-item" @click="goGoodsInfo(item.goodsId)" v-for="(item,index) in goodList" :key="index">
                                <div class="list-item-img">
                                    <img :src="item.image" 
                                    width="100%"
                                    :onerror="errorImg"                                    
                                     /> 
                                </div>
                                <div class="list-item-text">
                                    <div>{{item.name}}</div>                                    
                                    <div>￥{{item.price | moneyFilter}}</div>                                    
                                 </div>
                            </div>
        
                        </van-list>
                    </van-pull-refresh>
                </div>
              </van-col>
          </van-row>  
        </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import {toMoney} from '@/filter/moneyFilter.js'
    export default {
        data() {
            return {
                loading: false,   //是否处于加载状态
                finished: false,  //是否已加载完所有数据
                isLoading: false,   //是否处于下拉刷新状态
                category: [],
                categoryIndex:0,
                categorySub:[],  //小类类别
                active:0,    //激活标签的值
                page:0,        //商品列表的页数
                goodList:[],   //商品列表信息
                categorySubId:'', //商品子类ID
                errorImg:'this.src="'+require('@/assets/images/errorimg.png')+'"',
                isstate:false
            }
        },
        filters:{
            moneyFilter(money){
                return toMoney(money)
            }
        },
        created(){
            
            this.getCategory();
           
        },
        watch: {
            '$route' () {
                if(this.$route.query.categorySubId){
                    this.page=0
                    this.categoryIndex=this.$route.query.index
                    this.categorySubId=this.$route.query.categorySubId ?this.$route.query.categorySubId : this.$route.params.categorySubId
                    this.finished = false
                    this.isLoading= false
                    this.goodList= [] 
                    // this.categorySubId = this.categorySubId
                    this.onLoad()
                }
            }
        },
        mounted(){
            let winHeight = document.documentElement.clientHeight
            document.getElementById("leftNav").style.height=winHeight -46-50 +'px'
            document.getElementById("list-div").style.height=winHeight -90 +'px'
        },
        methods: {
            onLoad() {      //上拉加载
                let that = this;
                var timer = setInterval(function(){
                        if(that.isstate){
                             clearInterval(timer);
                            setTimeout(() => {
                            that.categorySubId = that.categorySubId?that.categorySubId:that.categorySub[0].category_id
                            that.getGoodList()
                            }, 500);
                        }
                    },500);
                //  if(this.isstate){
                //     setTimeout(() => {
                //     this.categorySubId = this.categorySubId?this.categorySubId:this.categorySub[0].category_id
                //     this.getGoodList()
                // }, 1100);
                //  }
            },
            onRefresh() {       //下拉刷新
                setTimeout(() => {
                    this.finished = false;
                    this.isLoading = false;
                    this.goodList = []
                    this.page = 0
                    this.onLoad()
                }, 500);
            },
            
            getCategory() {
                axios({
                    url:url.getCateGoryList,
                    method:'get',
                })
                .then(response=>{
                    if(response.data.success && response.data.data ){
                      this.category = response.data.data
                      this.categorySub = response.data.data
                      this.isstate = true
                    }else{
                        Toast($t('serveError'))
                    }
                })
                .catch(error=>{
                    console.log(error)
                })
                
            },
            clickCategory(index,categoryId){
                 this.goodList= [] 
                this.categoryIndex=index
                this.page=0
                this.finished = false
                this.isLoading = false;
                // console.log(categoryId)
                this.categorySubId = categoryId
                
                this.onLoad()
            },
            getGoodList(){
                    this.page++
                axios({
                    url:url.getGoodsListByCategorySubID,
                    method:'get',
                    params:{
                        category_id:this.categorySubId,
                        page:this.page
                    }
                })
                .then(response=>{
                    if(response.data.success  && response.data.data.data.length){
                        
                        this.goodList=this.goodList.concat(response.data.data.data)
                    }else{
                        this.finished = true
                    }
                    this.loading = false;
                    
                })
                .catch(error=>{
                    console.log(error)
                })
            },
            //跳转到商品详细页
            goGoodsInfo(id){
                this.$router.push({name:'Goods',query:{goodsId:id}})
            }

          

           
        }
    }
</script>

<style scoped>
    /* #leftNav{
        background-color: aliceblue;
    } */
    /* #leftNav ul li {
        line-height: 2rem;
        border-bottom: 1px solid #E4E7ED;
        padding:3px;
        font-size:0.8rem;
        text-align: center;
    } */
    .categoryActice{
        background-color: #fff;
    }


    .list-item{
        display: flex;
        flex-direction: row;
        font-size:0.8rem;
        border-bottom: 1px solid #f0f0f0;
        background-color: #fff;
        padding:5px;
    }
    #list-div{
        overflow: scroll;
    }
    .list-item-img{
        flex:8;
    }
    .list-item-text{
        flex:16;
        margin-top:10px;
        margin-left:10px;
    }
   
</style>