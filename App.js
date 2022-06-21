import React from 'react';
import {translate} from 'react-i18next';
import i18n from './app/components/MultipleLang/I18n/index';
import { SafeAreaView, StackNavigator, DrawerNavigator, createDrawerNavigator, DrawerItems,createStackNavigator  } from 'react-navigation';

import {Image, TouchableOpacity,  Dimensions, View, ScrollView, Text} from 'react-native'
import Home from './app/components/ConnectSetting/Home';
import Splash from './app/components/Common/Splash';
import Dashboard from './app/components/Dashboard/Dashboard';
import selectLanguage from './app/components/MultipleLang/selectLanguage';
import connectToController from './app/components/ConnectSetting/connectToController';
import OutputPage from "./app/components/Output/OutputPage";
import OutputSetting from "./app/components/Output/OutputSetting";
import LocationPage from "./app/components/Location/LocationPage";
import LocationSetting from "./app/components/Location/LocationSetting";
import CurtainPage from "./app/components/Curtain/CurtainPage";
import CurtainSetting from "./app/components/Curtain/CurtainSetting";
import RGBPage from "./app/components/RGB/RGBPage";
import RGBSetting from "./app/components/RGB/RGBSetting";
import ThermometerPage from "./app/components/Thermometer/ThermometerPage";
import ThermometerSetting from "./app/components/Thermometer/ThermometerSetting";
import TouchSwitchPage from "./app/components/TouchSwitch/TouchSwitchPage";
import TouchSwitchSetting from "./app/components/TouchSwitch/TouchSwitchSetting";
import RelayPage from "./app/components/Relay/RelayPage";
import RelaySetting from "./app/components/Relay/RelaySetting";
import ScenarioPage from "./app/components/Scenario/ScenarioPage";
import ScenarioSetting from "./app/components/Scenario/ScenarioSetting";
import InputEventPage from "./app/components/InputEvent/InputEventPage";
import InputEventSetting from "./app/components/InputEvent/InputEventSetting";
import SchedulePage from "./app/components/Schedule/SchedulePage";
import ScheduleSetting from "./app/components/Schedule/ScheduleSetting";
import VoiceCommandPage from "./app/components/VoiceCommand/VoiceCommandPage";
import VoiceCommandSetting from "./app/components/VoiceCommand/VoiceCommandSetting";
import VoiceCommandRun from "./app/components/VoiceCommand/VoiceCommandRun";
import SettingPage from "./app/components/Setting/SettingPage";
import DateSetting from "./app/components/Setting/DateSetting";
import Synchronize from "./app/components/Setting/Synchronize";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import commonStyles from "./app/components/Common/css/commonStyles";
import {NativeModules} from 'react-native';

freeSendPacket = true
packetSucceed = 0
packetFailed = 0
staticIp = ""
secKey = ""
selectedConnection = 0
trySendFailed=0
dir=""
dgramSocket = ""

console.ignoredYellowBox = true
//LogBox.ignoreAllLogs(true)

//console.log("INnnnnnnnnnn Apppppppppppp: "+dir)
// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider
export  class App extends React.Component {

