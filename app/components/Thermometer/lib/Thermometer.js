import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import InputEvent from '../../InputEvent/lib/InputEvent';
import WifiManager from 'react-native-wifi-reborn';

 export default class Thermometer  {

    THERMOMETER_MAX_NUMBER = 32;
    THERMOMETER_OFFSET = 50

    THERMOMETER_WIFI = 16
    THERMOMETER_RS485 = 16
    
    THERMOMETER_WIFI_TYPE = 6
    THERMOMETER_RS485_TYPE = 7

    SUMMER_TYPE = 0
    WINTER_TYPE = 1

    MAX_ARRAYS = new Array(14)

    constructor(){

        this.MAX_ARRAYS[0] = 0;
        this.MAX_ARRAYS[1] = 0;
        this.MAX_ARRAYS[2] = 0;
        this.MAX_ARRAYS[3] = 0;
        this.MAX_ARRAYS[4] = this.THERMOMETER_WIFI;
        this.MAX_ARRAYS[5] = this.THERMOMETER_RS485;
        this.MAX_ARRAYS[6] = 0;
        this.MAX_ARRAYS[7] = 0;
        this.MAX_ARRAYS[8] = 0
        this.MAX_ARRAYS[9] = 0
        this.MAX_ARRAYS[10] = 0
        this.MAX_ARRAYS[11] = 0
        this.MAX_ARRAYS[12] = 0;
        this.MAX_ARRAYS[13] = 0;
    }

    // Create all thermometers in DB
    createThermometers(t){
       return new Promise((resolve, reject) => {
            try{
                 ZagrosDB.buildQuery(Vars.queryDelete, "Thermometer", "", "", "", "", "").then(
                 data1 => {

                    this.createAllThermometers(t).then(
                        res => {
                            resolve(res)
                        }
                    )
                    .catch(error => {
                        alert(t("thermometer:errorCreateAllThermometers"))
                        reject(t("thermometer:errorCreateAllThermometers"))
                    }
                );

                }

                )
                .catch(
                    error => {
                        alert(t('controller:errorResponseConnectController'));
                        reject(t('controller:errorResponseConnectController'))
                    }
                );

            }
            catch(e){
                alert(t("thermometer:errorCreateAllThermometers"));
                reject(t("thermometer:errorCreateAllThermometers"));
            }
        }
        );
    }

    // Update a Thermometer in DB
    updateThermometerInDB(thermometer){
        params = new Array();
        params[0] = thermometer.title;
        params[1] = thermometer.reference_temp;
        params[2] = thermometer.temp_type;
        params[2] = thermometer.status;

        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "title, reference_temp, temp_type, status", "id = "+ thermometer.id, params, "", "", 0, 0).then(
               data => {
                      resolve(true)
               }
            )
            .catch(
               error => {
                    alert(i18n.t("thermometer:errorUpdateThermometer"));
                    reject(false)
               }
            );
        }) // End Promise
    }

    // Delete a thermometer
    deleteThermometer(thermometerId, type_id, type, retry){
        return new Promise((resolve, reject) => {
            let getResponse = 0
            let getError = 0

            params1 = new Array();
            params1[0] = type_id;
            params1[1] = type;

            udpDelTh = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_DELETE, params1)
            udpDelTh.sendUdpPacket("", "", true).then(
                data => {
                   if(data.length > 0 && data != false){
                        getResponse = 1
                        getError = 0
//                            alert(params1[0] + "-" + data[0] + "-" + data[1] + "-" + data[2] +"-" +data[3]+"-"+ data[4]+"-"+ data[5])
                        params = new Array();
                        params[0] = 0;
                        params[1] = 0;

                        // Delete selected Thermometer. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "status, location_id", "id="+thermometerId, params, "", "", 0, 0).then(
                           data => {
                                resolve(true);
                           }
                        )
                        .catch(
                           error => {
//                                console.log(i18n.t("thermometer:errorDeleteThermometer"));
                           }
                        );
                   }
                }

            ).catch(error => { getResponse = 1; getError = 1;});

            setTimeout(() => {
                if(getResponse == 0 && getError == 0){
                    if(retry > 0){
                      this.deleteThermometer(thermometerId, type_id, type, retry)
                    }
                    else {
                        alert(i18n.t("thermometer:errorDeleteThermometer"))
                        reject(false)
                    }
                }
            }, 500);

        })
    }


    createAllThermometers(t){
        return new Promise((resolve, reject) => {
//        therm = props.t('thermometer:thermometer');
        try{
            params = new Array();
           
            sqlInsTable = "INSERT INTO Thermometer(title, type, type_id, temp) VALUES ";
            
            type_id = 1

            // Insert all wifi touchSwitch with relay
             for(c = 1; c <= this.THERMOMETER_WIFI; c++){
                if(c != 1){
                    sqlInsTable += ",";
                }
                sqlInsTable += "(?," + this.THERMOMETER_WIFI_TYPE + ", " + type_id + ", 0)";
                params[c-1] = t('thermometer:thermometerWifi') + " " + type_id;
                type_id++
            }

            type_id = 1
            // Insert all wifi relay touch switches
            max = this.THERMOMETER_WIFI + this.THERMOMETER_RS485
            from = this.THERMOMETER_WIFI + 1
            
            for(j = from; j <= max; j++){
                sqlInsTable += ",(?," + this.THERMOMETER_RS485_TYPE + ", " + type_id + ", 0)";
                params[j-1] = t('thermometer:thermometerRs485') + " " + type_id;
                type_id++
            }

            ZagrosDB.executeSQL(sqlInsTable, params, 0)
                .then(
                    data => {
                        ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "COUNT(*) AS count", "", "", "", "", 1, 0).then(
                            data2 => {
                                resolve(data2);
                            }
                        )
                        .catch(
                            error => {
                                alert(i18n.t("thermometer:errorCreateAllThermometers"));
                                reject(i18n.t("thermometer:errorCreateAllThermometers"))
                            }
                        );

                    }
                )
                .catch(
                    error => {
                        alert(i18n.t("thermometer:errorCreateAllThermometers"));
                        reject(i18n.t("thermometer:errorCreateAllThermometers"))
                    }
                );

            }
            catch(error){
                alert(i18n.t("thermometer:errorCreateAllThermometers"));
            }
        });
    }

    // Make output table in DB
    makeTable(){
//           alert("make table");
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Thermometer] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[location_id] INTEGER DEFAULT 0,"
                               + "[title] TEXT NOT NULL,"
                               + "[status] INTEGER DEFAULT 0,"
                               + "[type] INTEGER DEFAULT 0,"
                               + "[type_id] INTEGER DEFAULT 0,"
                               + "[reference_temp] INTEGER DEFAULT 0,"
                               + "[temp] INTEGER DEFAULT 0,"
                               + "[temp_type] INTEGER DEFAULT 0);";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("thermometer:errorCreateTable"));
