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
      borderLeftColor:"#000"
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

  },
  paddingView: {
    padding: 10,
    marginTop: 50
  },
  textFlag: (dir) =>({
    paddingTop: 5,
    color: "#fff",
    fontFamily: (dir === 'right') ? 'Vazir' : 'Nunito-Bold',
    fontSize: 16,
    // paddingBottom: 15
  }),
  viewFlags: (dir) => ({
          flexDirection:  (dir === 'right') ? 'row-reverse' : 'row',
          alignItems: 'center',justifyContent: 'center'
  }),
  viewFlag: {flex: 1, alignItems: 'center',justifyContent: 'center', marginBottom: 20},
  title: {
    fontFamily: 'Vazir-Medium',
    fontSize: 18,
    padding: 10,
    color: '#b08dbf',
    paddingTop: 15
    // flex: 1
  },
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
  flagImage: {width: 70, height: 70},
  headerInstallView: {
          height: 80, marginTop: 0
  },
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
