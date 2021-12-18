import React from 'react';
import { translate} from 'react-i18next';
import { Image,Alert, View, Text, TouchableHighlight} from 'react-native';
import i18n from 'i18next';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import UDP from '../Common/lib/UDP';
import Commands from '../Common/vars/commands';
import Setting from './lib/Setting';

export class SettingPage extends React.Component {

    constructor(props){
      super(props);
      this.state ={
          showList: true,
          add: "",
          travel: false,
      }

    }

    componentDidMount(){
      this.getTravelMode(1)
    }

    setTravelMode(retry){
      getResponse = 0
      getError = 0
      timeout = ""

      params = new Array()
      params[0] = !this.state.travel

      udpTr = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_TRAVEL_STATE_SET, params);
      udpTr.sendUdpPacket("", "", true).then(
            resSetTravelMode => {
                  getResponse = 1
                  getError = 0
                  this.setState({travel:!this.state.travel})
                  console.log("set successfully")
                  if(timeout != ""){clearTimeout(timeout)}
            }


        ).catch(error => {getError = 1});

        timeout = setTimeout(() => {
            console.log("travel: - " + getResponse+"---"+getError)
            if(getResponse == 0 || getError == 1){
              // console.log("timeeeeout-" +outputId)
                if(retry > 0){
                  this.setTravelMode(retry-1)
                }
                else {
                   alert(i18n.t("setting:errorGetInfoMultipleDevice"))
                }
            }
        }, 1000);

    }

    getTravelMode(retry){

      getResponse = 0
      getError = 0
      timeout = ""

      params = new Array()
      params[0] = !this.state.travel

      udpGetT = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_TRAVEL_STATE_GET, params, );
      udpGetT.sendUdpPacket("", "", true).then(
            resGetTravelMode => {
                  getResponse = 1
                  
                  if(timeout != ""){clearTimeout(timeout)}
                  this.setState({
                    travel: resGetTravelMode[4]
                  })
            }

        ).catch(error => {getError = 1});

        timeout = setTimeout(() => {
            console.log("travel: - " + getResponse+"---"+getError)
            if(getResponse == 0 || getError == 1){
              // console.log("timeeeeout-" +outputId)
                if(retry > 0){
                  this.getTravelMode(retry-1)
                }
                else {
                   console.log(i18n.t("setting:errorGetInfoMultipleDevice"))
                }
            }
        }, 1000);

      
    }

    // Delete All tables and go to first page for setting
    resetToFactory(){
        Alert.alert(
          '',
          this.props.t('setting:qResetToFactory'),
          [
            {
              text: this.props.t('common:cancel'),
              onPress: () => {},
              style: 'cancel',
            },
            {text: this.props.t('common:yes'),
                 onPress: () => {
                     setting = new Setting();
                     setting.requestResetToFactory(this.props.navigation,5).then(
//                        alert(this.props.t("setting:resetToFactoryDone"))
                     )
                     .catch((error) => alert(this.props.t("setting:errorResetToFactory")));
                 },
             }

          ],
          {cancelable: false},
        );


    }

          

    render() {
        const { t } = this.props;
        var pkg = require('../../../package.json');

        return (
                 <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont} >
                    
                        <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))}>
                            <Text  style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('setting:version')} : {pkg.version}</Text>

                        </View>
                        <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                            <TouchableHighlight
                                  onPress={() => this.props.navigation.navigate('DateSetting')}
                                  style={[commonStyles.flex1, {textAlignVertical: 'center'}]} >
                                  <View style={commonStyles.flatListViewTouch(i18n.t("common:dir"))}>
                                    <Text  style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('setting:dateSetting')}</Text>
                                    <Image  />
                                  </View>
                            </TouchableHighlight>
                        </View>

		                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))}>
                           <TouchableHighlight
                             onPress={() =>  this.resetToFactory()}
                             style={{flex:1, textAlign:'center', textAlignVertical: 'center',}} >
                             <View style={commonStyles.flatListViewTouch(i18n.t("common:dir"))}>
                               <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('setting:resetToFactory')}</Text>
                               <Image  />
                             </View>
                           </TouchableHighlight>
                        </View>
                        <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))}>
                        <TouchableHighlight
                          onPress={() =>  this.props.navigation.navigate("selectLanguage", {item:"setting"})}
                          style={commonStyles.flex1Height} >
                          <View style={commonStyles.flatListViewTouch(i18n.t("common:dir"))}>
                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:selectLanguage')}</Text>
                            <Image  />
                          </View>
                        </TouchableHighlight>
                        </View>

                        <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
	                             <TouchableHighlight
	                                   onPress={() => this.props.navigation.navigate('Synchronize')}
	                                   style={commonStyles.flex1} >
	                                   <View style={commonStyles.flatListViewTouch(i18n.t("common:dir"))}>
	                                     <Text  style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('setting:synchronize')}</Text>
	                                     <Image  />
	                                   </View>
	                             </TouchableHighlight>
                         </View>

                        <View style={commonStyles.airPlaneMode}>
                        <TouchableHighlight
                              onPress={() => {
                              Alert.alert(
                                        '',
                                        (this.state.travel == true) ?
                                            this.props.t('setting:qTravelModeOff') :
                                            this.props.t('setting:qTravelModeOn')
                                            ,
                                        [
                                          {
                                            text: this.props.t('common:cancel'),
                                            onPress: () => {},
                                            style: 'cancel',
                                          },
                                          {text: this.props.t('common:yes'),
                                               onPress: () => {
                                                        this.setTravelMode(1)
                                               },
                                           }

                                        ],
                                        {cancelable: false},
                                      );


                              }
                              }
                              style={[commonStyles.flex1]} >
                              <View style={commonStyles.flatListViewTouch(i18n.t("common:dir"))}>
                                <Image  source={(this.state.travel == true) ? require("../Common/img/out-pink-airplane.png") : require("../Common/img/out-light-airplane.png")} style={commonStyles.airPlaneTouchImg} />
                              </View>
                        </TouchableHighlight>
                        </View>


                     <View style={commonStyles.viewFooter}>
                      <MyFooter  navigation={this.props.navigation} />
                     </View>

              </LinearGradient>

        );
    }


}

export default translate(['SettingPage', 'common'], { wait: true })(SettingPage);
