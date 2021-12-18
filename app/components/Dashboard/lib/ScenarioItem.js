import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { View , Text,Image, ScrollView, FlatList, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import ZagrosDB from '../Common/lib/DB';
import Scenario from '../Scenario/lib/Scenario';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import UDP from '../Common/lib/UDP';
import Output from '../Output/lib/Output';
import Thermometer from '../Thermometer/lib/Thermometer';
import Commands from '../Common/vars/commands';
import CommonFunctions from '../Common/lib/CommonFunctions';
import Slider from '@react-native-community/slider';
import Curtain from '../Curtain/lib/Curtain';

import debounce from 'lodash/debounce';
outputIns = new Output()
stopUpdate = 0;
require('events').EventEmitter.prototype._maxListeners = 1000;

class ScenarioItem extends React.Component{
	constructor(props){
		super(props)
//		console.log(props.type+"**********************"+props.value)
		this.state = {
			outputsl: props.outputs,
			type: props.type,
			type_id: props.type_id,
			icon: props.icon,
			timer: props.timer,
			value: props.value,
			name:props.name,
			id:props.id,
			key:props.value,
		}
//		console.log(this.state.name+"---"+this.state.value+"**********************"+props.name+"--"+props.value)
	}
//	onValueChange(value){
//		console.log("onvalue change: " + value)
//		this.setState({value:(value == 1) ? true : false})
//	}

//	shouldComponentUpdate(nextState, nextProps){
//		console.log((this.props.value  !== nextProps.value )+"-------------------------"+this.props.id+"---"+this.props.value)
//	          if(this.props !== nextProps){
//	                    return true
//
//	          }
//	          else{
//	                    return false
//	          }
//          }

          clickOutput(outputId, outputValue, type, type_id, retry){
                    try{
		          console.log(outputId + " - clickkkkkkkkk output " + retry + "---" + outputValue+ "---"+this.stopUpdate)
		           start = new Date().getTime()
		          //  console.log("Start send: " + start);
		          let getResponse = 0
		           let getError = 0
			 params1 = new Array();

			 if((type == output.OUTPUT_ANALOG_TYPE) || (type == output.OUTPUT_DIGITAL_TYPE)){
			          params1[0] = outputId;
			 }
			 else{
			          params1[0] = type_id;
			 }

			 if(type == output.OUTPUT_ANALOG_TYPE) { // Analog / Slider
			          params1[1] = outputValue;
			 }
			 else{ // Not Analog
			          params1[1] = !outputValue;
			 }

			  params1[2] = type;

		     // Stop sending packets to controller for update outputs
		     this.stopUpdate = 1;
		     // retry = 5

            udp1 = new UDP((Commands.REQ_OUTPUT | Commands.MOD_CONFIG), (Commands.FLAG_EDIT | Commands.OPT_OUTPUT_SET_STATE), params1)
		     if(retry > 0){
		          udp1.sendUdpPacket("", "", true).then(
		                    dataOutUdp => {
		                              getResponse = 1
				          getError = 0
				              console.log("get output" + dataOutUdp[0] + "---"+outputValue +"---" + dataOutUdp[4])

				              if(type != 1) { // Digital
	                                                       this.setState({value: !outputValue});
				              }
				              else{ // Analog
					               this.setState({value: outputValue});
				              }

				             this.stopUpdate = 0
				             end = new Date().getTime()
				             timeSpend = end - start
		           }
		       ).catch(error => {
		            getResponse = 1
		            getError = 1
		            console.log("get output Error " + outputId + "-"+ retry +"---------"+error)

		            if(retry > 0){
		                    this.clickOutput(outputId, outputValue, type, type_id, retry-1)
		            }
		            else {
		              this.stopUpdate = 0
		            }
		           // this.stopUpdate = 0; // Start again sending packets to controller for update outputs
	       })
	 }
     }
     catch(error){
               console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" +error)
     }

   }

          // Change temporary timer for an output
   clickTimerOutput(outputId, timer, type, type_id, retry){
         timer = ((timer + 5) > 120)? 0 : (timer + 5)
         // udp1 = new UDP();
         let getResponse = 0
         let getError = 0

         params1 = new Array();

         output = new Output()
         if((type == output.OUTPUT_ANALOG_TYPE) || (type == output.OUTPUT_DIGITAL_TYPE)){
             params1[0] = outputId;
         }
         else{
             params1[0] = type_id;
         }

         params1[1] = timer;
         params1[2] = type;

         // Stop sending packets to controller for update outputs
         this.stopUpdate = 1;
   // console.log(outputId + "--" + timer + "--" + type + "--" + type_id + "--" + retry)
         if(retry > 0){
            udp1 = new UDP((Commands.REQ_OUTPUT | Commands.MOD_CONFIG), (Commands.FLAG_EDIT | Commands.OPT_OUTPUT_SET_TEMP_TIMER), params1)
           udp1.sendUdpPacket("", "", true, retry).then(
               dataOutUdp => {
                 getResponse = 1
                 getError = 0
                 // console.log("get output" + dataOutUdp[0])
                 // Start again sending packets to controller for update outputs
                 this.stopUpdate = 0

                 dataOut = new Array();
                 CommonFunctions.arrayCopy(dataOutUdp, 4, dataOut, 0, dataOutUdp.length - 4);

                 if(dataOut[0] == 1){
//                           outputsArray = this.state.outputs;
//                           outputsArray[outputId-1].timer = timer;
//                           this.setState({
//                                   outputs: outputsArray,
//                           })
                           this.setState({timer:timer})
                 }
               }
          ).catch(error => {
              console.log("get output Timer Error " + outputId )
              getResponse = 1
              getError = 1
              if(retry > 0){
                 this.clickTimerOutput(outputId, timer, type, type_id, retry-1)
              }
              else {
                 this.stopUpdate = 0
              }
          })
        }

        setTimeout(() => {
          // console.log(outputId+"- aaaa - " + getResponse+"---"+outputValue)
            if(getResponse == 0 && getError == 0){
              // console.log("timeeeeout-" +outputId)
              if(retry > 0){
                    this.clickTimerOutput(outputId, timer, type, type_id, retry-1)
              }
              else {
                    this.stopUpdate = 0
              }
            }
        }, 500);
      }

	componentDidMount(){
		this.clickOutput= debounce(this.clickOutput.bind(this), 200);
	}

	componentDidUpdate(prevProps) {
	  if(prevProps.value !== this.props.value) {
	    this.setState({value: this.props.value});
	  }
	}

	render(){
		return(
                         (this.state.type != outputIns.OUTPUT_ANALOG_TYPE) ?
                         <View  key={this.props.value}
                          style={{marginBottom: 7, flex:1, marginRight:5, marginLeft:5,
                           borderRadius: 10,backgroundColor:'rgba(29, 5, 39, 0.9)', flexDirection:"row", flex:1}}>
                              <TouchableHighlight
                                  onPress={() => this.clickOutput(this.state.id, this.state.value, this.state.type, this.state.type_id, 2)}
                                  style={{width: '100%', flex:2, paddingTop:10}} >
                                  <View  style={{flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                   <Image source={this.state.value ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]} style={{justifyContent:'center', flex:2,resizeMode: 'contain',marginTop:1 }}  />
                                   <Text style={this.state.value ? commonStyles.outputTextOn : commonStyles.outputTextOff} >{this.state.name}</Text>
                                  </View>
                              </TouchableHighlight>
                              <View style={{borderLeftColor: '#3c2446', borderLeftWidth: 1, flex:1, paddingLeft:3}}></View>
                              <TouchableHighlight
                                  onPress={() => this.clickTimerOutput(this.state.id, this.state.timer, this.state.type, this.state.type_id, 2)}
                                  style={{flex:5, width: '100%', flexDirection:'row'}}>
                                     <View style={{flex:1, flexDirection: 'column', alignItems:'flex-end', justifyContent:'flex-end', paddingBottom: 10}}>
                                       <View  style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                                         <Text style={(this.state.timer > 0) ? commonStyles.timerTextOn : commonStyles.timerTextOff} >{this.state.timer}</Text>
                                         <Image source={(this.state.timer > 0) ? require('../Common/img/light-timer.png') : require('../Common/img/dark-timer.png')}  style={{resizeMode:'contain', height:35, justifyContent:'center'}} />
                                       </View>
                                     </View>
                              </TouchableHighlight>
                          </View>
                          :
                          <View style={{flexDirection: 'column'}} >
                              <View  style={commonStyles.flatListViewTouch}>
                                <Text style={(this.state.value > 0) ? commonStyles.flatListViewTextOn : commonStyles.flatListViewTextOff} >{this.state.name}</Text>
                                <Image source={(this.state.value > 0) ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]}  />
                                <Slider
                                    style={{width: "50%", height: 40}}
                                    minimumValue={0}
                                    maximumValue={100}
                                    step={1}
                                    minimumTrackTintColor="#FFFFFF"
                                    maximumTrackTintColor="#000000"
                                    // onValueChange={value => this.setState({ age: val })}
                                    onSlidingComplete={
                                       value => {
                                         this.clickOutput(this.state.id, value, this.state.type, this.state.type_id, 2)
                                       }
                                     }
                                    value={this.state.value}
                                />
                              </View>
                              <TouchableHighlight
                                  onPress={() => this.clickTimerOutput(this.state.id, this.state.timer, this.state.type, this.state.type_id, 2)}
                                  style={{height: '100%', flex:1}}>
                                  <View  style={commonStyles.flatListViewTouch}>
                                    <Text style={(this.state.timer > 0) ? commonStyles.flatListViewTextOn : commonStyles.flatListViewTextOff} >{this.state.timer}</Text>
                                    <Image source={(this.state.timer > 0) ? require('../Common/img/light-timer.png') : require('../Common/img/dark-timer.png')}  />
                                  </View>
                              </TouchableHighlight>
                          </View>
                          )
	}
}

export class Dashboard extends React.PureComponent {

  constructor(props){
	    super(props);
	    this.state = {
		      language: i18n.language,
		      locations: "",
		      scenarios:"",
		      outputs: "",
		      aaa: false,
		      sliderVal: 0,
		      intervalId: 0,
		      thermomtersFilter: "",
		      thermometers: "",
		      curtains:"",
		      selectedLocation: 0,
		      shouldUpdate: true,
                }

    this.stopUpdate = 0;
    this.stopTempUpdate = 1

    this.updateInterval = null;
    this.unmount = this.unmount.bind(this);
    this.getAllThermometers = this.getAllThermometers.bind(this);
    this.getAllOutputs = this.getAllOutputs.bind(this)
    this.getAllLocations = this.getAllLocations.bind(this)
    this.getAllCurtains = this.getAllCurtains.bind(this)
    this.getLocations = this.getLocations.bind(this)
    // this.getAllLocations = this.getAllItems.bind(this)

    output = new Output()
//    udp1 = new UDP();
  }

//	componentDidCatch(error, info) {
//          console.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGg")
//        // to prevent this alert blocking your view of a red screen while developing
//        if (__DEV__) {
//            return;
//        }
//
//        // to prevent multiple alerts shown to your users
//        if (this.errorShown) {
//            return;
//        }
//
//        this.errorShown = true;
//
//        Alert.alert(
//            null,
//            'An unexpected error has occurred. Please restart to continue.',
//            [
//                {
//                    text: buttonText,
//                    onPress: RNRestart.Restart,
//                },
//            ],
//            { cancelable: false }
//        );
//    }


  getAllScenarios(){
       // Get all Scenarios from DB
       ZagrosDB.buildQuery(Vars.querySelect, "Scenario", "", "show_home = 1", "", "", "", 1).then(
          data => {
              this.setState({
                  scenarios: data
              })

          }
       )
       .catch(
          error => {
              alert(this.props.t("scenario:errorGetAllScenarios"));
          }
       )

  }

  getAllOutputs(){
    return new Promise((resolve, reject) => {
      ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
        data => {
                    //todo: should be deletd
                    for(i=0; i<data.length; i++){
                            data[i].value = false
                    }
	            this.setState({
	                outputs: data
	            })


            resolve(true)
           //  alert(data[0].id)
        }
     )
     .catch(
        error => {
          reject(error)
            alert(this.props.t("output:errorGetOutputDataFromDB"));
        }
     )
    })
    
  }

  getAllThermometers(){
    ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "", "", "", "", "", 1).then(
       dataTherm => {
           this.setState({
               thermometers: dataTherm
           })

          //  for(i=0; i<dataTherm.length; i++){
          //    console.log("therm: " + dataTherm[i].title +"-"+dataTherm[i].status)
          //  }
          //  console.log("llllllllllllllllll: "+this.state.thermometers.length)
          
          this.setState({
                    thermometersFiltered: this.state.thermometers.filter((item) => item.status != 0)
          })
       }
    )
    .catch(
       error => {
           alert(this.props.t("thermometer:errorGetAllThermometers"));
       }
    )
  }

  getAllLocations(){
       // Get all Locations from DB
       ZagrosDB.buildQuery(Vars.querySelect, "Location", "", "show_home = 1", "", "", "", 1).then(
          data => {
              this.setState({
                  locations: data,
                  selectedLocation: (data.length != 0) ? data[0].id : 0
              })
              // console.log("locationssssssssssssssss:"+this.state.locations+"-----"+data)
          }
       )
       .catch(
          error => {
              alert(this.props.t("location:errorGetLocationFromDB"));
          }
       )
  }

  getAllCurtains(){
    // Get all Locations from DB
    ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "", "status <> 0", "", "", "", 1).then(
       data => {
           this.setState({
               curtains: data,
           })
          //  alert("curtains"+data)
       }
    )
    .catch(
       error => {
           alert(this.props.t("location:errorGetLocationFromDB"));
       }
    )
  }

  componentDidMount(){
	    i18n.dir().then((d)=>{
		      this.setState({ dir: d  })
	    })
            this.getAllItems();
	   // this.navigationEventListener = this.props.navigation.bindComponent(this);
	  this.updateInterval = null;
	  this.props.navigation.addListener('didBlur',this.unmount);

//	  this.setState({ shouldUpdate: false })
//	   console.log("aaaa"+this.state.shouldUpdate)
  }

  unmount(){
	    // alert("unmountttt"+this.state.intervalId)
	    clearInterval(this.state.intervalId)
	    this.updateInterval = null
  }

