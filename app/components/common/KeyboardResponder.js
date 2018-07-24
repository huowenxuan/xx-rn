'use strict'

import React from 'react'
import {
  Platform,
  View
} from 'react-native'

import {KeyboardAwareListView, KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import KeyboardSpacer from 'react-native-keyboard-spacer'

module.exports = {
  ScrollView: KeyboardAwareScrollView,
  ListView: KeyboardAwareListView,
  Spacer: Platform.OS === 'ios' ? KeyboardSpacer : View
}