'use strict'

import React, {PureComponent} from 'react';
import ReactNative, {
  Animated,
  Platform
} from 'react-native';

import CustomSS from '../CustomStyleSheet'
import OverlayView from './OverlayView'
import {SCREEN_HEIGHT} from '../../../const'

/**
 * 从上掉下，再掉落
 */
export default class OverlayViewDrapDown extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      upTop: new Animated.Value(-SCREEN_HEIGHT),
      fadeOpacity: new Animated.Value(0)
    }
  }

  appear() {
    Animated.parallel([
      Animated.timing(this.state.fadeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.spring(this.state.upTop, {
        toValue: 0,
        speed: 7,
        bounciness: 8,
        useNativeDriver: true
      })
    ]).start()
  }

  disappear() {
    Animated.parallel([
      Animated.timing(this.state.fadeOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(this.state.upTop, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => super.onDisappearCompleted())
  }

  render() {
    return (
      <Animated.View style={[
        styles.container,
        this.props.style,
        {opacity: this.state.fadeOpacity}
      ]}>
        <Animated.View style={[styles.main, {transform: [{translateY: this.state.upTop}]}]}>
          {this.props.children}
        </Animated.View>
      </Animated.View>
    )
  }
}

let styles = CustomSS.create({
  container: {
    backgroundColor: '#00000030',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  main: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT
  }
})