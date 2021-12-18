import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import {Image, FlatList, Alert, View, Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyFooter} from '../Common/MyFooter';
import {MyAlert} from '../Common/MyAlert';
import ZagrosDB from '../Common/lib/DB';
import Location from './lib/Location';
import Output from '../Output/lib/Output';
import RGB from '../RGB/lib/RGB';
import Thermometer from '../Thermometer/lib/Thermometer';
import Curtain from '../Curtain/lib/Curtain';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import Swipeable from 'react-native-swipeable-row';
import ActionButton from 'react-native-action-button';
import Spinner from 'react-native-loading-spinner-overlay';

export class LocationPage extends React.Component {

    constructor(props){
        super(props);

        this.state ={
          locations : "",
          add: "",
          spinner: true,
          alertMod: false,
        }

        this.getAllItems()
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus',this._handleStateChange);
    }

    getAllItems(){
      this.getAllLocations();
      this.getAllOutputs().then(d => {
	      this.getAllCurtains().then(c => {
		      this.getAllThermometers().then(t => {
		           this.getAllRGBs()
		      })
              .catch(error => {
                    console.log("Error in get all Thermometers: " + error)
              })
	      })
          .catch(error => {
                console.log("Error in get all curtains: " + error)
          })
      })
      .catch(error => {
            console.log("Error in get all outputs: " + error)
      })
    }

    _handleStateChange = state => {
       this.getAllItems()
    };    

    // Click on a location
    // Add button to create a new location
    clickLocation(item){
        this.props.navigation.navigate('LocationSetting', {item: item});
    }


    // Get all Locations from DB
    getAllLocations(){
              ZagrosDB.buildQuery(Vars.querySelect, "Location", "", "", "", "", "", 1).then(
                data => {
//                alert(data.length)
                    this.setState({
                        locations: data,
                    })
                }
             )
             .catch(
                error => {
                    alert(this.props.t("location:errorGetLocationFromDB"));
//                    console.log("Error in cat: "+error+"---")
                }
             )
          
        
    }

