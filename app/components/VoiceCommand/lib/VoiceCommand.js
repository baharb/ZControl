import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import UDP from '../../Common/lib/UDP';
import CommonFunctions from '../../Common/lib/CommonFunctions';

 export default class VoiceCommand  {

    // Make output table in DB
    makeTable(){
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [VoiceCommand] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[command] TEXT NOT NULL,"
                               + "[scenario_id] INTEGER DEFAULT 0,"
                               + "[output_id] INTEGER DEFAULT 0,"
                               + "[type_id] INTEGER DEFAULT 0,"
                               + "[type] INTEGER DEFAULT 0,"
                               + "[output_value] INTEGER NULL);";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("voiceCommand:errorCreateTable"));
        }
    }



    // Get a VoiceCommand from Controller
    getVoiceCommand(VoiceCommandId){
        if(!retry){retry = 5}
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = voiceCommandId;

            udpGetV = new UDP(Commands.REQ_SCHEDULE, Commands.FLAG_GET, params1);
            udpGetV.sendUdpPacket("", "", true).then(
                scheduleDataUdp => {

                   if(scheduleDataUdp.length > 0 && scheduleDataUdp != false){
                        getResponse = 1
                        getError = 0

                        dataSchedule = new Array();
//                        alert("udp: "+ ScheduleDataUdp[0]+"-"+ScheduleDataUdp[1]+"-"+ScheduleDataUdp[2]+
//                        "-"+ScheduleDataUdp[3]+"-"+ScheduleDataUdp[4]
//                        +"-"+ScheduleDataUdp[5]+"-"+ScheduleDataUdp[6]+"-"+scheduleDataUdp[7])
                        CommonFunctions.arrayCopy(scheduleDataUdp, 4, dataSchedule, 0, scheduleDataUdp.length - 4);
//                         alert("data doo: "+ dataSchedule[0]+"-"+dataSchedule[1]+"-"+dataSchedule[2]+
//                                                "-"+dataSchedule[3]+"-"+dataSchedule[4]
//                                                +"-"+dataSchedule[5]+"-"+dataSchedule[6]+"-"+dataSchedule[7])
                        resolve(dataSchedule);
                   }
                   else{
                        console.log("Error in Get Schedule")
                        getResponse = 1
                        getError = 1
                   }
                }
            ).catch(error => {getResponse = 0; getError = 1});

        });
    }


    saveVoiceCommandInDB(voiceCommandIns, mode, id){
      return new Promise((resolve, reject) => {
        // New VoiceCommand
        if(mode == Vars.modeInsert){
            params = new Array();
            params[0] = voiceCommandIns.command;
            params[1] = voiceCommandIns.scenario_id;
            params[2] = voiceCommandIns.output_id;
            params[3] = voiceCommandIns.type_id;
            params[4] = voiceCommandIns.type;
            params[5] = voiceCommandIns.output_value;

            ZagrosDB.buildQuery(Vars.queryInsert, "VoiceCommand", "command, scenario_id, output_id, type_id, type, output_value", "", params, "", "", 0, 0).then(
               data => {
                  resolve(true)
               }
            )
            .catch(
               error => {
                    alert(i18n.t("voiceCommand:errorSaveVoiceCommand"));
                    reject(false)
               }
            );
        }
        else{ // Edit old VoiceCommand

            params = new Array();
            params[0] = voiceCommandIns.command;
            params[1] = voiceCommandIns.scenario_id;
            params[2] = voiceCommandIns.output_id;
            params[3] = voiceCommandIns.type_id;
            params[4] = voiceCommandIns.type;
            params[5] = voiceCommandIns.output_value;

            ZagrosDB.buildQuery(Vars.queryUpdate, "VoiceCommand", "command, scenario_id, output_id, type_id, type, output_value", "id="+voiceCommandIns.id, params, "", "", 0, 0).then(
               data => {
                  resolve(true)
               }
            )
            .catch(
               error => {
                    alert(i18n.t("voiceCommand:errorSaveVoiceCommand"));
                    reject(false)
               }
            );
          }
        }
     );

    }

    // Delete a VoiceCommand
    deleteVoiceCommand(voiceCommandId){
        return new Promise((resolve, reject) => {
                    // Delete selected Schedule. set status to 0
                    ZagrosDB.buildQuery(Vars.queryDelete, "VoiceCommand", "", "id="+voiceCommandId, "", "", "", 0, 0).then(
                       data => {
                          resolve(true);
                       }
                    )
                    .catch(
                       error => {
                            console.log("error delete Voice command in db");
                       }
                    );
               }
            ).catch(error => {reject(false)});

    }
}
