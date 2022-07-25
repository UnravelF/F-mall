<template>
  <div class="goods">
    <goods-list-item 
            v-for="item in goods" 
            :goods-item="item" class="item"/>
  </div>
</template>

<script>
  import GoodsListItem from './GoodsListItem'

  export default {
    name: "GoodsList",
    components: {
      GoodsListItem
    },
    props: {
      goods: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
    /* 默认不包裹nowrap 包裹wrap后子盒子根据设置宽度一行显示几个 */
    flex-wrap: wrap;
    /* 中间均等分 */
    justify-content: space-around;

    padding: 2px;
  }

  .goods .item {
    width: 48%;
  }

</style>