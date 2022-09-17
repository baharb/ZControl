import { translate } from 'react-i18next';
import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import UDP from '../../Common/lib/UDP';
import Thermometer from '../../Thermometer/lib/Thermometer';

export default class Output {

    /// IMPORTANT 
    /// If these vars used by Output.var , it should be get value in app in run time
    /// But if used by this.var, it uses these values
    OUTPUT_NUMBER = 254;
    OUTPUT_DIGITAL = 24;
    OUTPUT_ANALOG = 1;
    OUTPUT_WIFI_WITH_RELAY = 80;
    OUTPUT_WIFI_RELAY = 40;
    OUTPUT_RS485_WITH_RELAY = 40;
    OUTPUT_RS485_RELAY = 64;

    OUTPUT_HARD_MAX = 25
    OUTPUT_WIFI_WITH_RELAY_MAX = 80
    OUTPUT_WIFI_RELAY_MAX = 40
    OUTPUT_RS485_WITH_RELAY_MAX = 40
    OUTPUT_RS485_RELAY_MAX = 64
    MAX_ARRAYS = new Array()

    OUTPUT_DIGITAL_TYPE = 0;
    OUTPUT_ANALOG_TYPE = 1;
    OUTPUT_WIFI_WITH_RELAY_TYPE = 2;
    OUTPUT_WIFI_RELAY_TYPE = 3;
    OUTPUT_RS485_WITH_RELAY_TYPE = 4;
    OUTPUT_RS485_RELAY_TYPE = 5;

    udpOutMinLen = 6 + (Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG) * 2;

    constructor() {
        this.MAX_ARRAYS[0] = this.OUTPUT_WIFI_WITH_RELAY_MAX;
        this.MAX_ARRAYS[1] = this.OUTPUT_WIFI_RELAY_MAX;
        this.MAX_ARRAYS[2] = this.OUTPUT_RS485_WITH_RELAY_MAX;
        this.MAX_ARRAYS[3] = this.OUTPUT_RS485_RELAY_MAX;
    }

