'use strict'

import {
  Dimensions,
  Platform, StyleSheet
} from 'react-native'

const Colors = {
  TINT: '#D75F49', // 主题色，用于底部菜单、图标、突出显示等方面
  BACKGROUND_GRAY: '#F4F4F4', // 用于大面积底色，分隔条等区块
  BUTTON_LIGHT: '#4990E2', // 用于链接、按钮等操作
  TEXT_NORMAL: '#656565', // 用于正文字体的颜色
  TEXT_TITLE: '#000000', // 用于标题、醒目的字体的颜色
  TEXT_DARK: '#9B9B9B', // 用于不太突出的字或图标
  TEXT_PRICE: '#F29B4C', // 价格
  LINE: '#F8F8F8',

  Primary: '#488aff',
  Secondary: '#32db64',
  Danger: '#f53d3d',
  PrimaryPress: '#488affa0',
  SecondaryPress: '#32db64a0',
  DangerPress: '#f53d3da0',
}

const Strings = {
  Description: '鹿小圈－专业的社群管理工具',
  HTMLStyleString: `<style type="text/css">* {font-family: Arial, Helvetica, sans-serif; line-height: 30px;} h1 {line-height: 35px;}</style>`
}

const Types = {
  SHARE_APP: 'SHARE_APP',
  SHARE_BOARD: 'SHARE_BOARD',
  SHARE_TOPIC: 'SHARE_TOPIC',
  SHARE_EVENT: 'SHARE_EVENT',
  SHARE_SIGN: 'SHARE_SIGN',

  USER_LIST_FOLLOW: 'USER_LIST_FOLLOW', // 关注
  USER_LIST_FANS: 'USER_LIST_FANS', // 粉丝
  USER_LIST_EVENT_ENROLL: 'USER_LIST_EVENT_ENROLL', // 活动报名成功的用户
  USER_LIST_BOARD_MEMBER: 'USER_LIST_BOARD_MEMBER',
  USER_LIST_TOPIC_LIKE: 'USER_LIST_TOPIC_LIKE',
}

const Tabs = {
  BOARD: 'BOARD',
  EVENT: 'EVENT',
  MESSAGE: 'MESSAGE',
  MY: 'MY'
}

const Events = {
  ON_TAB_SELECTED: 'ON_TAB_SELECTED',
  ON_TAB_RESELECTED: 'ON_TAB_RESELECTED',
  ON_RECEIVED_FILES_IOS: 'ON_RECEIVED_FILES_IOS',
}

const Values = {
  minLineWidth: StyleSheet.hairlineWidth,
}

const Devices = {
}

const Configs = {

}

module.exports = {
  Colors,
  Strings,
  Types,
  Tabs,
  Events,
  Values,
  Devices,
  Configs,

  SCREEN_WIDTH: Dimensions.get('window').width,
  // 在android >= 5.0开启了沉浸式状态栏，5.0之下的版本不支持，高度要减掉20
  SCREEN_HEIGHT: Dimensions.get('window').height
}