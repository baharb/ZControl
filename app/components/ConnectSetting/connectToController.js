import React from 'react';
import { translate} from 'react-i18next';
import { AsyncStorage,ScrollView, KeyboardAvoidingView, Switch, Image, Dimensions, Title, Button, View, Text,CheckBox, Icon, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import styles from './css/styles';
import connectFuncs from './lib/Funcs';
import {MyButton} from '../Common/MyButton';
import i18n from 'i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import Setting from '../Setting/lib/Setting';
import CommonFuncs from '../Common/lib/CommonFuncs';

export class connectToController extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          checked: false,
          ssid: "",
          password: "",
          sixCharPassword: "",
          staticIp: "",
          successSsid: true,
          successPass: true,
          successSix: true,
          successIp: true,
          spinner: false,
      }

    }

    render() {

        const { t, i18n } = this.props;

        return (
        <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  enabled >
            <ScrollView>
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont} >

                  <View style={styles.installHeader} >
                    <Image source={require('../Common/img/installHeader.png')} style={styles.headerImg}  />
                  </View>

                  <View style={styles.paddingView} >
                    <View style={styles.viewTransparent}>

                        <Text style={styles.title(i18n.t('common:dir'))}>{t('common:connectToController', { lng: i18n.language })}</Text>
                        <View style={styles.line} />
                        <View style={commonStyles.containerView}>

                        <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                            <View style={commonStyles.switch}>
                                <Switch
			                        trackColor={{ false: "#767577", true: "#d094ea" }}
                                    thumbColor={this.state.checked ? "#ff2a62" : "#f4f3f4"}
                                    onChange={()=>{
                                        var c=this.state.checked;
                                        this.setState({
                                            checked:!c
                                        })
                                    }
                                }
                                value={this.state.checked} />
                            </View>
                            <View>
                                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}
                                    onPress={()=>{
                                    var c=this.state.checked;
                                        this.setState({
                                            checked:!c
                                        })
                                    }}
                                    >{t('controller:primarySetting')}</Text>
                            </View>
                        </View>

                        <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('controller:ssid')}</Text>

                                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                                    onChangeText={(txt) => {
                                        if(txt.trim().length == 0){
                                            this.setState({
                                                ssid: txt,
                                                successSsid: false
                                            })
                                        }
                                        else{
                                            this.setState({
                                                ssid: txt,
                                                successSsid: true
                                            })
                                        }
                                    }}
                                    value={this.state.ssid}
                                />
                                </View>
                                <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                                    {!this.state.successSsid ? (
                                        <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                                          {t('controller:FillSsid')}
                                        </Text>
                                    ) : (null)}
                                </View>

                            <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('controller:ssidPassword')}</Text>
                                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                                    onChangeText={(txt) => {
                                        if(txt.trim().length == 0){
                                              this.setState({
                                                  password: txt,
                                                  successPass: false
                                              })
                                          }
                                          else{
                                              this.setState({
                                                  password: txt,
                                                  successPass: true
                                              })
                                          }
                                    }}
                                    value={this.state.password} />
                            </View>
                            <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                                    {!this.state.successPass ? (
                                  <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                                    {t('controller:FillPassword')}
                                  </Text>
                              ) : (null)}
                            </View>
                            <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('controller:sixCharPassword')}</Text>

                                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                                    onChangeText={(txt) => {
                                        if (txt.trim().length != 6) {
                                            this.setState({
                                                sixCharPassword: txt,
                                                successSix: false
                                            })
                                        } else {
                                            this.setState({
                                                sixCharPassword: txt,
                                                successSix: true
                                            })
                                        }
                                    }}
                                    value={this.state.sixCharPassword} />
                            </View>
                            <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                                {!this.state.successSix ? (
                                    <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                                    {t('controller:FillSixcharPass')}
                                    </Text>
                                ) : (null)}
                            </View>
                            <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('controller:staticIp')}</Text>

                                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                                    onChangeText={(txt) => {
                                        if(txt.trim().length == 0){
                                            this.setState({
                                                staticIp: txt,
                                                successIp: false
                                            })
                                        }
                                        else{
                                            this.setState({
                                                staticIp: txt,
                                                successIp: true
                                            })
                                        }
                                    }}
                                    value={this.state.staticIp} />
                                </View>

                      </View>
                    </View>
                   </View>

                    <View style={commonStyles.viewOkButton} >
                      <MyButton title={t('common:actions.next') } dir={t("common:dir")}
                           onPress={() => {
                                if(this.state.successSsid && this.state.successPass && this.state.successSix) {this.firstSetting(t) }
                           }}>

                      </MyButton>
                    </View>

              </LinearGradient>

              {(this.state.spinner) ? (
                <View style={commonStyles.displayColumn}>
                                  <Spinner
                                      visible={this.state.spinner}
                                      textContent={i18n.t('common:firstSettingWaiting')}
                                      textStyle={commonStyles.spinnerText(i18n.t('common:dir'))}
                             /></View>
                )  : (null) }

                </ScrollView>
              </KeyboardAvoidingView>
        );
    }

    firstSetting = (t) => {
        try{
             ssid = this.state.ssid;
             ssidPassword = this.state.password;
             sixCharPassword = this.state.sixCharPassword;
             staticIp = this.state.staticIp;
             secondTime = this.state.checked;

             // Save security key in storage
             AsyncStorage.setItem('SecKey', sixCharPassword)

             this.setState({spinner:true})
             retry = 2

             Setting.deleteTables();
             Setting.makeBaseTables().then(data => {
                CommonFuncs.insertSetting().then(inserted => {
                      connectFuncs.connectionSetting(ssid, ssidPassword, sixCharPassword, staticIp, secondTime, t, this.props, 0)
                       .then(res => {
                             this.setState({
                                  spinner: false
                              })
//                              console.log("Frommmmm : " +res)
                              this.props.navigation.navigate('Dashboard');
                        })
                       .catch((err) => {
//                        console.log("Errorrrr : " + err)
      //				if(retry>0){
                        this.setState({
                              checked: true
                          })

                          connectFuncs.connectionSetting(ssid, ssidPassword, sixCharPassword, staticIp, 1, t, this.props, 0).then(
                          data => {
                                  this.setState({
                                        spinner: false,
                                        checked: true,
                                    })
                                  this.props.navigation.navigate('Dashboard');
                                  }
                          )
                          .catch(error => {
                                  alert(t("common:problemFirstSetting"))
                                  console.log("error in setting: "+error)
                                   this.setState({
                                        spinner: false,
                                        checked: true,
                                    })
                          })
      //				}
      //				else{
      //
      //                                          }
                                              });

                })
                .catch((error) => {
                    console.log("Error in make base tablessss: "+error)
                    alert("common:problemFirstSetting")
                })

             })
        }
        catch(error){
            alert("common:problemFirstSetting")
            console.log(error+" common:problemFirstSetting")
        }


//        output1.makeTable();
//        alert("1: "+output1.getName());
//        output1.getDB();

//        var sql1 = "SELECT * FROM Output";

//        output1.setName("Amin");
//       alert("2:"+output1.getName());
//        this.output1.getDB();
//        output1.outputName1 = "111";
//        alert(output1)
// name = output1.getName();
//        alert("name: " + name);
//        Output.getDB();

//        ZagrosDB.executeSQL(sql1);
    }
}

export default translate(['connectToController', 'common'], { wait: true })(connectToController);
