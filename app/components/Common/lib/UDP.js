import dgram from 'react-native-udp';
import Vars from '../vars/commonVars'
import CommonFunctions from './CommonFunctions';
import CRC16Modbus from './CRC16Modbus';
import { AsyncStorage } from 'react-native';
import { RestartAndroid } from 'react-native-restart-android'
//import CodePush from 'react-native-code-push'
//import {  } from "react-native";


//secKey = "";
trys = 0

//randomPort = 53209

//client=0
require('events').EventEmitter.prototype._maxListeners = 1000;
//freeSent = 0

function resetApp() {
//    console.log("Resettttttttttttttttttttttttttt")
    //	freeSendPacket = true
    //	forceUpdate(callback)
    //	alert("مشکلی در ارتباط برنامه با دستگاwه مرکزی به وجود آمد.");
    //todo: for iOS and remove this
    // Fix threads
    RestartAndroid.restart()
    //	setTimeout(() => {
    //		CodePush.restartApp();
    //	}, 300)

    //NativeModules.DevSettings.reload();
}

function modRTUCRC(buf, len_crc, isSecurityKey) {

    crc = 0xFFFF;

    for (var pos = 0; pos < len_crc; pos++) {
        crc ^= buf[pos];          // XOR byte into least sig. byte of crc

        for (crc_i = 8; crc_i != 0; crc_i--) {    // Loop over each bit
            if ((crc & 0x0001) != 0) {      // If the LSB is set
                crc >>= 1;                    // Shift right and XOR 0xA001
                crc ^= 0xA001;
            }
            else {                            // Else LSB is not set
                crc >>= 1;                    // Just shift right
            }
        }
    }


    if (isSecurityKey) {
        //	      if(secKey.length == 0){
        //		         async() => {
        //		           secKey = await AsyncStorage.getItem('SecKey');
        //		           selectedConnection = await AsyncStorage.getItem('selectedConnection');
        //		           console.log("selected connection: " + selectedConnection)
        //		         }
        //	         }
        //	console.log("security key: " + secKey)

        if (secKey !== null) {

            securityKey = CommonFunctions.toByteArray(secKey);
            for (pos = 0; pos < 6; pos++) {
                crc ^= securityKey[pos];          // XOR byte into least sig. byte of crc

                for (crc_i = 8; crc_i != 0; crc_i--) {    // Loop over each bit
                    if ((crc & 0x0001) != 0) {      // If the LSB is set
                        crc >>= 1;                    // Shift right and XOR 0xA001
                        crc ^= 0xA001;
                    }
                    else {                          // Else LSB is not set
                        crc >>= 1;
                    }// Just shift right.
                }
            }
        }
    }

    // Note, this number has low and high bytes swapped, so use it accordingly (or swap bytes)
    return crc;

}

function toByteArray(obj) {
    var uint = new Int8Array(obj.length);
    for (var i = 0, l = obj.length; i < l; i++) {
        uint[i] = obj[i]; //.charCodeAt(i);
    }

    return new Int8Array(uint);
}


randomPort = 53209
dgramSocket = ""
// Class UDP
export default class UDP {
//    command = ""
//    flag = ""
//    udp_data = ""

    constructor(command, flag, data){
//        console.log("com: " + command)
        this.command = command
        this.flag = flag
        this.udp_data = data
        packet_receive = ""
    }

    static crcIsValid(sentData, buf, isSecurityKey) {
        //        console.log("bufffff:   " +buf[2] + "-" + sentData[2] + "-" + buf[3]+"-" + sentData[3]); //+"-" + buf[4]+"-" + buf[5]+"-"+
        //         buf[6] + "-" + buf[7] + "-" + buf[8]+"-" + buf[9]+"-" + buf[10]+"-" + buf[11])
        len_reg = buf[0];
        len_reg = (len_reg << 8) | buf[1];
        crc_p = modRTUCRC(buf, len_reg - 2, isSecurityKey);

        return ((buf[len_reg - 1] == (crc_p & 0xFF)) &&
            (buf[len_reg - 2] == (crc_p >> 8)) &&
            ((buf[2] == sentData[2]) && (buf[3] == sentData[3])));
    }


