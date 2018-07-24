import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';
import _ from 'lodash'

AppRegistry.registerComponent('xx', () => App);

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader requires main queue setup',
  'Module RNFetchBlob requires main queue setup',
  'Module AudioRecorderManager requires main queue setup',
  'Module RCTVideoManager requires main queue setup',
  'Class RCTCxxModule was not exported',
  'RCTBridge required dispatch_sync to load RCTDevLoadingView.'
])

if (!__DEV__) {
  console.log = _.noop
  console.warn = _.noop
  console.error = _.noop
}
