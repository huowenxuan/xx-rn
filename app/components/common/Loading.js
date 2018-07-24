'use strict';

import React, {PureComponent} from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  Platform
} from 'react-native'

import {SCREEN_WIDTH, SCREEN_HEIGHT, Colors} from '../../const'
import CustomSS from './CustomStyleSheet'
import {OverlayViewFade, overlayComponent, OverlayComponent} from './Overlay'

@overlayComponent({
  overlayType: 'Loading',
  overlay: OverlayViewFade,
  overlayProps: {shouldBackPressDisappear: false},
})
export default class Loading extends OverlayComponent {
  constructor(props) {
    super(props);
    this.state = {...props}
  }

  static defaultProps = {
    text: '加载中...',
    style: 'light'
  }

  render() {
    const {text, style} = this.state;

    let textColor = 'white';
    let bgColor = '#00000090';
    if (style === 'light') {
      textColor = Colors.TEXT_NORMAL;
      bgColor = '#F8F8F8';
    }

    return (
      <View style={styles.container}>
        <View style={[styles.box, {backgroundColor: bgColor}]}>
          <ActivityIndicator
            size={Platform.OS === 'ios' ? 'small' : 'small'}
            color={textColor}
            animating={true}
          />

          {!!text && <Text style={[styles.text, {color: textColor}]}>{text}</Text>}
        </View>
      </View>
    )
  }
}

let styles = CustomSS.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    flexDirection: 'row',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 15,
  }
});