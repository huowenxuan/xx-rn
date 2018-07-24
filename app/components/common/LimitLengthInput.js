/**
 * 限制输入汉字长度的输入框（英文字符需要 * 2）
 * 如果长度大于maxLength，多余的部分不输入
 * 判断长度是否小于minLength，需要调用isViable来验证
 * value属性不可以使用，内部会自动为value赋值，想要得到值可以通过onChangeText属性或者getValue方法
 *
 * android设置minHeight后即使文字超出，高度也不会改变，使用onChange来动态改变高度
 */

'use strict'

import React, {Component, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  Platform,
} from 'react-native'

const Android = Platform.OS === 'android'
export default class LimitLengthInput extends PureComponent {
  input = React.createRef()

  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue || '',
      height: 0,
      selectionAndroid: {start: 0, end: 0}
    }
  }

  static defaultProps = {
    defaultValue: '',
    maxSize: 10000,
    minSize: 0,
    disabledScroll: false
  }

  static propTypes = {
    defaultValue: PropTypes.string,
    maxSize: PropTypes.number,
    minSize: PropTypes.number,
    minHeight: PropTypes.number,
    onChangeText: PropTypes.func,
    disabledScroll: PropTypes.bool, // 多行下是否禁止滚动
  }

  componentWillMount() {
    const {defaultValue, onChangeText} = this.props
    if (defaultValue) {
      onChangeText && onChangeText(defaultValue)
    }
  }

  setValue(value) {
    this.setState({value: value || ''})
  }

  clear() {
    this.setState({value: ''})
  }

  getValue() {
    return this.state.value
  }

  _isEnglishChar(char) {
    let charCode = char.charCodeAt(0)
    return charCode >= 0 && charCode <= 128
  }

  // 判断输入是否大于最小值
  isMinViable() {
    const {value: text} = this.state
    let realLength = 0;
    for (let i = 0; i < text.length; i++) {
      if (this._isEnglishChar(text[i])) {
        realLength += 1;
      } else {
        realLength += 2;
      }
    }

    return realLength >= this.props.minSize * 2
  }

  // 当输入改变，限制多余的输入
  _onChangeText(text) {
    let showText = ''
    let length = 0;
    for (let i = 0; i < text.length; i++) {
      if (this._isEnglishChar(text[i])) {
        length++;
      } else {
        length += 2;
      }

      if (length <= this.props.maxSize * 2) {
        showText += text[i];
      } else {
        break;
      }
    }

    this.setState({value: text})
    console.log(this.state.value)
    this.props.onChangeText && this.props.onChangeText(showText)
  }

  focus() {
    this.input.current && this.input.current.focus()
  }

  blur() {
    this.input.current && this.input.current.blur()
  }

  render() {
    const {multiline, disabledScroll} = this.props
    return (
      <TextInput
        ref={this.input}
        underlineColorAndroid='transparent'
        placeholderTextColor='#9B9B9B'
        // autoCorrect={false}
        {...this.props}
        maxLength={10}
        // 只有在multiline才能设置scrollEnabled，否则会崩溃
        scrollEnabled={multiline && !disabledScroll}
        onChangeText={text => this._onChangeText(text)}
      />
    )
  }
}
