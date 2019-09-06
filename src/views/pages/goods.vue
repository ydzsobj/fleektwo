<template>
    <div>
      <div class="notice" v-show="notice_show">
        <van-notice-bar
          :text="notice_con_1"
          left-icon="volume-o"
          :speed="90"
        />
      </div>
      <van-pull-refresh v-model="pullLoading" @refresh="onRefresh" :pulling-text="$t('pullingText')" :loosing-text="$t('lossText')" :loading-text="$t('loading')">
        <div class="swiper-area">
            <van-swipe :autoplay="4000">
              <van-swipe-item v-if="goodsInfo.main_video_url">
                <video :src="goodsInfo.main_video_url" controls="controls" width="100%"/>
              </van-swipe-item>
              <van-swipe-item v-for="(image, index) in goodsInfo.list_images" :key="index">
                <img :src="image" width="100%"/>
              </van-swipe-item>
            </van-swipe>
        </div>
        <van-cell-group>
          <van-cell>
            <div class="goods-title">{{ goodsInfo.title}}</div>
            <div class="goods-price">{{goodsInfo.money_sign}}{{goodsInfo.price | num}}  <s class="huicolor">{{goodsInfo.money_sign}}{{goodsInfo.original_price | num}}</s></div>
          </van-cell>
          <van-cell class="goods-express">
            <van-col class="huicolor" span="6">{{ $t('carriage') }}</van-col>
            <van-col class="huicolor" span="6">0</van-col>
            <!-- <van-col class="huicolor" span="6">{{ $t('inventory') }}</van-col>
            <van-col class="huicolor" span="6">{{goodsInfo.stock_num}}</van-col> -->
          </van-cell>
        </van-cell-group>
        <van-cell-group @click.native= showSkuAttr>
          <van-cell class="goods-express">
            <van-col class="huicolor" span="4">{{ $t('select') }}</van-col>
            <van-col span="19">{{ attrText }}</van-col>
            <van-col span="1"><van-icon name="arrow" /></van-col>
            <van-col span="4"></van-col>
            <van-col style="height: 30px" v-for="(item , index) in sku.tree" :key="'col'+index">
              <div class="imgsdiv"  v-for="(imgs , index) in item.v" :key="index">
                 <van-image width="30" height="30" v-if="imgs.imgUrl" :src="imgs.imgUrl" />
              </div>
            </van-col>
          </van-cell>
        </van-cell-group>
      </van-pull-refresh>
        <div>
            <van-tabs class="mallFlexd" v-model="activeTab" swipeable sticky>
                <van-tab :title="$t('goodsDetails')">
                   <div class="detail">
                      <div v-for="(image, index) in goodsInfo.detail_list_images" :key="index">
                        <video v-if="ifvido(image)" :src="image" controls="controls" width="100%" style="display: block"/>
                        <van-image v-else lazy-load show-error :src="image">
                          <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                          </template>
                        </van-image>   
                      </div>
                      <van-swipe :autoplay="2000" :duration="1500" :show-indicators="false" style="background-color: #fff">
                        <template v-for="(item,index) in goodsInfo.comments" >
                        <van-swipe-item :key="item.id" v-if=" index < 4" @click.native="gocommenttab">
                            <van-cell>
                              <div>
                                {{item.name}}&nbsp;&nbsp;{{item.phone}}&nbsp;&nbsp;
                                <van-rate
                                   style="display: inline-block"
                                   v-model="item.star_scores"
                                   :size="14"
                                   disabled
                                   disabled-color="#f44"
                                   void-icon="star"
                                   void-color="#eee"
                                 />
                                {{item.created_at}}
                              </div>
                              <div class="huicolor">
                                 &nbsp;&nbsp;&nbsp;&nbsp; {{item.comment}}
                                 <van-row gutter="20">
                                   <van-col span="8" v-for="elem in item.comment_images" :key="elem.id">
                                       <van-image width="100%" height="100" fit="contain" lazy-load :src="elem.image_url" />
                                   </van-col>
                                 </van-row>
                              </div>
                            </van-cell>
                        </van-swipe-item>
                        </template>
                      </van-swipe>       
                   </div>
                </van-tab>
                <van-tab class="comment" :title="$t('comment')">
                    <van-list
                      v-model="loading"
                      :finished="true"
                     >
                      <van-cell
                        v-for="item in goodsInfo.comments"
                        :key="item.id"
                        >
                        <div>
                          {{item.name}}&nbsp;&nbsp;{{item.phone}}&nbsp;&nbsp;
                          <van-rate
                             style="display: inline-block"
                             v-model="item.star_scores"
                             :size="14"
                             disabled
                             disabled-color="#f44"
                             void-icon="star"
                             void-color="#eee"
                           />
                          {{item.created_at}}
                        </div>
                        <div slot="default" class="huicolor">
                           &nbsp;&nbsp;&nbsp;&nbsp; {{item.comment}}
                           <van-row gutter="20">
                             <van-col span="8" v-for="(elem, index) in item.comment_images" :key="elem.id">
                                 <van-image width="100%" height="100" fit="contain" lazy-load :src="elem.image_url" @click.native="imgShow(item.comment_images,index)"/>
                             </van-col>
                           </van-row>
                        </div>
                    </van-cell>
                        <van-row type="flex" justify="space-around" style="background-color: #fff">
                            <van-button icon="comment" plain type="danger" @click="commentclick">{{$t('tocomment')}}</van-button>
                        </van-row>

                    </van-list>
                </van-tab>
            </van-tabs>
