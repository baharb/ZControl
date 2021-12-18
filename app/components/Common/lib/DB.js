import React, {Component} from 'react';
import { translate} from 'react-i18next';
import Vars from '../vars/commonVars';
//import './global.js';
// Get Sqlite instance
import {AsyncStorage} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
SQLite.DEBUG(false);
//SQLite.deb
export class ZagrosDB extends React.Component {

      constructor(props){
          super(props);
          this.state = {
              res: "",
          }
      }

      res = "";
    static getDB(){
       try{
            SQLite.openDatabase({name: 'zagrosDB', createFromLocation: '~zagrosDB.db'}).then(
            (DB) => {
               db = DB;
               return db;
          });
       }
       catch(error){
//           alert("error 1: " +error);
       }
    }

    // type: type of Query: insert, delete, update, select
    // getInsertedId: If Query must return an id of inserted row, this set to 1. just for inser type.
    // ret: If Query must return data, this parameter set to 1. for select type.
    static buildQuery(type, tables, columns, where, params, groupBy, orderBy, ret, getInsertedId){

        return new Promise((resolve, reject) => {
        query = "";

        if(type == Vars.querySelect){
            query = "SELECT ";

            if (columns != null && columns.length != 0) {
                query = query + columns;
            }
            else {
                query += "* ";
            }

            query += " FROM ";
            query += tables;
        }

        if(type == Vars.queryDelete){
            query = "DELETE FROM " + tables;
        }

        if(type == Vars.queryUpdate){
            query = "UPDATE " + tables + " SET " ;

            columnsArray = columns.split(',');

            for(i = 0; i < columnsArray.length; i++){
                if(i != columnsArray.length - 1){
                    query += columnsArray[i] + "=?, ";
                }
                else{
                    query += columnsArray[i] + "=? "
                }
            }
        }

        if(type == Vars.queryInsert){
            query = "INSERT INTO " + tables + " (" + columns + ") VALUES (";

            columnsArray = columns.split(',');

            for(i = 0; i < columnsArray.length; i++){
                if(i != columnsArray.length - 1){
                    query += "?, "
                }
                else{
                    query += "?)"
                }
            }
        }

        if(where){
            query += " WHERE " + where;
        }

        if(groupBy){
            query += " GROUP BY " + groupBy;
        }

        if(orderBy){
            query += " ORDER BY " + orderBy;
        }

        sql = query;
//        alert(query + params)
        this.executeSQL(query, params, ret, getInsertedId).then(data =>{
            resolve(data)
            }
        );
    })

    }

    // ret: return value, If query must return a value. for example select.
    // getInsertedId: for insert queries if need an id of inserted row
    static executeSQL(sql, params, ret, getInsertedId){
      return new Promise((resolve, reject) => {

        try{

            SQLite.openDatabase({name: 'zagrosDB', createFromLocation: '~db/zagrosDB.db'}).then((DB) => {
                db = DB;
//                console.log("data baseee: " + db +"---"+db.length)
                var len = 0;

                if(params){
//                console.log("params db: " + sql+"---"+params[0]+"-"+params[1]+"-"+params[2]+"-"+params[3])
//                   alert(sql+"---"+params[0]+"-"+params[1]+"-"+params[2]+"-"+params[3])
                   db.transaction( (tx) => {
                     tx.executeSql(sql, params).then(([tx,results]) => {
//                     alert(results.rows.item(0))

                     if(getInsertedId && (getInsertedId == 1)){
                        if(results.insertId > 0){
                            resolve(results.insertId);
                        }
                        else{
                            resolve(false);
                        }
                     }

                     if(ret && (ret == 1)){

                         var len = results.rows.length;

                         if(len > 0){
                             resultArray = new Array();

                             for (let i = 0; i < len; i++) {
        //                     alert(results.rows.item(i))
                                resultArray[i] = results.rows.item(i);
                             }


                             resolve(resultArray)
                         }
                         else{
                            resolve(false)
                         }
                     }
                     else{
                        resolve(false);
                     }
                     }).catch((error) => {
//                        alert("error 2: "+error);
                        resolve(error)
                     });

                   }).catch(error => {
                        console.log("error 3: " +sql);
                        resolve(false)
                   })
                }
                else{

//                console.log("params db: " + sql+"---")
                    db.transaction( (tx) => {
//                    alert(sql)
                        tx.executeSql(sql, []).then(([tx,results]) => {
                         if(getInsertedId && (getInsertedId == 1)){
                            if(results.insertId > 0){
                                resolve(results.insertId);
                            }
                            else{
                                resolve(false);
                            }
                         }

                         if(ret && (ret == 1)){

                             var len = results.rows.length;

                             if(len > 0){
                                 resultArray = new Array();

                                 for (let i = 0; i < len; i++) {
            //                     alert(results.rows.item(i))
                                    resultArray[i] = results.rows.item(i);
                                 }


                                 resolve(resultArray)
                             }
                             else{
                                resolve(false)
                             }
                         }
                         else{
                            resolve(false);
                         }

                        }).catch((error) => {
//                            alert("error 4: "+error);
                            resolve(error)
                        });
                    }).catch(error => {
//                        alert("error 5: "+sql + "---"+error);
                        resolve(error)
                    })


                }
            }).catch(error => {
//                console.log("error db: " +error)
//                alert("error 6: "+error);
                resolve(error)
            })

        }
        catch(error){
//            alert("error in db: "+error);
            resolve(error)
        }
    })
    }
}

export default translate(['ZagrosDB', 'common'], { wait: true })(ZagrosDB);
