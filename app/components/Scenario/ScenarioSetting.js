import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Modal, TouchableOpacity, Switch, KeyboardAvoidingView, ScrollView, Image, FlatList, View, Text, TextInput, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import {MyAlert} from '../Common/MyAlert';
import Scenario from '../Scenario/lib/Scenario';
import Output from '../Output/lib/Output';
import Curtain from '../Curtain/lib/Curtain';
import InputEvent from '../InputEvent/lib/InputEvent';
import Schedule from '../Schedule/lib/Schedule';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import CheckBox from 'react-native-checkbox';
import Spinner from 'react-native-loading-spinner-overlay';
import RadioForm from 'react-native-simple-radio-button';

export class ScenarioSetting extends React.Component {
//    output1: Output;
    constructor(props){
      super(props);

      output = new Output();
      checkedArray = new Array(output.OUTPUT_NUMBER);

      curtain = new Curtain();
      checkedCurtainArray = new Array(curtain.CURTAIN_NUMBER)

      inputEvent = new InputEvent()
      checkedInputEvents = new Array()

      schedule = new Schedule()
      checkedSchedules = new Array()      
     
      this.state ={
            scenarios : "",
            successName: true,
            modalVisible: false,
            modalCurtainVisible: false,
            modalScheduleVisible: false,
            modalInputEventVisible: false,
            outputs: "",
            curtains: "",
            inputEvents: "",
            schedules: "",
            isChecked: false,
            checked: [],
            checkedCurtains: [],
            checkedSchedules: [],
            checkedInputEvents: [],
            mode: Vars.modeInsert,
            scenarioName: "",
            alertMod: false,

       }

       this.saveScenario = this.saveScenario.bind(this);
       this.getScenario = this.getScenario.bind(this)
       this.getAllInputEvents = this.getAllInputEvents.bind(this)
       this.getAllSchedules = this.getAllSchedules.bind(this)
       this.getActionsOfScenario = this.getActionsOfScenario.bind(this)
       this.getSelectedOutputs = this.getSelectedOutputs.bind(this);
       this.getSelectedCurtains = this.getSelectedCurtains.bind(this);
    
    }

    setModalVisible(modalType, visible) {

        if(modalType == "output"){
            this.setState({modalVisible: visible});
        }
        if(modalType == "curtain"){
            this.setState({modalCurtainVisible: visible});
        }
        if(modalType == "inputEvent"){
            this.setState({modalInputEventVisible: visible});
        }
        if(modalType == "schedule"){
            this.setState({modalScheduleVisible: visible});
        }

    }

    // Get id of curtain
    getCurtainId(type_id, type, curtain){
        id = ""

        if(type == curtain.CURTAIN_WIFI_TYPE){
            id = type_id
        }
        else if(type == curtain.CURTAIN_RS485_TYPE){
            id = type_id + curtain.CURTAIN_WIFI
        }

        return id
    }


