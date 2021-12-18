import React from 'react';
import { translate} from 'react-i18next';
import { Switch, KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import VoiceCommand from './lib/VoiceCommand';
import Output from '../Output/lib/Output';
import Scenario from '../Scenario/lib/Scenario';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import RadioForm from 'react-native-simple-radio-button';
import Voice from 'react-native-voice';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-community/picker';
import i18n from 'i18next';

export class VoiceCommandSetting extends React.Component {
  //    output1: Output;
  constructor(props){
    super(props);

//    this.outputs = []
    this.state ={
      voiceCommands : "",
      outputs: "",
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
      successCommand: true,
      successOutScen: true,
      sliderOutput: 0,
      checkOutput: false,
    }

    this.saveVoiceCommand = this.saveVoiceCommand.bind(this);
    this.getAllOutputs = this.getAllOutputs.bind(this)
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
  }

  onOutputChange(outputId) {
    this.setState({
      selectedOutput: outputId,
    });
  }

  // Get all outputs from DB
  getAllOutputs(){
      // o = new Output();
      ZagrosDB.buildQuery(Vars.querySelect, "Output", "id, name", "flag = 1", "", "", "", 1).then(
          data => {
            // console.log("get all data from outputs:   " + data.length + "----" + data[0].id)
            //   for(i=0; i<data.length; i++){
            //     // console.log("outputs: " + i + "-" + data[i].id + "-"+data[i].title)
            //   }
              this.setState({
                  outputs: data
              })
//              this.outputs = this.state.outputs;
              // console.log("dddd"+this.state.outputs.length)
          }
      )
      .catch(
          error => {
            // console.log("error in get outputs: " + error)
              alert(this.props.t("output:errorGetOutputDataFromDB"));
          }
       )
  }

  // Get all scenarios from DB
  getAllScenarios(){
      scenario = new Scenario();
      ZagrosDB.buildQuery(Vars.querySelect, "Scenario", "id, title", "status <> 0", "", "", "", 1).then(
          dataS => {
              this.setState({
                  scenarios: dataS
              })
          }
      )
      .catch(
          error => {
              alert(this.props.t("scenario:errorGetAllScenarios"));
          }
       )
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
        command: e.value[0],
      });
    }

  async _startRecognition(e) {
      this.setState({
        recognized: '',
        started: '',
        results: [],
      });
      const { t} = this.props;
      try {
         // console.log("voice start")
        await Voice.start(t("common:voiceLanguage"));
      } catch (e) {
        console.error(e);
        // console.log('error in voice ' + e)
      }
    }

  componentDidMount(){

    const { navigation} = this.props;
    const item = navigation.getParam('item', null);
   
    output = new Output;

    this.getAllOutputs()
    this.getAllScenarios()

        outputValue = ""
        checkOutput = false;
        sliderOutput = 0


        if(item != null){
          showOut = false;
          if(item.output_id > 0){
              showOut = true
              selectedType = 0

              if(item.output_id <= (output.OUTPUT_DIGITAL) || item.output_id > (output.OUTPUT_ANALOG + output.OUTPUT_DIGITAL)){
                  outputValue = (item.output_value == 1) ?  true : false;
                  checkOutput = outputValue;
              }
              else{
                  outputValue = item.output_value;
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
            selectedScenario: 0,
            selectedOutputValue: 0,
          });
        }
    // })

  }


  saveVoiceCommand(){
      if(this.state.command.trim().length == 0){
          this.setState({
              successCommand: false,
          })
      }
      else{
          if(this.state.selectedScenario == 0 && this.state.selectedOutput == 0){
              this.setState({
                  successOutScen: false,
              })
          }
          else{
              output = new Output();

              VoiceCommandIns = new Object();
              VoiceCommandIns.id = this.state.voiceCommandId;
              VoiceCommandIns.command = this.state.command;
              VoiceCommandIns.scenario_id = this.state.selectedScenario;
              VoiceCommandIns.output_id = this.state.selectedOutput;

              if(this.state.selectedOutput > 0){
                if(this.state.selectedOutput <= (output.OUTPUT_DIGITAL + output.OUTPUT_ANALOG )){
                    VoiceCommandIns.output_value = (this.state.checkOutput == true) ? 1 : 0;
                }
                else{
                    VoiceCommandIns.output_value = this.state.sliderOutput;
                }
              }
              else{
                  VoiceCommandIns.output_value = 0;
              }

              voiceCommand = new VoiceCommand();

              voiceCommand.saveVoiceCommandInDB(VoiceCommandIns, this.state.mode)
                .then(
                    data => {
                        if(data == true){
                            this.props.navigation.navigate('VoiceCommandPage');
                        }
                        else{
                            alert(this.props.t("voiceCommand:errorSaveVoiceCommand"))
                        }
                    }
                )
                .catch(
                    error => {
                        alert(this.props.t("voiceCommand:errorSaveVoiceCommand"))
                    }
                );
          }
      }
  }


  // Change type of Scenario
  changeType(value){
    try{
    if(value == 0){ // output type selected
        this.setState({
          viewOutputs: true,
          selectedScenario: 0,
          selectedOutputValue: 0,
          selectedOutput: 0,
          voiceCommandType: value,
        })
    }
    else{ // scenario type selected
      this.setState({
        viewOutputs: false,
        selectedOutput: 0,
        selectedOutputValue: 0,
        voiceCommandType: value,
      })
    }
  }
  catch(error){ // console.log("errrrrrrrrrrrrrrrrror   " +error)
  }
  }

  outputValueChange(val){
    outputs = this.state.outputs;
    showErrorOut = true

    if(this.state.successOutScen == false){
       if(val != 0){
         showErrorOut = true
       }
       else{
         showErrorOut = false
       }
    }

    this.setState({
      selectedOutput: val,
      successOutScen: showErrorOut,
    });
  }

  render() {
        const { t } = this.props;
        output = new Output()

        var radioType = [
          {label: t('output:output'), value: 0 },
          {label: t('scenario:scenario'), value: 1 }
        ];

        outputsPicker = new Array()
        // console.log(this.state.outputs.length + "--- " + this.state.outputs)
        
            outputsPicker.push(<Picker.Item label={t('output:selectOutput')} value={0}/>)
             if(this.state.outputs != ""){
            this.state.outputs.map((item) =>{
//              console.log("itemmmm: " +item.id)
              outputsPicker.push(
                  <Picker.Item label={item.name} value={item.id} key={item.id}/>
              );
            })
         }

        scenariosPicker = new Array()
        scenariosPicker.push(<Picker.Item label={t('scenario:selectScenario')} value={0}/>)
        if(this.state.scenarios.length > 0){
            this.state.scenarios.map((item) =>{
                scenariosPicker.push(
                    <Picker.Item label={item.title} value={item.id} key={item.id}/>
                );
            })
        }

        return (
          <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>
              <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>

                <View style={commonStyles.containerView}>

                  <View style={commonStyles.voiceCommandView}>
                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.command}</Text>
                  </View>

                  <View style={commonStyles.voiceCommandView} >
                    <TouchableOpacity  onPress={() => { this._startRecognition() }}
                        style={commonStyles.voiceCommandMic}>
                      <Icon 
                       size={50}
                       color={'#fff'}
                       name={'mic'}                        
                       />

                       </TouchableOpacity>
                  </View>


                  <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successCommand ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('voiceCommand:voiceCommandFillCommand')}
                            </Text>
                        ) : (null)}
                  </View>

                  <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('voiceCommand:voiceCommandType')}</Text>
                  </View>

                  <View style={commonStyles.listRadio(i18n.t('common:dir'))} >
                      <RadioForm
                      ref="refRadioType"
                      formHorizontal={true}
                      labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                      radio_props={radioType}
                      initial={0}
                      onPress={(value) => {this.changeType(value)}}
                      />
                  </View>
		<View style={commonStyles.line} ></View>
                  <View >

                    {this.state.viewOutputs ?  (
                    <View  style={commonStyles.voiceCommandViewOutputs(i18n.t('common:dir'))}>
	                       <View style={commonStyles.voiceCommandPickerView(i18n.t('common:dir'))}>
		                        <Picker
		                            selectedValue={this.state.selectedOutput}
		                            style={commonStyles.voiceCommandPicker(i18n.t('common:dir'))}
		                            onValueChange={(itemValue, itemIndex) =>
		                              {
		                                this.outputValueChange(itemValue)
		                              }
		                            }>
		                            {outputsPicker}
		                        </Picker>
	                        </View>

	                        { (((this.state.selectedOutput <= Output.OUTPUT_DIGITAL)  || (this.state.selectedOutput > (Output.OUTPUT_DIGITAL + Output.OUTPUT_ANALOG))) && this.state.selectedOutput > 0) ? (
                                   <View style={commonStyles.voiceCommandSwitch(i18n.t("common:dir"))}>
		                            <Switch
					trackColor={{ false: "#767577", true: "#d094ea" }}
		                              thumbColor={this.state.checkOutput ? "#ff2a62" : "#f4f3f4"}
		                              onChange={()=>{
		                                var c = this.state.checkOutput;
		                                this.setState({
		                                    checkOutput:!c
		                                })
		                              }
		                            }
		                            value={this.state.checkOutput} />
	                        </View>
	                        ) : (null) }

	                        { ((this.state.selectedOutput > Output.OUTPUT_DIGITAL) && (this.state.selectedOutput <=  Output.OUTPUT_ANALOG + Output.OUTPUT_DIGITAL)) ? (
                                   <View style={commonStyles.flex1}>
		                          <Slider
		                              style={commonStyles.sliderIE}
		                              minimumValue={0}
		                              maximumValue={100}
		                              step={1}
		                              minimumTrackTintColor="#FFFFFF"
		                              maximumTrackTintColor="#000000"
		                              onValueChange={ value => this.setState({sliderOutput: value}) }
		                              value={this.state.sliderOutput}
		                          />
                                    </View>
                                    ) : (null) }
                    </View>

                    ) : (null) }

		{ !this.state.viewOutputs ? (
                    <View style={commonStyles.voiceCommandViewOutputs(i18n.t('common:dir')) }>
	                      <View style={commonStyles.voiceCommandPickerView(i18n.t('common:dir'))}>
		                        <Picker
		                        selectedValue={this.state.selectedScenario}
		                        style={commonStyles.voiceCommandPicker(i18n.t('common:dir'))}
		                        onValueChange={(itemValue, itemIndex) =>
		                          {
		                              showErrorOut = true

		                              if(this.state.successOutScen == false){
		                                 if(itemValue != 0){
		                                   showErrorOut = true
		                                 }
		                                 else{
		                                   showErrorOut = false
		                                 }
		                              }

		                              this.setState({
		                                selectedScenario: itemValue,
		                                successOutScen: showErrorOut,
		                              });
		                          }
		                        }>
		                        {scenariosPicker}
		                        </Picker>
	                        </View>
                    </View>
                    ) : (null) }

                  </View>

                  <View style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successOutScen ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('voiceCommand:voiceCommandSelectOutScen')}
                            </Text>
                        ) : (null)}
                  </View>

                </View>

                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                  onPress={() => this.saveVoiceCommand() }>
                  </MyButton>
                </View>

            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      );
}


}

export default translate(['VoiceCommandSetting', 'common'], { wait: true })(VoiceCommandSetting);
