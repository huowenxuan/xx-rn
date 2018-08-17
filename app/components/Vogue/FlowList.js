'use strict';

import React, {PureComponent} from 'react'
import {
  ListView,
  View,
  ActivityIndicator,
  Platform, TouchableOpacity
} from 'react-native'

import {SCREEN_WIDTH, SCREEN_HEIGHT, Colors} from '../../const'
import CustomSS from '../common/CustomStyleSheet'
import {ProgressiveImage} from "../common";
import {Body, Card, CardItem, DeckSwiper, Label, Subtitle, Title} from "native-base";
import FastImage from "react-native-fast-image";
import * as images from "../../images";

export default class DeckSwiperList extends PureComponent {
  constructor(props) {
    super(props)
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
  }

  _renderRow(rowData, _, rowId) {
    let index = parseInt(rowId)
    const {url} = rowData

    let space = 4
    let col = 3
    let width = (SCREEN_WIDTH - space * (col - 1)) / col - 0.05
    let height = width * 3 / 2
    let marginLeft = index % 3 === 0 ? 0 : space
    let marginTop = parseInt(index / 3) === 0 ? 0 : space

    return (
      <View style={{width, height, marginLeft, marginTop}}>
        <ProgressiveImage
          style={{height, width}}
          source={{url}}
          thumb={{uri: url + '?imageView2/0/w/100/h/100'}}
        >
          <TouchableOpacity
            onPress={() => this.props.saveImage(url)}
            style={{
              position: 'absolute', height: 30, width: 30, bottom: 0, right: 0,
              alignItems: 'center', justifyContent: 'center',
            }}>
            <FastImage source={images.CIRCLE} style={{opacity: 0.5, width: 15, height: 15}}/>
          </TouchableOpacity>
        </ProgressiveImage>
      </View>
    )
  }

  render() {
    const {title, category, images} = this.props

    return (
      <ListView
        {...this.props}
        initialListSize={50}
        contentContainerStyle={styles.listContainer}
        enableEmptySections={true}
        dataSource={this.dataSource.cloneWithRows(images)}
        renderRow={this._renderRow.bind(this)}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}

let styles = CustomSS.create({
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});