//  shouldComponentUpdate(nextProps, nextState) {
//          console.log("Shoullllll updateeeeeeeeeeeeeeee: " + this.state.shouldUpdate)
//         return    this.state.shouldUpdate
//
////          this.setState({shouldUpdate: false})
//  }

shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      return true;
    }
    if (this.state.outputs !== nextState.outputs) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    // if (this.navigationEventListener) {
    //   this.navigationEventListener.remove();
      
      // alert("unmount")
      // if(this.updateInterval) {clearInterval(this.updateInterval);}
    // }
  }

  _handleStateChange = state => {
          this.getAllItems()
   };

   // Execute a Scenario
   clickScenario(scenarioId, retry){
      scenario = new Scenario();
      scenario.run(scenarioId);
   }


   getAllItems()
   {
      this.getAllLocations();
      this.getAllCurtains();
      this.getAllOutputs().then(
        (dout) => {
          this.getAllScenarios();
          this.getAllThermometers();
          this.setState({ shouldUpdate: false })
          tryUpdate = 0;
          tempCounter = 0;
    
           this.updateInterval = setInterval(() => {
             tempCounter++
              console.log("interval: "+ tryUpdate + "----" + this.stopUpdate )
             if((this.stopUpdate == 0 || tryUpdate > 20)){
                 this.stopUpdate = 0;
                 if(tempCounter == 60){
                     tempCounter = 0
                     tryUpdate = 0
                     this.updateThermometers()
                 }
                 else{
                     tryUpdate = 0
                     this.updateOutputs();
                 }
             }
             else{
                 console.log("tryyyy: " + tryUpdate + "---" + this.stopUpdate)
                 tryUpdate++
             }

             // alert("aaa")
           }, 5000);
//
//
          this.setState({
              intervalId: this.updateInterval
    
          })
    
        }
      )
      
      // alert(this.state.intervalId)

      // this.updateInterval = setInterval(() => {
      //
      //   if(this.stopUpdate == 0){
      //       this.updateThermometers();
      //   }
      // }, 60000);
   }

  showLocation(location_id){
      if(location_id === this.state.selectedLocation){
          return "flex"
      }
      else{
          return "none"
      }
  }
  
  updateOutputs(){
    
    // console.log("in outputs");
    output.getOutputsFromController(this.state.outputs).then(
	outputsData => {

	          console.log("Are Equallllllllllllllllllllllllllllllllllll:   "+ (this.state.outputs == outputsData) + "----stop update:"+this.stopUpdate +"--"+outputsData)
	          if(outputsData != false){
		          this.setState({
		                    outputs: outputsData,
		         })
	         }
	})
	.catch(error =>{
		console.log("error in update output: " +error)
	})
  }

   updateThermometers(){
    //  udp1 = new UDP();
     // alert("in outputs");
     this.stopUpdate = 1
     thermometer = new Thermometer()

     udpUpdate = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_GET, "")
     udpUpdate.sendUdpPacket("", "", true).then(
         dataTempUdp => {
            this.stopUpdate = 0

            dataTemp = new Array();
            CommonFunctions.arrayCopy(dataTempUdp, 4, dataTemp, 0, dataTempUdp.length - 4);

//             console.log("Thermometerrrrrrrrrrr "+dataTemp[0]+"-"+dataTemp[1]+"-"+dataTemp[2]+"-"+dataTemp[3]);
            // +dataTemp[4]+"-"+dataTemp[5]+"-"+dataTemp[6]+"-"+dataTemp[7]+"-"+dataTemp[8]+"-"+dataTemp[9]+"-"
            // +dataTemp[10]+"-"+dataTemp[11]+"-"+dataTemp[12]+"-"+dataTemp[13]+"-"+dataTemp[14]+"-"+dataTemp[15]+"-"
            // +dataTemp[16]+"-"+dataTemp[17]+"-"+dataTemp[18]+"-"+dataTemp[19]+"-"+dataTemp[20]+"-"
            // +dataTemp[21]+"-"+dataTemp[22]+"-"+dataTemp[23]+"-"+dataTemp[24]+"-"+dataTemp[25]+"-"
            // +dataTemp[26]+"-"+dataTemp[27]+"-"+dataTemp[28]+"-"+dataTemp[29]+"-"+dataTemp[30]+"-"+dataTemp[31]+"-"
            // +dataTemp[32]+"-"+dataTemp[33]+"-"+dataTemp[34]+"-"+dataTemp[35]+"-"+dataTemp[36]+"-"+dataTemp[37]+"-"
            // +dataTemp[38]+"-"+dataTemp[39]+"-"+dataTemp[40]+"-"+dataTemp[41]+"-"+dataTemp[42]+"-"
            // +dataTemp[43]+"-"+dataTemp[44]+"-"+dataTemp[45]+"-"+dataTemp[46]+"-")

            thermometersArray = this.state.thermometers;
            // console.log("Thermometer arrayyyyyyyyyyy : " +thermometersArray)

            j = 0;
            // for(i=0; i<dataOut.length; i++){
            //     outputsArray[j].value = dataOut[i];
            //     outputsArray[j].timer = dataOut[++i];
            //     j++;
            // }

            // console.log("Therm len: "+ thermometersArray.length + "---" + dataTemp.length)

            temp = 0;
            status = 0;
            to = dataTemp.length - 2
            for(i=0; i < to; i++){

                if ((dataTemp[i] & 1) != 0) {

                    if ((dataTemp[i] & 0x04 ) != 0){
                        status = 2;
                    }
                    else{
                        status = 1;
                    }

                    i++;

                    thermometersArray[j].temp = dataTemp[i] - thermometer.THERMOMETER_OFFSET;
                    thermometersArray[j].status = status;

                    // todo: if therm num more than 10, do something

                } else {
                    i++;
                    thermometersArray[j].temp = temp;
                    thermometersArray[j].status = status;
                }

                j++;
            }

            // for(f=0; f<thermometersArray.length; f++){
            //     console.log("therm: "+f+" *** "+ thermometersArray[f].temp +"---" + thermometersArray[f].status)
            // }

            this.setState({
                thermometers: thermometersArray,
            })
         }
     ).catch(error => {
       console.log("error in update thermometer dashboard: "+ error)
       this.stopUpdate = 0
     })

    //  for(i=0; i<this.state.thermometers.length; i++){
    //    console.log("in update: "+ this.state.thermometers[i].status +"-"+this.state.thermometers[i].title)
    //  }

  //   <View>
  //   <FlatList
  //       extraData={this.state.outputs}
  //       keyExtractor={(item, index) => String(index)}
  //       data={this.state.outputs.filter((outputIns) => outputIns.location_id == locationsState[i].id)}
  //       renderItem={outputs}
  //   />
  // </View>
   }


   getLocations(){
          start = new Date().getTime()
          console.log("Start send: " + start);

          locations = new Array();
          locationOutput = new Array()

	locationsInDashboard = new Array()
	index = 0

	outputsItems = ({item}) => (
		<ListItem
			id={item.id}
			type={item.type}
			type_id={item.type_id}
			value={item.value}
			timer={item.timer}
			icon={item.icon}
			name={item.name}
			outputs={this.state.outputs}
		/>
	)

          thermometers =({item}) => (
	      <View key={"therm"+item.id} style={commonStyles.flatListView}>
	          <TouchableHighlight
	            onPress={() => {}}
	            style={{height: '100%', flex: 1}} >
	              <Text style={{paddingLeft: 10, color: '#b191bd', fontFamily: 'Vazir-Medium', fontSize: 28}}>{item.temp} {"\u00b0 C"}</Text>
	          </TouchableHighlight>
	      </View>
	   );

          locationsState = this.state.locations;

    if(locationsState.length > 0){
          locationsState.forEach((item) => {
    // for(i=0; i<locationsState.length; i++){
          locations.push(
            <View>
                <View key={"loc-"+item.id} style={commonStyles.flatListViewBigTitleLocations}>
                    <TouchableHighlight
                      onPress={() => { this.setState({ selectedLocation: item.id})}}
                      style={{height: 100, width: 100, borderRadius: 10, flex: 1, backgroundColor:'rgba(75, 31, 93, 0.57)', margin: 5, justifyContent: 'center'}} >
                      <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Image source={ImageVars.locationIconLightArray[item.icon]}  style={{width: 80, height: 80, flex: 2, resizeMode: 'contain',marginTop:10}} />
                        <Text style={{flex: 1, flexDirection: 'column', alignItems: 'center', padding: 3, marginTop: 10, height: 20, justifyContent:'center', fontFamily: 'Vazir-Medium', fontSize: 16, color:'#b08dbf'}}>{item.title}</Text>
                      </View>
                    </TouchableHighlight>
                </View>               
            </View>
           
          );

          if(this.state.outputs != ""){

            locationOutput.push(
                <View style={{display: this.showLocation(item.id), flex:6}}>
                  <View  style={commonStyles.titleLocation(this.state.dir)}>
                      <Image source={ImageVars.locationIconLightArray[item.icon]}  style={commonStyles.listViewTouchImg} />
                      <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                      
                      {(this.state.thermometers != "") ? 
                            <View style={{flex:1}}>
                                <FlatList
                                    keyExtractor={(item1, index) => String("therm-"+item1.id)}
                                    data={this.state.thermometers.filter((thermometerIns) => thermometerIns.location_id == item.id)}
                                    renderItem={thermometers}
                                    horizontal={false}
                                    numColumns={3}
                                />
                            </View>
                        : null  }                  
                  </View>
                  <View style={commonStyles.line}></View>
                 <View style={{flexDirection:'column', flex:1}}>
                  <FlatList
                      keyExtractor={(item, index) => String("out-"+item.id)}
                      data={this.state.outputs.filter((outputIns) => outputIns.location_id == item.id)}
                      renderItem={outputsItems}
                      horizontal={false}
                      getItemLayout={(data, index) => (
                          {length: 60, offset: 60 * index, index}
                       )}
                  />
                  </View>
                </View>
              ) 
          }

        })

        curtains =({item}) => ( 
              <View key={item.id} style={{flex:1, flexDirection:'row-reverse'}}>
                  <View style={{flex:3}}>
                      <View style={{flex:1, flexDirection:'row'}} >
                          <Text style={{flex:2, color:'#fff', fontFamily:'Vazir-Medium', fontSize:16, marginTop:10}}>{item.title}</Text>
                          <Image source={require('../Common/img/common-light-curtain.png')}  style={{flex:1, resizeMode:'contain'}}/>    
                                    
                      </View>
                  </View>                 
                  <View style={{flex:1}}>
                      <TouchableHighlight style={{alignItems:'center'}} onPress={() => {Curtain.runCurtain(item.type_id, item.type, Commands.CURTAIN_OPEN, 5)}} >
                      <Image source={require('../Common/img/curtain-light-open.png')}  style={{flex:1, resizeMode:'contain', width: 35, justifyContent:'center', padding:10}}/>               
                      </TouchableHighlight>
                  </View>
                  <View style={{flex:1}}>
                      <TouchableHighlight style={{alignItems:'center'}}  onPress={() => { Curtain.runCurtain(item.type_id, item.type, Commands.CURTAIN_STOP, 5)}}>
                          <Image source={require('../Common/img/curtain-light-stop.png')} style={{flex:1, resizeMode:'contain', width: 35, justifyContent:'center', padding:10}}  />               
                      </TouchableHighlight>
                  </View>
                  <View style={{flex:1}}>
                      <TouchableHighlight style={{alignItems:'center'}}  onPress={() => {Curtain.runCurtain(item.type_id, item.type, Commands.CURTAIN_CLOSE, 5)}}>
                          <Image source={require('../Common/img/curtain-light-close.png')} style={{flex:1, resizeMode:'contain', width: 35, justifyContent:'center', padding:10}}  />               
                      </TouchableHighlight>
                  </View>
              </View>  
        );

        locationsInDashboard.push(locationOutput)
        console.log("curtainsssssssssssssssss"+this.state.curtains)
        
        // alert("curtains: "+this.state.curtains)
        locationsInDashboard.push(
          <View style={(this.state.curtains != "") ? {height: 60} : {display:'none'}}>
            <View style={commonStyles.line}></View>
            <FlatList
                keyExtractor={(item, index) => String(index)}
                data={(this.state.curtains != "") ? this.state.curtains.filter((item) => item.location_id == this.state.selectedLocation) : ""}
                renderItem={curtains}
                horizontal={false}
                numColumns={2}
            />
        </View>
        )

        locationsInDashboard.push(          
          <View style={commonStyles.containerLocationsList, {flex:2}}>
            <View style={commonStyles.line}></View>
            <View style={{height: 30, flexDirection:'row-reverse'}}>
              <LinearGradient colors={['#e72054', '#ff2a62', '#ff2a62']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}  style={{flex:1}}>
                <Text style={{fontFamily: 'Vazir-Medium', fontSize: 16, paddingRight: 10, paddingTop: 2}}>{i18n.t('location:locations')}</Text>
              </LinearGradient>
            </View>
            <ScrollView horizontal={true} style={commonStyles.iconLocationsList(this.state.dir), {flexDirection:'row'}}>
            {locations}
            </ScrollView>
          </View>
        )
        // locationsInDashboard.push("y</View>")

      }
      
    end = new Date().getTime()
    timespend = end - start
     console.log("end Loading: " + timespend);
        return locationsInDashboard;

   }


   render() {
        outputIns = new Output()

       
        scenarios =({item}) => (         
          <View>
              <View key={item.id} style={commonStyles.flatListViewBigTitleLocations}>
                  <TouchableHighlight
                    onPress={() => { this.clickScenario(item.id)}}
                    style={{height: 130, width: 120, borderRadius: 10, flex: 1, backgroundColor:'rgba(75, 31, 93, 0.98)', margin: 6, justifyContent: 'center'}} >
                    <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                      <Image source={ImageVars.locationIconLightArray[item.icon]}  style={{width: 120, height: 120, flex: 2, resizeMode: 'contain',marginTop:10}} />
                      <Text style={{flex: 1, flexDirection: 'column', alignItems: 'center', padding: 3, marginTop: 10, height: 20, justifyContent:'center', fontFamily: 'Vazir-Medium', fontSize: 16, color:'#b08dbf'}}>{item.title}</Text>
                    </View>
                  </TouchableHighlight>
              </View>               
          </View>
        );

        

        // locations.push("")
        return (

              <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={{flex:1, flexDirection:'column'}}>

                  <View style={{flex:10, height:'100%'}}>
                      {this.getLocations()}
                      
                  </View>
                  
                  <View style={commonStyles.containerLocationsList, {flex:2}}>
                  <View style={{height: 30, flexDirection:'row-reverse'}}>
                    <LinearGradient colors={['#e72054', '#ff2a62', '#ff2a62']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}  style={{flex:1}}>

                    <Text style={{fontFamily: 'Vazir-Medium', fontSize: 16, paddingRight: 10, paddingTop: 2}}>{i18n.t('scenario:scenarios')}</Text>
                    </LinearGradient>

                  </View>
                    <FlatList
                      keyExtractor={(item, index) => String(index)}
                      data={this.state.scenarios}
                      renderItem={scenarios}
                      horizontal={true}
                    />
                  </View>
                
                  
              <View style={commonStyles.viewFooter}>
                <MyFooter  navigation={this.props.navigation} />
              </View>
              </LinearGradient>

        );
    }
}

