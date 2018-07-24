/**
 * 全局路由
 */

let TestUrl = 'http://localhost:3000/api'
let BaseURL = 'https://huowenxuan.leanapp.cn/api' // 正式
let WebUrl = 'https://tamer.luxiaoquan.com'

// BaseURL = TestUrl

module.exports = {
  queryVogue: BaseURL + '/vogue/query',
  deleteVogue: BaseURL + '/vogue/delete'
};
