import {debounce} from './utils'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMinxin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 1.图片加载完成事件监听 防抖动
     this.refresh = debounce(this.$refs.scroll.refresh, 50)
    // 对监听事件进行保存
    this.itemImgListener = () => {
      // 解决图片加载bug
      this.refresh()
    }
    // 监听总线事件
    this.$bus.$on('imageItemLoad', this.itemImgListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    // 回到顶部点击事件
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300)
    }
  }
}

export const tabControlMixin = {
	data: function () {
		return {
			currentType: 'pop'
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = 'pop'
					break
				case 1:
					this.currentType = 'new'
					break
				case 2:
					this.currentType = 'sell'
					break
			}
			console.log(this.currentType);
		}
	}
}
