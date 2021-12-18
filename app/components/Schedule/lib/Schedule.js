import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import UDP from '../../Common/lib/UDP';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import CommonFuncs from '../../Common/lib/CommonFuncs';

 export default class Schedule  {

    SCHEDULE_MAX_NAMBER = 30;

    // Make output table in DB
    makeTable(){
//           alert("make table");
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Schedule] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[status] INTEGER DEFAULT 0,"
                               + "[title] TEXT NOT NULL);";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("schedule:errorCreateTable"));
//            return 0;
        }
    }

    /// Make a sql to insert all Schedules into DB
    createAllSchedules(){
      return new Promise((resolve, reject) => {
          try{
              params = new Array();                
              sqlMakeTable = "INSERT INTO Schedule(title) VALUES ";

              for(i = 1; i <= this.SCHEDULE_MAX_NAMBER; i++){
                  if(i != 1){
                      sqlMakeTable += ",(?)";
                  }
                  else{
                      sqlMakeTable += "(?)";
                  }
                  params[i-1] = i18n.t('schedule:schedule') + " " + i;
              }
             
              ZagrosDB.executeSQL(sqlMakeTable, params,0)
                  .then(
                      data => {
                          ZagrosDB.buildQuery(Vars.querySelect, "Schedule", "COUNT(*) AS count", "", "", "", "",1).then(
                              data2 => {
                                  resolve(data2);
                              }
                          )
                          .catch(
                              error => {
                                  // console.log(error + t("output:errorGetOutputDataFromDB") );
                                  reject(t("schedule:errorGetAllSchedules"))
                              }
                          );

                      }
                  )
                  .catch(
                      error => {
                          alert(t("schedule:errorGetAllSchedules"));
                          reject(t("schedule:errorGetAllSchedules"))
                      }
                  );

              }
              catch(error){
                  console.log("errrrorrrrrrrrrrrrrrrrrrrrrrrrrr: " +error + "---" + " Error Schedule")
                  alert(t("schedule:errorGetAllSchedules"));
              }
          });
    }

    getDateByte(year, month, day, hour, minute, second) {
        dateTimeBytes = new Array(7);

        // dateBytes = new Array(4);
        dateTimeBytes[0] = (year >> 8) & 0xff;
        dateTimeBytes[1] = year & 0xFF;
        dateTimeBytes[2] = month;
        dateTimeBytes[3] = day;

        dateTimeBytes[4] = hour;
        dateTimeBytes[5] = minute;
        dateTimeBytes[6] = second;

    }

    saveSchedule(scheduleIns, mode, startYear, startMonth, startDay, startHour, startMinute,
                          startSecond, endYear, endMonth, endDay, endHour,
                          endMinute, endSecond, retry){
//        if(!retry && retry != 0){retry = 3}
        let getResponse = 0
        let getError = 0
        timeout = ""
        // ZagrosDB.executeSQL("DROP TABLE IF EXISTS [Schedule]");
        // this.makeTable();
        packetData = this.getScheduleBytes(scheduleIns, mode, startYear, startMonth, startDay, startHour, startMinute,
                            startSecond, endYear, endMonth, endDay, endHour,
                            endMinute, endSecond);

        return new Promise((resolve, reject) => {

           params1 = new Array();

           command = "";
           if(mode == Vars.modeInsert){
               command = Commands.FLAG_CREATE;
           }
           else{
               command = Commands.FLAG_EDIT;
           }
// alert("pack:" + p/acketData);
           udp1 = new UDP((Commands.REQ_SCHEDULE | Commands.MOD_CONFIG), command, packetData);
           udp1.sendUdpPacket("", "", true, 1200).then(
               scheduleDataUdp => {

                  if(scheduleDataUdp.length > 0 && scheduleDataUdp != false){
                       getResponse = 1
                       getError = 0
                       console.log("save schedule...." + scheduleDataUdp[5])
                       if(timeout != ""){clearTimeout(timeout)}
                       if(scheduleDataUdp[4] == 1){
                            id = 0;

                            if(mode == Vars.modeInsert){
                                id = scheduleDataUdp[5];
                            }
                            else{
                                id = scheduleIns.id;
                            }

                            resolve(true);
                            this.saveScheduleInDB(id, scheduleIns);
                       }
                       else{
                            console.log("Error in Save Schedule")
                            getResponse = 1
                            getError = 1
                            reject(false)
                       }
                  }
                  else{
                       console.log("Error in Save Schedule")
                       getResponse = 1
                       getError = 1
                       reject(false)
                  }
               }
           ).catch(error => { getResponse = 1; getError = 1; reject(error)});

//           timeout = setTimeout(() => {
//              console.log("schedule: - " + getResponse+"---"+getError)
//               if(getResponse == 0 || getError == 1){
//                 // console.log("timeeeeout-" +outputId)
////                 if(retry > 0){
////                   this.saveSchedule(scheduleIns, mode, startYear, startMonth, startDay, startHour, startMinute,
////                                           startSecond, endYear, endMonth, endDay, endHour,
////                                           endMinute, endSecond, retry-1)
////                 }
////                 else {
//                   reject(i18n.t("schedule:errorSaveSchedule"))
////                 }
//               }
//           }, 800);
        });



    }
            // // Params Got from Device:
            // // 0-29  => Scenarios
            // // 30-59 => Schedules
            // // 60-119 => InputEvents
    updateSchedulesFromController(scenarioMaxNumber){
      schedulesString = ""
//       if(!retry && retry != 0){
//                retry = 5
//            }
      console.log("in updateeeee: ")

      // scenario = new Scenario()

      return new Promise((resolve, reject) =>{
          
          params1 = new Array();
          params1[0] = 0;

          ZagrosDB.buildQuery(Vars.queryUpdate, "Schedule", "status", "", params1, "", "", 0, 0).then(
              data => {
		 CommonFuncs.syncDB().then(dataFromController => {
	              // from = scenarioMaxNumber
	              console.log("Get data from sync db: " + dataFromController)
	              to = scenarioMaxNumber + this.SCHEDULE_MAX_NAMBER
	              j = 1

	              for(i=scenarioMaxNumber; i<to; i++){
	                  if(dataFromController[i] == 1){
	                      schedulesString += (schedulesString.length == 0) ? j : (","+j)
	                  }
	                  j++

//	                   console.log("update Schedules : " + i + "--" + schedulesString)
	              }


	              params = new Array();
	              params[0] = 1;

	              ZagrosDB.buildQuery(Vars.queryUpdate, "Schedule", "status", "id IN("+schedulesString+")", params, "", "", 0, 0).then(
	                  data => {
				console.log("update status: ")
				resolve(schedulesString)
	                  }
	              )
	              .catch(
	                  error => {
	                      console.log("Error in save Schedule in DB: " + error)
	                      reject(error)
	                      alert(i18n.t("schedule:errorSaveSchedule"));
	                  }
	              );
	          })
                    .catch(error => {
                        console.log("Error sync DB from controller : " + error +"---")

//	              if(retry > 0){
//	                    this.updateSchedulesFromController(scenarioMaxNumber, retry-1)
//	              }
//	              else{
	                    reject(error)
//	              }
                    })
              }
          )
          .catch(
              error => {
                  console.log("Error in update Schedule in DB: " + error)
                  reject(error)
                  alert(i18n.t("schedule:errorSaveSchedule"));
              }
          );   


      })
    }

    // Get a Schedule from Controller
    getSchedule(scheduleId, retry){

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = scheduleId;

            udpSch = new UDP(Commands.REQ_SCHEDULE, Commands.FLAG_GET, params1);
            udpSch.sendUdpPacket("", "", true).then(
                scheduleDataUdp => {

                   if(scheduleDataUdp.length > 0 && scheduleDataUdp != false){
                        
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
                   }
                }
            ).catch(error => {reject(error)});

//            setTimeout(() => {
//              // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
//                if(getResponse == 0 && getError == 0){
//                  // console.log("timeeeeout-" +outputId)
//                  if(retry > 0){
//                    this.getSchedule(scheduleId, retry-1)
//                  }
//                  else {
//                    reject(i18n.t("schedule:errorGetSchedule"))
//                  }
//                }
//            }, 800);
        });
    }


    getScheduleBytes(scheduleIns, mode, startYear, startMonth, startDay, startHour, startMinute,
                          startSecond, endYear, endMonth, endDay, endHour,
                          endMinute, endSecond) {
//         byte[] schedule = new byte[19];
        schedule = new Array(19);

        schedule[0] = (scheduleIns.travel == 1) ? (scheduleIns.id | 0x80) : scheduleIns.id;
//        start date: packet[1]-packet[7]
//         System.arraycopy(this.getStartDateTime().getByte(), 0, schedule, 1, 7);
        // CommonFunctions.arrayCopy(this.getDateByte(startYear, startMonth, startDay, startH, startM, startS), 0, schedule, 1, 7);
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

        if(scheduleIns.endType == -1 || scheduleIns.endType == 255){
          schedule[15] = -1;
        }
        else{
          schedule[15] = scheduleIns.endRepeatTime;
        }

        schedule[16] = scheduleIns.repeatUnit;
        schedule[17] = scheduleIns.startRepeatTime;
        schedule[18] = scheduleIns.weekDays;
//

        return schedule;
    }

    saveScheduleInDB(id, scheduleIns){
          console.log("save schedule in db")
        params = new Array();
        params[0] = scheduleIns.title;
        params[1] = 1

        ZagrosDB.buildQuery(Vars.queryUpdate, "Schedule", "title, status", "id="+id, params, "", "", 0, 0).then(
            data => {

            }
        )
        .catch(
            error => {
                alert(i18n.t("schedule:errorSaveSchedule"));
            }
        );
    }

    // Delete a Schedule
    deleteSchedule(scheduleId, retry){
        if(!retry){retry = 5}
        let getResponse = 0
        let getError = 0

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = scheduleId;

            udp1 = new UDP((Commands.REQ_SCHEDULE | Commands.MOD_CONFIG), Commands.FLAG_DELETE, params1);
            udp1.sendUdpPacket("", "", true).then(
                data => {

                   if(data.length > 0 && data != false){
                        getResponse = 1
                        getError = 0

                        params = new Array();
                        params[0] = 0;
                        params[1] = i18n.t('schedule:schedule') + " " + scheduleId;
                        // Delete selected Schedule. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "Schedule", "status,title", "id="+scheduleId, params, "", "", 0, 0).then(
                           data => {
                              resolve(true);
                           }
                        )
                        .catch(
                           error => {
                                console.log("error delete Schedule in db");
                           }
                        );
                   }
                   else{
                     console.log("Error in delete Schedule")
                     getResponse = 0
                     getError = 0
                   }
                }
            ).catch(error => {getError = 1; getResponse = 0});

            setTimeout(() => {
                if(getResponse == 0 && getError == 0){
                  if(retry > 0){
                    this.deleteSchedule(scheduleId, retry-1)
                  }
                  else {
                    reject(i18n.t("schedule:errorDeleteSchedule"))
                  }
                }
            }, 800);

        })
    }


}
