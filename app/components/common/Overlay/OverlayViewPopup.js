'use strict'

import React, {PureComponent} from 'react';
import {
  Animated,
  Platform
} from 'react-native';

import PropTypes from 'prop-types'
import CustomSS from '../CustomStyleSheet'
import OverlayView from './OverlayView'
import {SCREEN_HEIGHT} from '../../../const'

/**
 * 从下弹出，再掉落
 */
export default class OverlayViewPopup extends OverlayView {
  constructor(props) {
    super(props)

    this.state = {
      upTop: new Animated.Value(SCREEN_HEIGHT),
      fadeOpacity: new Animated.Value(0)
    }
  }

  static propTypes = {
    disabledBounces: PropTypes.bool,
    disabledOpacity: PropTypes.bool,
    animationDuration: PropTypes.number
  }

  static defaultProps = {
    animationDuration: 200,
    disabledBounces: false,
    disabledOpacity: false
  }

  appear() {
    const {disabledBounces, disabledOpacity, animationDuration} = this.props
    let topAnimation = disabledBounces ? Animated.timing : Animated.spring
    Animated.parallel([
      Animated.timing(this.state.fadeOpacity, {
        toValue: 1,
        duration: disabledOpacity ? 0 : animationDuration,
        useNativeDriver: true
      }),
      topAnimation(this.state.upTop, {
        toValue: 0,
        speed: 7,
        bounciness: 6,
        duration: animationDuration,
        useNativeDriver: true
      })
    ]).start()
  }

  disappear() {
    const {disabledBounces, disabledOpacity, animationDuration} = this.props
    Animated.parallel([
      Animated.timing(this.state.fadeOpacity, {
        toValue: disabledOpacity ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true
      }),
      Animated.timing(this.state.upTop, {
        toValue: SCREEN_HEIGHT,
        duration: animationDuration,
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