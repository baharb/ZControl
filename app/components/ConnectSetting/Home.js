import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { AsyncStorage, View , Image, Text, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import styles from './css/styles';
import ZagrosDB from '../Common/lib/DB';
import UDP from '../Common/lib/UDP';
import Commands from '../Common/vars/commands';
import Vars from '../Common/vars/commonVars';
import Setting from '../Setting/lib/Setting';
import {MyButton} from '../Common/MyButton';
import {MyAlert} from '../Common/MyAlert';
import Output from '../Output/lib/Output';

export class Home extends React.Component {
INPUT_EVENT_MAX_NUMBER = 70
    constructor(props){
    super(props);
    this.state = {
      language: i18n.language,
      alertMod: false,
      staticIp: "",
      selectedVal: 0,
    }
  }

//    backAction = () => {
//
//        console.log("classssss nameeee: "+this.props.navigation.state.routeName)
////    const {dispatch, nav} = this.props;
//    console.log("index: " + this.props.navigation.state)
//
//      if(this.props.isFocused){
//         Alert.alert(
//           "",
//           i18n.t('common:exitApp'),
//           [
//             {
//               text: i18n.t('common:cancel'),
//               onPress: () => null,
//               style: "cancel"
//             },
//             { text: i18n.t('common:yes'), onPress: () => BackHandler.exitApp() }
//           ],
//           { cancelable: false }
//      );
//      }
//      else{
//        this.props.navigation.goBack(null)
//        return true
//      }
////      return true;
//    };

    componentDidMount(){
//        BackHandler.addEventListener("hardwareBackPress", this.backAction);
        setTimeout(() => {this.goToPage(7) }, 3000);
    }

//    componentWillUnmount() {
//        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
//    }


    goToPage(retry)
    {
        //Todo: return this
        try{
         retryTimeout = 1200
         async() => {
                selectedConnection = await AsyncStorage.getItem('selectedConnection');
                if(selectedConnection == 1){
                          retryTimeout = 3000
                }
         }

//	    console.log("selectedConnection: " + selectedConnection +"---" + retryTimeout)

         params2  = new Array();
         params2[0] = "securityKey";
         params2[1] = "staticIp";

         ZagrosDB.buildQuery(Vars.querySelect, "Setting", "value","name IN(?,?)",params2,"","", 1).then(
            dataSetting => {
//            console.log("get dataaaa: 0:" + dataSetting.value  + "---1: " + dataSetting[1].value +"----len: " + dataSetting.length)

                if(dataSetting != false && dataSetting.length > 0) {

//                console.log("get dataaaa: 0:" + dataSetting[0].value + "---1: " + dataSetting[1].value +"----len: " + dataSetting.length)

                    if(dataSetting[1].value != null){
                         staticIp = dataSetting[1].value
                     }

//                      udp1 = new UDP();
                      AsyncStorage.setItem('SecKey', dataSetting[0].value);
                      secKey = dataSetting[0].value
//                      udp1.sendUdpPacket(Commands.REQ_LOGIN, Commands.FLAG_RUN, "", "", "", true,retryTimeout).then(
                      udp1 = new UDP(Commands.REQ_LOGIN, Commands.FLAG_RUN, "");
                      udp1.sendUdpPacket("", "", true,retryTimeout).then(
                          data => {
//                          console.log("get dataaaa22222222: " + data[5] + "=== " + data[6] +"----" + data.length)
                              if(data.length > 0 && data != false) {
                                  
                                  Output.OUTPUT_DIGITAL = data[5] - data[6];
                                  Output.OUTPUT_ANALOG = data[6]
                                  // Output.OUTPUT_NUMBER = 25
                                  // console.log
                                  this.props.navigation.navigate('Dashboard');
                              }
                              else{
                                    if(retry > 0){
//                                              console.log("retry in loginnnn---"+retry)
                                              this.goToPage(retry-1)
                                    }
                                    else{
                                              alert(i18n.t('controller:errorResponseConnectController'));
                                    }
                              }
                          }
                      )
                      .catch(
                          error => {
                              if(retry > 0){
//                                    console.log("retry in loginnnn---"+retry+"---")
                                    this.goToPage(retry-1)
                              }
                              else{
                                        //alert(i18n.t('controller:errorResponseConnectController'));
                                    this.setState({
                                         alertMod: true,
                                    })
                              }
                          }
                      );
                }
                else{
                    // Make base tables
                    //Todo: uncomment
//                    Setting.deleteTables();
//                    Setting.makeBaseTables();
//                    this.props.navigation.navigate('Dashboard');
//                    console.log("Setting is not exists...")
                    this.props.navigation.navigate('selectLanguage');
                }
            }
         )
         .catch(error =>{

//             console.log("eeeeeeeeeeeeeeee"+error)
             this.props.navigation.navigate('selectLanguage');
         })
         }
         catch(error) {
//                console.log("Error in login home page : " +error)
                 if(retry > 0){
//                          console.log("retry in loginnnn---"+retry+"---")
                          this.goToPage(retry-1)
                }
                else{
                          this.setState({
                                    alertMod: true,
                          })
                }
         }
    }

    goToSetting(){
        this.setState({
             alertMod: false,
        })
        this.props.navigation.navigate('connectToController');
    }


//                  <MyButton title={t('common:actions.next') }
//                      onPress={() => this.goToPage()}>
//                  </MyButton>
    render() {
        const { t, i18n, navigation, language } = this.props;
         var pkg = require('../../../package.json');
         var radioItems = [
         		{label: t('controller:connectByModem'), value: 0 },
         		{label: t('controller:connectByInternet'), value: 1 },
         ];
// const { navigation, language } = this.props;
//          const { t, i18n, navigation } = this.props;
        return (
              <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.flex1}>
	                <View style={styles.home}>

                    <View style={styles.homeHolder}>
                         <Image style={commonStyles.imageBack}   source={require('../Common/img/home3.png')}/>
                    </View>

			        <View style={commonStyles.flex1}>
                          <Text style={styles.titleHomeText}>
                          ZControl Smart Home
                          </Text>
                    </View>

                    <View style={commonStyles.flex1}>
                          <Text style={styles.versionHomeText(t('common:dir'))}>
                          {t('setting:version')} : {pkg.version}
                          </Text>
			        </View>

			  { (this.state.alertMod) ? (
                    <View style={commonStyles.flex1 } >
                        <MyAlert modalVisible={this.state.alertMod}
                          onClick2={() =>
                          {
                                params1  = new Array();
                                params1[0] = "staticIp";
                                ZagrosDB.buildQuery(Vars.querySelect, "Setting", "value","name=?",params1,"","", 1).then(
                                    data => {
                                        if(data != false && data.length > 0) {
                                               params3  = new Array();
                                               params3[0] = staticIp;
                                               ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value","name='staticIp' ",params3,"","", 1).then(
                                                    dataa => {
//                                                         console.log("update static ip")
                                                    }
                                               )
                                               .catch(error => {
                                                        // console.log("Error inserting static ip " + error)
                                               })

                                               AsyncStorage.setItem('selectedConnection', selectedConnection);
                                               this.goToPage(7)
                                               this.setState({
                                                    alertMod:false,
                                               })
                                        }
                                        else{
                                               params4  = new Array();
                                               params4[0] = "staticIp";
                                               params4[1] = staticIp;
                                               ZagrosDB.buildQuery(Vars.queryInsert, "Setting", "name,value","",params4,"","", 1).then(
                                                        dataa => {
//                                                                  console.log("insert static ip")
                                                        }
                                               )
                                               .catch(error => {
                                                        // console.log("Error inserting static ip " + error)
                                               })

                                               AsyncStorage.setItem('selectedConnection', selectedConnection);
                                               this.goToPage(7)
                                               this.setState({
                                                        alertMod:false,
                                               })
                                        }}
                                ).catch(error => {
//                                    console.log("error in get static ip: " + error)
                                    params5  = new Array();
                                    params5[0] = "staticIp";
                                    params5[1] = staticIp;
                                    ZagrosDB.buildQuery(Vars.queryInsert, "Setting", "name,value","",params5,"","", 1).then(
                                              dataa => {
//                                                        console.log("insert static ip")
                                              }
                                     )
                                    .catch(error => {
//                                         console.log("Error inserting static ip " + error)
                                    })

                                    AsyncStorage.setItem('selectedConnection', selectedConnection);
                                    this.goToPage(7)
                                    this.setState({
                                         alertMod:false,
                                    })
                                })
//                                console.log("ip: " + staticIp + "---" + selectedConnection)
                          } }
                          onClick1={() => this.goToSetting()}
                          dir={t('common:dir')}
                          title1={t('common:setting')}
                          title2={t('common:actions.ok')}
                          title3={t('controller:staticIp')}
                          ip={staticIp}
                          selectedConnection={selectedConnection}
                          radioItems={radioItems}
                          title={t('controller:errorResponseConnectControllerTry')}
                           />
                   </View>
               ) : (null) }
                             </View>
              </LinearGradient>

        );
    }
}

export default translate(['home', 'common'], { wait: true })(Home);
