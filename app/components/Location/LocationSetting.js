import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { Modal, TouchableOpacity, Switch, KeyboardAvoidingView, ScrollView, Image, FlatList, View, Text, TextInput, TouchableHighlight, RecyclerViewBackedScrollViewBase} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Location from './lib/Location';
import Output from '../Output/lib/Output';
import Curtain from '../Curtain/lib/Curtain';
import ZagrosDB from '../Common/lib/DB';
import Vars from '../Common/vars/commonVars';
import ImageVars from '../Common/imageVars';
import CheckBox from 'react-native-checkbox';
import Thermometer from '../Thermometer/lib/Thermometer';
import RGB from '../RGB/lib/RGB';

export class LocationSetting extends React.Component {
    constructor(props){
      super(props);

      output = new Output()
      checkedArray = new Array(output.OUTPUT_NUMBER)

      curtain = new Curtain()
      checkedCurtainArray = new Array(curtain.CURTAIN_NUMBER)

      thermometer = new Thermometer()
      checkedThermometersArray = new Array(thermometer.THERMOMETER_MAX_NUMBER)

      rgb = new RGB()
      checkedRGBsArray = new Array(rgb.RGB_MAX_NUMBER)

      this.state ={
            locations : "",
            successName: true,
            modalVisible: false,
            modalCurtainVisible: false,
            modalThermometerVisible: false,
            modalRGBVisible: false,
            outputs: [],
            curtains: [],
            thermometers: [],
            rgbs:[],
            isChecked: false,
            checked: [],
            checkedCurtain: [],
            checkedRGBs: [],
            mode: "add",
            locationName: "",
       }

      this.saveLocation = this.saveLocation.bind(this);
      this.getOutputsOfLocation =  this.getOutputsOfLocation.bind(this);
      this.getSelectedOutputs = this.getSelectedOutputs.bind(this);
      this.getSelectedCurtains = this.getSelectedCurtains.bind(this);
      this.getSelectedThermometers = this.getSelectedThermometers.bind(this);
      this.getSelectedRGBs = this.getSelectedRGBs.bind(this);
    }

    setModalVisible(modalType, visible) {

        if(modalType == "output"){
            this.setState({modalVisible: visible});
        }
        else if(modalType == "curtain"){
            this.setState({modalCurtainVisible: visible});
        }
        else if(modalType == "thermometer"){
            this.setState({modalThermometerVisible: visible});
        }
        else if(modalType == "rgb"){
            this.setState({modalRGBVisible: visible});
        }

    }

    getOutputsOfLocation(locationId){

         // Get all outputs of selected location from DB
         ZagrosDB.buildQuery(Vars.querySelect, "Output", "id", "location_id = " + locationId, "", "", "", 1, 0).then(
            data => {
                outputArray = new Array();
                for(i=0; i<data.length; i++){
                    outputArray[i] = data[i].id;
                }

                j = 0;
                for(i=0; i<checkedArray.length; i++){
                    if((i+1) == outputArray[j]){
//                        console.log("i: " + (i+1))
                        checkedArray[i] = true;
                        j++;
                    }
                }

                this.setState({
                   checked: checkedArray,
                })

                this.getSelectedOutputs();
            }
         )
         .catch(
            error => {
                alert(i18n.t("location:errorGetOutputsOfLocationFromDB"));
            }
         )

    }

