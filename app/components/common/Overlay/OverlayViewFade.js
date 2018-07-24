'use strict'

import React, {PureComponent} from 'react';
import ReactNative, {
  Animated,
} from 'react-native';

import CustomSS from '../CustomStyleSheet'
import OverlayView from './OverlayView'

/**
 * 渐现
 */
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      fadeOpacity: new Animated.Value(0)
    }
  }

  appear() {
    Animated.timing(this.state.fadeOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start()
  }

  disappear() {
    Animated.timing(this.state.fadeOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(()=> super.onDisappearCompleted())
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.props.style, {opacity: this.state.fadeOpacity}]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

let styles = CustomSS.create({
  container: {
    backgroundColor: '#00000030',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
})