import React from 'react';
import { translate} from 'react-i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Vars from '../Common/vars/commonVars';
import Relay from './lib/Relay';
import i18n from 'i18next';

export class RelaySetting extends React.Component {
//    output1: Output;
    constructor(props){
      super(props);
        this.state ={
            outputs : "",
            successName: true,
            relayTitle: "",
        }

      this.saveRelay = this.saveRelay.bind(this);
    }


    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        relay = new Relay();
        
        if(item != null){
            this.setState({
                relayId: item.id,
                relayTitle: item.title,
                relayFlag: item.flag,
                mode: Vars.modeUpdate,
            });
        }
        else{
            this.setState({
                relayId: 0,
                relayTitle: "",
                relayFlag: 1,
                mode: Vars.modeInsert,
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }

    }

    // Update relay in db
    saveRelay(){
        if(this.state.relayTitle.trim().length == 0){
            this.setState({
                successName: false,
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            
            relayIns = new Object();
            relayIns.title = this.state.relayTitle;
            relayIns.flag = this.state.relayFlag;
            relay = new Relay();

            if(this.state.mode == Vars.modeUpdate){
                relayIns.id = this.state.relayId;
                relay.updateRelayInDB(relayIns).then(
                    data => {
                        if(data == true){
                            this.props.navigation.navigate('RelayPage');
                        }
                    }
                )
                .catch(
                    error => {
                        // console.log("error in touch: " + error)
                        alert(this.props.t("relay:errorSaveRelay"))
                    }
                );
            }

            if(this.state.mode == Vars.modeInsert){
                relay.getNextId().then(
                    newId => {
                        // console.log("type: "+newId[0].id+"---"+newId[0].type_id)
                        relayIns.id = newId[0].id;
                        relayIns.type_id = newId[0].type_id;

                        relay.saveRelayInController(relayIns).then(
                            data => {
                                relay.updateRelayInDB(relayIns).then(
                                    data1 => {
                                        if(data1 == true){
                                            this.props.navigation.navigate('RelayPage');
                                        }
                                    }
                                )
                                .catch(
                                    error => {
                                        // console.log("eror2 " + error)
                                        alert(this.props.t("relay:errorSaveRelay"))
                                    }
                                );
                            }
                        )
                        .catch(
                            error => {
                                alert(this.props.t("relay:errorSaveRelay"))
                                
                                // console.log("eror3 " + error)
                            }
                        );
                    }
                )
            }

        }
    }


    render() {
        const { t } = this.props;

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
                <View style={commonStyles.containerView}>
                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>

                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                            ref="titleTextInput"
                            onChangeText={(txt) => {
                                if(txt.trim().length == 0){
                                    this.setState({
                                        relayTitle: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        relayTitle: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.relayTitle}
                        />
                    </View>
                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('relay:relayFillName')}
                            </Text>
                        ) : (null)}
                    </View>

                </View>


                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                       onPress={() => this.saveRelay() }>
                  </MyButton>
                 </View>
              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }

}

export default translate(['RelaySetting', 'common'], { wait: true })(RelaySetting);