    //Get actions of scenario from controller by got params
    getActionsOfScenario(data){
        return new Promise((resolve, reject) => {
                    try{
                    inputEvents = new Array();
            schedules = new Array();
            checked = new Array();
            curtains = new Array();

            end = (data[3] * 3) + 4;

            output = new Output();
            curtain = new Curtain();
            checkedCurtainArray = new Array()
            checkedinput = ""
            checkedSchedules = ""

            // List of outputs for check
            for(i=0; i < output.OUTPUT_NUMBER; i++){
                checkedArray[i] = false;
            }

            // List of curtains for check
            for(i=0; i < curtain.CURTAIN_NUMBER; i++){
                checkedCurtainArray[i] = false;
            }

            j = 0;
            i = 4;
            c = 0;
            e = 0;
            s = 0;

//           console.log(data[0]+"-"+data[1]+"-"+data[2]+"-"+data[3]+"-"+data[4]+"-"+data[5]+"-"+
//           data[6]+"-"+data[7]+"-"+
//           data[8]+"-"+data[9]+"-"+data[10]+"-"+data[11]+"-"+data[12]+"-"+data[13]+"-"+data[14]+"-"+
//           data[15]+"-"+data[16]+"-"+data[17]+"-"+data[18]+"-"+data[19]+"-"+data[20]+"-"+data[21]+"-"+
//           data[22]+"-"+data[23]+"-"+data[24]+"-"+data[25]+"-"+data[26]+"-"+data[27]+"-"+data[28])

            this.getAllOutputs().then((dataG) =>{
                this.getAllCurtains().then((dataC) =>{
                 
                        outputs = this.state.outputs;
                        curtains = this.state.curtains;
                        // console.log(outputs.length)

                        while (i < end) {
                            // console.log("type:  " + curtain.CURTAIN_WIFI_TYPE + "--" + data[i+2])

                            if(data[i+2] == curtain.CURTAIN_WIFI_TYPE || data[i+2] == curtain.CURTAIN_RS485_TYPE){ // curtain
                                id = this.getCurtainId(data[i], data[i+2], curtain)
                                 console.log("Curtain: " + id + "----" + data[i+1])
                                curtains[id-1].type_id = data[i];
                                curtains[id-1].value = data[i+1]
                                curtains[id-1].type = data[i+2];

                                checkedCurtainArray[id-1] = true
                            }
                            else{ // output
                                selectedId = this.getIdOfOutput(data[i], data[i+2]);
                                id = ""
                                if((data[i+2] == output.OUTPUT_ANALOG_TYPE) || (data[i+2] == output.OUTPUT_DIGITAL_TYPE)){
                                    id = data[i]
                                }
                                else{
                                    id = selectedId
                                }
//                                 console.log("output id: " + id + "---" +data[i+2] + "---" + selectedId +"--" + data[i])
                                outputs[id-1].id = id;
                                outputs[id-1].value = (data[i+1] == 1) ? true : false;
                                outputs[id-1].type = data[i+2];

                                checked[id-1] = true;

                            }

                            i+=3;
                        }


                        this.setState({
                            checked: checked,
                            outputs: outputs,
                            curtains: curtains,
                            checkedCurtains: checkedCurtainArray,
                        }, () => {
                              this.getSelectedOutputs();
                              this.getSelectedCurtains();
                        })


                        this.getAllSchedules().then((dataS) =>{
                            
                            checkedSchedules = this.state.checkedSchedules

                            endS = data[end] + end;
                            for(i = end + 1; i <= endS; i++){
                                checkedSchedules[data[i]-1] = true;
                                // s++;
                            }
                            this.getSelectedSchedules(schedules);
                        })
                        
                
                        this.getAllInputEvents().then((dataM) =>{
                            
                            checkedinput = this.state.checkedInputEvents
                            endIE = data[endS+1] + endS + 2;
                            console.log("end E: "+ endIE + "--i : "+i + "---endS: "+ endS)

                            for(i = endS + 2; i < endIE; i++){
                                console.log("IE: " + i + "----")
                                // console.log(data[i])
                                checkedinput[data[i]-1] = true;
                                // console.log("IE: "+(data[i]-1))
                            }

                            this.getSelectedInputEvents(inputEvents);
                        }) 
                        
                        this.setState({
                            checkedSchedules: checkedSchedules,
                            checkedInputEvents: checkedinput
                        }, () => {
                              resolve(true)
                        })

                    })            
    
            })

       }
       catch(error){
                           console.log("Error in Get Scenario: " + error)
                          reject(error)
        }


//        }
//        catch(error){
//            console.log("Error in Get Scenario: " + error)
//            alert(this.props.t("scenario:errorGetActionsOfScenario"))
//        }
//        this.getSelectedActions();
    })
    }

    getIdOfOutput(type_id, type){
        id = 0
        this.state.outputs.map(item => {
            if((item.type_id == type_id) && (item.type == type)){
                id = item.id
            }
        })
        return id;
    }

