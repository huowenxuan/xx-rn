/**
 * @flow
 */

import React from 'react'
import {
  ToastAndroid,
  Platform,
  Text,
  View,
  Animated
} from 'react-native'

import CustomSS from './CustomStyleSheet'
import {SCREEN_HEIGHT, SCREEN_WIDTH, Colors, Types, Tabs, Events} from '../../const'
import {OverlayView, overlayComponent, OverlayComponent} from './Overlay'

class OverlayViewToast extends OverlayView {
  constructor(props) {
    super(props)
    this.state = {
      fadeOpacity: new Animated.Value(0),
      // translateY: new Animated.Value(SCREEN_HEIGHT + 50)
      translateY: new Animated.Value(-50)
    }
  }

  appear() {
    Animated.parallel([
      Animated.spring(this.state.translateY, {
        // toValue: SCREEN_HEIGHT - 120,
        toValue: 50,
        speed: 12,
        bounciness: 8,
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
    }).start(()=> super.onDisappearCompleted())
  }

  render() {
    return (
      <Animated.View
        style={[styles.toastContainer, {
          opacity: this.state.fadeOpacity,
          transform: [{translateY: this.state.translateY}]
        }]}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

@overlayComponent({
  overlay: OverlayViewToast,
  overlayProps: {shouldBackPressDisappear: false},
  overlayType: 'Toast',
  argsRest2Obj: (text, second)=>{
    return {text, second}
  }
})
export default class Toast extends OverlayComponent {
  constructor(props) {
    super(props)
    this.state = {...props}
  }

  static defaultProps = {
    text: '错误',
    second: 2
  }

  componentDidMount() {
    setTimeout(()=>{
      this.props.dismiss()
    }, this.state.second * 1000)
  }

  render() {
    const shadow = true
    const {text} = this.state
    return (
      <View style={[styles.textBox, shadow && styles.shadowStyle]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    )
  }
}


let styles = CustomSS.create({
  toastContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    paddingHorizontal: 14,
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  textBox: {
    backgroundColor: '#000000aa',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 25
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 10
  },
  text: {
    color: 'white',
    textAlign: 'center'
  }
})