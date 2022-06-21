import ZagrosDB from '../../Common/lib/DB';
import Output from '../../Output/lib/Output';
import Curtain from '../../Curtain/lib/Curtain';
import Vars from '../../Common/vars/commonVars';
import i18n from 'i18next';
import Thermometer from '../../Thermometer/lib/Thermometer';
import RGB from '../../RGB/lib/RGB';

export default class Location  {

    saveLocationInDB(location, outputs, curtains, thermometers, rgbs, mode){

        return new Promise((resolve, reject) => {
        params = new Array();
        params[0] = location.title;
        params[1] = location.icon;
        params[2] = location.showHome;
//console.log(location.title +"----" +mode)
        // Get inserted id by last param (1)
        if(mode == "add"){
            ZagrosDB.buildQuery(Vars.queryInsert, "Location", "title,icon,show_home", "", params, "", "", 0, 1).then(
                data => {
//                console.log("insertttttttttttttttttttttt"+data)
                    output = new Output();
                    output.updateOutputLocation(data, outputs);

                    curtain = new Curtain();
                    curtain.updateCurtainLocation(data, curtains);

                    thermometer = new Thermometer();
                    thermometer.updateThermometerLocation(data, thermometers);

                    rgb = new RGB();
                    rgb.updateRGBLocation(data, rgbs);

                    resolve(true)
                }
            )
            .catch(
                error => {
                    alert(i18n.t("location:errorSaveLocationInDB"));
//                    console.log("eeeeeeeeeee: " +error)
                }
            );
        }
        else{
            locationId = location.id;
            ZagrosDB.buildQuery(Vars.queryUpdate, "Location", "title,icon,show_home", "id="+locationId, params, "", "", 0, 0).then(
                data => {
                    output = new Output();
                    output.updateOutputLocation(locationId, outputs, Vars.modeUpdate);

                    curtain = new Curtain();
                    curtain.updateCurtainLocation(locationId, curtains, Vars.modeUpdate);

                    thermometer = new Thermometer();
                    thermometer.updateThermometerLocation(locationId, thermometers, Vars.modeUpdate);

                    rgb = new RGB();
                    rgb.updateRGBLocation(locationId, rgbs, Vars.modeUpdate);

                    resolve(true)
                }
            )
            .catch(
                error => {
                    alert(i18n.t("location:errorUpdateLocationInDB"));
//                    console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrr "+error)
                    resolve(error)
                }
            );
        }
        })
    }

    // Make output table in DB
    makeTable(){
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Location] ("
                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                               + "[icon] INTEGER NOT NULL,"
                               + "[title] TEXT NOT NULL,"
                               + "[temp_id] INTEGER DEFAULT NULL,"
                               + "[show_home] BOOLEAN DEFAULT FALSE,"
                               + "[camera_id] INTEGER DEFAULT NULL)";

            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert(i18n.t("location:errorMakeLocationTable"));
        }
    }

    // Delete a location and update ouputs and curtains of this location
    deleteLocation(locationId){
        return new Promise((resolve, reject) => {
            // Delete selected location
            ZagrosDB.buildQuery(Vars.queryDelete, "Location", "", "id="+locationId, "", "", "", 0, 0).then(
               data => {
                    // Set 0 to location id of outputs of selected location
                    output = new Output();
                    output.updateOutputLocation(locationId, "", Vars.modeDelete);

                    // Set 0 to location id of curtains of selected location
                    curtain = new Curtain();
                    curtain.updateCurtainLocation(locationId, "", Vars.modeDelete);

                    // Set 0 to location id of curtains of selected location
                    thermometer = new Thermometer();
                    thermometer.updateThermometerLocation(locationId, "", Vars.modeDelete);

                    resolve(true);
               }
            )
            .catch(
               error => {
                    reject(i18n.t("location:errorDeleteLocation"));
               }
            );
        })
    }
}