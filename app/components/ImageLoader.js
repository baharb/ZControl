import React from 'react';

import { StyleSheet, AsyncStorage, Picker, View , Image, Dimensions, Animated} from 'react-native';
import { createStackNavigator, StackNavigator } from 'react-navigation';
import { Container, Content, Text, StyleProvider, Button, Header, Body, Left, Right, Icon, Title } from 'native-base';

export default class ImageLoader extends React.Component {
  constructor(props){
    super(props);
    this.state={
      opacity: new Animated.Value(0)
    }
  }

  onLoad= () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      userNativeDriver: true,
    }).start();
  }

  render() {
      return (
        <Animated.Image
          onLoad={this.onLoad}
          // {...this.props}
          style={[
            {

                opacity: this.state.opacity,
                transform: [
                  {
                    scale: this.state.opacity.interpolate[{
                      inputRange: [0,1],
                      outputRange: [0.85, 1],
                    }]
                  }
                ]
              },
            this.props.style,
          ]}
        />
      );
  }
}
