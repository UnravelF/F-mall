<template>
  <div id="detail">
    <!-- 导航栏 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="params"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="goodsList" ref="recommend"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>

    <!-- .native修饰符 用于监听组件原生事件 给原生事件添加该属性 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar'
  import DetailSwiper from './childComps/DetailSwiper'
  import DetailBaseInfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'

  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'


  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail"
  import {itemListenerMinxin, backTopMixin} from 'common/mixin'
  import {debounce} from 'common/utils'

  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      GoodsList,
      Scroll
    },
    // 混入复用
    mixins: [itemListenerMinxin, backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        goodsList: [],
        // 动态存储导航栏参数的对应位置
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      // 1.保存存入的iid
      this.iid = this.$route.params.iid

      // 3.请求推荐请求
      this._getRecommend()

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // console.log(res.result);
        // 1.获取顶部轮播图片数据
        const data = res.result;
        this.topImages = data.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息对象
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.获取评论信息
        if(data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
        
      })

      // 给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // 为了满足下面滚动位置实时跳转对应主题高亮的hack做法
        this.themeTopYs.push(Number.MAX_VALUE)

        console.log(this.themeTopYs);
      }, 200)

    },
    methods: {
      // vuex的store中添加购物车成功提示的方法映射
      ...mapActions(['addCart']),
      imageLoad() {
        // 解决下拉图片bug
        this.refresh()
        // 点击标题滚动对应区域
        this.getThemeTopY()
      },
      // 获取推荐数据
      _getRecommend() {
	    	getRecommend().then(res => {
	    		this.goodsList = res.data.list
		    })
      },
      // 详情导航栏点击对应滚动到对应主题
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
      },
      // 滚动位置监听  实时对应主题  联动效果
      contentScroll(position) {
        // 1.获取y值
        const positionY = -position.y
        // 2.对y值与主题的y值进行对比
        length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i++) {
          // 1.普通逻辑做法
          // if(this.currentIndex !== i &&(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) 
          // || (i === length -1 && positionY >= this.themeTopYs[i])){
          //   this.currentIndex = i;
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }

          // 2.hack做法 为了还是不越界length  length - 1
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        // 3.是否显示回到顶部标志
        // 判断backTop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },
      // 添加购物车
      addToCart() {
        // 1.获取购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        // 每件商品的唯一标识
        product.iid = this.iid;

        // 2.将商品添加到购物车(1.Promise 2.mapActions)
        // this.$store.commit('addCart', product)
        this.addCart(product).then(res => {
          this.$toast.show(res)
        })

        // this.$store.dispatch('addCart', product).then(res => {
        //   console.log(res);
        // })
        }
    },
    mounted() {
    },
    destroyed() {
      this.$bus.$off('imageItemLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    /* position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh; */
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 102px;
    z-index: 9;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    /* height: calc(100% - 44px - 58px); */
    height: 100%;
    overflow: hidden;
  }
</style>