import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Commands from '../../Common/vars/commands';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import Curtain from '../../Curtain/lib/Curtain';
import RGB from '../../RGB/lib/RGB';
import DashboardItem from '../../Dashboard/lib/DashboardItem';
import Input from '../../Input/lib/Input';
import InputEvent from '../../InputEvent/lib/InputEvent';
import Location from '../../Location/lib/Location';
import Output from '../../Output/lib/Output';
import Scenario from '../../Scenario/lib/Scenario';
import Schedule from '../../Schedule/lib/Schedule';
import Thermometer from '../../Thermometer/lib/Thermometer';
import VoiceCommand from '../../VoiceCommand/lib/VoiceCommand';
import TouchSwitch from '../../TouchSwitch/lib/TouchSwitch';
import Relay from '../../Relay/lib/Relay';

export default class Setting  {

    // Get date and time from controller
    getDateTime(retry){
        if(!retry){retry = 5}
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {
            udpSet = new UDP(Commands.REQ_DATE_TIME, Commands.FLAG_GET, "");

            udpSet.sendUdpPacket("", "", true).then(
                dateTimeDataUDP => {
                   if(dateTimeDataUDP.length > 0 && dateTimeDataUDP != false){
                        getResponse = 1
                        getError = 0

                        dataDateTime = new Array();
                        CommonFunctions.arrayCopy(dateTimeDataUDP, 4, dataDateTime, 0, dateTimeDataUDP.length - 4);
                        resolve(dataDateTime);
                   }
                   else{
                        getResponse = 1
                        getError = 1
                        console.log("Error in Get Date time")
                   }
                }
            ).catch(error => {getResponse = 0; getError = 1});

            setTimeout(() => {
              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if(getResponse == 0 && getError == 0){
                  // console.log("timeeeeout-" +outputId)
                  if(retry > 0){
                    this.getDateTime(retry-1)
                  }
                  else {
                    reject(i18n.t("setting:errorGetDateTime"))
                  }
                }
            }, 800);
        });
    }

    // Todo:
    saveDateTimeInDB(){

    }

    saveDateTime(startYear, startMonth, startDay, startHour, startMinute, startSecond, retry){
        if(!retry){retry = 5}
        let getResponse = 0
        let getError = 0

        dateTime = new Array(7);
        dateTime[0] = (startYear >> 8) & 0xff;
        dateTime[1] = startYear & 0xFF;
        dateTime[2] = startMonth;
        dateTime[3] = startDay;
        dateTime[4] = startHour;
        dateTime[5] = startMinute;
        dateTime[6] = startSecond;


        return new Promise((resolve, reject) => {
            udp1 = new UDP((Commands.REQ_DATE_TIME | Commands.MOD_CONFIG), Commands.FLAG_EDIT, dateTime);

            udp1.sendUdpPacket("", "", true).then(
                dateTimeDataUDP => {
                      if(dateTimeDataUDP.length > 0 && dateTimeDataUDP != false){
                          getError = 0
                          getResponse = 1

                          this.saveDateTimeInDB()
                          resolve(true)
                      }
                   }


            ).catch(error => {getResponse = 0; getError = 1});

            setTimeout(() => {
              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if(getResponse == 0 && getError == 0){
                  // console.log("timeeeeout-" +outputId)
                  if(retry > 0){
                    this.saveDateTime(startYear, startMonth, startDay, startHour, startMinute, startSecond, retry-1)
                  }
                  else {
                    reject(i18n.t("setting:errorSaveDateTime"))
                  }
                }
            }, 800);
        });
    }

    resetToFactory(nav){
        console.log("innnn deleteing ... ")

        Setting.deleteTables();
        console.log(" go to home")
//        this.makeBaseTables();
        nav.navigate('Home');
    }

    requestResetToFactory(nav, retry){
      if(!retry && retry != 0){retry = 5}
       getResponse = 0
       getError = 0

      return new Promise((resolve, reject) => {
          udp1 = new UDP((Commands.REQ_RESET_TO_FACTORY | Commands.MOD_CONFIG), Commands.FLAG_EDIT, "");

          udp1.sendUdpPacket("", "", true).then(
              resetData => {
                    console.log("Resetttt...... to factory "+resetData.length +"---"+(resetData != false))
                    if(resetData != false){
                        getResponse = 1
                        getError = 0

                        this.resetToFactory(nav)
                    }
                    else{
                              getError = 1
                    }
                 }

          ).catch(error => {
                    getResponse = 0; getError = 1;
                    console.log("error in reset to factory : " + error)
           });

          setTimeout(() => {
             console.log("Time outtt- aaaa - " + retry)
              if((getResponse == 0 && getError == 0) || (getError == 1)){
                // console.log("timeeeeout-" +outputId)
                if(retry > 0){
                  this.requestResetToFactory(nav,retry-1)
                }
                else {
                  reject(i18n.t("setting:errorResetToFactory"))
                }
              }
          }, 800);
      });
    }

    getScheduleBytes(scheduleIns, mode, startYear, startMonth, startDay, startHour, startMinute,
                          startSecond, endYear, endMonth, endDay, endHour,
                          endMinute, endSecond) {
        schedule = new Array(19);
        schedule[0] = scheduleIns.id;
        schedule[1] = (startYear >> 8) & 0xff;
        schedule[2] = startYear & 0xFF;
        schedule[3] = startMonth;
        schedule[4] = startDay;
        schedule[5] = startHour;
        schedule[6] = startMinute;
        schedule[7] = startSecond;

        //end date: packet[8]-packet[14]
        if (endYear != null && endYear != "") {
            schedule[8] = (endYear >> 8) & 0xff;
            schedule[9] = endYear & 0xFF;
            schedule[10] = endMonth;
            schedule[11] = endDay;
            schedule[12] = endHour;
            schedule[13] = endMinute;
            schedule[14] = endSecond;

        } else {
            schedule[8] = 0;
            schedule[9] = 0;
            schedule[10] = 0;
            schedule[11] = 0;
            schedule[12] = 0;
            schedule[13] = 0;
            schedule[14] = 0;
        }

        if(ScheduleIns.endType == -1 || ScheduleIns.endType == 255){
          schedule[15] = -1;
        }
        else{
          schedule[15] = ScheduleIns.endRepeatTime;
        }

        schedule[16] = ScheduleIns.repeatUnit;
        schedule[17] = ScheduleIns.startRepeatTime;
        schedule[18] = ScheduleIns.weekDays;
//

        return schedule;
    }

    // Make output table in DB
    static makeTable(){
//           alert("make table");
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Setting] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[name] STRING NOT NULL,"
                               + "[value] STRING NOT NULL);";

            ZagrosDB.executeSQL(sqlMakeTable);
