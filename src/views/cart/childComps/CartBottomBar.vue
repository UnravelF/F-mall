<template>
  <div class="bottom-bar">
    <div class="bottom-content">
      <check-button 
              class="check-button" 
              :is-checked="isSelectAll"
              @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">
      合计: {{totalPrice}}
    </div>

    <div class="calculate" @click="calcClick">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
      // preValue 前一次的值  toFixed保留两位小数
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      // 选择全选按钮状态
      isSelectAll() {
        if (this.cartList.length === 0) return false
        // 大于0的数字取反为false  0取反为true
        // return !(this.cartList.filter(item => !item.checked).length)
        return !this.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        // console.log('1111');
        if (this.isSelectAll) {
          // 1.如果原来全是选中， 点击一次全部不选中
          this.cartList.forEach(item => item.checked = false);
        } else {
          // 2.如果原来不是全选中，点击一次全部选中
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        // 如果购物车中为空结算点击提示
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 1500)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: fixed;
    bottom: 49px;
    display: flex;
    width: 100%;
    height: 44px;
    line-height: 44px;
    background-color: #eee;
    font-size: 14px;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    box-sizing: border-box;
  }

  .bottom-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 30px;
    flex: 1;
  }

  .calculate {
    width: 100px;
    background-color: orangered;
    color: #fff;
    text-align: center;
  }
</style>