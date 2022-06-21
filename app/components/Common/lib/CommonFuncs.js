import React from 'react';
import i18n from 'i18next';
import { translate} from 'react-i18next';
import ZagrosDB from './DB';
import UDP from './UDP';
import Commands from '../vars/commands';
import CommonFunctions from './CommonFunctions';

export class CommonFuncs extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          language: i18n.language,
        }

        // this.syncDBbyParams = this.syncDBbyParams.bind(this);
//        alert("nav : "+this.nav)
      }
    
    // static makeBaseTables(){
    //    try{
    //         condition = new Condition();
    //         curtain = new Curtain();
    //         dashboardItem = new DashboardItem();
    //         input = new Input();
    //         inputEvent = new InputEvent();
    //         inputEventOutput = new InputEventOutput();
    //         location = new Location();
    //         output = new Output();
    //         scenario = new Scenario();
    //         scenarioTrigger = new ScenarioTrigger();
    //         schedule = new Schedule();
    //         setting = new Setting();
    //         thermometer = new Thermometer();
    //         voiceCommand = new VoiceCommand();
    //         touchSwitch = new TouchSwitch();

    //         condition.makeTable();
    //         curtain.makeTable();
    //         dashboardItem.makeTable();
    //         input.makeTable();
    //         inputEvent.makeTable();
    //         inputEventOutput.makeTable();
    //         location.makeTable();
    //         output.makeTable();
    //         scenario.makeTable();
    //         scenarioTrigger.makeTable();
    //         schedule.makeTable();
    //         setting.makeTable();
    //         thermometer.makeTable();
    //         voiceCommand.makeTable();
    //         touchSwitch.makeTable();
    //    }
    //    catch(error){
    //        alert(this.props.t("setting:errorCreateBaseTables"));
    //    }
    // }

    // // Delete all tables
    // // For new device
    // static deleteTables() {
    //     try{
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Setting]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Camera]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [DashboardItem]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Location]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Input]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Output]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Scenario]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [ScenarioTrigger]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [InputEvent]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [InputEventOutput]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Condition]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Schedule]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [VoiceCommand]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Curtain]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Thermometer]");
    //         ZagrosDB.executeSQL("DROP TABLE IF EXISTS [TouchSwitch]");
    //     }
    //    catch(error){
    //        alert(this.props.t("setting:errorDeleteBaseTables"));
    //    }
    // }

    static syncDB(retry) {

        return new Promise((resolve, reject) => {
//                if(!retry && (retry != 0)){
//        		retry=5
//                }
//                timeout = ""
//                getResponse = 0
//                getError = 0

//             console.log("in Sync DB")
            udp1 = new UDP(Commands.REQ_TABLET_MB_GENERAL, Commands.FLAG_UPDATE_DB, "");
            udp1.sendUdpPacket("", "", true).then(
               data => {
                  getResponse = 1
//                  if(timeout != "") { clearTimeout(timeout) }
//                   console.log("res sync: "+data.length+"-"+data[0]+"-"+data[1]+"-"+data[2])
                  dataFromController = new Array()
                  CommonFunctions.arrayCopy(data, 4, dataFromController, 0, data.length - 4);
                   if(data){
//                        console.log("ok and resolve")
                       resolve(dataFromController)
                   }
                   else{
                          getError = 1
//                          console.log("dddddd: "+data)
                          reject("Error in sync db")
                      // TODO:
                   }
               }
            )
            .catch(error => {
                console.log("Error in sync DB: " + error)
                getError = 1
                reject(error)
            })

//            timeout = setTimeout(() => {
//            	       console.log("Time out  in Sync DB: " +getError+"---"+getResponse)
//                            if((getResponse == 0 && getError == 0) || (getError == 1)){
//                                if(retry > 0){
//                                        this.syncDB(retry-1)
//                                }
//                                else {
//                                        reject("Error in Sync DB")
//                                }
//                              }
//                          }, 3000);
          }
        )
        }


     static insertSetting(){
        try{
            
            return new Promise((resolve, reject) => {
                sqlInsTable = "INSERT INTO Setting(name, value) VALUES ";
                sqlInsTable += "(?,?)";
                sqlInsTable += ",(?,?)";
                sqlInsTable += ",(?,?)";
                sqlInsTable += ",(?,?)";

                params = new Array()
                params[0] = "ssid";
                params[1] = "";
                params[2] = "password";
                params[3] = "";
                params[4] = "securityKey";
                params[5] = "";
                params[6] = "staticIp";
                params[7] = "";

                ZagrosDB.executeSQL(sqlInsTable, params, 0)
                .then(
                    data => {
                        resolve(true)
                    }
                )
                .catch(
                    error => {
                        console.log(error);
                        reject(false)
                    }
                );
            })
        }
        catch(error){
            console.log("error insert setting" + error)
            reject(false)
        }
    }

     

}

export default translate(['CommonFuncs', 'common'], { wait: true })(CommonFuncs);
