// 必须先导入执行一个registerComponent
import './TopView'
import {overlayComponent, OverlayComponent} from './Overlay'
import OverlayView from './OverlayView'
import OverlayViewFadeReduce from './OverlayViewFadeReduce'
import OverlayViewFade from './OverlayViewFade'
import OverlayViewDrapDown from './OverlayViewDrapDown'
import OverlayViewPopup from './OverlayViewPopup'
// module.exports = {
//   createOverlay,
//   Overlay,
//   OverlayView,
//   OverlayViewFade,
//   OverlayViewFadeReduce,
//   OverlayViewDrapDown,
//   OverlayViewPopup
// };

export {
  overlayComponent,
  OverlayComponent,
  OverlayView,
  OverlayViewFade,
  OverlayViewFadeReduce,
  OverlayViewDrapDown,
  OverlayViewPopup
}

// export function Overlay() {
//   return require('./Overlay').default
// }
//
// export function OverlayView() {
//   return require('./OverlayView').default
// }
//
// export function createOverlay() {
//   let OverlayView = require('OverlayView')
//   return OverlayView.createOverlay
// }
//
// export function OverlayViewFadeReduce() {
//   return require('./OverlayViewFadeReduce').default
// }
//
// export function OverlayViewFade() {
//   return require('./OverlayViewFade').default
// }
//
// export function OverlayViewDrapDown() {
//   return require('./OverlayViewDrapDown').default
// }
//
// export function OverlayViewPopup() {
//   return require('./OverlayViewPopup').default
// }

// module.exports = {
//   get Overlay() {
//     return require('./Overlay').default
//   },
//
//   get OverlayView() {
//     return require('./OverlayView').default
//   },
//
//   get createOverlay() {
//     let OverlayView = require('./OverlayView')
//     return OverlayView.createOverlay
//   },
//
//   get OverlayViewFadeReduce() {
//     return require('./OverlayViewFadeReduce').default
//   },
//
//   get OverlayViewFade() {
//     return require('./OverlayViewFade').default
//   },
//
//   get OverlayViewDrapDown() {
//     return require('./OverlayViewDrapDown').default
//   },
//
//   get OverlayViewPopup() {
//     return require('./OverlayViewPopup').default
//   }
//
// }