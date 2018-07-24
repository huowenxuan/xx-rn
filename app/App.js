/**
 * @flow
 */

import React, {PureComponent} from 'react';
import {View} from 'react-native'
import {Navigator, setNavigatorRef} from './router'
import {Provider} from 'react-redux'
import {store} from './models'
import {Root} from "native-base";

type Props = {}
export default class App extends PureComponent<Props> {
  navigator = Navigator('Login')

  constructor(props: Props) {
    super(props)
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    let Navigator = this.navigator
    return (
      <Provider store={store}>
        <Root>
          <Navigator ref={ref => setNavigatorRef(ref)}/>
        </Root>
      </Provider>
    )
  }
}
