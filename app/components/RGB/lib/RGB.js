import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Vars from '../../Common/vars/commonVars';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import Commands from '../../Common/vars/commands';
import WifiManager from 'react-native-wifi-reborn';

 export default class RGB  {

    RGB_NUMBER = 20;

    RGB_WIFI = 10
    RGB_RS485 = 10
    RGB_MAX_NUMBER = 20
    TOUCHSWITCH_MAX_NUMBER = 96;
    TOUCHSWITCH_WIFI_WITH_RELAY = 20;
    WIFI_RELAY = 10;
    TOUCHSWITCH_RS485_WITH_RELAY = 10;
    RS485_RELAY = 16;
    THERMOMETER_WIFI = 16
    THERMOMETER_RS485 = 16
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
    RGB_WIFI_TYPE = 10
    RGB_RS485_TYPE = 11
    TOUCHSWITCH_WIFI_WITHOUT_RELAY_TYPE = 14;
    TOUCHSWITCH_RS485_WITHOUT_RELAY_TYPE = 15;   

    constructor(){

        this.MAX_ARRAYS[0] = 0;
        this.MAX_ARRAYS[1] = 0;
        this.MAX_ARRAYS[2] = 0;
        this.MAX_ARRAYS[3] = 0;
        this.MAX_ARRAYS[4] = 0;
        this.MAX_ARRAYS[5] = 0;
        this.MAX_ARRAYS[6] = 0;
        this.MAX_ARRAYS[7] = 0;
        this.MAX_ARRAYS[8] = this.RGB_WIFI
        this.MAX_ARRAYS[9] = this.RGB_RS485
        this.MAX_ARRAYS[10] = 0
        this.MAX_ARRAYS[11] = 0
        this.MAX_ARRAYS[12] = 0;
        this.MAX_ARRAYS[13] = 0;
    }
   

     // Get all touchswitches status from controller and 
    // Update flag in DB
    getAllRGBsFromController(rgbsFromDB, retry){
        if(!retry && retry != 0){ retry = 5;}
        getResponse = 0
        getError = 0

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = 0
           
            ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "status", "", params, "", "", 0).then(
               data => {               

            udpR = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_LISTING_MODULES, "");
            udpR.sendUdpPacket("", "", true).then(
                dataListUdp => {
                    getResponse = 1
                    getError = 0

                    where = ""
                    where_params = new Array()
                    where_params[0] = 1                
                    where_index = 1

                    console.log(dataListUdp.length)

                    dataRGB = new Array();
                    CommonFunctions.arrayCopy(dataListUdp, 4, dataRGB, 0, dataListUdp.length - 4);
        
                    // outputsArray = outputsState;        
                    j = 0
                           
                    // Get Wifi / Rs485 outputs from packet   
                    f = 14    
                    to = dataRGB.length-2
                    level = 0
                    n_level = 0
                    num_of_touch = 0 

//                     console.log("aaaa"+dataRGB.length+"---"+f+"--"+to)
//                     console.log(dataRGB[0] + "-" + dataRGB[1] + "-" + dataRGB[2] + "-" + dataRGB[3] + "-" +
//                      + dataRGB[4] + "-" + dataRGB[5] + "-" + dataRGB[6] + "-" + dataRGB[7] + "-" +
//                      + dataRGB[8] + "-" + dataRGB[9] + "-" + dataRGB[10] + "-" + dataRGB[11] + "-" +
//                      + dataRGB[12] + "-" + dataRGB[13] + "-" + dataRGB[14] + "-" + dataRGB[15] + "-" +
//                      + dataRGB[16] + "-" + dataRGB[17] + "-" + dataRGB[18] + "-" + dataRGB[19]+ "-" +
//                      + dataRGB[20] + "-" + dataRGB[21] + "-" + dataRGB[22] + "-" + dataRGB[23]+ "-" +
//                      + dataRGB[24] + "-" + dataRGB[25] + "-" + dataRGB[26] + "-" + dataRGB[27]+ "-" +
//                      + dataRGB[28] + "-" + dataRGB[29] + "-" + dataRGB[30] + "-" + dataRGB[31]);

                    // Todo: Status 
                    while(f<to){    
//                            console.log("aaa")
                        if(num_of_touch >= dataRGB[n_level]){ // After listing all touches of a level
                            level = level + this.MAX_ARRAYS[n_level]
                            n_level++
                            num_of_touch = 0
//                             console.log("n"+n_level)
                        } 

                        while(n_level != 8 && n_level != 9 && n_level <= 13){
//                             console.log("num"+n_level)
                            f = f + dataRGB[n_level] * 2
                            n_level++
                            num_of_touch = 0
                        }  

//                         console.log("in ccc "+n_level+"---"+dataRGB[n_level] + "----" + (dataRGB[n_level] > 0) +"---"+f+"---"+dataRGB[f])
                        if(dataRGB[n_level] > 0 && n_level < 14){

                            j = level + (dataRGB[f]-1);
//                             console.log("yessss"+n_level +"--" + dataRGB[n_level] + "---"+f+"--"+dataRGB[f] +"---"+j+"---"+rgbsFromDB.length +"---")
//                             console.log(j)
//                             console.log(rgbsFromDB[0].title)
//                             console.log(rgbsFromDB[j].title)
//                             console.log(rgbsFromDB[j].status)
                            rgbsFromDB[j].status = 1;
                
                            if(where.length == ""){ where = "id IN (?"; }else{ where += ",?"; }
                            where_params[where_index] = (j+1)
                            where_index++

                            f+=2;
                            num_of_touch++;
                        }

//                         console.log("@@@****" + f +"--"+j+"--"+n_level)

                    }

                    // console.log(where + "---"+where_params.length)

                    if(where.length > 0) {
                        where += ")";                     

                        ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "status", where, where_params, "", "", 0).then(
                            data => {
                                // console.log("got in updateeeeeee")
                                resolve(rgbsFromDB)
                            }   
                        )
                        .catch(error => {
                                 console.log(error +"eeeeeeeeeeeee" +error)
                                alert(i18n.t("rgb:errorSaveRGBInDB"));
                        });
                    }
                    else{
                        resolve(rgbsFromDB)
                    }

                    setTimeout(() => {
                        if(getResponse == 0 && getError == 0){
                            if(retry > 0){
                                this.getAllRGBsFromController(rgbsFromDB, retry-1)
                            }
                            else {
                                reject(false)
//                                console.log("ddddd")
                            }
                        }
                    }, 500);
       
            })
            .catch(error => {
                getResponse = 0
                getError = 0
//              console.log("error in update : "+ error)
            })

        })

        }) // End Promise
    }

     // Delete a RGB
    deleteRGB(rgbId, type_id, type, retry){
        if(!retry && retry != 0){retry = 5 }
        console.log(type_id+"----"+type)

        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {

            params1 = new Array();
            params1[0] = type_id;
            params1[1] = type;

            udpDel = new UDP(Commands.REQ_RGB, Commands.FLAG_DELETE, params1)
            udpDel.sendUdpPacket("", "", true).then(
                data => {
                   if(data.length > 0 && data != false){
                        getResponse = 1
                        getError = 0
                        params = new Array();
                        params[0] = 0;

                        // Delete selected RGB. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "status", "id="+rgbId, params, "", "", 0, 0).then(
                           data => {
                                resolve(true);
                           }
                        )
                        .catch(
                           error => {
                              console.log("Error in rgb 8: "+error)
                                reject(this.props.t("rgb:errorDeleteRGB"));
                           }
                        );
                   }
                }
            ).catch(error =>
            {
                    console.log("Error in rgb 9: "+error)
            getResponse = 1; getError = 1
            });

            setTimeout(() => {
              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if(getResponse == 0 && getError == 0){
                  // console.log("timeeeeout-" +outputId)
                  if(retry > 0){
                    this.deleteRGB(rgbId, type_id, type, retry-1)
                  }
                  else{
                    reject(false)
                  }
                }
            }, 500);

        })
    }

    // Update location id of rgbs of selected location
    updateRGBLocation(location_id, rgbs, mode){

        // Set 0 for location id of all outputs of this location
        params = new Array();
        params[0] = 0;
        ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "location_id", "location_id = " + location_id, params, "", "", 0).then(
           data => {
           }
        )
        .catch(
           error => {
                    console.log("Error in rgb 10: "+error)
                alert(this.props.t("rgb:errorUpdateLocationRGB"));
           }
        );

        if(mode != Vars.modeDelete){
            rgbArray = new Array();
            rgbArray = rgbs;

            rgbString = "";
            for(i=0; i < rgbArray.length; i++){
		if(rgbArray[i] == true){
			if(rgbString == ""){
				rgbString = i+1;
			}
			else{
				rgbString += "," + (i+1);
			}
		}
            }

            // Set location id for all selected outputs of this location
            params1 = new Array();
            params1[0] = location_id;
            ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "location_id", "id IN ("+ rgbString + ") ", params1, "", "", 0).then(
               data => {
               }
            )
            .catch(
               error => {
                    alert(this.props.t("rgb:errorUpdateLocationRGB"));
                    console.log("Error in rgb 1: "+error)
               }
            );
        }

    }

    // Make rgb table in DB
    makeTable(){
        try{
                    sqlMakeTable = "CREATE TABLE IF NOT EXISTS [RGB] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[title] TEXT NOT NULL,"
                               + "[status] INTEGER DEFAULT 0, "
                               + "[type] INTEGER DEFAULT 0, "
                               + "[type_id] INTEGER DEFAULT 0, "
                               + "[location_id] INTEGER DEFAULT 0)";

                    ZagrosDB.executeSQL(sqlMakeTable);
        }
        catch(error){
            alert(this.props.t("rgb:errorCreateTable"));
        }
    }

    // Create all rgbs for first time in DB. up to RGB_NUMBER
    createRGBs(t){
       return new Promise((resolve, reject) => {
            try{
                ZagrosDB.buildQuery(Vars.queryDelete, "RGB", "", "", "", "", "",0, 0).then(
                data1 => {
                    paramsc = new Array();

                    sqlMakeCur = "INSERT INTO RGB(title, type, type_id) VALUES ";

                    // Query for insert all WIFI RGBS
                    for(i = 1; i <= this.RGB_WIFI; i++){
                        if(i != 1){
                            sqlMakeCur += ",";
                        }
                        sqlMakeCur += "(?, " + this.RGB_WIFI_TYPE + ", " + i + ")";
                        paramsc[i-1] = t('rgb:rgbWifi') + " " + i;
                    }

                    max = this.RGB_RS485 + this.RGB_WIFI
                    from = this.RGB_WIFI + 1

                    num = 1
                    // Query for insert all Rs485 RGBS
                    for(i = from; i <= max; i++){
                        sqlMakeCur += ",(?, " + this.RGB_RS485_TYPE + ", " + num + ")";
                        paramsc[i-1] = t('rgb:rgbRs485') + " " + num;
                        num++
                    }

                    ZagrosDB.executeSQL(sqlMakeCur, paramsc,0).then(
                        data => {
                            ZagrosDB.buildQuery(Vars.querySelect, "RGB", "COUNT(*) AS count", "", "", "", "",1,0).then(
                                data2 => {
                                    // console.log("count rgb: " + data2[0].count)
                                    resolve(data2);
                                }
                            )
                            .catch(
                                error => {
                                    alert(t("rgb:errorCreateRGBs"));

                    console.log("Error in rgb 2: "+error)
                                    reject(error)
                                }
                            );
                        }
                    )
                    .catch(
                         error => {
                              alert(t("rgb:errorCreateRGBs"));
                    console.log("Error in rgb 3: "+error)
                              reject(t("rgb:errorCreateRGBs"))
                         }
                    );
                 })
                 .catch(
                     error => {
                          alert(t('controller:errorResponseConnectController'));
                    console.log("Error in rgb 4: "+error)
                          reject(t('controller:errorResponseConnectController'))
                     }
                 );
            }
            catch(e){
                alert(t('controller:errorResponseConnectController'));
                    console.log("Error in rgb 5: "+error)
                reject(t('controller:errorResponseConnectController'));
            }
        }
        );
    }

    // Update a rgb's title in DB
    updateRGBInDB(rgb){
        params = new Array();
        params[0] = rgb.title;

        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.queryUpdate, "RGB", "title", "id = "+ rgb.id, params, "", "", 0, 0).then(
               data => {
                    resolve(true)
               }
            )
            .catch(
               error => {
                    alert(this.props.t("rgb:errorCreateRGBs"));
                    console.log("Error in rgb: "+error)
                    resolve(false)
               }
            );
        }) // End Promise

    }

    // Get next id that can be taken for new RGB
    
    getNextId(){
        return new Promise((resolve, reject) => {
             ZagrosDB.buildQuery(Vars.querySelect, "RGB", "MIN(id) AS id", "status = 0 AND type_id = " + this.RGB_WIFI_TYPE, "", "", "",1,0).then(
                data2 => {
                    resolve(data2);
                }
             )
             .catch(
                 error => {
                      alert(t("rgb:errorCreateRGB"));
                    console.log("Error in rgb 6: "+error)
                      reject(t("rgb:errorCreateRGB"))
                 }
             );
        }) // End Promise
    }

    // Save RGB in Controller
    saveRGBInController(rgb){
        getResponse = 0
        getError = 0

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
             params2[0] = "securityKey";
             params2[1] = "ssid";
             params2[2] = "password";

             ZagrosDB.buildQuery(Vars.querySelect, "Setting", "value","name IN(?,?,?)",params2,"","", 1).then(
                data => {
                    ssid = (data[0].value).toString();
                    password = (data[1].value).toString();
                    securityKey = (data[2].value).toString();

                    ssidBytes = CommonFunctions.toByteArray((data[0].value).toString());
                    passwordBytes = CommonFunctions.toByteArray((data[1].value).toString());
                    secretKeyBytes = CommonFunctions.toByteArray((data[2].value).toString());

                    offset = 4;
                    // First Item: 4 = length of ip bytes
                    params = new Uint8Array(4 + ssidBytes.length + passwordBytes.length + secretKeyBytes.length + offset + 1);

                    // the 6 number is length of header bytes and 4 parameters bytes
                    params[0] = rgb.id;
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
                    params[offset] = this.RGB_WIFI_TYPE;
//
//                   console.log("sec:" + securityKey + "  ssid" + ssid + "  pass" + password + "---" + this.RGB_WIFI_TYPE+"-----params:" + params[0] + "-" + params[1] + "-" + params[2] + "-" + params[3] + "-" +
//                      + params[4] + "-" + params[5] + "-" + params[6] + "-" + params[7] + "-" +
//                      + params[8] + "-" + params[9] + "-" + params[10] + "-" + params[11] + "-" +
//                      + params[12] + "-" + params[13] + "-" + params[14] + "-" + params[15] + "-" +
//                      + params[16] + "-" + params[17] + "-" + params[18] + "-" + params[19] + "-" +
//                      + params[20] + "-" + params[21] + "-" + params[22] + "-" + params[23] + "-" +
//                      + params[24] + "-" + params[25] + "-" + params[26] + "-" + params[27]);

                    udpSave = new UDP(Commands.REQ_MODULE, Commands.FLAG_SETUP_TEMP, params)
                    udpSave.sendUdpPacket(Vars.controllerBroadcastIP, Vars.controllerModulePort, false).then(
                        data => {
                            getResponse = 1
                            if(data.length > 0 && data != false){
                                WifiManager.connectToProtectedSSID(ssid, password, true)
                                    .then(
                                        resolve(true)
                                 )

                                 resolve(true)
                            }
                        }
                    );
                }
             )
             .catch(error => {
                    alert(this.props.t("rgb:errorCreateRGB"))
                    getError = 1
                    reject(false)
                    console.log("Error in rgb 7: "+error)
             });

            timeout = setTimeout(() => {
//          	      console.log("Error in save Thermostat Timeout: " +getError+"---"+getResponse+"---")
          	       if((getResponse == 0 && getError == 0) || (getError == 1)){
          			reject(false)

                }
            }, 3000);

       }) // End Promise
        //
    }

    static runRGB(rgbTypeId, rgbType, command, retry){
        console.log("Run RGB: " + rgbTypeId + "----" + rgbType)
        if(!retry && retry != 0){ retry = 1;}
        getResponse = 0
        getError = 0

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = rgbTypeId
            params[1] = rgbType
            params[2] = command
            
            udpRgb = new UDP(Commands.REQ_RGB, Commands.FLAG_RUN, params);
            udpRgb.sendUdpPacket("", "", true).then(
                dataOk => {
                    getResponse = 1
                    getError = 0
//                        console.log("REsponseeeeeeeeeeeeeeeeeeeeeeeee::::: "+dataOk[4])
                    if(dataOk[4] == 1){
                        resolve(true)
                    }
                    else{
                        getResponse = 1
                        getError = 1
                        reject(false)
                    }
                }
                
            )

            setTimeout(() => {
                if(getResponse == 0 && getError == 0){
                    if(retry > 0){
                        this.runRGB(rgbTypeId, rgbType, command, retry-1)
                    }
                    else {
                        reject(false)
                        console.log("error in run rgb")
                    }
                }
            }, 800);


        })

    }

}
