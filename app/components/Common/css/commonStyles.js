import {StyleSheet, Dimensions} from 'react-native';

import i18n from 'i18next';

isRTL = i18n.t('common:direction')


// alert("issss"+isRTL)


const win = Dimensions.get('window');
const ratio = win.width/460;

export default commonStyles = StyleSheet.create({
  cont: {
    flex: 1,
    paddingTop: 10,
  },
  containDateSetting:{
    height: 400,
  },
  title: (dir) => ({
      fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      fontSize: 18,
      padding: 10,
      color: '#b08dbf',
      paddingTop: 15
      // flex: 1
    }),
  imageBack: {
          justifyContent:'center',
          resizeMode: 'contain',
          minWidth: 100,
          minHeight: 100,
          width: '95%',
          height: '95%'
  },
  pad20: {
    padding: 40,
    textAlign: 'center',
    justifyContent:'center'
  },
  logoImg: {
    height: 80,
    width: 100,
    resizeMode: 'contain',
    padding: 3,
    flexDirection: isRTL == 'right'? 'row':'row-reverse',
    alignItems: 'flex-start',
    marginLeft: 5
  },
   logoImg1: {
      height: 50,
      width: 80,
      resizeMode: 'contain',
      padding: 3,
      marginTop: 10,
      marginBottom: 13,
      marginRight: 20,
      marginLeft: 20,
      paddingLeft: 10,
      paddingRight: 10,
    },
  title1: (dir) => ({
    fontSize: 20,
    padding: 10,
    color: '#b08dbf',
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    alignItems: (dir === 'right') ? 'flex-end':'flex-start',
    paddingTop: 30,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
  }),
  headerImg: {
    width: win.width,
    resizeMode: 'contain',
    marginBottom: 0,
    marginTop: 0,
    top: 0,
    height: ratio * 151
  },
  containerView:{
    width: '100%',
    paddingBottom: 15,
  },
  containerViewMain:{
    width: '100%',
    paddingBottom: 15,
    flex: 1,
    height: 300,
  },
  but: {
    width: '95%',
  },
  txtItemLabel: (dir) => ({
    fontSize: 18,
    marginRight: dir === 'right' ? 15 : 0,
    marginLeft: dir === 'right' ? 0 : 15,
    color: '#80628d',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    flex: 2,
    paddingTop: dir === 'right' ? 2 : 5,
  }),
  txtItemLabelRefTemp: (dir) => ({
    fontSize: 18,
    marginRight: dir === 'right' ? 15 : 0,
    marginLeft: dir === 'right' ? 0 : 15,
    color: '#80628d',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    flex: 2,
    paddingTop: dir === 'right' ? 2 : 5,
  }),
  txtItemLabelTh: (dir) => ({
    fontSize: 18,
    marginRight: dir === 'right' ? 15 : 0,
    marginLeft: dir === 'right' ? 0 : 15,
    color: '#80628d',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    flex: 1,
    paddingTop: dir === 'right' ? 2 : 5,
  }),
  txtItemLabelSchedule: (dir) => ({
    fontSize: 18,
    marginRight: dir === 'right' ? 10 : 0,
    marginLeft: dir === 'right' ? 0 : 10,
    flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
    justifyContent:'flex-end',
    color: '#80628d',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    flex: 1,
    paddingTop: dir === 'right' ? 2 : 5,
  }),
  txtItemLabelCenter: (dir) => ({
    fontSize: 18,
    justifyContent:'center',
    alignItems: 'center',
    color: '#80628d',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    flex: 1,
    paddingTop: dir === 'right' ? 2 : 5,
  }),
  txtItemIcon: {
    color: '#80628d',
    marginBottom: 23
  },
  txtInput: (dir) => ({
    fontSize: 15,
    paddingTop: 3,
    marginTop: 3,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    marginBottom: 10,
    color: '#fff',
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
  displayNone: {display: 'none', height: 0, width: 0},
  displayNoneOp: {display: 'none', height: 0, opacity: 0},
  displayColumn: {flex:1, flexDirection:'column',opacity: 100},
  txtError: (dir) => ({
    color: "#f00",
    height: 30,
    fontSize: 16,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    paddingTop: 3,
    marginRight: dir === 'right' ? 15 : 0,
    marginLeft: dir === 'right' ? 0 : 15,
  }),
  rowStyle:{
      flex: 1,
      flexDirection: isRTL == 'right'? 'row-reverse':'row',
      alignItems:isRTL == 'right'? 'flex-start':'flex-end',
      height: 30
  },
  rowTitleStyle:{
      flex: 1,
      flexDirection: isRTL == 'right'? 'row-reverse':'row',
      alignItems:isRTL == 'right'? 'flex-start':'flex-end',
      height: 60,
      backgroundColor: 'rgba(29, 5, 38, 0.3)',
      width: '100%',
      padding: 3,
      paddingTop: 15,
      marginTop: 5
  },
  backHeader: {paddingLeft:30, paddingBottom: 12, paddingRight: 10, paddingTop: 10, color: '#fff'},
  barsRight: {paddingRight:30, paddingBottom: 12, paddingLeft: 10, color: '#fff', marginTop: 10 },
  barsLeft: {paddingLeft:30, paddingBottom: 12, paddingRight: 10, color: '#fff', marginTop: 10},
  micRight: {paddingRight:50, paddingLeft: 10, marginTop: 20, color: '#fff'},
  micLeft: {paddingLeft:50, paddingRight: 10, paddingTop: 20,  color: '#fff'},
  headerTitleContainer: (dir) => ({
          flexDirection: (dir === 'right') ? 'row-reverse':'row',
          alignItems:'flex-start',
          paddingTop: 15,
          marginRight: (dir === 'right') ? 10 : 0,
          marginLeft: (dir === 'right') ? 0 : 10,
  }),
  row: {
        flexDirection: isRTL == 'right'? 'row-reverse':'row',
        alignItems:isRTL == 'right'? 'flex-start':'flex-end',
        height: 40,
        padding: 10
  },
  line: {
      borderBottomColor: '#431e52',
      borderBottomWidth: 1,
      marginTop: 5,
      marginBottom: 5,
  },
  mic: {
        flex: 1,
        justifyContent:'center',
      alignItems: 'center',

  },
  micImage: {width: 140, height: 140},
  addIconContainer: {
      position: 'absolute',
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      left: isRTL == 'right'? 20:'auto',
      right: isRTL == 'right'? 'auto':20,
      bottom: 50,
      backgroundColor: '#ff2a62',
      borderRadius: 30,
      elevation: 8
  },

  addIcon: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 3
  },
  searchIconFloat: {

  },
  rowSelectObject: (dir) => ({
      flex: 1,
      marginBottom: 3,
      height: 50,
      backgroundColor:'rgba(29, 5, 39, 0.3)',
      flexDirection: (dir === 'right') ? 'row-reverse':'row',
      alignItems: 'flex-start',
  }),
  selectTitle :{flex: 1, backgroundColor: '#522265', justifyContent: 'center', alignItems: 'center'},
  modalTitle :{flex: 1, backgroundColor: '#522265', justifyContent: 'center', alignItems: 'center'},
  modalTitleText: (dir) => ({
          color: '#fff',
          justifyContent: 'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 18
  }),
  modalList: {flex: 12},
  modalButton: {flex : 2, backgroundColor:'#522265'},
  listRow: (dir) => ({
      flex:1,
      backgroundColor: '#fff',
      flexDirection: dir === 'right' ? 'row-reverse' : 'row',
      justifyContent: 'flex-start'
  }),
  listImg: {
      width: 80, height: 60, justifyContent: 'flex-start'
  },
  listImgCurtain: (dir) => ({
      justifyContent: 'flex-start',
    flex:1,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20
  }),
  listTitleView: {
      height: 60, paddingTop: 10, flex: 3
  },
  runButton: {
    backgroundColor: 'green', height: '100%', flex: 1,
  },
  deleteButton: {
    backgroundColor: 'red', height: '100%', flex: 1,
  },
  deleteButtonImage: {
    height: 35, width: 35, marginLeft: 20, marginTop: 15
  },
  flatListView: {
    flex: 1, marginBottom: 3, height: 60, backgroundColor:'rgba(29, 5, 39, 0.3)'
  },
  flatListViewBigTitle: {
    flex: 1, marginBottom: 3, height: 80, backgroundColor:'rgba(29, 5, 39, 0.5)'
  },
  flatListViewTouch: (dir) => ({
    paddingTop: 8,
    flex: 1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
  }),
  flatListViewTextOn: (dir) => ({
         paddingTop: 10,
         flex:3,
         color: '#fff',
         fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
         fontSize: 17
  }),
  flatListViewTextOff: (dir) => ({
         paddingTop: 10,
         flex:3,
         color: '#7d4656',
         fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
         fontSize: 17
  }),
  outputTextOn: (dir) => ({
        paddingTop: 5,
        color: '#fff',
        fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
        fontSize: (dir === 'right') ? 16 : 18,
  }),
  outputTextOff: (dir) => ({
          paddingTop: 5,
            color: '#7d4656',
            fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
           fontSize: (dir === 'right') ? 16 : 18,
  }),
  scheduleTitleDashboard:  (dir) => ({
	    color: '#fff',
	    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	    fontSize: 18,
	    marginRight: 15,
	    marginLeft: 15,
	    marginTop: 5,
    }),
  thermTitleDashboard:  (dir) => ({
	    color: '#fff',
	    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	    fontSize: 16,
    }),
  onOffTitleDashboard:  (dir) => ({
	    color: '#fff',
	    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	    fontSize: 16,
	    marginRight: 5, //(dir === 'right') ?  10 : 20,
	    marginLeft: 5, //(dir === 'right') ?  20 : 10,
	    paddingTop: 15,
    }),
    scheduleTab: {
          height:Dimensions.get("window").height,
          backgroundColor:'#693d7c'
   },
   scenarioTab: {
          height:Dimensions.get("window").height,
          backgroundColor:'#bb86d1',
   },
  timerTextOn: (dir) => ({
    padding: 3, color: '#fff',
     fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      fontSize: 14,
      justifyContent:'center'
  }),
  timerTextOff: (dir) => ({
    padding: 3, color: '#7d4656',
     fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
     fontSize: 14, justifyContent:'center'
  }),
  flatListViewImage: {
    flex: 1, resizeMode : 'contain'
  },
  floatingImage: {
    flex: 1, width: 40, height: 40, resizeMode:'contain'
  },
  radioStyle: (dir) => ({
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    color: '#80628d',
    fontSize: 15, 
    marginRight: 20,
  }),
  listViewRow: {
    flex: 1,
    marginBottom: 3,
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor:'rgba(29, 5, 39, 0.3)'
  },
  listViewTouch:{
    flex: 1,
    marginBottom: 3,
    height: 60,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor:'rgba(29, 5, 39, 0.3)'
  },
  listViewTouchView: (dir) => ({
    paddingTop: 8,
    flex:1,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 50,
    marginBottom: 10,
    opacity: 100,
  }),
  listViewTouchViewCurtain: {
    paddingTop: 8,
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
    height: 90,
  },
  listViewTouchRgb: (dir) => ({
      flex:1,
      flexDirection: (dir === 'right') ? 'row-reverse':'row',
      justifyContent: 'flex-start',
      height: 50,
      marginBottom: 10,
      opacity: 100,
    }),
  listViewTouchRgbDashboard: (dir) => ({
      flex:1,
      flexDirection: (dir === 'right') ? 'row-reverse':'row',
      justifyContent: 'flex-start',
      height: 40,
      marginBottom: 5,
      opacity: 100,
    }),
    listViewDrop: (dir) => ({
    paddingTop: 4,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 45,
    marginBottom: 5,
    opacity: 100,
  }),
  listViewDropTitle: (dir) => ({
    paddingTop: 2,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(75, 31, 93, 0.57)',
    opacity: 100,
  }),
  listViewTextView: (dir) => ({
    paddingTop: 8,
    flex:1,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(75, 31, 93, 0.57)',
    opacity: 100,
  }),
  titleLocation: (dir) => ({
    paddingTop: 3,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 45,
    paddingBottom: 3,
    backgroundColor:'rgba(75, 31, 93, 0.57)'
  }),
  titleLocationHor: (dir) => ({
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 45,
    paddingBottom: 3,
    backgroundColor:'rgba(75, 31, 93, 0.57)'
  }),
  titleLocationDashboard: (dir) => ({
          alignItems: 'flex-start',
          padding: 3,
          justifyContent:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 20,
          color:'#b08dbf'
  }),
  titleLocationHorDashboard: (dir) => ({
          alignItems: 'flex-start',
          padding: 3,
          justifyContent:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 20,
          color:'#b08dbf'
  }),
  locationItemDashboard: {
          height: 100,
          width: 110,
          borderRadius: 10,
          flex: 1,
          backgroundColor:'rgba(75, 31, 93, 0.57)',
          margin: 2,
           justifyContent: 'center'
  },
  locationItemDashboardHor: {
          height: 80,
          width: 120,
          borderRadius: 8,
          flex: 1,
          backgroundColor:'rgba(75, 31, 93, 0.57)',
          margin: 2,
           justifyContent: 'center'
  },
  outputItemDashboard: {
          height: 115,
          borderRadius: 10,
          flex: 1,
          backgroundColor:'rgba(75, 31, 93, 0.57)',
          margin: 3,
           justifyContent: 'center'
  },
  locationViewItem: {
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
   },
   locationImageItem: {
          flex: 2,
          resizeMode: 'contain',
          marginTop:10
   },
   locationImageItemShort: {
          flex: 1,
          resizeMode: 'contain',
          marginTop:3
   },
   horizontalOutputImageItem: {
          flex: 2,
          resizeMode: 'contain',
          marginTop:10
   },
   locationRowDashboard: (dir) => ({
          flex:1,
          flexDirection: (dir === 'right') ? 'row-reverse':'row',
   }),
   locationRowDashboardHor: (dir) => ({
          flex:1,
          flexDirection: (dir === 'right') ? 'row-reverse':'row',
          paddingTop: 3,
   }),
   outputsFlatlistDashboard: {flex:1, marginTop: 50},
   outputsFlatlistDashboardHor: {flex:1, marginTop: 42},
//   outputsFlatlistDashboardHor: {flex:1, marginTop: 50},
   rgbsFlatlistDashboard: {flex:1, marginTop: 40,height:'100%'},
   thermsFlatlistDashboard: {marginTop: 50},
   thermsFlatlistDashboardHor: {marginTop: 42},
   curtainsFlatlistDashboard: {height: 60, },
   curtainsFlatlistDashboardHor: {height: 50, },
  titleScenarioDashboard: (dir) => ({
          alignItems: 'center',
          padding: 3,
          justifyContent:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 18,
          color:'#b08dbf'
  }),
  titleScenarioView: (dir) => ({
              paddingTop: 8,
               alignItems: 'center',
              height: 60,
              paddingLeft: (dir === 'right') ? 0 : 15,
              paddingRight: (dir === 'right') ? 15 : 0,
              paddingBottom: 8,
              backgroundColor:'rgba(75, 31, 93, 0.9)'
    }),
  titleScenarioViewHor: (dir) => ({
               alignItems: 'center',
              height: 50,
              paddingLeft: (dir === 'right') ? 0 : 15,
              paddingRight: (dir === 'right') ? 15 : 0,
//	    borderBottomWidth: 1,
//	    borderBottomColor: '#fff'
//              backgroundColor:'rgba(75, 31, 93, 0.9)'
    }),
    horizontalViewPart: {flexDirection: 'column', flex:3, margin: 6, backgroundColor: '#1d0527', padding: 8, paddingTop: 2, borderRadius: 10},
    horizontalViewScenarios: {flexDirection: 'column', flex:1, margin: 6, backgroundColor: '#bb86d1', padding: 8, borderRadius: 10},
    horizontalViewSchedules: {flexDirection: 'column', flex:1, margin: 6, backgroundColor: '#693d7c', padding: 8, borderRadius: 10},
  titleScenario: (dir) => ({
          alignItems: 'center',
          padding: 3,
          justifyContent:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 22,
          color:'#fff'
  }),
  titleScenarioHor: (dir) => ({
          alignItems: 'center',
          padding: 3,
          justifyContent:'center',
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 20,
          color:'#fff'
  }),
  scheduleItemDashboard: (dir) => ({
          marginBottom: 7,
          flex:1,
          marginRight: 5,
          marginLeft: 5,
          borderRadius: 10,
          backgroundColor: 'rgba(29, 5, 39, 0.9)',
          flexDirection: (dir === 'right') ? 'row-reverse':'row',
          justifyContent: 'flex-start',
          height: 60
  }),
  thermometerItemDashboard: (dir) => ({
          marginBottom: 7,
          flex:1,
          marginRight: 5,
          marginLeft: 5,
          paddingRight: 10,
          paddingLeft: 10,
          borderRadius: 10,
          backgroundColor: 'rgba(29, 5, 39, 0.9)',
          flexDirection: 'column',
          justifyContent: 'flex-start',
  }),
  scheduleSettingDashboard: (dir) => ({
          padding:15,
  }),
  thermSettingDashboard: (dir) => ({
          paddingBottom:15,
          paddingTop: 18,
          paddingLeft: (dir === 'right') ? 10 : 10,
          paddingRight: (dir === 'right') ? 10 : 10,
  }),
  thermArrowDashboard: (dir) => ({
          paddingTop: 7,
  }),
  scheduleViewDashboard: (dir) => ({
          paddingTop:5,
          paddingBottom:4,
          flex: 5,
          flexDirection: (dir === 'right') ? 'row-reverse' : 'row'
  }),
  thermViewDashboard: (dir) => ({
          paddingTop:18,
          paddingBottom:4,
          flexDirection: (dir === 'right') ? 'row-reverse' : 'row'
  }),
  scheduleImageDashboard: {
          justifyContent:'center', flex:2,resizeMode: 'contain',marginTop:1
  },
  schedulesFlatlistDashboard: {flex:1, marginTop: 5},
  rowTextError: (dir) => ({
    paddingTop: 8, 
    flex:1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 40,
    opacity: 100
  }),
  
  rowView: (dir) => ({
    paddingTop: 8, 
    flex:1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 40,
    
  }),
  touchSwitchType: (dir) => ({
    flex:1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    heSight: 50,
    marginBottom:15,
    marginTop: 10
  }),
  listViewTouchViewFooter: (dir) => ({
    paddingTop: 5, 
    flex:1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#ff2a62',
    paddingBottom:5
  }),
  listRadio: (dir) => ({
    paddingTop: 8, 
    flex:1,
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    paddingLeft: dir === 'left' ? 10 : 0,
    paddingRight: dir === 'left' ? 0 : 10,
    justifyContent: 'flex-start',
    alignItems: dir === 'right' ? 'flex-end' : 'flex-start',
    height: 50,
  }),
  listRadioTherm: (dir) => ({
          flex:1,
          paddingBottom: 5,
          flexDirection: dir === 'right' ? 'row-reverse':'row',
          paddingLeft: dir === 'left' ? 10 : 0,
          paddingRight: dir === 'left' ? 0 : 10,
          justifyContent: 'flex-start',
          alignItems: dir === 'right' ? 'flex-end' : 'flex-start',
          height: 50,
}),
  viewRadio: (dir) => ({
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    alignItems:'flex-start',
    marginTop: 10
  }),
  listRadioOutputsScnario: (dir) => ({
    paddingTop: 8, 
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: dir === 'right' ? 'flex-end' : 'flex-start',
    height: 90,
  }),
  listViewTouchViewColumn: (dir) => ({
    flex:1,
    flexDirection:'column',
    justifyContent: dir === 'left' ? 'flex-start' : 'flex-end',
  }),
  listViewTouchViewData: (dir) => ({
    flex:1,
    flexDirection:'column',
    justifyContent: dir === 'left' ? 'flex-start' : 'flex-end',
    paddingLeft: dir === 'left' ? 10 : 0,
    paddingRight: dir === 'left' ? 0 : 10,
  }),

  titleSelectModules: (dir) => ({
    flex: 1,
    flexDirection: (dir) === 'right' ? 'row' : 'row-reverse',
    alignItems:'flex-start',
    backgroundColor: 'rgba(29, 5, 38, 0.3)',
    width: '100%',
    padding: 10,
    marginTop: 7,
    textAlignVertical: 'center'
  }),

  airPlaneMode: {
    flex: 1,
    backgroundColor: 'rgba(29, 5, 38, 0.3)',
    padding: 10,
    marginTop: 7,
    flexDirection: 'column',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch:{
    marginTop: 5
  },
  iconListTouch: {
          flex:1,
          height: 65,
          borderRadius: 70,
          alignItems: 'center',
          minWidth: 65,
          textAlign:'center'
   },
   iconListImage: {resizeMode: 'contain', height: 70},
  addIconRowContainer: (dir) => ({
    width: 40,
    height: 40,
    backgroundColor: '#80628d',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  imageListSelection: {flex: 1, resizeMode : 'contain', justifyContent: 'flex-start'},
  addIconRow: {
      color: 'rgba(29, 5, 38, 0.9)',
      marginBottom: 10,
      flex: 1,
      fontSize: 26,
      fontFamily: "Nunito-Bold",
      fontWeight: 'bold',

  },
  modalStyle:{marginTop: 22, flex: 1, flexDirection:'column'},
  containerIconList: (dir) =>( {
    justifyContent: 'flex-start',
    flexDirection: dir === 'right' ? 'row-reverse':'row',
    height: 70,
  }),
  containerLocationsList: {    
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 120,
  },
  containerLocationsListHor: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    height: 92,
  },
  containerLocationsView: {
    height: 120,
  },
  containerLocationsViewHor: {
    height: 92,
  },
  iconLocationsList: (dir) => ({
    flex:1,  
    height: 110,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    padding: 1
  }),
  iconLocationsListHor: (dir) => ({
    flex:1,
    height: 90,
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
    padding: 1
  }),
  locationHeight: { height:Dimensions.get('window').height},
  locationHeightHor: { height:Dimensions.get('window').height - 80},
  locationsDashboard: {paddingBottom:150, flex:1},
  iconList: (dir) => ({
    flex:1,
    height: 70,
//    flexDirection: dir === 'right' ? 'row-reverse':'row',
    backgroundColor: 'rgba(29, 5, 38, 0.3)',
    padding: 1
  }),
  flatListViewBigTitleLocations: {
    flex: 1,
  },
  listViewTouchText:  (dir) => ({
    paddingTop: 10,
    color: '#b191bd',
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize: (dir === 'right') ? 16 : 18,
  }),
  touchTextIE:  (dir) => ({
          flex:1,
         color: '#b191bd',
         fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
         fontSize: (dir === 'right') ? 16 : 18,
   }),
  textCurtain:  (dir) => ({
          flex:1,
         color: '#b191bd',
         fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
         fontSize: (dir === 'right') ? 16 : 18,
         marginRight: 5 ,
         marginLeft: 5,
   }),
   sliderIE: {width: 200, height: 40},
  locationTouchImg: {
    padding: 2,
    height: 40,
    resizeMode : 'contain'
  },
  listViewTouchImg: {
    width: 100,
    resizeMode : 'contain'
  },
  airPlaneTouchImg: {
    width: undefined,
    height: '60%',
    aspectRatio: 1,

  },
  pickerField: (dir) => ({
    flex:3,
    marginLeft: dir === 'right' ? 22 : 0,
    marginRight: dir === 'right' ? 0 : 22,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize:18,
    borderRadius:4,
    backgroundColor: '#fff',
    height: 45,
    color: '#1d0527',
  }),
  pickerFieldSchedule: (dir) => ({
    flex:1,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize:18,
    borderRadius:4,
    backgroundColor: '#fff',
    height: 45,
    color: '#1d0527',
  }),
  picker: {
    color: '#1d0527',
  },
  pickerSchedule:{
    color: '#1d0527',},
  pickerTherm:{height: 40, flex:1,  marginLeft: 10, marginRight: 10,
    color: '#1d0527',},
  pickerThermSpeed:{height: 40, width: '90%',  marginLeft: 10, marginRight: 10, flex:2,
    color: '#1d0527',},
  checkBoxSchedule: (dir) => ({
          color: "#80628d",
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
          fontSize: 16,
  }),
  checkBoxIE: (dir) => ({
           color: "#fff",
           fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
           marginRight: (dir === 'right') ? 5 : 0,
           marginLeft: (dir === 'right') ? 0 : 5,
           fontSize: 16,
           flex:1
   }),
  floatingContainer: (dir) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height:300,
    bottom: 30,
    right: dir === 'right' ? 'auto' : 1,
    left: dir === 'right' ? 1 : 'auto',
    position: 'absolute'
  }),
  viewOkButton: {flex:1, marginBottom:30},
  spinnerText: (dir) => ({
          color:'#fff',
          fontSize: 16,
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
}),
touchSwip: {height: '100%', flex: 1},
flex1Height: {height: '100%', flex: 1},
flex1center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
flex1:{flex: 1},
flex2:{flex:2},
flex3:{flex:3},
flex5:{flex: 5},
flex8:{flex: 8},
flex15:{flex:15},
scheduleDaysView: {marginLeft:2, marginRight: 2, flex: 1},
checkBoxStyle:{flex: 1, padding: 10},
rgbTouchDashboard: {width: '100%', height: 50, backgroundColor:'rgba(75, 31, 93, 0.99)'},
rgbViewDashboard:(dir) => ({
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center'
}),
rgbImageDashboard: {justifyContent:'center', flex:2,resizeMode: 'contain',marginTop:1 },
rgbTriangleDashboard: {flex: 14, paddingTop:5},
rgbPickerDashboard: {
    color: '#1d0527',},
rgbItemStylePicker: (dir) => ({
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:12,
	borderRadius:20,
    color: '#1d0527',
}),
viewPickerRgb: (dir) => ({
	backgroundColor:'#fff',
	height: 40,
	fontFamily:(dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:14
}),
scenarioTouchDashboard: {
	height: 140,
	minWidth: 100,
	borderRadius: 10,
	flex: 1,
	backgroundColor:'rgba(75, 31, 93, 0.98)',
	margin: 6,
	justifyContent: 'center'
},
scenarioViewDashboard: {
	flexDirection: 'column',
	flex: 1,
	justifyContent: 'center',
	alignItems: 'center'
},
curtainViewDashboard: (dir) => ({
	flex:1,
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
	paddingTop:5,
	backgroundColor:'rgba(29, 5, 39, 0.9)',
	paddingBottom: 5,

}),
curtainViewDashboardHor: (dir) => ({
	flex:1,
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
	backgroundColor:'rgba(29, 5, 39, 0.9)',
}),
curtainItemDashboard: (dir) => ({
	flex:1,
	flexDirection: (dir === 'right') ? 'row' : 'row-reverse',
}),
curtainTextDashboard: (dir) => ({
	flex:2,
	color:'#fff',
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:16,
	marginTop:10
}),
curtainImageDashboard: {flex:1, resizeMode:'contain'},
curtainTouchDashboard: {alignItems:'center'},
curtainAction: {flex:1, resizeMode:'contain', width: 35, justifyContent:'center', padding:10},
scenarioImageDashboard: {flex: 2, resizeMode: 'contain',marginTop:10},
flexColumn: {flexDirection: 'column', flex:1},
flexRow: (dir) => ({
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
	flex:1
}),
flex2Row: (dir) => ({
	flexDirection: 'row',
	flex:2,
	marginLeft: (dir === 'right') ? 15 : 0,
	marginRight: (dir === 'right') ? 0 : 15,
}),
flex3Row: (dir) => ({
	flexDirection: 'row-reverse',
	flex:3,
	marginLeft: (dir === 'right') ? 15 : 0,
	marginRight: (dir === 'right') ? 0 : 15,
}),
flexRowTherm: (dir) => ({
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
	flex:1,
	paddingTop: 10,
	paddingBottom: 10
}),
sliderDashboard:{width: "50%", height: 40},
viewFooter:{height:40},
tabTitle: (dir) => ({
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize: 18,
	marginBottom:(dir === 'right') ? 10 : 5,
    color: '#1d0527',
}),
tabItemDashboard: {flex:1, flexDirection:'column'},
viewTabStyle: (dir) => ({
	flex:1,
	flexDirection: (dir === 'right') ? 'row-reverse' : 'row',
          height:50,
          justifyContent:'center',
          position:'absolute',
          top:0,
          left: 0,
          right: 0,
          marginRight: 10,
          marginLeft: 10,
          marginTop: (Dimensions.get('window').height) - 150
}),
viewTabStyleHor: (dir) => ({
	flex:1,
          flexDirection:(dir === 'right') ? 'row-reverse' : 'row',
          height:50,
          alignContent:'center',
          width:'100%',
          justifyContent:'center',
          alignItems:'center',
          position:'absolute',
          top:0,
          left:0
}),
tabRgb: {flex: 1, padding: 10, height:Dimensions.get('window').height - 380},
tabRgbHor: {flex: 1, padding: 10, height:Dimensions.get('window').height - 320},
containerStyle: {flex:1, height: (Dimensions.get('window').height) > 867 ? 55 : 50},
containerStyleHor: {flex:1, height: 53},
viewTabStyleTop: (dir) => ({
	flex:1,
	flexDirection:(dir === 'right') ? 'row-reverse' : 'row',
	height:50,
	alignContent:'center',
	width:'100%',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    top:0,
    left:0
}),
viewTabStyleTS: (dir) => ({
	flex:1,
	flexDirection:(dir === 'right') ? 'row-reverse' : 'row',
	height:50,
	alignContent:'center',
	width:'100%',
          justifyContent:'center',
          alignItems:'center',
          position:'absolute',
          left:0
}),
tab1First: (dir) => ({
	alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 2,
      marginLeft:5,
      marginRight:5,
      marginTop:5,
      marginBottom:5,
      borderTopLeftRadius: 20,
      borderTopRightRadius:20,
      flex:1,
      fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      color: '#1d0527',

 }),
 tab1Second: (dir) => (
          {
	          alignItems: 'center',
	          justifyContent: 'center',
	          paddingTop: 2,
	          marginLeft:5,
	          marginRight:5,
	          marginTop:5,
	          marginBottom:5,
	          borderTopRightRadius: 20,
	          borderTopLeftRadius:20,
	          flex:1,
	          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      color: 'rgba(29, 5, 39, 0.9)',
}),
tab1FirstHor: (dir) => ({
	alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          marginLeft:5,
          marginRight:5,
          marginBottom:5,
          borderTopLeftRadius: 20,
          borderTopRightRadius:20,
          flex:1,
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      color: 'rgba(29, 5, 39, 0.9)',
 }),
 tab1SecondHor: (dir) => (
          {
	          alignItems: 'center',
	          justifyContent: 'center',
	          paddingTop: 10,
	          marginLeft:5,
	          marginRight:5,
	          marginBottom:5,
	          borderTopRightRadius: 20,
	          borderTopLeftRadius:20,
	          flex:1,
	          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
      color: 'rgba(29, 5, 39, 0.9)',
}),
tab2First: (dir) => ({
	flex:1,
	height: (Dimensions.get('window').height) > 867 ? 55 : 50,
	borderBottomRightRadius: (dir === 'right') ? 50 : 0,
	borderTopRightRadius: (dir === 'right') ? 50 : 0,
	borderBottomLeftRadius: (dir === 'left') ? 50 : 0,
	borderTopLeftRadius: (dir === 'left') ? 50 : 0,
	backgroundColor:'#561f6d',
      color: 'rgba(29, 5, 39, 0.9)',
}),
tab2Middle: (dir) => ({
	flex:1,
	height: (Dimensions.get('window').height) > 867 ? 55 : 50,
	backgroundColor:'#561f6d',
      color: 'rgba(29, 5, 39, 0.9)',
}),
tab2Second: (dir) => ({
	flex:1,
	height: (Dimensions.get('window').height) > 867 ? 55 : 50,
	borderBottomLeftRadius: (dir === 'right') ? 50 : 0,
	borderTopLeftRadius: (dir === 'right') ? 50 : 0,
	borderBottomRightRadius: (dir === 'left') ? 50 : 0,
	borderTopRightRadius: (dir === 'left') ? 50 : 0,
	backgroundColor:'#561f6d',
      color: 'rgba(29, 5, 39, 0.9)',
}),
styleTab2First: (dir) => ({
	alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 2,
          marginLeft: 5,
          marginRight: 5,
          marginTop:5,
          marginBottom:5,
          borderTopRightRadius:  (dir === 'right') ?  100 : 0,
          borderBottomRightRadius: (dir === 'right') ? 100 : 0,
          borderTopLeftRadius:  (dir === 'left') ?  100 : 0,
          borderBottomLeftRadius: (dir === 'left') ? 100 : 0,
          flex:1,
          fontFamily:  (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
}),
styleTab2Middle: (dir) => ({
	alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 2,
          marginTop:5,
          marginBottom:5,
          flex:1,
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
}),
styleTab2Second: (dir) => ({
	alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 5,
          marginRight: 5,
          paddingTop: 2,
          marginTop:5,
          marginBottom:5,
          borderTopLeftRadius: (dir === 'right') ? 100 : 0,
          borderBottomLeftRadius: (dir === 'right') ? 100 : 0,
          borderTopRightRadius: (dir === 'left') ? 100 : 0,
          borderBottomRightRadius: (dir === 'left') ? 100 : 0,
          flex:1,
          fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
}),
tempDashboard: (dir) => ({
	paddingLeft: 10,
	color: '#b191bd',
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize: 24
}),
tempDashboardHolder: (dir) => ({
	flex: 1,
	flexDirection: (dir === 'left') ? 'row-reverse':'row',
}),
tempDashboardList: (dir) => ({
	color: '#b191bd',
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize: 24,
	marginLeft: (dir === 'left') ? 0:20,
	marginRight: (dir === 'left') ? 20 : 0,
	marginTop: 6,
}),
tempDashboardSummary: (dir) => ({
	color: '#fff',
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize: 19,
   	textAlign: 'center',
   	marginTop: 15,
   	backgroundColor: 'rgba(29, 5, 39, 0.7)'
}),
refTempDashboardList: (dir) => ({
   	color: '#b191bd',
   	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
   	fontSize: 24,
   	flex:3,
   	textAlign: 'center',
   	paddingLeft: (dir === 'right') ? 10 : 0,
   	paddingRight: (dir === 'right') ? 0 : 10,
   	marginTop: 6,
   }),
thermOnDashboard: (dir) => ({
	flexDirection: (dir === 'left') ? 'row-reverse':'row',
	flex:1,
	marginLeft: (dir === 'left') ? 0 : 20,
	marginRight: (dir === 'left') ? 20 : 0,
}),
thermOnDashboardTitle: {
	marginTop: 10,
},
changeTemp: {
	flex: 1,
	justifyContent: 'center',
},
thermometerDashboardView: (dir) => ({
	flexDirection: (dir === 'left') ? 'row-reverse':'row',
	alignItems:'flex-start',
	flex:1
}),
thermometerImageDashboard : {justifyContent:'center', resizeMode: 'contain', width: 40, height: 40},
height100: {height: '100%'},
voiceCommandView: {marginBottom:10, flex: 1, alignItems: 'center', justifyContent:'center', flexDirection: 'column'},
voiceCommandMic: {flex:1, backgroundColor: '#ff2a62', height: 70, width: 70, borderRadius: 100, alignItems: 'center', minWidth: 65, padding: 10 },
voiceCommandPicker: (dir) =>({
    height: 40,
    width: 200,
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    color: '#1d0527',
}),
voiceCommandViewOutputs: (dir) =>({
    flex:1, flexDirection:'column', justifyContent: 'flex-start',
    flexDirection: (dir === 'right') ? 'row-reverse':'row',
}),
pickerView: (dir) =>({
	flexDirection: (dir === 'right') ? 'row-reverse':'row',
	justifyContent: 'flex-start',
	marginTop: 20,
	marginBottom: 10,
	flex:3,
	paddingLeft: dir === 'right' ? 10 : 0,
	paddingRight: dir === 'right' ? 0 : 10,
	marginLeft: dir === 'left' ? 10 : 0,
	marginRight: dir === 'left' ? 0 : 10,
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:16,
	borderRadius:4,
	opacity: 100,
	backgroundColor: '#fff',
}),
pickerViewThermostat: (dir) =>({
	flexDirection: (dir === 'right') ? 'row-reverse':'row',
	justifyContent: 'flex-start',
	paddingLeft: dir === 'right' ? 10 : 0,
	paddingRight: dir === 'right' ? 0 : 10,
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:16,
	borderRadius:4,
    color: '#1d0527',
}),
pickerHolderTherm: (dir) =>({
    marginLeft: 10,
    marginRight: 10,
    flex:2,
    fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
    fontSize:16,
    borderRadius:4,
    backgroundColor: '#fff',
    height: 45,
 }),
voiceCommandPickerView: (dir) =>({
	marginTop: 20,
	marginBottom: 10,
	paddingLeft: 10,
	paddingRight: 10,
	marginLeft: 20,
	marginRight: 20,
	fontFamily: (dir === 'right') ? 'Vazir-Medium' : 'Nunito-Bold',
	fontSize:16,
	borderRadius:4,
	opacity: 100,
	height: 50,
	backgroundColor: '#fff',
	width: 220,
}),
voiceCommandSwitch: (dir) => ({
	flexDirection: (dir === 'right') ? 'row-reverse':'row',
	flex: 1,
	marginTop: 10,
}),
})
