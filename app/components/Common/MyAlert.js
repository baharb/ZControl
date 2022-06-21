import React from "react";
import i18n from 'i18next';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View, TextInput
} from "react-native";
import RadioForm from 'react-native-simple-radio-button';

export class MyAlert extends React.Component {
  constructor(props){
          super(props)
          //console.log("*******************" +this.props.modalVisible)
          this.state={
                    modalVisible: this.props.modalVisible,
                    ip: this.props.ip,
          }


  }

  componentDidUpdate(prevProps, prevState) {

               	         // console.log("updateeeeeee2222:   id: " +this.props.modalVisible +"----value: " + this.state.modalVisible+"---"+prevProps.modalVisible +"---" +prevState.modalVisible)
  	          if(this.state.modalVisible !== this.props.modalVisible ) {
               	          this.setState({modalVisible: this.props.modalVisible});
               	  }
  }

componentDidMount(){
	if(this.props.selectedConnection){
		this.refs.refRadioSelectedConnection.updateIsActiveIndex(this.props.selectedConnection);
	}
}



 render(){

  return (
  <View style={(this.props.radioItems) ? {height: 380} : {height: 150}}>
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={() => {

        }}
      >
        <View style={[styles.centeredView, (this.props.radioItems) ? {height: 380} : {height: 160}]}>
          <View style={[styles.modalView, (this.props.radioItems) ? {height: 380} : {height: 160}]}>
            <Text style={styles.modalText(this.props.dir)}>{this.props.title}</Text>

		<View style={{flex:1, flexDirection:'row', height: 40}}>

	            <TouchableHighlight
		              style={{ ...styles.openButton(this.props.dir), backgroundColor: "#ff2a62", margin:5 , height: 50, width: 120}}
		              onPress={this.props.onClick1} >
	                    <Text style={styles.textStyle(this.props.dir)}>{this.props.title1}</Text>
	            </TouchableHighlight>

	            <TouchableHighlight
	                         style={{ ...styles.openButton(this.props.dir), backgroundColor: "#ff2a62" , margin:5 , height: 50, width: 120}}
	                         onPress={this.props.onClick2} >
	                    <Text style={styles.textStyle(this.props.dir)}>{this.props.title2}</Text>
	            </TouchableHighlight>

              </View>
	            {(this.props.radioItems) ? (

	            <View style={{flex:1, flexDirection: 'column', width: '100%'}} >
	            <View style={commonStyles.line}></View>
	            <RadioForm
	                             radio_props={this.props.radioItems}
	                             ref="refRadioSelectedConnection"
	                             labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
	                             initial={this.props.selectedConnection}
	                             onPress={(value, index) => {
	                                        selectedConnection =  this.props.radioItems[index].value
                                                  this.setState({selectedVal: this.props.radioItems[index].value}, () => {
                                                  })
	                              }}
                         />
		     <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
	                        <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{this.props.title3}</Text>
                                   <TextInput style={styles.txtInput(i18n.t('common:dir'))}
                                   onChangeText={(txt) => {
                                              staticIp = txt
                                             this.setState({
                                                  ip: txt
                                             })
                                   }   }
                                   value={this.state.ip}
                                   />
	               </View>
	               </View>
	                ) : (null) }


          </View>
        </View>
      </Modal>

    </View>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    flexDirection:'row',
    alignItems: "center",
    marginTop: 12,
       minHeight: 200,
       height: 'auto',
  },
  modalView: {
    marginTop: 20,

    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 200,
    height: 'auto',
  },

  openButton: (dir) => ({
    backgroundColor: "#ff2a62",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize: 13
  }),
  textStyle: (dir) => ({
    fontSize: 16,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    color: '#fff' ,
    textAlign: "center"
  }),
  modalText: (dir) => ({
    marginBottom: 15,
    textAlign: "center",
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize: 16,
    color: '#1d0527',
  })       ,
    txtInput: (dir) => ({
      fontSize: 15,
      paddingTop: 3,
      marginTop: 3,
      fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      marginBottom: 10,
      color: '#80628d',
      height: 45,
      borderColor: '#80628d',
      borderWidth: 1,
      borderRadius: 50,
      marginLeft: dir === 'right' ? 15 : 0,
      marginRight: dir === 'right' ? 0 : 15,
      paddingLeft: 10,
      paddingRight: 10,
      flex: 3
    }),

});
