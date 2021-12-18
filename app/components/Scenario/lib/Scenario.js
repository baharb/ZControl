import ZagrosDB from '../../Common/lib/DB';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import UDP from '../../Common/lib/UDP';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import Output from '../../Output/lib/Output';
import i18n from 'i18next';
import CommonFuncs from '../../Common/lib/CommonFuncs';

 export default class Scenario  {

    SCENARIO_MAX_NUMBER = 30;

    // Make output table in DB
    makeTable(){
//           alert("make table");
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Scenario] ("
                          + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                          + "[status] INTEGER DEFAULT 0,"
                          + "[title] Text DEFAULT '',"
                          + "[icon] INTEGER DEFAULT 0,"
                          + "[order] INTEGER DEFAULT 0,"
                          + "[show_home] BOOLEAN DEFAULT FALSE,"
                          + "[description] TEXT DEFAULT '');";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("scenario:errorCreateTable"));
//            return 0;
        }
    }

    /// Make a sql to insert all Scenarios into DB
    createAllScenarios(){
        return new Promise((resolve, reject) => {
            try{
                params = new Array();                
                sqlMakeTable = "INSERT INTO Scenario(title) VALUES ";
  
                for(i = 1; i <= this.SCENARIO_MAX_NUMBER; i++){
                    if(i != 1){
                        sqlMakeTable += ",(?)";
                    }
                    else{
                        sqlMakeTable += "(?)";
                    }
                    params[i-1] = i18n.t('scenario:scenario') + " " + i;
                }
               
                ZagrosDB.executeSQL(sqlMakeTable, params,0)
                    .then(
                        data => {
                            ZagrosDB.buildQuery(Vars.querySelect, "Scenario", "COUNT(*) AS count", "", "", "", "",1).then(
                                data2 => {
                                    resolve(data2);
                                }
                            )
                            .catch(
                                error => {
                                    // console.log(error + t("output:errorGetOutputDataFromDB") );
                                    reject(t("scenario:errorGetAllScenarios"))
                                }
                            );
  
                        }
                    )
                    .catch(
                        error => {
                            alert(t("scenario:errorGetAllScenarios"));
                            reject(t("scenario:errorGetAllScenarios"))
                        }
                    );
  
                }
                catch(error){
                    console.log("errrrorrrrrrrrrrrrrrrrrrrrrrrrrr: " +error + "---" + " Error Scenario")
                    alert(t("scenario:errorGetAllScenarios"));
                }
            });
      }

    // Delete a Scenario
    deleteScenario(scenarioId, retry){
        if(!retry && retry != 0){retry = 5}
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {

            params = new Array();
            params[0] = scenarioId;

            udp1 = new UDP((Commands.REQ_SCENARIO | Commands.MOD_CONFIG), Commands.FLAG_DELETE, params);
            udp1.sendUdpPacket("", "", true).then(
                data => {
                   getResponse = 1;
                   getError = 0
//                    alert("dddd: " + scenarioId +"---" + data)
                   if(data.length > 0 && data != false){

                        params1 = new Array();
                        params1[0] = 0;
                        // Delete selected Scenario. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "Scenario", "status", "id="+scenarioId, params1, "", "", 0, 0).then(
                           data => {
                                ZagrosDB.buildQuery(Vars.queryDelete, "VoiceCommand", "", "scenario_id="+scenarioId, "", "", "", 0, 0).then(
                                   data1 => {
                                        resolve(true);
                                   }
                                )
                                .catch(
                                   error => {
                                        reject(i18n.t("scenario:errorDeleteVoiceCommandScenario"));
                                   }
                                );
                           }
                        )
                        .catch(
                           error => {
                                reject(i18n.t("scenario:errorDeleteScenario"));
                           }
                        );
                   }
                   else{
                       console.log("Error in delete size of data" + data.length)
                       getError = 0
                       getResponse = 0
                   }
                }
            ).catch(error => {getResponse = 1; getError = 1;});

            setTimeout(() => {
              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if(getResponse == 0 && getError == 0){
                  // console.log("timeeeeout-" +outputId)
                  if(retry > 0){
                    this.deleteScenario(scenarioId, retry-1)
                  }
                  else {
                    reject(false)
                  }
                }
            }, 800);

        })
    }


    // Run a Scenario by scenario's id
    run(scenarioId, retry){
        let getResponse = 0
        let getError = 0

        if(!retry){
          retry = 3
        }
        params1 = new Array();
        params1[0] = scenarioId;

        udpRunS = new UDP(Commands.REQ_SCENARIO, Commands.FLAG_RUN, params1, );
        udpRunS.sendUdpPacket("", "", true).then(
            data => {
                getResponse = 1
                getError = 0
            }
        ).catch(error => {getResponse = 1; getError = 1})

        setTimeout(() => {
          // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
            if(getResponse == 0 && getError == 0){
              // console.log("timeeeeout-" +outputId)
              if(retry > 0){
                this.run(scenarioId, retry-1)
              }
              else{
                reject(i18n.t("scenario:errorRunScenario"))
              }
            }
        }, 500);

    }

    // Get a Scenario from Controller
    getScenario(scenarioId, retry){
        timeout = ""
        if(!retry && retry != 0){retry = 3}
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = scenarioId;

            udpGetS = new UDP(Commands.REQ_SCENARIO, Commands.FLAG_GET, params1);
            udpGetS.sendUdpPacket("", "", true, 1200).then(
                scenarioDataUdp => {
                   getResponse = 1
                   getError = 0
		console.log("Get scenario " +scenarioDataUdp.length +"--" +scenarioDataUdp )
                   if(scenarioDataUdp.length > 0 && scenarioDataUdp != false){
                         if(timeout != ""){ clearTimeout(timeout)}
                        dataScenario = new Array();
//                        alert("udp: "+ scenarioDataUdp[0]+"-"+scenarioDataUdp[1]+"-"+scenarioDataUdp[2]+
//                        "-"+scenarioDataUdp[3]+"-"+scenarioDataUdp[4]
//                        +"-"+scenarioDataUdp[5]+"-"+scenarioDataUdp[6]+"-"+scenarioDataUdp[7])
                        CommonFunctions.arrayCopy(scenarioDataUdp, 4, dataScenario, 0, scenarioDataUdp.length - 4);
//                         alert("data doo: "+ dataScenario[0]+"-"+dataScenario[1]+"-"+dataScenario[2]+
//                                                "-"+dataScenario[3]+"-"+dataScenario[4]
//                                                +"-"+dataScenario[5]+"-"+dataScenario[6]+"-"+dataScenario[7])
                        resolve(dataScenario);
                   }
                   else{
                        console.log("Error in Get Scenario")
                        getResponse = 1
                        getError = 1
                   }
                }
            ).catch(error => {getResponse = 0; getError = 1});

            timeout = setTimeout(() => {
                    console.log("Timeout in scenario : " + getError +"----" + getResponse)
                    if((getResponse == 0 && getError == 0) || (getError == 1)){
                  if(retry > 0){
                    this.getScenario(scenarioId, retry-1)
                  }
                  else {
                      alert(i18n.t("scenario:errorGetScenario"))
                    reject(false)
                  }
                }
            }, 1500);
        });
    }

    getScenarioBytes(scenarioIns, checkedOutputs, outputs, checkedCurtains, curtains, schedules, inputEvents) {
        actionSize = 0;
        outputLen = 0;
        curtainLen = 0;
        // inputEventsLen = 0;
        // scheduleLen = 0;

        try{
    //        alert(checkedOutputs.length + "-" + outputs[0].id + "-" + outputs[0].value + "-" + outputs[0].type + "---" +
    //        outputs[1].id + "-" + outputs[1].value + "-" + outputs[1].type + "-" + checkedCurtains.length +"---"
    //        + checkedCurtains[0])

            if(checkedOutputs != null){
                for(o=0; o<checkedOutputs.length; o++){
                    if(checkedOutputs[o] == true){
                        outputLen++
                    }
                }
            }

            if(checkedCurtains != null){
                for(c=0; c<checkedCurtains.length; c++){
                    if(checkedCurtains[c] == true){
                        curtainLen++
                    }
                }
            }

    //        actionSize = outputLen + curtainLen;

    //        alert("act: " + actionSize + "---" + scenarioIns.id + "-" + outputs.length)
            // 6 : 1 = action size, 1 = inputEvent size, 1 = schedules size, 1 = scenarioId, 2 = reserved
    //        scenarioBytesLen = 0;
            inputEventsLen = 0
            if(inputEvents != null && inputEvents != ""){
                for(e=0; e<inputEvents.length; e++){
                    // console.log("inputEvents: " + inputEvents[e])
                    if(inputEvents[e] == true){
                        inputEventsLen++
                    }
                }
            }

            scheduleLen = 0
            if(schedules != null && schedules != ""){
                for(s=0; s<schedules.length; s++){
                    // console.log("schedules: " + schedules[s])
                    if(schedules[s] == true){
                        scheduleLen++
                    }
                }
            }

            actionSize = outputLen + curtainLen
            scenarioBytes = new Array((actionSize * 3) + inputEventsLen + scheduleLen + 6 );
            // console.log("Action Sizeeeeeeeeee:" + actionSize)
            scenarioBytes[0] = scenarioIns.id;

            scenarioBytes[1] = 0x00;  //reserved
            scenarioBytes[2] = 0x00;  //reserved

            scenarioBytes[3] = actionSize;
            j = 4;

            output = new Output()
            //
            for (i = 0; i < outputs.length; i++) {
                // console.log("outpus: " + i + "----" + checkedOutputs[i] + "---" + j)

                if(checkedOutputs[i] && checkedOutputs[i] == true){
                   
                    // console.log("outpus Checked: " + i + "----" + checkedOutputs[i] + "---" + j)
                    id = ((outputs[i].type == output.OUTPUT_DIGITAL_TYPE) || (outputs[i].type == output.OUTPUT_ANALOG_TYPE)) ? outputs[i].id : outputs[i].type_id;
                    // alert(id)
                    scenarioBytes[j] = id;
                    scenarioBytes[j + 1] = (outputs[i].value == true) ? 1 : 0;
                    scenarioBytes[j + 2] = outputs[i].type;
                    // actionSize++;
                    j+=3;
                }
            }

            j = (outputLen * 3) + 4;
            //
            // console.log("Curtainssss: "+curtainLen + "---- " + curtains.length)
            for (i = 0; i < curtains.length; i++) {
                // console.log("Curtain: " + checkedCurtains[i] + "---" + j)
                    
                if(checkedCurtains[i] && checkedCurtains[i] == true){
                     console.log("Curtainnnnnnnnnnnnnnnnnnnnn: " +curtains[i].type_id + "---" + curtains[i].value + "---" + i +"---" + curtains[i].type )
                    scenarioBytes[j] = curtains[i].type_id;
                    scenarioBytes[j + 1] = curtains[i].value; // todo: curtain type
                    scenarioBytes[j + 2] = curtains[i].type;
                    // actionSize++;
                    j+=3;
                }
            }

            //

            j = 4 + (actionSize * 3) + 1;
            scheduleIndex = 4 + (actionSize * 3);
            scenarioBytes[scheduleIndex] = scheduleLen;
//            console.log("schedules: j: " + j + "----" + scheduleLen + "---" + scheduleIndex)
            // scheduleLen = 0;

            for (si = 0; si < schedules.length; si++) {
//                console.log("sc byte: " + si + ": " + schedules[si])
                if(schedules[si] == true){
                    scenarioBytes[j] = si+1;
                    j++
                    // scheduleLen++
                }
            }
            

    //        inputEventsLen = inputEvents.length;
            j = 4 + (actionSize * 3) + 2 + scheduleLen;
            inputLenIndex = 4 + (actionSize * 3) + 1 + scheduleLen;
            scenarioBytes[inputLenIndex] = inputEventsLen;
//            console.log("Input event: j: " + j + "----" + inputEventsLen + "---" + inputLenIndex)
            
            // console.log("IEEEEE: "+inputEvents.length)
            for (ie = 0; ie < inputEvents.length; ie++) {
//                console.log("ie byte: " + ie + ": " + inputEvents[ie])
                if(inputEvents[ie] == true){
                    scenarioBytes[j] = ie+1;
//                    console.log("save in byte: " +j+"---"+scenarioBytes[j])
                    j++;
                    // inputEventsLen++
                }
            }


//            console.log("scenario bytes: " + scenarioBytes[0] + "-" + scenarioBytes[1] + "-" + scenarioBytes[2] + "-" +
//            scenarioBytes[3] + "-" + scenarioBytes[4] + "-" + scenarioBytes[5] + "-" + scenarioBytes[6] + "-" +
//            scenarioBytes[7] + "-" + scenarioBytes[8] + "-" + scenarioBytes[9] + "-" + scenarioBytes[10] + "-" +
//            scenarioBytes[11] + "-" + scenarioBytes[12] + "-" + scenarioBytes[13] + "-" + scenarioBytes[14] + "-" +
//            scenarioBytes[15] + "-" + scenarioBytes[16] + "-" + scenarioBytes[17] + "-" + scenarioBytes[18] + "-" +
//            scenarioBytes[19] + "-" + scenarioBytes[20] + "-" + scenarioBytes[21] + "-" + scenarioBytes[22] + "-" )

            return scenarioBytes;
        }
        catch(error){
            console.log("Error in save scenario :" + error)
            return(false)
        }
    }

    saveScenarioInDB(id, scenarioIns){

        params = new Array();
        params[0] = scenarioIns.title;
        params[1] = scenarioIns.icon;
        params[2] = scenarioIns.showHome;
        params[3] = 1;

        ZagrosDB.buildQuery(Vars.queryUpdate, "Scenario", "title, icon, show_home, status", "id="+id, params, "", "", 0, 0).then(
            data => {

            }
        )
        .catch(
            error => {
                alert(i18n.t("scenario:errorSaveScenario"));
            }
        );        

    }

    saveScenario(ScenarioIns, checkedOutputs, outputs, checkedCurtains, curtains, checkedSchedules, checkedInputEvents, mode){
        return new Promise((resolve, reject) => {
//        if(!retry && retry != 0){retry = 3;}
        let getResponse = 0
        let getError = 0

        packetData = this.getScenarioBytes(ScenarioIns, checkedOutputs, outputs, checkedCurtains, curtains, checkedSchedules, checkedInputEvents);

        if(packetData == false){
            console.log("get byte of scenario : "+packetData)
            alert(i18n.t("scenario:errorSaveScenario"))
            reject(i18n.t("scenario:errorSaveScenario"))
        }
        else{
           params1 = new Array();

           command = "";
           if(mode == Vars.modeInsert){
               command = Commands.FLAG_CREATE;
           }
           else{
               command = Commands.FLAG_EDIT;
           }

            udp1 = new UDP((Commands.REQ_SCENARIO | Commands.MOD_CONFIG), command, packetData);
           udp1.sendUdpPacket("", "", true, 1200).then(
               scenarioDataUdp => {
                  getResponse = 1
                  getError = 0
//                alert("s: " + scenarioDataUdp +"--" + scenarioDataUdp[0] + "-" + scenarioDataUdp[1])
                  if(scenarioDataUdp.length > 0 && scenarioDataUdp != false){
                       if(scenarioDataUdp[4] == 1){
                            id = 0;

                            if(mode == Vars.modeInsert){
                                id = scenarioDataUdp[5];
                            }
                            else{
                                id = ScenarioIns.id;
                            }
//                            alert(id);
                            this.saveScenarioInDB(id,ScenarioIns);
                            resolve(true);
                       }
                       else{
                            console.log("Error in Save Scenario")
                            getResponse = 1
                            getError = 1
                            reject(error)
                       }
                  }
                  else{
                       console.log("Error in Save Scenario")
                       getResponse = 1
                       getError = 1
                       reject(error)
                  }
               }
           ).catch(error => {
               console.log("Error in save Scenario :: " + error)
               getResponse = 0; getError = 1
               reject(error)
            });

//           setTimeout(() => {
//             // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
//               if((getResponse == 0 && getError == 0) || (getError == 1)){
//                 // console.log("timeeeeout-" +outputId)
////                 if(retry > 0){
////                    this.saveScenario(ScenarioIns, checkedOutputs, outputs, checkedCurtains, curtains, checkedSchedules, checkedInputEvents, mode, retry-1)
////                 }
////                 else {
//                    console.log("reject fffffffffff")
//                    reject(i18n.t("scenario:errorSaveScenario"))
////                 }
//               }
//           }, 900);
        }

        });

       
    }

    updateScenariosFromController(){
        scenariosString = ""

        return new Promise((resolve, reject) =>{
            params1 = new Array();
            params1[0] = 0;

            ZagrosDB.buildQuery(Vars.queryUpdate, "Scenario", "status", "", params1, "", "", 0, 0).then(
                data => {

                }
            )
            .catch(
                error => {
                    console.log("Error in update Scenario in DB: " + error)
                    alert(i18n.t("scenario:errorSaveScenario"));
                }
            );      

            CommonFuncs.syncDB().then(dataFromController => {
                // from = scenario.SCENARIO_MAX_NUMBER + schedule.SCHEDULE_MAX_NAMBER
                to = this.SCENARIO_MAX_NUMBER
                j = 1

                for(i=0; i<to; i++){
                    if(dataFromController[i] == 1){
                        scenariosString += (scenariosString.length == 0) ? j : (","+j)
                    }
                    j++
                    // console.log("update scenarios : " + i + "--" + scenariosString)
                }

                
                params = new Array();
                params[0] = 1;

                ZagrosDB.buildQuery(Vars.queryUpdate, "Scenario", "status", "id IN("+scenariosString+")", params, "", "", 0, 0).then(
                    data => {

                    }
                )
                .catch(
                    error => {
                        console.log("Error in save Scenario in DB: " + error)
                        alert(i18n.t("scenario:errorSaveScenario"));
                    }
                );      

                resolve(scenariosString)
            })
            .catch(error => {
                console.log("Error sync DB from controller in scenario : " + error)
                reject(error)
            })  
        })
    }

    getAllScenariosFromController(){
        return new Promise((resolve, reject) => {
            connect.getAllDatasFromController().then(dataFromC => {
                resolve(dataFromC)
            })
            .catch(
                error => 
                {
                    console.log("Error in get data from controller");
                    reject(error)
                }
            )
        })
    }
    
}
