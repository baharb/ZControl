import React from 'react';
import i18n from 'i18next';
import {translate} from 'react-i18next';
import { Image, FlatList, Alert, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import ZagrosDB from '../Common/lib/DB';
import VoiceCommand from '../VoiceCommand/lib/VoiceCommand';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';
import Output from '../Output/lib/Output';

export class VoiceCommandPage extends React.Component {

    constructor(props){
      super(props);
      this.state ={
          voiceCommands : [],
          showList: true,
          add: "",
      }

    }

    componentDidMount(){
        this.getAllVoiceCommands();
//        output = new Output()
//
//        output.getAllOutputsFromDB().then(
//            outputs => {
////                output.getAllOutputsFromController(outputs)
//            }
//        )
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
       this.getAllVoiceCommands()
     };

    _onPress(item){
        this.props.navigation.navigate('VoiceCommandSetting', {item: item});
    }

    getAllVoiceCommands(){

             // Get all VoiceCommands from DB
         ZagrosDB.buildQuery(Vars.querySelect, "VoiceCommand", "", "", "", "", "", 1).then(
            data => {
                this.setState({
                    voiceCommands: data,
                })
            }
         )
         .catch(
            error => {
                alert(this.props.t("voiceCommand:errorGetAllVoiceCommands"));
            }
         )
        
    }

    // Delete a voiceCommand
    removeItem(id, title){
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
                     voiceCommand = new VoiceCommand();
                     voiceCommand.deleteVoiceCommand(id).then(
                        this.setState({
                            voiceCommands: this.state.voiceCommands.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("voiceCommand:errorDeleteVoiceCommand")));
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
                         this.removeItem(item.id, item.command)
                     }}>
                     <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-delete.png')}></Image>
                   </TouchableHighlight>
                 ]} >
                <View key={item.id} style={commonStyles.listViewRow}>
                    <TouchableHighlight
                      onPress={() => this._onPress(item)}
                      style={commonStyles.touchSwip} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.command}</Text>
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
                         data={this.state.voiceCommands}
                         renderItem={renderItem}
                     />

                    </View>

                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                        <ActionButton buttonColor="#ff2a62">
                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                                <Text style={commonStyles.addIcon}>+</Text>
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllVoiceCommands()}}>
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

export default translate(['VoiceCommandPage', 'common'], { wait: true })(VoiceCommandPage);
