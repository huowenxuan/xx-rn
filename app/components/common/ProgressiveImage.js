import React, {Component} from 'react'
import {Animated, View, StyleSheet, ActivityIndicator, Image} from 'react-native'
import FastImage from 'react-native-fast-image'
import {BlurView} from 'react-native-blur'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)

export default class ProgressiveImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageOpacity: new Animated.Value(0),
    }
  }

  onLoadImage() {
    Animated.timing(this.state.imageOpacity, {
      toValue: 1,
      duration: 400,
    }).start()
  }

  render() {
    return (
      <View style={[this.props.style]}>
        <AnimatedFastImage
          resizeMode={this.props.resizeMode || 'cover'}
          style={[styles.image, this.props.style]}
          source={this.props.thumb}
        />

        <BlurView blurType="light" blurAmount={7} style={{flex: 1}}/>

        <View style={[styles.image, {alignItems: 'center', justifyContent:'center'}]}>
          <ActivityIndicator color='#4a4a4a'/>
        </View>

        <AnimatedFastImage
          resizeMode={this.props.resizeMode || 'cover'}
          style={[styles.image, {opacity: this.state.imageOpacity}, this.props.style]}
          source={this.props.source}
          onLoad={() => this.onLoadImage()}
        />

        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

ProgressiveImage.defaultProps = {
  thumbnailFadeDuration: 250,
  imageFadeDuration: 250,
  thumbnailBlurRadius: 5,
  onLoadThumbnail: Function.prototype,
  onLoadImage: Function.prototype,
}
