import React from 'react';
import { translate} from 'react-i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput} from 'react-native';
import {Picker} from '@react-native-community/picker';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import Commands from '../Common/vars/commands';
import ZagrosDB from '../Common/lib/DB';
import {MyButton} from '../Common/MyButton';
import {MyAlert} from '../Common/MyAlert';
import Vars from '../Common/vars/commonVars';
import UDP from '../Common/lib/UDP';
import CommonFunctions from '../Common/lib/CommonFunctions';
import Thermometer from './lib/Thermometer';
import i18n from 'i18next';
import RadioForm from 'react-native-simple-radio-button';

export class ThermometerSetting extends React.Component {
//    output1: Output;
    constructor(props){
        super(props);
        this.state ={
		outputs : "",
		successName: true,
		successReferenceTemp: true,
		thermometerTitle: "",
		selectedOutput: 0,
		selectedThermometerType: 0,
		alertMod: false,
		titleModal: "",
		fromPage: "",
		outputsArray: "",
		outputsNum : 0,
		outputLabel1: "",
		outputLabel2:"",
		outputLabel3:"",
		outputLabel4: i18n.t("relay:relay"),
		selectedOutput1: 0,
		selectedOutput2: 0,
		selectedOutput3: 0,
		selectedOutput4: 0,
		selectedOutput5: 0,
		selectedOutput6: 0,
		selectedOutput7: 0,
		selectedOutput8: 0,
		selectedOutput9: 0,
		selectedOutput10: 0,
		selectedOutput11: 0,
		selectedOutput12: 0,
		visible1: false,
		visible2: false,
		visible3: false,
		visible4: false,
		visible5: false,
		visible6: false,
		visible7: false,
		visible8: false,
		visible9: false,
		visible10: false,
		visible11: false,
		visible12: false,
		thermometerModeType: 0,
        }

        this.saveThermometer = this.saveThermometer.bind(this);
        this.getThermometer = this.getThermometer.bind(this)
    }




