import React from 'react';
import { translate} from 'react-i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput, Dimensions, TouchableHighlight, TouchableOpacity, Image} from 'react-native';
import {Picker} from '@react-native-community/picker';
import { ColorPicker  } from 'react-native-color-picker';
import tinycolor from 'tinycolor2';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Vars from '../Common/vars/commonVars';
import TouchSwitch from './lib/TouchSwitch';
import CheckBox from 'react-native-checkbox';
import i18n from 'i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import {MyAlert} from '../Common/MyAlert';

screenWidth = Dimensions.get('window').width
screenHeight = Dimensions.get('window').height

class TabItem extends React.PureComponent{
	constructor(props){
		super(props)
		this.state = {
			activeTab: 1,
		}
	}

    changeTab(tabid){
		this.setState({
			activeTab: tabid,
		})
           }

	render(){
		return(
			<View style={commonStyles.tabItemDashboard}>
	                                 <View  key={1} style={(this.state.activeTab == 1) ? commonStyles.flex1 : commonStyles.displayNone}>
	                                         {this.props.tab1}
	                                 </View>
	                                <View  key={2} style={(this.state.activeTab == 2) ? commonStyles.flex1 : commonStyles.displayNone}>
	                                        {this.props.tab2}
	                                </View>

                                           <View style={this.props.viewStyle } >

                                                  <View style={(this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2First(i18n.t('common:dir'))}>
		                                        <TouchableOpacity  style={[(this.props.styleTab1 == 2) ? commonStyles.styleTab2First(i18n.t('common:dir')) : this.props.styleTab1,
			                                         {backgroundColor: (this.state.activeTab == 1) ? this.props.activeTabColor : this.props.inActiveTabColor,}]}
			                                         onPress={()=>{this.changeTab(1)}}>
			                                        <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab1Text) ? this.props.tab1Text : i18n.t('location:locations')} </Text>
		                                      </TouchableOpacity>
	                                        </View>

                                                  <View style={(this.props.tab2 != null) ? (this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2Middle(i18n.t('common:dir')) : commonStyles.displayNone}>
	                                                 <TouchableOpacity  style={[(this.props.styleTab2 == 2) ? commonStyles.styleTab2Middle(i18n.t('common:dir')) : this.props.styleTab2,
		                                                  {backgroundColor: (this.state.activeTab == 2) ? this.props.activeTabColor : this.props.inActiveTabColor}]}
		                                                   onPress={()=>{this.changeTab(2)}}>
		                                                 <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab2Text) ? this.props.tab2Text : i18n.t('schedule:schedules')} </Text>
	                                                  </TouchableOpacity>
                                                  </View>
                                            </View>
			</View>
                          )
	}
}


