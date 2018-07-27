/**
 * @flow
 */

import React, {PureComponent} from 'react'
import {
  View,
  FlatList, ScrollView,
  RefreshControl,
  TextInput, StyleSheet, ActivityIndicator,
  Animated,
  Linking,
  Clipboard, Image,
  Alert,
  CameraRoll, TouchableOpacity,
} from 'react-native'
import {
  Button,
  Text, Fab, Label,
  Container, Thumbnail,
  Content, Header, Badge, DeckSwiper, Card, CardItem,
  Body, Title, Toast, Subtitle, Right, Icon, Left
} from 'native-base'

import {
  CustomSS,
  Loading,
  HOC,
  FlowTypes,
  ActionSheet,
  FadeInImage,
} from '../components/common'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import _ from 'lodash'
import dayjs from 'dayjs'
import * as utils from '../utils'
import Permissions from '../utils/Permissions'
import FastImage from 'react-native-fast-image'
import * as images from '../images'
import API from '../services/API'
import {SCREEN_WIDTH} from '../const'
import * as Storage from '../utils/storage'

const {page} = HOC
type Props = FlowTypes.Container & {}
type State = {}

@page()
export default class extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      title: '',
      category: '',
      images: [],
      xEnable: false
    }
  }

  componentDidMount() {
    // Storage.saveX()
    Storage.loadX().then((x) => {
      if (x) {
        this.setState({xEnable: true})
      }
    })

    this._query(true)
    this.timer = setInterval(() => {
      const {images} = this.state
      if (images && images.length >= 9) {
        clearInterval(this.timer)
        return
      }
      this._query(true)
    }, 20000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  showToast(text, type = 'success') {
    Toast.show({
      text,
      buttonText: 'Okay',
      type,
      duration: 3000,
      position: 'top'
    })
  }

  _query = async (toast) => {
    try {
      const {dispatch, types, router} = this.props
      let res = await dispatch(types.vogue.query)
      const {images, category, title, updatedAt} = res
      this.setState({category, title, images, updatedAt})
      toast && this.showToast(`${images.length} pictures`)
    } catch (e) {
      toast && this.showToast('查询失败', 'danger')
    }
  }

  _delete = async () => {
    let doDelete = async () => {
      try {
        const {dispatch, types, router} = this.props
        await dispatch(types.vogue.delete)
        this.showToast('删除成功')
        this._query(false)
      } catch (e) {
        this.showToast('删除失败', 'danger')
      }
    }
    Alert.alert('删除？', '', [
      {text: '是', onPress: doDelete},
      {text: '否'}
    ])
  }

  _openWeibo = () => {
    this._copy()
    Linking.openURL('sinaweibo://')
  }

  _copy = () => {
    const {category, title} = this.state
    if (!category || !title) return

    let str = `${category} ${title}`
    Clipboard.setString(str)
    this.showToast(`拷贝 ${str} 到剪贴板`)
  }

  _save9 = async () => {
    const {images} = this.state
    await Permissions.requestPhotoAndExternalStorage()
    let nineImages = images.splice(0, 9)
    let index = 0
    for (let image of nineImages) {
      index++
      this.showToast(`正在下载第${index}张图片`)
      await CameraRoll.saveToCameraRoll(image.url)
    }
    this.showToast('保存成功')
  }

  async _saveOne(url) {
    await Permissions.requestPhotoAndExternalStorage()
    await CameraRoll.saveToCameraRoll(url)
    this.showToast('保存成功')
  }

  _renderCardImage(uri, width, height, single) {
    const {images: imgs} = this.state
    let index = imgs.map(img => img.url).indexOf(uri)

    return (
      <FastImage resizeMode={single ? 'contain' : 'cover'} style={{height, width}} source={{uri}}>
        <Label style={{margin: 5, fontSize: 12, color: 'gray'}}>{index + 1}</Label>
        <TouchableOpacity
          onPress={() => this._saveOne(uri)}
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
      </FastImage>
    )
  }

  _renderCards() {
    const {title, category, images, updatedAt} = this.state
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

  _renderHeader() {
    const {title, category, images, updatedAt} = this.state

    let addZero = (n) => n < 10 ? `0${n}` : n
    let day = dayjs(updatedAt)
    let time = updatedAt
      ? `${addZero(day.month() + 1)}-${addZero(day.date())} ${addZero(day.hour())}:${addZero(day.minute())}`
      : ''

    return (
      <Header transparent>
        <Left/>
        <Body>
        <Title>{category} {title}</Title>
        <Subtitle>{time}</Subtitle>
        </Body>

        <Right>
          {!!this.state.xEnable && <Button transparent onPress={() => this.props.router.toX()}>
            <Text>
              ·
            </Text>
          </Button>}
        </Right>
      </Header>
    )
  }

  render() {
    const {title, category, images, updatedAt} = this.state
    return (
      <Container>
        {this._renderHeader()}

        <View style={{flex: 1}}>
          {this._renderCards()}
          <Fab
            active={true}
            direction="right"
            containerStyle={{}}
            style={{backgroundColor: '#5067FF'}}
            position="bottomLeft"
            onPress={() => this._query(true)}
          >
            <Icon name="refresh"/>
            {images && images.length >= 9 && (
              <Button onPress={this._save9} style={{backgroundColor: '#3B5998'}}>
                <Icon name="md-download" type='Ionicons'/>
              </Button>
            )}
            <Button onPress={this._openWeibo} style={{backgroundColor: '#F08650'}}>
              <Icon name="weibo" type='FontAwesome'/>
            </Button>
            <Button
              onPress={() => utils.openBrowser(API.voguePage)}
              style={{backgroundColor: '#409AE2'}}>
              <Icon name="web" type='MaterialCommunityIcons'/>
            </Button>
            <Button
              onPress={this._delete}
              style={{backgroundColor: '#DD5144'}}>
              <Icon name="trash" type={'Entypo'}/>
            </Button>
          </Fab>
        </View>
      </Container>
    )
  }
}

let styles = CustomSS.create({})
