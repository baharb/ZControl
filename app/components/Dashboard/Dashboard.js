import React from 'react';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { View, Text, Image, FlatList, ScrollView, TouchableHighlight, Pressable, TouchableOpacity, BackAndroid, Switch, Dimensions, BackHandler, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import ZagrosDB from '../Common/lib/DB';
import Scenario from '../Scenario/lib/Scenario';
import RGB from '../RGB/lib/RGB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import UDP from '../Common/lib/UDP';
import Output from '../Output/lib/Output';
import Thermometer from '../Thermometer/lib/Thermometer';
import Commands from '../Common/vars/commands';
import CommonFunctions from '../Common/lib/CommonFunctions';
import Slider from '@react-native-community/slider';
import Curtain from '../Curtain/lib/Curtain';
import { ColorPicker } from 'react-native-color-picker';
import {Picker} from '@react-native-community/picker';
import { WebView } from 'react-native-webview';

import tinycolor from 'tinycolor2'
import RadioForm from 'react-native-simple-radio-button';
import Icon from 'react-native-vector-icons/MaterialIcons'

outputIns = new Output()
stopUpdate = 0;
inUpdateOutputs = 0
inClickOutput = 0
// disabled = false
clicked = 0
clickTherm = 0
queueWIndex = 0
queueRIndex = 0

arrayOutputs = [{
	outputId: 0,
	outputValue : 0,
	type : 0,
	type_id : 0,
},
{
	outputId: 0,
	outputValue : 0,
	type : 0,
	type_id : 0,
},
{
	outputId: 0,
	outputValue : 0,
	type : 0,
	type_id : 0,
},
 {
 	outputId: 0,
 	outputValue : 0,
 	type : 0,
 	type_id : 0,
 }
]

clickRGB = 0
countRGB = 0

disabledBtn = false
interruptUpdate = 0
outputsUpdated = 0
selectedThermometer = 1 //todo: change to first thermostat in Location
selectedTab = 1 // 1 = output , 2 = rgb, 3 = thermostat

screenWidth = Dimensions.get('window').width
screenHeight = Dimensions.get('window').height
thermometer = new Thermometer()

cou = 0

require('events').EventEmitter.prototype._maxListeners = 1000;

class TabItem extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			activeTab: 1,
		}
		//		console.log("tab222222222222222: " + screenWidth + "---" + screenHeight)
	}

	changeTab(tabid) {
		this.setState({
			activeTab: tabid,
		})
		if (this.props.tabId == 2) {
			selectedTab = tabid
		}
		//		console.log("tab id: " + this.props.tabId +"----" + selectedTab)
	}

	render() {
		return (
			<View style={commonStyles.tabItemDashboard}>
				<View key={1} style={(this.state.activeTab == 1) ? commonStyles.flex1 : commonStyles.displayNone}>
					{this.props.tab1}
				</View>
				<View key={2} style={(this.state.activeTab == 2) ? commonStyles.flex1 : commonStyles.displayNone}>
					{this.props.tab2}
				</View>
				<View key={3} style={(this.state.activeTab == 3) ? commonStyles.flex1 : commonStyles.displayNone}>
					{this.props.tab3}
				</View>
				<View key={4} style={(this.state.activeTab == 4) ? commonStyles.flex1 : commonStyles.displayNone}>
					{this.props.tab4}
				</View>

				<View style={(this.props.viewStyle == "") ? commonStyles.viewTabStyle(i18n.t("common:dir")) :
					this.props.viewStyle
				} >

                <View style={(this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2First(i18n.t('common:dir'))}>
                    <TouchableOpacity style={[(this.props.styleTab1 == 2) ? commonStyles.styleTab2First(i18n.t('common:dir')) : this.props.styleTab1,
                    { backgroundColor: (this.state.activeTab == 1) ? this.props.activeTabColor : this.props.inActiveTabColor, }]}
                        onPress={() => { this.changeTab(1) }}>
                        <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab1Text) ? this.props.tab1Text : i18n.t('location:locations')} </Text>
                    </TouchableOpacity>
                </View>

                <View style={(this.props.tab2 != null) ? (this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2Middle(i18n.t('common:dir')) : commonStyles.displayNone}>
                    <TouchableOpacity style={[(this.props.styleTab2 == 2) ? commonStyles.styleTab2Middle(i18n.t('common:dir')) : this.props.styleTab2,
                    { backgroundColor: (this.state.activeTab == 2) ? this.props.activeTabColor : this.props.inActiveTabColor }]}
                        onPress={() => { this.changeTab(2) }}>
                        <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab2Text) ? this.props.tab2Text : i18n.t('schedule:schedules')} </Text>
                    </TouchableOpacity>
                </View>

                <View style={(this.props.tab3) ? (this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2Second(i18n.t('common:dir')) : commonStyles.displayNone}>
                    <TouchableOpacity style={[(this.props.styleTab1 == 2) ? commonStyles.styleTab2Second(i18n.t('common:dir')) : this.props.styleTab2,
                    { backgroundColor: (this.state.activeTab == 3) ? this.props.activeTabColor : this.props.inActiveTabColor }]}
                        onPress={() => { this.changeTab(3) }}>
                        <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab3Text) ? this.props.tab3Text : i18n.t('scenario:scenarios')} </Text>
                    </TouchableOpacity>
                </View>

                <View style={(this.props.tab4) ? (this.props.containerStyle) ? this.props.containerStyle : commonStyles.tab2First(i18n.t('common:dir')) : commonStyles.displayNone}>
                    <TouchableOpacity style={[(this.props.styleTab1 == 2) ? commonStyles.styleTab2First(i18n.t('common:dir')) : this.props.styleTab1,
                    { backgroundColor: (this.state.activeTab == 4) ? this.props.activeTabColor : this.props.inActiveTabColor }]}
                        onPress={() => { this.changeTab(4) }}>
                        <Text style={commonStyles.tabTitle(i18n.t('common:dir'))}> {(this.props.tab4Text) ? this.props.tab4Text : i18n.t('thermometer:thermometer')} </Text>
                    </TouchableOpacity>
                </View>

				</View>
			</View>
		)
	}
}

class OutputItem extends React.PureComponent {
	clicked = 0
	timeoutOutputRetry = (selectedConnection == 0) ? 250 : 2500
	timeoutOutputRetryUdp = (selectedConnection == 0) ? 510 : 2500

	constructor(props) {
		super(props)
		this.state = {
			type: props.type,
			type_id: props.type_id,
			icon: props.icon,
			value: props.value,
			name: props.name,
			id: props.id,
			key: props.key,
		}

	}

	clickOutput(outputId, outputValue, type, type_id, retry) {
		try {
			before = new Date().getTime()
					timeout = ""

					let getResponse = 0
					let getError = 0
					params1 = new Array()

					if ((type == output.OUTPUT_ANALOG_TYPE) || (type == output.OUTPUT_DIGITAL_TYPE)) {
						params1[0] = outputId;
					}
					else {
						params1[0] = type_id;
					}

					if (type == output.OUTPUT_ANALOG_TYPE) { // Analog / Slider
						params1[1] = outputValue;
					}
					else { // Not Analog
						params1[1] = (outputValue == 1) ? 0 : 1;
					}

					params1[2] = type;

					if (inUpdateOutputs == 1) {
						interruptUpdate = 1
					}

					after = new Date().getTime()
//					console.log("start click output id: " + outputId + "---- inClick: "+ inClickOutput +"--- stopupdate: " +stopUpdate)
					coun = 0


//					if (inClickOutput == 0 && stopUpdate == 0) {
						stopUpdate = 1
						inClickOutput = 1
//					udpOut = new UDP();
//					udpOut.sendUdpPacket(Commands.REQ_OUTPUT, Commands.FLAG_EDIT_VALUE, params1, "", "", true, this.timeoutOutputRetryUdp).then(
                    udpOut = new UDP(Commands.REQ_OUTPUT, Commands.FLAG_EDIT_VALUE, params1);
                    udpOut.sendUdpPacket("", "", true, this.timeoutOutputRetryUdp).then(
						dataOutUdp => {
							getResponse = 1

							queueRIndex = ((queueRIndex+1) >= 4) ? 0 : (queueRIndex+1)

//							console.log("get clicked : " + outputId + "---"+params1[0]+"-"+dataOutUdp[5]+"-----"+params1[2]+"-"+dataOutUdp[6])

							if (dataOutUdp && dataOutUdp.length > 4){//} && (dataOutUdp[5] == params1[0]) && (dataOutUdp[6] == params1[2])) {
								// console.log("get clicked 2 : " + outputId)
//								ennnd = new Date().getTime()
//								console.log("END GET CLICKED: " + (ennnd - start) + "---id: " + outputId)

								if (timeout != "") {
									clearTimeout(timeout)
								}

								if (type != 1) { // Digital
									this.clicked = 1

									this.setState({ value: dataOutUdp[7] }, () => {
										stopUpdate = 0
										this.clicked = 0
										inClickOutput = 0
										ennnd2 = new Date().getTime()
//										console.log("END 2 GET CLICKED: " + (ennnd2 - before) + "---id: " + outputId)
										//
									});

								}
								else { // Analog
									outputs = [...this.state.outputs]
									outputs[outputId - 1].value = outputValue
									this.setState({ outputs: outputs }, () => {
										stopUpdate = 0
										this.clicked = 0
										inClickOutput = 0
										disabled = false
									});
								}

							}
							else {
//								console.log("Error in get correct id: " + stopUpdate + "---")

								getError = 1
//
//								//When retry doesn't exist
//								//todooooo ....
//								if (timeout != "") {
//									clearTimeout(timeout)
//								}
//
//								stopUpdate = 0
//								this.clicked = 0
//								inClickOutput = 0
//								// disabled = false
							}

						}
					).catch(error => {
						getError = 1
//						console.log("get clicked  output Error id: " + outputId + "-- retry: " + retry + "----error: " + error)
						queueRIndex = ((queueRIndex+1) >= 4) ? 0 : (queueRIndex+1)

						//When retry doesn't exist
						//todooooo ....
						if (timeout != "") {
							clearTimeout(timeout)
						}

						stopUpdate = 0
						this.clicked = 0
						inClickOutput = 0
						// disabled = false

					})


					timeout = setTimeout(() => {
//						console.log("stopandretry id: " + outputId + "---stop: " + stopUpdate + "--inclick: "+inClickOutput)

						if ((getResponse == 0) || (getError == 1)) {

							 if (retry > 0) {
							 	this.clickOutput(outputId, outputValue, type, type_id, retry - 1)
							 }
							 else {
							stopUpdate = 0
							this.clicked = 0
							inClickOutput = 0
							// disabled = false
							 }
						}
					}, this.timeoutOutputRetry);


				// }, timeoutStart);

//			}
//			else{
//			    if (inClickOutput == 0 && stopUpdate == 1){
//                    timeout = setTimeout(() => {
//                        console.log("retry id: " + outputId + "---stop: " + stopUpdate + "---inclick: "+inClickOutput)
//                        this.clickOutput(0)
//                    }, 280);
//                }
//			}
		}
		catch (error) {
			this.clicked = 0
			stopUpdate = 0
			// disabled = false
			inClickOutput = 0
//			console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" + error)
		}


	}

