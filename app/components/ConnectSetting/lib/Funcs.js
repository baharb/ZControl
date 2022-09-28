import { translate} from 'react-i18next';
import Vars from '../../Common/vars/commonVars';
import WifiManager from 'react-native-wifi-reborn';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import React from 'react';
import {AsyncStorage} from 'react-native';
import {NetInfo} from 'react-native-netinfo';
import UDP from '../../Common/lib/UDP';
import Commands from '../../Common/vars/commands';
import ZagrosDB from '../../Common/lib/DB';
import Output from '../../Output/lib/Output';
import TouchSwitch from '../../TouchSwitch/lib/TouchSwitch';
import Relay from '../../Relay/lib/Relay';
import Thermometer from '../../Thermometer/lib/Thermometer';
import Curtain from '../../Curtain/lib/Curtain';
import RGB from '../../RGB/lib/RGB';
import Input from '../../Input/lib/Input';
import InputEvent from '../../InputEvent/lib/InputEvent';
import Scenario from '../../Scenario/lib/Scenario';
import Schedule from '../../Schedule/lib/Schedule';

export class Funcs extends React.Component {

    constructor(props){
      super(props);
      this.connectionSetting = this.connectionSetting.bind(this);
    }

    componentDidMount() {
      NetInfo.isConnected.addEventListener('connectionChange', this.handleFirstConnectivityChange);
    }

   static handleFirstConnectivityChange(connectionInfo) {
        // alert("d" + "--" + connectionInfo)
//        CommonFunctions.syncDB();
//        props.navigation.navigate('Dashboard');
//        WifiManager.getCurrentWifiSSID()
//        .then((ssid) => {
//
//            alert("sss:  "+ssid)
//        }, () => {
//            alert('Cannot get current SSID!')
//        })

//        alert("connected");

//        NetInfo.isConnected.removeEventListener('connectionChange', this.onInitialNetConnection);
    }

    render(){
//     const { t, i18n, navigation } = this.props;
    }

    static connectToWifi(ssid, password){

    }

   

    static getParamsForFirstDevice(ssid, password, securityKey) {

        try{
            ssidBytes = CommonFunctions.toByteArray(ssid);
            passwordBytes = CommonFunctions.toByteArray(password);
            secretKeyBytes = CommonFunctions.toByteArray(securityKey);

            params = new Array(ssidBytes.length + passwordBytes.length + secretKeyBytes.length + 2);

            // the number 6 is length of header bytes and 2 parameters bytes
            params[0] = ssidBytes.length + 6;
            params[1] = params[0] + passwordBytes.length;

            params3 = params;
            offset = 2;
            params = CommonFunctions.arrayCopy(ssidBytes, 0, params, offset, ssidBytes.length);

            offset += ssidBytes.length;
            params = CommonFunctions.arrayCopy(passwordBytes, 0, params, offset, passwordBytes.length);

            offset += passwordBytes.length;
            params = CommonFunctions.arrayCopy(secretKeyBytes, 0, params, offset, secretKeyBytes.length);

            return params;
         }
        catch(error){
            alert(this.props.t("setting:errorGetInfoMultipleDevice"))
        }
    }

    
    

