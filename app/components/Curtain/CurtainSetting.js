import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Vars from '../Common/vars/commonVars';
import Curtain from './lib/Curtain';

export class CurtainSetting extends React.Component {
//    output1: Output;
    constructor(props){
      super(props);
        this.state ={
            outputs : "",
            successName: true,
            curtainTitle: "",
        }

      this.saveCurtain = this.saveCurtain.bind(this);
    }


    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        curtain = new Curtain();

        if(item != null){
            this.setState({
                curtainId: item.id,
                curtainTitle: item.title,
                mode: Vars.modeUpdate,
            });
        }
        else{
            this.setState({
                curtainId: 0,
                curtainTitle: "",
                mode: Vars.modeInsert,
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        // })

    }

    // Update curtain in db
    saveCurtain(){
        if(this.state.curtainTitle.trim().length == 0){
            this.setState({
                successName: false
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            curtainIns = new Object();
            curtainIns.title = this.state.curtainTitle;

            curtain = new Curtain();

            if(this.state.mode == Vars.modeUpdate){
                curtainIns.id = this.state.curtainId;
                curtain.updateCurtainInDB(curtainIns).then(
                    data => {
                        if(data == true){
                            this.props.navigation.navigate('CurtainPage');
                        }
                    }
                )
                .catch(
                    error => {
                        alert(this.props.t("curtain:errorUpdateCurtainInDB"))
                    }
                );
            }

            if(this.state.mode == Vars.modeInsert){

                curtain.getNextId().then(
                    newId => {

                        curtainIns.id = newId[0].id;
                        curtain.saveCurtainInController(curtainIns).then(
                            data => {
                                curtain.updateCurtainInDB(curtainIns).then(
                                    data1 => {
                                        if(data1 == true){
                                            setTimeout(() => {
//                                                console.log("Add .... ")
                                                this.props.navigation.navigate('CurtainPage');
                                            }, 20000);

                                        }
                                    }
                                )
                                .catch(
                                    error => {
                                        alert(this.props.t("curtain:errorSaveCurtainInDB"))
                                    }
                                );
                            }
                        )
                        .catch(
                              // todo:
                            error => alert(this.props.t("curtain:errorSaveCurtainInController"))
                        );
                    }
                )

            }
        }
    }


    render() {
        const { t} = this.props;

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={commonStyles.flex1} enabled >
            <ScrollView>
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
                <View style={commonStyles.containerView}>

                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('common:title')}</Text>
                        <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                            ref="titleTextInput"
                            onChangeText={(txt) => {
                                if(txt.trim().length == 0){
                                    this.setState({
                                        curtainTitle: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        curtainTitle: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.curtainTitle}
                        />
                    </View>

                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('curtain:curtainFillName')}
                            </Text>
                        ) : (null)}
                    </View>

                </View>
                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                       onPress={() => this.saveCurtain() }>
                  </MyButton>
                 </View>
              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }


}

export default translate(['CurtainSetting', 'common'], { wait: true })(CurtainSetting);