	componentDidUpdate() {
		//todo: Add changing timer
//		 console.log("-----------------------id: " + this.props.id + "-- disabled: " + this.state.disabled)
//			console.log("updateee:   clicked: " +this.clicked+"updated: " + outputsUpdated + "---id: "+this.props.id +"----state value: " + this.state.value + "----prop value: " + this.props.value)

		if (this.clicked == 1) {
			outputsUpdated = 0
		}
		else if (this.clicked == 0 && outputsUpdated == 1) {
			if (this.state.value !== this.props.value) {
				this.setState({ value: this.props.value });
//				console.log("updateeeeeee2222:   id: " + this.props.id + "----value: " + this.state.value)
			}
		}
	}

	render() {

		return (
			(screenWidth < screenHeight) ?
				(this.state.type != outputIns.OUTPUT_ANALOG_TYPE) ?

						<TouchableHighlight
							key={this.props.key}
							onPress={() => {
								this.clickOutput(this.state.id, this.state.value, this.state.type, this.state.type_id, 1)
							}}
							style={commonStyles.listViewTouch} >
							<View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
								<Image source={(this.state.value == 1) ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]} style={commonStyles.listViewTouchImg} />
								<Text style={(this.state.value == 1) ? commonStyles.outputTextOn(i18n.t('common:dir')) : commonStyles.outputTextOff(i18n.t('common:dir'))} >{this.state.name}</Text>
							</View>
						</TouchableHighlight>

					:

					<View style={commonStyles.flexColumn} key={this.props.key}>
						<View style={commonStyles.flatListViewTouch}>
							<Text style={(this.state.value > 0) ? commonStyles.flatListViewTextOn(i18n.t("common:dir")) : commonStyles.flatListViewTextOff(i18n.t("common:dir"))} >{this.state.name}</Text>
							<Image source={(this.state.value > 0) ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]} />
							<Slider
								style={commonStyles.sliderDashboard}
								minimumValue={0}
								maximumValue={100}
								step={1}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#000000"
								// onValueChange={value => this.setState({ age: val })}
								onSlidingComplete={
									value => {
										this.clickOutput(this.state.id, value, this.state.type, this.state.type_id, 1)
									}
								}
								value={this.state.value}
							/>
						</View>
					</View>


				:
				(this.state.type != outputIns.OUTPUT_ANALOG_TYPE) ?
					<View key={this.props.key} style={commonStyles.flex1}>
						<TouchableHighlight
							onPress={() => {
								// disabled = true
								// this.props.handleDisableOutput()ex)
//                                console.log("in click: " + arrayOutputs[queueWIndex].id +"---")
//                                arrayOutputs[queueWIndex].id = this.state.id
//                                arrayOutputs[queueWIndex].value = this.state.value
//                                arrayOutputs[queueWIndex].type = this.state.type
//                                arrayOutputs[queueWIndex].type_id = this.state.type_id

//                                queueWIndex = ((queueWIndex+1) >= 4) ? 0 : (queueWIndex+1)
								this.clickOutput(this.state.id, this.state.value, this.state.type, this.state.type_id, 1)
							}}
							style={commonStyles.outputItemDashboard} >
							<View style={commonStyles.locationViewItem}>
								<Image source={(this.state.value == 1) ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]} style={commonStyles.horizontalOutputImageItem} />
								<Text style={(this.state.value == 1) ? commonStyles.outputTextOn(i18n.t('common:dir')) : commonStyles.outputTextOff(i18n.t('common:dir'))}>{this.state.name}</Text>
							</View>
						</TouchableHighlight>
					</View>
					:
					<View style={commonStyles.flexColumn} key={this.props.key}>
						<View style={commonStyles.flatListViewTouch}>
							<Text style={(this.state.value > 0) ? commonStyles.flatListViewTextOn(i18n.t("common:dir")) : commonStyles.flatListViewTextOff(i18n.t("common:dir"))} >{this.state.name}</Text>
							<Image source={(this.state.value > 0) ? ImageVars.outputIconLightArray[this.state.icon] : ImageVars.outputIconArray[this.state.icon]} />
							<Slider
								style={commonStyles.sliderDashboard}
								minimumValue={0}
								maximumValue={100}
								step={1}
								minimumTrackTintColor="#FFFFFF"
								maximumTrackTintColor="#000000"
								// onValueChange={value => this.setState({ age: val })}
								onSlidingComplete={
									value => {
										this.clickOutput(this.state.id, this.state.value, this.state.type, this.state.type_id, 1)
									}
								}
								value={this.state.value}
							/>
						</View>
					</View>
		)
	}
}

export class RGBItem extends React.PureComponent {

	constructor(...props) {
		super(...props)

		//   console.log("Colorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr: speed"+this.props.speed+"--- color: "+this.props.color+"--- mode: "+ this.props.mode+"---")

		this.state = {
			color: this.props.color,
			done: 0,
			visible: true,
			type: this.props.type,
			type_id: this.props.type_id,
			speed: this.props.speed,
			mode: this.props.mode
		}

		this.onColorChange = this.onColorChange.bind(this)
		this.colorChange = this.colorChange.bind(this)
//		this.onReleaseTouch = this.onReleaseTouch.bind(this)

		//    this.changeView = this.changeView.bind(this)
	}

	componentDidUpdate(prevProps, prevState) {
//		console.log("-----------------------RGB change----id: " + this.props.id + "---" + clickRGB)
		//            	console.log("updatee:   props: "+ this.props.color +"--state: " + this.state.color +"---mode: "+ this.props.mode +"-"+ this.state.mode)

		if (clickRGB == 0) {
			//  			console.log("click color: state color " + this.state.color + "---- prop color" + this.props.color)
			if (this.state.color !== this.props.color) {
				this.setState({ color: this.props.color });
			}

			if (this.state.speed !== this.props.speed) {
//				console.log("change speed in click rgb: id: " + this.props.id + "--- state speed: " + this.state.speed + " ---props on: " + this.props.speed)
				this.setState({ speed: this.props.speed });
			}

			if (this.state.mode !== this.props.mode) {
//				console.log("change mode in update rgb: id: " + this.props.id + "--- state mode: " + this.state.mode + " ---props mode: " + this.props.mode)
				this.setState({ mode: this.props.mode });
			}
		}

	}



	colorChange(color) {
		clickRGB = 1
//		console.log("new color: " + color)
        if(this.state.mode != 1)
		{this.setState({
		    color: color,
		    mode: 1
		    })
		    }
		else
		{this.setState({color})  }

	}

