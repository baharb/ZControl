import {StyleSheet, Dimensions} from 'react-native';
import i18n from 'i18next';

let isRTL = i18n.dir();
const win = Dimensions.get('window');
const ratio = win.width/750;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#F5FCFF',
      fontFamily: 'Vazir-Medium'
  },
  langContainer:{
      alignItems:isRTL === 'rtl'? 'flex-end':'flex-start',
      paddingRight:isRTL === 'rtl'? 30:10,
      paddingLeft:isRTL === 'rtl'? 10:30,
      borderTopWidth:2,
      borderTopColor:"#000",
      flexDirection: isRTL === 'rtl'? 'row-reverse':'row',
      padding:5,
      borderRightWidth:isRTL === 'rtl'? 2:0,
      borderLeftWidth:isRTL === 'rtl'? 0:2,
      borderRightColor:"#000",
      borderLeftColor:"#000",
      fontFamily: 'Vazir-Medium'
  },
  separate: {
      marginTop: 50
  },
  flagBtn: {
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#fff',
    alignItems: 'center',

      // backgroundImage: require('../images/english.png'),
  },
  imageStyle: {
    width: 70,
    height: 70,
    borderRadius: 70,
  },
  imageBack: {
      width: win.width - 40,
      height: win.width - 40,
      padding: 20
  },
  viewTransparent: {
    backgroundColor: '#4b1f5d',
    borderRadius: 7,
    marginLeft: 10,
    marginRight: 10,
  },
  paddingView: {
    padding: 10,
    paddingTop: 5,
    paddingBottom: 10,
    marginBottom: 15,
  },
  textFlag: {
    paddingTop: 15,
    // paddingBottom: 15
  },
  title: (dir) => ({
    fontSize: 20,
    padding: 10,
    color: '#b08dbf',
    paddingTop: 15,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    // flex: 1
  }),
  line: {
      borderBottomColor: '#b08dbf',
      borderBottomWidth: 2,
      margin: 10
  },
  headerImg: {
    width: win.width,
    resizeMode: 'contain',
    marginBottom: 20,
    marginTop: 0,
    top: 0,
    height: ratio * 151
  },
  titleHomeText: {color:'#b08dbf', fontSize:25,  textAlign:'center', fontWeight:'bold'},
  versionHomeText: (dir) => ({
          color:'#b08dbf',
          fontSize:14,
          textAlign:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
   }),
   home: {flex:1, flexDirection:"column", justifyContent:'center', },
   homeHolder: {flex: 9, alignItems: 'center', },
  installHeader:{height: 80, marginTop: 0, flex: 2, marginBottom: 40},
  logoImg: {
    height: 80,
    width: 100,
      resizeMode: 'contain',
      padding: 3,
      flexDirection: isRTL === 'rtl'? 'row':'row-reverse',
    alignItems:isRTL === 'rtl'? 'flex-start':'flex-end',
    marginLeft: 5
  },
  title1: {
    fontSize: 20,
    padding: 10,
    color: '#b08dbf',
    flexDirection: isRTL === 'rtl'? 'row-reverse':'row',
    alignItems:isRTL === 'rtl'? 'flex-end':'flex-start',
    paddingTop: 30
  },
})

export default styles;