   static syncDBbyParams(props, t){
          return new Promise((resolve, reject) => {
            try{

                      inputEvent = new InputEvent()
                      inputEvent.createAllInputEvents().then(dataIE => {
                          console.log("IE"+dataIE)
                      })
                      .catch(error =>
                          {console.log("Error insert All IE"+error)}
                      )

                      schedule = new Schedule()
                      schedule.createAllSchedules().then(dataSchedule => {
                          console.log("Schedule: "+dataSchedule)
                      })
                      .catch(error =>
                          {console.log("Error insert All Schedule"+error)}
                      )

                      scenario = new Scenario()
                      scenario.createAllScenarios().then(dataScenario => {
                          console.log("Scenario: "+dataScenario)
                      })
                      .catch(error =>
                          {console.log("Error insert All Scenario"+error)}
                      )

                      // Sync tables
                      thermometer = new Thermometer();
                      thermometer.createThermometers(t).then(
                          data => {
                              console.log("thermometer"+data)
              //                        alert
              //                        if(data[0].count == thermometer.THERMOMETER_MAX_NUMBER){
              ////                            props.navigation.navigate('Dashboard');
              //                        }
              //                        else{
              //                            alert("no");
              //                        }
                          }
                      ).catch(error => alert(this.props.t("thermometer:errorCreateAllThermometers")))

                      // Create all outputs and insert in output table
                      output = new Output();
                      output.createOutputs(t).then(
                          data => {
//                          console.log("coutput: " + data[0].count)
                          // Todo:
                              if(data[0].count == output.OUTPUT_NUMBER){
                              //todo:
              //                     alert("co: " + data[0].count)
              //                         props.navigation.navigate('Dashboard');
                              }
                              else{
                                  // alert("no output");
                              }
                          }
                      ).catch(error => alert(this.props.t("output:errorCreateAllOutputs")))

                      curtain = new Curtain();
                      curtain.createCurtains(t).then(
                          data => {
//                              console.log("curtain: " + data[0].count)
                              if(data[0].count == curtain.CURTAIN_NUMBER){
              //                            props.navigation.navigate('Dashboard');
                              }
                              else{
                                  alert("no curtain");
              //                            reject();
                              }
                          }
                      ).catch(error => alert(this.props.t("curtain:errorCreateCurtains")))

                      touchSwitch = new TouchSwitch();
                      touchSwitch.createTouchSwitches(t).then(
                      data => {
//                          console.log("wifi: " + data[0].count)
                          if(data[0].count == touchSwitch.TOUCHSWITCH_MAX_NUMBER){
                              // props.navigation.navigate('Dashboard');
                          }
                          else{
          //                            alert("no wifi");
          //                            reject();
                          }
                      }
                      ).catch(error => alert(this.props.t("touchSwitch:createAllTouchSwitches")))

                      relay = new Relay();
                      relay.createRelays(t).then(
                      data => {
//          		console.log("relays: " + data[0].count)
          		if(data[0].count == relay.RELAY_MAX_NUMBER){
          		// props.navigation.navigate('Dashboard');
          		}
          		else{
          		}
                      }
                      ).catch(error => alert(this.props.t("relay:createAllRelays")))

                      input = new Input();
                      input.createInputs(t).then(
                              data => {
//                              console.log("coinput: " + data[0].count)
                                  if(data[0].count == input.INPUT_NUMBER){
                                  //todo:
//                              console.log("co: " + data[0].count);

                                  }
                                  else{
                                  //  console.log("no input"+data[0].count);
                                  }
                              }
                      ).catch(error => alert(this.props.t("input:errorCreateAllInputs")))

                       rgb = new RGB();
                       rgb.createRGBs(t).then(
          	              data => {
          	                  console.log("rgb: " + data[0].count)

          	                  if(data[0].count == rgb.RGB_MAX_NUMBER){
          	                  }
          	                  else{
          	                  }
          	              }
          	   ).catch(error => alert(this.props.t("rgb:createAllRGBs")))

                       resolve(true)
//                  return true;
              }
              catch(e){
                          console.log("Error in Sync: " + e)
                          reject(false);
              //            Toast.makeText(getBaseContext(), R.string.bad_request, Toast.LENGTH_LONG).show();
                      }
          })

    }

    static getParamsForMultipleDevice(ssid, password, securityKey){

        try{
            ssidBytes = CommonFunctions.toByteArray(ssid);
            passwordBytes = CommonFunctions.toByteArray(password);
            secretKeyBytes = CommonFunctions.toByteArray(securityKey);

            params = new Array(ssidBytes.length + passwordBytes.length + secretKeyBytes.length + 2);

            // the number 6 is length of header bytes and 2 parameters bytes
            params[0] = ssidBytes.length + 6;
            params[1] = params[0] + passwordBytes.length;

            offset = 2;
            CommonFunctions.arrayCopy(ssidBytes, 0, params, offset, ssidBytes.length);

            offset += ssidBytes.length;
            CommonFunctions.arrayCopy(passwordBytes, 0, params, offset, passwordBytes.length);

            offset += passwordBytes.length;
            CommonFunctions.arrayCopy(secretKeyBytes, 0, params, offset, secretKeyBytes.length);

            return params;
        }
        catch(error){
            alert(this.props.t("setting:errorGetInfoMultipleDevice"))
        }

    }

