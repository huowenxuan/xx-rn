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
  ProgressiveImage
} from '../components/common'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import _ from 'lodash'
import moment from 'moment'
import * as utils from '../utils'
import Permissions from '../utils/Permissions'
import * as images from '../images'
import API from '../services/API'
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../const'
import * as Storage from '../utils/storage'

import DeckSwiperList from '../components/Vogue/DeckSwiperList'
import FlowList from '../components/Vogue/FlowList'
import OpacityButton from "../components/common/OpacityButton";

const {page} = HOC
type Props = FlowTypes.Container & {}
type State = {}

const AnimatedFab = Animated.createAnimatedComponent(Fab)
const fabUpBottom = 20
const fabDownBottom = -80

@page()
export default class extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.lastY = 0
    this.state = {
      title: '',
      category: '',
      images: [],
      isRefreshing: false,
      xEnable: false,
      fabBottom: new Animated.Value(fabUpBottom)
    }
  }

  componentDidMount() {
    // Storage.saveX()
    Storage.loadX().then((x) => {
      x && this.setState({xEnable: true})
    })

    this._query()
    this.timer = setInterval(() => {
      const {images} = this.state
      if (images && images.length >= 9) {
        clearInterval(this.timer)
        return
      }
      this._query()
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

  _query = async (isRefresh) => {
    isRefresh && this.setState({isRefreshing: true})

    // let images = [
    //   {
    //     filename: 'Ganni_001.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_001.jpg'
    //   },
    //   {
    //     filename: 'Ganni_002.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_002.jpg'
    //   },
    //   {
    //     filename: 'Ganni_003.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_003.jpg'
    //   },
    //   {
    //     filename: 'Ganni_004.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_004.jpg'
    //   },
    //   {
    //     filename: 'Ganni_005.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_005.jpg'
    //   },
    //   {
    //     filename: 'Ganni_006.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_006.jpg'
    //   },
    //   {
    //     filename: 'Ganni_007.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_007.jpg'
    //   },
    //   {
    //     filename: 'Ganni_008.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_008.jpg'
    //   },
    //   {
    //     filename: 'Ganni_009.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_009.jpg'
    //   },
    //   {
    //     filename: 'Ganni_010.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_010.jpg'
    //   },
    //   {
    //     filename: 'Ganni_011.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_011.jpg'
    //   },
    //   {
    //     filename: 'Ganni_012.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_012.jpg'
    //   },
    //   {
    //     filename: 'Ganni_013.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_013.jpg'
    //   },
    //   {
    //     filename: 'Ganni_014.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_014.jpg'
    //   },
    //   {
    //     filename: 'Ganni_015.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_015.jpg'
    //   },
    //   {
    //     filename: 'Ganni_016.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_016.jpg'
    //   },
    //   {
    //     filename: 'Ganni_017.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_017.jpg'
    //   },
    //   {
    //     filename: 'Ganni_018.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_018.jpg'
    //   },
    //   {
    //     filename: 'Ganni_019.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_019.jpg'
    //   },
    //   {
    //     filename: 'Ganni_020.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_020.jpg'
    //   },
    //   {
    //     filename: 'Ganni_021.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_021.jpg'
    //   },
    //   {
    //     filename: 'Ganni_022.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_022.jpg'
    //   },
    //   {
    //     filename: 'Ganni_023.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_023.jpg'
    //   },
    //   {
    //     filename: 'Ganni_024.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_024.jpg'
    //   },
    //   {
    //     filename: 'Ganni_025.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_025.jpg'
    //   },
    //   {
    //     filename: 'Ganni_026.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_026.jpg'
    //   },
    //   {
    //     filename: 'Ganni_027.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_027.jpg'
    //   },
    //   {
    //     filename: 'Ganni_028.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_028.jpg'
    //   },
    //   {
    //     filename: 'Ganni_029.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_029.jpg'
    //   },
    //   {
    //     filename: 'Ganni_030.jpg',
    //     url: 'http://pdl4ed6yf.bkt.clouddn.com/Ganni_030.jpg'
    //   }]
    // let title = 'Ganni'
    // let category = 'Copenhagen Spring 2019'
    // let updatedAt = '2018-08-17T05:00:38.016Z'
    // this.setState({images, title, category, updatedAt})
    // isRefresh && this.setState({isRefreshing: false})
    // return;

    try {
      const {dispatch, types, router} = this.props
      let res = await dispatch(types.vogue.query)
      const {images, category, title, updatedAt} = res
      this.setState({category, title, images, updatedAt})
      isRefresh && this.setState({isRefreshing: false})
      this.showToast(`${images.length} pictures`)
    } catch (e) {
      isRefresh && this.setState({isRefreshing: false})
      this.showToast('查询失败', 'danger')
    }
  }

  _delete = async () => {
    let doDelete = async () => {
      try {
        const {dispatch, types, router} = this.props
        await dispatch(types.vogue.delete)
        this.showToast('删除成功')
        this._query()
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

  async saveImage(url) {
    await Permissions.requestPhotoAndExternalStorage()
    await CameraRoll.saveToCameraRoll(url)
    this.showToast('保存成功')
  }

  _renderHeader() {
    const {title, category, updatedAt, images} = this.state

    return (
      <View style={{width: SCREEN_WIDTH, alignItems: 'center'}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.time}>{updatedAt && moment(updatedAt).fromNow()}</Text>

        {!!this.state.xEnable &&
        <Button style={styles.x} transparent onPress={() => this.props.router.toX()}>
          <Text>·</Text>
        </Button>}
      </View>
    )
  }

  _fabUp() {
    let {_value, _offset, _animation} = this.state.fabBottom
    const {_toValue} = _animation || {}
    if (_toValue === fabUpBottom)
      return

    this.state.fabBottom.stopAnimation(() => {
      Animated.timing(this.state.fabBottom, {
        duration: 300,
        toValue: fabUpBottom
      }).start()
    })

  }

  _fabDown() {
    let {_value, _offset, _animation} = this.state.fabBottom
    const {_toValue} = _animation || {}
    if (_toValue === fabDownBottom)
      return

    this.state.fabBottom.stopAnimation(() => {
      Animated.timing(this.state.fabBottom, {
        duration: 300,
        toValue: fabDownBottom
      }).start()
    })
  }

  render() {
    const {title, category, images, updatedAt} = this.state

    // DeckSwiperList 翻页相册  FlowList 三列瀑布
    let DataComponent = FlowList

    return (
      <Container>
        <View style={{flex: 1}}>
          <DataComponent
            title={title}
            category={category}
            images={images}
            saveImage={url => this.saveImage(url)}
            renderHeader={() => this._renderHeader()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._query.bind(this, true)}
              />
            }
            onScroll={({nativeEvent}) => {
              let {y} = nativeEvent.contentOffset
              let {height} = nativeEvent.contentSize

              if (y < 0)
                return

              if (this.lastY - y > 80) {
                this._fabUp()
                this.lastY = y
              } else if (y - this.lastY > 80) {
                this._fabDown()
                this.lastY = y
              }
            }}
          />

          <Animated.View style={[styles.fabs, {bottom: this.state.fabBottom}]}>
            {images && images.length >= 9 && (
              <OpacityButton
                rounded
                onPress={this._save9}
                style={[{backgroundColor: '#3B5998'}, styles.fabStyle]}
              >
                <Icon style={styles.fabIconStyle} name="md-download" type='Ionicons'/>
              </OpacityButton>
            )}
            <OpacityButton
              rounded
              onPress={this._openWeibo}
              style={[{backgroundColor: '#F08650'}, styles.fabStyle]}
            >
              <Icon style={styles.fabIconStyle} name="weibo" type='FontAwesome'/>
            </OpacityButton>

            <OpacityButton
              rounded
              onPress={() => utils.openBrowser(API.voguePage)}
              style={[{backgroundColor: '#409AE2'}, styles.fabStyle]}
            >
              <Icon style={styles.fabIconStyle} name="web" type='MaterialCommunityIcons'/>
            </OpacityButton>

            <OpacityButton
              rounded
              onPress={this._delete}
              style={[{backgroundColor: '#DD5144'}, styles.fabStyle]}
            >
              <Icon style={styles.fabIconStyle} name="trash" type={'Entypo'}/>
            </OpacityButton>
          </Animated.View>

          {title || (
            <View style={styles.loading}>
              <ActivityIndicator size='large' color='#E87A90'/>
            </View>
          )}
        </View>
      </Container>
    )
  }
}

const fabSize = 55
const fontFamily = 'Cochin'

let styles = CustomSS.create({
  title: {
    fontFamily, fontSize: 30, marginTop: 18
  },
  category: {
    fontFamily, fontSize: 14, marginTop: 12, color: '#4a4a4a',
  },
  time: {
    fontFamily, fontSize: 13, marginTop: 14, color: '#4a4a4a', marginBottom: 20
  },

  fabStyle: {
    width: fabSize, height: fabSize,
    marginHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: fabSize / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 10
  },
  fabIconStyle: {fontSize: 20, color: 'white', marginLeft: 4, marginRight: 4},
  fabs: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    width: SCREEN_WIDTH
  },
  loading: {
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },

  x: {
    position: 'absolute', right: 20, top: 20
  }
})
