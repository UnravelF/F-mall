import {request} from "./request";

// 获取banners recommends数据
export function getHomeMultidata() {
  return request({
    url: '/home/multidata'
  })
}

// 获取首页下拉商品数据
export function getHomeGoods(type, page) {
  return request({
    url: '/home/data',
    params: {
      type,
      page
    }
  })
}