  // Get all outputs from DB
  getAllOutputs(){
      // o = new Output();
      ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
          data => {
              this.setState({
                  outputs: data
              })
          }
      )
      .catch(
          error => {
//            console.log("error in get outputs: " + error)
              alert(this.props.t("output:errorGetOutputDataFromDB"));
          }
       )
  }

    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

         fromPage = navigation.getParam('fromPage', "ThermometerPage");

        thermometer = new Thermometer();
        this.getAllOutputs()

        if(item != null){
		this.setState({
                              thermometerId: item.id,
                              thermometerTitle: item.title,
                              fromPage: fromPage,
                              thermometerTypeId: item.type_id,
                              thermometerType: item.type,
			 mode: Vars.modeUpdate,
                    })
                    e = this.getThermometer(item)
        }
        else{
		    this.setState({
			thermometerId: 0,
			thermometerTitle: "",
			thermometerReferenceTemp: "0",
			successReferenceTemp: true,
			successName: true,
			thermometerModeType: 0,
			thermometerStatus: 0,
			mode: Vars.modeInsert,
			fromPage: fromPage
		    })

		    setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }

    }

     getThermometer(item, retry){

              if(item == null || item == ""){ item = this.props.navigation.getParam('item', null);}
              getResponse = 0
              getError = 0
              if(!retry && retry != 0){retry = 3}
              timeout = ""

               params = new Array()
               params[0] = item.type_id
               params[1] = item.type

//		console.log("Thermmmm: " + params[0] + "--" + params[1])
               selectedOutput1 = 0
               selectedOutput2 = 0
               selectedOutput3 = 0
               selectedOutput4 = 0
               selectedOutput5 = 0
               selectedOutput6 = 0
               selectedOutput7 = 0
               selectedOutput8 = 0
               selectedOutput9 = 0
               selectedOutput10 = 0
               selectedOutput11 = 0

        udpGetTh = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_THERMOS_GET, params);
        udpGetTh.sendUdpPacket("", "", true).then(
            thermUdpd => {
            thermUdp = new Array()
	        CommonFunctions.arrayCopy(thermUdpd, 4, thermUdp, 0, thermUdpd.length - 4);

//            console.log("GEt thermmm:    "+thermUdp[0]+"--"+thermUdp[1]+"--"+thermUdp[2]+"--"+thermUdp[3]+"--"+thermUdp[4]+"--"+
//            thermUdp[5]+"--"+thermUdp[6]+"--"+thermUdp[7]+"--"+thermUdp[8]+"--"+thermUdp[9]+"--"+
//            thermUdp[10]+"--"+thermUdp[11]+"--"+thermUdp[12]+"--"+thermUdp[13]+"--"+thermUdp[14]+"--")

            getResponse = 1
		    if(timeout!= ""){ clearTimeout(timeout)}
              outputsArray = new Array()
              outputsList = thermUdp[9] * 4
              j = 6
              i = 0

		    selectedDevice = thermUdp[4]

                	if(selectedDevice == 1){   // Cooler
			selectedOutput1 = thermUdp[j]   // Water pomp
			j = j + 4
			selectedOutput2 = thermUdp[j]  // Fan
			j = j + 4
			selectedOutput3 = thermUdp[j]  // Fan 2
                	  }
                	  else if(selectedDevice == 2){   // Air conditioner 2 Speed
//                		if(thermUdp[j+3] == 1){ // On/Off
//                		          selectedOutput1 = thermUdp[j]   // Water pomp
//                                        j = j + 4
//                		}

                		if(thermUdp[j+3] == 3){ // Fan 1
                		          selectedOutput2 = thermUdp[j]
                                        j = j + 4
                              }

                		if(thermUdp[j+3] == 4){ // Fan 2
                		          selectedOutput3 = thermUdp[j]
                                        j = j + 4
                              }
                	  }
		  else if(selectedDevice == 3){ // Air conditioner 3 Speed
//                		if(thermUdp[j+3] == 1){ // On/Off
//                                        selectedOutput1 = thermUdp[j]   // Water pomp
//                                        j = j + 4
//                              }

                              if(thermUdp[j+3] == 3){ // Fan 1
                                        selectedOutput2 = thermUdp[j]
                                        j = j + 4
                              }

                              if(thermUdp[j+3] == 4){ // Fan 2
                                        selectedOutput3 = thermUdp[j]
                                        j = j + 4
                              }

                              if(thermUdp[j+3] == 5){ // Fan 3
                                        selectedOutput4 = thermUdp[j]
                                        j = j + 4
                              }

                	  }
		  else if(selectedDevice == 4){ // Split
                		if(thermUdp[j+3] == 1){ // On/Off
                                        selectedOutput1 = thermUdp[j]
                                        j = j + 4
                              }
//                              console.log("output 1: " +selectedOutput1)

                	  }
		  else if(selectedDevice == 5){ // Radiator
                		if(thermUdp[j+3] == 1){ // On/Off
                                        selectedOutput1 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput2 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput3 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput4 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput5 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput6 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput7 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput8 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput9 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput10 = thermUdp[j]
                                        j = j + 4
                              }

                              if((thermUdp[j+3] != null) && (thermUdp[j+3]== 8)){ // On/Off
                                        selectedOutput11 = thermUdp[j]
                                        j = j + 4
                              }

                	  }

			this.changeSelectedThermometerDevice(thermUdp[4])

//			console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeee: " + thermUdp[3])
		          this.setState({
			          thermometerReferenceTemp: (thermUdp[2] > 49) ? ""+(thermUdp[2]-50) : "0",
			          thermometerModeType: thermUdp[3],
			          selectedThermometerType: thermUdp[4],
			          outputNum: thermUdp[5],
			          successReferenceTemp: true,
			          successName: true,
			          selectedOutput1: selectedOutput1,
			          selectedOutput2: selectedOutput2,
			          selectedOutput3: selectedOutput3,
			          selectedOutput4: selectedOutput4,
			          selectedOutput5: selectedOutput5,
			          selectedOutput6: selectedOutput6,
			          selectedOutput7: selectedOutput7,
			          selectedOutput8: selectedOutput8,
			          selectedOutput9: selectedOutput9,
			          selectedOutput10: selectedOutput10,
			          selectedOutput11: selectedOutput11,
			}, () => {
				if(thermUdp[3] != null){
					this.refs.refRadioModeType.updateIsActiveIndex(thermUdp[3]);
				}
//				console.log("okkkkkkkkkkk")
				return true
			})

		}
                ).catch(error => {
//                        console.log("Error in get Thermometer " + error +"---" +retry)
                        getError = 1;
//                         if(retry == 0){
//                                        if(timeout != ""){ clearTimeout(timeout)  }
//                                        console.log("retryyyy: " +retry)
//				this.setState({
//				         alertMod: true,
//				         titleModal: this.props.t("thermometer:errorGetThermometer"),
//				})
////                                          alert(this.props.t("thermometer:errorGetThermometer"));
//                              }
//                              else{
//                                         this.getThermometer(item, retry-1)
//                              }
                });

                timeout = setTimeout(() => {
//                   console.log("- aaaa - " + getResponse+"---"+getError)
                    if(((getResponse == 0) && (getError == 0)) || (getError == 1)){
                      // console.log("timeeeeout-" +outputId)
                      if(retry > 0){
                        this.getThermometer(item, retry-1)
                      }
                      else {
//                              console.log("retryyyy: " +retry)
                              this.setState({
			         alertMod: true,
			         titleModal: this.props.t("thermometer:errorGetThermometer"),
			})
//                        alert();
                      }
                    }
                }, 1500);
        }

    // Update thermometer in db
    saveThermometer(){
        if(this.state.thermometerTitle.trim().length == 0){
            this.setState({
                successName: false
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            thermometer = new Thermometer();

            thermometerIns = new Object();
            thermometerIns.type_id = this.state.thermometerTypeId
            thermometerIns.type = this.state.thermometerType
            thermometerIns.title = this.state.thermometerTitle;
            thermometerIns.reference_temp = parseInt(this.state.thermometerReferenceTemp) + thermometer.THERMOMETER_OFFSET
            thermometerIns.mode_type = this.state.thermometerModeType
            thermometerIns.selectedThermometerType = this.state.selectedThermometerType

            outputsNum = 0

    //	  console.log("In Save mod: " + thermometerIns.reference_temp +"---" +this.state.thermometerReferenceTemp +"---" +
    //	                    parseInt(this.state.thermometerReferenceTemp) +"---" +
    //	                    parseInt(this.state.thermometerReferenceTemp) + thermometer.THERMOMETER_OFFSET)

           if(this.state.mode == Vars.modeUpdate){
               thermometerIns.id = this.state.thermometerId;
               outputsArray = new Array(40)
               i = 0

              if(this.state.selectedThermometerType == 1){ // Cooler
                outputsNum = 3
                if(this.state.selectedOutput1 > 0){
                    outputsArray[0] = {id:this.state.selectedOutput1,
                                   type_id:this.state.outputs[this.state.selectedOutput1-1].type_id,
                                   type:this.state.outputs[this.state.selectedOutput1-1].type,
                                   sub_type: 2} // Water pomp
                }

                 if(this.state.selectedOutput2 > 0){
                    outputsArray[1] = {id:this.state.selectedOutput2,
                                   type_id:this.state.outputs[this.state.selectedOutput2-1].type_id,
                                   type:this.state.outputs[this.state.selectedOutput2-1].type,
                                   sub_type: 3} // Fan
                 }

                 if(this.state.selectedOutput3 > 0){
                        outputsArray[2] = {id:this.state.selectedOutput3,
                                           type_id:this.state.outputs[this.state.selectedOutput3-1].type_id,
                                           type:this.state.outputs[this.state.selectedOutput3-1].type,
                                           sub_type: 4} // Fan 2
                 }

              }
              else if(this.state.selectedThermometerType == 2){ // Air conditioner 2 Speed

                if(this.state.selectedOutput2 > 0){
                          outputsArray[i] = {id:this.state.selectedOutput2,
                                             type_id:this.state.outputs[this.state.selectedOutput2-1].type_id,
                                             type:this.state.outputs[this.state.selectedOutput2-1].type,
                                             sub_type: 3} // Fan1

                          i++
                          outputsNum++
                }

                if(this.state.selectedOutput3 > 0){
                          outputsArray[i] = {id:this.state.selectedOutput3,
                          type_id:this.state.outputs[this.state.selectedOutput3-1].type_id,
                          type:this.state.outputs[this.state.selectedOutput3-1].type,
                          sub_type: 4} // Fan 2

                          outputsNum++
                }
              }

              else if(this.state.selectedThermometerType == 3){ // Air conditioner 2 Speed
                   if(this.state.selectedOutput2 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput2,
                                         type_id:this.state.outputs[this.state.selectedOutput2-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput2-1].type,
                                         sub_type: 3} // Fan 1

                            i++
                      outputsNum++
                   }

                   if(this.state.selectedOutput3 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput3,
                                         type_id:this.state.outputs[this.state.selectedOutput3-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput3-1].type,
                                         sub_type: 4} // Fan 2

                      i++
                      outputsNum++
                   }

                   if(this.state.selectedOutput4 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput4,
                      type_id:this.state.outputs[this.state.selectedOutput4-1].type_id,
                      type:this.state.outputs[this.state.selectedOutput4-1].type,
                      sub_type: 5} // Fan 3

                      outputsNum++
                   }

              }
              else if(this.state.selectedThermometerType == 4){ // Split
                    if(this.state.selectedOutput1 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput1,
                                         type_id:this.state.outputs[this.state.selectedOutput1-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput1-1].type,
                                         sub_type: 1} // On/Off

                      i++
                      outputsNum++
                    }

              }
              else if(this.state.selectedThermometerType == 5){ // Radiator
                    if(this.state.selectedOutput1 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput1,
                                                 type_id:this.state.outputs[this.state.selectedOutput1-1].type_id,
                                                 type:this.state.outputs[this.state.selectedOutput1-1].type,
                                                 sub_type: 1} // On/Off
                              i++
                              outputsNum++
                    }

                    if(this.state.selectedOutput2 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput2,
                                         type_id:this.state.outputs[this.state.selectedOutput2-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput2-1].type,
                                         sub_type: 8} // Valve

                      i++
                      outputsNum++
                    }

                    if(this.state.selectedOutput3 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput3,
                                         type_id:this.state.outputs[this.state.selectedOutput3-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput3-1].type,
                                         sub_type: 8} // Valve

                      i++
                      outputsNum++
                    }

                    if(this.state.selectedOutput4 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput4,
                                         type_id:this.state.outputs[this.state.selectedOutput4-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput4-1].type,
                                         sub_type: 8} // Valve

                      i++
                      outputsNum++
                    }

                    if(this.state.selectedOutput5 > 0){
                      outputsArray[i] = {id:this.state.selectedOutput5,
                                         type_id:this.state.outputs[this.state.selectedOutput5-1].type_id,
                                         type:this.state.outputs[this.state.selectedOutput5-1].type,
                                         sub_type: 8} // Valve

                            i++
                      outputsNum++
                   }

                    if(this.state.selectedOutput6 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput6,
                                                                     type_id:this.state.outputs[this.state.selectedOutput6-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput6-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

                    if(this.state.selectedOutput7 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput7,
                                                                     type_id:this.state.outputs[this.state.selectedOutput7-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput7-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

                    if(this.state.selectedOutput8 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput8,
                                                                     type_id:this.state.outputs[this.state.selectedOutput8-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput8-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

                    if(this.state.selectedOutput9 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput9,
                                                                     type_id:this.state.outputs[this.state.selectedOutput9-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput9-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

                    if(this.state.selectedOutput10 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput10,
                                                                     type_id:this.state.outputs[this.state.selectedOutput10-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput10-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

                    if(this.state.selectedOutput11 > 0){
                              outputsArray[i] = {id:this.state.selectedOutput11,
                                                                     type_id:this.state.outputs[this.state.selectedOutput11-1].type_id,
                                                                     type:this.state.outputs[this.state.selectedOutput11-1].type, sub_type: 8} // Valve

                                    i++
                              outputsNum++
                          }

              }

              thermometerIns.outputsArray = outputsArray
              thermometerIns.outputsNum = outputsNum

              thermometer.saveThermometerInController(thermometerIns, this.state.mode).then(
               data => {
    //                              console.log("get data from felan")
                      // todo check answer
                thermometer.updateThermometerInDB(thermometerIns).then(
                    data1 => {
    //		                    console.log("get data from update")
                        if(data1 == true){
                            this.props.navigation.navigate(this.state.fromPage);
                        }
                    }
           )
           .catch(
                    error => {
                        console.log("error: " + error)
                        alert(this.props.t("thermometer:errorUpdateThermometer"))
                    }
           );
        })
              .catch(
                error =>{
//                                      console.log("Error in update theometer: " + error)
                    alert(this.props.t("thermometer:errorUpdateThermometer"))
                }
            )
            }

           if(this.state.mode == Vars.modeInsert){
                 thermometerIns.outputsNum = 0
                 thermometerIns.outputsArray = ""
                 thermometer.getNextId().then(
                    newId => {
                        thermometerIns.id = newId[0].id;

                        thermometer.saveThermometerInController(thermometerIns, this.state.mode).then(
                            data => {
                                thermometer.updateThermometerInDB(thermometerIns).then(
                                    data1 => {
                                        if(data1 == true){
                                            this.props.navigation.navigate('ThermometerPage');
                                        }
                                        else{
                                                alert(this.props.t("thermometer:errorSaveThermometer"))
                                        }
                                    }
                                )
                                .catch(
                                    error => {
                                        alert(this.props.t("thermometer:errorSaveThermometer"))
                                    }
                                );
                            }
                        )
                        .catch(
                            error => alert(this.props.t("thermometer:errorSaveThermometerInController"))
                        );
                    }
                )
            }
        }
    }

    // Close the Alert
    onClickCancel(){
              this.setState({alertMod:false})
    }

    changeSelectedThermometerDevice(value){
//    console.log("value seelcte: " + value)
	    try{
              if(value == 0){ // Select Thermometer Device
                            this.setState({
                                       selectedThermometerType:value,
                                       visible1: false,
                                       visible2: false,
                                       visible3: false,
                                       visible4: false,
                                       visible5: false,
                                       visible6: false,
                                       visible7: false,
                                       visible8: false,
                                       visible9: false,
                                       visible10: false,
                                       visible11: false,
                                       visible12: false,
                                       outputsNum: 0,
                            })
               }
               else if(value == 1){ // Cooler
                        this.setState({
                                   selectedThermometerType:value,
                                   visible1: true,
                                   visible2: true,
                                   visible3: true,
                                   visible4: false,
                                   visible5: false,
                                   visible6: false,
                                   visible7: false,
                                   visible8: false,
                                   visible9: false,
                                   visible10: false,
                                   visible11: false,
                                   visible12: false,
                                   outputLabel1: i18n.t("thermometer:waterPomp"),
                                   outputLabel2:  i18n.t("relay:relay") + " 1",
                                   outputLabel3: i18n.t("relay:relay") + " 2",
                        })
              }
              else if(value == 2){     // Air Conditioner 2 Speed

                        this.setState({
	                             selectedThermometerType:value,
	                             visible1: false,
	                             visible2: true,
	                             visible3: true,
	                             visible4: false,
	                             visible5: false,
	                             visible6: false,
	                             visible7: false,
	                             visible8: false,
	                             visible9: false,
	                             visible10: false,
	                             visible11: false,
	                             visible12: false,
	                             outputLabel2: i18n.t("relay:relay") + " 1" ,
	                             outputLabel3: i18n.t("relay:relay") + " 2",
	               }, () => {
//	                    console.log("state is done")
	               })
              }
              else if(value == 3){     // Air Conditioner 3 Speed
                        this.setState({
	                             selectedThermometerType:value,
	                             visible1: false,
	                             visible2: true,
	                             visible3: true,
	                             visible4: true,
	                             visible5: false,
	                             visible6: false,
	                             visible7: false,
	                             visible8: false,
	                             visible9: false,
	                             visible10: false,
	                             visible11: false,
	                             visible12: false,
	                             outputLabel2: i18n.t("relay:relay") + " 1" ,
	                             outputLabel3: i18n.t("relay:relay") + " 2",
	                             outputLabel4: i18n.t("relay:relay"),
	               })
              }
              else if(value == 4){     // Split
                        this.setState({
	                             selectedThermometerType:value,
	                             visible1: true,
	                             visible2: false,
	                             visible3: false,
	                             visible4: false,
	                             visible5: false,
	                             visible6: false,
	                             visible7: false,
	                             visible8: false,
	                             visible9: false,
	                             visible10: false,
	                             visible11: false,
	                             visible12: false,
	                             outputLabel1: i18n.t("thermometer:onOff"),
	               })
              }
              else if(value == 5){     // Radiator
                        this.setState({
	                             selectedThermometerType:value,
	                             visible1: true,
	                             visible2: true,
	                             visible3: true,
	                             visible4: true,
	                             visible5: true,
	                             visible6: true,
	                             visible7: true,
	                             visible8: true,
	                             visible9: true,
	                             visible10: true,
	                             visible11: true,
	                             visible12: true,
	                             outputLabel1: i18n.t("thermometer:onOff"),
	                             outputLabel2: i18n.t("thermometer:valve") + " 1" ,
	                             outputLabel3: i18n.t("thermometer:valve") + " 2",
	                             outputLabel4: i18n.t("thermometer:valve"),
	               })
              }
	}
	catch(error){
		console.log(error)
	}
    }

    render() {
        const { t} = this.props;
        thermometer = new Thermometer()
        var radioTherm = [
		{label: t('thermometer:summer'), value: thermometer.SUMMER_TYPE },
		{label: t('thermometer:winter'), value: thermometer.WINTER_TYPE },
        ];

         outputsPicker = new Array()

         outputsPicker.push(<Picker.Item label={t('output:selectOutput')} value={0}/>)
         if(this.state.outputs != ""){
                    this.state.outputs.filter(item=>item.flag == 1).map((item) =>{
//		            console.log("itemmmm: " +item.id)
		            outputsPicker.push(
		                <Picker.Item label={item.name} value={item.id} key={item.id}/>
                                );
                    })
          }

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>

            <View style={{flex:1, backgroundColor: '#350e45'}}>
                <View style={commonStyles.containerView}>

	                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
	                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

	                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
	                            ref="titleTextInput"
	                            onChangeText={(txt) => {
	                                if(txt.trim().length == 0){
	                                    this.setState({
	                                        thermometerTitle: txt,
	                                        successName: false
	                                    })
	                                }
	                                else{
	                                    this.setState({
	                                        thermometerTitle: txt,
	                                        successName: true
	                                    })
	                                }
	                            }}
	                            value={this.state.thermometerTitle}
	                        />
	                    </View>

	                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
	                        {!this.state.successName ? (
	                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
	                              {t('thermometer:thermometerFillName')}
	                            </Text>
	                        ) : (null)}
	                    </View>

			{ (this.state.mode == Vars.modeUpdate) ?
			(
			<View>
	                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
	                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('thermometer:referenceTemp')}</Text>
	                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
	                            keyboardType='numeric'
	                            onChangeText={(txt) => {
	                                if(txt.length == 0){
	                                    this.setState({
	                                        thermometerReferenceTemp: txt,
	                                        successReferenceTemp: false
	                                    })
	                                }
	                                else{

	                                    txt = txt.replace(/[- #*+=();,.<>\{\}\[\]\\\/]/gi, '');
	                                    txt = (txt > 50) ? "50" : txt;
	                                    this.setState({
	                                        thermometerReferenceTemp: txt,
	                                        successReferenceTemp: true
	                                    })
	                                }
	                            }}
	                            value={this.state.thermometerReferenceTemp}
	                        />
	                    </View>

	                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
	                        {!this.state.successReferenceTemp ? (
	                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
	                              {t('thermometer:thermometerFillReferenceTemp')}
	                            </Text>
	                        ) : (null)}
	                    </View>

	                    <View style={commonStyles.displayColumn}>
	                          <View style={commonStyles.line}></View>
	                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('thermometer:tempType')}</Text>
	                        <View style={commonStyles.listRadio(i18n.t('common:dir')) }>
			    <RadioForm
		                            radio_props={radioTherm}
		                            ref="refRadioModeType"
		                            labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
		                            initial={1}
		                            formHorizontal={true}
		                            onPress={(value, index) => {
		                                        this.setState({thermometerModeType: radioTherm[index].value}, () => {
//		                                                  console.log("Mode type: " + this.state.thermometerModeType + "--" +"---"+radioTherm[index].value)
		                                        })}
		                            }
	                        />
	                            </View>
	                    </View>

			            <View style={commonStyles.displayColumn}>
	                              <View style={commonStyles.line}></View>

                                        <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
	                                       <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t("thermometer:selectThermometerDevice")}</Text>
                                            <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>
	                                       <Picker
	                                          selectedValue={this.state.selectedThermometerType}
	                                          style={commonStyles.pickerTherm}
	                                          onValueChange={(itemValue, itemIndex) =>
	                                            {
//	                                                  console.log("item value: " +itemValue)
	                                                  this.changeSelectedThermometerDevice(itemValue)
	                                            }
	                                          }>
	                                          <Picker.Item label={t('thermometer:selectThermometerDevice')} value={0}/>
	                                          <Picker.Item label={i18n.t("thermometer:cooler")} value={1} key={1}/>
	                                          <Picker.Item label={i18n.t("thermometer:airConditioner2Speed")} value={2} key={2}/>
	                                          <Picker.Item label={i18n.t("thermometer:airConditioner3Speed")} value={3} key={3}/>
	                                          <Picker.Item label={i18n.t("thermometer:split")} value={4} key={4}/>
	                                          <Picker.Item label={i18n.t("thermometer:radiator")} value={5} key={5}/>
	                                      </Picker>
	                                      </View>
                                        </View>
	                    </View>

	                     <View style={commonStyles.displayColumn}>
	                              { (this.state.visible1) ?
                                          (<View>
			                <View style={commonStyles.line}></View>
				            <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
	                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel1}</Text>
		                        <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

		                        <Picker
		                            selectedValue={this.state.selectedOutput1}
		                            style={commonStyles.pickerTherm}
		                            onValueChange={(itemValue, itemIndex) =>
		                              {
		                                    this.setState({
                                                          selectedOutput1: itemValue,
                                                        });
		                              }
		                            }>
		                            {outputsPicker}
		                        </Picker>
		                        </View>
	                              </View>
	                              </View>) : (null) }

				{ (this.state.visible2) ?
                                          (<View>
                                           <View style={commonStyles.line}></View>
	                                        <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir')) }>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel2}</Text>
                                            <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput2}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput2: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
				 </View>) : (null) }

				 { (this.state.visible3) ?
                                          (<View>
                                           <View style={commonStyles.line}></View>
                                        <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel3}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput3}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput3: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible4) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                         <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 3}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>
                                            <Picker
                                                selectedValue={this.state.selectedOutput4}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput4: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible5) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                         <View style={ commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 4}</Text>
                                            <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput5}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput5: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible6) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                        <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 5}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput6}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput6: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                       </View> ) : (null) }

                                         { (this.state.visible7) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                            <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir')) }>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 6}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput7}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput7: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible8) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                         <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 7}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput8}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput8: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible9) ?
                                            (<View>
                                             <View style={commonStyles.line}></View>
                                            <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 8}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput9}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput9: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }


                                         { (this.state.visible10) ?
                                         (<View>
                                         <View style={commonStyles.line}></View>
                                         <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 9}</Text>
                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput10}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput10: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

                                         { (this.state.visible11) ?
                                         (<View>
                                         <View style={commonStyles.line}></View>

                                         <View style={commonStyles.pickerViewThermostat(i18n.t('common:dir'))}>
                                         <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.outputLabel4 + " " + 10}</Text>

                                             <View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

                                            <Picker
                                                selectedValue={this.state.selectedOutput11}
                                                style={commonStyles.pickerTherm}
                                                onValueChange={(itemValue, itemIndex) =>
                                                  {
                                                          this.setState({
                                                            selectedOutput11: itemValue,
                                                          });
                                                  }
                                                }>
                                                {outputsPicker}
                                            </Picker>
                                            </View>
                                        </View>
                                        </View>) : (null) }

	                       </View>
	                       </View>
	                       )
	                       :
	                       (null)
	                       }
                </View>

                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                       onPress={() => this.saveThermometer() }>
                  </MyButton>
                 </View>

              </View>

              { (this.state.alertMod) ? (
               <View>
                        <MyAlert modalVisible={this.state.alertMod}
                          onClick2={() =>{
                          this.getThermometer()
                          this.setState({alertMod:false})
                          } }
                          onClick1={() => this.onClickCancel()}
                          title1={t('common:cancel')}
                          title2={t('common:actions.ok')}
                          title={this.state.titleModal}   />
             </View>
             ) : (null) }

              </ScrollView>
            </KeyboardAvoidingView>
        );
    }


}

export default translate(['ThermometerSetting', 'common'], { wait: true })(ThermometerSetting);
