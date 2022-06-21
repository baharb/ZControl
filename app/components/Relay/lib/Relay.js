import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Commands from '../../Common/vars/commands';
import Vars from '../../Common/vars/commonVars';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import WifiManager from 'react-native-wifi';

export default class Relay  {
    WIFI_RELAY = 10;
    RS485_RELAY = 16;
    RELAY_MAX_NUMBER = 26

    TOUCHSWITCH_MAX_NUMBER = 96;
    TOUCHSWITCH_WIFI_WITH_RELAY = 20;
    TOUCHSWITCH_RS485_WITH_RELAY = 10;
    THERMOMETER_WIFI = 16
    THERMOMETER_RS485 = 16
    CURTAIN_WIFI = 10
    CURTAIN_RS485 = 10
    TOUCHSWITCH_WIFI_WITHOUT_RELAY = 20;
    TOUCHSWITCH_RS485_WITHOUT_RELAY = 20;

    MAX_ARRAYS = new Array(14)

    TOUCHSWITCH_WIFI_WITH_RELAY_TYPE = 2;
    WIFI_RELAY_TYPE = 3;
    TOUCHSWITCH_RS485_WITH_RELAY_TYPE = 4;
    RS485_RELAY_TYPE = 5;
    THERMOMETER_WIFI_TYPE = 6
    THERMOMETER_RS485_TYPE = 7
    CURTAIN_WIFI_TYPE = 8
    CURTAIN_RS485_TYPE = 9
    TOUCHSWITCH_WIFI_WITHOUT_RELAY_TYPE = 14;
    TOUCHSWITCH_RS485_WITHOUT_RELAY_TYPE = 15;   

    constructor(){
	        this.MAX_ARRAYS[0] = 0
	        this.MAX_ARRAYS[1] = this.WIFI_RELAY;
	        this.MAX_ARRAYS[2] = 0
	        this.MAX_ARRAYS[3] = this.RS485_RELAY;
	        this.MAX_ARRAYS[4] = 0
	        this.MAX_ARRAYS[5] = 0
	        this.MAX_ARRAYS[6] = 0
	        this.MAX_ARRAYS[7] = 0
	        this.MAX_ARRAYS[8] = 0
	        this.MAX_ARRAYS[9] = 0
	        this.MAX_ARRAYS[10] = 0
	        this.MAX_ARRAYS[11] = 0
	        this.MAX_ARRAYS[12] = 0
	        this.MAX_ARRAYS[13] = 0
    }

