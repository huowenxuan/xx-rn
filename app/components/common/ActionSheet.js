'use strict'

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Platform
} from 'react-native'

import {SCREEN_HEIGHT, SCREEN_WIDTH, Colors} from '../../const'
import OpacityButton from './OpacityButton'
import CustomSS from './CustomStyleSheet'
import {OverlayComponent, overlayComponent, OverlayViewPopup} from "./Overlay";

@overlayComponent({
  overlay: OverlayViewPopup,
  overlayType: 'ActionSheet',
  argsRest2Obj: (buttons)=>({buttons})
})
export default class ActionSheet extends OverlayComponent {
  constructor(props) {
    super(props)

    this.state = {
      ...props
    }
  }

  static defaultProps = {
    buttons: []
  }

  static propTypes = {
    buttons: PropTypes.array.isRequired
  }

  _renderOneButton(data) {
    return (
      <OpacityButton
        onPress={this._onButtonPress.bind(this, data.onPress)}
        style={styles.button}
      >
        <Text
          numberOfLines={1}
          style={[styles.buttonText, {color: data.textColor || '#0076FF'}]}
        >
          {data.text}
        </Text>
      </OpacityButton>
    )
  }

  _onButtonPress(onPress) {
    this.props.dismiss()
    onPress && onPress()
  }

  _dismiss() {
    this.props.dismiss()
  }

  render() {
    const {buttons} = this.state
    return (
      <View style={styles.container}>
        <OpacityButton
          onPress={this._dismiss.bind(this)}
          style={{flex: 1}}
        />

        <View style={styles.main}>
          {buttons.map((button, i) => (
            <View key={i}>
              <View style={styles.buttonBox}>
                {this._renderOneButton(button)}
              </View>
              <View style={styles.line}/>
            </View>
          ))}
        </View>

        <View style={styles.cancelButtonBox}>
          {this._renderOneButton({text: '取消'})}
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
    right: 0
  },
  main: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
  },
  line: {
    backgroundColor: '#D8D8D8',
    height: 0.5,
    width: SCREEN_WIDTH
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cancelButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 10
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    color: '#0076FF',
  }
})