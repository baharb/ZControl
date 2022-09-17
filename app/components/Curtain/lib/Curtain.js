import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Vars from '../../Common/vars/commonVars';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import Commands from '../../Common/vars/commands';
import WifiManager from 'react-native-wifi-reborn';

 export default class Curtain  {

    CURTAIN_NUMBER = 20;

    CURTAIN_WIFI = 10
    CURTAIN_RS485 = 10
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
    TOUCHSWITCH_WIFI_WITHOUT_RELAY_TYPE = 14;
    TOUCHSWITCH_RS485_WITHOUT_RELAY_TYPE = 15;   

    constructor(){

        this.MAX_ARRAYS[0] = 0;
        this.MAX_ARRAYS[1] = 0;
        this.MAX_ARRAYS[2] = 0;
        this.MAX_ARRAYS[3] = 0;
        this.MAX_ARRAYS[4] = 0;
        this.MAX_ARRAYS[5] = 0;
        this.MAX_ARRAYS[6] = this.CURTAIN_WIFI;
        this.MAX_ARRAYS[7] = this.CURTAIN_RS485;
        this.MAX_ARRAYS[8] = 0
        this.MAX_ARRAYS[9] = 0
        this.MAX_ARRAYS[10] = 0
        this.MAX_ARRAYS[11] = 0
        this.MAX_ARRAYS[12] = 0;
        this.MAX_ARRAYS[13] = 0;
    }
   

     // Get all touchswitches status from controller and 
    // Update flag in DB
    getAllCurtainsFromController(curtainsFromDB, retry){
//        if(!retry && retry != 0){ retry = 5;}
//        getResponse = 0
//        getError = 0

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = 0
           
            ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "status", "", params, "", "", 0).then(
               data => {               

            udpCurtain = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_LISTING_MODULES, "");
            udpCurtain.sendUdpPacket("", "", true).then(
                dataListUdp => {
                    getResponse = 1
                    getError = 0

                    where = ""
                    where_params = new Array()
                    where_params[0] = 1                
                    where_index = 1

                    console.log(dataListUdp.length)

                    dataCurtain = new Array();
                    CommonFunctions.arrayCopy(dataListUdp, 4, dataCurtain, 0, dataListUdp.length - 4);
        
                    // outputsArray = outputsState;        
                    j = 0
                           
                    // Get Wifi / Rs485 outputs from packet   
                    f = 14    
                    to = dataCurtain.length-2
                    level = 0
                    n_level = 0
                    num_of_touch = 0 

//                     console.log("aaaa"+curtainsFromDB.length+"---"+f+"--"+to)
//                     console.log(dataListUdp[0] + "-" + dataListUdp[1] + "-" + dataListUdp[2] + "-" + dataListUdp[3] + "-" +
//                      + dataListUdp[4] + "-" + dataListUdp[5] + "-" + dataListUdp[6] + "-" + dataListUdp[7] + "-" +
//                      + dataListUdp[8] + "-" + dataListUdp[9] + "-" + dataListUdp[10] + "-" + dataListUdp[11] + "-" +
//                      + dataListUdp[12] + "-" + dataListUdp[13] + "-" + dataListUdp[14] + "-" + dataListUdp[15] + "-" +
//                      + dataListUdp[16] + "-" + dataListUdp[17] + "-" + dataListUdp[18] + "-" + dataListUdp[19]+ "-" +
//                      + dataListUdp[20] + "-" + dataListUdp[21] + "-" + dataListUdp[22] + "-" + dataListUdp[23]+ "-" +
//                      + dataListUdp[24] + "-" + dataListUdp[25] + "-" + dataListUdp[26] + "-" + dataListUdp[27]+ "-" +
//                      + dataListUdp[28] + "-" + dataListUdp[29] + "-" + dataListUdp[30] + "-" + dataListUdp[31]);

                    // Todo: Status 
                    while(f<to){    
//                            console.log("aaa")
                        if(num_of_touch >= dataCurtain[n_level]){ // After listing all touches of a level
                            level = level + this.MAX_ARRAYS[n_level]
                            n_level++
                            num_of_touch = 0
//                             console.log("n"+n_level)
                        } 

                        while(n_level != 6 && n_level != 7 && n_level <= 13){
//                             console.log("num"+n_level)
                            f = f + dataCurtain[n_level] * 2
                            n_level++
                            num_of_touch = 0
                        }  

//                         console.log("in ccc "+n_level+"---"+dataCurtain[n_level] + "----" + (dataCurtain[n_level] > 0) +"---"+f+"---"+dataCurtain[f])
                        if(dataCurtain[n_level] > 0 && n_level < 14){
                            
                            j = level + (dataCurtain[f]-1);
//                             console.log("yessss"+n_level +"--" + dataCurtain[n_level] + "---"+f+dataCurtain[f] +"---"+j)
                            curtainsFromDB[j].status = 1;
                
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

                        ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "status", where, where_params, "", "", 0).then(
                            data => {
                                // console.log("got in updateeeeeee")
                                resolve(curtainsFromDB)
                            }   
                        )
                        .catch(error => {
                                 console.log(error +"eeeeeeeeeeeee")
//                                alert(i18n.t("curtain:errorSaveCurtainInDB"));
                        });
                    }
                    else{
                        resolve(curtainsFromDB)
                    }

//                    setTimeout(() => {
//                        if(getResponse == 0 && getError == 0){
//                            if(retry > 0){
//                                this.getAllCurtainsFromController(curtainsFromDB, retry-1)
//                            }
//                            else {
//                                reject(false)
//                                console.log("ddddd")
////                            }
//                        }
//                    }, 500);
       
            })
            .catch(error => {
//                getResponse = 0
//                getError = 0
	     reject(error)
              console.log("error in update curtains : "+ error)
            })

        })

        }) // End Promise
    }

     // Delete a curtain
    deleteCurtain(curtainId, type_id, type, retry){
        if(!retry && retry != 0){retry = 5 }
        console.log(type_id+"----"+type)

        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {

            params1 = new Array();
            params1[0] = type_id;
            params1[1] = type;

//            console.log("Delete: " + params1[0] + "---" + params1[1])

            udpDelete = new UDP(Commands.REQ_CURTAIN, Commands.FLAG_DELETE, params1)
            udpDelete.sendUdpPacket("", "", true).then(
                data => {
                   if(data.length > 0 && data != false){
                        getResponse = 1
                        getError = 0
                        params = new Array();
                        params[0] = 0;

                        // Delete selected Curtain. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "status", "id="+curtainId, params, "", "", 0, 0).then(
                           data => {
                                resolve(true);
                           }
                        )
                        .catch(
                           error => {
                                reject(this.props.t("curtain:errorDeleteCurtain"));
                           }
                        );
                   }
                }
            ).catch(error => {getResponse = 1; getError = 1});

            setTimeout(() => {
              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if(getResponse == 0 && getError == 0){
                  // console.log("timeeeeout-" +outputId)
                  if(retry > 0){
                    this.deleteCurtain(curtainId, type_id, type, retry-1)
                  }
                  else{
                    reject(false)
                  }
                }
            }, 500);

        })
    }

    // Update location id of curtains of selected location
    updateCurtainLocation(location_id, curtains, mode){

        // Set 0 for location id of all outputs of this location
        params = new Array();
        params[0] = 0;
        ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "location_id", "location_id = " + location_id, params, "", "", 0).then(
           data => {
           }
        )
        .catch(
           error => {
                alert(this.props.t("curtain:errorUpdateLocationCurtain"));
           }
        );

        if(mode != Vars.modeDelete){
            curtainArray = new Array();
            curtainArray = curtains;

            curtainString = "";
            for(i=1; i <= curtainArray.length; i++){
                if(curtainArray[i] == true){
                    if(curtainString == ""){
                        curtainString = i;
                    }
                    else{
                        curtainString += "," + i;
                    }
                }
            }

            // Set location id for all selected outputs of this location
            params1 = new Array();
            params1[0] = location_id;
            ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "location_id", "id IN ("+ curtainString + ") ", params1, "", "", 0).then(
               data => {
               }
            )
            .catch(
               error => {
                    alert(this.props.t("curtain:errorUpdateLocationCurtain"));
               }
            );
        }

    }

    // Make curtain table in DB
    makeTable(){
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Curtain] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[title] TEXT NOT NULL,"
                               + "[state] INTEGER DEFAULT 0, "
                               + "[status] INTEGER DEFAULT 0, "
                               + "[type] INTEGER DEFAULT 0, "
                               + "[type_id] INTEGER DEFAULT 0, "
                               + "[location_id] INTEGER DEFAULT 0)";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(this.props.t("curtain:errorCreateTable"));
        }
    }

    // Create all curtains for first time in DB. up to CURTAIN_NUMBER
    createCurtains(t){
       return new Promise((resolve, reject) => {
            try{
                ZagrosDB.buildQuery(Vars.queryDelete, "Curtain", "", "", "", "", "",0, 0).then(
                data1 => {
                    paramsc = new Array();

                    sqlMakeCur = "INSERT INTO Curtain(title, type, type_id) VALUES ";

                    // Query for insert all WIFI CURTAINS
                    for(i = 1; i <= this.CURTAIN_WIFI; i++){
                        if(i != 1){
                            sqlMakeCur += ",";
                        }
                        sqlMakeCur += "(?, " + this.CURTAIN_WIFI_TYPE + ", " + i + ")";
                        paramsc[i-1] = t('curtain:curtainWifi') + " " + i;
                    }

                    max = this.CURTAIN_RS485 + this.CURTAIN_WIFI
                    from = this.CURTAIN_WIFI + 1

                    num = 1
                    // Query for insert all Rs485 CURTAINS
                    for(i = from; i <= max; i++){
                        sqlMakeCur += ",(?, " + this.CURTAIN_RS485_TYPE + ", " + num + ")";
                        paramsc[i-1] = t('curtain:curtainRs485') + " " + num;
                        num++
                    }

                    ZagrosDB.executeSQL(sqlMakeCur, paramsc,0).then(
                        data => {
                            ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "COUNT(*) AS count", "", "", "", "",1,0).then(
                                data2 => {
                                    // console.log("count curtain: " + data2[0].count)
                                    resolve(data2);
                                }
                            )
                            .catch(
                                error => {
                                    alert(t("curtain:errorCreateCurtains"));
                                    reject(error)
                                }
                            );
                        }
                    )
                    .catch(
                         error => {
                              alert(t("curtain:errorCreateCurtains"));
                              reject(t("curtain:errorCreateCurtains"))
                         }
                    );
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

    // Update a curtain's title in DB
    updateCurtainInDB(curtain){
        params = new Array();
        params[0] = curtain.title;

        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.queryUpdate, "Curtain", "title", "id = "+ curtain.id, params, "", "", 0, 0).then(
               data => {
                    resolve(true)
               }
            )
            .catch(
               error => {
                    alert(this.props.t("curtain:errorCreateCurtains"));
                    resolve(false)
               }
            );
        }) // End Promise

    }

    // Get next id that can be taken for new Curtain
    
    getNextId(){
        return new Promise((resolve, reject) => {
             ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "MIN(id) AS id", "status = 0 AND type_id = " + this.CURTAIN_WIFI_TYPE, "", "", "",1,0).then(
                data2 => {
                    resolve(data2);
                }
             )
             .catch(
                 error => {
                      alert(t("curtain:errorCreateCurtain"));
                      reject(t("curtain:errorCreateCurtain"))
                 }
             );
        }) // End Promise
    }

    // Save Curtain in Controller
    saveCurtainInController(curtain){
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
                    params[0] = curtain.id;
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
                    params[offset] = this.CURTAIN_WIFI_TYPE;
//
//                   console.log("sec:" + securityKey + "  ssid" + ssid + "  pass" + password + "---" + this.CURTAIN_WIFI_TYPE+"-----params:" + params[0] + "-" + params[1] + "-" + params[2] + "-" + params[3] + "-" +
//                      + params[4] + "-" + params[5] + "-" + params[6] + "-" + params[7] + "-" +
//                      + params[8] + "-" + params[9] + "-" + params[10] + "-" + params[11] + "-" +
//                      + params[12] + "-" + params[13] + "-" + params[14] + "-" + params[15] + "-" +
//                      + params[16] + "-" + params[17] + "-" + params[18] + "-" + params[19] + "-" +
//                      + params[20] + "-" + params[21] + "-" + params[22] + "-" + params[23] + "-" +
//                      + params[24] + "-" + params[25] + "-" + params[26] + "-" + params[27]);

		// todo: Change port for new version ------ with Amin
		            udpSave = new UDP(Commands.REQ_MODULE, Commands.FLAG_CURTAIN, params)
                    udpSave.sendUdpPacket(Vars.controllerBroadcastIP, Vars.controllerModulePort, false, 2000).then(
                        data => {
                            if(data.length > 0 && data != false){
                               resolve(true)
                            }
                        }
                    )
                    .catch(error =>
                    {
                              reject(error)
                    })
                }
             )
             .catch(error => alert(this.props.t("curtain:errorCreateCurtain")));

       }) // End Promise
        //
    }

    static runCurtain(curtainTypeId, curtainType, command){
//        console.log("Run Curtain: " + curtainTypeId + "----" + curtainType)

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = curtainTypeId
            params[1] = curtainType
            params[2] = command
            
            udpRun = new UDP(Commands.REQ_CURTAIN, Commands.FLAG_RUN, params);
            udpRun.sendUdpPacket("", "", true).then(
                dataOk => {
//                    console.log("REsponseeeeeeeeeee::::: "+dataOk[4])
                    if(dataOk[4] == 1){
                        resolve(true)
                    }
                    else{
                        reject(false)
                    }
                }
                
            )
            .catch(error =>
            {
                reject(false)
            })

        })

    }

}
