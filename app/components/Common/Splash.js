import React from 'react';
import { View , Image, Animated, Text, StyleSheet} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import commonStyles from './css/commonStyles';

export default class Splash extends React.Component {
	constructor(props){
		super(props)
		this.state={
	                    logoOpacity: new Animated.Value(0.2),
	                    titleMarginTop: new Animated.Value(200),
	          }
	}


  ComponentDidMount(){

//	Animated.sequence([
		Animated.timing(this.state.logoOpacity, {
			toValue:1,
		}).start()
//		Animated.timing(this.state.titleMarginTop, {
//                              toValue:10,
//                              duration: 1000,
//                    }).start()
//	]).start()
//this.fadeOut()
}

    render() {
// const { navigation, language } = this.props;
//          const { t, i18n, navigation } = this.props;
        return (
                  <View >
                      <View >
                        <Animated.Image style={{ opacity: this.state.logoOpacity}}   source={require('./img/home3.png')} >
                        </Animated.Image>

                        <Animated.Text style={{...styles.text, marginTop: this.state.titleMarginTop}}>
                              ZControl Smart Home
                        </Animated.Text>
                      </View>
                  </View>

        );
    }


}

const styles = StyleSheet.create({
	text: {color:'#b08dbf', fontSize:20, fontWeight:'bold', textAlign:'center',}
})

