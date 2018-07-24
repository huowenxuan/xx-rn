import React, {PureComponent, Component} from 'react';
import {
  BackHandler,
  ToastAndroid
} from 'react-native';

import {connect} from 'react-redux'
import dayjs from 'dayjs'
import _ from 'lodash'
import {createAction} from '../../models/helper'
import {types} from '../../models'
import Router from '../../router'

/**
 * connect，只用于一定要使用redux的组件，container不可以使用
 */
export const reduxConnect = () => {
  return (WrappedComponent) => {
    return connect(
      state => ({state}),
      dispatch => ({
        types,
        dispatch: (type, payload) => {
          return new Promise((resolve, reject) => {
            dispatch(createAction(type)(payload, resolve, reject))
          })
        }
      })
    )(WrappedComponent)
  }
}

/**
 * 容器高阶组件
 * otherProps:
 *   shouldBackPressExit: true, false, // 按下android返回键是否退出app，如果不退出就pop
 *
 */
export const page = (otherProps = {}) => {
  return (Container) => {
    class WrappedComponent extends PureComponent {
      componentWillMount() {
        super.componentWillMount && super.componentWillMount()

        const {shouldBackPressExit} = otherProps
        this.onBackAndroidExit = this.onBackAndroidExit.bind(this)
        this.onBackAndroidPop = this.onBackAndroidPop.bind(this)

        if (shouldBackPressExit) {
          BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidExit);
        } else {
          BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidPop);
        }
      }

      componentWillUnmount() {
        super.componentWillUnmount && super.componentWillUnmount()
        const {shouldBackPressExit} = otherProps

        if (shouldBackPressExit) {
          BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidExit);
        } else {
          BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidPop);
        }
      }

      onBackAndroidPop() {
        Router.pop()
        return true
      }

      onBackAndroidExit = () => {
        if (this.lastBackPressed) {
          let sec2Later = dayjs(this.lastBackPressed).add(2, 's').toDate()
          if (sec2Later > new Date()) {
            return false;
          }
        }

        this.lastBackPressed = new Date();
        ToastAndroid.show('再按一次返回键退出', ToastAndroid.SHORT)
        return true;
      };

      render() {
        let params = {}
        if (_.has(this.props, 'navigation.state.params')) {
          params = this.props.navigation.state.params
        }
        return (
          <Container
            {...this.props}
            {...params}
            router={Router}
          />
        )
      }
    }

    return reduxConnect()(WrappedComponent)
  }
}
