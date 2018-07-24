'use strict'

import {StyleSheet, Platform} from 'react-native'

const PlatformIOS = Platform.OS === 'ios'
const PlatformAndroid = Platform.OS === 'android'

function create(styles) {
  const platformStyles = {}
  Object.keys(styles).forEach((name) => {
    let {ios, android, ...style} = {...styles[name]}
    if (ios && PlatformIOS) {
      style = {...style, ...ios}
    }
    if (android && PlatformAndroid) {
      style = {...style, ...android}
    }
    platformStyles[name] = style

    if (style.color || style.fontWeight || style.fontSize || style.fontFamily) {
      if (PlatformAndroid && style.fontWeight === 'bold' && !style.fontFamily) {
        // delete style.fontWeight
        // style.fontFamily = 'SourceHanSansSC-Medium'
      }
    }
  })
  return StyleSheet.create(platformStyles)
}

module.exports = {
  create
}