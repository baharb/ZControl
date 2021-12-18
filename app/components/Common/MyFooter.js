import React from 'react';
//import {Footer, FooterTab, Body, Left, Right, Icon, Title, Button} from 'native-base';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import i18n from 'i18next';

export class MyFooter extends React.Component {
  constructor(props) {
	super(props);
  }

  componentDidMount(){
  }

  render(){
      return(
          <View style={commonStyles.listViewTouchViewFooter(i18n.t('common:dir'))}>
            <View style={{flex:1, alignItems: 'center'}}>
              <TouchableOpacity  style={{height: 35, paddingTop: 2, paddingBottom: 2}} onPress={() => {this.props.navigation.navigate('Dashboard')}} >
               <FontAwesome5 name="home"  size={25} color="#fff"/>
              </TouchableOpacity>
              </View>

                  <View style={{flex:1, alignItems: 'center'}}>
              <TouchableOpacity style={{height: 35, paddingTop: 2, paddingBottom: 2}}  onPress={() => {this.props.navigation.navigate('LocationPage')}} >
                 <FontAwesome5 name="map-marker-alt"  size={25} color="#fff"/>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, alignItems: 'center'}}>
                <TouchableOpacity  style={{height: 35, paddingTop: 2, paddingBottom: 2}} onPress={() => {this.props.navigation.navigate('VoiceCommandRun')}}  >
                 <FontAwesome5 name="microphone"  size={25} color="#fff"/>
                </TouchableOpacity>
              </View>
               <View style={{flex:1, alignItems: 'center'}}>
                <TouchableOpacity style={{height: 35, paddingTop: 2, paddingBottom: 2}} onPress={() => this.props.navigation.navigate('selectLanguage', {item:"Dashboard"})} >
                   <FontAwesome name="flag"  size={25} color="#fff"/>
                  </TouchableOpacity>
                   </View>
            </View>

      );

  }
}