export class TouchSwitchSetting extends React.Component {
//    output1: Output;
    constructor(props){
      super(props);
        this.state ={
            outputs : "",
            successName: true,
            selectedType: 14,
            showType: false,
            touchSwitchTitle: "",
            color: "#ff0096",
            speed: 0,
            modeRgb: 0,
            start: 0,
            end: 1,
            applyToAll: false,
        }

      this.saveTouchSwitch = this.saveTouchSwitch.bind(this);
    }


    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        touchSwitch = new TouchSwitch();
//        console.log("item:    " + item.id + "----" + item.type)
      if(item != null){
          this.setState({
            touchSwitchId: item.id,
            type: item.type,
            type_id: item.type_id,
            touchSwitchTitle: item.title,
            touchSwitchFlag: item.flag,
            mode: Vars.modeUpdate,
            showType: false,
            spinner: true,
            alertMod: false,
            func:"get",
          }, () =>
          {
            this.getTouchSwitch(item.id, item.type, item.type_id);
          });


        }
        else{
            this.setState({
	                touchSwitchId: 0,
	                touchSwitchTitle: "",
	                touchSwitchFlag: 1,
	                mode: Vars.modeInsert,
	                showType: true,
	                spinner: false,
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }

    }

   onClickCancel(){
          this.setState({alertMod:false})
          this.props.navigation.navigate('TouchSwitchPage')
    }

    getTouchSwitch(touchSwitchId, type, type_id, retry){
           timeout = ""
           if((retry != 0) && !retry){ retry = 2}
//           console.log("Get Touchswitch: " +type+"---"+type_id)
           getResponse = 0
           getError = 0

           touchSwitch = new TouchSwitch();
           touchSwitch.getTouchSwitch(type, type_id).then(
              dataRGB =>
              {
                    getResponse = 1
                    if(timeout != ""){ clearTimeout(timeout) }
                    modeRgb = dataRGB[2]
                    r = String(dataRGB[3])
                    g = String(dataRGB[4])
                    b = String(dataRGB[5])
                    speed = dataRGB[6];
                    start = dataRGB[7];
                    end = dataRGB[8];
//                    console.log("Data get from controller: " + modeRgb +"---" + r +"---" + g+"---"+b+"---"+speed+"--"+start+"---"+end)
                    color = ((r != "" && g != "" && b != "") && (modeRgb != 0)) ? tinycolor("rgb("+r+", "+g+", "+b+")").toHexString() : "#ff0096"

                    this.setState({
                        modeRgb: modeRgb,
                        speed: speed,
                        color: color,
                        start: start,
                        end: end,
                        spinner: false
                    })
              }
           )
          .catch(
              error => {
//                console.log("Error in get touchRGB: " + error)
                getError = 1
              }
          );

          timeoutRetry = (selectedConnection == 0) ? 1100 :2500

    	  timeout = setTimeout(() => {
//    	      console.log("Error in get Touchswitch Timeout: " +getError+"---"+getResponse+"---"+retry)
    	      if(retry == 0){
                     this.setState({
                           spinner: false,
                           alertMod: true,
                           titleModal: i18n.t('common:errorGetDataFromDB'),
                           func:"get",
                     })
              }
    	      else{
    	           if(getResponse == 0 || getError == 1){
    				    this.getTouchSwitch(touchSwitchId, type, type_id, retry-1)
    	           }
                 }
          }, timeoutRetry);

      }


    // Update touchSwitch in db
    saveTouchSwitch(inRelease, retry){

          if((retry != 0) && !retry){ retry = 2}
            getResponse = 0
            getError = 0

	        if(this.state.touchSwitchTitle.trim().length == 0){
	            this.setState({
	                successName: false,
	            })

	            setTimeout(() => this.refs.titleTextInput.focus(), 150)
	        }
	        else{
                this.setState({
                    spinner: true,
                })
	            touchSwitchIns = new Object();
	            touchSwitchIns.title = this.state.touchSwitchTitle;
	            touchSwitchIns.flag = this.state.touchSwitchFlag;
	            touchSwitchIns.type = this.state.selectedType;

	            touchSwitch = new TouchSwitch();

	            if(this.state.mode == Vars.modeUpdate){
	                touchSwitchIns.type = this.state.type
	                touchSwitchIns.type_id = this.state.type_id
	                touchSwitchIns.id = this.state.touchSwitchId;
	                touchSwitchIns.modeRgb = this.state.modeRgb;
	                touchSwitchIns.speed = this.state.speed
	                touchSwitchIns.start = this.state.start
	                touchSwitchIns.end = this.state.end
	                touchSwitchIns.color = this.state.color
	                touchSwitchIns.applyToAll = (this.state.applyToAll == false) ? 0 : 1

//		      console.log("Save params: type: " + touchSwitchIns.type +"--- type id: " + touchSwitchIns.type_id +"--- id: "+ touchSwitchIns.id+
//		      "---- mode: " + touchSwitchIns.modeRgb +"---- speed: " + touchSwitchIns.speed +"---- start: " + touchSwitchIns.start +"----- end: " +
//		      touchSwitchIns.end +"---- color: " + touchSwitchIns.color +"--- apply to all: " + touchSwitchIns.applyToAll)

            touchSwitch.updateTouchSwitchInController(touchSwitchIns).then(
                data => {
                    if(data == true){
                         getResponse = 1
                        if(inRelease == 0){
                                    this.props.navigation.navigate('TouchSwitchPage');
                        }

                    }
                }
            )
            .catch(
                error => {
//                    console.log("error in touch: " + error)
                    getError = 1
//	                        alert(this.props.t("touchSwitch:errorSaveTouchSwitch"))
                }
            );

			timeout = setTimeout(() => {
                if(retry == 0){
                      if(inRelease == 0){
                          this.setState({
                                spinner: false,
                                alertMod: true,
                                titleModal: i18n.t('touchSwitch:errorSaveTouchSwitch'),
                                func:"save",
                         })
                     }
                }
                else{
                    if(getResponse == 0 || getError == 1){
//                        console.log("error : " + retry + "---"+getResponse+"---"+getError)
                        this.saveTouchSwitch(inRelease, retry-1)
                    }
                  }
                }, 800);
	        }

	        if(this.state.mode == Vars.modeInsert){
	                touchSwitch.getNextId(this.state.selectedType).then(
	                    newId => {
//	                        console.log("type: "+newId[0].id+"---"+newId[0].type_id)
	                        touchSwitchIns.id = newId[0].id;
	                        touchSwitchIns.type_id = newId[0].type_id;
	                        touchSwitchIns.type = this.state.selectedType;

	                        touchSwitch.saveTouchSwitchInController(touchSwitchIns).then(
	                            data => {
	                                touchSwitch.updateTouchSwitchInDB(touchSwitchIns).then(
	                                    data1 => {
	                                        if(data1 == true){
	                                            this.setState({
                                                    spinner: false,
                                                })
	                                            this.props.navigation.navigate('TouchSwitchPage');
	                                        }
	                                    }
	                                )
	                                .catch(
	                                    error => {
	                                     this.setState({
                                            spinner: false,
                                        })
	                                        console.log("eror2 " + error)
	                                        alert(this.props.t("touchSwitch:errorSaveTouchSwitch"))
	                                    }
	                                );
	                            }
	                        )
	                        .catch(
	                            error => {
                                    this.setState({
                                        spinner: false,
                                    })

	                                alert(this.props.t("touchSwitch:errorSaveTouchSwitch"))
	                                console.log("eror3 " + error)
	                            }
	                        );
	                    }
	                )
	            }

	        }
    }

    colorChange(color){
        this.setState({ color })
    }

    render() {
        const { t } = this.props;

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >

            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={{height:screenHeight}}>
                <View style={{width:'100%', height: 80}}>
	                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
		                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

		                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
		                            ref="titleTextInput"
		                            onChangeText={(txt) => {
		                                if(txt.trim().length == 0){
		                                    this.setState({
		                                        touchSwitchTitle: txt,
		                                        successName: false
		                                    })
		                                }
		                                else{
		                                    this.setState({
		                                        touchSwitchTitle: txt,
		                                        successName: true
		                                    })
		                                }
		                            }}
		                            value={this.state.touchSwitchTitle}
		                        />
	                    </View>

	                    {!this.state.successName ? (
	                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
	                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
	                              {t('touchSwitch:touchSwitchFillName')}
	                            </Text>
	                    </View>
	                    ) : (null)}
                </View>
                <View style={commonStyles.line}></View>
                {this.state.showType ? (
                <View style={commonStyles.line}></View>
                ) : (null)
                }

                { this.state.showType ? (
                <View style={commonStyles.touchSwitchType(i18n.t('common:dir'))}>
	                    <View style={commonStyles.flex2}>
	                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('touchSwitch:touchSwitchType')}</Text>
	                    </View>
	                    <View style={commonStyles.pickerField(i18n.t('common:dir'))}>
		                    <Picker
		                        selectedValue={this.state.selectedType}
		                        style={commonStyles.picker}
		                        onValueChange={(itemValue, itemIndex) =>
		                          {
		                            this.setState({selectedType:itemValue})
		                          }
		                        }>
		                        <Picker.Item label={t('touchSwitch:touchSwitchWifiWithoutRelay')} value={14} key={14}/>
		                        <Picker.Item label={t('touchSwitch:touchSwitchWifiWithRelay')} value={2} key={2}/>
		                    </Picker>
	                    </View>
                </View>
                ) : (null) }

	       {(this.state.mode == Vars.modeUpdate) ?
                 (
                 <View style={{flex:1}}>
                        <View style={{flex:6}}>
				<TabItem
		          tab1=
					{<View style={{flex:1, marginTop:50}}>
                    <ColorPicker
                        color={this.state.color}
                        onColorChange={color => {
                            if(this.state.modeRgb != 1){this.setState({modeRgb:1})}
                            this.colorChange(color) }
                        }
                        hideSliders={true}
                        onColorSelected={done => {
                                this.saveTouchSwitch(1,1)
                        }}
                        style={{height: '100%'}}

                      />

                      </View>}
                        tab2=
                      {
                                  <View style={{flex:1, marginTop:50, flexDirection:'column', paddingRight: 10, paddingLeft: 10}}>
                                  <View style={[commonStyles.listViewTouchView(i18n.t('common:dir'))]}>
                                  <View style={commonStyles.flex3}>
                                      <Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('rgb:mode')}</Text>
                                  </View>
                                <View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
                                  <Picker
                                        selectedValue={this.state.modeRgb}
                                        style={commonStyles.rgbPickerDashboard}
                                        itemStyle={commonStyles.rgbItemStylePicker(i18n.t("common:dir"))}
                                        onValueChange={(itemValue, itemIndex) => {
//                                                                                  console.log("Mode: " + this.state.modeRgb)
                                                  this.setState({modeRgb: itemValue})
                                          }
                                   }>
                                            <Picker.Item label={i18n.t("rgb:modeOff")} value={0} />
                                            <Picker.Item label={i18n.t("rgb:modeStatic")} value={1} />
                                            <Picker.Item label={i18n.t("rgb:modeFade3")} value={2} />
                                            <Picker.Item label={i18n.t("rgb:modeFade12")} value={3} />
                                            <Picker.Item label={i18n.t("rgb:modeSw3")} value={4} />
                                            <Picker.Item label={i18n.t("rgb:modeSw12")} value={5} />
                                   </Picker>
                              </View>
                       </View>
                                               <View style={[commonStyles.listViewTouchView(i18n.t('common:dir'))]}>
                                                                 <View style={commonStyles.flex3}>
                                                                     <Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('rgb:speed')}</Text>
                                                                 </View>
                                                                 <View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
                                                                   <Picker
                                                                         selectedValue={this.state.speed}
                                                                         style={commonStyles.rgbPickerDashboard}
                                                                         itemStyle={commonStyles.rgbItemStylePicker(i18n.t("common:dir"))}
                                                                         onValueChange={(itemValue, itemIndex) => {
                                                                                         this.setState({speed: itemValue}, () => {
//                                                                                         console.log("speeeeed: " + this.state.speed)
                                                                                         })
                                                                           }
                                                                    }>
                                                                         <Picker.Item label={i18n.t("rgb:veryGradual")} value={1} />
                                                                         <Picker.Item label={i18n.t("rgb:gradual")} value={2} />
                                                                         <Picker.Item label={i18n.t("rgb:medium")} value={3} />
                                                                         <Picker.Item label={i18n.t("rgb:fast")} value={4} />
                                                                         <Picker.Item label={i18n.t("rgb:veryFast")} value={5} />
                                                                    </Picker>
                                                               </View>
                                                        </View>
                                                        <View style={[commonStyles.listViewTouchView(i18n.t('common:dir'))]}>
                                                                         <View style={commonStyles.flex3}>
                                                                             <Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('touchSwitch:startOffLed')}</Text>
                                                                         </View>
                                                                         <View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
                                                                           <Picker
                                                                            selectedValue={this.state.start}
                                                                               style={commonStyles.rgbPickerDashboard}
                                                                            onValueChange={(itemValue, itemIndex) =>
                                                                              this.setState({start: itemValue})
                                                                            }>
                                                                            <Picker.Item label="0:00" value={0} />
                                                                            <Picker.Item label="1:00" value={1} />
                                                                            <Picker.Item label="2:00" value={2} />
                                                                            <Picker.Item label="3:00" value={3} />
                                                                            <Picker.Item label="4:00" value={4} />
                                                                            <Picker.Item label="5:00" value={5} />
                                                                            <Picker.Item label="6:00" value={6} />
                                                                            <Picker.Item label="7:00" value={7} />
                                                                            <Picker.Item label="8:00" value={8} />
                                                                            <Picker.Item label="9:00" value={9} />
                                                                            <Picker.Item label="10:00" value={10} />
                                                                            <Picker.Item label="11:00" value={11} />
                                                                            <Picker.Item label="12:00" value={12} />
                                                                            <Picker.Item label="13:00" value={13} />
                                                                            <Picker.Item label="14:00" value={14} />
                                                                            <Picker.Item label="15:00" value={15} />
                                                                            <Picker.Item label="16:00" value={16} />
                                                                            <Picker.Item label="17:00" value={17} />
                                                                            <Picker.Item label="18:00" value={18} />
                                                                            <Picker.Item label="19:00" value={19} />
                                                                            <Picker.Item label="20:00" value={20} />
                                                                            <Picker.Item label="21:00" value={21} />
                                                                            <Picker.Item label="22:00" value={22} />
                                                                            <Picker.Item label="23:00" value={23} />
                                                                     </Picker>
                                                                     </View>
                                                        </View>
                                                        <View style={[commonStyles.listViewTouchView(i18n.t('common:dir'))]}>
                                                                       <View style={commonStyles.flex3}>
                                                                           <Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('touchSwitch:endOffLed')}</Text>
                                                                       </View>
                                                                       <View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
                                                                         <Picker
                                                                          selectedValue={this.state.end}
                                                                          style={commonStyles.rgbPickerDashboard}
                                                                          onValueChange={(itemValue, itemIndex) =>
                                                                            this.setState({end: itemValue})
                                                                          }>
                                                                            <Picker.Item label="1:00" value={1} />
                                                                            <Picker.Item label="2:00" value={2} />
                                                                            <Picker.Item label="3:00" value={3} />
                                                                            <Picker.Item label="4:00" value={4} />
                                                                            <Picker.Item label="5:00" value={5} />
                                                                            <Picker.Item label="6:00" value={6} />
                                                                            <Picker.Item label="7:00" value={7} />
                                                                            <Picker.Item label="8:00" value={8} />
                                                                            <Picker.Item label="9:00" value={9} />
                                                                            <Picker.Item label="10:00" value={10} />
                                                                            <Picker.Item label="11:00" value={11} />
                                                                            <Picker.Item label="12:00" value={12} />
                                                                            <Picker.Item label="13:00" value={13} />
                                                                            <Picker.Item label="14:00" value={14} />
                                                                            <Picker.Item label="15:00" value={15} />
                                                                            <Picker.Item label="16:00" value={16} />
                                                                            <Picker.Item label="17:00" value={17} />
                                                                            <Picker.Item label="18:00" value={18} />
                                                                            <Picker.Item label="19:00" value={19} />
                                                                            <Picker.Item label="20:00" value={20} />
                                                                            <Picker.Item label="21:00" value={21} />
                                                                            <Picker.Item label="22:00" value={22} />
                                                                            <Picker.Item label="23:00" value={23} />
                                                                            <Picker.Item label="24:00" value={24} />
                                                                   </Picker>
                                                                   </View>
                                                      </View>
                                                      </View>
                                                }

		                              styleTab2={commonStyles.tab1Second(i18n.t('common:dir'))}

		                              styleTab1={commonStyles.tab1First(i18n.t('common:dir'))}

		                              viewStyle={commonStyles.viewTabStyleTS(i18n.t('common:dir'))}

		                              containerStyle= {commonStyles.containerStyle}
		                              tab1Text={i18n.t("rgb:rgb")}
		                              tab2Text={i18n.t("rgb:rgbSetting")}
		                              activeTabColor={'#eae5ec'}
		                              inActiveTabColor={'rgba(135,110,144,0.58)'}
		                              tabId={2}
		                     />
				</View>
	                              <View style={{flex:1}}>
	                                         <CheckBox
	                                                           onChange={(checked) => {
//	                                                                      console.log("Checkeddddd: " + checked)
	                                                                      this.setState({ applyToAll: !this.state.applyToAll });
	                                                            }
	                                                           }
	                                                           dir={i18n.t('common:dir')}
	                                                           labelColor={'#fff'}
	                                                           iconColor={'#fff'}
	                                                           checked={this.state.applyToAll}
	                                                           label={i18n.t('touchSwitch:applyToAll')}
	                                         />
                                       </View>
                  </View>
	)
	: null }


	          <View style={{flex:1}} >
	                  <MyButton title={t('common:actions.ok') } dir={t("common:dir")}
	                       onPress={() => this.saveTouchSwitch(0,2) }>
	                  </MyButton>
	           </View>

              </LinearGradient>

                 {(this.state.spinner) ? (
                             <View style={{flex:1, flexDirection:'column'}}>
                                     <Spinner
                                         visible={this.state.spinner}
                                         textContent={this.props.t('common:loading')}
                                         textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
                                />
                                </View>
                             ) : (null)
                 }

                {(this.state.alertMod) ? (
                                     <View>
                                     <MyAlert modalVisible={this.state.alertMod}
                                       onClick2={() => {
                                               if(this.state.func == "get") {
	                                                   this.setState({alertMod: false});
	                                                   this.getTouchSwitch(this.state.touchSwitchId, this.state.type, this.state.type_id);
                                                }
                                                else{
	                                                   this.setState({alertMod: false});
	                                                   this.saveTouchSwitch(0,1);
                                               }
	                              }
                                       }
                                       onClick1={() => this.onClickCancel()}
                                       title1={i18n.t('common:cancel')}
                                       title2={i18n.t('common:actions.ok')}
                                       title={this.state.titleModal}   />
                                    </View>
                 ) : (null) }

            </KeyboardAvoidingView>
        );
    }

}

export default translate(['TouchSwitchSetting', 'common'], { wait: true })(TouchSwitchSetting);