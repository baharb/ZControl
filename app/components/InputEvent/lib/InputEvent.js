import i18n from 'i18next';
import ZagrosDB from '../../Common/lib/DB';
import UDP from '../../Common/lib/UDP';
import Vars from '../../Common/vars/commonVars';
import Commands from '../../Common/vars/commands';
import CommonFunctions from '../../Common/lib/CommonFunctions';
import CommonFuncs from '../../Common/lib/CommonFuncs';
import Output from '../../Output/lib/Output';
import Scenario from '../../Scenario/lib/Scenario';
import Schedule from '../../Schedule/lib/Schedule';

export default class InputEvent {

    INPUT_EVENT_MAX_NUMBER = 70;

    // Make output table in DB
    makeTable() {
        try {
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [InputEvent] ("
                + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                + "[status] INTEGER DEFAULT 0,"
                + "[title] TEXT NOT NULL);";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch (error) {
            alert(i18n.t("inputEvent:errorCreateTable"));
        }
    }

    /// Make a sql to insert all IEs into DB
    createAllInputEvents() {
        return new Promise((resolve, reject) => {
            try {
                params = new Array();
                sqlMakeTable = "INSERT INTO InputEvent(title) VALUES ";

                for (i = 1; i <= this.INPUT_EVENT_MAX_NUMBER; i++) {
                    if (i != 1) {
                        sqlMakeTable += ",(?)";
                    }
                    else {
                        sqlMakeTable += "(?)";
                    }
                    params[i - 1] = i18n.t('inputEvent:inputEvent') + " " + i;
                }

                ZagrosDB.executeSQL(sqlMakeTable, params, 0)
                    .then(
                        data => {
                            ZagrosDB.buildQuery(Vars.querySelect, "InputEvent", "COUNT(*) AS count", "", "", "", "", 1).then(
                                data2 => {
                                    resolve(data2);
                                }
                            )
                                .catch(
                                    error => {
                                        // console.log(error + t("output:errorGetOutputDataFromDB") );
                                        reject(t("inputEvent:errorGetAllInputEvents"))
                                    }
                                );

                        }
                    )
                    .catch(
                        error => {
                            alert(t("inputEvent:errorGetAllInputEvents"));
                            reject(t("inputEvent:errorGetAllInputEvents"))
                        }
                    );

            }
            catch (error) {
//                console.log("errrrorrrrrrrrrrrrrrrrrrrrrrrrrr: " + error + "---" + " Error IE")
                alert(t("inputEvent:errorSaveInputEvent"));
            }
        });
    }


    saveInputEvent(inputEventIns, mode, checkedInput, checkedOutputs, outputs, retry) {

        return new Promise((resolve, reject) => {
            //        if(!retry && retry != 0){retry = 3}
            let getResponse = 0
            let getError = 0

            // ZagrosDB.executeSQL("DROP TABLE IF EXISTS [iputEvent]");
            // this.makeTable();
            packetData = this.getInputEventBytes(inputEventIns, mode, checkedInput, checkedOutputs, outputs);
//            console.log("packet data: " + packetData.length + "--" + packetData)
            if (packetData == false) {
//                console.log("Error in save input event " + packetData)
                reject(i18n.t("inputEvent:errorSaveInputEvent"))
            }
            else {

                params1 = new Array();

                command = "";
                if (mode == Vars.modeInsert) {
                    command = Commands.FLAG_CREATE;
                }
                else {
                    command = Commands.FLAG_EDIT;
                }

                //            console.log("pack:" + packetData);
                udp1 = new UDP((Commands.REQ_INPUT_EVENT | Commands.MOD_CONFIG), command, packetData);
                udp1.sendUdpPacket("", "", true, 1200).then(
                    inputEventDataUdp => {
//                                         console.log("save input event get data: " + inputEventDataUdp[0] +"-" +inputEventDataUdp[1] +"-" +
//                                         inputEventDataUdp[2] +"-" +inputEventDataUdp[3] +"-" +inputEventDataUdp[4] +"-" +
//                                         inputEventDataUdp[5] +"-" +inputEventDataUdp[6] +"-" +inputEventDataUdp[7] + "----" +
//                                         inputEventDataUdp + "----"+(inputEventDataUdp != false))

                        if (inputEventDataUdp.length > 0 && inputEventDataUdp[4] == 1) {

                            getResponse = 1
                            getError = 0

                            if (inputEventDataUdp[4] == 1) {
                                id = 0;

                                if (mode == Vars.modeInsert) {
                                    id = inputEventDataUdp[5];
                                }
                                else {
                                    id = inputEventIns.id;
                                }
                                //                             console.log("id:"+id);
                                this.saveInputEventInDB(id, inputEventIns);
                                resolve(true);
                            }
                            else {
                                getResponse = 1
                                getError = 1
                                reject(false)
                                //                                console.log("Error in Save inputEvent 1")

                            }
                        }
                        else {
                            getResponse = 1
                            getError = 1
                            reject(false)
//                            console.log("Error in Save inputEvent 2")
                        }
                    })
                    .catch(error => {
                        getResponse = 1; getError = 1
                        reject(false)
//                        console.log("Errorrrr in save inputevent: " + error)
                    });

                //            setTimeout(() => {
                //                // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                //                if(getResponse == 0 && getError == 0){
                //                    // console.log("timeeeeout-" +outputId)
                //                    if(retry > 0){
                //                        console.log("In retry " + retry)
                //                        this.saveInputEvent(inputEventIns, mode, checkedInput, checkedOutputs, outputs, retry-1)
                //                    }
                //                    else {
                //                        console.log("reject")
                //                        reject(i18n.t("inputEvent:errorSaveInputEvent"))
                //                    }
                //                }
                //            }, 2500);

            }
        });


    }

    saveInputEventInDB(id, inputEventIns) {

        // Edit  & Add , both updates the InputEvent table in DB
        params = new Array();
        params[0] = inputEventIns.title;
        params[1] = 1

        ZagrosDB.buildQuery(Vars.queryUpdate, "InputEvent", "title, status", "id=" + id, params, "", "", 0, 0).then(
            data => {

            }
        )
        .catch(
            error => {
//                console.log("Error in save input event in DB: " + error)
                alert(i18n.t("inputEvent:errorSaveInputEvent"));
            }
        );

    }

    getInputEventBytes(inputEventIns, mode, checkedInput, checkedOutputs, outputs) {
        try {
            output = new Output()

            checkedOutputLen = 0;

            // Output type = 1, Scenario type = 0
            if (inputEventIns.inputEventType == 1) { // Output type
                for (k = 0; k < checkedOutputs.length; k++) {
                    if (checkedOutputs[k] == true) {
                        checkedOutputLen++;
                    }
                }
            }

            if(inputEventIns.travel == 1){
                checkedOutputLen++;
            }

            inputEventBytes = new Array(7 + (checkedOutputLen * 3));

            inputEventBytes[0] = inputEventIns.id;
            inputEventBytes[1] = inputEventIns.inputEventType;
            inputEventBytes[2] = checkedInput.type_id;
            inputEventBytes[3] = checkedInput.val;
            inputEventBytes[4] = checkedInput.operand;
            inputEventBytes[5] = checkedInput.type;
            inputEventBytes[6] = checkedOutputLen;

            j = 7;
            allOutputsLen = outputs.length;

            // Output Type
            if (inputEventIns.inputEventType == 1) {
                for (i = 0; i < allOutputsLen; i++) {
                    if (checkedOutputs[i] == true) {
                        id = 0

                        if ((outputs[i].type == output.OUTPUT_DIGITAL_TYPE) || (outputs[i].type == output.OUTPUT_ANALOG_TYPE)) {
                            id = outputs[i].id
                        }
                        else {
                            id = outputs[i].type_id
                        }

                        inputEventBytes[j] = id;
                        inputEventBytes[++j] = outputs[i].value;
                        inputEventBytes[++j] = (outputs[i].operand << 4) | outputs[i].type;

                        // todo: operand , type
                        ++j;
                    }
                }
            }

            // Add travel like an output
            if(inputEventIns.travel == 1){
                inputEventBytes[j] = 1;
                inputEventBytes[++j] = 3;
                inputEventBytes[++j] = 44; // ((2 << 4) | 12)
            }
//            inputEventBytes[j] = inputEventIns.travel

//            console.log("Save input event : " + inputEventBytes[0] + "-" + inputEventBytes[1] + "-" +
//                inputEventBytes[2] + "-" + inputEventBytes[3] + "-" + inputEventBytes[4] + "-" + inputEventBytes[5] + "-" +
//                inputEventBytes[6] + "-" + inputEventBytes[7] + "-" + inputEventBytes[8] + "-" + inputEventBytes[9] + "-" +
//                inputEventBytes[10] + "-" + inputEventBytes[11] + "-" + inputEventBytes[12] + "-" + inputEventBytes[13] + "-" +
//                inputEventBytes[14] + "-" + inputEventBytes[15] + "-" + inputEventBytes[16] + "-" + inputEventBytes[17])

            return inputEventBytes;

        }
        catch (error) {
//            console.log("Error in save input event: " + error)
            return false;
        }
    }

    updateInputEventsFromController() {
        inputEventsString = ""
        scenario = new Scenario()
        schedule = new Schedule()

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = 0;

            ZagrosDB.buildQuery(Vars.queryUpdate, "InputEvent", "status", "", params1, "", "", 0, 0).then(
                data => {
                    CommonFuncs.syncDB().then(dataFromController => {
                        from = scenario.SCENARIO_MAX_NUMBER + schedule.SCHEDULE_MAX_NAMBER
                        to = from + this.INPUT_EVENT_MAX_NUMBER
                        j = 1

                        for (i = from; i < to; i++) {
                            if (dataFromController[i] == 1) {
                                inputEventsString += (inputEventsString.length == 0) ? j : ("," + j)
                            }
                            j++
                            //		                     console.log("update inputEvents : " + i + "--" + inputEventsString)
                        }

                        params = new Array();
                        params[0] = 1;

                        ZagrosDB.buildQuery(Vars.queryUpdate, "InputEvent", "status", "id IN(" + inputEventsString + ")", params, "", "", 0, 0).then(
                            data => {
//                                console.log("Data input events done ...")
                            }
                        )
                            .catch(
                                error => {
//                                    console.log("Error in save input event in DB: " + error)
                                    alert(i18n.t("inputEvent:errorSaveInputEvent"));
                                }
                            );

                        resolve(inputEventsString)
                    })
                        .catch(error => {
//                            console.log("Error sync DB from controller : " + error)
                            reject(error)
                        })
                }
            )
                .catch(
                    error => {
//                        console.log("Error in save input event in DB: " + error)
                        alert(i18n.t("inputEvent:errorSaveInputEvent"));
                    }
                );


        })
    }