    static connectionSetting(ssid, password, sixChar, staticIp, secondTime, t, props, retry){
	    return new Promise((resolve, reject) => {
	        try{
          //            props.navigation.navigate('Dashboard');
          //TODO:

                      if(!CommonFunctions.checkFieldEmpty(ssid) ||
                         !CommonFunctions.checkFieldEmpty(password) ||
                         !CommonFunctions.checkFieldEmpty(sixChar)
                        ){
                           alert(this.props.t("setting:errorEmptyModemFields"));

          //                spinner = "no";
          //                state.spinner = false;
                          return false;
          //                return false;
                      }
                      else{ // The input parameters are true
                          console.log("static ip: " + staticIp)
                          if(staticIp.length > 0){
			                   params1 = new Array();
	                          params1[0] = staticIp;
	                          params1[1] = "staticIp";
	                          ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params1, "", "", 0).then(
	                              resd => {
	                                   console.log("res insert static : " + resd + "---" + staticIp)
	                              }
	                          )
	                          .catch(error => {
	                                console.log("Error insert setting: " )
	                          })
                          }

                          // save security key in DB
                          AsyncStorage.setItem('SecKey', sixChar);
                          secKey = sixChar
                          params = new Array();
                          params[0] = sixChar;
                          params[1] = "securityKey";
                          ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params, "", "", 0).then(
                             data => {
                                  // First Device connect to controller
                                  if(!secondTime){
//                                     alert("first:"+secondTime)
                                      ssid_controller = Vars.controllerName;
                                      password_controller = "";

                                      // Connect to controller
          //                            WifiManager.connectToProtectedSSID(ssid_controller, password_controller, true).then(
          //                                (data) => {
          //                                    alert("data wifi zagros: " + data);
                                      params = this.getParamsForFirstDevice(ssid, password, sixChar);
          //                            alert("par: " + params);
                                      udp1 = new UDP(Commands.REQ_MODULE, Commands.FLAG_CONTROLLER_REGISTER, params);
                                      udp1.sendUdpPacket(Vars.controllerBroadcastIP, Vars.controllerBroadcastPort, false, 2000).then(
                                          data1 => {
//          				                        console.log("Dataaaa Gottttttttttttttttttttttt...." + data1 +"---" + data1.length > 0 && data1 != false)
                                              if(data1.length > 0 && data1 != false){

          //                                    alert("data in wifi packet: " + data)
                                              WifiManager.connectToProtectedSSID(ssid, password, true)
                                                  .then(
                                                   d => {

//                                                     console.log("wifiiiiiiiiiiiiiiiiiii"+d)
                                                     setTimeout(() => {
//                                                                      console.log("in timeout")
                                                               // save modem
                                                               params2 = new Array();
                                                               params2[0] = ssid;
                                                               params2[1] = "ssid";
                                                               ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params2, "", "", 0);

                                                               params1 = new Array();
                                                               params1[0] = password;
                                                               params1[1] = "password";
                                                               ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params1, "", "", 0);

                                                               // this.syncDB(props, t).then((dataFromSync) => {
                                                                   udpLogin = new UDP(Commands.REQ_LOGIN, Commands.FLAG_RUN, "")
                                                                   udpLogin.sendUdpPacket("", "", true, 1200).then(
                                                                              data2 => {
//                                                                                console.log("data Loginnnnnnn: "+data2[0]+"--"+data2[4]+"---"+data2.length)

                                                                                  if(data2.length > 0 && data2 != false) {
                                                                                      Output.OUTPUT_DIGITAL = data2[5] - data2[6];
                                                                                      Output.OUTPUT_ANALOG = data2[6]
//                                                                                      console.log("data Loginnnnnnn: "+Output.OUTPUT_DIGITAL)

                                                                                      // this.syncDB(props, t).then((dataFromSync) => {
                                                                                          this.syncDBbyParams(props, t).then(da => {
                                                                                                    resolve(true)
                                                                                          })
                                                                                          .catch(error => {
                                                                                                    reject(error)
                                                                                          })
                                                                                      // })
                              //                                                                 props.navigation.navigate('Dashboard');
                                                                                  }
                                                                                  else{
//                                                                                      alert(t('controller:errorResponseConnectController'));
                                                                                      reject(false)
                                                                                  }
                                                                              }
                                                                          )
                                                                          .catch(
                                                                              error => {
//                                                                                    if(retry > 0){
//                                                                                             this.connectionSetting(ssid, password, sixChar, staticIp, secondTime, t, props, retry-1)
//                                                                                    }
//                                                                                    else{
//          	                                                                         alert(t('controller:errorResponseConnectController'));
          	                                                                         reject(false)
//                                                                                   }
                                                                              }
                                                                          );
                                                     }, 45000);


                                                      // })
          //TODO: connect to wifi next
          //                                            }, (error) => {
          //                                                alert("error in connect" + error + t('common:errorConnectModem'));
          //                                                return false;
          //                                            })
          //                                            )
                                                  })
                                                  .catch(
                                                     error => {
                                                     console.log("Error sec keyyyyyyyyyy: "+error)
                                                          alert(t('common:errorInsertSecKey'));
                                                         reject(false)
                                                     }
                                                  );
                                              }
                                              else{
                                                  alert(t('controller:errorResponseConnectController'));
                                                  reject(false)
                                              }


                                          }
                                      )
                                      .catch(error =>
                                      {
                                                  console.log("Error in controller : " + error)
//                                                   if(retry > 0){
//                                                               this.connectionSetting(ssid, password, sixChar, staticIp, secondTime, t, props, retry-1)
//                                                      }
//                                                      else{
                                                             reject(error)
//                                                      }
                                      })
          //                            });

                                  } // First time
                                  else
                                  {// Second device or more, trying to connect
          //alert("1");
                                  //TODO: connect to modem
          //                            WifiManager.connectToProtectedSSID(ssid, password, true).then(
          //                            (d) => {
          //Todo: end
          //                                 alert("secpmd" );



                                          d = true; // TODO: remove this line after connect to modem
				                          console.log("second")
                                          if(d == false){
                                             props.navigation.navigate('Dashboard');
                                          }
                                           else if(d == true){
          //                                 alert("d");
                                              params = this.getParamsForMultipleDevice(ssid, password, sixChar);
//                                               console.log("dddd: "  + ssid+"-"+password+"-"+sixChar+"-"+params)

                                              udpSetup = new UDP(Commands.REQ_SETUP, Commands.FLAG_EDIT_MORE_DEVICES, params);
                                              udpSetup.sendUdpPacket("", "", true, 10000).then(
                                                  data => {
//                                                     console.log("data setup: " +data[4] + "-" + data)

                                                      if(data.length > 0 && data != false){

                                                          // save modem
                                                          params1 = new Array();
                                                          params1[0] = ssid;
                                                          params1[1] = "ssid";
                                                          ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params1, "", "", 0);

                                                          params2 = new Array();
                                                          params2[0] = password;
                                                          params2[1] = "password";
                                                          ZagrosDB.buildQuery(Vars.queryUpdate, "Setting", "value", "name=?", params2, "", "", 0);
          //                                                        alert("data1111")
                                                          udpLogin2 = new UDP(Commands.REQ_LOGIN, Commands.FLAG_RUN, "")
                                                          udpLogin2.sendUdpPacket("", "", true, 1200).then(
                                                              data2 => {
//                                                                console.log("data Loginnnnnnn: "+data2[0]+"--"+data2[4]+"---"+data2.length)

                                                                  if(data2.length > 0 && data2 != false) {
                                                                      Output.OUTPUT_DIGITAL = data2[5] - data2[6];
                                                                      Output.OUTPUT_ANALOG = data2[6]
//                                                                      console.log("data Loginnnnnnn: "+Output.OUTPUT_DIGITAL)

                                                                      // this.syncDB(props, t).then((dataFromSync) => {
                                                                          this.syncDBbyParams(props, t).then(res => {
                                                                                console.log("after syncccc")
                                                                                resolve(true)
                                                                          })
                                                                          .catch(error => {
                                                                                reject(error)
                                                                          })
                                                                      // })
              //                                                                 props.navigation.navigate('Dashboard');
                                                                  }
                                                                  else{
                                                                      console.log("error in login : ")
                                                                      alert(t('controller:errorResponseConnectController'));
                                                                      reject(false)
                                                                  }
                                                              }
                                                          )
                                                          .catch(
                                                              error => {
                                                                    console.log("error in login : "+ error)
                                                                   alert(t('controller:errorResponseConnectController'));
                                                                   reject(error)
                                                              }
                                                          );

                                                      }


                                                  }
                                              )
                                              .catch(
                                                  error => {
                                                       console.log("error setup : " +error + t('controller:errorResponseConnectController'));
                                                       reject(error)
                                                  }
                                               );
                                            }
                                            //TODO: connect to modem
          //                                })
          //                                .catch(
          //                                   error => {
          //                                        alert(error + t('common:errorConnectModem'));
          //                                   }
          //                                );

                                      }

                                  }



                          )
                          .catch(
                             error => {
//                                  alert(t('common:errorInsertSecKey'));
                                  console.log(error + t('common:errorInsertSecKey'))
                                  reject(error)
                             }
                          );
                      }
                  }
                  catch(error){
                      alert(t('common:problemFirstSetting'));
                      console.log(error +t('common:problemFirstSetting') )
                      reject(error)
                  }
	})


    }
}


export default translate(['Funcs', 'common'], { wait: true })(Funcs);
