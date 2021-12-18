import React, {Component} from 'react';
import { translate} from 'react-i18next';
import ZagrosDB from '../../Common/lib/DB';

 export default class DashboardItem  {

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
        try{
            sqlMakeTable = "CREATE TABLE IF NOT EXISTS [DashboardItem] ("
                                               + "[id] INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"
                                               + "[order] INTEGER NOT NULL,"
                                               + "[widget] INTEGER NOT NULL,"
                                               + "[location_id] INTEGER NULL,"
                                               + "[function_id] INTEGER NULL )";
            ZagrosDB.executeSQL(sqlMakeTable);

        }
        catch(error){
            alert("Error: " + error);
//            return 0;
        }
    }
}