<!-- @load="onLoad" -->
        </div>
        <van-popup
          v-model="popupshow"
          round
          position="bottom"
          :style="{ height: '310px' }">
            <van-nav-bar
              :title="$t('comment')"
              :left-text="$t('back')"
              @click-left="barClickLeft"
              left-arrow
            />
            <van-cell-group>
               <van-field
                 v-model="name"
                 required
                 clearable
                 :label="$t('name')"
                 :placeholder="$t('nameholder')"
                 :error-message="errName"
               />
               <van-field
                 v-model="telephone"
                 :label="$t('phoneNumber')"
                 clearable
                 clickable
                 :placeholder="$t('phoneNumberholder')"
                 type="number"
                 required
                 :error-message="errTelephone"
               />
               <van-cell>
                 <span style="width:90px;display:inline-block">{{$t('score')}}</span>
                  <van-rate
                    style="display: inline-block"
                    v-model="star_scores"
                    :size="14"
                    void-icon="star"
                    color="#f44"
                    void-color="#eee"
                  />
               </van-cell>
               <van-field
                 v-model="message"
                 :label="$t('message')"
                 clearable
                 clickable
                 type="textarea"
                 maxlength="200"
                 required
                 :error-message="errMessage"
                 :placeholder="$t('messageholder')"
               />
            </van-cell-group>
            <van-row type="flex" justify="space-around">
                <van-button icon="comment" type="danger" @click="commentSubmit">{{$t('tocomment')}}</van-button>
            </van-row>
        </van-popup>
        <van-goods-action style="z-index: 2;" class="marginauto">
          <van-goods-action-icon
            :info="cartNumCount"
            icon="cart-o"
            :text="$t('shopCart')"
            @click.native="tocart"
          />
          <van-goods-action-icon
            icon="shop-o"
            :text="$t('store')"
            @click.native="tohome"
          />
          <van-goods-action-button
            type="warning"
            :text="$t('addCart')"
            @click.native="showSkuCart"
          />
          <van-goods-action-button
            type="danger"
            :text="$t('buy')"
            @click.native="showSkuBuy"
          />
        </van-goods-action>
        <van-sku
        class="left50"
          v-model="show"
          :sku="sku"
          :goods="goods"
          :goods-id="goodsId"
          :quota="0"
          :quota-used="0"
          :close-on-click-overlay="true"
          :hide-stock="sku.hide_stock"
          :message-config="messageConfig"
          :show-add-cart-btn="showAddCartBtn"
          :buy-text ="buyText"
          :add-cart-text="$t('addCart')"
          :stepper-title="$t('buyNum')"
          :inventory="$t('inventory')"
          :select-text="$t('select')"
          :selecteded-text="$t('selected')"
          :at-least-one="$t('atLeastOne')"
          :select-goods-first="$t('selectGoodsFirst')"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
          @sku-selected="skuSelected"
        >
           <template slot="sku-header-price" slot-scope="props">
             <div class="van-sku__goods-price">
               <span class="van-sku__price-symbol">{{goodsInfo.money_sign}}</span><span class="van-sku__price-num">{{ props.price | num}}</span>
             </div>
           </template>
        </van-sku>

    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import {Toast} from 'vant'
    import {ImagePreview} from 'vant'
    import {Sku} from '../../vant' //sku组件有改动所以用自定义的vant
    import '../../vant/lib/index.css';
    import {toMoney, int,num} from '@/filter/moneyFilter.js'
    import checkoutLang from '@/lang.js'
