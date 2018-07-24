'use strict'

import React, {PureComponent} from 'react';
import {
  View,
  BackHandler,
  DeviceEventEmitter
} from 'react-native';

import CustomSS from '../CustomStyleSheet'

export default class OverlayView extends PureComponent {
  constructor(props) {
    super(props)
  }

  static defaultProps = {
    shouldBackPressDisappear: true
  }

  componentWillMount() {
    this.appear()

    this.dismissWithKey = this.dismissWithKey.bind(this)
    this.dismissWithType = this.dismissWithType.bind(this)
    this.dismissTop = this.dismissTop.bind(this)
    this.disappear = this.disappear.bind(this)
    DeviceEventEmitter.addListener("dismissOverlayWithKey", this.dismissWithKey);
    DeviceEventEmitter.addListener("dismissOverlayWithType", this.dismissWithType);
    DeviceEventEmitter.addListener("dismissOverlayTop", this.dismissTop);
    DeviceEventEmitter.addListener("dismissAllOverlay", this.disappear);

    this.onBackAndroidDisappear = this.onBackAndroidDisappear.bind(this)
    this.onBackAndroidNothing = this.onBackAndroidNothing.bind(this)

    if (this.props.shouldBackPressDisappear) {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidDisappear);
    } else {
      BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidNothing);
    }
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener("dismissOverlayWithKey", this.dismissWithKey);
    DeviceEventEmitter.removeListener("dismissOverlayTop", this.dismissTop);
    DeviceEventEmitter.removeListener("dismissAllOverlay", this.disappear);

    if (this.props.shouldBackPressDisappear) {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidDisappear);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidNothing);
    }
  }

  onBackAndroidDisappear() {
    this.disappear()
    return true
  }

  onBackAndroidNothing() {
    return true
  }

  dismissWithKey(e) {
    const {_key} = this.props
    if (e._key === _key) {
      this.disappear()
    }
  }

  dismissWithType(e) {
    const {type} = this.props
    if (type && e.type === type) {
      this.disappear()
    }
  }

  dismissTop() {
    const {_key, allKeys} = this.props
    if (allKeys[allKeys.length - 1] === _key) {
      this.disappear()
    }
  }

  // 子类写了appear会自动调用子类的appear
  appear() {
  }

  disappear() {
    this.onDisappearCompleted()
  }

  onDisappearCompleted() {
    const {onDisappearCompleted} = this.props
    onDisappearCompleted && onDisappearCompleted()
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

let styles = CustomSS.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
})