'use strict';

import React from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import {SCREEN_WIDTH, SCREEN_HEIGHT, Colors} from '../../const'
import CustomSS from './CustomStyleSheet'

export default CustomSS.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_GRAY,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