    // Delete a InputEvent
    deleteInputEvent(inputEventId, retry) {
        if (!retry && retry != 0) { retry = 5 }
        getResponse = 0
        getError = 0

        return new Promise((resolve, reject) => {

            params1 = new Array();
            params1[0] = inputEventId;

            udp1 = new UDP((Commands.REQ_INPUT_EVENT | Commands.MOD_CONFIG), Commands.FLAG_DELETE, params1);
            udp1.sendUdpPacket("", "", true).then(
                data => {
//                    console.log("Reply for delete: " + data.length + "-" + inputEventId + "--" + data[0])
                    getResponse = 1
                    getError = 0

                    if (data.length > 0 && data[4] == 1) {
                        params = new Array();
                        params[0] = 0;

                        // Delete selected inputEvent. set status to 0
                        ZagrosDB.buildQuery(Vars.queryUpdate, "InputEvent", "status", "id=" + inputEventId, params, "", "", 0, 0).then(
                            data1 => {
//                                console.log("Delete ok : " + data1)
                                resolve(true);
                            }
                        )
                            .catch(
                                error => {
//                                    console.log("error delte 1: " + error)
                                    reject("error delete inputEvent in db");
                                }
                            );
                    }
                    else {
//                        console.log("Error in delete input event " + data.length)
                        getResponse = 0; getError = 0
                    }
                }
            ).catch(error => {
//                console.log("Error in delete " + error)
                getResponse = 0; getError = 1
            });

            setTimeout(() => {
                // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
                if (getResponse == 0 && getError == 0) {
                    // console.log("timeeeeout-" +outputId)
                    if (retry > 0) {
                        this.deleteInputEvent(inputEventId, retry - 1)
                    }
                    else {
//                        console.log("Error in retry")
                        reject(i18n.t("inputEvent:errorDeleteInputEvent"))
                    }
                }
            }, 1000);

        })
    }

