<template>
    <div class="goods-info" @click="goGoodsPage()">
        <div class="goods-image">
            <img v-lazy="goodsImage" width="90%" />
        </div>
        <div class="goods-name">{{goodsName}}</div>
        <!-- <div class="goods-price">{{$store.state.money_sign}}{{goodsPrice  }}</div> -->
        <div class="goods-price" v-if="$store.state.lang==='ind-BA'">{{$store.state.money_sign}}{{goodsPrice |num}}</div>
        <div class="goods-price" v-else>{{$store.state.money_sign}}{{goodsPrice}}</div>
    </div>
</template>

<script>
    import {toMoney,num}  from '@/filter/moneyFilter.js'
    export default {
        props:['goodsImage','goodsName','goodsPrice','goodsId'],
        filters:{
            moneyFilter(money){
                return toMoney(money)
            },
            num(money){
                return num(money)
            }
        },
        methods: {
            goGoodsPage() {
                this.$router.push({name:'Goods',query:{goodsId:this.goodsId}})
            }
        },
    }
</script>

<style scoped>
 .goods-name{
        padding: 0 8px;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space:nowrap; 
    }
</style>