	onColorChange(color, mode, speed) {
		//	clickRGB = 0
		stopUpdate = 1
		//   color = this.state.color
		//          console.log("SELECTED NEW  color: " + color +"---" + this.state.color)
		//    if(color != null && color != ""){
		//          this.setState({ color })
		//    }
		//     else{

		//     }

		if (mode == "" || mode == null || !mode) {
			mode = this.state.mode
		}

		if (speed == "" || speed == null || !speed) {
			speed = this.state.speed
		}
		//   console.log("Colorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr:"+this.props.type_id+"---"+color+"---"+ this.state.mode+"---"+ "---" + (color != null))

		params = new Array()
		params[0] = this.props.type_id
		params[1] = this.props.type
		params[2] = mode //(color != null) ? 1 : mode


		string_color = (color != null) ? tinycolor(color).toHexString().substr(1, 6) : "ff0096" //tinycolor(this.state.color).toHexString().substr(1,6)
//		console.log("selected color:    " + string_color + "--" + color)

		colorInt = parseInt("0x" + string_color);
		params[3] = (colorInt >> 16) & 0xFF
		params[4] = (colorInt >> 8) & 0xFF
		params[5] = colorInt & 0xFF
		params[6] = speed

		//    console.log("Colorrrrrrrrrrr:"+(color!=null)+"---"+string_color+"---"+ colorInt+"---"+ "---params: " +
		//                    params[0]+"-"+params[1]+"-"+params[2] + "-" + params[3]+"-"+params[4]+"-"+params[5]+"-"+params[6])

		udpRgb = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_RGB, params)
		udpRgb.sendUdpPacket("", "", true).then(
			dataColorChanged => {
				if (dataColorChanged[4] == 1) { // It's OK
//					console.log("changed successfully: " + dataColorChanged[4])
					stopUpdate = 0
					clickRGB = 0
				}
				//                CommonFunctions.arrayCopy(dataColorChanged, 4, dataTemp, 0, dataTempUdp.length - 4);
			}
		).catch(error => {
//			console.log("error in update colorChange: " + error)
			stopUpdate = 0
		})
	}

	//  changeView(){
	//          this.setState({visible: !this.state.visible})
	//  }

	render() {
		return (
			<View style={((screenWidth < screenHeight) || (screenHeight > 650)) ? commonStyles.tabRgb : commonStyles.tabRgbHor} key={this.props.id}>
				<View style={{ flex: 12 }}>
					{(screenHeight > 650) ?
						<TouchableHighlight style={commonStyles.rgbTouchDashboard} >
							<View style={commonStyles.listViewTouchRgb(i18n.t('common:dir'))}>
								<Image source={require("../Common/img/common-light-rgb.png")} style={commonStyles.listViewTouchImg} />
								<Text style={commonStyles.outputTextOn(i18n.t('common:dir'))} >{this.props.name}</Text>
							</View>
						</TouchableHighlight>
						: null}
					<ColorPicker
						color={this.state.color}
						done={this.state.done}
						onColorChange={color => this.colorChange(color)}
                        hideSliders={true}
						onColorSelected={done => {
							//	                    console.log("done : " + "`$done`" + "---" + this.state.done);
							// Set state mode to 1. After change color by hand, Static mode should be set.
							this.setState({ mode: 1 })
							this.onColorChange(this.state.color, 1, this.state.speed)
						}
						}
						style={(this.state.visible == true) ?
							(screenHeight > 650 || (screenHeight > screenWidth)) ? { height: '100%', paddingTop: 5 } : { height: screenHeight - 375, paddingTop: 5 }
							:
							commonStyles.displayNone}
					/>
				</View>
				{(screenHeight > 650) ? <View style={[commonStyles.line, { flex: 1 }]}></View> : null}
				<View style={{ flex: 5 }}>
					<ScrollView style={{ flex: 1, flexDirection: 'column' }}>
						<View style={[commonStyles.listViewTouchRgbDashboard(i18n.t('common:dir'))]}>
							<View>
								<Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('rgb:mode')}</Text>
							</View>
							<View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
								<Picker
									selectedValue={this.state.mode}
									style={commonStyles.rgbPickerDashboard}
									itemStyle={commonStyles.rgbItemStylePicker(i18n.t("common:dir"))}
									onValueChange={(itemValue, itemIndex) => {
										clickRGB = 1
//										console.log("change mode: " + itemValue + "---" + itemIndex)
										this.setState({ mode: itemValue }, () => {
											this.onColorChange(this.state.color, itemValue, this.state.speed)
											clickRGB = 0
										})
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
						<View style={commonStyles.line} />
						<View style={[commonStyles.listViewTouchRgbDashboard(i18n.t('common:dir'))]}>
							<View>
								<Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>{i18n.t('rgb:speed')}</Text>
							</View>
							<View style={[commonStyles.pickerField(i18n.t('common:dir')), commonStyles.viewPickerRgb(i18n.t('common:dir'))]} >
								<Picker
									selectedValue={this.state.speed}
									style={commonStyles.rgbPickerDashboard}
									itemStyle={commonStyles.rgbItemStylePicker(i18n.t("common:dir"))}
									onValueChange={(itemValue, itemIndex) => {
										clickRGB = 1
										this.setState({ speed: itemValue }, () => {
											this.onColorChange(this.state.color, this.state.mode, itemValue)
											clickRGB = 0
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
					</ScrollView>
				</View>
			</View>
		)
	}

}

class ScenarioItem extends React.PureComponent {
	constructor(props) {
		super(props)
	}

	componentDidMount() { this.clickScenario = this.clickScenario.bind(this); }

	// Execute a Scenario
	clickScenario(scenarioId) {
		stopUpdate = 1
		scenario = new Scenario();
		scenario.run(scenarioId);
		stopUpdate = 0
	}

	render() {
		return (
			<View style={commonStyles.flex1}>
				<View key={this.props.id} style={commonStyles.flex1}>
					<TouchableHighlight
						onPress={() => { this.clickScenario(this.props.id) }}
						style={commonStyles.scenarioTouchDashboard} >
						<View style={commonStyles.scenarioViewDashboard}>
							<Image source={ImageVars.scenarioIconLightArray[this.props.icon]} style={commonStyles.scenarioImageDashboard} />
							<Text style={commonStyles.titleScenarioDashboard(i18n.t('common:dir'))}>{this.props.title}</Text>
						</View>
					</TouchableHighlight>
				</View>
			</View>
		)
	}
}

class CurtainItem extends React.PureComponent {
	constructor(props) {
		super(props)
	}

	runCurtain(command, retry){
		stopUpdate = 1
		getResponse = 0
		getError = 0
		timeout = ""

		Curtain.runCurtain(this.props.type_id, this.props.type, command, 1).then(
			data => {
				getResponse = 1
				if(timeout != ""){ clearTimeout(timeout) }
				stopUpdate = 0
			}
		)
		.catch(error => {
			getError = 1
		})

		timeout = setTimeout(() => {
			if(getResponse == 0 || getError == 1){
				if(retry > 0){
					this.runCurtain(command, retry-1)
				}
				else{
					stopUpdate = 0
				}
			}
		}, 900);


	}

	render() {
		return (
			<View key={this.props.id}
				style={(screenHeight > screenWidth) ? commonStyles.curtainViewDashboard(i18n.t("common:dir")) :
					commonStyles.curtainViewDashboardHor(i18n.t("common:dir"))}>
				{(screenWidth < screenHeight) ?
					<View style={commonStyles.flex3}>
						<View style={commonStyles.curtainItemDashboard(i18n.t("common:dir"))} >
							<Text style={commonStyles.curtainTextDashboard(i18n.t("common:dir"))}>{this.props.title}</Text>
							<Image source={require('../Common/img/common-light-curtain.png')} style={commonStyles.curtainImageDashboard} />
						</View>
					</View>
					: null}
				    <View style={commonStyles.flex1}>
					<TouchableHighlight style={commonStyles.curtainTouchDashboard} onPress={() => {
						this.runCurtain(Commands.CURTAIN_OPEN, 1)
					}} >
						<Image source={require('../Common/img/common-light-curtain.png')} style={commonStyles.curtainAction} />
					</TouchableHighlight>
                    </View>
                    <View style={commonStyles.flex1}>
                    <TouchableHighlight style={commonStyles.curtainTouchDashboard} onPress={() => {
                            this.runCurtain(Commands.CURTAIN_STOP, 1)
                        }}>
						<Image source={require('../Common/img/curtain-light-stop.png')} style={commonStyles.curtainAction} />
					</TouchableHighlight>
				</View>
				<View style={commonStyles.flex1} >
					<TouchableHighlight style={commonStyles.curtainTouchDashboard} onPress={() => {
						this.runCurtain(Commands.CURTAIN_CLOSE, 1)
					}}>
						<Image source={require('../Common/img/common-light-closecurtain.png')} style={commonStyles.curtainAction} />
					</TouchableHighlight>
				</View>
			</View>
		)
	}
}

class ThermometerItem extends React.PureComponent {
	constructor(props) {
		super(props)
		//	          console.log("Thermometerrrrrrrrrrrrrrrrrrrr 1"+this.props.id+"---"+selectedThermometer)
		item = new Object()

		this.state = {
			key: this.props.id,
			id: this.props.id,
		}


	}

	render() {
		return (
			<View style={commonStyles.flex1}>
				<View key={this.state.key} style={commonStyles.thermometerDashboardView(i18n.t('common:dir'))}>
					<Image source={require("../Common/img/common-light-thermometer.png")} style={commonStyles.thermometerImageDashboard} />
					<View style={commonStyles.height100} >
						<Text style={commonStyles.tempDashboard(i18n.t('common:dir'))}>{this.props.thermometers[this.props.id - 1].temp}{"\u00b0 c"}</Text>
					</View>
				</View>
			</View>
		)
	}
}

// Thermostats in Thermostat tab
class ThermometerItemList extends React.PureComponent {

	constructor(props) {
		super(props)
		//	          console.log("Thermometerrr Listtttt: id: "+this.props.id+"---on: "+this.props.on+"---refTemp: "+this.props.refTemp+"---temp: "+this.props.temp+"---mode: "+this.props.modeType+"---speed: "+this.props.speed)
		first = 1
		this.state = {
			key: this.props.id,
			id: this.props.id,
			item: item,
			on: this.props.on,
			refTemp: this.props.refTemp,
			temp: this.props.temp,
			modeType: this.props.modeType,
			speed: this.props.speed,
			summary: true,
			arrowName: "arrow-drop-down",
		}

		//		this.componentDidMount = this.componentDidMount.bind(this)

	}



	componentDidUpdate(prevProps, prevState) {
		//todo: Add changing timer
		//          	console.log("------------------------"+ clickTherm)
		//          	console.log("updateee:   ----prop on: "+ this.props.on +"--state on: " + this.state.on + "--state modetype: " +
		//          	                    this.state.modeType + "--propmodetype: " + this.props.modeType+"-----speed:" +
		//          	                    this.props.speed +"---state speed: " + this.state.speed +"----click : "+clickTherm)

		if (clickTherm == 0) {
			//			console.log("click therm "+(this.state.refTemp !== this.props.refTemp))
			if (this.state.refTemp !== this.props.refTemp) {
				this.setState({ refTemp: this.props.refTemp });
			}

			if (this.state.on !== this.props.on) {
//				console.log("change ON in click therm: id: " + this.props.id + "--- state on: " + this.state.on + " ---props on: " + this.props.on)
				this.setState({ on: this.props.on });
			}

			if (this.state.modeType !== this.props.modeType) {
//				console.log("aaa: " + this.state.modeType + "---" + this.props.modeType)
				//                                        this.setState({modeType: this.props.modeType},
				//                                        () => {
				clickTherm = 1
				//					mode = parseInt(this.props.modeType)
				//					console.log("mode: " + this.props.modeType + "--" + first)
				//					if(first == 0){
				//						console.log("Change ref : id: " + this.props.id)

				//  In the first loading, refs is null
				// the first value of radio mode , updated from props
				// We should set click therm to 1, because of  states
				if (this.refs.refRadioModeType != null) {
//					console.log("IS NOT NULLLL id: " + this.props.id + "---" + this.props.modeType)
					this.refs.refRadioModeType.updateIsActiveIndex(this.props.modeType);
				}
				else {
//					console.log("IS NULLLL id: " + this.props.id + "---" + this.props.modeType)
				}

				this.setState({ modeType: this.props.modeType }, () => {
					clickTherm = 0
//					console.log("End radio change.... " + this.state.modeType)
				})
				//	                                        }
				//	                                        else{
				//	                                                  first = 0
				//	                                                  clickTherm = 0
				//	                                        }

//				console.log("this.props: " + this.props.modeType + "---" + this.state.modeType)
				//                                        });
			}
			//                                else{
			//                                        console.log("id: " + this.props.id + "--first: " + first)
			//                                        if(first == 1) {first = 0}
			//                                }

			if (this.state.speed !== this.props.speed) {
				this.setState({ speed: this.props.speed });
			}
		}

	}

	changeState(on, refTemp, modeType, speed, retry) {
		params1 = new Array();

		getResponse = 0
		getError = 0
		timeout = ""

		if (!retry && retry != 0) { retry = 1 }

		item = this.props.item
		stopUpdate = 1;
		params1[0] = item.type_id;
		params1[1] = item.type;
		params1[2] = (on == true) ? 1 : 0;
		params1[3] = (refTemp + thermometer.THERMOMETER_OFFSET)
		params1[4] = modeType
		params1[5] = speed

//		console.log("Params change state: " + params1[0] + "-" + params1[1] + "-" + params1[2] + "-" + params1[3] + "-" + params1[4] + "-" + params1[5])

		udpState = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_THERMOS_TABLET_ONOFF, params1)
		udpState.sendUdpPacket("", "", true).then(
			dataTherm => {
				//                                        console.log("Response from change state: " + dataTherm[6] +"-")

				if (dataTherm[6] == 1) {
					disabledBtn = false
					getResponse = 1
					stopUpdate = 0

					if (timeout != "") { clearTimeout(timeout) }
				}
				else {
					//                                                  console.log("Response frErrorrrr from "+dataTherm[2])
				}
			}
		)
			.catch(error => {
				getError = 1
//				console.log("Error in on thermometerrrrr " + error)
			})

		timeoutRetryTherm = (selectedConnection == 0) ? 700 : 2500
		timeout = setTimeout(() => {
			if ((getResponse == 0 && getError == 0) || (getError == 1)) {
				if (retry > 0) {
					this.changeState(on, refTemp, modeType, speed, retry - 1)
				}
				else {
					//					console.log("Thermometer switch not update ")
					stopUpdate = 0
					disabledBtn = false
				}
			}
		}, timeoutRetryTherm);
	}

	render() {
		var radioTherm = [
			{ label: i18n.t('thermometer:summer'), value: 0 }, // Cooling
			{ label: i18n.t('thermometer:winter'), value: 1 }, // Heating
		];

		return (
			<View style={commonStyles.thermometerItemDashboard(i18n.t('common:dir'))} key={this.props.id}>
				<View style={commonStyles.flexRow(i18n.t('common:dir'))}>
					<View style={commonStyles.flexRow(i18n.t('common:dir'))}>
						<TouchableHighlight style={commonStyles.thermArrowDashboard(i18n.t('common:dir'))}
							onPress={() => this.setState({ summary: !this.state.summary, arrowName: (this.state.arrowName == "arrow-drop-up") ? "arrow-drop-down" : "arrow-drop-up" })} >
							<Icon
								size={50}
								color={'#fff'}
								name={this.state.arrowName}
							/>
						</TouchableHighlight>
						{(screenWidth > 400) ?
							<TouchableHighlight style={commonStyles.thermSettingDashboard(i18n.t('common:dir'))} onPress={() => this.props.navigation.navigate('ThermometerSetting', { item: this.props.item, fromPage: "Dashboard" })} >
								<Icon
									size={30}
									color={'#fff'}
									name={"settings"}
								/>
							</TouchableHighlight>
							: null}

						<TouchableHighlight onPress={() => { selectedThermometer = this.props.id }}  >
							<View style={commonStyles.thermViewDashboard(i18n.t('common:dir'))} >
								<Text style={commonStyles.thermTitleDashboard(i18n.t('common:dir'))} >{this.props.title}</Text>
							</View>
						</TouchableHighlight>
						{(this.state.summary) ?
							<View style={(screenWidth < 450) ? { width: 100 } : { width: 150 }} >
								<Text style={commonStyles.tempDashboardSummary(i18n.t('common:dir'))}>{this.props.thermometers[this.props.id - 1].temp}{"\u00b0 c"}</Text>
							</View>
							: null}
					</View>

					<View style={commonStyles.thermOnDashboard(i18n.t('common:dir'))}>
						<Switch
							trackColor={{ false: "#767577", true: "#d094ea" }}
							thumbColor={this.state.on ? "#ff2a62" : "#f4f3f4"}
							onValueChange={(val) => {
								clickTherm = 1
//								console.log("change switch: " + this.state.on + "--- selected value: " + val)
								this.setState({ on: val }, () => {
									this.changeState(val, this.state.refTemp, this.state.modeType, this.state.speed, 3)
									clickTherm = 0
								})
							}}
							value={this.state.on}
						/>
						<Text style={(screenWidth < 450 || (screenHeight < screenWidth)) ? commonStyles.displayNone : commonStyles.onOffTitleDashboard(i18n.t('common:dir'))} >{i18n.t('thermometer:onOff')}</Text>
					</View>
				</View>
				{(!this.state.summary) ? (
					<View>
						<View style={commonStyles.line} />

						<View style={commonStyles.flexRow(i18n.t("common:dir"))}>
							<View style={commonStyles.listRadioTherm(i18n.t('common:dir'))}>
								<RadioForm
									radio_props={radioTherm}
									animation={false}
									ref="refRadioModeType"
									labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
									initial={this.props.modeType}
									formHorizontal={true}
									onPress={(value, index) => {
										//	                                                                                console.log("valueeee: " +radioTherm[index].value)
										if (clickTherm != 1) {
											clickTherm = 1
//											console.log("valueeee: " + value)
											this.setState({ modeType: radioTherm[index].value }, () => {
												//	                                                                                          console.log("2 change value: "+this.state.modeType)
												this.changeState(this.state.on, this.state.refTemp, radioTherm[index].value, this.state.speed, 3)
												//		                                                                                console.log("3 change value: "+this.state.modeType)
												clickTherm = 0
											})
										}
										//                                                                                else{
										//                                                                                          this.setState({modeType: radioTherm[index].value}, () => {
										//                                                                                                    clickTherm = 0
										//                                                                                                    console.log("End radio change.... " + this.state.modeType)
										//                                                                                          })
										//                                                                                }
									}}
								/>
							</View>

							<View style={commonStyles.tempDashboardHolder(i18n.t('common:dir'))}>
								<Text style={commonStyles.tempDashboardList(i18n.t('common:dir'))}>{this.props.thermometers[this.props.id - 1].temp}{"\u00b0 c"}</Text>
							</View>
						</View>

						<View style={commonStyles.line} />

						<View style={commonStyles.flexRowTherm(i18n.t("common:dir"))}>
							<Text style={commonStyles.txtItemLabelRefTemp(i18n.t('common:dir'))}>{i18n.t('thermometer:referenceTemp')}</Text>
							<View style={commonStyles.flex3Row(i18n.t('common:dir'))}>
								<TouchableHighlight style={commonStyles.changeTemp}
									disabled={this.state.disabledBtn}
									onPress={() => {
										newRef = this.state.refTemp + 1
										clickTherm = 1
										disabledBtn = false
										this.setState({ refTemp: newRef }, () => {
											this.changeState(this.state.on, newRef, this.state.modeType, this.state.speed, 3)
											clickTherm = 0
										})
									}} >
									<Icon
										size={50}
										color={'#80628d'}
										name={"keyboard-arrow-right"}
									/>
								</TouchableHighlight>
								<Text style={commonStyles.refTempDashboardList(i18n.t('common:dir'))}>{this.state.refTemp}{"\u00b0 c"}</Text>
								<TouchableHighlight style={commonStyles.changeTemp}
									disabled={this.state.disabledBtn}
									onPress={() => {
									    newRef = 0
										newRef = this.state.refTemp - 1
										clickTherm = 1
										disabledBtn = true
										this.setState({ refTemp: newRef }, () => {
											this.changeState(this.state.on, newRef, this.state.modeType, this.state.speed, 3)
											clickTherm = 0
										})
									}} >
									<Icon
										size={50}
										color={'#80628d'}
										name={"keyboard-arrow-left"}
									/>
								</TouchableHighlight>

							</View>
						</View>

						<View style={commonStyles.line} />

						<View style={commonStyles.flexRowTherm(i18n.t("common:dir"))}>
							<View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
								<Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t("thermometer:fan")}</Text>
								<View style={commonStyles.pickerHolderTherm(i18n.t('common:dir'))}>

								<Picker
									selectedValue={this.state.speed}
									style={commonStyles.pickerThermSpeed}
									onValueChange={(itemValue, itemIndex) => {
										clickTherm = 1
										this.setState({ speed: itemValue }, () => {
											//                                                                                console.log("2 change picker: "+this.state.speed)
											this.changeState(this.state.on, this.state.refTemp, this.state.modeType, itemValue, 3)
											//                                                                                 console.log("3 change picker: "+this.state.speed)
											clickTherm = 0
										})
									}
									}>
									<Picker.Item label={i18n.t('thermometer:auto')} value={0} key={0} />
									<Picker.Item label={i18n.t("thermometer:fan") + " " + 1} value={1} key={1} />
									<Picker.Item label={i18n.t("thermometer:fan") + " " + 2} value={2} key={2} />
									<Picker.Item label={i18n.t("thermometer:fan") + " " + 3} value={3} key={3} />
								</Picker>
								</View>
							</View>
						</View>
					</View>
				) : null}

			</View>
		)
	}
}

export class Dashboard extends React.PureComponent {

    backAction = () => {

      if(this.props.navigation.isFocused()){
         Alert.alert(
           "",
           i18n.t('common:exitApp'),
           [
             {
               text: i18n.t('common:cancel'),
               onPress: () => null,
               style: "cancel"
             },
             { text: i18n.t('common:yes'), onPress: () => {
                BackHandler.exitApp();
                }
             }
           ],
           { cancelable: false }
      );
      }
      else{
        this.props.navigation.goBack(null)
      }
      return true;
    };
	constructor(props) {
		super(props);
		this.state = {
			language: i18n.language,
			locations: "",
			scenarios: "",
			outputs: "",
			sliderVal: 0,
			intervalId: 0,
			thermomtersFilter: "",
			thermometers: "",
			schedules: "",
			curtains: "",
			rgbs: "",
			selectedLocation: 0,
			shouldUpdate: true,
			tabId: 1,
			spinner: false,
			selectedThermometer: 1, // todo: change to first thermostat in Location
			disabled: false,
			arrowSchedule: "arrow-drop-down"
		}

		//    this.stopUpdate = 0;
		this.stopTempUpdate = 1

		this.updateInterval = null;
		this.unmount = this.unmount.bind(this);
		this.getAllThermometers = this.getAllThermometers.bind(this);
		this.getAllSchedules = this.getAllSchedules.bind(this);
		this.getAllOutputs = this.getAllOutputs.bind(this)
		this.getAllLocations = this.getAllLocations.bind(this)
		this.getAllCurtains = this.getAllCurtains.bind(this)
		this.getLocations = this.getLocations.bind(this)
		this.getAllRGBs = this.getAllRGBs.bind(this)
		// this.handleDisableOutput = this.handleDisableOutput.bind(this)
		// this.getAllLocations = this.getAllItems.bind(this)

		output = new Output()


		//    console.log("in constructorrrrrrrrrrrrrrrrrrrrrrrrrrrr")
	}

	getAllScenarios() {
		// Get all Scenarios from DB
		ZagrosDB.buildQuery(Vars.querySelect, "Scenario", "", "show_home = 1 AND status = 1 ", "", "", "", 1).then(
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

	getAllOutputs() {
		return new Promise((resolve, reject) => {
			ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
				data => {
					//todo: should be deletd
					for (i = 0; i < data.length; i++) {
						data[i].value = 0
					}
					this.setState({
						outputs: data
					}, () => {
						resolve(true)
					})



					//  alert(data[0].id)
				}
			)
				.catch(
					error => {
//						console.log("Error in get allll outputssssssssssssssss: " + error)
						reject(error)
						alert(this.props.t("output:errorGetOutputDataFromDB"));
					}
				)
		})

	}

	getAllThermometers() {
		ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "", "", "", "", "", 1).then(
			dataTherm => {
				for (i = 0; i < dataTherm.length; i++) {
					dataTherm[i].on = false
					dataTherm[i].modeType = 0
					dataTherm[i].temp = 0
					dataTherm[i].refTemp = 0
					dataTherm[i].speed = 0

				}

				this.setState({
					thermometers: dataTherm,
				})
			}
		)
			.catch(
				error => {
					console.log("Errrorrrrrrrrrrr in TEmpppppppppp: " + error)
					alert(this.props.t("thermometer:errorGetAllThermometers"));
				}
			)
	}

	getAllSchedules() {
		ZagrosDB.buildQuery(Vars.querySelect, "Schedule", "", "", "", "", "", 1).then(
			dataSchedule => {
				this.setState({
					schedules: dataSchedule
				})

			}
		)
			.catch(
				error => {
					alert(this.props.t("schedule:errorGetAllSchedules"));
				}
			)
	}

	getAllRGBs() {
		ZagrosDB.buildQuery(Vars.querySelect, "RGB", "", "", "", "", "", 1).then(
			dataRGB => {
				for (i = 0; i < dataRGB.length; i++) {
					dataRGB[i].color = "#ff0096"
					dataRGB[i].mode = 0
					dataRGB[i].speed = 0
					//              console.log("therm: " + dataTherm[i].title +"-"+dataTherm[i].status)
				}
				this.setState({
					rgbs: dataRGB
				})
			}
		)
			.catch(
				error => {
				console.log("error rgb: "+error)
//					alert(this.props.t("rgb:errorGetAllRGBsFromDB"));
				}
			)
	}

	getAllLocations() {
		// Get all Locations from DB
		ZagrosDB.buildQuery(Vars.querySelect, "Location", "", "show_home = 1", "", "", "", 1).then(
			data => {

				//               console.log("locationssssssssssssssss:"+"-----"+data +"---" +(data == null))
				this.setState({
					locations: data,
					selectedLocation: (data != false) ? data[0].id : 0
				})
			}
		)
			.catch(
				error => {
					//                    console.log("Errror in locations in dashboard : "+error)
					alert(this.props.t("location:errorGetLocationFromDB"));
				}
			)
	}

	getAllCurtains() {
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
//					console.log("Error in get curtainssss : " + error)
					alert(this.props.t("location:errorGetLocationFromDB"));
				}
			)
	}

	componentDidMount() {
		this.updateInterval = null;

		this.getAllItems();
		this.props.navigation.addListener('willFocus', this._handleStateChange);
		this.props.navigation.addListener('didBlur', this.unmount);
		 BackHandler.addEventListener("hardwareBackPress", this.backAction);

		//	   console.log("aaaa"+"in component did mounttttttttttttttttttt")
	}

	componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backAction);
    }

	//  componentWillMount() { BackAndroid.addEventListener('hardwareBackPress', () => {return true}); }

	unmount() {
		clearInterval(this.state.intervalId)
		this.updateInterval = null
	}

	_handleStateChange = state => {
		this.getAllItems()
	};

	getAllItems() {

		clickTherm = 0
		disabledBtn = false
		this.getAllLocations();
		this.getAllCurtains();
		this.getAllOutputs().then(
			(dout) => {
				this.getAllScenarios();
				this.getAllThermometers();
				this.getAllSchedules()
				this.getAllRGBs()
				this.setState({ shouldUpdate: false })

				tryUpdate = 0;
				tempCounter = 0;

				this.updateOutputs();
				this.updateThermometers()
				this.updateRGBs()

				intervalUpdate = (selectedConnection == 0) ? 1250 : 4000
				this.updateInterval = setInterval(() => {
					tempCounter++
//					console.log("intervalll: " + tempCounter + "---- stopUpdate: " + stopUpdate)

					if (stopUpdate == 0) {
						if (selectedTab == 4) { // Thermostat TAB
							tempCounter = 0
							this.updateThermometers(1)
						}
						else if (selectedTab == 2) { // RGB TAB
							if (tempCounter >= 2) {
								tempCounter = 0
								this.updateRGBs(0)
							}
						}
						else { // outputs TAB
							if (tempCounter >= 60) {
								tempCounter = 0
								this.updateThermometers()
							}
							else {
								this.updateOutputs();
							}
						}
					}
					else {
						tempCounter++
//						console.log("STOP UPDATE eeeeeeeeeee: " + inClickOutput + "---"+stopUpdate)
						if (inClickOutput == 0 && tempCounter > 10) {
							stopUpdate = 0
							tempCounter = 0
							this.updateOutputs();
						}
					}
				}, intervalUpdate);

				this.setState({
					intervalId: this.updateInterval
				})

			}
		)


	}

	showLocation(location_id) {
		if (location_id === this.state.selectedLocation) {
			return "flex"
		}
		else {
			return "none"
		}
	}

	updateOutputs() {
		stopUpdate = 1
		inUpdateOutputs = 1
		interruptUpdate = 0
//		console.log("INNN Outputsssss...")
//		start = new Date().getTime()
		output.getOutputsFromController(this.state.outputs).then(
			outputsData => {
				outputsUpdated = 0
//				end = new Date().getTime()

//				console.log("time: " + (end-start))

				if (outputsData == false) {
					stopUpdate = 0
					inUpdateOutputs = 0
				}
				else {
					if (interruptUpdate == 0) {
//						console.log("UPDATE STATESSSS: interrupt: " + interruptUpdate +"--")
						outputsUpdated = 1
						this.setState({
							outputs: outputsData,
						}, () => {
							inUpdateOutputs = 0
							interruptUpdate = 0
						});
					}
					stopUpdate = 0
				}

			})
			.catch(error => {
//				console.log("error in update outputttttttttttttttt: " + error)
				stopUpdate = 0
				inUpdateOutputs = 0
				interruptUpdate = 0
			})
	}

	updateThermometers(retry) {
		if (!retry && (retry != 0)) { retry = 2 }
		getResponse = 0
		getError = 0
		timeout = ""
//		console.log("IIIIn THERMOMETERSSSSS: " + selectedTab);
		stopUpdate = 1
		thermometer = new Thermometer()

		udpTherm = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_GET, "");
		udpTherm.sendUdpPacket("", "", true).then(
			dataTempUdp => {
				getResponse = 1
				if (timeout != "") { clearTimeout(timeout) }
				dataTemp = new Array();
				CommonFunctions.arrayCopy(dataTempUdp, 4, dataTemp, 0, dataTempUdp.length - 4);

				//	             console.log("Thermometerrrrrrrrrrr "+dataTemp[0]+"-"+dataTemp[1]+"-"+dataTemp[2]+"-"+dataTemp[3] + "-" +
				//	             +dataTemp[4]+"-"+dataTemp[5]+"-"+dataTemp[6]+"-"+dataTemp[7]+"-"+dataTemp[8]+"-"+dataTemp[9]+"-"
				//	             +dataTemp[10]+"-"+dataTemp[11]+"-"+dataTemp[12]+"-"+dataTemp[13]+"-"+dataTemp[14]+"-"+dataTemp[15]+"-"
				//	             +dataTemp[16]+"-"+dataTemp[17]+"-"+dataTemp[18]+"-"+dataTemp[19]+"-"+dataTemp[20]+"-"
				//	             +dataTemp[21]+"-"+dataTemp[22]+"-"+dataTemp[23]+"-"+dataTemp[24]+"-"+dataTemp[25]+"-"
				//	             +dataTemp[26]+"-"+dataTemp[27]+"-"+dataTemp[28]+"-"+dataTemp[29]+"-"+dataTemp[30]+"-"+dataTemp[31]+"-"
				//	             +dataTemp[32]+"-"+dataTemp[33]+"-"+dataTemp[34]+"-"+dataTemp[35]+"-"+dataTemp[36]+"-"+dataTemp[37]+"-"
				//	             +dataTemp[38]+"-"+dataTemp[39]+"-"+dataTemp[40]+"-"+dataTemp[41]+"-"+dataTemp[42]+"-"
				//	             +dataTemp[43]+"-"+dataTemp[44]+"-"+dataTemp[45]+"-"+dataTemp[46]+"-")

				thermometersArray = [...this.state.thermometers];
				// console.log("Thermometer arrayyyyyyyyyyy : " +thermometersArray)

				j = 0;
				// for(i=0; i<dataOut.length; i++){
				//     outputsArray[j].value = dataOut[i];
				//     outputsArray[j].timer = dataOut[++i];
				//     j++;
				// }

				// console.log("Therm len: "+ thermometersArray.length + "---" + dataTemp.length)
				//                    temp = 0;
				//                      refTemp = 0
				//                      status = 0;
				//                      on = false
				//                      speed = 0
				//                      modeType = 0

				to = dataTemp.length - 2
				for (i = 0; i < to; i++) {
					temp = 0;
					refTemp = 0
					status = 0;
					on = false
					speed = 0
					modeType = 0

					if ((dataTemp[i] & 1) != 0) {

						if ((dataTemp[i] & 0x10) == 0x10) {
							on = true;
						}

						status = 1;
						speed = dataTemp[i] >> 5
						modeType = ((dataTemp[i] & 0x08) == 0x08) ? 1 : 0
						//			console.log("modeeee: " + modeType)

						// Byte 2
						i++;
						thermometersArray[j].temp = dataTemp[i] - thermometer.THERMOMETER_OFFSET;

						// Byte 3
						i++
						thermometersArray[j].refTemp = dataTemp[i] - thermometer.THERMOMETER_OFFSET;

						thermometersArray[j].status = status;
						thermometersArray[j].on = on;
						thermometersArray[j].speed = speed;
						thermometersArray[j].modeType = modeType;

						//			console.log("Therm id: " + (j+1) + "--on:" + on +"--temp:" + thermometersArray[j].temp + "--rtemp:" + thermometersArray[j].refTemp +"-speed: " + speed + "-mode: " + modeType)

						// todo: if therm num more than 10, do something

					} else {
						i = i + 2;
						thermometersArray[j].temp = temp;
						thermometersArray[j].refTemp = refTemp;
						thermometersArray[j].on = on;
						thermometersArray[j].status = status;
						thermometersArray[j].speed = speed;
						thermometersArray[j].modeType = modeType;
					}


					j++;
				}

				this.setState({
					thermometers: thermometersArray,
				}, () => {
					//	                    console.log(this.state.thermometers[3].title +"---" + this.state.thermometers[3].temp)
					stopUpdate = 0
				})
			}
		).catch(error => {
//			console.log("error in update thermometer dashboard: " + error)
			getError = 1
		})

