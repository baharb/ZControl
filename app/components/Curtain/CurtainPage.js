import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Alert, Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import Curtain from './lib/Curtain';
import ZagrosDB from '../Common/lib/DB';
import TouchSwitch from '../TouchSwitch/lib/TouchSwitch';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';

export class CurtainPage extends React.Component {
    constructor(props){
      super(props);
        this.state ={
            curtains : "",
            curtainsTemp: "",
            showList: true,
            add: "",
        }

        this.getAllCurtains = this.getAllCurtains.bind(this);
    }

    componentDidMount(){
        this.getAllCurtains();
        // For update list after back to page
        this.props.navigation.addListener('willFocus',this._handleStateChange);
    }

    _handleStateChange = state => {
         this.getAllCurtains();
     };

    // Scan wired modules by Controller
    scanWiredCurtains(){
        touchSwitch = new TouchSwitch()
        touchSwitch.scanWiredModules().then(
            data => {           

        })

        this.getAllCurtains()
    }

    // Get all curtains from controller and update DB
    // Then get all curtains from DB and insert into flat list
    getAllCurtains(retry){
//        return new Promise((resolve, reject) => {
       		if(!retry && (retry != 0)){ retry = 3 }
       		getResponse = 0
       		getError = 0
       		timeout = ""

          // Get all Curtains from DB
          ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "", "", "", "", "", 1).then(
            curtainFromDB => {
                curtain = new Curtain();

                curtain.getAllCurtainsFromController(curtainFromDB).then(
                    curtainsTemp => {
                              getResponse = 1
//                              console.log("Done get all curtains: " +retry)
                              if(timeout != ""){
                                        clearTimeout(timeout)
                              }
                            this.setState({
                                curtains: curtainsTemp.filter(item => item.status !== 0)
                            })
                    }
                )
                .catch(
                    error => {
                              getError = 1
                              if(retry == 0){
//                                        console.log(i18n.t("location:errorGetLocationFromDB") + "---" + error)
                                         alert(this.props.t("curtain:errorGetAllCurtainsFromController"));
                              }
                              else{
//                                        if((getResponse == 0 && getError == 0)){
                                                 this.getAllCurtains(retry-1)
//                                        }
                              }
                    }
                )
             }
          )
          .catch(
             error => {
                       getError = 1
                       if(retry == 0){
//                                 console.log(i18n.t("location:errorGetLocationFromDB") + "---" + error)
                                 alert(this.props.t("curtain:errorGetAllCurtainsFromDB"));
                       }
                       else{
//                                 if((getResponse == 0 && getError == 0)){
                                          this.getAllCurtains(retry-1)
//                                 }
                       }
             }
          )
            timeout = setTimeout(() => {
//          		console.log("get Curtain Timeout: " +getError+"---"+getResponse+"---"+retry)

          		if(retry == 0){
//          			reject(false)
          		}
          		else{
          			if((getResponse == 0 && getError == 0)){
          			         this.getAllCurtains(retry-1)
          			}
          		}
          	}, 1500);
//          }) // End Promise


    }

    _onPress(item){
        curtain = new Curtain();
        if(item == null && (this.state.curtains.length == curtain.CURTAIN_NUMBER)){
            alert(this.props.t('curtain:errorMaxCurtain'))
        }
        else{
            this.props.navigation.navigate('CurtainSetting', {item: item})
        }
    }

    // Delete a Curtain
    removeItem(id, type_id, type, title){

        Alert.alert(
           "",
           this.props.t('common:qpart1') + " " + title + " " + this.props.t('common:qpart2'),
           [
             {
               text: i18n.t('common:cancel'),
               onPress: () => null,
               style: "cancel"
             },
             {text: this.props.t('common:yes'),
                  onPress: () => {
                      curtain = new Curtain();
                      curtain.deleteCurtain(id, type_id, type).then(
                         this.setState({
                             curtains: this.state.curtains.filter(item => item.id !== id)
                         })
                      )
                      .catch((error) => alert(this.props.t("curtain:errorDeleteCurtain")));
                  },
              }
           ],
           { cancelable: false }
        );
    }

    render() {
        // this.floatingAction.animateButton();
       
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
                        <Image source={require('../Common/img/common-light-curtain.png')}  style={commonStyles.listViewTouchImg} />
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
                        keyExtractor={item => 'item.id'}
                        data={this.state.curtains}
                        renderItem={renderItem}
                    />

                </View>

                <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                    <ActionButton buttonColor="#ff2a62">
                        <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                            <Text style={commonStyles.addIcon}>+</Text>
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.scanWiredCurtains()}}>
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



export default translate(['CurtainPage', 'common'], { wait: true })(CurtainPage);
