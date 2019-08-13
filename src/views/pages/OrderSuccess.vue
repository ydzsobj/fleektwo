<template>
    <div>
       <div class="nav">
           <span @click="onClickLeft"> <van-icon name="arrow-left" />返回</span>
       </div>
       <div class="tu">
         <div class="tuleft">
             <span>交易成功</span>
         </div>
          <div class="turight">
          </div>
       </div>
       <van-row style="background-color: #ffffff;">
         <van-col span="2"><van-icon name="location-o" style="margin: 10px"/></van-col>
         <van-col span="22" style="font-size: 14px;line-height: 6px;">
             <p>{{orderResponse.receiver_name}} &nbsp;&nbsp;<span class="huicolor">{{orderResponse.receiver_phone}}</span> &nbsp;&nbsp;<span class="huicolor">{{orderResponse.receiver_email}}</span></p>
             <p>{{orderResponse.short_address}} &nbsp;&nbsp; {{orderResponse.address}}</p>
             <p>{{orderResponse.leave_word}} </p>
          </van-col>
       </van-row>
        <van-card
            v-for="item in cartInfo"
           :key="item.selectedSkuComb.id"
           :title="item.title"
           :desc="showDesc(item)"
           :num="item.selectedNum"
           :thumb="showImage(item.skuAttrText)"
         >
            <div slot="tags" class="redcolor">
                <span>{{moneySign}}{{item.selectedSkuComb.price | toDivide}}</span>
            </div>
        </van-card>
        <van-row style="background-color: #fafafa;">
         <van-col span="1"></van-col>
         <van-col span="23" style="font-size: 14px;line-height: 6px;">
             <p>订单号码：{{orderResponse.sn}} </p>
             <p>时间：{{orderResponse.created_at}} </p>
          </van-col>
       </van-row>
    </div>
</template>
<script>
    import { toMoney, toDivide} from '@/filter/moneyFilter.js'
export default {
    data () {
        return {
            cartInfo:'',
            orderResponse: null
        }
    },
    computed: {
            moneySign(){
               return this.$store.money_sign
           }
    },
    methods: {
        onClickLeft (){
          this.$router.go(-2)
        },
        showDesc(item){
            return item.skuAttrText.map(ele=>{return ele.name}).join('/')+'   '+item.messages.message_0
        },
        showImage(skuAttrText) {
            let img=''
            skuAttrText.forEach(element => {
                if(element.imgUrl){img= element.imgUrl }
            })
            return img
        }
    },
    filters:{
        toDivide (money){
            return toDivide(money)
        }
    },
    created(){
        this.cartInfo = this.$route.params.orderData
        this.orderResponse = this.$route.params.orderResponse
    }
    
}
</script>
<style scoped>
.nav{
    background-color: #f44;
    color: #fafafa;
    font-size: 16px;
    padding-left: 10px;
    padding-top: 5px;
}
.tu {
    background-color: #f44;
    color: #fafafa;
    height: 5rem
}
.tu div{
    float: left;
    width: 50%;
    height: 100%
}
.tu .turight{
    background-image: url(//img.alicdn.com/tps/TB1ww24PVXXXXc6XXXXXXXXXXXX-420-300.png_400x400q85s150.jpg_.webp);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
}
.tuleft{
    display: flex;
    justify-content: center;
    align-items: center;
}
.redcolor{
    color:#f44
}
.huicolor{
  color: #969799;
  font-size: 12px

} 
    
</style>