import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Vars from '../Common/vars/commonVars';
import RGB from './lib/RGB';

export class RGBSetting extends React.Component {
//    output1: Output;
    constructor(props){
      super(props);
        this.state ={
            outputs : "",
            successName: true,
            rgbTitle: "",
        }

      this.saveRGB = this.saveRGB.bind(this);
    }


    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        rgb = new RGB();
        if(item != null){
            this.setState({
                rgbId: item.id,
                rgbTitle: item.title,
                mode: Vars.modeUpdate,
            });
        }
        else{
            this.setState({
                rgbId: 0,
                rgbTitle: "",
                mode: Vars.modeInsert,
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        // })

    }

    // Update rgb in db
    saveRGB(){
        if(this.state.rgbTitle.trim().length == 0){
            this.setState({
                successName: false
            })

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            rgbIns = new Object();
            rgbIns.title = this.state.rgbTitle;

            rgb = new RGB();
//            console.log("mode: " + this.state.mode)
            if(this.state.mode == Vars.modeUpdate){
                rgbIns.id = this.state.rgbId;
                rgb.updateRGBInDB(rgbIns).then(
                    data => {
                        if(data == true){
                            this.props.navigation.navigate('RGBPage');
                        }
                    }
                )
                .catch(
                    error => {
                        alert(this.props.t("rgb:errorUpdateRGBInDB"))
                    }
                );
            }

            if(this.state.mode == Vars.modeInsert){

                rgb.getNextId().then(
                    newId => {

//            console.log("id: " + newId)
                        rgbIns.id = newId[0].id;
                        rgb.saveRGBInController(rgbIns).then(
                            data => {

//            console.log("contr: " + data.length)
                                rgb.updateRGBInDB(rgbIns).then(
                                    data1 => {

//            console.log("db: " + data1)
                                        if(data1 == true){
                                            this.props.navigation.navigate('RGBPage');
                                        }
                                        else{
                                             alert(this.props.t("rgb:errorSaveRGBInDB"))
                                        }
                                    }
                                )
                                .catch(
                                    error => {
                                        alert(this.props.t("rgb:errorSaveRGBInDB"))
                                    }
                                );
                            }
                        )
                        .catch(error =>
                            {alert(this.props.t("rgb:errorSaveRGBInController"))}
                        );
                    }
                )
                .catch(
                    error => {
                        alert(this.props.t("rgb:errorSaveRGBInController"))
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
                                        rgbTitle: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        rgbTitle: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.rgbTitle}
                        />
                    </View>

                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('rgb:rgbFillName')}
                            </Text>
                        ) : (null)}
                    </View>


                </View>
                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                       onPress={() => this.saveRGB() }>
                  </MyButton>
                 </View>
              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }


}

export default translate(['RGBSetting', 'common'], { wait: true })(RGBSetting);
