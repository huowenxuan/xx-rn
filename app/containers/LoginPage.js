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
  Clipboard,
  Alert,
  CameraRoll
} from 'react-native'
import {
  Button,
  Text,
  Container,
  Content, Header,
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
      images: ''
    }
  }

  componentDidMount() {
    this._query(true)
    this.timer = setInterval(() => {
      this._query(true)
    }, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  _query = async (toast) => {
    try {
      const {dispatch, types, router} = this.props
      let res = await dispatch(types.vogue.query)
      const {images, category, title, updatedAt} = res
      this.setState({category, title, images, updatedAt})
      toast && Toast.show({
        text: `${images.length} pictures`,
        buttonText: 'Okay',
        type: 'success',
        duration: 3000
      })
    } catch (e) {
      toast && Toast.show({
        text: '查询失败',
        buttonText: 'Okay',
        type: 'danger'
      })
    }
  }

  _delete = async () => {
    let doDelete = async () => {
      try {
        const {dispatch, types, router} = this.props
        await dispatch(types.vogue.delete)
        Toast.show({
          text: `删除成功`,
          buttonText: 'Okay',
          type: 'danger'
        })
        this._query(false)
      } catch (e) {
        Toast.show({
          text: '删除失败',
          buttonText: 'Okay',
          type: 'danger'
        })
      }
    }
    Alert.alert('删除？', '', [
      {text: '是', onPress: doDelete},
      {text: '否'}
    ])
  }

  _copy = () => {
    const {category, title} = this.state
    if (!category || !title) return

    let str = `${category} ${title}`
    Clipboard.setString(str)
    Toast.show({
      text: `拷贝 ${str} 到剪贴板`,
      buttonText: 'Okay',
      type: 'success',
      duration: 3000
    })
  }

  _save = async () => {
    const {images} = this.state
    await Permissions.requestPhotoAndExternalStorage()
    let nineImages = images.splice(0, 9)
    let index = 0
    for (let image of nineImages) {
      index++
      Toast.show({
        text: `正在下载第${index}张图片`,
        buttonText: 'Okay',
        type: 'success',
        duration: 3000
      })
      await CameraRoll.saveToCameraRoll(image.url)
    }
    Toast.show({
      text: `保存成功`,
      buttonText: 'Okay',
      type: 'success',
      duration: 3000
    })
  }

  _renderImages() {
    const {images} = this.state
    if (!images || images.length < 9) return null

    return (
      <Button style={{marginTop: 14}} block success
              onPress={this._save}>
        <Text>一键保存9张图</Text>
      </Button>
    )
  }

  render() {
    const {title, category, images, updatedAt} = this.state

    let addZero = (n) => n < 10 ? `0${n}` : n
    let day = dayjs(updatedAt)
    let time = `${addZero(day.month() + 1)}.${addZero(day.date())}`

    return (
      <Container android>
        <Header transparent>
          <Body style={{alignItems: 'flex-start'}}>
          <Title>{category || 'VOGUE'}</Title>
          {!!title && <Subtitle style={{textAlign: 'left'}}>{title} - {time}</Subtitle>}
          </Body>

          <Right>
            <Button transparent onPress={this._copy}>
              <Icon name='copy'/>
            </Button>
          </Right>
        </Header>

        <Content padder>
          <Button block info onPress={() => this._query(true)}>
            <Text>查询</Text>
          </Button>

          {this._renderImages()}

          <Button style={{marginTop: 14}} block success
                  onPress={() => utils.openBrowser('https://huowenxuan.leanapp.cn/api/vogue/page')}>
            <Text>查看所有图片</Text>
          </Button>

          <Button style={{marginTop: 14}} block danger
                  onPress={() => Linking.openURL('sinaweibo://')}>
            <Text>打开微博</Text>
          </Button>

          <Button style={{marginTop: 50}} block danger
                  onPress={this._delete}>
            <Text>全部删除</Text>
          </Button>
        </Content>
      </Container>
    )
  }
}

let styles = CustomSS.create({})
