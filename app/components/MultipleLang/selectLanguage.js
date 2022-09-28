import React from 'react';
import { translate} from 'react-i18next';
import {View , Image, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import styles from './css/styles';
import {MyButton} from '../Common/MyButton';
//import CommonFuncs from '../Common/lib/CommonFuncs';
import Funcs from './lib/Funcs';

export class selectLanguage extends React.Component {

    constructor(props){
      super(props);
      this.state ={
        fromPage: "",
        title: this.props.t("common:actions.next")
      }

    }

    componentDidMount(){
      const item = this.props.navigation.getParam('item', null);
//      console.log("item: " + item)
      if(item != null){
        if(item == "setting"){
            this.setState({
              fromPage: "SettingPage",
              title: this.props.t("common:actions.ok")
            })
        }
        else{
            this.setState({
              fromPage: item,
              title: this.props.t("common:actions.ok")
            })
        }
      }
    }

    goToPage()
    {


//    console.log("from page: *" + this.state.fromPage+"*" + (this.state.fromPage == ""))
        if(this.state.fromPage == ""){
//            console.log("go to connect")
                this.props.navigation.navigate('connectToController');

        }
        else{
//        console.log("opposite")
         this.props.navigation.navigate(this.state.fromPage);
//            CommonFuncs.insertSetting().then(data => {

//            })

//            .catch(error => {console.log("Error in insert setting ... "+ error) } )
        }
    }

    render() {
        const { t, i18n } = this.props;

        return (
              <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>
                    <View style={styles.headerInstallView} >
                      <Image source={require('../Common/img/installHeader.png')} style={styles.headerImg}  />
                    </View>
                    <View style={styles.paddingView} >
                      <View style={styles.viewTransparent}>
                        <Text style={commonStyles.title(i18n.t("common:dir"))}>{t('common:selectLanguage', { lng: i18n.language })}</Text>
                        <View style={styles.line} />
                          <View style={styles.viewFlags(i18n.t("common:dir"))}>
                              <View style={styles.viewFlag} >
                                   <TouchableOpacity  style={styles.flagBtn} onPress={() => Funcs.onChangeLang('en')}>
                                    <Image
                                        style={styles.flagImage}
                                        source={require('../Common/img/englandFlag.png')}
                                      />
                                   </TouchableOpacity>

                                    <Text style={styles.textFlag(i18n.t("common:dir"))}> {t('common:actions.toggleToEnglish')} </Text>
                              </View>
                              <View style={styles.viewFlag} >
                                    <TouchableOpacity  style={styles.flagBtn} onPress={() => Funcs.onChangeLang('es')}>
                                     <Image
                                         style={styles.flagImage}
                                         source={require('../Common/img/spanishFlag.png')}
                                       />
                                    </TouchableOpacity>
                                    <Text style={styles.textFlag(i18n.t("common:dir"))}> {t('common:actions.toggleToSpanish')} </Text>
                              </View>
                          </View>
                          <View style={styles.viewFlags(i18n.t("common:dir"))}>
                          <View style={styles.viewFlag} >
                           <TouchableOpacity  style={styles.flagBtn} onPress={() => {
                                Funcs.onChangeLang('fa')
//                                setTimeout(() => this.goToPage(), 10000)

                                }}>

                              <Image
                                      style={styles.flagImage}
                                      source={require('../Common/img/iranFlag.png')}
                                    />
                             </TouchableOpacity>
                            <Text style={styles.textFlag(i18n.t("common:dir"))}> {t('common:actions.toggleToFarsi')}</Text>
                          </View>
                          <View style={styles.viewFlag} >
                           <TouchableOpacity  style={styles.flagBtn} onPress={() => Funcs.onChangeLang('ar')}>
                              <Image
                                      style={styles.flagImage}
                                      source={require('../Common/img/uaeFlag.png')}
                                    />
                             </TouchableOpacity>
                            <Text style={styles.textFlag(i18n.t("common:dir"))}> {t('common:actions.toggleToArabic')}</Text>
                          </View>

                        </View>
                      </View>

                    </View>

                    <View style={commonStyles.viewOkButton} >
                      <MyButton title={this.state.title}
                            onPress={() => this.goToPage()} dir={i18n.t("common:dir")} >
                      </MyButton>
                    </View>

                </LinearGradient>
//              </StyleProvider>
        );
    }
}

export default translate(['selectLanguage', 'common'], { wait: true })(selectLanguage);
