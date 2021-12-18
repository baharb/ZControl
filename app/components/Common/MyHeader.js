import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import commonStyles from './css/commonStyles';
import i18n from 'i18next';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  goToPage()
  {
    this.props.navigation.navigate('SettingMenu');
  }

  render(){
      const { t } = this.props;
      return(
        <View style={{height: 30, flex: 1, flexDirection: 'row', marginBottom: 0}} >
          <View style={{height: 30, flex: 1, paddingLeft: 10, paddingTop: 10}} >
            <TouchableOpacity  style={{height: 40, paddingTop: 2, paddingBottom: 2}} onPress={() => this.goToPage() } >
               <FontAwesome5 name="bars"  size={30} color="#b08dbf"/>
              </TouchableOpacity>
          </View>

          <View style={{height: 30, flex: 1, }} >
            <Image style={commonStyles.logoImg1} source={require('./img/logoPurple.png')}  />
          </View>

        </View>
      );

  }
}
