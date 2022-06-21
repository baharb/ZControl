import React from 'react';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import { MyButton } from '../Common/MyButton';
import { MyAlert } from '../Common/MyAlert';
import Schedule from './lib/Schedule';
import Vars from '../Common/vars/commonVars';
import CheckBox from 'react-native-check-box'
import RadioForm from 'react-native-simple-radio-button';
import moment from "moment-jalaali";
import {Picker} from '@react-native-community/picker';
import Spinner from 'react-native-loading-spinner-overlay';

export class ScheduleSetting extends React.Component {
  //    output1: Output;
  constructor(props) {
    super(props);
    const { t } = this.props;

    this.state = {
      schedules: "",
      successName: true,
      modalCurtainVisible: false,
      outputs: "",
      isChecked: false,
      checked: [],
      checkedCurtain: [],
      dailyView: true,
      weeklyView: false,
      startRepeatTime: "",
      repeatType: t('common:day'),
      repeat: "",
      successRepeatTime: true,
      checkedDays: [],
      visibleDays: false,
      openStartDate: false,
      endToDate: false,
      weekDays: 0x00,
      endRepeatTime: "0",
      startYear: "",
      startMonth: "",
      startDay: "",
      startH: "",
      startM: "",
      startS: "",
      endYear: "",
      endMonth: "",
      endDay: "",
      endH: "",
      endM: "",
      endS: "",
      fromPage: "",
      spinner: true,
      alertMod: false,
      func: "get",
      travel: false,
    }

    this.saveSchedule = this.saveSchedule.bind(this);
    this.onDateChange = this.onDateChange.bind(this);

    SUNDAY = 0;
    MONDAY = 1;
    TUESDAY = 2;
    WEDNESDAY = 3;
    THURSDAY = 4;
    FRIDAY = 5;
    SATURDAY = 6;
  }


  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }



  componentDidMount() {

    const { navigation, t } = this.props;
    const item = navigation.getParam('item', null);
    fromPage = navigation.getParam('fromPage', "SchedulePage");

    checkedDays = new Array();

    // List of days for check
    for (d = 0; d < 7; d++) {
      checkedDays[d] = false;
    }

    daysVal = new Array();

    daysVal = [
      { label: t('schedule:saturday'), index: 6, value: false },
      { label: t('schedule:sunday'), index: 0, value: false },
      { label: t('schedule:monday'), index: 1, value: false },
      { label: t('schedule:tuesday'), index: 2, value: false },
      { label: t('schedule:wednesday'), index: 3, value: false },
      { label: t('schedule:thursday'), index: 4, value: false },
      { label: t('schedule:friday'), index: 5, value: false }
    ];

    if (item != null) {
      this.setState({
        scheduleId: item.id,
        scheduleName: item.title,
        mode: Vars.modeUpdate,
        checkedDays: checkedDays,
        fromPage: fromPage,
      });

      this.getSchedule(item.id).then(data => {
//        console.log("Get Doneee")
      })

    }
    else {
      this.setState({
        scheduleId: 0,
        scheduleName: "",
        mode: Vars.modeInsert,
        repeatUnit: 0,
        endType: 0,
        startRepeatTime: "1",
        endRepeatTime: "0",
        startYear: 1400,
        startMonth: 1,
        startDay: 1,
        startH: 12,
        startM: 1,
        startS: 1,
        endYear: 1400,
        endMonth: 1,
        endDay: 1,
        endH: 12,
        endM: 1,
        endS: 1,
        checkedDays: checkedDays,
        fromPage: fromPage,
        spinner: false,
      }, () => {
        setTimeout(() => this.refs.titleTextInput.focus(), 150);
      });

    }

//    this.refs.titleTextInput.focus();
  }

  saveSchedule(retry) {
    this.setState({
      spinner: true,
      func: "save",
      alertMod: false,
    })

    timeout = ""
    if ((retry != 0) && !retry) { retry = 2 }
    let getResponse = 0
    let getError = 0
    timeout = ""

    if (this.state.scheduleName.trim().length == 0) {
      this.setState({
        successName: false,
        spinner: false,
      })
      setTimeout(() => this.refs.titleTextInput.focus(), 150)
    }
    else {

      ScheduleIns = new Object();
      ScheduleIns.id = this.state.scheduleId;
      ScheduleIns.travel = (this.state.travel == true) ? 1 : 0
      ScheduleIns.title = this.state.scheduleName;
      ScheduleIns.startRepeatTime = this.state.startRepeatTime;
      ScheduleIns.endRepeatTime = this.state.endRepeatTime;
      ScheduleIns.repeatUnit = this.state.repeatUnit;
      ScheduleIns.endType = (this.state.endType == 2) ? -1 : this.state.endType;
      ScheduleIns.weekDays = this.state.weekDays;

      m = ""

      if (i18n.t("common:language") == "persian") {
        m = moment(this.state.startYear + "/" + this.state.startMonth + "/" + this.state.startDay, 'jYYYY/jM/jD');
      }
      else {
        m = moment(this.state.startYear + "/" + this.state.startMonth + "/" + this.state.startDay, 'YYYY/M/D');
      }

      start = m.format('YYYY/M/D');
      startDateArray = start.split("/");
      endDate = ""
      if (i18n.t("common:language") == "persian") {
        endDate = moment(this.state.endYear + "/" + this.state.endMonth + "/" + this.state.endDay, 'jYYYY/jM/jD');
      }
      else {
        endDate = moment(this.state.endYear + "/" + this.state.endMonth + "/" + this.state.endDay, 'YYYY/M/D');
      }

      end = endDate.format('YYYY/M/D');
      endDateArray = end.split("/");
      schedule = new Schedule();

      schedule.saveSchedule(ScheduleIns, this.state.mode, startDateArray[0], startDateArray[1], startDateArray[2], this.state.startH, this.state.startM,
        this.state.startS, endDateArray[0], endDateArray[1], endDateArray[2], this.state.endH,
        this.state.endM, this.state.endS)
        .then(
          data => {
            if (timeout != "") { clearTimeout(timeout) }
            getResponse = 1
            this.props.navigation.navigate(this.state.fromPage);
          }
        )
        .catch(
          error => {
//            console.log("errrrrrrrror in saveeeeeeee: " + error)
            getError = 1
          }
        );

      timeout = setTimeout(() => {
//        console.log("Error in save Schedule Timeout: " + getError + "---" + getResponse + "---" + retry)
        if (retry == 0) {
          this.setState({
            spinner: false,
            alertMod: true,
            titleModal: i18n.t('schedule:errorSaveSchedule'),
            func: "save",
          })
        }
        else {
          if (getResponse == 0 || getError == 1) {
//            console.log("error : " + retry + "---" + getResponse + "---" + getError)
            this.saveSchedule(retry - 1)
          }
        }
      }, 2000);
    }
  }

  onClickCancel() {
    this.setState({ alertMod: false })
    if (this.state.func == "get") {
      this.props.navigation.navigate(this.state.fromPage)
    }
  }

  getSchedule(scheduleId, retry) {
    return new Promise((resolve, reject) => {
      timeout = ""
      if ((retry != 0) && !retry) { retry = 4 }
//      console.log("Get Schedule: " + retry)
      getResponse = 0
      getError = 0

      schedule = new Schedule();
      schedule.getSchedule(scheduleId).then(
        data => {
//          console.log("id: " + scheduleId + "---" + (data[0] & 0x7F))
          if ((data[0] & 0x7F) != scheduleId) {
            getError = 1
//            console.log("Error in get Schedule id error: " + (data[0] & 0x7F))

          }
          else {

            if (timeout != "") { clearTimeout(timeout) }
//            console.log("Clear time out: " + timeout)
            getResponse = 1
            // System.arraycopy(data,1,startDateTime,0,7);
            // schedule.setStartDateTime(DateTime.fromByte(startDateTime));
            travel = ((data[0] & 0x80) == 0x80) ? true : false;
            year = data[1] & 0xff;
            year = (year << 8) | (data[2] & 0xff);

            startDate = moment(year + "/" + data[3] + "/" + data[4], 'YYYY/M/D');
            start = ""
            if (i18n.t("common:language") == "persian") {
              start = startDate.format('jYYYY/jM/jD');
            }
            else {
              start = startDate.format('YYYY/M/D');
            }
            startDateArray = start.split("/");
//            console.log("1")
            endyear = 0;
            endDateArray = new Array(1400, 1, 1);

            endRepeatTime = 0;
            endType = 0;

            if (data[15] == 0) {
              endType = 0;
            }
            else if (data[15] == 255 || data[15] == -1) {
              endType = 2;
            }
            else {
              endType = 1;
              endRepeatTime = data[15];
            }

//            console.log("2")
            // end date
            if (endType == 2) {

              endyear = data[8] & 0xff;
              endyear = (endyear << 8) | (data[9] & 0xff);

              end = ""
              endDate = moment(endyear + "/" + data[10] + "/" + data[11], 'YYYY/M/D');

              if (i18n.t("common:language") == "persian") {
                end = endDate.format('jYYYY/jM/jD');
              }
              else {
                end = endDate.format('YYYY/M/D');
              }
              endDateArray = end.split("/");

              // dateTime.setTime(data[12], data[13], data[14]);
            }

            this.refs.refRadioRepeat.updateIsActiveIndex(data[16]);
            visibleDays = false
            if (data[16] == 1) {
              visibleDays = true
            }

            this.changeFinishType(endType, endRepeatTime.toString());
            this.refs.refRadioFinishType.updateIsActiveIndex(endType);

            this.initWeekDaysCheckboxes(data[18]);
//            console.log("3")
            this.setState({
              repeatUnit: data[16],
              startRepeatTime: data[17].toString(),
              startYear: startDateArray[0],
              startMonth: startDateArray[1],
              startDay: startDateArray[2],
              startH: data[5],
              startM: data[6],
              startS: data[7],
              endYear: endDateArray[0],
              endMonth: endDateArray[1],
              endDay: endDateArray[2],
              endH: data[12],
              endM: data[13],
              endS: data[14],
              visibleDays: visibleDays,
              travel: travel,
              spinner: false,
            }, () => {
//              console.log("4")
              resolve(true)
            })
          }
        }
      )
        .catch(
          error => {
            getError = 1

//            console.log("Error in get Schedule: " + error)


          }
        );


      timeout = setTimeout(() => {
//        console.log("Error in get Schedule Timeout: " + getError + "---" + getResponse + "---" + retry)
        if (retry == 0) {
          this.setState({
            spinner: false,
            alertMod: true,
            titleModal: i18n.t('schedule:errorGetSchedule'),
            func: "get",
          }, () => {
            reject(false)
          })

        }
        else {
          if ((getResponse == 0 && getError == 0) || (getError == 1)) {
            this.getSchedule(scheduleId, retry - 1)
          }
        }
      }, 2000);

    })

  }

  showAlert() {
    //return (
    //
    //    );
  }
  // Change View of daily and weekly options
  changeRepeat(value, t) {

    if (value == 0) { // daily
      this.setState({
        dailyView: true,
        weeklyView: false,
        repeatType: t('common:day'),
        repeatWeeklyDays: false,
        visibleDays: false,
        repeatUnit: value,
      })
    }
    else if (value == 1) { // weekly
      this.setState({
        dailyView: false,
        weeklyView: true,
        repeatType: t('common:week'),
        repeatWeeklyDays: true,
        visibleDays: true,
        repeatUnit: value,
      })
    }
  }

  // Change View of daily and weekly options
  changeFinishType(value, endRepeatTime) {
    if (value == 0) { // never
      this.setState({
        repeatNumberShow: false,
        endToDate: false,
        endType: value,
        endRepeatTime: "0"
      })
    }
    else if (value == 1) { // after
      this.setState({
        repeatNumberShow: true,
        endToDate: false,
        endType: value,
        endRepeatTime: endRepeatTime
      })
    }
    else if (value == 2) { // until Date
      this.setState({
        repeatNumberShow: false,
        endToDate: true,
        endType: value,
      })
    }

  }

  Set(b, position) {
    return (b | (1 << position));
  }

  UnSet(b, position) {
    return (b & ~(1 << position));
  }


  initWeekDaysCheckboxes(week) {
    // weekDayFlag;
    weekByte = week;
    weekDayFlag = this.Set(0x00, SATURDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(SATURDAY, true);
      // console.log("sat true")
    }

    weekDayFlag = this.Set(0x00, SUNDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(SUNDAY, true);
      // console.log("sun true")
    }

    weekDayFlag = this.Set(0x00, MONDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(MONDAY, true);
      // console.log("mon true")
    }

    weekDayFlag = this.Set(0x00, THURSDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(THURSDAY, true);
      // console.log("thu true")
    }

    weekDayFlag = this.Set(0x00, WEDNESDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(WEDNESDAY, true);
      // console.log("wed true")
    }

    weekDayFlag = this.Set(0x00, TUESDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(TUESDAY, true);
      // console.log("tue true")
    }

    weekDayFlag = this.Set(0x00, FRIDAY);
    if ((weekByte & weekDayFlag) == weekDayFlag) {
      this.checkDayChange(FRIDAY, true);
      // console.log("fri true")
    }
  }


  checkDayChange(index, checked) {
    checkedArray = this.state.checkedDays;


//    console.log("checked: " + checkedArray[index] + "----" + checked + "---" + index)

    if (checked != null) {
      checkedArray[index] = checked;
    }
    else {
      checkedArray[index] = !checkedArray[index];
    }

    this.setState({
      checkedDays: checkedArray,
    });
    // console.log(this.state.checkedDays[index])

    if (checkedArray[index] == true) {
      this.setState({ weekDays: this.Set(this.state.weekDays, index) })
    }
    else {
      this.setState({ weekDays: this.UnSet(this.state.weekDays, index) })
    }

    // console.log("weekDays: " +this.state.weekDays)


  }

  render() {
    const { t, i18n, navigation } = this.props;

    var radio_props = [
      { label: t('schedule:daily'), value: 0 },
      { label: t('schedule:weekly'), value: 1 }
    ];

    var radioFinishType = [
      { label: t('schedule:never'), value: 0 },
      { label: t('schedule:after'), value: 1 },
      { label: t('schedule:untilDate'), value: 2 }
    ];

    daysArray = new Array();
    i = 1;

    daysVal = [
      { label: t('schedule:saturday'), index: 6 },
      { label: t('schedule:sunday'), index: 0 },
      { label: t('schedule:monday'), index: 1 },
      { label: t('schedule:tuesday'), index: 2 },
      { label: t('schedule:wednesday'), index: 3 },
      { label: t('schedule:thursday'), index: 4 },
      { label: t('schedule:friday'), index: 5 }
    ];

    daysVal.forEach((item) => {
      daysArray.push(
        <View key={item.index} style={commonStyles.scheduleDaysView}>
          <CheckBox
            style={commonStyles.checkBoxStyle}
            leftTextStyle={commonStyles.checkBoxSchedule(i18n.t("common:dir"))}
            rightTextStyle={commonStyles.checkBoxSchedule(i18n.t("common:dir"))}
            checkBoxColor={"#b08dbf"}
            onClick={(checked) => { this.checkDayChange(item.index, checked) }}
            leftText={(i18n.t("common:dir") == 'right') ? item.label : ""}
            rightText={(i18n.t("common:dir") == 'left') ? item.label : ""}
            isChecked={this.state.checkedDays[item.index]}
          />
        </View>
      );
    });

    //        daysArray.push(</View>);
    yearsPicker = ""
    endYearsPicker = ""
    if (i18n.t("common:language") == "persian") {
      yearsPicker = (
        <Picker
          selectedValue={this.state.startYear}
          style={commonStyles.pickerSchedule}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ startYear: itemValue })
          }>
          <Picker.Item label="1400" value={"1400"} />
          <Picker.Item label="1401" value={"1401"} />
          <Picker.Item label="1402" value={"1402"} />
          <Picker.Item label="1403" value={"1403"} />
          <Picker.Item label="1404" value={"1404"} />
          <Picker.Item label="1405" value={"1405"} />
          <Picker.Item label="1406" value={"1406"} />
          <Picker.Item label="1407" value={"1407"} />
          <Picker.Item label="1408" value={"1408"} />
          <Picker.Item label="1409" value={"1409"} />
          <Picker.Item label="1410" value={"1410"} />
          <Picker.Item label="1411" value={"1411"} />
          <Picker.Item label="1412" value={"1412"} />
          <Picker.Item label="1413" value={"1413"} />
          <Picker.Item label="1414" value={"1414"} />
          <Picker.Item label="1415" value={"1415"} />
          <Picker.Item label="1416" value={"1416"} />
          <Picker.Item label="1417" value={"1417"} />
          <Picker.Item label="1418" value={"1418"} />
          <Picker.Item label="1419" value={"1419"} />
          <Picker.Item label="1420" value={"1420"} />
        </Picker>
      );
    }
    else {
      yearsPicker = (
        <Picker
          selectedValue={this.state.startYear}
          style={commonStyles.pickerSchedule}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ startYear: itemValue })
          }>
          <Picker.Item label="2022" value={"2022"} />
          <Picker.Item label="2023" value={"2023"} />
          <Picker.Item label="2024" value={"2024"} />
          <Picker.Item label="2025" value={"2025"} />
          <Picker.Item label="2026" value={"2026"} />
          <Picker.Item label="2027" value={"2027"} />
          <Picker.Item label="2028" value={"2028"} />
          <Picker.Item label="2029" value={"2029"} />
          <Picker.Item label="2030" value={"2030"} />
          <Picker.Item label="2031" value={"2031"} />
          <Picker.Item label="2032" value={"2032"} />
          <Picker.Item label="2033" value={"2033"} />
          <Picker.Item label="2034" value={"2034"} />
          <Picker.Item label="2035" value={"2035"} />
          <Picker.Item label="2036" value={"2036"} />
          <Picker.Item label="2037" value={"2037"} />
          <Picker.Item label="2038" value={"2038"} />
          <Picker.Item label="2039" value={"2039"} />
          <Picker.Item label="2040" value={"2040"} />
        </Picker>
      )
    }

    if (i18n.t("common:language") == "persian") {
      endYearsPicker = (
        <Picker
          selectedValue={this.state.endYear}
          style={commonStyles.pickerSchedule}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ endYear: itemValue })
          }>
          <Picker.Item label="1400" value={"1400"} />
          <Picker.Item label="1401" value={"1401"} />
          <Picker.Item label="1402" value={"1402"} />
          <Picker.Item label="1403" value={"1403"} />
          <Picker.Item label="1404" value={"1404"} />
          <Picker.Item label="1405" value={"1405"} />
          <Picker.Item label="1406" value={"1406"} />
          <Picker.Item label="1407" value={"1407"} />
          <Picker.Item label="1408" value={"1408"} />
          <Picker.Item label="1409" value={"1409"} />
          <Picker.Item label="1410" value={"1410"} />
          <Picker.Item label="1411" value={"1411"} />
          <Picker.Item label="1412" value={"1412"} />
          <Picker.Item label="1413" value={"1413"} />
          <Picker.Item label="1414" value={"1414"} />
          <Picker.Item label="1415" value={"1415"} />
          <Picker.Item label="1416" value={"1416"} />
          <Picker.Item label="1417" value={"1417"} />
          <Picker.Item label="1418" value={"1418"} />
          <Picker.Item label="1419" value={"1419"} />
          <Picker.Item label="1420" value={"1420"} />
        </Picker>
      );
    }
    else {
      endYearsPicker = (
        <Picker
          selectedValue={this.state.endYear}
          style={commonStyles.pickerSchedule}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ endYear: itemValue })
          }>
          <Picker.Item label="2022" value={"2022"} />
          <Picker.Item label="2023" value={"2023"} />
          <Picker.Item label="2024" value={"2024"} />
          <Picker.Item label="2025" value={"2025"} />
          <Picker.Item label="2026" value={"2026"} />
          <Picker.Item label="2027" value={"2027"} />
          <Picker.Item label="2028" value={"2028"} />
          <Picker.Item label="2029" value={"2029"} />
          <Picker.Item label="2030" value={"2030"} />
          <Picker.Item label="2031" value={"2031"} />
          <Picker.Item label="2032" value={"2032"} />
          <Picker.Item label="2033" value={"2033"} />
          <Picker.Item label="2034" value={"2034"} />
          <Picker.Item label="2035" value={"2035"} />
          <Picker.Item label="2036" value={"2036"} />
          <Picker.Item label="2037" value={"2037"} />
          <Picker.Item label="2038" value={"2038"} />
          <Picker.Item label="2039" value={"2039"} />
          <Picker.Item label="2040" value={"2040"} />
        </Picker>
      )
    }




    return (

      <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" style={commonStyles.flex1} enabled >

        <ScrollView>

          <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.cont}>


            <View style={commonStyles.containerView}>

              <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))}>
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('common:title')}</Text>

                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                  ref="titleTextInput"

                  onChangeText={(txt) => {
                    if (txt.length == 0) {
                      this.setState({
                        scheduleName: txt,
                        successName: false
                      })
                    }
                    else {
                      this.setState({
                        scheduleName: txt,
                        successName: true
                      })
                    }
                  }}
                  value={this.state.scheduleName}
                />
              </View>

              {!this.state.successName ? (
                <View style={commonStyles.rowTextError(i18n.t('common:dir'))}>
                  <Text style={commonStyles.txtError(i18n.t('common:dir'))} >
                    {i18n.t('schedule:scheduleFillName')}
                  </Text>
                </View>
              ) : (null)}
              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:startDate')}</Text>
              </View>

              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>
                  {this.state.startYear + "/" + this.state.startMonth + "/" + this.state.startDay +
                    "   " + this.state.startH + ":" + this.state.startM + ":" + this.state.startS + "   -   " +
                    + this.state.endH + ":" + this.state.endM + ":" + this.state.endS}
                </Text>
              </View>

              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:day')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:month')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:year')}</Text>
                </View>
              </View>

              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.startDay}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ startDay: itemValue })
                    }>
                    <Picker.Item label="1" value={"1"} />
                    <Picker.Item label="2" value={"2"} />
                    <Picker.Item label="3" value={"3"} />
                    <Picker.Item label="4" value={"4"} />
                    <Picker.Item label="5" value={"5"} />
                    <Picker.Item label="6" value={"6"} />
                    <Picker.Item label="7" value={"7"} />
                    <Picker.Item label="8" value={"8"} />
                    <Picker.Item label="9" value={"9"} />
                    <Picker.Item label="10" value={"10"} />
                    <Picker.Item label="11" value={"11"} />
                    <Picker.Item label="12" value={"12"} />
                    <Picker.Item label="13" value={"13"} />
                    <Picker.Item label="14" value={"14"} />
                    <Picker.Item label="15" value={"15"} />
                    <Picker.Item label="16" value={"16"} />
                    <Picker.Item label="17" value={"17"} />
                    <Picker.Item label="18" value={"18"} />
                    <Picker.Item label="19" value={"19"} />
                    <Picker.Item label="20" value={"20"} />
                    <Picker.Item label="21" value={"21"} />
                    <Picker.Item label="22" value={"22"} />
                    <Picker.Item label="23" value={"23"} />
                    <Picker.Item label="24" value={"24"} />
                    <Picker.Item label="25" value={"25"} />
                    <Picker.Item label="26" value={"26"} />
                    <Picker.Item label="27" value={"27"} />
                    <Picker.Item label="28" value={"28"} />
                    <Picker.Item label="29" value={"29"} />
                    <Picker.Item label="30" value={"30"} />
                    <Picker.Item label="31" value={"31"} />
                  </Picker>
                </View>

                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.startMonth}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ startMonth: itemValue })
                    }>
                    <Picker.Item label="1" value={"1"} />
                    <Picker.Item label="2" value={"2"} />
                    <Picker.Item label="3" value={"3"} />
                    <Picker.Item label="4" value={"4"} />
                    <Picker.Item label="5" value={"5"} />
                    <Picker.Item label="6" value={"6"} />
                    <Picker.Item label="7" value={"7"} />
                    <Picker.Item label="8" value={"8"} />
                    <Picker.Item label="9" value={"9"} />
                    <Picker.Item label="10" value={"10"} />
                    <Picker.Item label="11" value={"11"} />
                    <Picker.Item label="12" value={"12"} />
                  </Picker>
                </View>

                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  {yearsPicker}
                </View>

              </View>

              <View style={commonStyles.line}></View>

              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:fromHour')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:minute')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:second')}</Text>
                </View>
              </View>
              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.startH}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ startH: itemValue })
                    }>
                    <Picker.Item label="0" value={0} />
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                    <Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} />
                    <Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} />
                    <Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} />
                    <Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} />
                    <Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} />
                    <Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} />
                    <Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} />
                    <Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} />
                    <Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} />
                    <Picker.Item label="23" value={23} />
                  </Picker>
                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.startM}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ startM: itemValue })
                    }>

                    <Picker.Item label="0" value={0} /><Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} /><Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} /><Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} /><Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} /><Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} /><Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} /><Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} /><Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} /><Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} /><Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} /><Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} /><Picker.Item label="23" value={23} />
                    <Picker.Item label="24" value={24} /><Picker.Item label="25" value={25} />
                    <Picker.Item label="26" value={26} /><Picker.Item label="27" value={27} />
                    <Picker.Item label="28" value={28} /><Picker.Item label="29" value={29} />
                    <Picker.Item label="30" value={30} /><Picker.Item label="31" value={31} />
                    <Picker.Item label="32" value={32} /><Picker.Item label="33" value={33} />
                    <Picker.Item label="34" value={34} /><Picker.Item label="35" value={35} />
                    <Picker.Item label="36" value={36} /><Picker.Item label="37" value={37} />
                    <Picker.Item label="38" value={38} /><Picker.Item label="39" value={39} />
                    <Picker.Item label="40" value={40} /><Picker.Item label="41" value={41} />
                    <Picker.Item label="42" value={42} />
                    <Picker.Item label="43" value={43} /><Picker.Item label="44" value={44} />
                    <Picker.Item label="45" value={45} /><Picker.Item label="46" value={46} />
                    <Picker.Item label="47" value={47} /><Picker.Item label="48" value={48} />
                    <Picker.Item label="49" value={49} /><Picker.Item label="50" value={50} />
                    <Picker.Item label="51" value={51} /><Picker.Item label="52" value={52} />
                    <Picker.Item label="53" value={53} /><Picker.Item label="54" value={54} />
                    <Picker.Item label="55" value={55} /><Picker.Item label="56" value={56} />
                    <Picker.Item label="57" value={57} /><Picker.Item label="58" value={58} />
                    <Picker.Item label="59" value={59} />
                  </Picker>
                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                  <Picker
                    selectedValue={this.state.startS}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ startS: itemValue })
                    }>

                    <Picker.Item label="0" value={0} /><Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} /><Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} /><Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} /><Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} /><Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} /><Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} /><Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} /><Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} /><Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} /><Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} /><Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} /><Picker.Item label="23" value={23} />
                    <Picker.Item label="24" value={24} /><Picker.Item label="25" value={25} />
                    <Picker.Item label="26" value={26} /><Picker.Item label="27" value={27} />
                    <Picker.Item label="28" value={28} /><Picker.Item label="29" value={29} />
                    <Picker.Item label="30" value={30} /><Picker.Item label="31" value={31} />
                    <Picker.Item label="32" value={32} /><Picker.Item label="33" value={33} />
                    <Picker.Item label="34" value={34} /><Picker.Item label="35" value={35} />
                    <Picker.Item label="36" value={36} /><Picker.Item label="37" value={37} />
                    <Picker.Item label="38" value={38} /><Picker.Item label="39" value={39} />
                    <Picker.Item label="40" value={40} /><Picker.Item label="41" value={41} />
                    <Picker.Item label="42" value={42} />
                    <Picker.Item label="43" value={43} /><Picker.Item label="44" value={44} />
                    <Picker.Item label="45" value={45} /><Picker.Item label="46" value={46} />
                    <Picker.Item label="47" value={47} /><Picker.Item label="48" value={48} />
                    <Picker.Item label="49" value={49} /><Picker.Item label="50" value={50} />
                    <Picker.Item label="51" value={51} /><Picker.Item label="52" value={52} />
                    <Picker.Item label="53" value={53} /><Picker.Item label="54" value={54} />
                    <Picker.Item label="55" value={55} /><Picker.Item label="56" value={56} />
                    <Picker.Item label="57" value={57} /><Picker.Item label="58" value={58} />
                    <Picker.Item label="59" value={59} />
                  </Picker>
                </View>
              </View>
              <View style={commonStyles.line}></View>

              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:toHour')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:minute')}</Text>
                </View>
                <View style={commonStyles.flex1center}>
                  <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:second')}</Text>
                </View>
              </View>
              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.endH}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ endH: itemValue })
                    }>
                    <Picker.Item label="0" value={0} />
                    <Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} />
                    <Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} />
                    <Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} />
                    <Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} />
                    <Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} />
                    <Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} />
                    <Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} />
                    <Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} />
                    <Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} />
                    <Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} />
                    <Picker.Item label="23" value={23} />
                  </Picker>
                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.endM}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ endM: itemValue })
                    }>

                    <Picker.Item label="0" value={0} /><Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} /><Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} /><Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} /><Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} /><Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} /><Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} /><Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} /><Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} /><Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} /><Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} /><Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} /><Picker.Item label="23" value={23} />
                    <Picker.Item label="24" value={24} /><Picker.Item label="25" value={25} />
                    <Picker.Item label="26" value={26} /><Picker.Item label="27" value={27} />
                    <Picker.Item label="28" value={28} /><Picker.Item label="29" value={29} />
                    <Picker.Item label="30" value={30} /><Picker.Item label="31" value={31} />
                    <Picker.Item label="32" value={32} /><Picker.Item label="33" value={33} />
                    <Picker.Item label="34" value={34} /><Picker.Item label="35" value={35} />
                    <Picker.Item label="36" value={36} /><Picker.Item label="37" value={37} />
                    <Picker.Item label="38" value={38} /><Picker.Item label="39" value={39} />
                    <Picker.Item label="40" value={40} /><Picker.Item label="41" value={41} />
                    <Picker.Item label="42" value={42} />
                    <Picker.Item label="43" value={43} /><Picker.Item label="44" value={44} />
                    <Picker.Item label="45" value={45} /><Picker.Item label="46" value={46} />
                    <Picker.Item label="47" value={47} /><Picker.Item label="48" value={48} />
                    <Picker.Item label="49" value={49} /><Picker.Item label="50" value={50} />
                    <Picker.Item label="51" value={51} /><Picker.Item label="52" value={52} />
                    <Picker.Item label="53" value={53} /><Picker.Item label="54" value={54} />
                    <Picker.Item label="55" value={55} /><Picker.Item label="56" value={56} />
                    <Picker.Item label="57" value={57} /><Picker.Item label="58" value={58} />
                    <Picker.Item label="59" value={59} />
                  </Picker>
                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                  <Picker
                    selectedValue={this.state.endS}
                    style={commonStyles.pickerSchedule}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ endS: itemValue })
                    }>

                    <Picker.Item label="0" value={0} /><Picker.Item label="1" value={1} />
                    <Picker.Item label="2" value={2} /><Picker.Item label="3" value={3} />
                    <Picker.Item label="4" value={4} /><Picker.Item label="5" value={5} />
                    <Picker.Item label="6" value={6} /><Picker.Item label="7" value={7} />
                    <Picker.Item label="8" value={8} /><Picker.Item label="9" value={9} />
                    <Picker.Item label="10" value={10} /><Picker.Item label="11" value={11} />
                    <Picker.Item label="12" value={12} /><Picker.Item label="13" value={13} />
                    <Picker.Item label="14" value={14} /><Picker.Item label="15" value={15} />
                    <Picker.Item label="16" value={16} /><Picker.Item label="17" value={17} />
                    <Picker.Item label="18" value={18} /><Picker.Item label="19" value={19} />
                    <Picker.Item label="20" value={20} /><Picker.Item label="21" value={21} />
                    <Picker.Item label="22" value={22} /><Picker.Item label="23" value={23} />
                    <Picker.Item label="24" value={24} /><Picker.Item label="25" value={25} />
                    <Picker.Item label="26" value={26} /><Picker.Item label="27" value={27} />
                    <Picker.Item label="28" value={28} /><Picker.Item label="29" value={29} />
                    <Picker.Item label="30" value={30} /><Picker.Item label="31" value={31} />
                    <Picker.Item label="32" value={32} /><Picker.Item label="33" value={33} />
                    <Picker.Item label="34" value={34} /><Picker.Item label="35" value={35} />
                    <Picker.Item label="36" value={36} /><Picker.Item label="37" value={37} />
                    <Picker.Item label="38" value={38} /><Picker.Item label="39" value={39} />
                    <Picker.Item label="40" value={40} /><Picker.Item label="41" value={41} />
                    <Picker.Item label="42" value={42} />
                    <Picker.Item label="43" value={43} /><Picker.Item label="44" value={44} />
                    <Picker.Item label="45" value={45} /><Picker.Item label="46" value={46} />
                    <Picker.Item label="47" value={47} /><Picker.Item label="48" value={48} />
                    <Picker.Item label="49" value={49} /><Picker.Item label="50" value={50} />
                    <Picker.Item label="51" value={51} /><Picker.Item label="52" value={52} />
                    <Picker.Item label="53" value={53} /><Picker.Item label="54" value={54} />
                    <Picker.Item label="55" value={55} /><Picker.Item label="56" value={56} />
                    <Picker.Item label="57" value={57} /><Picker.Item label="58" value={58} />
                    <Picker.Item label="59" value={59} />
                  </Picker>
                </View>
              </View>


              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:repeat')}</Text>
              </View>

              <View style={commonStyles.listRadio(i18n.t('common:dir'))} >
                <RadioForm
                  ref="refRadioRepeat"
                  radio_props={radio_props}
                  formHorizontal={true}
                  labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                  initial={0}
                  onPress={(value) => { this.changeRepeat(value, t) }}
                />
              </View>

              <View style={commonStyles.line}></View>

              <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))} >{i18n.t('common:every')}</Text>
                <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                  keyboardType='numeric'
                  onChangeText={(txt) => {
                    if (txt.trim().length == 0) {
                      this.setState({
                        startRepeatTime: txt,
                        successRepeatTime: false
                      })
                    }
                    else {
                      txt = txt.replace(/[- #*+=();,.<>\{\}\[\]\\\/]/gi, '');
                      this.setState({
                        startRepeatTime: txt,
                        successRepeatTime: true
                      })
                    }
                  }}
                  value={this.state.startRepeatTime}
                />
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))} >{this.state.repeatType}</Text>
              </View>

              {(this.state.visibleDays) ? (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start' }} >
                  {daysArray}
                </View>
              ) : (null)
              }

              <View style={commonStyles.line}></View>
              <View style={{ flex: 1, flexDirection: (i18n.t('common:dir') == 'right') ? 'row-reverse' : 'row' }}>
                <CheckBox
                  style={commonStyles.checkBoxStyle}
                  leftTextStyle={commonStyles.checkBoxSchedule(i18n.t("common:dir"))}
                  rightTextStyle={commonStyles.checkBoxSchedule(i18n.t("common:dir"))}
                  checkBoxColor={"#80628d"}
                  onClick={(checked) => { this.setState({ travel: !this.state.travel }) }}
                  leftText={(i18n.t("common:dir") == 'right') ? i18n.t("schedule:travel") : ""}
                  rightText={(i18n.t("common:dir") == 'left') ? i18n.t("schedule:travel") : ""}
                  isChecked={this.state.travel}
                />
              </View>

              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:finishType')}</Text>
              </View>

              <View style={commonStyles.listRadio(i18n.t('common:dir'))} >
                <RadioForm
                  ref="refRadioFinishType"
                  formHorizontal={true}
                  labelStyle={commonStyles.radioStyle(i18n.t('common:dir'))}
                  radio_props={radioFinishType}
                  initial={0}
                  onPress={(value) => { this.changeFinishType(value) }}
                />
              </View>

              {this.state.repeatNumberShow ? (
                <View style={commonStyles.listViewTouchView(i18n.t('common:dir'))} >
                  <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:after')}</Text>
                  <TextInput style={commonStyles.txtInput(i18n.t('common:dir'))}
                    keyboardType='numeric'
                    onChangeText={(txt) => {
                      if (txt.trim().length == 0) {
                        this.setState({
                          endRepeatTime: txt,
                          successRepeatTime: false
                        })
                      }
                      else {
                        txt = txt.replace(/[- #*+=();,.<>\{\}\[\]\\\/]/gi, '');
                        this.setState({
                          endRepeatTime: txt,
                          successRepeatTime: true
                        })
                      }
                    }}
                    value={this.state.endRepeatTime}
                  />
                  <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:repeat')}</Text>
                </View>
              ) : (null)
              }

              {this.state.endToDate ? (
                <View style={{ flex: 1, flexDirection: 'column', width: '100%' }} >

                  <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>
                    {this.state.endYear + "/" + this.state.endMonth + "/" + this.state.endDay}
                  </Text>

                  <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>
                    <View style={commonStyles.flex1center}>
                      <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:day')}</Text>
                    </View>
                    <View style={commonStyles.flex1center}>
                      <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:month')}</Text>
                    </View>
                    <View style={commonStyles.flex1center}>
                      <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{i18n.t('common:year')}</Text>
                    </View>
                  </View>
                  <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                      <Picker
                        selectedValue={this.state.endDay}
                        style={commonStyles.pickerSchedule}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ endDay: itemValue })
                        }>
                        <Picker.Item label="1" value={"1"} />
                        <Picker.Item label="2" value={"2"} />
                        <Picker.Item label="3" value={"3"} />
                        <Picker.Item label="4" value={"4"} />
                        <Picker.Item label="5" value={"5"} />
                        <Picker.Item label="6" value={"6"} />
                        <Picker.Item label="7" value={"7"} />
                        <Picker.Item label="8" value={"8"} />
                        <Picker.Item label="9" value={"9"} />
                        <Picker.Item label="10" value={"10"} />
                        <Picker.Item label="11" value={"11"} />
                        <Picker.Item label="12" value={"12"} />
                        <Picker.Item label="13" value={"13"} />
                        <Picker.Item label="14" value={"14"} />
                        <Picker.Item label="15" value={"15"} />
                        <Picker.Item label="16" value={"16"} />
                        <Picker.Item label="17" value={"17"} />
                        <Picker.Item label="18" value={"18"} />
                        <Picker.Item label="19" value={"19"} />
                        <Picker.Item label="20" value={"20"} />
                        <Picker.Item label="21" value={"21"} />
                        <Picker.Item label="22" value={"22"} />
                        <Picker.Item label="23" value={"23"} />
                        <Picker.Item label="24" value={"24"} />
                        <Picker.Item label="25" value={"25"} />
                        <Picker.Item label="26" value={"26"} />
                        <Picker.Item label="27" value={"27"} />
                        <Picker.Item label="28" value={"28"} />
                        <Picker.Item label="29" value={"29"} />
                        <Picker.Item label="30" value={"30"} />
                        <Picker.Item label="31" value={"31"} />
                      </Picker>
                    </View>
                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                      <Picker
                        selectedValue={this.state.endMonth}
                        style={commonStyles.pickerSchedule}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ endMonth: itemValue })
                        }>
                        <Picker.Item label="1" value={"1"} />
                        <Picker.Item label="2" value={"2"} />
                        <Picker.Item label="3" value={"3"} />
                        <Picker.Item label="4" value={"4"} />
                        <Picker.Item label="5" value={"5"} />
                        <Picker.Item label="6" value={"6"} />
                        <Picker.Item label="7" value={"7"} />
                        <Picker.Item label="8" value={"8"} />
                        <Picker.Item label="9" value={"9"} />
                        <Picker.Item label="10" value={"10"} />
                        <Picker.Item label="11" value={"11"} />
                        <Picker.Item label="12" value={"12"} />
                      </Picker>
                    </View>
                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
                      {endYearsPicker}
                    </View>
                  </View>
                </View>
              ) : (null)}

            </View>
            <View style={commonStyles.viewOkButton} >
              <MyButton title={i18n.t('common:actions.ok')} dir={t("common:dir")}
                onPress={() => this.saveSchedule()}>
              </MyButton>


            </View>

          </LinearGradient>
          {(this.state.alertMod) ? (
            <View>
              <MyAlert modalVisible={this.state.alertMod}
                onClick2={() => {
                  if (this.state.func == "get") {
                    this.getSchedule(this.state.scheduleId)
                    this.setState({
                      spinner: true,
                      alertMod: false,
                    })
                  }
                  else {
                    this.saveSchedule(3)
                  }
                }

                }
                onClick1={() => this.onClickCancel()}
                title1={i18n.t('common:cancel')}
                title2={i18n.t('common:actions.ok')}
                title={this.state.titleModal} />
            </View>
          ) : (null)}

          {(this.state.spinner) ? (
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Spinner
                visible={this.state.spinner}
                textContent={this.props.t('common:loading')}
                textStyle={commonStyles.spinnerText(i18n.t("common:dir"))}
              />
            </View>
          ) : (null)}
        </ScrollView>

      </KeyboardAvoidingView>

    );
  }


}

export default translate(['ScheduleSetting', 'common'], { wait: true })(ScheduleSetting);