    constructor(props){
        super(props);

    Stack = createStackNavigator({
          Home: {
             screen: Home,
             headerMode: 'none',
             headerVisible: false,
           },
          selectLanguage: {
                  screen: selectLanguage,
                  navigationOptions: ({ navigation }) => ({
                    title: i18n.t('common:selectLanguage'),  // Title to appear in status bar
                  headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16 },
                    headerRight: <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />,

                    headerLeft :
                         <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />
                  }),
          },
          connectToController: {
                 screen: connectToController ,
                   navigationOptions: ({ navigation }) => ({
                     title: i18n.t('common:connectToController'),  // Title to appear in status bar
                     headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16 },
                     headerRight: <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />,

	          headerLeft :
                    <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

                   })
          },
          Dashboard: {
                screen: Dashboard,
                navigationOptions: ({ navigation }) => ({
                  title: i18n.t('common:dashboard'),  // Title to appear in status bar
                  headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16 },
                  headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
                    {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12,marginRight: 10}:
                    {flexDirection:'row', alignItems:'flex-start', paddingTop: 12,marginLeft: 10} ,

                  headerLeft : (i18n.t('common:dir') == "left") ?
                  <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
                  <View style={commonStyles.flexRow(i18n.t('common:dir'))}>
                  <FontAwesome5 name="microphone" size={32} style={commonStyles.micRight} onPress={ () => navigation.navigate("VoiceCommandRun") } />
                  <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
		          </View>,

                  headerRight:  (i18n.t('common:dir') == "left") ?
                  <View style={commonStyles.flexRow(i18n.t('common:dir'))}>
                  <FontAwesome5 name="microphone" size={32} style={commonStyles.micLeft} onPress={ () => navigation.navigate("VoiceCommandRun") } />
                  <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                   </View>:
                  <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
                }),
          },
          OutputPage: {
            screen: OutputPage,
            navigationOptions: ({ navigation }) => ({
                        title: i18n.t('output:outputs'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	              headerLeft : (i18n.t('common:dir') == "left") ?
	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
	              <TouchableOpacity
                            onPress={() => navigation.navigate('Dashboard')}>
                            <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                         </TouchableOpacity>,

	              headerRight:  (i18n.t('common:dir') == "left") ?
	              <TouchableOpacity
                        onPress={() => navigation.navigate('Dashboard')}>
                        <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                        </TouchableOpacity>
                         :
	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

              })

            },

          OutputSetting: {
              screen: OutputSetting,
              navigationOptions: ({ navigation }) => ({
                        title: i18n.t('output:outputSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12,marginRight: 10}:
	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12,marginLeft: 10} ,

		     headerLeft :
                        <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

              })

          },

          LocationPage: {
            screen: LocationPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('location:locations'),  // Title to appear in status bar
              headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

              headerLeft : (i18n.t('common:dir') == "left") ?
              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
              <TouchableOpacity
                          onPress={() => navigation.navigate('Dashboard')}>
                          <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                       </TouchableOpacity>,

              headerRight:  (i18n.t('common:dir') == "left") ?
              <TouchableOpacity
                      onPress={() => navigation.navigate('Dashboard')}>
                      <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                      </TouchableOpacity>
                       :
              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
              })
          },

          LocationSetting: {
            screen: LocationSetting,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('location:locationSetting'),  // Title to appear in status bar
                headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

                headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	      headerLeft :
                <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

            })
          },

          CurtainPage: {
            screen: CurtainPage,
            navigationOptions: ({ navigation }) => ({
                        title: i18n.t('curtain:curtains'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
              })

            },

          CurtainSetting: {
            screen: CurtainSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('curtain:curtainSetting'),  // Title to appear in status bar
                  headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

                  headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
                    {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
                    {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

                })

          },

          RGBPage: {
            screen: RGBPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('rgb:rgbs'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	                    <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
        	             })

            },

          RGBSetting: {
              screen: RGBSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('rgb:rgbSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 15,marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })
          },

          ThermometerPage: {
            screen: ThermometerPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('thermometer:thermometers'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 15,marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
                 })

          },

          ThermometerSetting: {
              screen: ThermometerSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('thermometer:thermometerSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })

          },


          TouchSwitchPage: {
            screen: TouchSwitchPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('touchSwitch:touchSwitches'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />
              })

            },

          TouchSwitchSetting: {
            screen: TouchSwitchSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('touchSwitch:touchSwitchSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })

              },

          RelayPage: {
            screen: RelayPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('relay:relays'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
            },

          RelaySetting: {
            screen: RelaySetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('relay:relaySetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })
              },


          ScenarioPage: {
            screen: ScenarioPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('scenario:scenarios'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
            },

          ScenarioSetting: {
            screen: ScenarioSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('scenario:scenarioSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })
              },

          InputEventPage: {
            screen: InputEventPage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('inputEvent:inputEvents'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		  })
            },

          InputEventSetting: {
            screen: InputEventSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('inputEvent:inputEventSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />
		 })
              },

          SchedulePage: {
            screen: SchedulePage,
            navigationOptions: ({ navigation }) => ({
                title: i18n.t('schedule:schedules'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
            },

          ScheduleSetting: {
            screen: ScheduleSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('schedule:scheduleSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })
              },

              VoiceCommandPage: {
                screen: VoiceCommandPage,
                navigationOptions: ({ navigation }) => ({
                    title: i18n.t('voiceCommand:voiceCommands'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
                },

              VoiceCommandSetting: {
                screen: VoiceCommandSetting,
                  navigationOptions: ({ navigation }) => ({
                      title: i18n.t('voiceCommand:voiceCommandSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />


		 })
          },

          VoiceCommandRun: {
            screen: VoiceCommandRun,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('voiceCommand:voiceCommandRun'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />

		 })
          },

          SettingPage: {
            screen: SettingPage,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('setting:setting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
          },

          DateSetting: {
            screen: DateSetting,
              navigationOptions: ({ navigation }) => ({
                  title: i18n.t('setting:dateSetting'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

	               headerLeft :
                              <FontAwesome5 name="chevron-left" size={25} style={commonStyles.backHeader} onPress={ () => navigation.goBack() } />
		 })
          },

          Synchronize: {
              screen: Synchronize,
                navigationOptions: ({ navigation }) => ({
                    title: i18n.t('setting:synchronize'),  // Title to appear in status bar
                        headerTitleStyle: { color:'#fff', fontFamily: 'Vazir-Medium', fontSize: 16},

        	              headerTitleContainerStyle: (i18n.t('common:dir') == "right") ?
        	                {flexDirection:'row-reverse', alignItems:'flex-start', paddingTop: 12, marginRight: 10}:
        	                {flexDirection:'row', alignItems:'flex-start', paddingTop: 12, marginLeft: 10} ,

        	              headerLeft : (i18n.t('common:dir') == "left") ?
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsLeft} onPress={ () => navigation.toggleDrawer() } />:
        	              <TouchableOpacity
                                    onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                 </TouchableOpacity>,

        	              headerRight:  (i18n.t('common:dir') == "left") ?
        	              <TouchableOpacity
                                onPress={() => navigation.navigate('Dashboard')}>
                                <Image style={commonStyles.logoImg1} source={require('./app/components/Common/img/logo_white.png')}  />
                                </TouchableOpacity>
                                 :
        	              <FontAwesome5 name="bars" size={25} style={commonStyles.barsRight} onPress={ () => navigation.toggleDrawer() } />

		 })
          },

        },
         );

          position = ""

          Root = createDrawerNavigator({
               Menu: {
                  screen: Stack,
                  navigationOptions: {
                      title: i18n.t('common:menu') // Text shown in left menu
                  }
               },
               Dashboard: {
                  screen: Stack,
                  navigationOptions: {
                      title: i18n.t('common:dashboard'), // Text shown in left menu
                  }
               },
               OutputPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('output:outputs')// Text shown in left menu
                  }
                },

               LocationPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('location:locations') // Text shown in left menu
                  }
                },

               ScenarioPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('scenario:scenarios') // Text shown in left menu
                  }
                },

               SchedulePage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('schedule:schedules') // Text shown in left menu
                  }
               },

               InputEventPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('inputEvent:inputEvents') // Text shown in left menu
                  }
                },

              VoiceCommandPage: {
                 screen: Stack,
                 navigationOptions: {
                   title: i18n.t('voiceCommand:voiceCommands') // Text shown in left menu
                 }
              },

               CurtainPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('curtain:curtains') // Text shown in left menu
                  }
                },

               RGBPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('rgb:rgbs') // Text shown in left menu
                  }
                },

               ThermometerPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('thermometer:thermometers') // Text shown in left menu
                  }
                },

               TouchSwitchPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('touchSwitch:touchSwitches') // Text shown in left menu
                  }
                },

               RelayPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('relay:relays') // Text shown in left menu
                  }
                },

               SettingPage: {
                  screen: Stack,
                  navigationOptions: {
                    title: i18n.t('setting:setting') // Text shown in left menu
                  }
               },

            },
            {drawerWidth: 250,
            fontFamily: 'Vazir-Medium',
            drawerPosition: i18n.t('common:dir'),
            contentComponent: props => <CustomDrawer {...props} />
            })

        // Wrapping a stack with translation hoc asserts we get new render on language change
        // the hoc is set to only trigger rerender on languageChanged
