import React, {PureComponent} from 'react';
import PropTypes from 'prop-types'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from 'react-native';

import CustomSS from './CustomStyleSheet'

/**
 * 小按钮、功能型按钮使用OpacityButton
 */
export default class OpacityButton extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  render() {
    return (
      <TouchableOpacity activeOpacity={0.6} {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

let styles = CustomSS.create({})