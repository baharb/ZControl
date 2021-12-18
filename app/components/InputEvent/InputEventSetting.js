import React from 'react';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { Modal, KeyboardAvoidingView, ScrollView, FlatList, View, Text, TextInput, TouchableHighlight, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import { MyButton } from '../Common/MyButton';
import InputEvent from './lib/InputEvent';
import Output from '../Output/lib/Output';
import Input from '../Input/lib/Input';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import CheckBox from 'react-native-checkbox';
import CheckBox1 from 'react-native-check-box';
import RadioForm from 'react-native-simple-radio-button';
import Slider from '@react-native-community/slider';
import Thermometer from '../Thermometer/lib/Thermometer';
import {Picker} from '@react-native-community/picker';

export class InputEventSetting extends React.Component {

  //ie type
  IE_SCENARIO = 0;
  IE_OUTPUTS = 1;

  constructor(props) {
    super(props);

    output = new Output();
    checkedArray = new Array(output.OUTPUT_NUMBER);
    input = new Input()
    thermometer = new Thermometer()

    inputsArray = new Array(input.INPUT_MAX_NAUMBER + thermometer.THERMOMETER_MAX_NUMBER)

    this.state = {
      inputEvents: "",
      successName: true,
      modalOutputVisible: false,
      modalInputVisible: false,
      outputs: [],
      isChecked: false,
      checkedOutputs: [],
      checkedInput: "",
      mode: Vars.modeInsert,
      inputEventType: this.IE_SCENARIO,
      checkedInputValue: 0,
      viewScenarioAnalog: false,
      viewScenarioDigital: false,
      outputsView: false,
      viewOutputInput: false,
      inputEventName: "",
      inputsRadio: [],
      successInput: true,
      travel: false,
      travelView: false,
    }

    this.saveInputEvent = this.saveInputEvent.bind(this);
    this.getSelectedOutputs = this.getSelectedOutputs.bind(this);
    this.getSelectedInputs = this.getSelectedInputs.bind(this);
    this.getAllInputs = this.getAllInputs.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  setModalVisible(modalType, visible) {

    if (modalType == "output") {
      this.setState({
        modalOutputVisible: visible,
        outputsM: this.state.outputs.filter(item => item.flag !== 0)
      });
    }
    else {
      this.setState({
        modalInputVisible: visible,
        inputsM: (this.state.inputsRadio != "") ? this.state.inputsRadio.filter(item => item.status !== 0) : ""
      },
        () => {

          index = this.getIndexOfInput(this.state.checkedInput.value)
          this.refs.refRadioInputs.updateIsActiveIndex(index, this.state.checkedInput.value);
        })
    }

  }

  // Get all inputs from DB
  getAllInputs() {
    return new Promise((resolve, reject) => {
      input = new Input()
      input.getAllActiveInputsFromDB().then(
        dataInputs => {

          for (i = 0; i < dataInputs.length; i++) {
            dataInputs[i].label = dataInputs[i].title;
            dataInputs[i].title = dataInputs[i].title;
            dataInputs[i].val = 0;
            dataInputs[i].value = i;
            dataInputs[i].operand = 0;

          }

          this.setState({
            inputs: dataInputs,
            inputsRadio: dataInputs,
          }, () => {
            resolve(true)
          })

        }
      )
        .catch(
          error => {
            alert(this.props.t("input:errorGetAllInputs"));
            reject(this.props.t("input:errorGetAllInputs"))
            console.log("error in get inputs " + error)
          }
        )
    })

  }



  componentDidMount() {
    const { navigation, t } = this.props;
    checkedInput = new Object()
    checkedInput.operand = 2
    checkedInput.val = 0
    checkedInput.value = 0
    checkedInput.index = 0

    this.setState({
      checkedInput: checkedInput,
    })

    checkedOutputsArray = new Array();
    checkedInputsArray = new Array();

    output = new Output();
    input = new Input();

    // List of outputs for check
    for (i = 0; i < output.OUTPUT_NUMBER; i++) {
      checkedOutputsArray[i] = false;
    }

    item = navigation.getParam('item', null);

    this.getAllOutputs();
    this.getAllInputs().then((d) => {

      if (item != null) {
//        console.log("Itemmm: " + item.id + "--" + item.title + "--")
        this.setState({
          inputEventId: item.id,
          inputEventName: item.title,
          mode: Vars.modeUpdate,
          checkedOutputs: checkedOutputsArray,
        });

        this.getInputEvent(item.id, t);
        // this.getCurtainsOfInputEvent(item.id);
      }
      else {

        this.setState({
          inputEventId: 0,
          inputEventName: "",
          inputEventIcon: 0,
          checkShowHomepage: false,
          checkedOutputs: checkedOutputsArray,
          checkedInput: checkedInput,
          // checkedInputs: checkedInputsArray,
        });

        setTimeout(() => this.refs.titleTextInput.focus(), 150)

//        this.refs.titleTextInput.focus();
      }
    })



  }

  getInputId(type, type_id) {
    input = new Input()
    thermometer = new Thermometer()
    id = 0
    if (type == input.INPUT_DIGITAL_TYPE) {
      id = type_id
    }
    else if (type == thermometer.THERMOMETER_WIFI_TYPE || type == thermometer.THERMOMETER_RS485_TYPE) {
      i = (type == thermometer.THERMOMETER_WIFI_TYPE) ? 0 : thermometer.THERMOMETER_WIFI
      id = input.INPUT_MAX_NAUMBER + type_id + i - 1
    }
    else { // Touch Switches Inputs
      this.state.inputs.map(item => {
        if (item.type == type && item.type_id == type_id) {
          id = item.id - 1
        }
      })
    }

    return id
  }

  getOutputId(type, type_id) {
    output = new Output()
    id = 0
    if (type == output.OUTPUT_DIGITAL_TYPE || type == output.OUTPUT_ANALOG_TYPE) {
      id = type_id
    }
    else {
      this.state.outputs.map(item => {
        if (item.type == type && item.type_id == type_id) {
          id = item.id
        }
      })
    }

    return id
  }

  getIndexOfInput(mainInputID) {
    index = 0
    for (i = 0; i < this.state.inputsM.length; i++) {
      if (this.state.inputsM[i].value == mainInputID) {
        index = i;
      }
    }
    return index;
  }

  getInputEvent(inputEventId, t, retry) {
    if (!retry && retry != 0) { retry = 2 }
    getResponse = 0
    getError = 0

    inputIns = new Input()
    thermometer = new Thermometer()
    inputEvent = new InputEvent();

    inputEvent.getInputEvent(inputEventId).then(
      data => {

        if (data.length > 0) {
          getResponse = 1
          if (timeout != "") { clearTimeout(timeout) }

          // Set type Radio button
          this.refs.refRadioType.updateIsActiveIndex(data[1]);

          outputView = false;
          if (data[1] == 1) { // Outputs type
            outputView = true;
          }

          checkedInput = new Object;
          // get input id from type and type id
          id = this.getInputId(data[5], data[2])

          checkedInput.type_id = data[2];
          checkedInput.val = data[3];
          checkedInput.operand = data[4];
          checkedInput.type = data[5];
          checkedInput.title = this.state.inputs[id].title;
          checkedInput.label = this.state.inputs[id].title;
          checkedInput.value = id
          checkedInput.id = id

          checkedInputValue = 0;
          if (checkedInput.type == inputIns.INPUT_ANALOG_TYPE ||
            checkedInput.type == thermometer.THERMOMETER_WIFI_TYPE ||
            checkedInput.type == thermometer.THERMOMETER_RS485_TYPE) {
            checkedInputValue = checkedInput.val;

            if (this.refs.refRadioThemp != null) {
              this.refs.refRadioThemp.updateIsActiveIndex(checkedInput.operand)
            }
          }

          checkedOutputs = this.state.checkedOutputs;
          allOutputs = this.state.outputs;

          lastIndex = (data[6] * 3) + 6;
          travel = false

          if (data.length > 6) {
            for (i = 7; i < lastIndex; ++i) {
              // id = this.getOutputId()
              operand = (data[i + 2] >> 4) & 0X03;
              type = data[i + 2] & 0X0F;

              if(type == 12){ // Travel
                    travel = true
              }
              else{ // Output
                id = this.getOutputId(type, data[i])

                checkedOutputs[id - 1] = true;
                allOutputs[id - 1].value = data[i + 1];
                allOutputs[id - 1].operand = operand;
                allOutputs[id - 1].type = type;
              }

              i += 2;
            }
          }

          
//	        travel = (data[lastIndex] == 1) ? true : false;

          Promise.all(allOutputs).then(() => {

            this.setState({
              inputEventType: data[1],
              checkedInput: checkedInput,
              checkedOutputs: checkedOutputs,
              outputs: allOutputs,
              checkedInputValue: checkedInputValue,
              outputsView: outputView,
              travel: travel,
            },
              () => {
                // alert(allOutputs[7].value + "--" + allOutputs[8].value)
                this.getSelectedInputs(t);
                this.getSelectedOutputs(t);

              });
          });


        }
        else {
          console.log("error in get input event: " + error + "---retry: " + retry)
          getError = 1

        }

      }
    )
      .catch(
        error => {
          console.log("error in get input event: " + error + "---retry: " + retry)
          getError = 1

        }
      );

    timeout = setTimeout(() => {

      if ((getResponse == 0 && getError == 0) || (getError == 1)) {
        if (retry > 0) {
          this.getInputEvent(inputEventId, t, retry - 1)
        }
        else {
          alert(this.props.t("inputEvent:errorGetInputEvent"))
        }
      }
    }, 2000);

  }

  saveInputEvent(retry) {
    successName = true
    successInput = true
    if ((retry != 0) && !retry) { retry = 2 }
    let getResponse = 0
    let getError = 0
    timeout = ""
    // alert(this.state.checkedInput)
    if (this.state.inputEventName.trim().length == 0 || this.state.checkedInput == "") {
      if (this.state.inputEventName.trim().length == 0) {
        successName = false
        setTimeout(() => this.refs.titleTextInput.focus(), 150)
      }

      if (this.state.checkedInput == "") {
        successInput = false
      }

      this.setState({
        successName: successName,
        successInput: successInput
      })
    }
    else {

      InputEventIns = new Object();
      InputEventIns.title = this.state.inputEventName;
      InputEventIns.id = this.state.inputEventId;
      InputEventIns.inputEventType = this.state.inputEventType;
      InputEventIns.travel = (this.state.travel == true) ? 1 : 0

      inputEvent = new InputEvent();

//      console.log("In save input E: id:" + this.state.checkedInput.id + "--- value: " + this.state.checkedInput.value + "--- operand: " + this.state.checkedInput.operand)
      inputEvent.saveInputEvent(InputEventIns, this.state.mode, this.state.checkedInput, this.state.checkedOutputs, this.state.outputs)
        .then(
          data => {
            if (data == true) {
              // alert("truuuuu");
              if (timeout != "") { clearTimeout(timeout) }
              getResponse = 1
              this.props.navigation.navigate('InputEventPage');
            }
            else {
              getError = 1
              //                        alert(this.props.t("inputEvent:errorSaveInputEvent"))
            }
          }
        )
        .catch(
          error => {
            getError = 1
            //                    alert(this.props.t("inputEvent:errorSaveInputEvent"))
            console.log("error in save input event " + error)
          }
        );

      timeout = setTimeout(() => {
        console.log("Error in save IE Timeout: " + getError + "---" + getResponse + "---" + retry)
        if (retry == 0) {
          alert(this.props.t("inputEvent:errorSaveInputEvent"))
        }
        else {
          if (getResponse == 0 || getError == 1) {

            this.saveInputEvent(retry - 1)
          }
        }
      }, 2000);

    }
  }

  // Get all outputs from DB
  getAllOutputs() {
    o = new Output();
    ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
      dataOutput => {
         for(ii=0; ii < dataOutput.length; ii++){
             dataOutput[ii].value = 2;
             dataOutput[ii].operand = 0
         }

        this.setState({
          outputs: dataOutput
        })

        // alert(this.state.outputs[0].id + "---" + this.state.outputs[0].name + "---" + this.state.outputs[0].value)
      }
    )
      .catch(
        error => {
          alert(this.props.t("output:errorGetOutputDataFromDB"));
        }
      )
  }

  changeOutputType(value, index) {
    outputsArray = new Array();
    outputsArray = this.state.outputs;
    outputsArray[index].value = value;
    if (outputsArray[index].type != 1) { // digital /wifi
      outputsArray[index].operand = value;
    }

    this.setState({
      outputs: outputsArray,
    })
  }

  // Show selected outputs by user
  getSelectedOutputs(t) {
    selectedOutputs = new Array();
    output = new Output()
    // outputs = new Array();
    outputs = this.state.outputs;
    checked = this.state.checkedOutputs;

    var radioOutputs = [
      { label: t('inputEvent:match'), value: 0 },
      { label: t('inputEvent:reverse'), value: 1 },
      { label: t('inputEvent:toggle'), value: 2 }
    ];

    i = 0;
    outputsView = false;
    if (this.state.outputsView) {
      outputsView = true
    }

    inputIns = new Input()
    outputs.forEach((item) => {
      //console.log("itemmmm: i: " + i +"---"+checked[i]+"---"+item.name+"---"+((i+1) == item.id))
      if ((checked[i] == true) && ((i + 1) == item.id)) {
        //                 console.log("itemmmmmmmmmmmmmm: " +i + "---"+checked[i]+ "-----"+item.type)
        outputsView = true;

        if (item.type == inputIns.INPUT_DIGITAL_TYPE ||
          item.type == inputIns.INPUT_WIFI_WITH_RELAY_TYPE ||
          item.type == inputIns.INPUT_WIFI_WITHOUT_RELAY_TYPE ||
          item.type == inputIns.INPUT_RS485_WITH_RELAY_TYPE ||
          item.type == inputIns.INPUT_RS485_WITHOUT_RELAY_TYPE ||
          item.type == output.OUTPUT_WIFI_RELAY_TYPE ||
          item.type == output.OUTPUT_RS485_RELAY_TYPE) {   // Output Digital/Wifi
          selectedOutputs.push(
            <View key={item.id} style={commonStyles.listRadioOutputsScnario(i18n.t('common:dir'))}>

              <Text style={commonStyles.touchTextIE(i18n.t("common:dir"))}>{item.name}</Text>
              <RadioForm
                radio_props={radioOutputs}
                labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                initial={item.value}
                formHorizontal={true}
                onPress={(value) => { this.changeOutputType(value, (item.id) - 1) }}
              />
              <View style={commonStyles.line}></View>
            </View>
          );

        }
        else if (item.type == inputIns.INPUT_ANALOG_TYPE ||
          item.type == thermometer.THERMOMETER_WIFI_TYPE ||
          item.type == thermometer.THERMOMETER_RS485_TYPE) { // Output Analog
          selectedOutputs.push(
            // <View key={i}  style={commonStyles.listRow} >
            <View key={item.id} style={commonStyles.listRadioOutputsScnario(i18n.t('common:dir'))}>
              <Text style={commonStyles.touchTextIE(i18n.t("common:dir"))}>{item.name}</Text>
              <RadioForm
                radio_props={radioOutputs}
                initial={item.operand}
                formHorizontal={true}
                labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                onPress={(value) => {
                  outputsArray = this.state.outputs;
                  outputsArray[(item.id) - 1].operand = value;
                  this.setState({
                    outputs: outputsArray,
                  })
                }}
              />
              <Slider
                style={commonStyles.sliderIE}
                minimumValue={0}
                maximumValue={100}
                step={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                onValueChange={
                  value => this.changeOutputType(value, (item.id) - 1)
                }
                value={item.value}
              />

            </View>
            // </View>
          );
        }
      }

      i++;

    });

    this.setState({
      selectedOutputsArray: selectedOutputs,
      outputsView: outputsView,
    })
  }

  //
  getSelectedInputs(t) {
    // this.refs.refRadioInputs.updateIsActiveIndex(this.state.checkedInput);

    //        selectedInputs ="";
    inputs = new Array();
    inputs = this.state.inputs;
    checkedInputs = this.state.checkedInputs;

    i = 0;
    inputIns = new Input()

    if (checkedInputs != "") {
      if (this.state.inputEventType == this.IE_SCENARIO) { // Scenario type selected
        if (this.state.checkedInput.type == inputIns.INPUT_DIGITAL_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_WIFI_WITH_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_WIFI_WITHOUT_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_RS485_WITH_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_RS485_WITHOUT_RELAY_TYPE) {

          this.setState({
            viewScenarioDigital: true,
            viewScenarioAnalog: false,
            viewOutputInput: false,
          }, () => {
            // For Scenario type, select On, Off, Toggle
            if (this.refs.refRadioInput != null) {
              this.refs.refRadioInput.updateIsActiveIndex(this.state.checkedInput.operand);
            }
          })



        }
        else { // Input analog // THERMOMETER
          this.setState({
            viewScenarioDigital: false,
            viewScenarioAnalog: true,
            viewOutputInput: false,
          })

          if (this.refs.refRadioThemp != null) {
            this.refs.refRadioThemp.updateIsActiveIndex(this.state.checkedInput.operand);
          }

        }
      }
      else { // Outputs type selected
        this.setState({
          viewScenarioDigital: false,
          viewScenarioAnalog: false,
          viewOutputInput: true,
        })
      }

      //            this.setState({
      //                selectedInputsArray : selectedInputs,
      //            })
    }
  }

  // Change type of Scenario
  changeType(value, t) {
    inputIns = new Input()
    thermometer = new Thermometer()

    if (value == this.IE_SCENARIO) { // Scenario type selected
      let digital = false;
      let analog = false;

      if (this.state.checkedInput &&
        (this.state.checkedInput.type == inputIns.INPUT_DIGITAL_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_WIFI_WITH_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_WIFI_WITHOUT_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_RS485_WITH_RELAY_TYPE ||
          this.state.checkedInput.type == inputIns.INPUT_RS485_WITHOUT_RELAY_TYPE)) {
        digital = true;
        analog = false;
      }

      if (this.state.checkedInput &&
        (this.state.checkedInput.type == inputIns.INPUT_ANALOG_TYPE ||
          this.state.checkedInput.type == thermometer.THERMOMETER_WIFI_TYPE ||
          this.state.checkedInput.type == thermometer.THERMOMETER_RS485_TYPE)) {
        digital = false;
        analog = true;
      }

      this.setState({
        outputsView: false,
        viewScenarioDigital: digital,
        viewScenarioAnalog: analog,
        viewOutputInput: false,
        inputEventType: value,
        travelView: false
      })
    }
    else { // Outputs type selected
      this.setState({
        outputsView: true,
        viewScenarioAnalog: false,
        viewScenarioDigital: false,
        viewOutputInput: true,
        inputEventType: value,
        travelView: true,
      })
    }
  }


  render() {
    const { t } = this.props;

    var radioType = [
      { label: t('inputEvent:iEscenario'), value: 0 },
      { label: t('inputEvent:iEoutputs'), value: 1 }
    ];

    var radioThemp = [
      { label: t('inputEvent:greater'), value: 0 },
      { label: t('inputEvent:equal'), value: 1 },
      { label: t('inputEvent:less'), value: 2 }
    ];

    var radioInputs = [
      { label: t('inputEvent:off'), value: 0 },
      { label: t('inputEvent:on'), value: 1 },
      { label: t('inputEvent:toggle'), value: 2 }
    ];

    renderItem = ({ item }) => (
      <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
        <Image source={ImageVars.outputIconArray[item.icon]} style={commonStyles.imageListSelection} />
        <CheckBox style={commonStyles.flex8}
          onChange={(checked) => {

            checkedArray = this.state.checkedOutputs;
            checkedArray[(item.id) - 1] = !checkedArray[(item.id) - 1];
            this.setState({ checkedOutputs: checkedArray });
          }
          }
          dir={i18n.t('common:dir')}
          labelColor={'#441458'}
          iconColor={'#441458'}
          checked={this.state.checkedOutputs[(item.id) - 1]}
          label={item.name}
        />
        <View style={commonStyles.flex1}></View>


      </View>
    );
    inputIns = new Input()

    return (
      <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" style={commonStyles.flex1} enabled >
        <ScrollView>
          <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
            <View style={commonStyles.containerView}>
              <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                  ref="titleTextInput"
                  onChangeText={(txt) => {
                    if (txt.trim().length == 0) {
                      this.setState({
                        inputEventName: txt,
                        successName: false
                      })
                    }
                    else {
                      this.setState({
                        inputEventName: txt,
                        successName: true
                      })
                    }
                  }}
                  value={this.state.inputEventName}
                />
              </View>

              {!this.state.successName ? (
                <View style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                  <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                    {t('inputEvent:inputEventFillName')}
                  </Text>
                </View>
              ) : (null)}

              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('inputEvent:inputEventType')}</Text>
              </View>

              <View style={commonStyles.listRadio(i18n.t('common:dir'))} >
                <RadioForm
                  ref="refRadioType"
                  formHorizontal={true}
                  labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                  radio_props={radioType}
                  initial={0}
                  onPress={(value) => {
//                    if((value != this.IE_OUTPUTS) && (value != this.IE_SCENARIO)){
//                        value = this.IE_SCENARIO
//                    }
                    this.changeType(value, t)
                     }}
                />
              </View>

              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('inputEvent:input')}</Text>
                <TouchableHighlight style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                  onPress={() => {
                    this.setModalVisible("input", true);
                  }}>
                  <Text style={commonStyles.addIconRow}>+</Text>
                </TouchableHighlight>
              </View>

              {this.state.viewScenarioDigital ? (
                <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))}>
                  <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.checkedInput.title}</Text>
                  <View style={commonStyles.viewRadio(i18n.t('common:dir'))}>
                    <RadioForm
                      formHorizontal={true}
                      ref="refRadioInput"
                      labelColor={'#b08dbf'}
                      labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                      radio_props={radioInputs}
                      initial={0}
                      onPress={(value, index) => {
                        checked = this.state.checkedInput;
                        checked.operand = radioInputs[index].value;

                        this.setState({
                          checkedInput: checked,
                        })
                      }}
                    />
                  </View>
                </View>
              ) : (null)}

              {((this.state.checkedInput != "") && (this.state.viewScenarioAnalog ||
                (this.state.checkedInput.type == inputIns.INPUT_ANALOG_TYPE ||
                  this.state.checkedInput.type == thermometer.THERMOMETER_WIFI_TYPE ||
                  this.state.checkedInput.type == thermometer.THERMOMETER_RS485_TYPE))) ?
                (
                  <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))}>
                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.checkedInput.label}</Text>

                    <View style={commonStyles.viewRadio(i18n.t('common:dir'))}>
                      <Slider
                        style={commonStyles.sliderIE}
                        minimumValue={0}
                        maximumValue={40}
                        step={1}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                        onValueChange={
                          value => {
                            checked = this.state.checkedInput
                            checked.val = value

                            this.setState((state, props) => ({
                              checkedInputValue: value,
                              checkedInput: checked
                            })

                            )
                          }}
                        value={this.state.checkedInputValue}
                      />
                    </View>

                    <View style={commonStyles.viewRadio(i18n.t('common:dir'))}>
                      <Text style={commonStyles.radioStyle(i18n.t("common:dir"))}>
                        {this.state.checkedInputValue}
                      </Text>
                    </View>
                    <View style={commonStyles.line}></View>
                    <View style={commonStyles.viewRadio(i18n.t('common:dir'))}>
                      <RadioForm
                        formHorizontal={true}
                        ref="refRadioThemp"
                        labelColor={'#b08dbf'}
                        labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                        radio_props={radioThemp}
                        initial={this.state.checkedInput.operand}
                        onPress={(value) => {

                          checked = this.state.checkedInput;
                          checked.operand = value;
                          this.setState({
                            checkedInput: checked,
                          })

                        }}
                      />
                    </View>

                  </View>
                ) : (null)}

              {(this.state.viewOutputInput &&
                (this.state.checkedInput.type != thermometer.THERMOMETER_WIFI_TYPE &&
                  this.state.checkedInput.type != thermometer.THERMOMETER_RS485_TYPE)) ?
                (
                  <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))}>
                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.state.checkedInput.title}</Text>
                  </View>
                ) : (null)}

              {!this.state.successInput ? (
                <View style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                  <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                    {t('inputEvent:inputEventSelectInput')}
                  </Text>
                </View>
              ) : (null)}

              {this.state.outputsView ? (
                <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                  <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('output:output')}</Text>
                    <TouchableHighlight style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                      onPress={() => {
                        this.setModalVisible("output", true);
                      }}>
                      <Text style={commonStyles.addIconRow}>+</Text>
                    </TouchableHighlight>
                  </View>
                  <View style={commonStyles.listViewTouchViewData(i18n.t('common:dir'))} >
                    {this.state.selectedOutputsArray}
                  </View>
                </View>
              ) : (null)}

                {this.state.travelView ? (
                <View style={{ flex: 1 }}>
                  <CheckBox1
                     onClick={(checked) => {
                      this.setState({ travel: !this.state.travel });
                    }}
                    leftTextStyle={commonStyles.checkBoxIE(i18n.t("common:dir"))}
                    rightTextStyle={commonStyles.checkBoxIE(i18n.t("common:dir"))}
                    checkBoxColor={"#fff"}
                    isChecked={this.state.travel}
                    leftText={(i18n.t("common:dir") == 'right') ? i18n.t("inputEvent:travel") : ""}
                    rightText={(i18n.t("common:dir") == 'left') ? i18n.t("inputEvent:travel") : ""}
                  />                  
                </View>
                ) : null }

            </View>
            <View style={commonStyles.viewOkButton} >
              <MyButton title={t('common:actions.ok')}
                dir={t("common:dir")}
                onPress={() => this.saveInputEvent()}>
              </MyButton>
            </View>

            <View>
              <Modal
                style={commonStyles.modalStyle}
                animationType="slide"
                transparent={false}
                visible={this.state.modalOutputVisible}
                presentationStyle='pageSheet'
                onRequestClose={() => {
                  this.setState({ modalOutputVisible: false })
                }}>
                <View style={commonStyles.modalTitle}>
                  <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('output:selectOutput')} </Text>
                </View>
                <View style={commonStyles.modalList}>
                  <FlatList
                    extraData={this.state.outputsM}
                    keyExtractor={(item, index) => String(index)}
                    data={this.state.outputsM}
                    renderItem={renderItem}
                  />
                </View>
                <View style={commonStyles.modalButton} >
                  <MyButton title={t('output:selectOutput')} dir={t('common:dir')}
                    onPress={() => {
                      this.setState({ modalOutputVisible: false })
                      this.getSelectedOutputs(t)
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
                visible={this.state.modalInputVisible}
                presentationStyle='pageSheet'
                onRequestClose={() => {
                  this.setState({ modalInputVisible: false })
                }}>
                <View style={commonStyles.modalTitle}>
                  <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('input:selectInput')} </Text>
                </View>
                <View style={commonStyles.modalList}>
                  <ScrollView>
                    <RadioForm
                      ref="refRadioInputs"
                      radio_props={this.state.inputsM}
                      labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                      initial={this.state.checkedInput.value}
                      onPress={(value, index) => {

                        if (value == null) {
                          value = this.state.inputsM[0].value //this.state.checkedInput.value
                        }
                        else {
                          value = this.state.inputsM[index].value
                        }

                        if (index == null) {
                          checked = this.state.checkedInput
                        }
                        else {
                          checked = this.state.inputsRadio[this.state.inputsM[index].value];
                        }

                        checked.operand = 2
                        checked.val = 0;
                        checked.value = value

                        this.setState({
                          checkedInput: checked,
                        })
                      }}
                    />
                  </ScrollView>
                </View>
                <View style={commonStyles.modalButton} >
                  <MyButton title={t('input:selectInput')} dir={t("common:dir")}
                    onPress={() => {
                      this.setState({ modalInputVisible: false })
                      this.getSelectedInputs(t)
                    }}>
                  </MyButton>
                </View>
              </Modal>

            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default translate(['InputEventSetting', 'common'], { wait: true })(InputEventSetting);
