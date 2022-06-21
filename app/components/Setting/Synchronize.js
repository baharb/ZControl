import React from 'react';
import { translate} from 'react-i18next';
import dgram from 'react-native-udp';
import i18n from 'i18next';
import { StyleSheet, Image, View, Text, TextInput, TouchableHighlight, KeyboardAvoidingView, ScrollView, PermissionsAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyHeader} from '../Common/MyHeader';
import {MyButton} from '../Common/MyButton';
import Spinner from 'react-native-loading-spinner-overlay';
import Setting from './lib/Setting';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import moment from "moment-jalaali";
import UDP from '../Common/lib/UDP';

import RNFetchBlob from 'rn-fetch-blob';
import TcpSocket from 'react-native-tcp-socket';

//var net = require('react-native-tcp');
var RNFS = require('react-native-fs');

export class Synchronize extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        ip: "",
        receiverIp: "",
        successIP: true,
        successReceiveData: "",
        spinner: false,
      }


    }

 toByteArray(obj) {
    var uint = new Int8Array(obj.length);
    for (var i = 0, l = obj.length; i < l; i++) {
        uint[i] = obj[i]; //.charCodeAt(i);
    }
    console.log("byteeeee arrayyyyyy 111111")
    return new Int8Array(uint);
}

     getByteArray(filePath){
        return new Promise((resolve , reject) => {

         const dirs = RNFetchBlob.fs.dirs
//         console.log("adasd")
//         console.log(dirs.MainBundleDir + '/databases/')

//         RNFetchBlob.fs.cp(dirs.MainBundleDir + '/databases/zagrosDB', dirs.DownloadDir+"/db/zagrosDB")
//         .then(() => {
                 RNFS.readDir(dirs.MainBundleDir + '/databases/')
                        .then((result) => {
//                          console.log('GOT RESULT', result);
                          for(i=0; i<result.length; i++){
//                            console.log("name: "+result[i].name+"------"+ result.length)
                                if(result[i].name == 'zagrosDB'){
//                                    console.log("name 2: "+result[i].name)
                                    return Promise.all([RNFS.stat(result[i].path), result[i].path]);
                                }
                          }

                          // stat the first file

                        })
                        .then((statResult) => {
                          return RNFS.readFile(statResult[1], 'base64');

                        })
                        .then((contents) => {
                          // log the file contents
//                          console.log("contentssssss: " + contents);
                          resolve(contents);
                        })
                        .catch((err) => {
//                          console.log("errrorrrrr: " +err.message, err.code);
                          reject(err)
                        });

//          })
//         .catch((error) => {
//            console.log("error in copy file "+error)
//          })

       })

    }

    sendInfoTcp()
     {
          params = new Uint8Array()
           this.getByteArray().then((data) => {
//                console.log("params: "+data)
                params = this.toByteArray(data)

                const dirs = RNFetchBlob.fs.dirs
//                 RNFS.unlink(dirs.DownloadDir+"/db/zagrosDB")

                try{

                    const client = TcpSocket.createConnection({
                        port: 53210,
                        host: this.state.ip,
                        },
                         () => {
//                         console.log("connect")
                      // Write on the socket
                        client.write(params, function(error, response){
                            console.log("res: "+response +"--- err: " +error)
                        });

                      // Close socket
                        client.destroy();
                    });


                    client.on('data', function(data) {
                      console.log('message was received', data);
                    });

                    client.on('error', function(error) {
                      console.log("error in send tcp: " + error);
                    });

                    client.on('close', function(){
//                      console.log('Connection closed!');
                    });
                  }
                catch(error){
                    console.log("err: " +error)
                }

           })

     }


 toByteArray(obj) {
  var uint = new Uint8Array(obj.length);
  for (var i = 0, l = obj.length; i < l; i++) {
    uint[i] = obj.charCodeAt(i);
  }
//    console.log("byteeeeeeeeeee arrrayyy 2222222")
  return new Uint8Array(uint);
}

    componentDidMount(){

    var str =""
    //getFile = 0
    var showmsg = 0

    var lang = this.props.t
    const server = TcpSocket.createServer(function(socket) {
          socket.on('data', (data) => {
//                console.log("get data: "+data)
                str += String.fromCharCode.apply(null, new Uint8Array(data));
                      var RNFS = require('react-native-fs');
                    // create a path you want to write to
                    const dirs = RNFetchBlob.fs.dirs

                    var path = dirs.MainBundleDir + '/databases/zagrosDB';

                    // write the file
                      RNFS.writeFile(path, str, 'base64')
                      .then((success) =>{
                        console.log('FILE WRITTEN!');
                        if(showmsg == 0){
                            alert(lang("setting:syncDoneSuccessfully"))

                            showmsg = 1
                        }
//                        this.setStateMsg()

//                        getFile = 1
//                        RNFS.copyFile(dirs.DownloadDir+"/db/zagrosDB", dirs.MainBundleDir + '/databases/zagrosDB')
                      })
                      .catch((err) => {

                        console.log("errrorrrrrrrrrrrrrrrrrrr"+err.message);
                        if(showmsg == 0){
                        alert(lang("setting:syncError"))
                        showmsg = 1
                        }
                      });
                    socket.write('Echo server ' + data);
  });

  socket.on('error', (error) => {
    console.log('An error ocurred with client socket ', error);
  });

  socket.on('close', (error) => {
    console.log('Closed connection with ', socket.address());
    showmsg = 0
  });

}).listen({ port: 53210, host: '0.0.0.0'});

server.on('error', (error) => {
  console.log('An error ocurred with the server', error);
});

server.on('close', () => {
  console.log('Server closed connection');
});

    }

    render() {
        // Each row of flat list
        const { t, i18n, navigation } = this.props;

         return (
           <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={{flex:1}} enabled >
           <ScrollView>
           <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
               <View style={commonStyles.containerView}>
                         <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                             <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('setting:receiverIP')}</Text>

                             <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                                 ref="ipInput"
                                 onChangeText={(txt) => {

                                     if(txt.length == 0){
                                         this.setState({
                                             ip: txt,
                                             successIP: false
                                         })
                                     }
                                     else{
                                         this.setState({
                                             ip: txt,
                                             successIP: true
                                         })
                                     }
                                 }}
                                 value={this.state.ip}
                             />
                         </View>

                         <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                             {!this.state.successIP ? (
                                 <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                                   {t('setting:settingFillIp')}
                                 </Text>
                             ) : (null)}
                         </View>

               </View>

               <View style={commonStyles.viewOkButton} >
                    <MyButton title={t('setting:sync') }   dir={t("common:dir")} onPress={() =>{
                    if(this.state.ip.trim().length == 0){
                            this.setState({
                                successIP: false
                            })

                            setTimeout(() => this.refs.ipInput.focus(), 150)
                    }
                    else{
                        this.setState({ spinner: true })
                        this.sendInfoTcp()
                        setTimeout(() => { this.sendInfoTcp() }, 2000)

                        setTimeout(() => { this.sendInfoTcp() }, 4000)

                        setTimeout(() => {
                            this.sendInfoTcp()
                            this.setState({ spinner: false })
                        }, 5500)

                    }
               }}

                    ></MyButton>
                </View>

             </LinearGradient>

             {(this.state.spinner) ? (
                 <View style={{ flex: 1, flexDirection: 'column' }}>
                   <Spinner
                     visible={this.state.spinner}
                     textContent={this.props.t('common:loading')}
                     textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
                   />
                 </View>
             ) : (null)}

             </ScrollView>
           </KeyboardAvoidingView>

        );
    }


}

export default translate(['Synchronize', 'common'], { wait: true })(Synchronize);