    getCurtainsOfLocation(locationId){

         // Get all curtain of selected location from DB
         ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "id", "location_id = " + locationId, "", "", "", 1, 0).then(
            data => {

                curtainArray = new Array();
                for(i=0; i<data.length; i++){
                    curtainArray[i] = data[i].id;
                }

                j = 0;
                for(i=1; i<=checkedCurtainArray.length; i++){
                    if(i == curtainArray[j]){
                        checkedCurtainArray[i] = true;
                        j++;
                    }
                }

                this.setState({
                   checkedCurtain: checkedCurtainArray,
                })

                this.getSelectedCurtains();
            }
         )
         .catch(
            error => {
                alert(i18n.t("location:errorGetCurtainsOfLocationFromDB"));
            }
         )

    }

    getThermometersOfLocation(locationId){

        thermometer = new Thermometer();
        checkedThermometersArray = new Array(thermometer.THERMOMETER_MAX_NUMBER)

         // Get all curtain of selected location from DB
         ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "id", "location_id = " + locationId, "", "", "", 1, 0).then(
            data => {

                thermometersArray = new Array();
                for(i=0; i<data.length; i++){
                    thermometersArray[i] = data[i].id;
                }

                j = 0;
                for(i=0; i<checkedThermometersArray.length; i++){
                    // console.log(i + "------------" +thermometersArray[i] + "----" + j + "---"+(i == thermometersArray[j]))
                    if((i+1) == thermometersArray[j]){
                        checkedThermometersArray[i] = true;
                        j++;
                    }
//                     console.log(i + "------------" +checkedThermometersArray[i] + "----" + j + "---"+((i+1) == thermometersArray[j]))
                }

                this.setState({
                   checkedThermometers: checkedThermometersArray,
                }, () =>{
                    this.getSelectedThermometers();
                })


            }
         )
         .catch(
            error => {
//                console.log("error get selected thermometer "+error)
                alert(i18n.t("location:errorGetThermometerOfLocationFromDB"));
            }
         )

    }

    getRGBsOfLocation(locationId){

        rgb = new RGB();
        checkedRGBsArray = new Array(rgb.RGB_MAX_NUMBER)

         // Get all curtain of selected location from DB
         ZagrosDB.buildQuery(Vars.querySelect, "RGB", "id", "location_id = " + locationId, "", "", "", 1, 0).then(
            data => {

                rgbsArray = new Array();
                for(i=0; i<data.length; i++){
                    rgbsArray[i] = data[i].id;
                }

                j = 0;
                for(i=0; i<checkedRGBsArray.length; i++){
                    // console.log(i + "------------" +thermometersArray[i] + "----" + j + "---"+(i == thermometersArray[j]))
//                     console.log(i + "------------" +checkedRGBsArray[i] + "----" + j + "---"+((i+1) == checkedRGBsArray[j]))
                    if((i+1) == rgbsArray[j]){
                        checkedRGBsArray[i] = true;
                        j++;
                    }
                }

                this.setState({
                   checkedRGBs: checkedRGBsArray,
                })

                this.getSelectedRGBs();
            }
         )
         .catch(
            error => {
//                console.log("error get selected rgb "+error)
                alert(i18n.t("rgb:errorGetRGBOfLocationFromDB"));
            }
         )

    }

    componentDidMount(){

        const { navigation } = this.props;
        const item = navigation.getParam('item', null);

        output = new Output()

        // List of outputs for check
        for(i=0; i < output.OUTPUT_NUMBER; i++){
            checkedArray[i] = false;
        }

        // List of curtains for check
        for(i=0; i < curtain.CURTAIN_NUMBER; i++){
            checkedCurtainArray[i] = false;
        }

        // List of curtains for check
        for(i=0; i < thermometer.THERMOMETER_MAX_NUMBER; i++){
            checkedThermometersArray[i] = false;
        }

        // List of curtains for check
        for(i=0; i < rgb.RGB_MAX_NUMBER; i++){
            checkedRGBsArray[i] = false;
        }

        this.getAllOutputs().then(o => {
		if(item != null){this.getOutputsOfLocation(item.id);}

		this.getAllCurtains().then(c => {
			if(item != null){this.getCurtainsOfLocation(item.id);}

			this.getAllThermometers().then(t => {
			      if(item != null){ this.getThermometersOfLocation(item.id);}

			      this.getAllRGBs().then(t => {
	                                    if(item != null){ this.getRGBsOfLocation(item.id);}
	                           })
			  })
		})
        })

        if(item != null){
            this.setState({
                    locationId: item.id,
                    locationName: item.title,
                    locationIcon: item.icon,
                    checkShowHomepage: (item.show_home == 1) ? true : false,
                    mode: "edit",
            });

        }
        else{
            this.setState({
                    locationId: 0,
                    locationName: "",
                    locationIcon: 0,
                    checkShowHomepage: false,
                    checked: checkedArray,
                    checkedCurtain: checkedCurtainArray,
                    checkedThermometers: checkedThermometersArray,
                    checkedRGBs: checkedRGBsArray,
            });

            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }

        // })

//        this.refs.titleTextInput.focus();
    }

    saveLocation(){
        LocationIns = new Object();
        if(this.state.locationName.trim().length == 0){
            this.setState({
                successName: false,
            })
            setTimeout(() => this.refs.titleTextInput.focus(), 150)
        }
        else{
            LocationIns.title = this.state.locationName;
            LocationIns.icon = this.state.locationIcon;
            LocationIns.showHome = this.state.checkShowHomepage;
            LocationIns.id = this.state.locationId;

            location = new Location();
//             console.log("saveeeeeeeee ")

            location.saveLocationInDB(LocationIns, this.state.checked, this.state.checkedCurtain, this.state.checkedThermometers, this.state.checkedRGBs, this.state.mode).then(
                data => {
    //                if(data == true){
//                        console.log("location  successfully updated: "+data);
            this.props.navigation.navigate('LocationPage');
        
                    }
    //            }
            ).catch(
                error => {
//                    console.log(error + "please try againnnnnnnnnnnnnnnnnn")
                }
            );
        }
    }

    active(position){
        this.setState({
            locationIcon : position,
        })
    }

    // Change BG color of locations
    bgColor(position) {
        if (this.state.locationIcon === position) {
            return "#d4bdde";
        }
        else{
            return "transparent";
        }
    }

    // Render and return Location icons
    renderIcons() {
        const iconItems = [];

        ImageVars.locationIconArray.map((item, position) => {
             iconItems.push( <TouchableOpacity  key={position}
                    onPress={() => {this.active(position);}}
                    style={[commonStyles.iconListTouch, {backgroundColor: this.bgColor(position)}]}>
                   <Image source={item} style={commonStyles.iconListImage}></Image>
                </TouchableOpacity>
               );
               }
        )

        return iconItems;
    }

    // Get all outputs from DB
    getAllOutputs(){
         return new Promise((resolve, reject) => {
            output = new Output()

            ZagrosDB.buildQuery(Vars.querySelect, "Output", "", "", "", "", "", 1).then(
               data => {
   
                   this.setState({
                       outputs: data
                   })
   
                   resolve(data)
               }
            )
            .catch(
               error => {
                   alert(i18n.t("output:errorGetOutputDataFromDB"));
                   reject(error)
               }
            )
         })
         
    }

    // Get all curtains from DB
    getAllCurtains(){
        return new Promise((resolve, reject) => {
           
         ZagrosDB.buildQuery(Vars.querySelect, "Curtain", "", "", "", "", "", 1).then(
            data => {                

//                curtain = new Curtain()
//                curtain.getAllCurtainsFromController(data).then(curtainD => {
                    this.setState({
                        curtains: data
                    })

                    resolve(data)
//                })
            }
         )
         .catch(
            error => {
                alert(i18n.t("location:errorGetLocationFromDB"));
                reject(error)
            }
         )
        })
    }

    // Get all curtains from DB
    getAllThermometers(){
        return new Promise((resolve, reject) => {
           
         ZagrosDB.buildQuery(Vars.querySelect, "Thermometer", "", "", "", "", "", 1).then(
            data => {                

//                thermometer = new Thermometer()
//                thermometer.getAllThermometersFromController(data).then(thermometerD => {
                    this.setState({
                              thermometers: data
                    }, () => {
                              resolve(data)
                    })
//                })
//            }
         })
         .catch(
            error => {
//                console.log("error in update location thermometerssss " + error)
                alert(i18n.t("location:errorGetLocationFromDB"));
                reject(error)
            }
         )
        })
    }

    getAllRGBs(){
        return new Promise((resolve, reject) => {

         ZagrosDB.buildQuery(Vars.querySelect, "RGB", "", "", "", "", "", 1).then(
            rgbD => {

//                rgb = new RGB()
//                rgb.getAllRGBsFromController(data).then(rgbD => {
                    this.setState({
                        rgbs: rgbD
                    })
                    resolve(rgbD)
//                })
            }
         )
         .catch(
            error => {
                console.log("error in update location RGBs " + error)
                alert(i18n.t("rgb:errorGetAllRGBsFromController"));
                reject(error)
            }
         )
        })
    }

    getSelectedOutputs() {
        selectedOutputs = [];
        outputs = new Array();
        outputs = this.state.outputs;
        i = 0;
        checked = this.state.checked;

        outputs.forEach((item) => {
            if((checked[i] == true) && ((i+1) == item.id)){
                selectedOutputs.push(
                   <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                        <Image source={ImageVars.outputIconLightArray[item.icon]} style={commonStyles.listViewTouchImg} ></Image>
                        <Text  style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{item.name}</Text>
                   </View>
                );
            }
            i++;
        });

        this.setState({
            selectedOutputsArray : selectedOutputs,
        })
    }

    //
    getSelectedCurtains() {
        const selectedCurtains = [];
        curtains = new Array();
        curtains = this.state.curtains;

        if(curtains != null && curtains != ""){
            for(i=0; i<curtains.length; i++){
                if(this.state.checkedCurtain[i+1] == true){
                    selectedCurtains.push(
                        <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                           <View style={commonStyles.listImg}><Image source={ImageVars.locationIconArray[curtains[i].icon]}  ></Image></View>
                           <View style={commonStyles.listTitleView}>
                                        <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{curtains[i].title}</Text>
                           </View>
                        </View>
                    );
                }
            }
        }

        this.setState({
            selectedCurtainArray : selectedCurtains,
        })
    }

    //
    getSelectedThermometers() {
        const selectedThermometers = [];
        thermometers = new Array();
        thermometers = this.state.thermometers;
        // console.log("get selected thermmmmmmmmmmm: " + "==="+this.state.checkedThermometers.length+"===="+thermometers.length)
                
        if(thermometers != null && thermometers != ""){

            for(i=0; i<thermometers.length; i++){
//                 console.log("get selected thermmmmmmmmmmm: " + i +"==="+this.state.checkedThermometers[i]+"---"+thermometers.length)
                if(this.state.checkedThermometers[i] == true){
                    selectedThermometers.push(
                        <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                           <View style={commonStyles.listTitleView}>
                           <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{thermometers[i].title}</Text>
                           </View>
                        </View>
                    );
                }
            }
        }

        this.setState({
            selectedThermometersArray : selectedThermometers,
        })
    }

    getSelectedRGBs() {
        const selectedRGBs = [];
        rgbs = new Array();
        rgbs = this.state.rgbs;
        // console.log("get selected thermmmmmmmmmmm: " + "==="+this.state.checkedThermometers.length+"===="+thermometers.length)

        if(rgbs != null && rgbs != ""){

            for(i=0; i<rgbs.length; i++){
                // console.log("get selected thermmmmmmmmmmm: " + i +"==="+this.state.checkedThermometers[i]+"---"+thermometers.length)
                if(this.state.checkedRGBs[i] == true){
                    selectedRGBs.push(
                        <View key={i}  style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                           <View style={commonStyles.listTitleView}>
                              <Text style={commonStyles.listViewTouchText(i18n.t('common:dir'))}>{rgbs[i].title}</Text>
                           </View>
                        </View>
                    );
                }
            }
        }

        this.setState({
            selectedRGBsArray : selectedRGBs,
        })
    }

    render() {
        const {t} = this.props;

        renderItem = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <Image source={ImageVars.outputIconArray[item.icon]}  style={{flex: 1, resizeMode : 'contain', justifyContent: 'flex-start'}} />
                <CheckBox style={{flex: 8}}
                    onChange={(checked) => {

                        checkedArray = this.state.checked;
                        checkedArray[item.id-1] = !checkedArray[item.id-1];
                        this.setState({ checked: checkedArray });
                     }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checked[item.id-1]}
                    label={item.name}
                />

                <View style={{flex: 1}} />

            </View>
         );

         const renderItemCurtain = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <CheckBox style={{flex: 5}}
                    onChange={(checked) => {

                        checkedArray = this.state.checkedCurtain;
                        checkedArray[item.id] = !checkedArray[item.id];
                        this.setState({ checkedCurtain: checkedArray });
                    }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checkedCurtain[item.id]}
                    label={item.title}
                />
                <View style={{flex: 3}} />
            </View> 
     
         );

         const renderItemThermometer = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <CheckBox style={{flex: 5}}
                    onChange={(checked) => {

                        checkedArray = this.state.checkedThermometers;
                        checkedArray[item.id-1] = !checkedArray[item.id-1];
                        this.setState({ checkedThermometers: checkedArray });
                    }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={(this.state.checkedThermometers != null) ? this.state.checkedThermometers[item.id-1] : 0}
                    label={item.title}
                />
                <View style={{flex: 3}} />
            </View> 
     
        );

         const renderItemRGB = ({item}) => (
            <View key={item.id} style={commonStyles.rowSelectObject(i18n.t('common:dir'))} >
                <CheckBox style={{flex: 5}}
                    onChange={(checked) => {

                        checkedArray = this.state.checkedRGBs;
                        checkedArray[item.id-1] = !checkedArray[item.id-1];
                        this.setState({ checkedRGBs: checkedArray });
                    }
                    }
                    dir={i18n.t('common:dir')}
                    labelColor={'#441458'}
                    iconColor={'#441458'}
                    checked={this.state.checkedRGBs[item.id-1]}
                    label={item.title}
                />
                <View style={{flex: 3}} />
            </View>

        );

        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding"  style={{flex:1}} enabled >
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
                                        locationName: txt,
                                        successName: false
                                    })
                                }
                                else{
                                    this.setState({
                                        locationName: txt,
                                        successName: true
                                    })
                                }
                            }}
                            value={this.state.locationName}
                        />
                    </View>

                    <View  style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                        {!this.state.successName ? (
                            <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                              {t('location:locationFillName')}
                            </Text>
                        ) : (null)}
                    </View>
                    
                   <View style={commonStyles.containerIconList(i18n.t('common:dir'))}>
                       <ScrollView horizontal={true} style={commonStyles.iconList(i18n.t('common:dir'))} >
                            {this.renderIcons()}
                        </ScrollView>
                    </View>

                    <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                        <View style={commonStyles.switch}>
                            <Switch
                                        trackColor={{ false: "#767577", true: "#d094ea" }}
                                        thumbColor={this.state.checkShowHomepage ? "#ff2a62" : "#f4f3f4"}
	                                onChange={()=>{
	                                var c = this.state.checkShowHomepage;
	                                this.setState({
	                                    checkShowHomepage:!c
	                                })
                              }
                            }
                            value={this.state.checkShowHomepage} />
                        </View>
                        <View >
                            <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}
                                  onPress={()=>{
                                    var c=this.state.checkShowHomepage;
                                    this.setState({
                                        checkShowHomepage:!c
                                    })
                                  }}
                                 >{t('location:showHome')}</Text>
                        </View>
                    </View>

                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('output:output')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setModalVisible("output", true);
                                this.setState({
                                    outputsActive: this.state.outputs.filter(item => item.flag !== 0)
                                })
                              }}>
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedOutputsArray}
                    </View>

                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('curtain:curtain')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setModalVisible("curtain", true);
                                this.setState({
                                    curtainsActive: this.state.curtains.filter(itemC => itemC.status !== 0)
                                })
                            }}
                            >
                          <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedCurtainArray}
                    </View>

                    <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('thermometer:thermometer')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setModalVisible("thermometer", true);
                                this.setState({
                                    thermometersActive: this.state.thermometers.filter((itemT) => itemT.status !== 0)
                                })
                            }}
                            >
                        <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedThermometersArray}
                    </View>

                     <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{t('rgb:rgb')}</Text>
                        <TouchableHighlight  style={commonStyles.addIconRowContainer(i18n.t('common:dir'))}
                            onPress={() => {
                                this.setModalVisible("rgb", true);
                                this.setState({
                                    rgbsActive: this.state.rgbs.filter((itemT) => itemT.status !== 0)
                                })
                            }}
                            >
                        <Text style={commonStyles.addIconRow}>+</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={commonStyles.listViewTouchViewColumn(i18n.t('common:dir'))} >
                        {this.state.selectedRGBsArray}
                    </View>

                </View>

                <View style={commonStyles.viewOkButton} >
                  <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                       onPress={() => this.saveLocation() }>
                  </MyButton>
                </View>

                <View>
                     <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                              this.setState({modalVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('output:selectOutput')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.outputsActive}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.outputsActive}
                             renderItem={renderItem}
                           />
                        </View>
                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('output:selectOutput') }   dir={t("common:dir")}
                              onPress={() => {this.setState({modalVisible: false})
                              this.getSelectedOutputs()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>

                <View>
                 <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalCurtainVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalCurtainVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('curtain:selectCurtain')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.curtainsActive}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.curtainsActive}
                             renderItem={renderItemCurtain}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('curtain:selectCurtain') }   dir={t("common:dir")}
                              onPress={() => {this.setState({modalCurtainVisible: false})
                              this.getSelectedCurtains()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>

                <View>
                 <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalThermometerVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalThermometerVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('thermometer:selectThermometer')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.thermometersActive}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.thermometersActive}
                             renderItem={renderItemThermometer}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('thermometer:selectThermometer') }   dir={t("common:dir")}
                              onPress={() => {this.setState({modalThermometerVisible: false})
                              this.getSelectedThermometers()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>

                <View>
                 <Modal
                       style={commonStyles.modalStyle}
                       animationType="slide"
                       transparent={false}
                       visible={this.state.modalRGBVisible}
                       presentationStyle='pageSheet'
                       onRequestClose={() => {
                           this.setState({modalRGBVisible: false})
                         }}>
                        <View style={commonStyles.modalTitle}>
                            <Text style={commonStyles.modalTitleText(i18n.t("common:dir"))}> {t('rgb:selectRGB')} </Text>
                        </View>
                        <View style={commonStyles.modalList}>
                           <FlatList
                             extraData={this.state.rgbsActive}
                             keyExtractor={(item, index) => String(index)}
                             data={this.state.rgbsActive}
                             renderItem={renderItemRGB}
                           />
                        </View>

                        <View style={commonStyles.modalButton} >
                         <MyButton title={t('rgb:selectRGB') }   dir={t("common:dir")}
                              onPress={() => {this.setState({modalRGBVisible: false})
                              this.getSelectedRGBs()
                                }}>
                         </MyButton>
                       </View>
                     </Modal>

                </View>

              </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
        );
    }


}

export default translate(['LocationSetting', 'common'], { wait: true })(LocationSetting);
