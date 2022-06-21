import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import Output from '../../Output/lib/Output';
import i18n from 'i18next';

 export default class Input  {

    INPUT_NUMBER = 280;
    INPUT_DIGITAL = 8
    INPUT_MAX_NAUMBER = 288
    INPUT_WIFI_WITH_RELAY = 80;
    INPUT_RS485_WITH_RELAY = 40;
    INPUT_WIFI_WITHOUT_RELAY = 80;
    INPUT_RS485_WITHOUT_RELAY = 80;

    INPUT_DIGITAL_TYPE = 0;
    INPUT_ANALOG_TYPE = 1;
    INPUT_WIFI_WITH_RELAY_TYPE = 2
    INPUT_RS485_WITH_RELAY_TYPE = 4
    INPUT_WIFI_WITHOUT_RELAY_TYPE = 14
    INPUT_RS485_WITHOUT_RELAY_TYPE = 15

    TOUCHSWITCH_MAX_NUMBER = 96;
    TOUCHSWITCH_WIFI_WITH_RELAY = 20;
    WIFI_RELAY = 10;
    TOUCHSWITCH_RS485_WITH_RELAY = 10;
    RS485_RELAY = 16;
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
	        this.MAX_ARRAYS[0] = this.INPUT_WIFI_WITH_RELAY;
	        this.MAX_ARRAYS[1] = 0;
	        this.MAX_ARRAYS[2] = this.INPUT_RS485_WITH_RELAY;
	        this.MAX_ARRAYS[3] = 0;
	        this.MAX_ARRAYS[4] = 0;
	        this.MAX_ARRAYS[5] = 0;
	        this.MAX_ARRAYS[6] = 0;
	        this.MAX_ARRAYS[7] =0;
	        this.MAX_ARRAYS[8] = 0
	        this.MAX_ARRAYS[9] = 0
	        this.MAX_ARRAYS[10] = 0
	        this.MAX_ARRAYS[11] = 0
	        this.MAX_ARRAYS[12] = this.INPUT_WIFI_WITHOUT_RELAY;
	        this.MAX_ARRAYS[13] = this.INPUT_RS485_WITHOUT_RELAY;
    }

    // Make Input table in DB
  makeTable(){
	try{
	          sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Input] ("
	                     + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
	                     + "[title] TEXT NOT NULL,"
	                     + "[status] INTEGER NOT NULL,"
	                     + "[type_id] INTEGER NOT NULL,"
	                     + "[type] INTEGER NOT NULL)";

	           ZagrosDB.executeSQL(sqlMakeTable);
	}
	catch(error){
		alert("Error: " + error);
	//            return 0;
	}
    }

    // Create Base inputs
    createInputs(t){
//        alert("in create Input: " + props)
       return new Promise((resolve, reject) => {
            try{
                ZagrosDB.buildQuery(Vars.queryDelete, "Input", "", "", "", "", "",0).then(
                data1 => {
                    this.createAllInputs(t).then(
                        res => {
                            resolve(res)
                        }
                    )
                    .catch(error => {
                        alert(error)
                        reject(error)
                    }
                    );

                 }

                 )
                 .catch(
                     error => {
                          alert(error + t('controller:errorResponseConnectController'));
                          reject(error)
                     }
                 );
            }
            catch(e){
                alert("Error: " + e);
                resolve(reject);
            }
        }
        );
    }

    // Create a Query to insert all inputs in DB
    async createAllInputs(t){
      return new Promise((resolve, reject) => {
  //        therm = props.t('thermometer:thermometer');
//        alert("in create all Inputs");
          try{
              params = new Array();

              sqlMakeTable = "INSERT INTO Input(title, status, type_id, type) VALUES ";

//                    alert(props.t('Input:InputAnalog'));
              // Query for insert all Input Digital
              
                for(i = 1; i <= this.INPUT_DIGITAL; i++){
	                    if(i != 1){
	                        sqlMakeTable += ",";
	                    }
	                    sqlMakeTable += "(?, 0, " + i +", " + this.INPUT_DIGITAL_TYPE + ")";
	                    params[i-1] = t('input:input') + " " + i;
                } 
            

                max = this.INPUT_DIGITAL + this.INPUT_WIFI_WITH_RELAY;  
                from = this.INPUT_DIGITAL + 1              
                i2 = 1;
                inputPol = 1
                input_num = 1
                // Query for insert all input wifi with relay
                for(j = from; j <= max; j++){
                    sqlMakeTable += ",(?, 0, "+ i2 +", " + this.INPUT_WIFI_WITH_RELAY_TYPE + ")";
                    params[j-1] = t('input:inputWifiWithRelay') + " " + input_num + " " + t('output:pol') + " " + inputPol;
                    i2++; 
                    inputPol++;
                    if(inputPol == 5){ inputPol = 1; input_num++;}
                }
            
                max = max + this.INPUT_RS485_WITH_RELAY;
                from = from + this.INPUT_WIFI_WITH_RELAY;
                i3 = 1
                inputPol = 1
                input_num = 1
                // Query for insert all input Analog
                for(s = from; s <= max; s++){
                    sqlMakeTable += ",(?, 0, " + i3 + ", " + this.INPUT_RS485_WITH_RELAY_TYPE + ")";
                    params[s-1] = t('input:inputRs485WithRelay') + " " + input_num + " " + t('output:pol') + " " + inputPol;
                    i3++
                    inputPol++;
                    if(inputPol == 5){ inputPol = 1; input_num++;}
                }
            
                max = max + this.INPUT_WIFI_WITHOUT_RELAY;
                from = from + this.INPUT_RS485_WITH_RELAY;
                i4 = 1
                inputPol = 1
                input_num = 1
                // Query for insert all input Analog
                for(d = from; d <= max; d++){
                    sqlMakeTable += ",(?, 0, " + i4 + ", " + this.INPUT_WIFI_WITHOUT_RELAY_TYPE + ")";
                    params[d-1] = t('input:inputWifiWithoutRelay') + " " + input_num + " " + t('output:pol') + " " + inputPol;
                    i4++
                    inputPol++;
                    if(inputPol == 5){ inputPol = 1; input_num++;}
                }
            
                max = max + this.INPUT_RS485_WITHOUT_RELAY;
                from = from + this.INPUT_WIFI_WITHOUT_RELAY;
                i5 = 1
                inputPol = 1
                input_num = 1
                // Query for insert all input Analog
                for(e = from; e <= max; e++){
                    sqlMakeTable += ",(?, 0, " + i5 + ", " + this.INPUT_RS485_WITHOUT_RELAY_TYPE + ")";
                    params[e-1] = t('input:inputRs485WithoutRelay') + " " + input_num + " " + t('output:pol') + " " + inputPol;
                    i5++
                    inputPol++;
                    if(inputPol == 5){ inputPol = 1; input_num++;}
                }

              ZagrosDB.executeSQL(sqlMakeTable, params,0)
              .then(
                  data => {
                      ZagrosDB.buildQuery(Vars.querySelect, "Input", "COUNT(*) AS count", "", "", "", "",1).then(
                           data2 => {
//                                     alert("input" + "---" + data2[0].count)
                               resolve(data2);
                           }
                        )
                        .catch(
                            error => {
                                 alert(error );
                                 reject(error)
                            }
                        );
                  }
               )
               .catch(
                   error => {
                        alert(error);
                        reject(error)
                   }
               );
            

             
             }
             catch(error){
                alert(error);
             }
         });

      }

    getAllInputsFromDB(){
        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.querySelect, "Input", "", "", "", "", "", 1).then(
                inputs => {
                    resolve(inputs);
                }
            ).catch(
                error => {
//                    alert(error + i18n.t("input:errorGetInputDataFromDB"));
                    reject(false)
                }
            ) 
        })
    }

     getAllActiveInputsFromDB(){
        return new Promise((resolve, reject) => {
            ZagrosDB.buildQuery(Vars.querySelect, "Input", "", "", "", "", "", 1).then(
                inputs => {
//                console.log("get all inputs" + inputs.length +"----")
//                console.log("get all inputs 2" + inputs[10].title +"----" + inputs[10].status +"---"
//                 + inputs[11].title +"----" + inputs[11].status + "---"
//                  + inputs[12].title +"----" + inputs[12].status)
                    resolve(inputs);
                }
            ).catch(
                error => {
//                    alert(error + i18n.t("input:errorGetInputDataFromDB"));
                    reject(false)
                }
            )
        })
    }

    getActiveInputsFromController(retry){
        return new Promise((resolve, reject) => {
        this.getAllInputsFromDB().then(
            inputs => {
//                    if(!retry && retry != 0){
//                        retry = 3
//                    }
                    
                    inputs.map((input) => {
                        input.status = 0
                     });
                    
                     params = new Array()
                     params[0] = 0
                     ZagrosDB.buildQuery(Vars.queryUpdate, "Input", "status", "", params, "", "", 0).then(
                          data => {
	                     getResponse = 0
	                     getError = 0
                
                              udp1 = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_LISTING_MODULES, "");
                              udp1.sendUdpPacket("", "", true, 2000).then(
                                        dataListUdp => {
//                                                 getResponse = 1
//                                                 getError = 0

                                                 where = ""
                                                 where_params = new Array()
                                                 where_params[0] = 1
                                                 where_index = 1

//                                                 console.log(dataListUdp.length)

                                                 dataOut = new Array();
                                                 CommonFunctions.arrayCopy(dataListUdp, 4, dataOut, 0, dataListUdp.length - 4);

                                                 // outputsArray = outputsState;
                                                 j = 0

                                                 // Get Wifi / Rs485 outputs from packet
                                                 f = 14
                                                 to = dataOut.length-2
                                                 level = this.INPUT_DIGITAL
                                                 n_level = 0
                                                 num_of_touch = 0

                                                 // console.log("aaaa"+touchesFromDB.length+"---"+f+"--"+to)
//                                                  console.log("----params:" + dataOut[0] + "-" + dataOut[1] + "-" + dataOut[2] + "-" + dataOut[3] + "-" +
//	                                                   + dataOut[4] + "-" + dataOut[5] + "-" + dataOut[6] + "-" + dataOut[7] + "-" +
//	                                                   + dataOut[8] + "-" + dataOut[9] + "-" + dataOut[10] + "-" + dataOut[11] + "-" +
//	                                                   + dataOut[12] + "-" + dataOut[13] + "-" + dataOut[14] + "-" + dataOut[15] + "-" +
//	                                                   + dataOut[16] + "-" + dataOut[17] + "-" + dataOut[18] + "-" + dataOut[19]+ "-" +
//	                                                   + dataOut[20] + "-" + dataOut[21] + "-" + dataOut[22] + "-" + dataOut[23]+ "-" +
//	                                                   + dataOut[24] + "-" + dataOut[25] + "-" + dataOut[26] + "-" + dataOut[27]+ "-" +
//	                                                   + dataOut[28] + "-" + dataOut[29] + "-" + dataOut[30] + "-" + dataOut[31]);

                                                 // Todo: Status
                                                 while(f<to){
                                                     if(num_of_touch >= dataOut[n_level]){ // After listing all touches of a level
	                                                     level = level + this.MAX_ARRAYS[n_level]
	                                                     n_level++
	                                                     num_of_touch = 0
//	                                                     console.log("in first:   "+level+"----"+n_level+"----")
                                                     }

                                                     while(n_level != 0 && n_level != 2 && n_level != 12 && n_level != 13  && n_level < 13){
//                                                                console.log("in 2:   "+level+"----"+n_level+"----"+f+"----"+num_of_touch)
	                                                      f = f + dataOut[n_level] * 2
	                                                      n_level++
	                                                      num_of_touch = 0
                                                     }

                                                     if(dataOut[n_level] > 0 && n_level < 14){
	                                                         j = level + ((dataOut[f]-1)*4);

//                                                                    console.log("in 3:    "+level+"----"+n_level+"----"+j+"---"+f+"---"+dataOut[n_level]+"---"+dataOut[f] +"---"+where_index)

	                                                         inputs[j].status = 1
	                                                         inputs[j+1].status = 1
	                                                         inputs[j+2].status = 1
	                                                         inputs[j+3].status = 1

	                                                         if(where.length == ""){ where = " id IN (?"; }else{ where += ",?"; }
	                                                         where_params[where_index] = (j+1)
	                                                         where_index++

	                                                         where += ",?";
	                                                         where_params[where_index] = (j+2)
	                                                         where_index++

	                                                         where += ",?";
	                                                         where_params[where_index] = (j+3)
	                                                         where_index++

	                                                         where += ",?";
	                                                         where_params[where_index] = (j+4)
	                                                         where_index++

	                                                         f+=2;
	                                                         num_of_touch++;

//	                                                         console.log("in Circle: " + f+"--"+j+"--"+num_of_touch)
                                                     }
                                                 }

                                                 if(where.length > 0) {
	                                                     where += ")";

	                                                     ZagrosDB.buildQuery(Vars.queryUpdate, "Input", "status", where, where_params, "", "", 0).then(
		                                                     data => {
//			                                                   console.log("got in updateeeeeee inputs/// " + where +"-----------"+where_params.length)
			                                                   resolve(inputs)
		                                                     }
	                                                     )
	                                                     .catch(error => {
//	                                                            getError = 1
//	                                                             console.log(error +"eeeeeeeeeeeee")
	                                                             reject(error)
//	                                                             alert(i18n.t("input:errorSaveInputInDB"));
	                                                     });
                                                 }
                                                 else{
                                                              resolve(inputs)
                                                 }

//                                                 setTimeout(() => {
//                                                     if((getResponse == 0 ) || (getError ==1) ){
//                                                         if(retry > 0){
//                                                             this.getActiveInputsFromController(inputs, retry-1)
//                                                         }
//                                                         else {
//                                                             reject(false)
//                                                         }
//                                                     }
//                                                 }, 1200);

                                         })
                                         .catch(error => {
//                                             getResponse = 0
//                                             getError = 1
                                             reject(error)
//                                           console.log("error in update : "+ error)
                                         })
                              }
                    )
                    .catch(error => {
                              reject(error)
                            // alert(i18n.t("output:errorSaveOutputLocationInDB"));
                            console.log("eeeee"+error)
                    });
            }
        )
        .catch(error => {console.log("error in get inputs: " +error)
                    reject(error)
        })

        })///End promise
    }


}
