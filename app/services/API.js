/**
 * 全局路由
 */

let TestUrl = 'http://localhost:3000/api'
let BaseURL = 'https://www.huowenxuan.top/api' // 正式

// BaseURL = TestUrl

module.exports = {
  queryVogue: BaseURL + '/vogue/query',
  deleteVogue: BaseURL + '/vogue/delete'
};
