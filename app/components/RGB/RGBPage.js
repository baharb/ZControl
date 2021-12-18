import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Alert, Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import RGB from './lib/RGB';
import ZagrosDB from '../Common/lib/DB';
import TouchSwitch from '../TouchSwitch/lib/TouchSwitch';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';

export class RGBPage extends React.Component {
    constructor(props){
      super(props);
        this.state ={
            rgbs : "",
            rgbsTemp: "",
            showList: true,
            add: "",
        }

        this.getAllRGBs = this.getAllRGBs.bind(this);
    }

    componentDidMount(){

        this.getAllRGBs();
        // For update list after back to page
        this.props.navigation.addListener('willFocus',this._handleStateChange);
    }

    _handleStateChange = state => {
         this.getAllRGBs();
     };

    // Scan wired modules by Controller
    scanWiredRGBs(){
        touchSwitch = new TouchSwitch()
        touchSwitch.scanWiredModules().then(
            data => {           

        })

        this.getAllRGBs()
    }

    // Get all rgbs from controller and update DB
    // Then get all rgbs from DB and insert into flat list
    getAllRGBs(retry){
        return new Promise((resolve, reject) => {
              		if(!retry && (retry != 0)){ retry = 5 }
              		getResponse = 0
              		getError = 0
              		timeout = ""
          // Get all RGBs from DB

		          ZagrosDB.buildQuery(Vars.querySelect, "RGB", "", "", "", "", "", 1).then(
		            rgbFromDB => {
		                rgb = new RGB();
		//console.log("data from DBBB" +"-" + rgbFromDB[0].status +"-" + rgbFromDB[1].status + "-" + rgbFromDB[2].title + "-" + rgbFromDB.length)
		                rgb.getAllRGBsFromController(rgbFromDB).then(
		                    rgbsTemp => {
		                                getResponse = 1
//                                                    console.log("Done get all RGBs: " +retry)
                                                    if(timeout != ""){
                                                              clearTimeout(timeout)
                                                    }
		//	                    alert("get rgbsssss:"+rgbsTemp+"---"+rgbsTemp.length)
			                    if(rgbsTemp.length > 0 && rgbsTemp != false){
			                        this.setState({
			                            rgbs: rgbsTemp.filter(item => item.status !== 0)
			                        })
			                    }
		                    }
		                )
		                .catch(
		                    error => {
//		                        console.log("errrrrrrrrrrrrrr RGB: "+error)
		                        getError = 1
                                            if(retry == 0){
//                                                      console.log(i18n.t("location:errorGetLocationFromDB") + "---" + error)
                                                        alert(this.props.t("rgb:errorGetAllRGBsFromController"));
                                            }
                                            else{
//                                                      if((getResponse == 0 && getError == 0)){
                                                               this.getAllRGBs(retry-1)
//                                                      }
                                            }

		                    }
		                )
		             }
		          )
		          .catch(
		             error => {
//		                     console.log("errrrrrrrrrrrrrr1:RGB "+error)
		                     getError = 1
                                         if(retry == 0){
//                                                   console.log(i18n.t("location:errorGetLocationFromDB") + "---" + error)
		                                alert(this.props.t("rgb:errorGetAllRGBsFromDB"));
                                         }
                                         else{
//                                                   if((getResponse == 0 && getError == 0)){
                                                            this.getAllRGBs(retry-1)
//                                                   }
                                         }
		             }
		          )

                    timeout = setTimeout(() => {
//          		console.log("get RGB Timeout: " +getError+"---"+getResponse+"---"+retry)

          		if(retry == 0){
          			reject(false)
          		}
          		else{
          			if((getResponse == 0 && getError == 0)){
          			         this.getAllRGBs(retry-1)
          			}
          		}
          	}, 1500);

          }) // End Promise
    }

    _onPress(item){
        rgb = new RGB();
        if(item == null && (this.state.rgbs.length == rgb.RGB_NUMBER)){
            alert(this.props.t('rgb:errorMaxRGB'))
        }
        else{
            this.props.navigation.navigate('RGBSetting', {item: item})
        }
    }

    // Delete a RGB
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
                     rgb = new RGB();
                     rgb.deleteRGB(id, type_id, type).then(
                        this.setState({
                            rgbs: this.state.rgbs.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("rgb:errorDeleteRGB")));
                 },
             }
          ],
          {cancelable: false},
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
                        <Image source={require('../Common/img/common-light-rgb.png')}  style={commonStyles.listViewTouchImg} />
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
                        data={this.state.rgbs}
                        renderItem={renderItem}
                    />

                </View>

                <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                    <ActionButton buttonColor="#ff2a62">
                        <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                            <Text style={commonStyles.addIcon}>+</Text>
                        </ActionButton.Item>
                        <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.scanWiredRGBs()}}>
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



export default translate(['RGBPage', 'common'], { wait: true })(RGBPage);
