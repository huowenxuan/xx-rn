/**
 * 全局路由
 */

let TestUrl = 'http://localhost:3000/api'
let BaseURL = 'http://www.huowenxuan.top/api' // 正式
let WebUrl = 'https://tamer.luxiaoquan.com'

// BaseURL = TestUrl

module.exports = {
  voguePage: BaseURL + '/vogue/page',

  queryVogue: BaseURL + '/vogue/query',
  deleteVogue: BaseURL + '/vogue/delete'
};
