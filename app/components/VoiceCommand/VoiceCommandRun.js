import React from 'react';
import { translate} from 'react-i18next';
import { TouchableOpacity, TouchableHighlight, KeyboardAvoidingView, ScrollView, View, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import {MyAlert} from '../Common/MyAlert';
import Output from '../Output/lib/Output';
import Scenario from '../Scenario/lib/Scenario';
import ZagrosDB from '../Common/lib/DB';
import UDP from '../Common/lib/UDP';
import Vars from '../Common/vars/commonVars';
import Commands from '../Common/vars/commands';
import Voice from 'react-native-voice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import i18n from 'i18next';
import FastImage from 'react-native-fast-image'

export class VoiceCommandRun extends React.Component {
  //    output1: Output;
  constructor(props){
    super(props);

    this.outputs = []
    this.state ={
      voiceCommands : "",
      outputs: [],
      scenarios: [],
      isChecked: false,
      selectedOutput: 0,
      selectedOutputName: "",
      selectedScenario: "",
      viewOutputs: true,
      recognized: '',
      started: '',
      results: [],
      command: "",
      sliderOutput: 0,
      checkOutput: false,
      voicecom: "",
      alertMod: false,
    }

    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }


  componentWillUnmount() {
      Voice.destroy().then(Voice.removeAllListeners);
    }

  onSpeechStart(e) {
      this.setState({
        started: '√',
      });
    };

  onSpeechRecognized(e) {
	this.setState({
		recognized: '√',
	});
    };

  onSpeechResults(e) {
	this.setState({
	    results: e.value,
	});

	voices = ""

	this.state.results.map((result, index) => {
	    if(voices == ""){
	        voices = "'"+result+ "'"
	    }
	    else{
	        voices = voices + ",'" + result + "'"
	    }
	})

//    console.log("voices: "+voices)
    params1 = new Array()
//    params1[0] = voices
    ZagrosDB.buildQuery(Vars.querySelect, "VoiceCommand", "", "command IN ("+ voices +")" , params1, "", "", 1).then(
    data => {
     console.log("---" + data[0].command)
      if(data.length > 0 && data != false){
          if(data[0].scenario_id > 0){
            scenario = new Scenario()
            this.setState({voicecom: data[0].command})
            scenario.run(data[0].scenario_id)
            this.props.navigation.navigate("Dashboard")

          }
          else{
            this.clickOutput(data[0].output_id, data[0].output_value, data[0].type_id, data[0].type, 3)
          }
      }
      else{
          this.setState({ alertMod: true})
//          alert(this.props.t("voiceCommand:errorRunVoiceCommand"))
      }

    }
    )
    .catch(
        error => {
            this.setState({ alertMod: true})
//            alert(this.props.t("voiceCommand:errorRunVoiceCommand"));
        }
     )


  }

  async _startRecognition(e) {
	this.setState({
		recognized: '',
		started: '',
		results: [],
		voicecom: "",
	});

	const {t} = this.props;

	try {
	          await Voice.start(t("common:voiceLanguage"));
	} catch (e) {
	          console.error(e);
	}

	 setTimeout(() => {
//	    console.log("voice come: " + this.state.voicecom)
	    if(this.state.voicecom == ""){
	        this.setState({
	            alertMod: true,
	        })
	    }

	}, 10000);

}

  componentDidMount(){

    const { navigation} = this.props;
    const item = navigation.getParam('item', null);
    output = new Output;

    outputValue = ""

    if(item != null){
      showOut = false;
      if(item.output_id > 0){
          showOut = true
          selectedType = 0

          if(item.output_id <= output.OUTPUT_DIGITAL){
              outputValue = (item.output_value == 1) ?  true : false;
              checkOutput = outputValue;
              sliderOutput = 0
          }
          else{
              outputValue = item.output_value;
              checkOutput = false
              sliderOutput = outputValue
          }
      }
      else{
        selectedType = 1
      }

      this.refs.refRadioType.updateIsActiveIndex(selectedType);
      this.changeType(selectedType);

      this.setState({
        voiceCommandId: item.id,
        command: item.command,
        selectedOutput: item.output_id,
        selectedOutputTypeId: item.type_id,
        selectedOutputType: item.type,
        selectedScenario: item.scenario_id,
        selectedOutputValue: outputValue,
        mode: Vars.modeUpdate,
        viewOutputs: showOut,
        checkOutput: checkOutput,
        sliderOutput: sliderOutput,
      });

    }
    else{
      this.setState({
        voiceCommandId: 0,
        voiceCommandName: "",
        mode: Vars.modeInsert,
        selectedOutput: 0,
        selectedOutputTypeId: 0,
        selectedOutputType: 0,
        selectedScenario: 0,
        selectedOutputValue: 0,
      });

      this._startRecognition()
    }

  }

  //todo: move this function to output OutputPage
  //Redundant in Dashboard page
  clickOutput(outputId, outputValue, outputTypeId, type, retry){
                    try{
                                timeout = ""
                                timeoutRetry = (selectedConnection == 0) ? 500 :2500
                                let getResponse = 0
                                let getError = 0
                                params1 = new Array()

                                stopUpdate = 1;
                                inClickOutput = 1
                                if((type == output.OUTPUT_ANALOG_TYPE) || (type == output.OUTPUT_DIGITAL_TYPE)){
                                               params1[0] = outputId;
                                }
                                else{
                                               params1[0] = outputTypeId;
                                }

                                if(type == output.OUTPUT_ANALOG_TYPE) { // Analog / Slider
                                          params1[1] = outputValue;
                                 }
                                 else{ // Not Analog
                                          params1[1] = outputValue
                                 }

                                  params1[2] = type;

                                   if(inUpdateOutputs == 1){
                                            interruptUpdate = 1
                                   }

  	                         if(retry > 0){
  	                                        udpOut = new UDP(Commands.REQ_OUTPUT, Commands.FLAG_EDIT_VALUE, params1);
  	                                        udpOut.sendUdpPacket("", "", true).then(
  	                                                  dataOutUdp => {
  	                                                   getResponse = 1
  	                                                    if(timeout != ""){
  	                                                            clearTimeout(timeout)
  	                                                    }

                                                              if(dataOutUdp && dataOutUdp.length > 4){
                                                                      // console.log("update successfully ...."+outputValue)
                                                                      this.props.navigation.navigate("Dashboard")
                                                                      getError = 0
                                                                      stopUpdate = 0
                                                                }
                                                                else{
                                                                      // console.log("Error in get udp clickkkkkkkk: " + stopUpdate +"---")
                                                                      getError = 1
                                                                }

  	                                         }
  	                                     ).catch(error => {
  	                                                  getResponse = 1
  	                                                  getError = 1
  	                                                  // console.log("get clicked  output Error id: " + outputId + "-- retry: "+ retry +"---------error: "+error)
  	                                     })
  	                     }

  	                  	timeout = setTimeout(() => {
  	                  	                 if(((getResponse == 0) && (getError == 0)) || (getError == 1) ){
  	                  		                   if(retry > 0){
  	                  		                              this.clickOutput(outputId, outputValue, outputTypeId, type, retry-1)
  	                  		                   }
  	                  		                   else {
  	                                                            stopUpdate = 0
  	                  		                   }
  	                  	                 }
                                 }, timeoutRetry);
  //                               }
                         }
                         catch(error){
                                        stopUpdate = 0
                                        inClickOutput = 0
                                   // console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" +error)
                         }
     }

//  runVoiceCommand(voiceCommand){
//
//     params1 = new Array()
//     params1[0] = voiceCommand
//    ZagrosDB.buildQuery(Vars.querySelect, "VoiceCommand", "", "command=?" , params1, "", "", 1).then(
//        data => {
//        // console.log("data from db: " + data +"---" + data[0].scenario_id +"---" + data[0].command)
//          if(data.length > 0 && data != false){
//              if(data[0].scenario_id > 0){
//                scenario = new Scenario()
//                scenario.run(data[0].scenario_id)
//                this.props.navigation.navigate("Dashboard")
//
//              }
//              else{
//                this.clickOutput(data[0].output_id, data[0].output_value, data[0].type_id, data[0].type, 3)
//              }
//          }
//          else{
//              alert(this.props.t("voiceCommand:errorRunVoiceCommand"))
//          }
//
//        }
//    )
//    .catch(
//        error => {
//            alert(this.props.t("voiceCommand:errorRunVoiceCommand"));
//        }
//     )
//  }

  render() {
        const { t } = this.props;
        output = new Output()

        return (
          <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >

            <ScrollView>
              <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>

                <View style={commonStyles.containerView}>
                 <View style={commonStyles.voiceCommandView} >
                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                         <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{i18n.t('voiceCommand:voiceCommandFillCommand')}</Text>
                    </View>
                 </View>
                 <View style={commonStyles.mic}>

                      <FastImage
                        source={{
                          uri: Image.resolveAssetSource(require('../../assets/img/common-light-mic.gif')).uri,
                        }}
                        style={[{  width: 72, height: 72 }]}

                      />

                 </View>
                 <View style={commonStyles.line} />
                 <View style={commonStyles.flex1}>

	                  <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
	                      <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{this.state.voicecom}</Text>
	                  </View>
                  </View>

                </View>


            </LinearGradient>
             {(this.state.alertMod) ?  (
                                <View>
                                     <MyAlert modalVisible={this.state.alertMod}
                                       onClick2={() => {
                                           this.setState({ alertMod: false})
                                           this._startRecognition()
                                       }}
                                       onClick1={() => this.props.navigation.navigate("Dashboard")}
                                       title1={i18n.t('common:cancel')}
                                       title2={i18n.t('common:actions.ok')}
                                       title={this.props.t("voiceCommand:errorRunVoiceCommand")}   />
                              </View>
                              ) : (null) }
          </ScrollView>
        </KeyboardAvoidingView>
      );
}


}

export default translate(['VoiceCommandRun', 'common'], { wait: true })(VoiceCommandRun);
