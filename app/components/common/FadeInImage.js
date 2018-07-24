import React, {PureComponent} from 'react'
import {Animated, View} from "react-native";


const duration = 300
export default class FadeInImage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      thumbnailOpacity: new Animated.Value(1)
    }
  }

  onLoad = () => {
    if (this.state.thumbnailOpacity._value === 0) {
      return
    }
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration
    }).start()
  }

  onThumbnailLoad = () => {
    if (this.state.thumbnailOpacity._value === 1) {
      return
    }
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      useNativeDriver: true,
      duration,
    }).start()
  }

  render() {
    const {src, placeholder, style} = this.props
    return (
      <View style={{width: style.width, height: style.height,}}>
        <Animated.Image
          style={[style, {position: 'absolute'}]}
          source={src}
          onLoad={this.onLoad}
        />
        <Animated.Image
          style={[style, {
            opacity: this.state.thumbnailOpacity,
          }]}
          source={placeholder}
          onLoad={this.onThumbnailLoad}
        />
      </View>
    )
  }
}