    generatePDU(command, flag, isSecurityKey, data, isStaticIp) {
        return new Promise((resolve, reject) => {
//            	           console.log("before secKey.."+secKey)

            if (secKey.length == 0) {
                async () => {
                    secKey = await AsyncStorage.getItem('SecKey');
                }
//                  console.log("after seck key: " + secKey)
            }


            //	          if (secKey != null) {
            securityKey = CommonFunctions.toByteArray(secKey);
            //	          }

//            if (!data) {
//                data = "";
//            }

            packet = new Uint8Array(data.length + 6);
            packet[1] = data.length + 6;
            packet[0] = (packet.length >> 8);
            packet[2] = (isStaticIp == 1) ? (0x80 | command) : command;
            packet[3] = flag;
            packet = CommonFunctions.arrayCopy(data, 0, packet, 4, data.length);

            //		console.log("pdu::::::::::::::::::::::::::::::::  "+ command +"---" + (command | 0x80) + "---" + flag +"---")

            crc = new CRC16Modbus();
            crc_str = "";
            crc_str = crc.update(packet, 0, packet.length - 2, 0xFFFF);

            if (securityKey != null && isSecurityKey) {
                crc_str = crc.update(securityKey, 0, securityKey.length, crc_str);
            }

            crcBytes = crc.getCrcBytes(crc_str);

            packet[packet.length - 1] = crcBytes[0];
            packet[packet.length - 2] = crcBytes[1];

            //		console.log("In packetsss: "+packet[0] + "--" + packet[1] + "--" + packet[2] + "--" + packet[3] + "--" +
            //		packet[4] + "--" + packet[5] + "--" + packet[6] + "--" + packet[7] + "--" + packet[8] + "--" + packet[9] + "--" +
            //		packet[10] + "--" + packet[11] + "--" + packet[12] + "--" +packet[13] + "--" + packet[14] + "--" + packet[15] + "--")
            resolve(packet);
        })

    }