const CustomDrawer = (props) => (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 120, backgroundColor: '#1d0527', padding: 10 }}>
            <Image source={require('./app/components/Common/img/logo_white.png')}
                style={{ height: 100, width: "100%", resizeMode : 'contain'}}>
            </Image>
        </View>
        <ScrollView>
            <DrawerItems {...props}
          labelStyle={{fontSize: 16, fontFamily:'Vazir-Medium', color:'#1d0527'}}
          itemStyle ={{borderBottomWidth: 1, borderBottomColor:'#ece5ea'}}
          activeBackgroundColor={'#dcd6da'}
            />
        </ScrollView>
    </SafeAreaView>
)

    }

    componentDidMount(){
          const { t} = this.props;
    }


  render() {
      // const { t } = useTranslation();
      console.reportErrorsAsExceptions = false;
	console.error = (error) => error.apply;
//	NativeModules.ExceptionsManager = null;


      const WrappedStack = ({t}) => {
        // const { t } = useTranslation();
        return <Root screenProps={{ t }} />;
      };

      const ReloadAppOnLanguageChange = translate('common', {
        bindI18n: 'languageChanged',
        bindStore: false,
      })(WrappedStack);

      return (
            <ReloadAppOnLanguageChange />
      );
  }
}

export default translate(['app', 'common'], { wait: true })(App);