    /// Make output table in DB
    makeTable() {
        try {
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS Output ("
                + "[id] INTEGER NOT NULL PRIMARY KEY,"
                + "[name] TEXT NOT NULL,"
                + "[icon] INTEGER NOT NULL,"
                + "[type] INTEGER NOT NULL,"
                + "[location_id] INTEGER NULL,"
                + "[flag] INTEGER NULL,"
                + "[type_id] INTEGER NULL)";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch (error) {
            alert(i18n.t("output:errorCreateTable"));
        }
    }

    getAllOutputsFromDB() {
        return new Promise((resolve, reject) => {
            // Get all ouputs from DB
            ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
                data => {
                    //                    console.log("get outputs from db: " + data.length + "--"+data)
                    resolve(data)

                }
            )
                .catch(
                    error => {
                        console.log("error in get output from db " + error)
                        reject(error)
                    }
                )
        })


    }

    /// Output page
    /// Send udp and Get all outputs from Controller in Output Page
    getAllOutputsFromController(outputs) {
        //        timeout = ""
        return new Promise((resolve, reject) => {

            outputs.map((out) => {
                out.flag = 0
            });

            params = new Array()
            params[0] = 0
            ZagrosDB.buildQuery(Vars.queryUpdate, "Output", "flag", "", params, "", "", 0).then(
                dataO => {

                    getResponse = 0
                    getError = 0

                    udp1 = new UDP(Commands.REQ_OUTPUT, (Commands.FLAG_GET | Commands.OPT_OUTPUT_GET_EDIT), "");
                    udp1.sendUdpPacket("", "", true).then(
                        data => {
                            getResponse = 1

                            where = ""
                            where_params = new Array()
                            where_params[0] = 1
                            where_index = 1

                            dataOut = new Array();
                            CommonFunctions.arrayCopy(data, 4, dataOut, 0, data.length - 4);

                            outputsArray = outputs;

                            /// Get number of outputs in first 6 bytes of packet
                            Output.OUTPUT_WIFI_WITH_RELAY = dataOut[0]
                            Output.OUTPUT_WIFI_RELAY = dataOut[1]
                            Output.OUTPUT_RS485_WITH_RELAY = dataOut[2]
                            Output.OUTPUT_RS485_RELAY = dataOut[3]
                            Thermometer.WIFI_THERMOMETER = dataOut[4]
                            Thermometer.RS485_THERMOMETER = dataOut[5]

                            num = Output.OUTPUT_WIFI_WITH_RELAY + Output.OUTPUT_WIFI_RELAY +
                                Output.OUTPUT_RS485_WITH_RELAY + Output.OUTPUT_RS485_RELAY;

                            j = 0

                            to = 6 + (Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG) * 3
//                            console.log("output nums: " + Output.OUTPUT_DIGITAL + "----" + Output.OUTPUT_ANALOG + "---" + data.length)
                            for (i = 6; i < to; i++) {
                                outputsArray[j].hour = dataOut[i];
                                outputsArray[j].minute = dataOut[++i];
                                outputsArray[j].second = dataOut[++i];
                                outputsArray[j].flag = 1

//                                console.log("output id: " + j + "--- h: " +outputsArray[j].hour + "--m: " + outputsArray[j].minute)

                                j++;

                                /// update flag output
                                if (where.length == "") { where = "id IN (?"; } else { where += ",?"; }
                                where_params[where_index] = j
                                where_index++
                            }


                            // console.log(to+"---"+outputsArray[0].id +"-"+outputsArray[1].hour+ "-"+outputsArray.length)
//                            console.log(dataOut[0]+"-"+dataOut[1]+"-"+dataOut[2]+"-"+dataOut[3]+"-"+dataOut[4]+"-"+dataOut[5]+"---6: "+
//                                 dataOut[6]+"-"+dataOut[7]+"-"+dataOut[8]+"-"+dataOut[9]+"-"+dataOut[10]+"-"+dataOut[11]+"-"+dataOut[12]+"----"+
//                                 dataOut[13]+"-"+dataOut[14]+"--15: "+dataOut[15]+"-"+dataOut[16]+"-"+dataOut[17]+"-"+dataOut[18]+"-"+dataOut[19]+"--%%$$---"+
//                                 dataOut[20]+"-"+dataOut[21]+"-"+dataOut[22]+"-"+dataOut[23]+"-"+dataOut[24]+"-"+dataOut[25]+"-"+dataOut[26]+"------"+
//                                 dataOut[27]+"-"+dataOut[28]+"-"+dataOut[29]+"-"+dataOut[30]+"-"+dataOut[31]+"-"+dataOut[32]+"-"+dataOut[33]+"-------"+
//                                 dataOut[34]+"-"+dataOut[35]+"--36: "+dataOut[36]+"-"+dataOut[37]+"-"+dataOut[38]+"-"+dataOut[39]+"-"+dataOut[40]+"-0000000"+
//                                 dataOut[41]+"-"+dataOut[42]+"-"+dataOut[43]+"-"+dataOut[44]+"-"+dataOut[45]+"-"+dataOut[46]+"-"+dataOut[47]+"-++++"+
//                                 dataOut[48]+"-"+dataOut[49]+"--50: "+dataOut[50]+"-"+dataOut[51]+"-"+dataOut[52]+"-"+dataOut[53]+"-"+dataOut[54]+"-_____"+
//                                 dataOut[55]+"-"+dataOut[56]+"-"+dataOut[57]+"-"+dataOut[58]+"-"+dataOut[59]+"-"+dataOut[60]+"-"+dataOut[61]+"-))))"+
//                                 dataOut[62]+"--63: "+dataOut[63]+"-"+dataOut[64]+"-"+dataOut[65]+"-"+dataOut[66]+"-"+dataOut[67]+"-"+dataOut[68]+"-(((("+
//                                 dataOut[69]+"--70: "+dataOut[70]+"-"+dataOut[71]+"-"+dataOut[72]+"-"+dataOut[73]+"-"+dataOut[74]+"-"+dataOut[75]+"-****"+
//                                 dataOut[76]+"-"+dataOut[77]+"-"+dataOut[78]+"-"+dataOut[79]+"-"+dataOut[80]+"-"+dataOut[81]+"-"+dataOut[82]+"-^^^^"+
//                                 dataOut[83]+"-"+
//                                 dataOut[84]+"-"+dataOut[85]+"-"+dataOut[86]+"-"+dataOut[87]+"-"+dataOut[88]+"-"+dataOut[89]+"--90: "+dataOut[90]+"-%%%"+
//                                 dataOut[91]+"-"+dataOut[92]+"-"+dataOut[93]+"-"+dataOut[94]+"-"+dataOut[95]+"-"+dataOut[96]+"-"+dataOut[97]+"$$$$"+
//                                 dataOut[98]+"-"+dataOut[99]+"-"+dataOut[100]+"-"+dataOut[101]+"-"+dataOut[102]+"-"+dataOut[103]+"--104: "+dataOut[104]+
//                                 dataOut[105]+"-"+dataOut[106]+"-"+dataOut[107]+"-"+dataOut[108]+"-"+dataOut[109]+"-"+dataOut[110]+"--111: "+dataOut[111])

                            /// Get Wifi / Rs485 outputs from packet   
                            f = to;
                            to = dataOut.length - 2
                            level = Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG
                            n_level = 0
                            num_of_touch = 0

                            //                     console.log("###@@"+ to+"---"+where_index+"---"+to+"---"+dataOut[f-1]+"-"+dataOut[f]+"-"+dataOut[f+1])

                            /// Todo: Status 
                            // n_level for output in max_array is to 3, more than 3, for thermometers
                            while (f < to && n_level < 4) {
                                if (num_of_touch >= dataOut[n_level] && dataOut[n_level] != null) {
                                    level = level + this.MAX_ARRAYS[n_level]
                                    n_level++
                                    num_of_touch = 0
                                    //                             console.log("n level::::: " + n_level + "---" + level + "---" + (dataOut[n_level] != null))
                                }
                                else {

                                    j = level + (((dataOut[f] - 1) * 4));
//                                    console.log("@@@"+f+"---dataoutf: "+dataOut[f] + "---j: " + j + "---level: "+ level+"---"+num_of_touch+"---"+n_level+"---"+dataOut[n_level])

//                                    console.log("output j: " + j +"-"+outputsArray[j].name)
                                    //                             console.log("output j: " + (j+1) +"-"+outputsArray[j+1].name)
                                    //                             console.log("output j: " +(j+2)  +"-"+outputsArray[j+2].name)
                                    //                             console.log("output j: " + (j+3)  +"-"+outputsArray[j+3].name)

                                    outputsArray[j].hour = dataOut[++f]
                                    outputsArray[j].minute = dataOut[++f];
                                    outputsArray[j].second = dataOut[++f];
                                    outputsArray[j].flag = 1;
                                    // update flag output 
                                    where += ",?"
                                    where_params[where_index] = j + 1

                                    outputsArray[j + 1].hour = dataOut[++f]
                                    outputsArray[j + 1].minute = dataOut[++f];
                                    outputsArray[j + 1].second = dataOut[++f];
                                    outputsArray[j + 1].flag = 1;
                                    // update flag output 
                                    where += ",?"
                                    where_params[++where_index] = j + 2

                                    outputsArray[j + 2].hour = dataOut[++f]
                                    outputsArray[j + 2].minute = dataOut[++f];
                                    outputsArray[j + 2].second = dataOut[++f];
                                    outputsArray[j + 2].flag = 1;
                                    // update flag output 
                                    where += ",?"
                                    where_params[++where_index] = j + 3

                                    outputsArray[j + 3].hour = dataOut[++f]
                                    outputsArray[j + 3].minute = dataOut[++f];
                                    outputsArray[j + 3].second = dataOut[++f];
                                    outputsArray[j + 3].flag = 1;
                                    // update flag output 
                                    where += ",?"
                                    where_params[++where_index] = j + 4
                                    where_index++

                                    j += 4;
                                    f++;
                                    num_of_touch++;
                                }
                            }

                            /// Set flat=1 for Active outputs in DB
                            where += ")"
                            //                    console.log(where + "---"+where_params.length)
                            ZagrosDB.buildQuery(Vars.queryUpdate, "Output", "flag", where, where_params, "", "", 0).then(
                                data => {
//                                    console.log("got in updateeeeeee")
                                    resolve(outputsArray)
                                }
                            ).catch(error => {
//                                console.log(error + "eeeeeeeeeeeee")
                                //                            alert(i18n.t("output:errorSaveOutputLocationInDB"));
                                reject(error)
                            });

//                            console.log(outputsArray[0].id + "-" + outputsArray[1].hour + "-" + outputsArray.length)
                            resolve(outputsArray)
                        }
                    )
                        .catch(
                            error => {
//                                console.log("errorrrrrrrrrrrrrr: " + error)
                                //                    getResponse = 1
                                //                    getError = 1
                                //                    if(retry > 0){
                                //                               this.getAllOutputsFromController(outputs, retry-1)
                                //                    }
                                //                    else {
                                //                         console.log("eeeeeeeefffff"+retry)
                                //                         if(timeout != ""){  clearTimeout(timeout) }
                                reject(error)
                            })

                    //            timeout = setTimeout(() => {
                    //                if((getResponse == 0 && getError == 0)){
                    //                    if(retry > 0){
                    //                      this.getAllOutputsFromController(outputs, retry-1)
                    //                    }
                    //                    else {
                    //                         console.log("eeeeeeeefffff"+retry)
                    //                      reject(i18n.t('output:errorGetOutputDataFromDB'))
                    //                    }
                    //                  }
                    //              }, 2000);



                }
            )
                .catch(error => {
                    //                if(retry > 0){
                    //                           this.getAllOutputsFromController(outputs, retry-1)
                    //                }
                    //                else {
//                    console.log("Error in felan eeeeeeeefffff " + retry)
                    //                     if(timeout != ""){  clearTimeout(timeout) }
                    reject(error)
                    //                }
//                    console.log("eeeee" + error)
                });
        })



    }

    /// Dashboard page
    getOutputsFromController(outputsState) {
        changedOuts = 0;

        return new Promise((resolve, reject) => {


//            udp1.sendUdpPacket(Commands.REQ_OUTPUT, Commands.FLAG_GET, "", "", "", true).then(
            udpO = new UDP(Commands.REQ_OUTPUT, Commands.FLAG_GET, "")
            udpO.sendUdpPacket("", "", true, 500).then(
                dataOutUdp => {
                    //                     console.log("udpppppppppppppppppp lennnn: " + dataOutUdp.length)
                    if (dataOutUdp.length >= this.udpOutMinLen) {
                        dataOut = new Array();
                        CommonFunctions.arrayCopy(dataOutUdp, 4, dataOut, 0, dataOutUdp.length - 4);

                        outputsArray = [...outputsState]

                        // Get number of outputs in first 6 bytes of packetda
                        Output.OUTPUT_WIFI_WITH_RELAY = dataOut[0]
                        Output.OUTPUT_WIFI_RELAY = dataOut[1]
                        Output.OUTPUT_RS485_WITH_RELAY = dataOut[2]
                        Output.OUTPUT_RS485_RELAY = dataOut[3]
                        Thermometer.WIFI_THERMOMETER = dataOut[4]
                        Thermometer.RS485_THERMOMETER = dataOut[5]

                        j = 0

                        // Get Digital and analog outputs from packet 
                        to = 6 + (Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG) * 2
                        for (i = 6; i < to; i++) {
                            //                              console.log("In digitallll: " + i +"---" + j + "---" + outputsArray[j].value +"---" + outputsArray[j].timer + "---")
                            //                              console.log("i: " + (j+1) + "---" +(outputsArray[j].value != dataOut[i]) +"------"+outputsArray[j].value+"----"+dataOut[i])

                            if ((outputsArray[j].value != dataOut[i])) {
                                //todo: Add timer
                                //		                      || (outputsArray[j].timer != dataOut[i+1]) ){
                                outputsArray[j].value = dataOut[i] //(dataOut[i] == 1) ? true:false;
                                //todo: Add timer
                                //		                      outputsArray[j].timer = dataOut[i+1];
                                changedOuts = 1
                            }
                            //	                        outputsArray[j].type = 0;
                            //	                        outputsArray[j].type_id = j+1
                            i++
                            j++;
                        }

                        // Get Wifi / Rs485 outputs from packet   
                        f = to;
                        to = dataOut.length - 2
                        // output = new Output()
                        level = Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG
                        n_level = 0
                        num_of_touch = 0

                        // Todo: Status 
                        //                    console.log("Frommmm: " + f+"---"+to+"---"+level)
                        while (f < to) {
                            if (num_of_touch >= dataOut[n_level]) {
                                level = level + this.MAX_ARRAYS[n_level]
                                n_level++
                                num_of_touch = 0
                            }
                            j = level + ((dataOut[f] - 1) * 4);

                            //                         console.log("###"+f+"--"+dataOut[f]+"--"+j )

                            val1 = dataOut[f + 1] & 0X01
                            va1B = outputsArray[j].value // & 0X01

                            //                         console.log("###j:   "+j+"----" + dataOut[f+1] +"-----" +val1 +"---f:"  + f+"---" +"------------")
                            if ((val1 != va1B) || (outputsArray[j].flag != 1)) {
                                //                         (outputsArray[j].timer != dataOut[f+2]) ||

                                outputsArray[j].value = val1 // (val1 == 1) ? true:false;
                                //todo: Add timer
                                //		                      outputsArray[j].timer = dataOut[f+2];
                                outputsArray[j].flag = 1;
                                changedOuts = 1
                            }

                            val2 = (dataOut[f + 1] >> 1) & 0X01
                            va2B = outputsArray[j + 1].value// >> 1) & 0X01

                            //                         console.log("###j:   "+j+"----" + dataOut[f+1] +"-----" +val2 +"---"  +  "------------" )
                            if ((val2 != va2B) || (outputsArray[j + 1].flag != 1)) {
                                //                          (outputsArray[j+1].timer != dataOut[f+3]) ||
                                outputsArray[j + 1].value = val2 //( val2 == 1) ? true:false;
                                //todo: Add timer
                                //		                      outputsArray[j+1].timer = dataOut[f+3];
                                outputsArray[j + 1].flag = 1;
                                changedOuts = 1
                            }

                            val3 = (dataOut[f + 1] >> 2) & 0X01
                            val3B = (outputsArray[j + 2].value) //>> 2) & 0X01

                            //                         console.log("###j:   "+j+"----" + dataOut[f+1] +"-----" +val3 +"---"   + "------------" )
                            if ((val3 != val3B) || (outputsArray[j + 2].flag != 1)) {
                                //                         (outputsArray[j+2].timer != dataOut[f+4]) ||
                                outputsArray[j + 2].value = val3 // (val3 == 1) ? true:false;
                                //todo: Add timer
                                //		                      outputsArray[j+2].timer = dataOut[f+4];
                                outputsArray[j + 2].flag = 1;
                                changedOuts = 1
                            }

                            val4 = (dataOut[f + 1] >> 3) & 0X01
                            val4B = (outputsArray[j + 3].value) // >> 3) & 0X01
                            //                         console.log("###j:   "+j+"----" + dataOut[f+1] +"-----" +val4 +"---"  +"------------" )
                            if ((val4 != val4B) || (outputsArray[j + 3].flag != 1)) {
                                //                        (outputsArray[j+3].timer != dataOut[f+5]) ||
                                outputsArray[j + 3].value = val4 //(val4 == 1) ? true:false;
                                //todo: Add timer
                                //		                      outputsArray[j+3].timer = dataOut[f+5];
                                outputsArray[j + 3].flag = 1;
                                changedOuts = 1
                            }

                            f += 6;
                            num_of_touch++;
                        }
                        //                   console.log(outputsArray === this.)
                        //		console.log("Are Equalll in func:   "+ changedOuts)
                        if(changedOuts == 1){
                            resolve(outputsArray)
                         }
                         else{
                            resolve(false)
                         }
                    }
                    else {
//                        console.log("error in update outputs data len is SMALL ")
                        reject("error in update outputs 0: ")
                    }
                }
            ).catch(error => {
                // alert(i18n.t('output:errorUpdateOutputs'))
//                console.log("error in update output : ::::" + error)
                reject(error)
            })

        })
        //        .catch(error => {
        //
        //                    console.log("error update outputs 2: " + error)
        //                    reject(error)
        //        })
    }


    /// Update location id of outputs in DB    
    updateOutputLocation(location_id, outputs, mode) {

        // Set location id to 0 for All outputs of selected location
        params = new Array();
        params[0] = 0;
        ZagrosDB.buildQuery(Vars.queryUpdate, "Output", "location_id", "location_id = " + location_id, params, "", "", 0).then(
            data => {

            }
        )
            .catch(
                error => {
                    alert(i18n.t("output:errorSaveOutputLocationInDB"));
                }
            );

        if (mode != Vars.modeDelete) {
            outputArray = new Array();
            outputArray = outputs;

            outputString = "";
            for (i = 0; i < outputArray.length; i++) {
                if (outputArray[i] == true) {
                    if (outputString == "") {
                        outputString = i + 1;
                    }
                    else {
                        outputString += "," + (i + 1);
                    }
                }
            }

            // Set location id for all selected outputs for this location
            params1 = new Array();
            params1[0] = location_id;
            ZagrosDB.buildQuery(Vars.queryUpdate, "Output", "location_id", "id IN (" + outputString + ") ", params1, "", "", 0).then(
                data => {

                }
            )
                .catch(
                    error => {
                        alert(i18n.t("output:errorSaveOutputLocationInDB"));
                    }
                );
        }

    }


    /// Update an output in controller and DB
    updateOutput(output) {

        //        if(!retry && retry != 0){retry = 5;}
        //        getResponse = 0
        //        getError = 0

        // alert(output.id + "--" + output.type + "--" + output.type_id)
        return new Promise((resolve, reject) => {

            outputArray = new Array();
            if ((output.type == this.OUTPUT_DIGITAL_TYPE) || (output.type == this.OUTPUT_ANALOG_TYPE)) {
                outputArray[0] = output.id;
            }
            else {
                outputArray[0] = output.type_id;
            }

            outputArray[1] = output.hour;
            outputArray[2] = output.minute;
            outputArray[3] = output.second;
            outputArray[4] = output.type;

            // console.log("in حقخخخخ")
            udp1 = new UDP(Commands.REQ_OUTPUT, Commands.FLAG_EDIT, outputArray);
            udp1.sendUdpPacket("", "", true).then(
                data => {
                    //   alert("response: " + data)
                    if (data.length > 0 && data != false) {
                        //                        getResponse = 1
                        //                        getError = 0

                        this.saveOutputInDB(output);
                        resolve(true)
                    }
                    else {
                        //                         getResponse = 1
                        //                         getError = 1
                        reject(i18n.t("common:errorSaveDateInController"));
                    }
                }
            )
            .catch(
                error => {
                    //                    getResponse = 1
                    //                    getError = 1
                    reject(error);
                }

            )

            //            setTimeout(() => {
            //                if((getResponse == 0) && (getError == 0)){
            //                  if(retry > 0){
            //                    this.updateOutput(output, retry-1)
            //                  }
            //                  else {
            //                    alert(i18n.t("common:errorSaveDateInController"))
            //                    reject(false)
            //                  }
            //                }
            //            }, 2000);

        }) // End Promise


    }

    saveOutputInDB(output) {
        params = new Array();
        params[0] = output.name;
        params[1] = output.icon;

        ZagrosDB.buildQuery(Vars.queryUpdate, "Output", "name,icon", "id = " + output.id, params, "", "", 0, 0).then(
            data => {

            }
        )
            .catch(
                error => {
                    alert(i18n.t("output:errorSaveOutput"));
                }
            );

    }

    /// Delete all outputs in DB and call createAllOutputs function
    createOutputs(t) {
        return new Promise((resolve, reject) => {
            try {
                ZagrosDB.buildQuery(Vars.queryDelete, "Output", "", "", "", "", "", 0).then(
                    data1 => {
                        this.createAllOutputs(t).then(
                            res => {
                                resolve(res)
                            }
                        )
                        .catch(error => {
                            // console.log("cccccccccccccccccccccccccccccccc" + error + "***************" + i18n.t('output:errorDeleteOutputsFromDB'))

                            alert(i18n.t('output:errorDeleteOutputsFromDB'))
                            reject(i18n.t('output:errorDeleteOutputsFromDB'))
                        });
                    })
                    .catch(
                        error => {
                            //   console.log("eror in deleteeeeeeeeeeeeeeeeeee" + error + "***************" + i18n.t('output:errorDeleteOutputsFromDB'))
                            alert(i18n.t('output:errorDeleteOutputsFromDB'));
                            reject(i18n.t('output:errorDeleteOutputsFromDB'))
                        }
                    );
            }
            catch (e) {
                alert(i18n.t('output:errorDeleteOutputsFromDB'));
                resolve(reject);
            }
        });
    }

    /// Make a sql to insert all outputs into DB
    createAllOutputs(t) {
        return new Promise((resolve, reject) => {
            try {
                params = new Array();

                sqlMakeTable = "INSERT INTO Output(id, name, icon, type, location_id, flag, type_id) VALUES ";

                /// The number of Output digital and analog , initialized in Login command
                /// and can be used by Output.var 
                /// Other variables should be used by this.var because they haven't been initialized yet
                for (i = 1; i <= Output.OUTPUT_DIGITAL; i++) {
                    if (i != 1) {
                        sqlMakeTable += ",";
                    }
                    //                    console.log("type digital: " +i+"---"+t('output:outputDigital') + " " + i)
                    sqlMakeTable += "(" + i + ", ?, 0, " + this.OUTPUT_DIGITAL_TYPE + ", 0, 0, " + i + " )";
                    params[i - 1] = t('output:outputDigital') + " " + i;
                }

                max = Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG
                from = Output.OUTPUT_DIGITAL + 1
                type_id = 1

                /// Query for insert all output Analog
                for (j = from; j <= max; j++) {
                    //                console.log("type analog: " +j+"---"+t('output:outputAnalog') + " " + j)
                    sqlMakeTable += ",(" + j + ", ?, 0, " + this.OUTPUT_ANALOG_TYPE + ", 0, 0, " + type_id + " )";
                    params[j - 1] = t('output:outputAnalog') + " " + j;
                    type_id++
                }

                /// Query for insert all output WifiWithRelay
                max = max + this.OUTPUT_WIFI_WITH_RELAY;
                from = from + Output.OUTPUT_ANALOG
                outputPol = 1
                type_id = 1
                output_num = 1
                for (w = from; w <= max; w++) {
                    //                console.log("type: " +this.OUTPUT_WIFI_WITH_RELAY_TYPE+"----"+w+"---"+t('output:outputWifiWithRelay') + " " + output_num + " " + t('output:pol'))+ " " + outputPol;

                    sqlMakeTable += ",(" + w + ", ?, 0, " + this.OUTPUT_WIFI_WITH_RELAY_TYPE + ", 0, 0, " + type_id + ")";
                    params[w - 1] = t('output:outputWifiWithRelay') + " " + output_num + " " + t('output:pol') + " " + outputPol;
                    outputPol++;
                    if (outputPol == 5) { outputPol = 1; output_num++; }
                    type_id++
                }

                /// Query for insert all output WifiWithRelay
                max = max + this.OUTPUT_WIFI_RELAY;
                from = from + this.OUTPUT_WIFI_WITH_RELAY
                outputPol = 1
                type_id = 1
                output_num = 1
                for (r = from; r <= max; r++) {
                    //                    console.log("type: " +this.OUTPUT_WIFI_RELAY_TYPE+"----"+r+"---"+t('output:outputWifiRelay') + " " + output_num + " " + t('output:pol'))+ " " + outputPol;
                    sqlMakeTable += ",(" + r + ", ?, 0, " + this.OUTPUT_WIFI_RELAY_TYPE + ", 0, 0, " + type_id + ")";
                    params[r - 1] = t('output:outputWifiRelay') + " " + output_num + " " + t('output:pol') + " " + outputPol;
                    outputPol++;
                    if (outputPol == 5) { outputPol = 1; output_num++; }
                    type_id++

                }

                /// Query for insert all output WifiWithRelay
                max = max + this.OUTPUT_RS485_WITH_RELAY;
                from = from + this.OUTPUT_WIFI_RELAY
                outputPol = 1
                type_id = 1
                output_num = 1
                for (s = from; s <= max; s++) {
//                    console.log("type: " + this.OUTPUT_RS485_WITH_RELAY_TYPE + "----" + r + "---" + t('output:outputRs485WithRelay') + " " + output_num + " " + t('output:pol')) + " " + outputPol;
                    sqlMakeTable += ",(" + s + ", ?, 0, " + this.OUTPUT_RS485_WITH_RELAY_TYPE + ", 0, 0, " + type_id + ")";
                    params[s - 1] = t('output:outputRs485WithRelay') + " " + output_num + " " + t('output:pol') + " " + outputPol;
                    outputPol++;
                    if (outputPol == 5) { outputPol = 1; output_num++; }
                    type_id++
                }

                /// Query for insert all output WifiWithRelay
                max = max + this.OUTPUT_RS485_RELAY;
                from = from + this.OUTPUT_RS485_WITH_RELAY
                outputPol = 1
                type_id = 1
                output_num = 1
                for (e = from; e <= max; e++) {
//                    console.log("type: " + this.OUTPUT_RS485_RELAY_TYPE + "----" + e + "---" + t('output:outputRs485Relay') + " " + output_num + " " + t('output:pol')) + " " + outputPol;
                    sqlMakeTable += ",(" + e + ", ?, 0, " + this.OUTPUT_RS485_RELAY_TYPE + ", 0, 0, " + type_id + ")";
                    params[e - 1] = t('output:outputRs485Relay') + " " + output_num + " " + t('output:pol') + " " + outputPol;
                    outputPol++;
                    if (outputPol == 5) { outputPol = 1; output_num++; }
                    type_id++
                }

                ZagrosDB.executeSQL(sqlMakeTable, params, 0)
                    .then(
                        data => {
                            ZagrosDB.buildQuery(Vars.querySelect, "Output", "COUNT(*) AS count", "", "", "", "", 1).then(
                                data2 => {
                                    //  console.log(sqlMakeTable)
                                    resolve(data2);
                                }
                            )
                                .catch(
                                    error => {
                                        // console.log(error + t("output:errorGetOutputDataFromDB") );
                                        reject(t("output:errorGetOutputDataFromDB"))
                                    }
                                );

                        }
                    )
                    .catch(
                        error => {
                            alert(t("output:errorGetOutputDataFromDB"));
                            reject(t("output:errorGetOutputDataFromDB"))
                        }
                    );

            }
            catch (error) {
                // console.log("errrrorrrrrrrrrrrrrrrrrrrrrrrrrr: " +error + "---" + "outputs Error ")
                alert(t("output:errorSaveOutput"));
            }
        });
    }

}

translate(['Output', 'common'], { wait: true })(Output);