//		if (getResponse != 1 && getError != 1) {
//			timeout = setTimeout(() => {
//				if ((getResponse == 0 && getError == 0) || (getError == 1)) {
//					if (retry > 0) {
//						//	                              console.log("update therm in retry: " + retry)
//						this.updateThermometers(retry - 1)
//					}
//					else {
////						console.log("Thermometer not update ")
//						stopUpdate = 0
//					}
//				}
//			}, 800);
//		}

	}

	updateRGBs(retry) {
		if (!retry && (retry != 0)) { retry = 2 }
		getResponse = 0
		getError = 0
		timeout = ""
//		console.log("IIIIn RGBS: ");
		stopUpdate = 1
		rgb = new RGB()

		udpRGB = new UDP(Commands.REQ_TABLET_MB_COM, Commands.FLAG_RGB_GET, "");
		udpRGB.sendUdpPacket("", "", true, 1200).then(
			dataRGBUdp => {
				getResponse = 1
				if (timeout != "") { clearTimeout(timeout) }
				dataRGB = new Array();
				CommonFunctions.arrayCopy(dataRGBUdp, 4, dataRGB, 0, dataRGBUdp.length - 4);

//                 console.log("RBGSsss:::: "+dataRGB[0]+"-"+dataRGB[1]+"-"+dataRGB[2]+"-"+dataRGB[3] + "-" +
//                 +dataRGB[4]+"-"+dataRGB[5]+"-"+dataRGB[6]+"-"+dataRGB[7]+"-"+dataRGB[8]+"-"+dataRGB[9]+"-"
//                 +dataRGB[10]+"-"+dataRGB[11]+"-"+dataRGB[12]+"-"+dataRGB[13]+"-"+dataRGB[14]+"-"+dataRGB[15]+"-"
//                 +dataRGB[16]+"-"+dataRGB[17]+"-"+dataRGB[18]+"-"+dataRGB[19]+"-"+dataRGB[20]+"-"
//                 +dataRGB[21]+"-"+dataRGB[22]+"-"+dataRGB[23]+"-"+dataRGB[24]+"-"+dataRGB[25]+"-"
//                 +dataRGB[26]+"-"+dataRGB[27]+"-"+dataRGB[28]+"-"+dataRGB[29]+"-"+dataRGB[30]+"-"+dataRGB[31]+"-"
//                 +dataRGB[32]+"-"+dataRGB[33]+"-"+dataRGB[34]+"-"+dataRGB[35]+"-"+dataRGB[36]+"-"+dataRGB[37]+"-"
//                 +dataRGB[38]+"-"+dataRGB[39]+"-"+dataRGB[40]+"-"+dataRGB[41]+"-"+dataRGB[42]+"-"
//                 +dataRGB[43]+"-"+dataRGB[44]+"-"+dataRGB[45]+"-"+dataRGB[46]+"-"+"-----------------")

				rgbArray = [...this.state.rgbs];
				// console.log("Thermometer arrayyyyyyyyyyy : " +rgbArray)


				to = dataRGB.length - 2
				j = 0;

				for (i = 0; i < to; i++) {
					mode = 0;
					r = ""
					g = ""
					b = ""
					color = '#ff0096'
					speed = 0

					mode = dataRGB[i]
					i++;
					r = String(dataRGB[i])
                    console.log()
					i++
					g = String(dataRGB[i])
					i++
					b = String(dataRGB[i])
					i++
					rgbArray[j].speed = dataRGB[i];
					rgbArray[j].mode = mode

					//			col = (r != 0 && g != 0 && b != 0) ? tinycolor("rgb("+r+", "+g+", "+b+")").toHexString() : "#ff0096"
					rgbArray[j].color = ((r != "" && g != "" && b != "") && (mode != 0)) ? tinycolor("rgb(" + r + ", " + g + ", " + b + ")").toHexString() : "#ff0096"

//                    if(j == 0){
//					console.log("id: " + (j+1) +"--Color: " + rgbArray[j].color +"--speed: " + rgbArray[j].speed + "--mode: " + rgbArray[j].mode)
//                    }

					j++;
				}

				this.setState({
					rgbs: rgbArray,
				}, () => {
					//	                    console.log(this.state.thermometers[3].title +"---" + this.state.thermometers[3].temp)
					stopUpdate = 0
				})
			}
		).catch(error => {
//			console.log("error in update rgb dashboard: " + error)
			getError = 1
			stopUpdate = 0
		})

//		if (getResponse != 1 && getError != 1) {
//			timeout = setTimeout(() => {
//				if ((getResponse == 0 && getError == 0) || (getError == 1)) {
//					if (retry > 0) {
//						//	                              console.log("update therm in retry: " + retry)
//						this.updateRGBs(retry - 1)
//					}
//					else {
////						console.log("RGB not update ")
//						stopUpdate = 0
//					}
//				}
//			}, 1000);
//		}

	}

	getLocations() {
		locations = new Array();
		locationOutput = new Array()

		locationsInDashboard = new Array()
		index = 0

		outputsItems = ({ item }) => (
			<OutputItem
				id={item.id}
				type={item.type}
				type_id={item.type_id}
				value={item.value}
				key={"out-" + item.id}
				icon={item.icon}
				name={item.name}
				dir={i18n.t('common:dir')}
				disabled={this.state.disabled}
			/>
		)

		rgbs = ({ item }) => (
			<RGBItem key={item.id}
				id={item.id}
				name={item.title}
				type_id={item.type_id}
				type={item.type}
				dir={i18n.t('common:dir')}
				color={item.color}
				speed={item.speed}
				mode={item.mode} />
		)

		locationsState = this.state.locations;
		thermometerIns = ({ item }) => (
			<ThermometerItemList
				on={item.on}
				speed={item.speed}
				refTemp={item.refTemp}
				temp={item.temp}
				modeType={item.modeType}
				id={item.id}
				key={item.id}
				title={item.title}
				item={item}
				navigation={this.props.navigation}
				thermometers={this.state.thermometers}
			/>

		)

		if (locationsState.length > 0) {
			locationsState.forEach((item) => {
				locations.push(
					<View style={(screenHeight > 650) ? commonStyles.containerLocationsView : commonStyles.containerLocationsViewHor}>
						<View key={"loc-" + item.id} style={commonStyles.flatListViewBigTitleLocations}>
							<TouchableHighlight
								onPress={() => { this.setState({ selectedLocation: item.id }) }}
								style={(screenHeight > 650) ? commonStyles.locationItemDashboard : commonStyles.locationItemDashboardHor} >
								<View style={commonStyles.locationViewItem}>
									<Image source={ImageVars.locationIconLightArray[item.icon]} style={commonStyles.locationImageItem} />
									<Text style={commonStyles.titleLocationDashboard(i18n.t('common:dir'))}>{item.title}</Text>
								</View>
							</TouchableHighlight>
						</View>
					</View>
				);

				if (this.state.outputs != "") {

					locationOutput.push(
						<View style={{ display: this.showLocation(item.id), flex: 6 }}>
							<View style={commonStyles.titleLocation(i18n.t('common:dir'))}>
								<View style={commonStyles.locationRowDashboard(i18n.t('common:dir'))}>
									<Image source={ImageVars.locationIconLightArray[item.icon]} style={commonStyles.locationTouchImg} />
									<Text style={commonStyles.titleLocationDashboard(i18n.t('common:dir'))}>{item.title}</Text>
								</View>
								<View style={commonStyles.flex1}>
									{(this.state.thermometers != "") ?
										<ThermometerItem
											thermometers={this.state.thermometers}
											locationId={item.id}
											id={selectedThermometer}
										/>
										: null
									}
								</View>
							</View>

							<View style={commonStyles.line}></View>

							<TabItem
								tab1={
									<View style={commonStyles.outputsFlatlistDashboard}>
										<FlatList
											keyExtractor={(item, index) => String("out-" + item.id)}
											data={this.state.outputs.filter((outputIns) => outputIns.location_id == item.id)}
											renderItem={outputsItems}
											horizontal={false}
											getItemLayout={(data, index) => (
												{ length: 60, offset: 60 * index, index }
											)}
										/></View>}

								tab2={(this.state.rgbs != "") ?
									<View style={commonStyles.rgbsFlatlistDashboard}>
										<FlatList
											keyExtractor={(item1, index) => String("rgb-" + item1.id)}
											data={this.state.rgbs.filter((rgbIns) => rgbIns.location_id == item.id)}
											renderItem={rgbs}
										/>
									</View>
									: null}

								tab4={
									(this.state.thermometers != "") ?
										<View style={commonStyles.thermsFlatlistDashboard}>
											<FlatList
												keyExtractor={(item, index) => String("thrm-" + item.id)}
												data={this.state.thermometers.filter((thermIns) => thermIns.location_id == item.id)}
												renderItem={thermometerIns}
												horizontal={false}
												getItemLayout={(data, index) => (
													{ length: 60, offset: 60 * index, index }
												)}
											/>
										</View>
										: null
								}

								styleTab2={commonStyles.tab1Second(i18n.t('common:dir'))}

								styleTab1={commonStyles.tab1First(i18n.t('common:dir'))}


								viewStyle={commonStyles.viewTabStyleTop(i18n.t('common:dir'))}

								containerStyle={commonStyles.containerStyle}
								tab1Text={i18n.t("output:output")}
								tab2Text={i18n.t("rgb:rgb")}
								activeTabColor={'#eae5ec'}
								inActiveTabColor={'rgba(135,110,144,0.58)'}
								tabId={2}
							/>
						</View>
					)
				}

			})

			curtains = ({ item }) => (
				<CurtainItem
					id={item.id}
					title={item.title}
					type_id={item.type_id}
					type={item.type}
				/>
			);

			locationsInDashboard.push(
				<View style={(screenHeight > 650) ? commonStyles.containerLocationsList : commonStyles.containerLocationsListHor}>
						<ScrollView horizontal={true}>{locations}</ScrollView>
				</View>
			)

			locationsInDashboard.push(
				<View style={commonStyles.line}></View>
			)

			locationsInDashboard.push(locationOutput)

			// alert("curtains: "+this.state.curtains)
			// Vertical
			locationsInDashboard.push(
				<View style={(this.state.curtains != "") ? commonStyles.curtainsFlatlistDashboard : commonStyles.displayNone}>
					<FlatList
						keyExtractor={(item, index) => String("curtain-" + item.id)}
						data={(this.state.curtains != "") ? this.state.curtains.filter((item) => item.location_id == this.state.selectedLocation) : ""}
						renderItem={curtains}
						horizontal={false}
						numColumns={2}
					/>
				</View>
			)

		}

		//    end = new Date().getTime()
		//    timespend = end - start
		//     console.log("end Loading: " + timespend);
		return locationsInDashboard;

	}

	getLocationsHorizontal() {
		locations = new Array();
		locationOutput = new Array()

		locationsInDashboard = new Array()
		index = 0

		outputsItems = ({ item }) => (
			<OutputItem
				id={item.id}
				type={item.type}
				type_id={item.type_id}
				value={item.value}
				key={"out-" + item.id}
				icon={item.icon}
				name={item.name}
				dir={i18n.t('common:dir')}
			/>
		)

		rgbs = ({ item }) => (
			<RGBItem key={item.id} id={item.id} name={item.title} type_id={item.type_id} type={item.type} dir={i18n.t('common:dir')} color={item.color}
				speed={item.speed} mode={item.mode} />
		)

		locationsState = this.state.locations;
		thermometerIns = ({ item }) => (
			<ThermometerItemList
				on={item.on}
				speed={item.speed}
				refTemp={item.refTemp}
				temp={item.temp}
				modeType={item.modeType}
				id={item.id}
				title={item.title}
				item={item}
				key={item.id}
				thermometers={this.state.thermometers}
				navigation={this.props.navigation}
			/>

		)

		if (locationsState.length > 0) {
			locationsState.forEach((item) => {
				locations.push(
					<View>
						<View key={"loc-" + item.id} style={commonStyles.flatListViewBigTitleLocations}>
							<TouchableHighlight
								onPress={() => { this.setState({ selectedLocation: item.id }) }}
								style={commonStyles.locationItemDashboardHor} >
								<View style={commonStyles.locationViewItem}>
									<Image source={ImageVars.locationIconLightArray[item.icon]} style={commonStyles.locationImageItem} />
									<Text style={commonStyles.titleLocationDashboard(i18n.t('common:dir'))}>{item.title}</Text>
								</View>
							</TouchableHighlight>
						</View>
					</View>
				);

				if (this.state.outputs != "") {
					locationOutput.push(
						<View style={{ display: this.showLocation(item.id), flex: 6 }}>
							<View style={commonStyles.titleLocationHor(i18n.t('common:dir'))}>
								<View style={commonStyles.locationRowDashboardHor(i18n.t('common:dir'))}>
									<Image source={ImageVars.locationIconLightArray[item.icon]} style={commonStyles.locationTouchImg} />
									<Text style={commonStyles.titleLocationHorDashboard(i18n.t('common:dir'))}>{item.title}</Text>
								</View>
								{(this.state.curtains != "") ?
									<View style={commonStyles.flex2}>
										<View style={(this.state.curtains != "") ? commonStyles.curtainsFlatlistDashboardHor : commonStyles.displayNone}>
											<FlatList
												keyExtractor={(item, index) => String("curtain-" + item.id)}
												data={(this.state.curtains != "") ? this.state.curtains.filter((item) => item.location_id == this.state.selectedLocation) : ""}
												renderItem={curtains}
												horizontal={false}
												numColumns={1}
											/>
										</View>
									</View>
									: null}
								<View style={{ flex: 1 }}>
									{(this.state.thermometers != "") ?
										<ThermometerItem
											thermometers={this.state.thermometers}
											locationId={item.id}
											id={selectedThermometer}
										/>
										: null
									}
								</View>
							</View>

							<View style={commonStyles.line}></View>


							<TabItem
								tab1={
									<View style={commonStyles.outputsFlatlistDashboardHor}>
										<FlatList
											keyExtractor={(item, index) => String("out-" + item.id)}
											data={this.state.outputs.filter((outputIns) => outputIns.location_id == item.id)}
											renderItem={outputsItems}
											horizontal={false}
											numColumns={4}
										/></View>}

								tab2={(this.state.rgbs != "") ?
									<View style={commonStyles.rgbsFlatlistDashboard}>
										<FlatList
											keyExtractor={(item1, index) => String("rgb-" + item1.id)}
											data={this.state.rgbs.filter((rgbIns) => rgbIns.location_id == item.id)}
											renderItem={rgbs}
										/>
									</View>
									: null}

								tab4={
									(this.state.thermometers != "") ?
										<View style={commonStyles.thermsFlatlistDashboardHor}>
											<FlatList
												keyExtractor={(item, index) => String("thrm-" + item.id)}
												data={this.state.thermometers.filter((thermIns) => thermIns.location_id == item.id)}
												renderItem={thermometerIns}
												horizontal={false}
												getItemLayout={(data, index) => (
													{ length: 60, offset: 60 * index, index }
												)}
											/>
										</View>
										: null
								}

								styleTab2={commonStyles.tab1SecondHor(i18n.t('common:dir'))}

								styleTab1={commonStyles.tab1FirstHor(i18n.t('common:dir'))}

								viewStyle={commonStyles.viewTabStyleHor(i18n.t('common:dir'))}

								containerStyle={commonStyles.containerStyleHor}
								tab1Text={i18n.t("output:output")}
								tab2Text={i18n.t("rgb:rgb")}
								activeTabColor={'#eae5ec'}
								inActiveTabColor={'rgba(135,110,144,0.58)'}
								tabId={2}
							/>
						</View>
					)
				}

			})

			// Horizontal
			curtains = ({ item }) => (
				<CurtainItem
					id={item.id}
					title={item.title}
					type_id={item.type_id}
					type={item.type}
				/>
			);

			locationsInDashboard.push(
				<View style={commonStyles.containerLocationsListHor}>
						{locations}
				</View>
			)

			locationsInDashboard.push(
				<View style={commonStyles.line}></View>
			)

			locationsInDashboard.push(locationOutput)

			// alert("curtains: "+this.state.curtains)
			//           locationsInDashboard.push(
			//             <View style={(this.state.curtains != "") ? commonStyles.curtainsFlatlistDashboard : commonStyles.displayNone}>
			//               <FlatList
			//                   keyExtractor={(item, index) => String("curtain-"+item.id)}
			//                   data={(this.state.curtains != "") ? this.state.curtains.filter((item) => item.location_id == this.state.selectedLocation) : ""}
			//                   renderItem={curtains}
			//                   horizontal={false}
			//                   numColumns={2}
			//               />
			//           </View>
			//           )

		}

		//    end = new Date().getTime()
		//    timespend = end - start
		//     console.log("end Loading: " + timespend);
		return locationsInDashboard;

	}

	render() {
		outputIns = new Output()

		scenarios = ({ item }) => (
			<ScenarioItem
				id={item.id}
				title={item.title}
				icon={item.icon}
			/>
		);

		schedules = ({ item }) => (
			<View style={commonStyles.scheduleItemDashboard(i18n.t('common:dir'))}>
				<View style={commonStyles.scheduleViewDashboard(i18n.t('common:dir'))} >
					<Text style={commonStyles.scheduleTitleDashboard(i18n.t('common:dir'))} >{item.title}</Text>
				</View>
				<TouchableHighlight style={commonStyles.scheduleSettingDashboard(i18n.t('common:dir'))} onPress={() => this.props.navigation.navigate('ScheduleSetting', { item: item, fromPage: "Dashboard" })}>
					<Icon
						size={30}
						color={'#fff'}
						name={"settings"}
					/>
				</TouchableHighlight>
			</View>
		)

		return (
			<View>
				{(screenWidth > screenHeight) ?
					<LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.locationHeightHor} >
						<View style={commonStyles.flexRow(i18n.t("common:dir"))} >
							<View style={commonStyles.horizontalViewPart} >
								<View style={commonStyles.flex1} >
									{this.getLocationsHorizontal()}
								</View>
							</View>



                            {(screenHeight > 400) ?
                            <View style={commonStyles.flex3}>
                             <View style={(this.state.arrowSchedule == "arrow-drop-up") ? commonStyles.horizontalViewTradingHide :
                                                                                          commonStyles.horizontalViewTrading} >
                            <TabItem
                                tab1={
                                  <View style={{flex:1, marginTop: 45, paddingLeft: 5, paddingRight:5, paddingBottom:3}}>
                                  <WebView
                                     originWhitelist={['*']}
                                     source={{ html:
                                      '<script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>'+
                                      '<script type="text/javascript">'+
                                      'var tradingview_embed_options = {};'+
                                      'tradingview_embed_options.width = "1000";'+
                                      'tradingview_embed_options.height = "700";'+
                                      'tradingview_embed_options.chart = "eX7exSwj";'+
                                      'new TradingView.chart(tradingview_embed_options);'+
                                      '</script>'
                                      }}
                                   />
                                   </View>

                                }

                                tab2={
                                   <View style={{flex:1, marginTop: 45, paddingLeft: 5, paddingRight:5}}>
                                    <WebView
                                    originWhitelist={['*']}
                                    source={{ html:
                                     '<script type="text/javascript" src="http://nerkhbox.com/webmasters/gold/Gold_5.php"></script>'+
                                     '<script type="text/javascript">'+
                                     'var tradingview_embed_options = {};'+
                                     'tradingview_embed_options.width = "1000";'+
                                     'tradingview_embed_options.height = "700";'+
                                     'tradingview_embed_options.chart = "admGhVz7";'+
                                     'new TradingView.chart(tradingview_embed_options);'+
                                     '</script>'
                                     }}
                                  />
                                  </View>
                                }


                                styleTab2={commonStyles.tab1Second(i18n.t('common:dir'))}

                                styleTab1={commonStyles.tab1First(i18n.t('common:dir'))}


                                viewStyle={commonStyles.viewTabStyleTop(i18n.t('common:dir'))}

                                containerStyle={commonStyles.containerStyle}
                                tab1Text={"Trading"}
                                tab2Text={"$"}
                                tab4Text={"$"}
                                activeTabColor={'#eae5ec'}
                                inActiveTabColor={'rgba(135,110,144,0.58)'}
                                tabId={3}
                            />
                            </View>

								{(this.state.schedules != "") ?
									<View style={(this.state.arrowSchedule == "arrow-drop-up") ? commonStyles.horizontalViewSchedulesTrading :
									                                                             commonStyles.horizontalViewSchedulesTradingHide} >
										<View >
											<TouchableHighlight
                                                onPress={() => this.setState({ arrowSchedule: (this.state.arrowSchedule == "arrow-drop-up") ? "arrow-drop-down" : "arrow-drop-up" })} >
                                                <View style={commonStyles.titleScheduleViewHorTrading(i18n.t('common:dir'))}>
                                                <Text style={commonStyles.titleScheduleHorTrading(i18n.t('common:dir'))}>{i18n.t('schedule:schedules')}</Text>

                                                <Icon
                                                    size={45}
                                                    color={'#fff'}
                                                    name={this.state.arrowSchedule}
                                                />
                                                </View>
                                            </TouchableHighlight>
										</View>

                                        {(this.state.arrowSchedule == "arrow-drop-up") ?
										<View style={commonStyles.schedulesFlatlistDashboard}>
											<FlatList
												keyExtractor={(item, index) => String("sch-" + item.id)}
												data={this.state.schedules.filter((schIns) => schIns.status == 1)}
												renderItem={schedules}
											/>
										</View>
										:
										null
										}

									</View>
									: null
								}
								<View style={commonStyles.horizontalViewScenariosTrading} >

									<FlatList
										keyExtractor={(item, index) => String(index)}
										data={this.state.scenarios}
										renderItem={scenarios}
										horizontal={true}
									/>
								</View>
							</View>
							:
							<View style={commonStyles.flex2}>
                                {(this.state.schedules != "") ?
                                    <View style={commonStyles.horizontalViewSchedules} >
                                        <View style={commonStyles.titleScenarioViewHor(i18n.t('common:dir'))}>
                                            <Text style={commonStyles.titleScenarioHor(i18n.t('common:dir'))}>{i18n.t('schedule:schedules')}</Text>
                                        </View>

                                        <View style={commonStyles.schedulesFlatlistDashboard}>
                                            <FlatList
                                                keyExtractor={(item, index) => String("sch-" + item.id)}
                                                data={this.state.schedules.filter((schIns) => schIns.status == 1)}
                                                renderItem={schedules}
                                            />
                                        </View>

                                    </View>
                                    : null
                                }
                                <View style={commonStyles.horizontalViewScenarios} >
                                    <View style={commonStyles.titleScenarioViewHor(i18n.t('common:dir'))}>
                                        <Text style={commonStyles.titleScenarioHor(i18n.t('common:dir'))}>{i18n.t('scenario:scenarios')}</Text>
                                    </View>
                                    <FlatList
                                        keyExtractor={(item, index) => String(index)}
                                        data={this.state.scenarios}
                                        renderItem={scenarios}
                                        horizontal={true}
                                    />
                                </View>
                            </View>
							}

						</View>
					</LinearGradient>
					:
					<LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.locationHeight} >
						<View>
							<TabItem
								tabId={1}

								tab1={
									<LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.locationHeight} >
										<View style={commonStyles.locationsDashboard}>
											{this.getLocations()}
										</View>
									</LinearGradient>
								}

								tab2={
									<View style={commonStyles.scheduleTab}>
										<View style={commonStyles.titleScenarioView(i18n.t('common:dir'))}>
											<Text style={commonStyles.titleScenario(i18n.t('common:dir'))}>{i18n.t('schedule:schedules')}</Text>
										</View>
										{(this.state.schedules != "") ?

											<View style={commonStyles.schedulesFlatlistDashboard}>
												<FlatList
													keyExtractor={(item, index) => String("sch-" + item.id)}
													data={this.state.schedules.filter((schIns) => schIns.status == 1)}
													renderItem={schedules}
													horizontal={false}
													getItemLayout={(data, index) => (
														{ length: 60, offset: 60 * index, index }
													)}
												/>
											</View>
											: null
										}

									</View>
								}

								tab3={
									<View style={commonStyles.scenarioTab}>
										<View style={commonStyles.titleScenarioView(i18n.t('common:dir'))}>
											<Text style={commonStyles.titleScenario(i18n.t('common:dir'))}>{i18n.t('scenario:scenarios')}</Text>
										</View>
										<FlatList
											keyExtractor={(item, index) => String(index)}
											data={this.state.scenarios}
											renderItem={scenarios}
											horizontal={false}
											numColumns={3}
										/>
									</View>
								}


								styleTab2={2}

								styleTab1={2}

								tab2Text={i18n.t("schedule:schedules")}
								activeTabColor={'#ff2a62'}
								inActiveTabColor={'#fff'}
								viewStyle={""}

							/>
						</View>
					</LinearGradient>
				}
			</View>
		);
	}
}

export default translate(['dashboard', 'common'], { wait: true })(Dashboard);