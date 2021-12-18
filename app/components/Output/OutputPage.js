import React from 'react';
import i18n from 'i18next';
import { translate} from 'react-i18next';
import { Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import {MyAlert} from '../Common/MyAlert';
import Output from './lib/Output';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

export class OutputPage extends React.Component {
    constructor(props){
      super(props);
      
        this.state ={
            outputs : "",
            add: "",
            outputsTemp: "",
          spinner: false,
          alertMod:false,
        }

      this.getAllOutputs = this.getAllOutputs.bind(this);
        
    }

    componentDidMount(){
        this.getAllOutputs();

        /// For refresh page when an item deleted, added or edited
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    // For refresh page when an item deleted, added or edited
    _handleStateChange = state => { this.getAllOutputs(); };

    /// Get all outputs from DB and Controller
    getAllOutputs(retry){
        timeout = ""
        getResponse = 0
        getError = 0

        if(!retry && (retry != 0)){retry = 4}

        const {t} = this.props;

         timeout = setTimeout(() => {
//         	      console.log("Error in get Output Timeout: " +getError+"---"+getResponse+"---"+retry)
         	      if(retry == 0){
         	                 this.setState({
                                      spinner: false,
                                      alertMod: true,
                                      titleModal: i18n.t('output:errorGetOutputDataFromDB'),
                                      func:"get",
                             })

                }
         	      else{
         	                if((getResponse == 0 && getError == 0) || (getError == 1)){
         				          this.getAllOutputs(retry-1)
         	                  }
                 }
                }, 1000);
         // Get all ouputs from DB
        ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
            data => {
                output = new Output();
                    console.log("grom dbbb: " + data.length)
                output.getAllOutputsFromController(data).then(
                    outputFromDB => {
                        getResponse = 1
//                        console.log("clear timeout")
                        if(timeout != ""){ clearTimeout(timeout)}
                        this.setState({
                           outputs: outputFromDB.filter(item => item.flag !== 0),
                           spinner: false,
                        })
                    }
                )
                .catch(
                    error => {
                         getError = 1
//                         if(timeout != ""){ clearTimeout(timeout)}
//                         if(retry > 0) {
//                              this.getAllOutputs(retry-1)
//                          }
//                          else{
//                              this.setState({
////                                     spinner: false,
//                                     alertMod: true,
//                                     titleModal: i18n.t('common:errorGetDataFromController'),
//                               })
//                          }

//                        console.log("aaaaddddddddddddddddddd"+error)
//                        alert(t("common:errorGetDataFromController"));
                    }
                )
            }
         )
         .catch(
            error => {
                //todo
//                console.log("error"+error)
                getError = 1
//                if(timeout != ""){ clearTimeout(timeout)}
            }
         )


    }

    /// Click on any output item
    clickOutput(item){
        this.props.navigation.navigate('OutputSetting', {item: item})
    }

    onClickCancel(){
          this.setState({alertMod:false})
    }
    /// Main show page
    render() {
        const renderItem = ({item}) => (
                <TouchableHighlight
                  onPress={() => this.clickOutput(item)}
                  style={commonStyles.listViewTouch} >
                  <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                    <Image source={ImageVars.outputIconLightArray[item.icon]}  style={commonStyles.listViewTouchImg} />
                    <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.name}</Text>
                  </View>
                </TouchableHighlight>
        );

        return (
            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}  >
                    <Spinner
            	          visible={this.state.spinner}
            	          textContent={this.props.t('common:loading')}
            	          textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
            	        />
                <View style={commonStyles.flex1}>
                    <FlatList
                        extraData={this.state}
                        keyExtractor={(item, index) => String(index)}
                        data={this.state.outputs}
                        renderItem={renderItem}
                    />

		{(this.state.alertMod) ? (
	          <View>
                              <MyAlert modalVisible={this.state.alertMod}
                                 onClick2={() => {
                                        this.getAllOutputs()
                                        this.setState({alertMod:false})
                                 }}
                                onClick1={() => this.onClickCancel()}
                                title1={i18n.t('common:cancel')}
                                title2={i18n.t('common:actions.ok')}
                                title={i18n.t('common:errorGetDataFromController')}   />
                      </View>
                     ) : (null) }

                </View>

                <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                    <ActionButton buttonColor="#ff2a62">
                        <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllOutputs()}}>
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

export default translate(['OutputPage', 'common'], { wait: true })(OutputPage);
