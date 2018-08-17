import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
  NavigationActions,
  StackActions
} from 'react-navigation'
import _ from 'lodash'

import VoguePage from './containers/VoguePage'
import XPage from './containers/XPage'

export let _navigator;

export function setNavigatorRef(navigatorRef) {
  _navigator = navigatorRef
}

const scenes = {
  Vogue: {screen: VoguePage},
  X: {screen: XPage},
}

export const Navigator = (initialRouteName) => createStackNavigator(
  scenes,
  {
    initialRouteName,
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.spring,
      },
    }),
  }
)

export function pop() {
  _navigator.dispatch(StackActions.pop())
}

function push(routeName, params) {
  // 当路由栈的最后一个路由和即将push的路由的名字和参数完全一样，就不push
  if (_.has(_navigator, 'state.nav.routes')) {
    let routes = _navigator.state.nav.routes
    let last = routes[routes.length - 1]
    if (last.routeName !== routeName || JSON.stringify(last.params) !== JSON.stringify(params)) {
      _navigator.dispatch(StackActions.push({routeName, params}))
    }
  }
}

const router = {
  pop,
  toX: ()=>push('X')
}

export default router