    getAllCurtains(retry){
            return new Promise((resolve, reject) => {
		if(!retry && (retry != 0)){ retry = 3 }
		getResponse = 0
		getError = 0
		timeout = ""

	           ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "", "", "", "", "", 1).then(
	                data => {
//	                              while((retry > 0) && (getResponse == 0)){
	                                        curtain = new Curtain()
                                                   curtain.getAllCurtainsFromController(data).then(curtainD => {
                                                  	getResponse = 1
//                                                  	console.log("Done get all curtains: " +retry)
                                                  	if(timeout != ""){
                                                  	          clearTimeout(timeout)
                                                  	}

                                                  	resolve(true)

                                                  })
                                                  .catch(error => {
                                                            getError = 1
						if(retry == 0){
//							console.log(i18n.t("location:errorGetLocationFromDB") + "---" + error)
							reject(error)
						}
						else{
//							if((getResponse == 0 && getError == 0)){
							         this.getAllCurtains(retry-1)
//							}
						}
                                                  })

	                     }
	             )
	           .catch(
	                error => {
//			          console.log("Get Curtains error: " +error)
	                    getError = 1
                    if(retry == 0){
                        reject(false)
                    }
                    else{
        //				if((getResponse == 0 && getError == 0)){
                                 this.getAllCurtains(retry-1)
        //				}
                    }
//	                    console.log(i18n.t("location:errorGetLocationFromDB"));
//	                    reject(error)
	                }
	             )



	})
        }

    getAllThermometers(retry){
         return new Promise((resolve, reject) => {
        		if(!retry && (retry != 0)){ retry = 3 }
        		getResponse = 0
        		getError = 0
        		timeout = ""

        	           ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "", "", "", "", "", 1).then(
        	                data => {
        //	                              while((retry > 0) && (getResponse == 0)){
        	                                        thermometer = new Thermometer()
                                                           thermometer.getAllThermometersFromController(data).then(thermometerC => {
                                                          	getResponse = 1
//                                                          	console.log("Done get all Thermometers: " +retry)
                                                          	if(timeout != ""){
                                                          	          clearTimeout(timeout)
                                                          	}
						resolve(true)
                                                          })
                                                          .catch(error => {
                                                                    getError = 1
        						if(retry == 0){
//        							console.log(i18n.t("thermometer:errorGetAllThermometers") + "---" + error)
        							reject(false)
        						}
        						else{
//        							if((getResponse == 0 && getError == 0)){
        							         this.getAllThermometers(retry-1)
//        							}
        						}
                                                          })

        	                     }
        	             )
        	           .catch(
        	                error => {
        	                    getError = 1
        			if(retry == 0){
        				reject(false)
        			}
        			else{
//        				if((getResponse == 0 && getError == 0)){
        				         this.getAllThermometers(retry-1)
//        				}
        			}
//        	                    console.log(i18n.t("thermometer:errorGetAllThermometers") + "---" + error);
        //	                    reject(error)
        	                }
        	)


            timeout = setTimeout(() => {
//        		console.log("get Thermometer Timeout: " +getError+"---"+getResponse+"---"+retry)

        		if(retry == 0){
        			reject(false)
        		}
        		else{
        			if((getResponse == 0 && getError == 0)){
        			         this.getAllThermometers(retry-1)
        			}
        		}
        	}, 1500);
	    })
    }

    getAllRGBs(retry){
        //            return new Promise((resolve, reject) => {
        if(!retry && (retry != 0)){ retry = 3 }
        getResponse = 0
        getError = 0
        timeout = ""

       ZagrosDB.buildQuery(Vars.querySelect, "RGB", "", "", "", "", "", 1).then(
            data => {
                rgb = new RGB()
                rgb.getAllRGBsFromController(data).then(RGBc => {
                    getResponse = 1

                    if(timeout != ""){
                        clearTimeout(timeout)
                    }

                })
                .catch(error => {
                    getError = 1
                    if(retry == 0){
                    }
                    else{
                        this.getAllRGBs(retry-1)
                    }
                })
            }
         )
       .catch(
            error => {
                getError = 1
                if(retry == 0){
                }
                else{
                    this.getAllRGBs(retry-1)
                }
            }
         )


        timeout = setTimeout(() => {
            if(retry == 0){
            }
            else{
                if((getResponse == 0 && getError == 0)){
                         this.getAllRGBs(retry-1)
                }
            }
       }, 1500);
    }

    getAllOutputs(retry){
       return new Promise((resolve, reject) => {
          if(!retry && (retry != 0)){ retry = 5 }
                 getResponse = 0
                 getError = 0
                 timeout = ""

                ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
                  data => {
                      output = new Output()
                      output.getAllOutputsFromController(data).then(
                              dataOut => {
                                        getResponse = 1
                                        this.setState({
                                                  spinner: false,
                                         })

                                        if(timeout != "") { clearTimeout(timeout)}
//                                        console.log("Done get all outputs")
                                        resolve(true)

                              }
                      ).catch(
                               error => {
                                   getError = 1
                                   if(retry == 0){
                                                  this.setState({
                                                     spinner: false,
                                                     alertMod: true,
                                                     titleModal: i18n.t('output:errorGetOutputDataFromDB'),
                                                  })
                                                  if(timeout != ""){ clearTimeout(timeout)}
                                                  reject(false)
                                    }
                                    else{
                                                  this.getAllOutputs(retry-1)
                                    }
                       //            alert(this.props.t("output:errorGetOutputDataFromDB"));
                               }
                            )
                  }
              ).catch(
                  error => {
                      getError = 1
                      if(retry == 0){
                            this.setState({
                               spinner: false,
                               alertMod: true,
                               titleModal: i18n.t('output:errorGetOutputDataFromDB'),
                            })
                            if(timeout != ""){ clearTimeout(timeout)}
                            reject(false)
                      }
                      else{
                            this.getAllOutputs(retry-1)
                      }
                  }
               )

               timeout = setTimeout(() => {
//                    console.log("get Output Timeout: " +getError+"---"+getResponse+"---"+retry)

                    if(retry == 0){
                              this.setState({
                                 spinner: false,
                                 alertMod: true,
                                 titleModal: i18n.t('output:errorGetOutputDataFromDB'),
                              })
                              reject(false)
                    }
                    else{
                              if((getResponse == 0 && getError == 0)){
                                       this.getAllOutputs(retry-1)
                              }
                    }
                    }, 2000);
       })

    }

    // Delete a location
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
                     location = new Location();
                     location.deleteLocation(id).then(
                        this.setState({
                            locations: this.state.locations.filter(item => item.id !== id)
                        })
                     )
                     .catch((error) => alert(this.props.t("location:errorDeleteLocation")));
                 },
             }

          ],
          {cancelable: false},
        );


    }

    onClickCancel(){
          this.setState({alertMod:false})
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
                      onPress={() => this.clickLocation(item)}
                      style={commonStyles.listViewTouch} >
                      <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                        <Image source={ImageVars.locationIconLightArray[item.icon]} style={commonStyles.listViewTouchImg} />
                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.title}</Text>
                      </View>
                    </TouchableHighlight>
                </View>
            </Swipeable>
        );

        return (

            <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}  >

                  <View  style={commonStyles.flex1}>
                    <FlatList
                        extraData={this.state}                        
                        keyExtractor={(item, index) => String(index)}
                        data={this.state.locations}
                        renderItem={renderItem}
                    />
                  </View>

                  <View style={commonStyles.floatingContainer(i18n.t('common:dir'))}>
                      <ActionButton buttonColor="#ff2a62">
                          <ActionButton.Item buttonColor='#9b59b6' title="" onPress={() => this.clickLocation()}>
                              <Text style={commonStyles.addIcon}>+</Text>
                          </ActionButton.Item>
                          <ActionButton.Item buttonColor='#21c7a9' title="" onPress={() => {this.getAllItems()}}>
                              <Image source={require('../Common/img/common-light-refresh.png')}  style={commonStyles.floatingImage} />
                          </ActionButton.Item>
                      </ActionButton>
                  </View>

                  { (this.state.spinner) ?  (
                   <View style={{flex:1, flexDirection:'column'}}>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={this.props.t('common:loading')}
                        textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
                    />
                    </View>
		) : (null) }

		 {(this.state.alertMod) ?  (
                    <View>
                         <MyAlert modalVisible={this.state.alertMod}
                            onClick2={() => {
                                   this.getAllItems()
                                   this.setState({alertMod:false})
                            }}
                           onClick1={() => this.onClickCancel()}
                           title1={i18n.t('common:cancel')}
                           title2={i18n.t('common:actions.ok')}
                           title={i18n.t('common:errorGetDataFromController')}   />
                  </View>
                  ) : (null) }

                  <View style={commonStyles.viewFooter}>
                    <MyFooter  navigation={this.props.navigation} />
                  </View>


            </LinearGradient>

        );
    }

}

export default translate(['LocationPage', 'common'], { wait: true })(LocationPage);
