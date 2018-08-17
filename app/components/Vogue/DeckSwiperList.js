'use strict';

import React, {PureComponent} from 'react'
import {
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
    super(props);
  }

  _renderCardImage(uri, width, height, single) {
    const {images: imgs} = this.props
    let index = imgs.map(img => img.url).indexOf(uri)

    return (
      <View>
        <ProgressiveImage
          resizeMode={single ? 'contain' : 'cover'}
          style={{height, width}}
          source={{uri}}
          thumb={{uri: uri + '?imageView2/0/w/100/h/100'}}
        />
        <View style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>
          <Label style={{margin: 5, fontSize: 12, color: 'gray'}}>{index + 1}</Label>
          <TouchableOpacity
            onPress={() => this.props.saveImage(uri)}
            style={{
              position: 'absolute',
              height: 30,
              width: 30,
              bottom: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FastImage source={images.CIRCLE} style={{opacity: 0.5, width: 15, height: 15}}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const {title, category, images} = this.props
    // 如果刚开始没数据，后来有数据了，翻页不会显示下面的图片
    if (images.length < 3) return null

    let width = (SCREEN_WIDTH - 40) / 2 - 2.5
    let height = width * 3 / 2

    let data = []
    images.forEach((img, index) => {
      if (index % 2 === 0) { // left
        data.push([img])
      } else { // right
        data[parseInt(index / 2)].push(img)
      }
    })

    return (
      <View style={{paddingHorizontal: 20, height: height + 50 + 20}}>
        <DeckSwiper
          dataSource={data}
          renderItem={item =>
            <Card style={{elevation: 3}}>
              <CardItem>
                <Body style={{alignItems: 'center'}}>
                <Title>{category}</Title>
                {!!title && <Subtitle style={{textAlign: 'left'}}>{title}</Subtitle>}
                </Body>
              </CardItem>

              {item.length === 2 ? (
                <CardItem cardBody>
                  {this._renderCardImage(item[0].url, width, height)}
                  {this._renderCardImage(item[1].url, width, height)}
                </CardItem>
              ) : (
                <CardItem cardBody>
                  {this._renderCardImage(item[0].url, width * 2, height, true)}
                </CardItem>
              )}
            </Card>
          }
        />
      </View>
    )
  }
}

let styles = CustomSS.create({
});