import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import {Image, FlatList, Alert, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import ZagrosDB from '../Common/lib/DB';
import Scenario from './lib/Scenario';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';

export class ScenarioPage extends React.Component {

    constructor(props){
      super(props);
      this.state ={
          scenarios : "",
          showList: true,
          add: "",
      }

      this.getAllScenarios = this.getAllScenarios.bind(this)

    }

    componentDidMount(){

        this.getAllScenarios();
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
       this.getAllScenarios()
     };

    _onPress(item){
        this.props.navigation.navigate('ScenarioSetting', {item: item});
    }

    getAllScenarios(retry){
		if(!retry && (retry != 0)){ retry = 5 }
       		getResponse = 0
       		getError = 0
       	          timeout = ""

	        scenario = new Scenario()
	        scenario.updateScenariosFromController().then(activeScenarios => {
	            // Get all Scenarios from DB
	            ZagrosDB.buildQuery(Vars.querySelect, "Scenario", "", "status=1", "", "", "", 1).then(
	                data => {
	                      getResponse = 1
	                     console.log("Done get all Scenarios: " +retry)
	                     if(timeout != ""){ clearTimeout(timeout)  }

	                    this.setState({
	                        scenarios: data,

	                    })
	                }
	            )
	            .catch(
			error => {
			          getError = 1
			          if(retry == 0){
			                    if(timeout != ""){ clearTimeout(timeout)  }
			                      alert(this.props.t("scenario:errorGetAllScenarios"));
			          }
			          else{
			                     this.getAllScenarios(retry-1)
			          }
			}
	            )
	        })
	        .catch(error => {
	                    getError = 1
	                    if(retry == 0){
	                              if(timeout != ""){ clearTimeout(timeout)  }
	                                alert(this.props.t("scenario:errorGetAllScenarios"));
	                    }
	                    else{
	                               this.getAllScenarios(retry-1)
	                    }
	                    console.log("Error get active Scenarios From Controller")
	        })

	         timeout = setTimeout(() => {
	                   console.log("get sCENARIO Timeout: " +getError+"---"+getResponse+"---"+retry)

	                   if(retry == 0){
	                             alert(this.props.t("scenario:errorGetAllScenarios"));
	                   }
	                   else{
	                             if((getResponse == 0 && getError == 0)){
	                                      this.getAllScenarios(retry-1)
	                             }
	                   }
	         }, 2000);
    }

    // Delete a scenario
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
                     scenario = new Scenario();
                     scenario.deleteScenario(id).then(
                        this.setState({
                            scenarios: this.state.scenarios.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("scenario:errorDeleteScenario")));
                 },
             }

          ],
          {cancelable: false},
        );


    }

    // Run a Scenario
    runScenario(id){
        scenario = new Scenario();
        scenario.run(id);
    }

    render() {
        // Each row of flat list
        const renderItem = ({item}) => (
            <Swipeable
              rightButtons={[
                   <TouchableHighlight style={commonStyles.runButton}
                    onPress={() => {
                       this.runScenario(item.id)
                    }}>
                    <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-run.png')}></Image>
                   </TouchableHighlight>,
                   <TouchableHighlight style={commonStyles.deleteButton}
                     onPress={() => {
                         this.removeItem(item.id, item.title)
                     }}>
                     <Image style={commonStyles.deleteButtonImage} source={require('../Common/img/common-light-delete.png')}></Image>
                   </TouchableHighlight>

                 ]} >
                <View key={item.id} style={commonStyles.flatListView}>
                    <TouchableHighlight
                      onPress={() => this._onPress(item)}
                      style={commonStyles.listViewTouch} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Image source={ImageVars.scenarioIconLightArray[item.icon]}  style={commonStyles.listViewTouchImg} />
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
                         data={this.state.scenarios}
                         renderItem={renderItem}
                     />

                    </View>

                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                        <ActionButton buttonColor="#ff2a62">
                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                                <Text style={commonStyles.addIcon}>+</Text>
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllScenarios()}}>
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

export default translate(['ScenarioPage', 'common'], { wait: true })(ScenarioPage);