    componentDidMount(){ 

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        if(item != null){
            this.setState({
                    scenarioId: item.id,
                    scenarioName: item.title,
                    scenarioIcon: item.icon,
                    checkShowHomepage: (item.show_home == 1) ? true : false,
                    mode: Vars.modeUpdate,
            });

            this.getScenario(item.id);

        }
        else{
            this.setState({
                    scenarioId: 0,
                    scenarioName: "",
                    scenarioIcon: 0,
                    checkShowHomepage: false,
                    checked: checkedArray,
                    checkedCurtains: checkedCurtainArray,
            });

            this.getAllOutputs();
            this.getAllCurtains()
            this.getAllInputEvents()
            this.getAllSchedules()

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
//            this.refs.titleTextInput.focus();
        }



    }

    getScenario(scenarioId){
//        retry = 3
        getResponse = 0
        scenario = new Scenario();
        scenario.getScenario(scenarioId).then(
            data => {
                console.log("Get Scenario in setting scenario .... ")
                if(data.length > 0){
                    this.getActionsOfScenario(data).then(
                              scenarioD => {
                              getResponse = 1
                              }
                    )
                    .catch(error => {
                              console.log("Error in get scenario : try: " + error)
//                              if(retry > 0){
//                                        retry = retry - 1
//                                        this.getScenario(scenarioId)
//                              }
//                              else{
			this.setState({
			         alertMod: true,
			         titleModal: this.props.t("scenario:errorGetActionsOfScenario"),
			})
//                                         alert(this.props.t("scenario:errorGetActionsOfScenario"))
//                              }
                    })
                }
            }
        )
        .catch(
		error => {
			console.log("Error in get scenario :2" + error)

			this.setState({
			         alertMod: true,
			         titleModal: this.props.t("scenario:errorGetActionsOfScenario"),
			})
//			alert(this.props.t("scenario:errorGetActionsOfScenario"))
		}
        );

        setTimeout(() => {
               if(getResponse == 0){
                    console.log("error Get scenario i n setting")
				    this.setState({
				         alertMod: true,
				         titleModal: this.props.t("scenario:errorGetActionsOfScenario"),
				    })

               }
           }, 4000);

    }

    saveScenario(retry){
        this.setState({
                 spinner: true,
                 func:"save",
                 alertMod: false,
        })

        timeout = ""
       if((retry != 0) && !retry){ retry = 2}
       let getResponse = 0
       let getError = 0
       timeout = ""

        if(this.state.scenarioName.trim().length == 0){
            this.setState({
                successName: false,
              spinner: false,
            })
            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            ScenarioIns = new Object();
            ScenarioIns.title = this.state.scenarioName;
            ScenarioIns.icon = this.state.scenarioIcon;
            ScenarioIns.showHome = this.state.checkShowHomepage;
            ScenarioIns.id = this.state.scenarioId;

            scenario = new Scenario();

            scenario.saveScenario(ScenarioIns, this.state.checked, this.state.outputs, this.state.checkedCurtains, this.state.curtains, this.state.checkedSchedules, this.state.checkedInputEvents, this.state.mode)
            .then(
                data => {
                    if(data == true){
                         if(timeout != ""){ clearTimeout(timeout) }
                         getResponse = 1
                        this.props.navigation.navigate('ScenarioPage');
                    }
                    else{
	                        getError = 1
                    }
                }
            )
            .catch(
                error => {
                              console.log("error in save scenario " + error)
	                    getError = 1
                }
            );

            setTimeout(() => {

                      console.log("error save scenario i n setting")
                if(retry == 0){
                           this.setState({
                                            spinner: false,
                                            alertMod: true,
                                            titleModal: i18n.t('scenario:errorSaveScenario'),
                                            func:"save",
                                 })
                }
                else{
                          if(getResponse == 0 || getError == 1){
                                        console.log("error : " + retry + "---"+getResponse+"---"+getError)
                                        this.saveScenario(retry-1)
                            }
                }

             }, 2000);
        }
    }

    active(position){
        this.setState({
            scenarioIcon : position,
        })
    }

    // Change BG color of scenarios
    bgColor(position) {
        if (this.state.scenarioIcon === position) {
            return "#d4bdde";
        }
        else{
            return "transparent";
        }
    }

