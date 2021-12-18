import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Alert, Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import Relay from './lib/Relay';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';

export class RelayPage extends React.Component {
    constructor(props){
      super(props);
        this.state ={
            relays : "",
            relaysTemp: "",
            showList: true,
            add: "",
        }

        this.getAllRelays = this.getAllRelays.bind(this);
    }

    componentDidMount(){
        this.getAllRelays();
        // For update list after back to page
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
         this.getAllRelays();
     };

    // Get all Relays from controller and update DB
    // Then get all Relays from DB and insert into flat list
    getAllRelays(retry){
	return new Promise((resolve, reject) => {
       		if(!retry && (retry != 0)){ retry = 5 }
       		getResponse = 0
       		getError = 0
       		timeout = ""
                    // Get all Relays from DB
	        ZagrosDB.buildQuery(Vars.querySelect, "Relay", "", "", "", "", "", 1).then(
	            relaysFromDB => {
//	                console.log("from dbbbbbbbbbbbbbbbbbb"+relaysFromDB.length+"---"+relaysFromDB)
	               if(relaysFromDB != false){

		               relaysFromDB.map(item => {
		                   item.flag = 0
		               })
	                   // relaysFromDB = data;
	//                     alert(relaysFromDB[0].title + "-" + relaysFromDB[1].title);
	                   relay = new Relay();
	                   relay.getAllRelaysFromController(relaysFromDB).then(
	                       dataFromC => {
	//				console.log("FRom controlllllllllllllllllllerrrr: " + dataFromC)
	                              getResponse = 1
                                        // console.log("Done get all TouchSWitches: " +retry)
                                        if(timeout != ""){ clearTimeout(timeout)  }

	                           this.setState({
	                               relays: dataFromC.filter(item => item.flag !== 0),
	                           })
	                       }
	                   )
	                   .catch(
	                       error => {
				// console.log("Error get all relays: " + error)

				getError = 1
				if(retry == 0){
				          if(timeout != ""){ clearTimeout(timeout)  }
				          alert(this.props.t("relay:errorGetAllRelays"));
				}
				else{
//				       if((getResponse == 0 && getError == 0)){
				                this.getAllRelays(retry-1)
//				       }
				}

	                       }
	                   )

	                 }

	            }
	         )
	         .catch(
	            error => {
	                  // console.log("Error get all relays 2 : " + error)
	                  getError = 1
                              if(retry == 0){
                                        if(timeout != ""){ clearTimeout(timeout)  }
                                         alert(this.props.t("relay:errorGetAllRelays"));
                              }
                              else{
//                                     if((getResponse == 0 && getError == 0)){
                                              this.getAllRelays(retry-1)
//                                     }
                              }

	            }
	         )

	          timeout = setTimeout(() => {
	                   // console.log("get Relay Timeout: " +getError+"---"+getResponse+"---"+retry)

	                   if(retry == 0){
	                             reject(false)
	                   }
	                   else{
	                             if((getResponse == 0 && getError == 0)){
	                                      this.getAllRelays(retry-1)
	                             }
	                   }
	         }, 1500);

         })
    }

    // Scan wired modules by Controller
    scanWiredSwitches(){
        relay = new Relay()
        relay.scanWiredModules().then(
            data => {
              this.getAllRelays()
        })

    }

    _onPress(item){
        relay = new Relay();
        if(item == null && (this.state.relays.length == relay.RELAY_MAX_NUMBER)){
            alert(this.props.t('relay:errorMaxWifi'))
        }
        else{
            this.props.navigation.navigate('RelaySetting', {item: item});
        }
    }

    // Delete a Relay
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
                     relay = new Relay();
                     relay.deleteRelay(id, type, type_id).then(
                        this.setState({
                            relays: this.state.relays.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("relay:errorDeleteRelay")));
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
                      <Image source={require('../Common/img/common-light-relay.png')}  style={commonStyles.listViewTouchImg} />
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
                         data={this.state.relays}
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

export default translate(['RelayPage', 'common'], { wait: true })(RelayPage);
