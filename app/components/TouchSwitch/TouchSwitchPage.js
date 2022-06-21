import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Alert, Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import TouchSwitch from './lib/TouchSwitch';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';

export class TouchSwitchPage extends React.Component {
    constructor(props){
      super(props);
        this.state ={
            touchSwitches : "",
            touchSwitchesTemp: "",
            add: "",
        }

        this.getAllTouchSwitches = this.getAllTouchSwitches.bind(this);
    }

    componentDidMount(){
        this.getAllTouchSwitches();
        // For update list after back to page
        this.props.navigation.addListener('willFocus',this._handleStateChange);
    }

    _handleStateChange = state => {
         this.getAllTouchSwitches();
     };

    // Get all TouchSwitches from controller and update DB
    // Then get all TouchSwitches from DB and insert into flat list
    getAllTouchSwitches(retry){
//	return new Promise((resolve, reject) => {
       		if(!retry && (retry != 0)){ retry = 3 }
       		getResponse = 0
       		getError = 0
       		timeout = ""

                     // Get all TouchSwitches from DB
	          ZagrosDB.buildQuery(Vars.querySelect, "TouchSwitch", "", "", "", "", "", 1).then(
	            touchesFromDB => {
	               touchesFromDB.map(item => {
	                   item.flag = 0
	               })

	               if(touchesFromDB != false){
	                   // touchSwitchesFromDB = data;
	//                     alert(touchSwitchesFromDB[0].title + "-" + touchSwitchesFromDB[1].title);
	                   touchSwitch = new TouchSwitch();
	                   touchSwitch.getAllTouchSwitchesFromController(touchesFromDB).then(
	                       dataFromC => {
	                           getResponse = 1
//                               console.log("Done get all TouchSWitches: " +retry)
                               if(timeout != ""){ clearTimeout(timeout)  }

	                           this.setState({
	                               touchSwitches: dataFromC.filter(item => item.flag !== 0),
	                           })
	                       }
	                   )
	                   .catch(
	                       error => {
	                            getError = 1
	                       }
	                   )
	                 }
	            }
	         )
	          .catch(
	            error => {
	                 getError = 1

	            }
	         )

	         timeout = setTimeout(() => {
//                      console.log("get Touch Switch Timeout: " +getError+"---"+getResponse+"---"+retry)

                      if(retry == 0){
                                alert(this.props.t("touchSwitch:errorGetAllTouchSwitches"))
                      }
                      else{
                                if((getResponse == 0 || getError == 1)){
                                         this.getAllTouchSwitches(retry-1)
                                }
                      }
            }, 1000);

//         })

    }

    // Scan wired modules by Controller
    scanWiredSwitches(){
        touchSwitch = new TouchSwitch()
        touchSwitch.scanWiredModules().then(
            data => {
                // alert(data)

           this.getAllTouchSwitches()

        })

    }

    _onPress(item){
        touchSwitch = new TouchSwitch();
        if(item == null && (this.state.touchSwitches.length == touchSwitch.TOUCHSWITCH_MAX_NUMBER)){
            alert(this.props.t('touchSwitch:errorMaxWifi'))
        }
        else{
            this.props.navigation.navigate('TouchSwitchSetting', {item: item});
        }
    }

    // Delete a TouchSwitch
    removeItem(id, type, type_id, title){
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
                     touchSwitch = new TouchSwitch();
                     touchSwitch.deleteTouchSwitch(id, type, type_id).then(
                        this.setState({
                            touchSwitches: this.state.touchSwitches.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("touchSwitch:errorDeleteTouchSwitch")));
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
                         this.removeItem(item.id, item.type, item.type_id, item.title)
                     }}>
                     <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-delete.png')}></Image>
                   </TouchableHighlight>
                 ]} >
                <View key={item.id} style={commonStyles.flatListView}>
                    <TouchableHighlight
                      onPress={() => this._onPress(item)}
                      style={commonStyles.touchSwip} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                      <Image source={require('../Common/img/common-light-touchSwitch.png')}  style={commonStyles.listViewTouchImg} />
                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                        
                      </View>
                    </TouchableHighlight>
                </View>
            </Swipeable>
        );
         return (
                 <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont} >

                    <View  style={commonStyles.flex1}>
                    
                     <FlatList
                         extraData={this.state}
                         keyExtractor={(item, index) => String(index)}
                         data={this.state.touchSwitches}
                         renderItem={renderItem}
                     />

                    </View>

                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                        <ActionButton buttonColor="#ff2a62">
                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                                <Text style={commonStyles.addIcon}>+</Text>
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.scanWiredSwitches()}}>
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

export default translate(['TouchSwitchPage', 'common'], { wait: true })(TouchSwitchPage);
