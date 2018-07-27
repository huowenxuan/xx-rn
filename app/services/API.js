/**
 * 全局路由
 */

let TestUrl = 'http://localhost:3000/api'
let BaseURL = 'http://207.246.86.58/api' // 正式
let WebUrl = 'https://tamer.luxiaoquan.com'

// BaseURL = TestUrl

module.exports = {
  voguePage: BaseURL + '/vogue/page',

  queryVogue: BaseURL + '/vogue/query',
  deleteVogue: BaseURL + '/vogue/delete'
};