//            alert(sqlMakeTable + "----" +res)

        }
        catch(error){
            alert(i18n.t("setting:errorCreateTable"));
//            return 0;
        }
    }

    static makeBaseTables(){

        return new Promise((resolve, reject) => {
            try{
                   curtain = new Curtain();
                   rgb = new RGB();
                   dashboardItem = new DashboardItem();
                   input = new Input();
                   inputEvent = new InputEvent();
                   location = new Location();
                   output = new Output();
                   scenario = new Scenario();
                   schedule = new Schedule();
                   thermometer = new Thermometer();
                   voiceCommand = new VoiceCommand();
                   touchSwitch = new TouchSwitch();
                   relay = new Relay();

                   curtain.makeTable();
                   rgb.makeTable();
                   dashboardItem.makeTable();
                   input.makeTable();
                   inputEvent.makeTable();
                   location.makeTable();
                   output.makeTable();
                   scenario.makeTable();
                   schedule.makeTable();
                   this.makeTable()
                   thermometer.makeTable();
                   voiceCommand.makeTable();
                   touchSwitch.makeTable();
                   relay.makeTable();

                   resolve(true)
             }
            catch(error){
                 alert(i18n.t("setting:errorCreateBaseTables"));
                 console.log(error)
                 reject(false)
             }
        })

    }

   // Delete all tables
   // For new device
   static deleteTables() {
       try{
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Setting]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Camera]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [DashboardItem]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Location]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Input]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Output]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Scenario]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [InputEvent]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Schedule]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [VoiceCommand]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Curtain]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [RGB]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Thermometer]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [TouchSwitch]");
           ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Relay]");
       }
      catch(error){
        console.log("error in table : " +error)
          alert(i18n.t("setting:errorDeleteBaseTables"));
      }
   }
}

//export default translate(['Output', 'common'], { wait: true })(Output);