    // Get a Input Event from Controller
    getInputEvent(inputEventId) {

        return new Promise((resolve, reject) => {
            params1 = new Array();
            params1[0] = inputEventId;

            udpGet = new UDP(Commands.REQ_INPUT_EVENT, Commands.FLAG_GET, params1);
            udpGet.sendUdpPacket("", "", true, 1000).then(
                inputEventDataUdp => {

//                    console.log("get input event : " + (inputEventDataUdp != false) + "----" + inputEventDataUdp[0] + "-" + inputEventDataUdp[1] + "-" + inputEventDataUdp[2] +
//                        "-" + inputEventDataUdp[3] + "-" + inputEventDataUdp[4]
//                        + "-" + inputEventDataUdp[5] + "-" + inputEventDataUdp[6] + "-" + inputEventDataUdp[7]
//                        + "-" + inputEventDataUdp[8] + "-" + inputEventDataUdp[9] + "-" + inputEventDataUdp[10]
//                        + "-" + inputEventDataUdp[11] + "-" + inputEventDataUdp[12] + "-" + inputEventDataUdp[13]
//                        + "-" + inputEventDataUdp[14] + "-" + inputEventDataUdp[15] + "-" + inputEventDataUdp[16])

                    if (inputEventDataUdp.length > 0 && inputEventDataUdp != false) {
                        dataInputEvent = new Array();

                        CommonFunctions.arrayCopy(inputEventDataUdp, 4, dataInputEvent, 0, inputEventDataUdp.length - 4);
                        //                         alert("data doo: "+ dataScenario[0]+"-"+dataScenario[1]+"-"+dataScenario[2]+
                        //                                                "-"+dataScenario[3]+"-"+dataScenario[4]
                        //                                                +"-"+dataScenario[5]+"-"+dataScenario[6]+"-"+dataScenario[7])
                        resolve(dataInputEvent)
                    }
                    else {
//                        console.log("error get input eenteee")
                        //                        getError = 1
                        //                        if(retry > 0){
                        //                              this.getInputEvent(inputEventId, retry-1)
                        //                            }
                        //                            else {
                        //                               if(timeout != ""){ clearTimeout(timeout)}
                        reject("Error in get input Event 1")
                        //                            }

                    }
                }
            ).catch(error => {
//                console.log("Error in get input event : " + error)
                //                getError = 1;
                //                 if(retry > 0){
                //                          this.getInputEvent(inputEventId, retry-1)
                //                        }
                //                        else {
                //                        if(timeout != ""){ clearTimeout(timeout)}
                reject(error)
                //                        }

            });

        });
    }



}
