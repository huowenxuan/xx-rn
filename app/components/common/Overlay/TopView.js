// TopView.js

'use strict';

import React, {Children, PureComponent, Component} from "react";
import PropTypes from 'prop-types'
import {StyleSheet, AppRegistry, DeviceEventEmitter, View, Animated} from 'react-native';
import md5 from 'md5'
import {Provider} from 'react-redux';
import {store} from '../../../models'

function randomString() {
  let str = new Date() + Math.random().toString(36).substr(2)
  return md5(str)
}

class StaticContainer extends Component {
  static propTypes = {
    shouldUpdate: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  }

  render() {
    const child = this.props.children;
    return (child === null || child === false) ? null : Children.only(child)
  }
}

export default class TopView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      elements: [],
    };
  }

  componentWillMount() {
    this._show = this._show.bind(this)
    // 必须在willMount中，如果开始运行后马上显示，在didMount中就无法显示出来，需要延迟显示
    DeviceEventEmitter.addListener("showOverlay", this._show);
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener("showOverlay", this._show);
  }

  static show(element, type) {
    let _key = randomString()
    setImmediate(() => DeviceEventEmitter.emit("showOverlay", {_key, element, type}))
    return _key;
  }

  static dismissTop() {
    setImmediate(() => DeviceEventEmitter.emit("dismissOverlayTop", {}))
  }

  static dismissWithKey(_key) {
    setImmediate(() => DeviceEventEmitter.emit("dismissOverlayWithKey", {_key}))
  }

  static dismissWithType(type) {
    setImmediate(() => DeviceEventEmitter.emit("dismissOverlayWithType", {type}))
  }

  static dismissAll() {
    setImmediate(() => DeviceEventEmitter.emit("dismissAllOverlay", {}))
  }

  _show(e) {
    let elements = [...this.state.elements];
    elements.push(e);
    this.setState({elements});
  }

  _update(e) {
    let elements = [...this.state.elements];
    elements.forEach(item => {
      if (item._key === e.key) {
        item.element = e.element
      }
    })
    this.setState({elements})
  }

  _dismissWithKey(_key) {
    let elements = [...this.state.elements];
    for (let i = elements.length - 1; i >= 0; --i) {
      if (elements[i]._key === _key) {
        elements.splice(i, 1);
        break;
      }
    }
    this.setState({elements});
  }

  render() {
    let {elements} = this.state;

    let elementComponents = []
    elements.forEach((item) => {
      elementComponents.push(
        <View
          key={'topView' + item._key}
          style={styles.overlay}
          pointerEvents='box-none'
        >
          {
            React.cloneElement(item.element, {
              _key: item._key,
              type: item.type,
              allKeys: elements.map((item) => item._key),
              onDisappearCompleted: () => {
                this._dismissWithKey(item._key)
              }
            })
          }
        </View>
      )
    })

    return (
      <Provider store={store}>
        <View style={{backgroundColor: 'transparent', flex: 1}}>
          {/* 不允许更新 否则app页面会强制刷新 */}
          <StaticContainer shouldUpdate={false}>
            {this.props.children}
          </StaticContainer>

          {elementComponents}
        </View>
      </Provider>
    )
  }
}

const originRegister = AppRegistry.registerComponent;
AppRegistry.registerComponent = function (appKey, getAppComponent) {
  return originRegister(appKey, function () {
    const OriginAppComponent = getAppComponent();
    return (props) => (
      <TopView>
        <OriginAppComponent {...props} />
      </TopView>
    )
  });
}

let styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
