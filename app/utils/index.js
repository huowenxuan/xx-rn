import {
  Linking, NativeModules,
  Platform
} from 'react-native'

let UtilsManager = NativeModules.UtilsManager;

export const delay = time => new Promise(resolve => setTimeout(resolve, time))

export function openBrowser(url) {
  if (!url.startsWith('http')) {
    url = 'http://' + url
  }
  if (Platform.OS === 'ios') {
    UtilsManager.showSafari(url)
  } else {
    Linking.openURL(url)
  }
}