    // Scan all wired modules from controller
    scanWiredModules(){
        return new Promise((resolve, reject) => {
            udp1 = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_REQUEST_RS485_SCAN, "");
            udp1.sendUdpPacket("", "", true).then(
                dataWiredMods => {
                    getResponse = 1
                    getError = 0
                    console.log("SCANNNNNNNNNNNNNNN DONEEEE")
                    resolve(dataWiredMods)
            })
            .catch(error => {
                getResponse = 0
                getError = 0
//                console.log("error in update : "+ error)
            })

        }) // End Promise
    }

    // Save Relay in Controller
    saveRelayInController(relay){
        return new Promise((resolve, reject) => {
            ipBytes = new Uint8Array(4);
            ssidBytes = new Uint8Array();
            passwordBytes = new Uint8Array();
            secretKeyBytes = new Uint8Array();

            ipBytes =  Vars.controllerIP.split('.');

             securityKey = "";
             ssid = "";
             password = "";

             params2  = new Array();
             params2[0] = "ssid";
             params2[1] = "password";
             params2[2] = "securityKey";

             ZagrosDB.buildQuery(Vars.querySelect, "Setting", "value","name IN(?,?,?)",params2,"","", 1).then(
                data => {
                    ssid = data[0].value;
                    password = data[1].value;
                    securityKey = data[2].value;

                    // console.log(data[0].name+"--"+data[0].value+"--"+data[1].name+"--"+data[1].value+"--"+data[2].name+"--"+data[2].value+"--")

                    ssidBytes = CommonFunctions.toByteArray(data[0].value.toString());
                    passwordBytes = CommonFunctions.toByteArray(data[1].value.toString());
                    secretKeyBytes = CommonFunctions.toByteArray(data[2].value.toString());

                    offset = 4;
                    /// First Item: 4 = length of ip bytes
                    params = new Uint8Array(4 + ssidBytes.length + passwordBytes.length + secretKeyBytes.length + offset + 1);

                    //                    alert("ip: " + ipString + "--" + ipBytes[0] +"-" + ipBytes[1] +"-" + ipBytes[2] +"-" + ipBytes[3] +"-")
                    
                    /// the 6 number is length of header bytes and 4 parameters bytes
                    params[0] = relay.type_id;
                    params[1] = 12;
                    params[2] = 12 + ssidBytes.length;
                    params[3] = params[2] + passwordBytes.length;

                    CommonFunctions.arrayCopy(ipBytes, 0, params, offset, ipBytes.length);
                    offset += ipBytes.length;
                    CommonFunctions.arrayCopy(ssidBytes, 0, params, offset, ssidBytes.length);
                    offset += ssidBytes.length;
                    CommonFunctions.arrayCopy(passwordBytes, 0, params, offset, passwordBytes.length);
                    offset += passwordBytes.length;
                    CommonFunctions.arrayCopy(secretKeyBytes, 0, params, offset, secretKeyBytes.length);
                    offset += secretKeyBytes.length;                    
                    params[offset] = relay.type;
//
//                   console.log("eeeeeeeeeeeee: " +password.toString() + "--" + ssid.toString() + "---" + securityKey.toString()+ "---"+ offset + "---" + relay.type +"----params:" + params[0] + "-" + params[1] + "-" + params[2] + "-" + params[3] + "-" +
//                      + params[4] + "-" + params[5] + "-" + params[6] + "-" + params[7] + "-" +
//                      + params[8] + "-" + params[9] + "-" + params[10] + "-" + params[11] + "-" +
//                      + params[12] + "-" + params[13] + "-" + params[14] + "-" + params[15] + "-" +
//                      + params[16] + "-" + params[17] + "-" + params[18] + "-" + params[19]+ "-" +
//                      + params[20] + "-" + params[21] + "-" + params[22] + "-" + params[23]+ "-" +
//                      + params[24] + "-" + params[25] + "-" + params[26] + "-" + params[27]+ "-" +
//                      + params[28] + "-" + params[29] + "-" + params[30] + "-" + params[31]);

                    udpSaveR = new UDP(Commands.REQ_MODULE, Commands.FLAG_SPECIAL, params)
                    udpSaveR.sendUdpPacket(Vars.controllerBroadcastIP, Vars.controllerModule2Port, false).then(
                        data => {
                            if(data.length > 0 && data != false){
                                if(data[4] == 0){
                                    console.log(data[0]+"*"+data[1]+"*"+data[2]+"*"+data[3]+"*"+data[4]+"*"+data[5]+"*")
                                    reject(i18n.t('relay:selectedTypeIncorrect'))
                                }
                                else{
                                    WifiManager.connectToProtectedSSID(ssid.toString(), password.toString(), true)
                                        .then( data => {
                                            console.log(ssid+"--"+password)
                                        }
                                    )
                                    .catch(error => {
                                        console.log("e 6" +error)
                                    })

                                    resolve(true)
                                }
                            }
                        }
                    )
                    .catch(error => {
                        alert(i18n.t("relay:errorSaveRelay"))
//                        console.log("error in save key "+error)
                     })
                }
             )
             .catch(error => {
                 alert(i18n.t("relay:errorSaveRelay"))
//                 console.log("error 5 " + error)
             });

       }) // End Promise
        //
    }

    // Update a ouchSwitch in DB
    updateRelayInDB(relay){
        params = new Array();
        params[0] = relay.title;
        params[1] = relay.flag;

        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.queryUpdate, "Relay", "title, flag", "id = " + relay.id , params, "", "", 0, 0).then(
               data => {
                    resolve(true)
               }
            )
            .catch(
               error => {
                    alert(i18n.t("relay:errorSaveRelay"));
                    resolve(false)
               }
            );
        }) // End Promise

    }


    // Get all Relay  status from controller and
    // Update flag in DB
    getAllRelaysFromController(relaysFromDB){
//        if(!retry && retry!=0){ retry = 5;}
//        let getResponse = 0
//        let getError = 0

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = 0
           
            ZagrosDB.buildQuery(Vars.queryUpdate, "Relay", "flag", "", params, "", "", 0).then(
               data => {
               

            udpGet = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_LISTING_MODULES, "");
            udpGet.sendUdpPacket("", "", true).then(
                dataListUdp => {
//                    getResponse = 1
//                    getError = 0

                    where = ""
                    where_params = new Array()
                    where_params[0] = 1                
                    where_index = 1

//                    console.log("Listinggggggggggggggg modulessss: " + dataListUdp.length)

                    dataOut = new Array();
                    CommonFunctions.arrayCopy(dataListUdp, 4, dataOut, 0, dataListUdp.length - 4);
        
                    // outputsArray = outputsState;        
                    j = 0
                           
                    // Get Wifi / Rs485 outputs from packet   
                    f = 14    
                    to = dataOut.length-2
                    level = 0
                    n_level = 0
                    num_of_relay = 0

                    // console.log("aaaa"+relaysFromDB.length+"---"+f+"--"+to)
//                     console.log("----RElayssssssssssssssss:" + dataOut[0] + "-" + dataOut[1] + "-" + dataOut[2] + "-" + dataOut[3] + "-" +
//                      + dataOut[4] + "-" + dataOut[5] + "-" + dataOut[6] + "-" + dataOut[7] + "-" +
//                      + dataOut[8] + "-" + dataOut[9] + "-" + dataOut[10] + "-" + dataOut[11] + "-" +
//                      + dataOut[12] + "-" + dataOut[13] + "-" + dataOut[14] + "-" + dataOut[15] + "-" +
//                      + dataOut[16] + "-" + dataOut[17] + "-" + dataOut[18] + "-" + dataOut[19]+ "-" +
//                      + dataOut[20] + "-" + dataOut[21] + "-" + dataOut[22] + "-" + dataOut[23]+ "-" +
//                      + dataOut[24] + "-" + dataOut[25] + "-" + dataOut[26] + "-" + dataOut[27]+ "-" +
//                      + dataOut[28] + "-" + dataOut[29] + "-" + dataOut[30] + "-" + dataOut[31]);
                    // Todo: Status 
                    while(f<to){                            

                        if(num_of_relay >= dataOut[n_level]){ // After listing all relays of a level
//                            console.log("num: " + n_level)
                            level = level + this.MAX_ARRAYS[n_level]
                            n_level++
                            num_of_relay = 0
                        } 

                        while(n_level != 1 && n_level != 3 && n_level <= 13){
                            f = f + dataOut[n_level] * 2
                            n_level++
                            num_of_relay = 0
//                            console.log("num1 : " + n_level)
                        }  

                        if(dataOut[n_level] > 0 && n_level < 14){
                            j = level + (dataOut[f]-1);
                            relaysFromDB[j].flag = 1

                            if(where.length == ""){ where = "id IN (?"; }else{ where += ",?"; }
                            where_params[where_index] = (j+1)
                            where_index++

//                            console.log("@@@****" + f +"--"+j+"--"+n_level)
                            f+=2;
                            num_of_relay++;
                        }


                    }

//                     console.log("wwwwwwwww:::" + where.length + "----------"+where + "---"+where_params.length )

                    if(where.length > 0) {
                        where += ")";                     

                        ZagrosDB.buildQuery(Vars.queryUpdate, "Relay", "flag", where, where_params, "", "", 0).then(
                            data => {
//                                console.log("got in updateeeeeee")
                                resolve(relaysFromDB)
                            }   
                        )
                        .catch(error => {
//                                console.log(error +"eeeeeeeeeeeee")
                                reject(error)
                                alert(i18n.t("output:errorSaveOutputInDB"));
                        });
                    }
                    else{
                        resolve(relaysFromDB)
                    }

//                    setTimeout(() => {
//                        if(getResponse == 0 && getError == 0){
//                            if(retry > 0){
//                                this.getAllRelaysFromController(relaysFromDB, retry-1)
//                            }
//                            else {
//                                reject(false)
//                            }
//                        }
//                    }, 500);
       
            })
            .catch(error => {
//                getResponse = 0
//                getError = 0
//              console.log("error in update : "+ error)
              reject(error)
            })

        })

        }) // End Promise
    }

    updateRelaysFromController(dataFromController, relaysFromDB){
        return new Promise((resolve, reject) => {
            try{
                wifiBytes = new Array(13);
                len = this.TOUCHSWITCH_MAX_NUMBER;
                j = 0;

                for (b = 0; b < len; b++) {

                    CommonFunctions.arrayCopy(dataFromController, j, wifiBytes, 0, 13);
                    j+=13;

                    relaysFromDB[b].flag = wifiBytes[0] & 1;
//                    alert("i: " + b + "--" + relaysFromDB[b].flag + "--" + (wifiBytes[0] & 1))
//                    if(b == len-1){

//                    }
                }

                resolve(relaysFromDB);


            }
            catch(error){
                alert(i18n.t("relay:errorGetAllRelays"));
                reject(i18n.t("relay:errorGetAllRelays"))
            }
        })
    }

    // Make output table in DB
    makeTable(){
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS  [Relay] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[title] Text NOT NULL,"
                               + "[type] INTEGER DEFAULT 0,"
                               + "[type_id] INTEGER DEFAULT 0,"
                               + "[flag] INTEGER DEFAULT 0);";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("relay:errorCreateTable"));
            //            return 0;
        }
    }

    // Get next id that can be taken for new Relay
    getNextId(){
        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.querySelect, "Relay", "MIN(id) AS id, type_id", "(flag = 0 AND type = " + this.WIFI_RELAY_TYPE + ")", "", "", "",1,0).then(
                data2 => {
                    // alert(data2[0].id +"#######"+data2[0].type_id)
                    resolve(data2);
                }
            )
            .catch(
                error => {
                    alert(i18n.t("relay:errorGetNextId"));
                    reject(i18n.t("relay:errorGetNextId"))
                }
            );
        }) // End Promise
    }

    createRelays(t){
       return new Promise((resolve, reject) => {
            try{
                 ZagrosDB.buildQuery(Vars.queryDelete, "Relay", "", "", "", "", "").then(
                 data1 => {

                    this.createAllRelays(t).then(
                        res => {
                            resolve(res)
                        }
                    )
                    .catch(error => {
                        alert(i18n.t("relay:createAllRelays"))
                        reject(i18n.t("relay:createAllRelays"))
                    });

                 })
                 .catch(
                     error => {
                          alert(t('controller:errorResponseConnectController'));
                          reject(t('controller:errorResponseConnectController'))
                     }
                 );
            }
            catch(e){
                alert(t('controller:errorResponseConnectController'));
                reject(t('controller:errorResponseConnectController'));
            }
        }
        );
    }

     createAllRelays(t){
           return new Promise((resolve, reject) => {
                try{
                        paramsc = new Array();

                        sqlMakeCur = "INSERT INTO Relay(title, type, type_id) VALUES ";

                        // Query for insert all WIFI CURTAINS
                        for(i = 1; i <= this.WIFI_RELAY; i++){
                            if(i != 1){
                                sqlMakeCur += ",";
                            }
                            sqlMakeCur += "(?, " + this.WIFI_RELAY_TYPE+ ", " + i + ")";
                            paramsc[i-1] = t('relay:wifiRelay') + " " + i;
                        }

                        max = this.RS485_RELAY + this.WIFI_RELAY
                        from = this.WIFI_RELAY + 1

                        num = 1
                        // Query for insert all Rs485 CURTAINS
                        for(i = from; i <= max; i++){
                            sqlMakeCur += ",(?, " + this.RS485_RELAY_TYPE + ", " + num + ")";
                            paramsc[i-1] = t('relay:rs485Relay') + " " + num;
                            num++
                        }

                        ZagrosDB.executeSQL(sqlMakeCur, paramsc,0).then(
                            data => {
                                ZagrosDB.buildQuery(Vars.querySelect, "Relay", "COUNT(*) AS count", "", "", "", "",1,0).then(
                                    data2 => {
                                        // console.log("count curtain: " + data2[0].count)
                                        resolve(data2);
                                    }
                                )
                                .catch(
                                    error => {
                                        alert(t("relay:errorCreateRelays"));
                                        reject(error)
                                    }
                                );
                            }
                        )
                        .catch(
                             error => {
                                  alert(t("relay:errorCreateRelays"));
                                  reject(t("relay:errorCreateRelays"))
                             }
                        );

                }
                catch(e){
                    alert(t('controller:errorResponseConnectController'));
                    reject(t('controller:errorResponseConnectController'));
                }
            }
            );
        }

    
    // Delete a Wifi Switch
    deleteRelay(relayId, type, type_id, retry){
        if(!retry){ retry = 5; }
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {

            params1 = new Array();

            params1[0] = type_id;
            params1[1] = type;

            udpDel = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_DELETE_WIRELESS, params1)
            udpDel.sendUdpPacket("", "", true).then(
                data => {
                   getResponse = 1
                   getError = 0

                   if(data.length > 0 && data != false){
//                            alert(params1[0] + "-" + data[0] + "-" + data[1] + "-" + data[2] +"-" +data[3]+"-"+ data[4]+"-"+ data[5])
                        params = new Array();
                        params[0] = 0;

                        // Delete selected relay. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "Relay", "flag", "id="+relayId, params, "", "", 0, 0).then(
                           data => {
                                resolve(true);
                           }
                        )
                        .catch(
                           error => {
                                reject(i18n.t("relay:errorDeleteRelay"));
                           }
                        );
                   }
                }
            ).catch(error => {getResponse = 1; getError = 1;});

            setTimeout(() => {
                if(getResponse == 0 && getError == 0){
                  if(retry > 0){
                    this.deleteRelay(relayId, retry-1)
                  }
                  else {
                    reject(false)
                  }
                }
            }, 500);

        })
    }


}
