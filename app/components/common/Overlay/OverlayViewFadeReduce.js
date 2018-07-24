'use strict'

import React, {PureComponent} from 'react';
import {
  Animated,
} from 'react-native';

import CustomSS from '../CustomStyleSheet'
import OverlayView from './OverlayView'

/**
 * 渐现缩小，类似iOS alert
 */
export default class OverlayViewFade extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      fadeOpacity: new Animated.Value(0),
      scale: new Animated.Value(1.2)
    }
  }

  appear() {
    Animated.parallel([
      Animated.timing(this.state.scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(this.state.fadeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start()
  }

  disappear() {
    Animated.timing(this.state.fadeOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => super.onDisappearCompleted())
  }

  render() {
    return (
      <Animated.View style={[
        styles.container,
        this.props.style,
        {
          opacity: this.state.fadeOpacity,
          transform: [{scale: this.state.scale}]
        }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

let styles = CustomSS.create({
  container: {
    backgroundColor: '#00000050',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
})