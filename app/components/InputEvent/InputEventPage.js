import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Image, FlatList, Alert, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import ZagrosDB from '../Common/lib/DB';
import InputEvent from '../InputEvent/lib/InputEvent';
import Vars from '../Common/vars/commonVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';
import Thermometer from '../Thermometer/lib/Thermometer';
import Output from '../Output/lib/Output';
import Input from '../Input/lib/Input';

export class InputEventPage extends React.Component {

    constructor(props){
      super(props);
      this.state ={
          inputEvents : "",
          showList: true,
          add: "",
      }
                  output = new Output()
//                  thermometer = new Thermometer()

    }

    componentDidMount(){

	this.getAllItems()

          this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
       this.getAllItems()

     };

    _onPress(item){
        this.props.navigation.navigate('InputEventSetting', {item: item});
    }

    getAllInputs(retry){
          getResponse = 0
          getError = 0
          timeout = ""
          if(!retry && retry != 0){
                    retry = 3
          }
//          return new Promise((resolve, reject) => {
            input = new Input()
            input.getActiveInputsFromController().then(
                    dataInputs => {
                              getResponse = 1
//                              resolve(true)
                   // input = new Input();
//                  console.log("len of inputs:   ----------------"+dataInputs.length + "--"+dataInputs[0].title+"--")
                   // inputsArray = new Array();

//                   for(i=0; i<dataInputs.length; i++){
//                       dataInputs[i].label = dataInputs[i].title;
//                       dataInputs[i].val = 0;
//                       dataInputs[i].value = i;
//                       dataInputs[i].operand = 0;
//    //                   console.log("inputsss: " + i + "--" + dataInputs[i].value + "--" + dataInputs[i].label)
//                      //  dataInputs[i].type_id = dataInputs[i].type_id;
//                      //  dataInputs[i].type = dataInputs[i].type;
//                   }

//                   this.setState({
//                      inputs: dataInputs,
//                      inputsRadio: dataInputs,
//                   }, () => {
//                        resolve(true)
//                   })

    //               this.getAllActiveThermometers().then((data) => {
    //                  resolve(true)
    //               })
    //               .catch(error => {
    //                  console.log("error in active therm " + error)
    //               })

               }
            )
            .catch(
               error => {
                    getError = 1
//                   alert(this.props.t("input:errorGetAllInputs"));
//                   reject(this.props.t("input:errorGetAllInputs"))
                   console.log("error in get inputs "+error)
               }
            )

          setTimeout(() => {
             if((getResponse == 0 ) || (getError ==1) ){
                 if(retry > 0){
                     this.getAllInputs(retry-1)
                 }
                 else {

                   alert(this.props.t("input:errorGetAllInputs"));
//                     reject(false)
                 }
             }
         }, 1200);

        }

    getAllItems(retry){
		if(!retry && (retry != 0)){ retry = 2 }
       		getResponse = 0
       		getError = 0
       		timeout = ""

                  this.getAllInputEvents().then(dataI => {
                         getResponse = 1
                         if(timeout != ""){ clearTimeout(timeout) }
                         this.getAllInputs()
                  })
                  .catch(error => {
                              getError = 1
                  })

	        timeout = setTimeout(() => {
//                             console.log("get IE Timeout: " +getError+"---"+getResponse+"---"+retry)
			if((getResponse == 0) || (getError == 1)){
	                             if(retry == 0){
	                                       alert(this.props.t("inputEvent:errorGetAllInputEvents"));
	                             }
	                             else{
	                                        this.getAllItems(retry-1)
	                             }
                             }
                   }, 2000);
    }

    getAllInputEvents(){

	return new Promise((resolve, reject) => {
	  inputEvent = new InputEvent()
                  inputEvent.updateInputEventsFromController().then(activeInputEvents => {
//                  console.log("Active IESssssssssssss: " + activeInputEvents)
                      // Get all InputEvents from DB
                      ZagrosDB.buildQuery(Vars.querySelect, "InputEvent", "", "status=1", "", "", "", 1).then(
                          data => {
                              this.setState({
                                  inputEvents: data,
                              }, () => {
                                        resolve(true)
                              })


                          }
                      )
                      .catch(
                          error => {
                              console.log("error in update IE: " + error)
//                              alert(this.props.t("inputEvent:errorGetAllInputEvents"));
                              reject(error)
                          }
                      )
                  })
                  .catch(error => {
//                      console.log("Error in get active inputE " + error)
                              reject(error)
                  })
	})

         

    }

    // Delete a inputEvent
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
                     inputEvent = new InputEvent();
                     inputEvent.deleteInputEvent(id).then(
                        this.setState({
                            inputEvents: this.state.inputEvents.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) =>
                     { 
                         alert(this.props.t("inputEvent:errorDeleteInputEvent"))
                        console.log("Error in delete input event in page : "+ error)
                     });
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

                    <View  style={commonStyles.flex1}>

                     <FlatList
                         extraData={this.state}
                         keyExtractor={(item, index) => String(index)}
                         data={this.state.inputEvents}
                         renderItem={renderItem}
                     />

                    </View>
                    
                    <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                        <ActionButton buttonColor="#ff2a62">
                            <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this._onPress()}>
                                <Text style={commonStyles.addIcon}>+</Text>
                            </ActionButton.Item>
                            <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllItems()}}>
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

export default translate(['InputEventPage', 'common'], { wait: true })(InputEventPage);
