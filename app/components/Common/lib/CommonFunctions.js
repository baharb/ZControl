import React from 'react';
import { translate} from 'react-i18next';

export class CommonFunctions extends React.Component {

    constructor(props){
        super(props);
        // this.syncDBbyParams = this.syncDBbyParams.bind(this);
//        alert("nav : "+this.nav)
      }


      static toByteArray(obj) {
    //        var uint = new Uint8Array(obj.length);
            var uint = new Array(obj.length);
            for (var i = 0, l = obj.length; i < l; i++){
              uint[i] = obj.charCodeAt(i) ; //.charCodeAt(i);
            }

    //        alert("uint" + uint[0] + "-" + uint[1] + "-" + uint[2] + "-" + uint[3] + uint[4] + "-" + uint[5])
    //        return new Uint8Array(uint);
            return uint;
       }

    // Copy from src array to dest array, from srcPos to copyLength
    static arrayCopy(src, srcPos, dest, destPos, copyLength){
        try{
             for (i = srcPos; i < srcPos + copyLength; i++) {
               dest[destPos] = src[i];
               destPos++;
    //           alert("dest: "+i+"---"+dest)
             }

             return dest;
         }
         catch(error){
            console.log("error in arraycopy: " + error)
         }
    }

     // Is empty: false
    // Is not empty: true
    static checkFieldEmpty(fieldValue){
        if(fieldValue.trim().length == 0){
          return false;
        }
        else{
          return true;
        }
   }

   

}

export default translate(['CommonFunctions', 'common'], { wait: true })(CommonFunctions);
