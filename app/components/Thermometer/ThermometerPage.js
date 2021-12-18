import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Alert, Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import Thermometer from './lib/Thermometer';
import ZagrosDB from '../Common/lib/DB';
import TouchSwitch from '../TouchSwitch/lib/TouchSwitch';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';
thermometer = new Thermometer()

export class ThermometerPage extends React.Component {

    constructor(props){
      super(props);
        this.state ={
            thermometers : "",
            thermometersTemp: "",
            showList: true,
            add: "",
        }

        this.getAllThermometers = this.getAllThermometers.bind(this);
    }

    componentDidMount(){
	thermometer.getAllThermometersFromDB().then(thermFromDB => {
		this.getAllThermometers(thermFromDB, 3);
	})

        // For update list after back to page
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
          thermometer.getAllThermometersFromDB().then(thermFromDB => {
         		this.getAllThermometers(thermFromDB, 3);
         	})
     };
     
    // Scan wired modules by Controller
    scanWiredThermometers(){
        touchSwitch = new TouchSwitch()
        touchSwitch.scanWiredModules().then(
            data => {
                // alert(data)               
		thermometer.getAllThermometersFromDB().then(thermFromDB => {
                              this.getAllThermometers(thermFromDB, 3);
                    })
        })


    }

    // Get all thermometers from controller and update DB
    // Then get all thermometers from DB and insert into flat list
    getAllThermometers(thermFromDB, retry){
	return new Promise((resolve, reject) => {
       		if(!retry && (retry != 0)){ retry = 3 }
       		getResponse = 0
       		getError = 0
       		timeout = ""

	          thermometer.getAllThermometersFromController(thermFromDB).then(
	                    dataTherm => {
	                              getResponse = 1
//	                              console.log("Done get all Thermometers: " +retry)
	                              if(timeout != ""){  clearTimeout(timeout) }
		                    this.setState({
		                           thermometers: dataTherm.filter(item => item.status !== 0),
		                    })
	                     }
	          )
	          .catch(
	                   error => {
	                        console.log("error therm 1 " + error)
	                        getError = 1
	                        if(retry == 0){
//	                                   console.log("Error get thermmsss" + "---" + error)
	                                   if(timeout != ""){ clearTimeout(timeout)  }
	                                   alert(this.props.t("thermometer:errorGetAllThermometers"));
	                        }
	                        else{
	                                  this.getAllThermometers(thermFromDB, retry-1)
	                        }
	                   }
	          )

		timeout = setTimeout(() => {
                             console.log("get Thermometer Timeout: " +getError+"---"+getResponse+"---"+retry)

                             if(retry == 0){
                                       reject(false)
                             }
                             else{
                                       if((getResponse == 0 && getError == 0)){
                                                this.getAllThermometers(thermFromDB, retry-1)
                                       }
                             }
                     }, 1500);

          })
    }

    _onPress(item){
        thermometer = new Thermometer();
        if(item == null && (this.state.thermometers.length == thermometer.THERMOMETER_MAX_NUMBER)){
            alert(this.props.t('thermometer:errorMaxThermometer'))
        }
        else{
            this.props.navigation.navigate('ThermometerSetting', {item: item, fromPage: "ThermometerPage"})
        }
    }

    // Delete a Thermometer
    removeItem(id, type_id, type, title){
        Alert.alert(
          '',
          this.props.t('common:qpart1') + " " + title + " " + this.props.t('common:qpart2'),
          [
            {
              text: this.props.t('common:cancel'),
              onPress: () => {},
              style: 'cancel',
            },
            {text: this.props.t('common:yes'),
                 onPress: () => {
                     thermometer = new Thermometer();
                     thermometer.deleteThermometer(id, type_id, type).then(
                        this.setState({
                            thermometers: this.state.thermometers.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("thermometer:errorDeleteThermometer")));
                 },
             }
          ],
          {cancelable: false},
        );
    }

    render() {
        // Each row of flat list
        const renderItem = ({item}) => (
            <Swipeable
              rightButtons={[
                   <TouchableHighlight style={commonStyles.deleteButton}
                     onPress={() => {
                         this.removeItem(item.id, item.type_id, item.type, item.title)
                     }}>
                     <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-delete.png')}></Image>
                   </TouchableHighlight>
                 ]} >
                <View key={item.id} style={commonStyles.flatListView}>
                    <TouchableHighlight
                      onPress={() => this._onPress(item)}
                      style={commonStyles.touchSwip} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Image source={require('../Common/img/common-light-thermometer.png')}  style={commonStyles.listViewTouchImg} />
                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                      </View>
                    </TouchableHighlight>
                </View>
            </Swipeable>
        );
         return (
                 <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont} isShow={this.state.showList} >
			<View  style={commonStyles.flex1}>
			          <FlatList
			              extraData={this.state}
			              keyExtractor={(item, index) => String(index)}
			              data={this.state.thermometers}
			              renderItem={renderItem}
			          />
			</View>

	                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
	                        <ActionButton buttonColor="#ff2a62">
	                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
	                                <Text style={commonStyles.addIcon}>+</Text>
	                            </ActionButton.Item>
	                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.scanWiredThermometers()}}>
	                                <Image source={require('../Common/img/common-light-refresh.png')}  style={commonStyles.floatingImage} />
	                            </ActionButton.Item>
	                        </ActionButton>
	                    </View>

                     <View style={commonStyles.viewFooter}>
                      <MyFooter  navigation={this.props.navigation} />
                     </View>

              </LinearGradient>
        );
    }

}

export default translate(['ThermometerPage', 'common'], { wait: true })(ThermometerPage);