    // Render and return Scenario icons
    renderIcons() {
        const iconItems = [];

        ImageVars.scenarioIconArray.map((item, position) => {
             iconItems.push( <TouchableOpacity  key={position}
                    onPress={() => {this.active(position);}}
                    style={[commonStyles.iconListTouch ,{backgroundColor: this.bgColor(position)} ]}>
                   <Image source={item} style={commonStyles.iconListImage}></Image>
                </TouchableOpacity>
               );
               }
        )

        return iconItems;
    }

    // Get all outputs from DB
    getAllOutputs(){
        o = new Output()
        return new Promise((resolve, reject) => {
         ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "id <= " + o.OUTPUT_NUMBER, "", "", "", 1).then(
            data => {
                for(ii=0; ii < data.length; ii++){
                    data[ii].value = false;
                }

                this.setState({
                    outputs: data
                }, () => {
                    resolve(true)
                    console.log("get output done")
                })
            }
         )
         .catch(
            error => {
                  console.log('Error in get all outputs')
                 reject(error)
                  alert(this.props.t("output:errorGetOutputDataFromDB"));
            }
         )
        })
    }

    // Get all inputEvents from DB
    getAllInputEvents(){
        return new Promise((resolve, reject) => {
         ZagrosDB.buildQuery(Vars.querySelect, "InputEvent", "", "", "", "", "", 1).then(
            dataI => {
                // inputEvent = new InputEvent()
                // inputEvents = new Array(inputEvent.INPUT_EVENT_MAX_NUMBER)
                checkedInput = new Array(dataI.length)

                for(i=0; i<dataI.length; i++){

                    // inputEvents[dataI.id-1] = dataI[i]
                    checkedInput[i] = false

//                    console.log("IE in get : " + i + "--" + dataI[i] + "---" + dataI[i].id)
                }

                this.setState({
                    inputEvents: dataI,
                    checkedInputEvents: checkedInput
                }, () => {
                     console.log("ie get done")
                                    resolve(true)
                })
            }
         )
         .catch(
            error => {
                reject(error)
                console.log("Error in get all input events")
                alert(this.props.t("inputEvent:errorGetAllInputEvents"));
            }
         )
        })
    }

     // Get all Schedules from DB
    getAllSchedules(){
        return new Promise((resolve, reject) => {
         ZagrosDB.buildQuery(Vars.querySelect, "Schedule", "", "", "", "", "", 1).then(
            dataS => {
                checkedSchedule = new Array(dataS.length)
                for(i=0; i<dataS.length; i++){
                    checkedSchedule[i] = false
                }

                this.setState({
                    schedules: dataS,
                    checkedSchedules: checkedSchedule
                }, () => {
                    console.log("schedule get done")
                     resolve(true)
                })


            }
         )
         .catch(
            error => {
                reject(error)
                console.log("Error in get all Schedules")
                alert(this.props.t("schedule:errorGetAllSchedules"));
            }
         )
        })
    }

    // Get all curtains from DB
    getAllCurtains(){
        return new Promise((resolve, reject) => {
         ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "", "", "", "", "", 1).then(
            dataCurtain => {
                for(c=0; c < dataCurtain.length; c++){
                    dataCurtain[c].value = 0
                }

                this.setState({
                    curtains: dataCurtain
                }, () => {
	                 console.log("curtains get done")
	                 resolve(true)
	       })

            }
         )
         .catch(
            error => {
                reject(error)
                console.log("Error in get all input events")
                alert(this.props.t("curtain:errorGetAllCurtainsFromDB"));
            }
         )
        })
    }

    // Render and return selected outputs in modal
    getSelectedOutputs() {
        selectedOutputs = [];
        outputs = new Array();
        outputs = this.state.outputs;
        i = 0;
        checkedO = this.state.checked;

        outputs.forEach((item) => {
            if((checkedO[i] == true) && ((i+1) == item.id)){
                selectedOutputs.push(
                   <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                   <View style={commonStyles.listImg}><Image source={ImageVars.outputIconArray[item.icon]}></Image></View>

                   <CheckBox
                        onChange={(checked) => {
                                checkedArray = this.state.outputs;
                                checkedArray[item.id-1].value = !checkedArray[item.id-1].value;
                                this.setState({
                                    outputs: checkedArray,
                                });
                            }
                        }
                        dir={i18n.t('common:dir')}
                        label={item.name}
                        showOut={"1"}
                        labelColor={'#d4bdde'}
                        iconColor={'#d4bdde'}
                        checkedImage={'brightness-high'}
                        uncheckedImage={'highlight-off'}
                        checked={this.state.outputs[item.id-1].value}

                   />
                </View>
                );
            }
            i++;
        });

        this.setState({
            selectedOutputsArray : selectedOutputs,
        })
    }

    // Render and return Input Events
    getSelectedInputEvents(checkedInputEvents) {
        if(checkedInputEvents == "" || !checkedInputEvents){
            checkedInputEvents = this.state.checkedInputEvents
        }

        const selectedInputEvents = [];
        inputEvents = new Array();
        inputEvents = this.state.inputEvents;
        i = 0;
        // alert(this.state.checkedInputEvents.length + "---" + inputEvents.length)
        // j = 0;

        if(inputEvents != "" && inputEvents != null){
            inputEvents.forEach((item) => {

                while((i+1) != item.id){
                    i++
                }
//                console.log("input events : " + i + "---" + item.id + "---" + checkedInputEvents[i])

                if((checkedInputEvents[i] == true)){
                    selectedInputEvents.push(
                    <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                        <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                            <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                        </View>
                    </View>
                    );
                }
                i++;
            });
        }

        this.setState({
            selectedInputEventsArray : selectedInputEvents,
            checkedInputEvents: checkedInputEvents,
        })
    }

    // Render and return Schedules
    getSelectedSchedules(checkedSchedules) {
        const selectedSchedules = [];
        schedules = new Array();
        schedules = this.state.schedules;
        i = 0

        if(checkedSchedules == "" || !checkedSchedules){
            checkedSchedules = this.state.checkedSchedules
        }

        if(schedules != "" && schedules != null){
            schedules.forEach((item) => {
                while((i+1) != item.id){
                    i++
                }
//                console.log("schedule: " +i + "---" + item.id + "---" + checkedSchedules[i])

                if((checkedSchedules[i] == true)){
                    selectedSchedules.push(
                    <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                        <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                            <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                        </View>
                    </View>
                    );
                }
                i++;
            });
        }

        // for(i=0; i<schedules.length; i++){
        //     if(this.state.checkedSchedules[i+1] == true){
        //         selectedSchedules.push(
        //             <View key={i}  style={commonStyles. listViewTouchView(i18n.t('common:dir'))} >
        //                <View style={commonStyles.listTitleView}><Text style={commonStyles.listTitle}>{schedules[i].title}</Text></View>
        //             </View>

        //         );
        //     }
        // }

        this.setState({
            selectedSchedulesArray : selectedSchedules,
            checkedSchedules: checkedSchedules,
        })
    }

    //
    getSelectedCurtains() {
        const selectedCurtains = [];
        curtains = new Array();
        curtains = this.state.curtains;
        checkedCurtains = this.state.checkedCurtains;
        i = 0
        var radioCurtain = [
          {label: i18n.t('curtain:open'), value: 1 },
          {label: i18n.t('curtain:close'), value: 2 },
          {label: i18n.t('curtain:toggle'), value: 4 }
        ];

        curtains.forEach((item) => {

            if((checkedCurtains[i] == true) && ((i+1) == item.id)){
                initial = (item.value == 1) ? 0 : (item.value == 2) ? 1 : 2
//            console.log("in curtains: id: " + item.id + "----" + this.state.curtains[item.id-1].value + "----" + item.value + "---" + initial)
                selectedCurtains.push(
                   <View key={i}  style={commonStyles.listViewTouchViewCurtain} >
	                   <View style={commonStyles.listImgCurtain(i18n.t("common:dir"))}>
		                   <Image source={require('../Common/img/common-light-curtain.png')}></Image>
		                   <Text style={commonStyles.textCurtain(i18n.t("common:dir"))}>{item.title}</Text>
	                   </View>

	                   <View  key={item.id} style={commonStyles.listRadioOutputsScnario(i18n.t('common:dir'))}>
	                           <RadioForm
	                           radio_props={radioCurtain}
	                           labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
	                           initial={initial}
	                           formHorizontal={true}
	                           onPress={(value, index) => {
					checkedArray = this.state.curtains;
	                                          console.log("checked curtain: " + index + "---" + value +"---" + checkedArray[item.id-1].value)
	                                          checkedArray[item.id-1].value = radioCurtain[index].value;
	                                          this.setState({
	                                              curtains: checkedArray,
	                                          });
	                                }
	                           }
	                           />
	                    </View>
                </View>
                );
            }
            i++
        });

        this.setState({
            selectedCurtainArray : selectedCurtains,
        })
    }

    onClickCancel(){
          this.setState({alertMod:false})
          this.props.navigation.navigate('ScenarioPage');
    }

    render() {
        const { t } = this.props;

        renderItem = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <Image source={ImageVars.outputIconArray[item.icon]}  style={commonStyles.imageListSelection} />
                <CheckBox style={commonStyles.flex5}
                    onChange={(checked) => {
                        checkedArray = this.state.checked;
                        checkedArray[item.id-1] = !checkedArray[(item.id)-1];
                        this.setState({ checked: checkedArray });
                     }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checked[(item.id)-1]}
                    label={item.name}
                />

                <View style={commonStyles.flex2} />

            </View>
         );

        const renderItemCurtain = ({item}) => (
            <View key={item.id-1} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <CheckBox style={commonStyles.flex5}
                    onChange={(checked) => {

                        checkedArray = this.state.checkedCurtains;
                        checkedArray[item.id-1] = !checkedArray[item.id-1];
                        this.setState({ checkedCurtains: checkedArray });
                    }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checkedCurtains[item.id-1]}
                    label={item.title}
                />
                <View style={commonStyles.flex3} />
            </View>

         );

        const renderItemInputEvent = ({item}) => (
            (item !== null) ?
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
               <CheckBox style={{flex: 5}}
                    onChange={(checked) => {
		    checkedinput = ""
                        checkedinput = this.state.checkedInputEvents;
                        checkedinput[item.id-1] = !checkedinput[(item.id)-1];
                        this.setState({ checkedInputEvents: checkedinput });
                        // alert(item.id + "---" + this.state.checkedInputEvents[(item.id)-1])
                    }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checkedInputEvents[(item.id)-1]}
                    label={item.title}
                />
                <View style={commonStyles.flex3} />
            </View>
            : null
         );

        const renderItemSchedule = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <CheckBox style={{flex: 5}}
                    onChange={(checked) => {

                        checkedArray = this.state.checkedSchedules;
                        checkedArray[(item.id)-1] = !checkedArray[(item.id)-1];
                        this.setState({ checkedSchedules: checkedArray });
                     }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checkedSchedules[(item.id)-1]}
                    label={item.title}
                />
                <View style={commonStyles.flex3} />
            </View>
         );

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
                <View style={commonStyles.containerView}>
                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                             ref="titleTextInput"
                            onChangeText={(txt) => {
                                if(txt.trim().length == 0){
                                    this.setState({
                                        scenarioName: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        scenarioName: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.scenarioName}
                        />
                    </View>
                    <View  style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('scenario:scenarioFillName')}
                            </Text>
                        ) : (null)}
                    </View>


                    <View style={commonStyles.containerIconList(i18n.t('common:dir'))}>
                        <ScrollView horizontal={true} style={commonStyles.iconList(i18n.t('common:dir'))} >
                          {this.renderIcons()}
                        </ScrollView>
                    </View>

                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <View style={commonStyles.switch}>
                            <Switch
                            trackColor={{ false: "#767577", true: "#d094ea" }}
                            thumbColor={this.state.checkShowHomepage ? "#ff2a62" : "#f4f3f4"}
                            onChange={()=>{
                                var c = this.state.checkShowHomepage;
                                this.setState({
                                    checkShowHomepage:!c
                                })
                              }
                            }
                            value={this.state.checkShowHomepage} />
                        </View>
                        <View >
                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}
                                  onPress={()=>{
                                    var c=this.state.checkShowHomepage;
                                    this.setState({
                                        checkShowHomepage:!c
                                    })
                                  }}
                                 >{t('location:showHome')}</Text>
                        </View>
                    </View>

                      <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('output:output')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setState({outputsT: this.state.outputs.filter(item => item.flag !== 0)})
                                this.setModalVisible("output", true);
                              }}>
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedOutputsArray}
                    </View>

                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('curtain:curtain')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setState({curtainsA: this.state.curtains.filter(item => item.status !== 0)})
                                this.setModalVisible("curtain", true);
                            }}
                            >
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedCurtainArray}
                    </View>

                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('inputEvent:inputEvent')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {                                
                                this.setState({inputEventsA: this.state.inputEvents.filter(item => item.status !== 0)})
                                this.setModalVisible("inputEvent", true);
                            }}
                            >
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                       {this.state.selectedInputEventsArray}
                    </View>
                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('schedule:schedule')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                
                                this.setState({schedulesA: this.state.schedules.filter(item => item.status !== 0)})
                                this.setModalVisible("schedule", true);
                            }}
                            >
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                       {this.state.selectedSchedulesArray}
                    </View>

                </View>
                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') } dir={t("common:dir")}
                       onPress={() => this.saveScenario() }>
                  </MyButton>
                </View>

                <View>
                     <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('output:selectOutput')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.outputsT}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.outputsT}
                             renderItem={renderItem}
                           />
                        </View>
                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('output:selectOutput') } dir={t("common:dir")}
                              onPress={() => {this.setState({modalVisible: false})
                              this.getSelectedOutputs()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>

                 <View>
                     <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalCurtainVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalCurtainVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('curtain:selectCurtain')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.curtainsA}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.curtainsA}
                             renderItem={renderItemCurtain}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('curtain:selectCurtain') } dir={t("common:dir")}
                              onPress={() => {this.setState({modalCurtainVisible: false})
                              this.getSelectedCurtains()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>
                <View>
                     <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalInputEventVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalInputEventVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('inputEvent:selectInputEvent')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.inputEventsA}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.inputEventsA}
                             renderItem={renderItemInputEvent}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('inputEvent:selectInputEvent') } dir={t("common:dir")}
                              onPress={() => {this.setState({modalInputEventVisible: false})
                              this.getSelectedInputEvents()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>
                <View>
                     <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalScheduleVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalScheduleVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('schedule:selectSchedule')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.schedulesA}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.schedulesA}
                             renderItem={renderItemSchedule}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('schedule:selectSchedule') } dir={t("common:dir")}
                              onPress={() => {this.setState({modalScheduleVisible: false})
                              this.getSelectedSchedules()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>
              </LinearGradient>

              {(this.state.alertMod) ?  (
                 <View>
                            <MyAlert modalVisible={this.state.alertMod}
                                  onClick2={() =>{
	                              this.setState({alertMod:false});
	                              (this.state.func == "get") ?
	                              this.getScenario(this.state.scenarioId) : this.saveScenario(2)
                                  }}

                              onClick1={() => this.onClickCancel()}
                              title1={t('common:cancel')}
                              title2={t('common:actions.ok')}
                              title={this.state.titleModal}   />
                 </View>
                 ) : (null) }

		{(this.state.spinner) ? (
	            <View style={{flex:1, flexDirection:'column'}}>
	                    <Spinner
	                        visible={this.state.spinner}
	                        textContent={this.props.t('common:loading')}
	                        textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
	                    />
	            </View>
	            ) : (null)}
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }

}

export default translate(['ScenarioSetting', 'common'], { wait: true })(ScenarioSetting);
