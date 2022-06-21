import React from 'react';
import i18n from 'i18next';
import { translate} from 'react-i18next';
import { TouchableOpacity, KeyboardAvoidingView, ScrollView, Image, View, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Output from './lib/Output';
import ImageVars from '../Common/imageVars';
import {MyAlert} from '../Common/MyAlert';
import {Picker} from '@react-native-community/picker';
import Spinner from 'react-native-loading-spinner-overlay';

export class OutputSetting extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            outputs : "",
            successName: true,
            spinner: true,
            alertMod: false,
        }

        this.saveOutput = this.saveOutput.bind(this);

    }


    componentDidMount(){
        const { navigation } = this.props;
        
        const item = navigation.getParam('item', null);
//console.log("Get output " +item.name+"---H: "+item.hour + "--- M: "+item.minute)
        this.setState({
            outputId: item.id,
            outputName: item.name,
            outputIcon: item.icon,
            outputH: item.hour,
            outputM: item.minute,
            outputS: item.second,
            outputType: item.type,
            outputTypeId: item.type_id,
            spinner: false,
        });


    }


    /// Update Output
    saveOutput(retry){
        const {t} = this.props;
        if(!retry && (retry != 0)){ retry = 5 }
        getResponse = 0
        getError = 0

//        console.log(this.state.outputName +": -- ID: "+ this.state.outputId + "--- Type:" + this.state.outputType
//        +"---TypeId: " + this.state.outputTypeId + "-- H: "+this.state.outputH + "-- M:"+this.state.outputM)

        if(this.state.successName){
          outputIns = new Object();
          outputIns.id = this.state.outputId;
          outputIns.name = this.state.outputName;
          outputIns.icon = this.state.outputIcon;
          outputIns.hour = this.state.outputH;
          outputIns.minute = this.state.outputM;
          outputIns.second = this.state.outputS;
          outputIns.type = this.state.outputType;
          outputIns.type_id = this.state.outputTypeId;

          output = new Output();
          output.updateOutput(outputIns).then(
              data => {
//                  console.log("update one output "+data+"----"+this.state.spinner)
                  if(data == true){
                      getResponse = 1
                      if(timeout != ""){ clearTimeout(timeout) }
                      this.props.navigation.navigate('OutputPage');
                      this.setState({
                             spinner: false,
                      })
                  }
                  else{
                                     getError = 1
//                                    console.log(error)
                                     if(retry == 0){
                                             this.setState({
                                                       spinner: false,
                                                       alertMod: true,
                                                       titleModal: t('output:errorSaveOutput'),
                                              })
                                     }
                                     else{
                                            this.saveOutput(retry-1)
                                     }
                  }
              }
          )
          .catch(
              error => {
                   getError = 1
                  //todo:
//                  console.log(error)
                   if(retry == 0){
                           this.setState({
                                     spinner: false,
                                     alertMod: true,
                                     titleModal: t('output:errorSaveOutput'),
                            })
                   }
                   else{
                          this.saveOutput(retry-1)
                   }
              }
          );

          timeout = setTimeout(() => {
//          	      console.log("Error in save Output Timeout: " +getError+"---"+getResponse+"---"+retry)
          	      if(retry == 0){
          	                 this.setState({
                                                 spinner: false,
                                                 alertMod: true,
                                                 titleModal: t('output:errorSaveOutput'),
                                        })
          	      }
          	      else{
          	                if(getResponse == 0 && getError == 0){
          				this.saveOutput(retry-1)
          	                  }
                            }
                        }, 1500);
        }
    }

    /// Selected Icon
    active(position){
        this.setState({
            outputIcon : position,
        })
    }

    /// Selected icon bg color
    bgColor(position) {
        if (this.state.outputIcon === position) {
            return "white";
        }
        else{
            return "transparent";
        }
      }

    getTimer(){
         hours = [];
         for(i=1; i<=12; i++){
            hours.push(<Picker.Item label = {i} value = {i} key={i} />)
         }
         return hours;
    }

    /// Render and return output icons
    renderIcons() {
        const iconItems = [];

        ImageVars.outputIconArray.map((item, position) => {
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

    // Close the Alert
    onClickCancel(){
              this.setState({alertMod:false})
    }

    // Render and return output icons
    renderPickers() {
            const pickers = [];

            for(i=0; i<10; i++){
                 pickers.push(<Picker.Item label={"r"} key={i} value={i} />)
            }

            return pickers;
        }

    render() {
        const { t } = this.props;

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} >
                <View style={commonStyles.containerView}>
                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                            ref="titleTextInput"
                            onChangeText={(txt) => {
                                if(txt.length == 0){
                                    this.setState({
                                        outputName: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        outputName: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.outputName}
                        />
                    </View>

                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('output:outputFillName')}
                            </Text>
                        ) : (null)}
                    </View>

                    <View style={commonStyles.containerIconList}>
                        <ScrollView horizontal={true} style={commonStyles.iconList(i18n.t('common:dir'))} >
                          {this.renderIcons()}
                        </ScrollView>
                    </View>

                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                            <View style={commonStyles.flex1}>
                                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:hour')}</Text>
                            </View>
                            <View style={commonStyles.pickerField(i18n.t('common:dir'))} >
                            <Picker
                            selectedValue={this.state.outputH}
                            style={commonStyles.picker}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({outputH: itemValue})
                            }>
                            <Picker.Item label="0" value={0} />
                            <Picker.Item label="1" value={1} />
                            <Picker.Item label="2" value={2} />
                            <Picker.Item label="3" value={3} />
                            <Picker.Item label="4" value={4} />
                            <Picker.Item label="5" value={5} />
                            <Picker.Item label="6" value={6} />
                            <Picker.Item label="7" value={7} />
                            <Picker.Item label="8" value={8} />
                            <Picker.Item label="9" value={9} />
                            <Picker.Item label="10" value={10} />
                            <Picker.Item label="11" value={11} />
                            <Picker.Item label="12" value={12} />
                            <Picker.Item label="13" value={13} />
                            <Picker.Item label="14" value={14} />
                            <Picker.Item label="15" value={15} />
                            <Picker.Item label="16" value={16} />
                            <Picker.Item label="17" value={17} />
                            <Picker.Item label="18" value={18} />
                            <Picker.Item label="19" value={19} />
                            <Picker.Item label="20" value={20} />
                            <Picker.Item label="21" value={21} />
                            <Picker.Item label="22" value={22} />
                            <Picker.Item label="23" value={23} />
                            </Picker>
                            </View>
                        
                        </View>



                    </View>
                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                            <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                                <View style={commonStyles.flex1}>
                                    <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:minute')}</Text>
                                </View>
                                <View style={commonStyles.pickerField(i18n.t('common:dir'))}>
                                <Picker
                                selectedValue={this.state.outputM}
                                style={commonStyles.picker}
                                onValueChange={(itemValue, itemIndex) =>
                                    this.setState({outputM: itemValue})
                                }>

                                <Picker.Item label="0" value={0} /><Picker.Item label="1" value={1} />
                                <Picker.Item label="2" value={2} /><Picker.Item label="3" value={3} />
                                <Picker.Item label="4" value={4} /><Picker.Item label="5" value={5} />
                                <Picker.Item label="6" value={6} /><Picker.Item label="7" value={7} />
                                <Picker.Item label="8" value={8} /><Picker.Item label="9" value={9} />
                                <Picker.Item label="10" value={10} /><Picker.Item label="11" value={11} />
                                <Picker.Item label="12" value={12} /><Picker.Item label="13" value={13} />
                                <Picker.Item label="14" value={14} /><Picker.Item label="15" value={15} />
                                <Picker.Item label="16" value={16} /><Picker.Item label="17" value={17} />
                                <Picker.Item label="18" value={18} /><Picker.Item label="19" value={19} />
                                <Picker.Item label="20" value={20} /><Picker.Item label="21" value={21} />
                                <Picker.Item label="22" value={22} /><Picker.Item label="23" value={23} />
                                <Picker.Item label="24" value={24} /><Picker.Item label="25" value={25} />
                                <Picker.Item label="26" value={26} /><Picker.Item label="27" value={27} />
                                <Picker.Item label="28" value={28} /><Picker.Item label="29" value={29} />
                                <Picker.Item label="30" value={30} /><Picker.Item label="31" value={31} />
                                <Picker.Item label="32" value={32} /><Picker.Item label="33" value={33} />
                                <Picker.Item label="34" value={34} /><Picker.Item label="35" value={35} />
                                <Picker.Item label="36" value={36} /><Picker.Item label="37" value={37} />
                                <Picker.Item label="38" value={38} /><Picker.Item label="39" value={39} />
                                <Picker.Item label="40" value={41} /><Picker.Item label="42" value={42} />
                                <Picker.Item label="43" value={43} /><Picker.Item label="44" value={44} />
                                <Picker.Item label="45" value={45} /><Picker.Item label="46" value={46} />
                                <Picker.Item label="47" value={47} /><Picker.Item label="48" value={48} />
                                <Picker.Item label="49" value={49} /><Picker.Item label="50" value={50} />
                                <Picker.Item label="51" value={51} /><Picker.Item label="52" value={52} />
                                <Picker.Item label="53" value={53} /><Picker.Item label="54" value={54} />
                                <Picker.Item label="55" value={55} /><Picker.Item label="56" value={56} />
                                <Picker.Item label="57" value={57} /><Picker.Item label="58" value={58} />
                                <Picker.Item label="59" value={59} /><Picker.Item label="60" value={60} />
                                </Picker>
                                </View>
                            </View>
                            </View>
                </View>

                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok')  }
                       onPress={() => this.saveOutput()} dir={i18n.t('common:dir')}>
                  </MyButton>
                 </View>

		{(this.state.alertMod) ? (
		<View>
                    <MyAlert modalVisible={this.state.alertMod}
                      onClick2={() => this.saveOutput()}
                      onClick1={() => this.onClickCancel()}
                      title1={t('common:cancel')}
                      title2={t('common:actions.ok')}
                      title={this.state.titleModal}   />
                   </View>
                   ) : (null)}

                   {(this.state.spinner) ? (
                 <View style={commonStyles.flexColumn}>
                           <Spinner
                               visible={this.state.spinner}
                               textContent={this.props.t('common:loading')}
                               textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
                            />
                  </View>
		) : (null) }

              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default translate(['OutputSetting', 'common'], { wait: true })(OutputSetting);