import { setTimeout } from 'timers';
    export default {
      components: {
        [Sku.name]: Sku
      },
        data() {
            return {
                notice_show:false,
                index_1:0,
                notice_con_1:'',
                notice_con:['一觉游仙好梦，任它竹冷松寒；轩辕事，古今谈，风流河山；沉醉赴白首，舒怀成大观，梦在人间，醒亦在人间。','天地俱不醒，落得昏沉醉梦；鸿蒙率是客，罔寻辽阔主人。','悟来时见江海古，苍崖行遍谒玄门'],
                activeTab: 0,
                star_scores: 1,
                message: '',
                telephone: '',
                name:'',
                errMessage: '',
                errTelephone:'',
                errName:'',
                popupshow: false,
                attrText: '',
                goodsId:'',
                goodsInfo:{},  //商品详细信息 
                images: [
                    'http://images.baixingliangfan.cn/shopGoodsImg/20180415/20180415115202_8432.jpg',
                    'http://images.baixingliangfan.cn/shopGoodsImg/20180415/20180415120857_4885.jpg'
                  ],
                commentList:[
                    
                ],
                loading: false,
                pullLoading:false,
                finished: false,
                show: false,
                isBuyCartAttr:'',
                buyText: '确定',
                showAddCartBtn: false,
                sku: {
                       // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                       // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                       tree: [
                        //  {
                        //    k: '测试颜色', // skuKeyName：规格类目名称
                        //    v: [
                        //      {
                        //        id: '1111', // skuValueId：规格值 id
                        //        name: '测试红色', // skuValueName：规格值名称
                        //        imgUrl: 'https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg' // 规格类目图片，只有第一个规格类目可以定义图片
                        //      },
                        //      {
                        //        id: '2222',
                        //        name: '测试蓝色',
                        //        imgUrl: 'https://img.yzcdn.cn/2.jpg'
                        //      }
                        //    ],
                        //    k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        //  },
                        // {
                        //    k: '测试大小', // skuKeyName：规格类目名称
                        //    v: [
                        //      {
                        //        id: '9999', // skuValueId：规格值 id
                        //        name: '测试大' // skuValueName：规格值名称
                        //      },
                        //      {
                        //        id: '8888',
                        //        name: '测试小'
                        //      }
                        //    ],
                        //    k_s: 's2' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        //  }
                       ],
                       // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                       list: [
                        //  {
                        //    id: 1001, // skuId，下单时后端需要
                        //    price: 100, // 价格（单位分）
                        //    s1: '1111', // 规格类目 k_s 为 s1 的对应规格值 id
                        //    s2: '9999', // 规格类目 k_s 为 s2 的对应规格值 id
                        //    s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                        //    stock_num: 111 // 当前 sku 组合对应的库存
                        //  },
                        //  {
                        //    id: 1002, // skuId，下单时后端需要
                        //    price: 101, // 价格（单位分）
                        //    s1: '1111', // 规格类目 k_s 为 s1 的对应规格值 id
                        //    s2: '8888', // 规格类目 k_s 为 s2 的对应规格值 id
                        //    s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                        //    stock_num: 112 // 当前 sku 组合对应的库存
                        //  },
                        // {
                        //    id: 1003, // skuId，下单时后端需要
                        //    price: 103, // 价格（单位分）
                        //    s1: '2222', // 规格类目 k_s 为 s1 的对应规格值 id
                        //    s2: '9999', // 规格类目 k_s 为 s2 的对应规格值 id
                        //    s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                        //    stock_num: 113 // 当前 sku 组合对应的库存
                        //  },
                        // {
                        //    id: 1004, // skuId，下单时后端需要
                        //    price: 104, // 价格（单位分）
                        //    s1: '2222', // 规格类目 k_s 为 s1 的对应规格值 id
                        //    s2: '8888', // 规格类目 k_s 为 s2 的对应规格值 id
                        //    s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                        //    stock_num: 114 // 当前 sku 组合对应的库存
                        //  }
                       ],
                       price: '2.00', // 默认价格（单位元）
                       stock_num: 227, // 商品总库存
                       collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                       none_sku: false, // 是否无规格商品
                       messages: [
                         {
                           // 商品留言
                           datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
                           multiple: '1', // 留言类型为 text 时，是否多行文本。'1' 表示多行
                           name: '留言', // 留言名称
                           type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
                           required: '', // 是否必填 '1' 表示必填
                           placeholder: '' // 可选值，占位文本
                         }
                       ],
                       hide_stock: false // 是否隐藏剩余库存
                },
                goods: {
                   // 商品标题
                   title: '测试商品',
                   // 默认商品 sku 缩略图
                   picture: 'https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg'
                },
                messageConfig: {
                  // 数据结构见下方文档
                }
            }
        },
        computed: {
           cartNumCount() {
             return this.$store.state.cartNum
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
        created(){
            this.goodsId=this.$route.query.goodsId ?this.$route.query.goodsId-0: this.$route.params.goodsId-0
            console.log(this.goodsId)
            this.getInfo()
            this.getNotice()
            this.sku.messages[0].name = this.$t('message') //sku留言 语言包
            this.sku.messages[0].placeholder = this.$t('messagePlaceholder') //sku留言 语言包
            // this.$store.state.cartNum = localStorage.cartInfo ? (JSON.parse(localStorage.cartInfo).length===0?'':JSON.parse(localStorage.cartInfo).length) : ''
        },
        activated(){
            this.$store.state.cartNum = localStorage.cartInfo ? (JSON.parse(localStorage.cartInfo).length===0?'':JSON.parse(localStorage.cartInfo).length) : ''
            let goodsId=this.$route.query.goodsId ?this.$route.query.goodsId-0: this.$route.params.goodsId-0
            if(this.goodsId != goodsId){
              this.goodsId = goodsId
              this.getInfo()
              this.getNotice()
            }
        },
        methods: {
            getNotice() {
              axios({
                          url:url.getNotice,
                          method:'get',
                          params:{}
                      })
                      .then(response=>{
                        console.log(response.data)
                          if(response.data.success == true){
                            console.log(response.data)
                              this.attrTextFun()  
                              this.index_1 = 0
                              this.notice(response.data.data)
                          }
                      })
                      .catch(error=>{
                          console.log(error)
                          reject(error)
                      })
            },
            notice(a){
              var that = this
              var date = 8000
              if(a.length >0){
                var t=setInterval(fn,date);
              }
              function fn(){
                  date = 23000
                  that.notice_show = true
                  that.notice_con_1= a[that.index_1].receiver_name +'  ' + that.$t('justbuy') +'　　'
                  that.index_1=that.index_1+1;
                  setTimeout(function(){ that.notice_show = false },15000)
                  if(that.index_1==a.length){
                    clearInterval(t)
                  }
                  if (that.index_1 == 1) {
                    clearInterval(t);
                    t = setInterval(fn, date);
                  }
              }
              
            },
            getInfo() {
             return new Promise ((reslove,reject)=>{   
                      axios({
                          url:url.getDetailGoodsInfo+'/'+this.goodsId,
                          method:'get',
                          params:{}
                      })
                      .then(response=>{
                          if(response.status== 200 && response.data.good){
                              this.goodsInfo = response.data.good
                              // 商品属性基本信息赋值
                              this.goods.title = this.goodsInfo.title             //默认名
                              this.goods.picture = this.goodsInfo.main_image_url  //无属性规格，默认图片
                              this.$store.money_sign = this.goodsInfo.money_sign  //货币
                              this.sku.list = this.goodsInfo.list                 // sku
                              this.sku.tree = this.goodsInfo.tree || []                 // 所有属性 
                              this.sku.price = this.goodsInfo.price               // 默认价格（单位元）
                              this.sku.none_sku = this.goodsInfo.none_sku         // 是否无规格商品
                              this.sku.stock_num = this.goodsInfo.stock_num       //总库存
                              this.sku.collection_id = this.goodsInfo.collection_id          // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                              this.goodsInfo.fb_pix && this.fbInit(this.goodsInfo.fb_pix)    // 如有像素 就初始化 fbinit
                              this.attrTextFun()                                  //显示属性名
                              reslove()
                          }else{
                              Toast(this.$t('serveError'))
                              reject(err)
                          }
                           console.log(this.goodsInfo)
                      })
                      .catch(error=>{
                          console.log(error)
                          reject(error)
                      })
                    })
            },
            addGoodsToCart(skuData){
                //取出本地购物车中的商品
                //localStorage.removeItem('cartInfo')
                let cartInfo = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo) : []
                let  flag = false; //判断购物车同一商品选择同一属性时购物车+1
                    for(let i=0;i<cartInfo.length;i++){
                        if (cartInfo[i].goodsId === skuData.goodsId && cartInfo[i].selectedSkuComb.id === skuData.selectedSkuComb.id ){
                            cartInfo[i].selectedNum += skuData.selectedNum 
                            cartInfo[i].messages.message_0 = skuData.messages.message_0
                            flag=true 
                        }
                    }
                
                 if (!flag) {
                     let newGoodsInfo = {
                         name:this.goodsInfo.name,
                         title:this.goodsInfo.title,
                         skuAttrText: this.skuAttrTextFun(skuData)
                     }
                     cartInfo.push(Object.assign(newGoodsInfo , skuData))     
                 }
                localStorage.cartInfo = JSON.stringify(cartInfo)
                // this.$store.state.cartNum = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo).length : ''
                Toast.success(this.$t('successAdd'))
                try{fbq('track', 'AddToCart');console.log('addtocart')}catch(e){} 
                this.$router.push({name:'Cart'})
            },
            tohome(){
                this.$router.push({name:"ShoppingMall"})
            },
            tocart(){
                this.$router.push({name:'Cart'})
            },
            onLoad() {
              setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                  this.commentList.push(this.commentList.length + 1);
                }
                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.commentList.length >= 40) {
                  this.finished = true;
                }
              }, 500);
            },
            showSkuBuy() {this.show = true ; this.isBuyCartAttr = 'buy';this.showAddCartBtn=false;this.buyText= this.$t('ok')},
            showSkuCart() {this.show = true ; this.isBuyCartAttr = 'cart';this.showAddCartBtn=false;this.buyText= this.$t('ok')},
            showSkuAttr() {this.show = true ; this.isBuyCartAttr = 'attr';this.showAddCartBtn=true;this.buyText= this.$t('buy')},
            onBuyClicked(skuData){
              console.log('onBuyClicked',skuData)
              if(this.isBuyCartAttr==="buy" || this.isBuyCartAttr==="attr"){
                  console.log(this.isBuyCartAttr,'buy买')
                  let newGoodsInfo = {
                       name:this.goodsInfo.name,
                       title: this.goodsInfo.title,
                       skuAttrText: this.skuAttrTextFun(skuData)
                   } 
                  try{fbq('track', 'Lead');console.log('Lead')}catch(e){} 
                  this.$router.push({name:'Cart',params:{skuData: Object.assign(newGoodsInfo , skuData)}}) 
              }else if (this.isBuyCartAttr==="cart"){
                this.addGoodsToCart(skuData)
                console.log(this.isBuyCartAttr,'购物车')
              }
              },
            onAddCartClicked(skuData){
              console.log('onAddCartClicked',skuData,this.isBuyCartAttr,'购物车')
              this.addGoodsToCart(skuData)
              },
            skuSelected(skuValue) {
              // console.log(skuValue)
            },
            attrTextFun () {
              let arr = []
              this.sku.tree.forEach(element => {
                arr.push(element.k)
              })
              this.attrText = arr.join('-')
            },
            skuAttrTextFun(skuData) {
                let skuAttrText = []
                if(this.sku.tree.length>0){
                   this.sku.tree.forEach(element => {
                     element.v.forEach(ele => {
                       if( ele.id===skuData.selectedSkuComb.s1 || ele.id===skuData.selectedSkuComb.s2 ||ele.id===skuData.selectedSkuComb.s3){
                         skuAttrText.push(ele)
                       }
                     });
                   })
                }else{
                  let obj={}
                  obj.imgUrl = this.goodsInfo.main_image_url
                  skuAttrText.push(obj)
                }
                return skuAttrText
            },
            ifvido (image) {
              let rex = new RegExp(/\.(mp4|avi)$/i)
                  return  rex.test(image)
            },
            fbInit(fix){
              try {
                fbq('init', fix); 
                fbq('track', 'PageView');
              } catch (error) {}
              this.$store.state.fix = fix
              localStorage.fix = JSON.stringify(fix)
            },
            onRefresh() {
              this.getInfo().then(()=>{
                Toast(this.$t('loadSuccess'))
                this.pullLoading = false
              })
            },
            commentclick(){
                this.popupshow=true
            },
            barClickLeft(){
              this.popupshow = false
            },
            commentSubmit(){
               this.errName=''
               this.errTelephone=''
               this.errMessage=''
               let regTele= /^[0-9]{11,12}$/;
               if(this.name === ''){
                   this.errName = this.$t('nameerr');return
               }else if (this.telephone===''){
                   this.errTelephone = this.$t('errTelephone');return
               }else if (this.message===''){
                   this.errMessage = this.$t('errMessage');return
               }else if (!regTele.test(this.telephone)){
                   this.errTelephone = this.$t('errTelephone2');return
               }
                 axios({
                     url:url.sedGood_comments,
                     method:'post',
                     data:{
                       good_id: this.goodsId,
                       name: this.name,
                       phone: this.telephone,
                       comment: this.message,
                       star_scores: this.star_scores
                     }
                 })
                 .then(response=>{
                   console.log(response)
                     if(response.status== 200 && response.data.success){
                       this.popupshow = false
                      Toast(this.$t('sendSucess')) 
                     }else{
                         Toast(this.$t('serveError'))
                     }
                 })
            },
            imgShow(img,index){
                    // console.log(img,index,img.map((item)=>{return item.image_url}))
                  ImagePreview({
                    images: img.map((item)=>{return item.image_url}),
                    startPosition: index,
                    onClose() {
                      // do something
                    }
                  });
            },
            gocommenttab(){
              this.activeTab=1
            }
        },
    }
</script>

<style scoped>
    .goods-name{
        background-color: #fff;
    } 
    .goods-price{
        background-color: #fff;
    }
    .detail {
        /* font-size:0px; */
        margin-bottom: 50px;
    }
    .comment{
        margin-bottom: 50px;
    }

    .swiper-area{
        clear:both;
        max-height:20rem;
        overflow: hidden;
    }
    .goods-title{
        font-size: 18px;
    }
    .goods-price{
        color: #f44;
        font-size: 16px;
    }
    .goods-express{
        font-size: 12px;
        padding: 5px 15px;
    }
    .huicolor{
      color: #969799
    } 
    .imgsdiv {
      display: inline-block;
    }
    .mallFlexd >>> .van-sticky.van-sticky--fixed {
      max-width: 600px;
      margin: 0 auto;
    }
    .detail >>> .van-image {
      display: block
    }
    .notice{
      position: fixed;
    max-height: 100%;
    overflow-y: auto;
        top: 0;
    left: 0;
    width: 100%;
    z-index: 2002;
    }
    .notice >>>.van-notice-bar{
      background-color: rgba(255,251,230,.6)
    }
</style>