//            return 0;
        }
    }

    // Get all Thermometers status from controller and 
    // Update status in DB
    getAllThermometersFromController(thermometersFromDB){
//        console.log("thermometerssss num in Therm lib  : "+thermometersFromDB.length)
//        if(!retry && retry != 0){ retry = 5;}
//        let getResponse = 0
//        let getError = 0

        return new Promise((resolve, reject) => {
            params = new Array()
            params[0] = 0
           
            ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "status", "", params, "", "", 0).then(
               data => {

	            udpAll = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_LISTING_MODULES, "");
	            udpAll.sendUdpPacket("", "", true).then(
	                dataListUdp => {
//	                    getResponse = 1
//	                    getError = 0

	                    where = ""
	                    where_params = new Array()
	                    where_params[0] = 1
	                    where_index = 1

	                    // console.log(dataListUdp.length)

	                    dataOut = new Array();
	                    CommonFunctions.arrayCopy(dataListUdp, 4, dataOut, 0, dataListUdp.length - 4);

	                    // outputsArray = outputsState;
	                    j = 0

	                    // Get Wifi / Rs485 outputs from packet
	                    f = 14
	                    to = dataOut.length-2
	                    level = 0
	                    n_level = 0
	                    num_of_touch = 0

	                    // console.log("aaaa"+thermometersFromDB.length+"---"+f+"--"+to)
	                    // console.log(dataOut[0] + "-" + dataOut[1] + "-" + dataOut[2] + "-" + dataOut[3] + "-" +
	                    // + dataOut[4] + "-" + dataOut[5] + "-" + dataOut[6] + "-" + dataOut[7] + "-" +
	                    // + dataOut[8] + "-" + dataOut[9] + "-" + dataOut[10] + "-" + dataOut[11] + "-" +
	                    // + dataOut[12] + "-" + dataOut[13] + "-" + dataOut[14] + "-" + dataOut[15] + "-" +
	                    // + dataOut[16] + "-" + dataOut[17] );
	                    // Todo: Status
	                    while(f<to){

	                        // After listing all touches of a level
	                        if(num_of_touch >= dataOut[n_level]){
	                            // console.log("in n numof tttt "+ n_level + "****" + f)
	                            level = level + this.MAX_ARRAYS[n_level]
	                            n_level++
	                            num_of_touch = 0
	                        }

	                        // n_level uses index of MAX_ARRAYS
	                        while(n_level != 4 && n_level != 5 && n_level <= 13){
	                            // console.log("in n levelllllll "+ n_level + "****" + f)
	                            f = f + dataOut[n_level] * 2
	                            n_level++
	                            num_of_touch = 0
	                        }

	                        // console.log("dataaaaaaaa: "+ dataOut[n_level] + "----" + n_level + "---" + f + "---" + to)
	                        // If this type of Thermometer has active thermometer
	                        // And count of this thermometer type greater than 0
	                        // n_level: keeps the number of this thermometer type
	                        // f: the id of active thermometer
	                        if(dataOut[n_level] > 0 && n_level < 14){

	                            // console.log("yessss"+n_level +"--" + dataOut[n_level] + "---"+f+dataOut[f])
	                            j = level + (dataOut[f]-1);

	                            // if ((dataOut[f+1] & 1) == 1) {
	                            //     if ((dataOut[f+1] & 4) == 1){
	                            //        thermometerFromDB[j].status = 2;
	                            //     }
	                            //     else{
	                            thermometersFromDB[j].status = 1;

	                            if(where.length == ""){ where = "id IN (?"; }else{ where += ",?"; }
	                            where_params[where_index] = (j+1)
	                            where_index++
	                            //     }

	                            // } else {
	                            //     thermometerFromDB[j].status = 0;
	                            // }

	                            // thermometersFromDB[j].status = 1
	                            f+=2;
	                            num_of_touch++;
	                        }

	                        // console.log("@@@****" + f +"--"+j+"--"+n_level)

	                    }

	                    // console.log("aaaaaaaaaaaaaaaaaaa"+where.length+"----")

	                    if(where.length > 0) {
	                        // console.log(where + "-********************--"+where_params.length)
	                        where += ")";

	                        ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "status", where, where_params, "", "", 0).then(
	                            data => {
	                                // console.log("got in updateeeeeee thermometers")
	                                resolve(thermometersFromDB)
	                            }
	                        )
	                        .catch(error => {
//	                                console.log(error +"eeeeeeeeeeeee")
	                                reject(error)
	                                alert(i18n.t("thermometer:errorSaveThermometerInDB"));
	                        });
	                    }
	                    else{
	                        // console.log("therm from db "+ thermometersFromDB)
	                        resolve(thermometersFromDB)
	                    }

//	                    setTimeout(() => {
//	                        if(getResponse == 0 && getError == 0){
//	                            if(retry > 0){
//	                                console.log("ret: "+retry)
//	                                this.getAllThermometersFromController(thermometersFromDB, retry-1)
//	                            }
//	                            else {
//	                                console.log("reject")
//	                                reject(false)
//	                            }
//	                        }
//	                    }, 800);

	            })
	            .catch(error => {
//	                getResponse = 0
//	                getError = 0
//	                console.log("error in update thermometer: "+ error)
	                reject(error)
	            })

        })

        })
    }

    getAllThermometersFromDB(){
        return new Promise((resolve, reject) => {

            ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "", "", "", "", "", 1, 0).then(
                dataThermometer => {
                    resolve(dataThermometer)
                }
            )  
            .catch(error => console.log("error in get thermometer from db: "+error))         
        })
    }

    // Save Thermometer in Controller
    saveThermometerInController(thermometer, mode){
          getError = 0
          getResponse = 0

        return new Promise((resolve, reject) => {

            if(mode == Vars.modeInsert){
	            ipBytes = new Uint8Array(4);
	            ipString = new Uint8Array(7);
	            ssidBytes = new Uint8Array();
	            passwordBytes = new Uint8Array();
	            secretKeyBytes = new Uint8Array();

	            ipBytes = Vars.controllerIP.split(".")
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
	                    // last num = 1 : for type
	                    params = new Uint8Array(4 + ssidBytes.length + passwordBytes.length + secretKeyBytes.length + offset + 1);

	                    // the 6 number is length of header bytes and 4 parameters bytes
	                    params[0] = thermometer.id;
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
	                    params[offset] = this.THERMOMETER_WIFI_TYPE;

//	                    console.log("sec:" + securityKey + "  ssid" + ssid + "  pass" + password + "---" + "params:0:" +
//	                         params[0] + "--1:" + params[1] + "--2:" + params[2] + "--3:" + params[3] + "--4:" +
//	                       + params[4] + "--5:" + params[5] + "--6:" + params[6] + "--7:" + params[7] + "--8:")
	                //       + params[8] + "--9:" + params[9] + "--10:" + params[10] + "--11:" + params[11] +"--12:" +
	                //       + params[12] + "--13:" + params[13] + "--14:" + params[14] + "--15:" + params[15] + "--16:" +
	                //       + params[16] + "--17:" + params[17] + "--18:" + params[18] + "--19:" + params[19] + "--20:"  +
	                //       + params[20] + "--21:" + params[21] + "--22:" + params[22] + "--23:" + params[23] + "--24:"  +
	                //       + params[24] + "--25:" + params[25] + "--26:" + params[26] + "--27:" + params[27] + "--28:"  +
	                //       + params[28] + "--29:" + params[29] + "--30:" + params[30] + "--31:" + params[31] + "--32:"  +
	                //       + params[32] + "--33:" + params[33] + "--34:" + params[34] + "--35:" + params[35] + "--36:" +
	                //       + params[36] + "--37:" + params[37] + "--38:" + params[38] + "--39:" + params[39] + "--40:"  +
	                //       + params[40] + "--41:" + params[41] + "--42:" + params[42] + "--43:" + params[43] + "-" );
                        udpSa = new UDP(Commands.REQ_MODULE, Commands.FLAG_SPECIAL, params)
	                    udpSa.sendUdpPacket(Vars.controllerBroadcastIP, Vars.controllerModulePort, false).then(
	                        data => {
	                             getResponse = 1
//	                             console.log("get Thermometer " + data[0])
	                            if(data.length > 0 && data[4] != 0){
	                                WifiManager.connectToProtectedSSID(ssid, password, true)
	                                    .then(

	                                        resolve(true)
	                                 )

	                                 resolve(true)
	                            }
	                            else{
	                                        getError = 1
	                                        reject(false)
	                            }
	                        }
	                    )
	                    .catch(error => {
	                              getError = 1
	                              reject(error)
	                    })
	                }
	             )
	             .catch(error =>
	                              {
	                              getError = 1
	                              reject(error)
	                              }
//	              alert(i18n.t("thermometer:errorSaveThermometerInController"))
		);

                    timeout = setTimeout(() => {
//          	      console.log("Error in save Thermostat Timeout: " +getError+"---"+getResponse+"---")
          	       if((getResponse == 0 && getError == 0) || (getError == 1)){
          			reject(false)

                            }
                        }, 3000);

             }
            else if(mode == Vars.modeUpdate){
                    params = new Array()
                    params[0] = thermometer.type_id
                    params[1] = thermometer.type
                    params[2] = thermometer.reference_temp
                    params[3] = thermometer.mode_type
                    params[4] = thermometer.selectedThermometerType
                    params[5] = thermometer.outputsNum
                    outputsArray = thermometer.outputsArray
                    outputsLength = thermometer.outputsNum * 4
		j = 6
		for(i=0; i<thermometer.outputsNum; i++){
			params[j] = outputsArray[i].id
			params[++j] = outputsArray[i].type_id
			params[++j] = outputsArray[i].type
			params[++j] = outputsArray[i].sub_type
//			console.log("j: " +outputsArray[i].type_id)
			j++
		}

//		CommonFunctions.arrayCopy(outputsArray, 0, params, 6, outputsLength);
//		console.log("in update controller.... "+outputsLength+"-----"+outputsArray[0]+"-"+outputsArray[1]+"-"+outputsArray[2]+"-"+outputsArray[3]+"-"+outputsArray[4]+"-"+outputsArray.length)


//		console.log("Edit therm: :" + params[0] + "--" + params[1] + "--" + params[2] + "--" + params[3] + "--" +
//	                       + params[4] + "--" + params[5] + "--" + params[6] + "--" + params[7] + "--"+
//	                       + params[8] + "--" + params[9] + "--" + params[10] + "--11:" + params[11] +"--12:" +
//	                       + params[12] + "--13:" + params[13] + "--14:" + params[14] + "--15:" + params[15] + "--16:" +
//	                       + params[16] + "--17:" + params[17] + "--18:" + params[18] + "--19:" + params[19] )

                    //todo: params, commands
                    udp1 = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_THERMOS_EDIT, params)
		udp1.sendUdpPacket("", "", true).then(
                                  data => {
                                        getResponse = 1
//                                       console.log("SAVE Thermometer " + data[4])
                                       resolve(true)
                                  }
                    ) .catch(error =>
                    {
                              getError = 1
                               reject(error)
                    }
//                              alert(i18n.t("thermometer:errorSaveThermometerInController"))

                    );

                     timeout = setTimeout(() => {
//                          console.log("Error in save Thermostat Timeout: " +getError+"---"+getResponse+"---")
                           if((getResponse == 0 && getError == 0) || (getError == 1)){
                                        reject(false)
                            }
                            else if(getResponse == 1){
                                        resolve(true)
                            }
                        }, 3000);
              }

       }) // End Promise
        //
    }

    // Update location id of thermometers of selected location
    updateThermometerLocation(location_id, thermometers, mode){

        // Set 0 for location id of all outputs of this location
        params = new Array();
        params[0] = 0;
        ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "location_id", "location_id = " + location_id, params, "", "", 0).then(
            data => {}
        )
        .catch(
            error => {
                alert(this.props.t("thermometer:errorUpdateLocationThermometer"));
            }
        );

        // console.log("update Therm: " + mode +"---"+thermometers.length)

        if(mode != Vars.modeDelete){
            thermometerArray = new Array();
            thermometerArray = thermometers;

	  if(thermometers != null && thermometers.length > 0){
            thermometerString = "";
            for(i=0; i < thermometerArray.length; i++){
                // console.log("in arrayyyyy"+thermometerArray.length+"--i:"+i+"--"+thermometerArray[i])
                if(thermometerArray[i] == true){
                    if(thermometerString == ""){
                        thermometerString = i+1;
                    }
                    else{
                        thermometerString += "," + (i+1);
                    }
                }
            }

            // Set location id for all selected outputs of this location
            params1 = new Array();
            params1[0] = location_id;
            ZagrosDB.buildQuery(Vars.queryUpdate, "Thermometer", "location_id", "id IN ("+ thermometerString + ") ", params1, "", "", 0).then(
                data => {}
            )
            .catch(
                error => {
                    alert(this.props.t("thermometer:errorUpdateLocationThermometer"));
                }
            );
            }
        }

    }
    // Get next id that can be taken for new Thermometer
    getNextId(){
        return new Promise((resolve, reject) => {
             ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "MIN(id) AS id", "status = 0 AND type = "+this.THERMOMETER_WIFI_TYPE, "", "", "",1,0).then(
                data2 => {
                    resolve(data2);
                }
             )
             .catch(
                 error => {
                      alert(i18n.t("thermometer:errorGetNextId"));
                      reject(i18n.t("thermometer:errorGetNextId"))
                 }
             );
        }) // End Promise
    }


}