    sendUdpPacket(ip, port, isSecurityKey, retryTimeout) {
        return new Promise((resolve, reject) => {
//        console.log("command: " +"----"+this.command)

            //        setTimeout(() => {
            try {

//                if (!this.udp_data) {
//                    this.udp_data = "";
//                }

                start = new Date().getTime()
                // Send packet to controller
                this.generatePDU(this.command, this.flag, isSecurityKey, this.udp_data, selectedConnection).then(
                    dataArray => {
//                        console.log("data array: " + dataArray)
                        if (!port || port == "") {
                            if (selectedConnection == 0) {
                                port = Vars.controllerPort;
                            }
                            else {
                                port = 53202
                            }
                        }

                        if (!ip || ip == "") {
                            if (selectedConnection == 0) {
                                ip = Vars.controllerIP;
                            }
                            else {
                                ip = staticIp
                            }
                        }

//                        console.log("port: " + port +"----ip: " + ip )

                        //                     console.log("In Felan Before Bind: " + "---free send packet: "f + ip +"---" +port )
                        //  if(a.length == 0 || a == null){

                        //                    start = new Date().getTime()

                        //  }
                        received = 0
                        send = 0

                        //                     if(freeSendPacket == true){
                        //                     if(freeSent == 0){
//                        if (freeSendPacket == true) {

//                            freeSendPacket = false
                            freeSendPacket = true
                            if(dgramSocket == null || dgramSocket == ""){
//                                start1 = new Date().getTime()
//                                console.log("create dgram")
                                dgramSocket = dgram.createSocket({
                                    type: 'udp4',
                                    debug: true,
                                    reusePort: true
                                });
//                                start2 = new Date().getTime()

//                                console.log("Time for create socket: " + (start2-start1))

                            }


                            randomPort = Math.random() * 60536 | 0 + 5000 //(randomPort == 60000) ? 53209 : (randomPort+1); // = Math.random() * 60536 | 0 + 5000

//                            console.log("Bind for first time")
                            dgramSocket.bind(randomPort, function (err) {
                                if (err) {
                                    console.log("error in bind: " + err)
                                        reject(false)
//                                        packetFailed++
                                }
                            })
//                            console.log("dgram: " + dgramSocket + "----" + dgramSocket.length)
//                            dgramSocket = dgram.createSocket({
//                                type: 'udp4',
//                                debug: true,
//                                reusePort: true
//                            });

                            //                     }

                            // if(client == 0){

//                            }, 30);


                            counter = 1;


                            dgramSocket.once('listening', function () {
//                            console.log("listen")
                                let msgArray = new Uint8Array();

                                msgArray = dataArray;

//                                packet_receive = ""
                                dgramSocket.send(msgArray, 0, msgArray.length, port, ip, function (err) {
//                                    console.log("ip "+ip +"--"+port)
                                    if (err) {
                                        console.log("Error in  send: " + JSON.stringify(err) + "---");
//                                        dgramSocket.close()
                                        freeSendPacket = true
                                        reject(false)
                                        packetFailed++
                                    }
                                    else {
                                        send = 1
                                    }

                                })

                                if (!retryTimeout || retryTimeout <= 1) {
                                    retryTimeout = (selectedConnection == 0) ? 450 : 3000
                                }
                                //		retryTimeout = 3000

                                setTimeout(() => {
                                    if (received == 0) {
//                                        console.log("force  closeeee : " + "---try: " + trySendFailed + "----freeSend: " + freeSendPacket + "--- timeout: " + retryTimeout)
//                                        dgramSocket.close()
                                        trySendFailed++
                                        trys++
                                        //todo: add resetting
//                                        if (trys > 25) {
//                                            resetApp()
//                                            trys = 0
//                                            trySendFailed = 0
//                                            freeSendPacket = true
//                                        }


                                        freeSendPacket = true
                                        packetFailed++
                                        reject(false)
                                    }
                                }, retryTimeout);

                            }); // Listening

//                            dgramSocket.once('error', function (error) {
//                                 console.log("errrrooorrr in udp: " + error)
////                                 dgramSocket.close()
//                                 reject(false)
//                            })


                            counter = 0;

                            // Receive Data from controller
                            dgramSocket.once('message', function (data, rinfo) {
//                            console.log("reccccc: " + data)
//                            var str = String.fromCharCode.apply(null, new Uint8Array(data));
//                                  self.updateChatter('b received ' + str + ' ' + JSON.stringify(rinfo));
//                                console.log("receiveeeee: " + data + "----")
//		                        end = new Date().getTime()
                                received = 1
                                if (data.length > 0) {
                                trySendFailed = 0
                                trys = 0
                                packetSucceed++
                                //                            end = new Date().getTime()

//                                console.log("receive: " + data.length)


                                    valid = UDP.crcIsValid(dataArray, data, isSecurityKey);
//                                    console.log("Receive End packet: ---"+data.length + "--" + valid)
//                                    console.log("valid: " + valid );
//                                    dgramSocket.close()

                                    freeSendPacket = true
                                    if (valid && valid == true) {
//                                        dgramSocket.close();
                                        resolve(data);
                                    }
                                    else {
//                                        dgramSocket.close();
                                        reject(false);
                                    }
                                }
                                else {
//                                    dgramSocket.close()
                                    reject(false)
                                }

                            });

//                        }
//                        else {
//
//                            console.log("Free send packet:    " + trySendFailed)
//                            trySendFailed++
//                            trys++
//                            if (trySendFailed > 25) {
//                                //			dgramSocket.destroyClients()
//                                resetApp()
//                                freeSendPacket = true
//                                trySendFailed = 0
//                                trys = 0
//                            }
//                        }


                })
                .catch(error => {
                    console.log("error in generate pdu: " + error)
                    reject(false);
                })
            }
            catch (error) {
                console.log("error: " +error);

                freeSendPacket = true
                // if(client == 3){
//                dgramSocket.close();
                // client=0}
                reject(false);
            }

            //            }, 100);// End timeout
        });
    }


}
