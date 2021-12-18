import React, {Component} from 'react';
import { translate} from 'react-i18next';
import ZagrosDB from '../../Common/lib/DB';

 export default class Camera  {

    constructor(name) {
       this.name = name;
       this.value = 0;
    }
//        this.outputName = props.outputName;
//        this.getDB = this.getDB.bind(this);
//this.name = name;
//        this.state = {
//            outputName : "111",
//            outputIcon : 0,
//
//        }

        setName(name){
//            alert(this.name);
            this.name = name;
//            return this.name;
        }

        getName(){
            return this.name;
        }


//     render() {
//            const { outputName,outputIcon } = this.props;
//            const {  } = navigation;
//    }

//    static getDB(){
//       try{
//            alert("aaa");
//       }
//       catch(error){
//           alert("ii"+error);
//       }
//    }

     getName(){
        return this.name;
    }

    // Make output table in DB
    makeTable(){
//           alert("make table");
//        try{
//            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [Camera] ("
//                               + "[" + CameraEntity.N_ID + "] INTEGER NOT NULL PRIMARY KEY,"
//                               + "[" + CameraEntity.N_USERNAME + "] TEXT NULL,"
//                               + "[" + CameraEntity.N_PASSWORD + "] TEXT NULL,"
//                               + "[" + CameraEntity.N_TITLE + "] TEXT NOT NULL,"
//                               + "[" + CameraEntity.N_IP + "] TEXT NOT NULL,"
//                               + "[" + CameraEntity.N_COMMAND + "] TEXT NOT NULL,"
//                               + "[" + CameraEntity.N_PORT + "] INTEGER NOT NULL,"
//                               + "[" + CameraEntity.N_LOCATION_ID + "] INTEGER NOT NULL,"
//                               + "[" + CameraEntity.N_PROTOCOL + "] INTEGER NOT NULL);";
//
//            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert("Error: " + error);
//            return 0;
        }
    }
}

