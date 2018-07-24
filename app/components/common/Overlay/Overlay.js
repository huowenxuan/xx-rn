// Overlay.js

'use strict';

import React, {PureComponent} from 'react'
import TopView from './TopView';

export default class Overlay {
  static show(element, type) {
    return TopView.show(element, type);
  }

  static dismissTop() {
    TopView.dismissTop()
  }

  static dismissWithKey(key) {
    TopView.dismissWithKey(key)
  }

  static dismissWithType(type) {
    TopView.dismissWithType(type)
  }

  static dismisshideAll() {
    TopView.dismissAll()
  }
}

/**
 * 将Overlay Component转换为类
 * @param params: {overlayType, overlay, overlayProps, argsRest2Obj}
 * overlayType 为覆盖物的类型，可用于该类型的统一消失
 * overlay为OverlayView或其子类，用于包裹覆盖物，配置动画
 * overlayProps为OverlayView的参数
 * argsRest2Obj：参数类型的转换。例如(text, sec)=>({text, sec})
 */
export function overlayComponent(params) {
  const {overlayType, overlay, overlayProps, argsRest2Obj} = params
  return (WrappedComponent) => {
    let componentRef = null

    return class Func {
      key = null;

      static _create(props) {
        let OverlayView = overlay
        return (
          <OverlayView {...(overlayProps || {})}>
            <WrappedComponent
              {...props}
              ref={ref => componentRef = ref}
              dismiss={() => this.dismiss()}
            />
          </OverlayView>
        )
      }

      /**
       * 同一个实例，如果正在显示，就更新当前的参数，不重新创建。如果没在显示，就创建新的
       */
      show(...params) {
        if (this.key && componentRef) {
          componentRef.update(argsRest2Obj(...params))
        } else {
          this.key = Overlay.show(Func._create(argsRest2Obj(...params)), overlayType);
        }
        return this.key;
      }

      /**
       * 让这个实例消失
       */
      dismiss() {
        Overlay.dismissWithKey(this.key);
        this.key = null
        componentRef = null
      }

      /**
       * 静态方法，每次调用都为该类型创建新的覆盖物
       */
      static show(...params) {
        if (componentRef) {
          componentRef.update(argsRest2Obj(...params))
        } else {
          Overlay.show(Func._create(argsRest2Obj(...params)), overlayType);
        }
      }

      /**
       * 静态方法，让该类型的所有覆盖物消失
       */
      static dismiss() {
        Overlay.dismissWithType(overlayType);
        componentRef = null
      }
    }
  }
}

/**
 * 所有Overlay Component的基类，自动实现了update
 * 子类都要实现 this.state = {...props}，然后通过this.state来获取props
 * 子类可调用 this.props.dismiss() 来让自己消失
 *
 // 以Loading为例
 @overlayComponent({   👈👈👈
  overlayType: 'Loading',
  overlay: OverlayViewFade,
  overlayProps: {shouldBackPressDisappear: false},
 })
 class Loading extends OverlayComponent {  👈👈👈
  constructor(props) {
    super(props)
    this.state = {...props}  👈👈👈
  }

  static defaultProps = {
    text: 'loading'
  }

  render() {
    const {text} = this.state 👈👈👈
    return ...
  }
 }
 */
export class OverlayComponent extends PureComponent{
  update(...newProps) {
    this.setState({
      ...newProps
    })
  }
}