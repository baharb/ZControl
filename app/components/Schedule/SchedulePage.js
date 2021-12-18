import React from 'react';
import i18n from 'i18next';
import {translate} from 'react-i18next';
import {Image, FlatList, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import {MyAlert} from '../Common/MyAlert';
import ZagrosDB from '../Common/lib/DB';
import Schedule from '../Schedule/lib/Schedule';
import Scenario from '../Scenario/lib/Scenario';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

export class SchedulePage extends React.Component {
    timeout = ""

    constructor(props){
      super(props);
      this.state = {
          schedules : "",
          showList: true,
          add: "",
          spinner: true,
          alertMod:false,
          titleModal:"",
          idModal:0,
      }
    }

    componentDidMount(){


        this.getAllSchedules();
        this.props.navigation.addListener('willFocus',this._handleStateChange);
//        setTimeout(() => {

//            }, 3000);
    }

    _handleStateChange = state => {
       this.getAllSchedules()
     };

    _onPress(item){
//        this.setState({modalVisible:false})
	//if(timeout != ""){ clearTimeout(timeout)}
//	console.log("onpress: " + item)
        this.props.navigation.navigate('ScheduleSetting', {item: item, fromPage:"SchedulePage"});
    }

    onClick1(){
          this.setState({alertMod:false})
    }

    getAllSchedules(retry){
        timeout = ""

        if(!retry && retry != 0){  retry = 5  }

        getError = 0
        getResponse = 0


        schedule = new Schedule()
        scenario = new Scenario()

        schedule.updateSchedulesFromController(scenario.SCENARIO_MAX_NUMBER).then(schedulesFromController => {
            ZagrosDB.buildQuery(Vars.querySelect, "Schedule", "", "status=1", "", "", "", 1).then(
		data => {
			getResponse = 1

			if(timeout != ""){ clearTimeout(timeout) }

			console.log("Data from dB schedulessss.... " + data.length +"---"+data)

			this.setState({
			          schedules: data,
			          spinner: false,
			})
		}
            )
            .catch(
		error => {
			console.log("Errrooorrr" + error)
			getError = 1
//                  alert(this.props.t("schedule:errorGetAllSchedules"));
//                  this.setState({
//                                        spinner: false
//                                    })
              }
            )
        })
        .catch(error => {
                    console.log("Error in update all schedules : " + error)
		getResponse = 0
		getError = 1
//                    this.setState({
//	              spinner: false
//	          })
//	          alert(this.props.t("schedule:errorGetAllSchedules"));
        })
	console.log("Before check timeout : " + timeout)


          timeout = setTimeout(() => {
                    console.log("Timeout")
		if((getResponse == 0 && getError == 0) || (getError == 1)){
			if(retry > 0){
			  console.log("retry in get all outpus: " +retry)
			  this.getAllSchedules(retry-1)
			}
			else {
			     console.log("error "+retry)
			      this.setState({
			                           spinner: false
			                       })
			//                      reject(i18n.t('output:errorGetOutputDataFromDB'))
			}
		}
          }, 2000);

          
      // Get all Schedules from DB
     

    }

    // Delete a schedule
    removeItem(id, title){
    this.setState({
          alertMod:true,
          titleModal: this.props.t('common:qpart1') + " " + title + " " + this.props.t('common:qpart2'),
          idModal: id,
     })
//        Alert.alert(
//          '',
//          this.props.t('common:qpart1') + " " + title + " " + this.props.t('common:qpart2'),
//          [
//            {
//              text: this.props.t('common:cancel'),
//              onPress: () => {},
//              style: 'cancel',
//            },
//            {text: this.props.t('common:yes'),
//
//             }
//
//          ],
//          {cancelable: false},
//        );


    }

clickRun(id){
                     schedule = new Schedule();
                     schedule.deleteSchedule(id).then(
	                        this.setState({
	                            schedules: this.state.schedules.filter(item => item.id !== id),
	                            alertMod: false,
	                        })
                     )
                     .catch((error) => alert(this.props.t("schedule:errorDeleteSchedule")));
}

    render() {
        // Each row of flat list
        const renderItem = ({item}) => (
            <Swipeable
              rightButtons={[
                   <TouchableHighlight style={commonStyles.deleteButton}
                     onPress={() => {
                         this.removeItem(item.id, item.title)
                     }}>
                     <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-delete.png')}></Image>
                   </TouchableHighlight>
                 ]} >
                <View key={item.id} style={commonStyles.listViewRow}>
                    <TouchableHighlight
                      onPress={() => this._onPress(item)}
                      style={commonStyles.touchSwip} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                      </View>
                    </TouchableHighlight>
                </View>
            </Swipeable>
        );

        return (
                 <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont} isShow={this.state.showList} >
		<Spinner
	          visible={this.state.spinner}
	          textContent={this.props.t('common:loading')}
	          textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
	        />
                    <View  style={commonStyles.flex1}>
                     <FlatList
                         extraData={this.state}
                         keyExtractor={(item, index) => String(index)}
                         data={this.state.schedules}
                         renderItem={renderItem}
                     />
                    <MyAlert modalVisible={this.state.alertMod}  onClick2={() => this.clickRun(this.state.idModal)}
                      onClick1={() => this.onClick1()}
                      title1={i18n.t('common:cancel')}
                      title2={i18n.t('common:actions.ok')}
                      title={this.state.titleModal}   />
                    </View>

                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                        <ActionButton buttonColor="#ff2a62">
                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                                <Text style={commonStyles.addIcon}>+</Text>
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllSchedules()}}>
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

export default translate(['SchedulePage', 'common'], { wait: true })(SchedulePage);
