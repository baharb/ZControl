import * as React from 'react';
import {translate} from 'react-i18next';
import i18n from './app/components/MultipleLang/I18n/index';
import { StackNavigator, DrawerNavigator, DrawerItems  } from 'react-navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Image, TouchableOpacity,  SafeAreaView, Dimensions, View, ScrollView, Text} from 'react-native'
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
import dgram from 'react-native-udp';

freeSendPacket = true
packetSucceed = 0
packetFailed = 0
staticIp = ""
secKey = ""
selectedConnection = 0
trySendFailed=0
dir=""
dgramSocket = ""
//LogBox.ignoreAllLogs(true)

//console.log("INnnnnnnnnnn Apppppppppppp: "+dir)
// The entry point using a react navigation stack navigation
// gets wrapped by the I18nextProvider enabling using translations
// https://github.com/i18next/react-i18next#i18nextprovider
export  class App extends React.Component {

    constructor(props){
        super(props);
//    const Stack = createStackNavigator();



}



    componentDidMount(){
        const { t} = this.props;
    }

// Stack = createStackNavigator();
//
//function MyStack() {
//    return (
//        <NavigationContainer >
//            <Stack.Navigator initialRouteName="Home">
//              <Stack.Screen name="Home" component={Home} />
//              <Stack.Screen name="Dashboard" component={Dashboard} />
//              <Stack.Screen name="connectToController" component={connectToController} />
//              <Stack.Screen name="selectLanguage" component={selectLanguage} />
//            </Stack.Navigator>
//        </NavigationContainer>
//    )
//    }
  render() {
//Drawer = createDrawerNavigator()
//MyDrawer =  (
//    <Drawer.Navigator initialRouteName="Home">
//      <Drawer.Screen
//        name="Home"
//        component={Home}
//        options={{ drawerLabel: 'Home' }}
//      />
//      <Drawer.Screen
//        name="Dashboard"
//        component={Dashboard}
//        options={{ drawerLabel: 'Dashboard' }}
//      />
//      <Drawer.Screen
//        name="selectLanguage"
//        component={selectLanguage}
//        options={{ drawerLabel: 'selectLanguage' }}
//      />
//      <Drawer.Screen
//        name="connectToController"
//        component={connectToController}
//        options={{ drawerLabel: 'connectToController' }}
//      />
//    </Drawer.Navigator>
//  );



      console.reportErrorsAsExceptions = false;
      console.error = (error) => error.apply;
//      NativeModules.ExceptionsManager = null;

//      const WrappedStack = ({t}) => {
//        return
//            <NavigationContainer>
//                     <MyStack />
//            </NavigationContainer>
//
//      };
//
//      const ReloadAppOnLanguageChange = translate('common', {
//        bindI18n: 'languageChanged',
//        bindStore: false,
//      })(WrappedStack);
const Stack = createStackNavigator();
      return (
            <NavigationContainer >
                        <Stack.Navigator initialRouteName="Home">
                          <Stack.Screen name="Home" component={Home} />
                          <Stack.Screen name="Dashboard" component={Dashboard} />
                          <Stack.Screen name="connectToController" component={connectToController} />
                          <Stack.Screen name="selectLanguage" component={selectLanguage} />
                        </Stack.Navigator>
                    </NavigationContainer>
      );
  }
}

export default translate(['app', 'common'], { wait: true })(App);
