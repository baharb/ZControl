import React from 'react';
import { translate } from 'react-i18next';
import i18n from 'i18next';
import { KeyboardAvoidingView, ScrollView, View, Text, TextInput } from 'react-native';
import commonStyles from '../Common/css/commonStyles';
import { MyButton } from '../Common/MyButton';
import Schedule from './lib/Schedule';
import Vars from '../Common/vars/commonVars';
import moment from "moment-jalaali";

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

//console.log("item"+item)
//
//console.log("item"+item.id)
    if (item != null) {
//      this.setState({
//        scheduleId: item.id,
//        scheduleName: item.title,
//        mode: Vars.modeUpdate,
//        checkedDays: checkedDays,
//        fromPage: fromPage,
//      });

      this.getSchedule(item.id).then(data => {
        console.log("Get Doneee")
      })

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
            console.log("errrrrrrrror in saveeeeeeee: " + error)
            getError = 1
          }
        );

      timeout = setTimeout(() => {
        console.log("Error in save Schedule Timeout: " + getError + "---" + getResponse + "---" + retry)
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
            console.log("error : " + retry + "---" + getResponse + "---" + getError)
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
      console.log("Get Schedule: " + retry)
      getResponse = 0
      getError = 0

      schedule = new Schedule();
      schedule.getSchedule(scheduleId).then(
        data => {
          console.log("id: " + scheduleId + "---" + (data[0] & 0x7F))
          if ((data[0] & 0x7F) != scheduleId) {
            getError = 1
            console.log("Error in get Schedule id error: " + (data[0] & 0x7F))

          }
          else {

            if (timeout != "") { clearTimeout(timeout) }
            console.log("Clear time out: " + timeout)
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
            console.log("1")
            endyear = 0;
            endDateArray = new Array(1398, 1, 1);

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

            console.log("2")
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

//            this.refs.refRadioRepeat.updateIsActiveIndex(data[16]);
            visibleDays = false
            if (data[16] == 1) {
              visibleDays = true
            }

//            this.changeFinishType(endType, endRepeatTime.toString());
//            this.refs.refRadioFinishType.updateIsActiveIndex(endType);

//            this.initWeekDaysCheckboxes(data[18]);
            console.log("3")
//            this.setState({
//              repeatUnit: data[16],
//              startRepeatTime: data[17].toString(),
//              startYear: startDateArray[0],
//              startMonth: startDateArray[1],
//              startDay: startDateArray[2],
//              startH: data[5],
//              startM: data[6],
//              startS: data[7],
//              endYear: endDateArray[0],
//              endMonth: endDateArray[1],
//              endDay: endDateArray[2],
//              endH: data[12],
//              endM: data[13],
//              endS: data[14],
//              visibleDays: visibleDays,
//              travel: travel,
//              spinner: false,
//            }, () => {
//              console.log("4")
//              resolve(true)
//            })
          }
        }
      )
        .catch(
          error => {
            getError = 1

            console.log("Error in get Schedule: " + error)


          }
        );


      timeout = setTimeout(() => {
        console.log("Error in get Schedule Timeout: " + getError + "---" + getResponse + "---" + retry)
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


    console.log("checked: " + checkedArray[index] + "----" + checked + "---" + index)

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

        </View>
      );
    });

    //        daysArray.push(</View>);
    yearsPicker = ""
    endYearsPicker = ""

    return (

      <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding" style={commonStyles.flex1} enabled >

        <ScrollView>



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

                </View>

                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                </View>

                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                </View>

              </View>

              <View style={commonStyles.line}></View>

              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>

              </View>
              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>

              </View>
              <View style={commonStyles.line}></View>

              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>

              </View>
              <View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                </View>
                <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                </View>
              </View>


              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:repeat')}</Text>
              </View>

              <View style={commonStyles.listRadio(i18n.t('common:dir'))} >

              </View>

              <View style={commonStyles.line}></View>




              <View style={commonStyles.line}></View>
              <View style={{ flex: 1, flexDirection: (i18n.t('common:dir') == 'right') ? 'row-reverse' : 'row' }}>

              </View>

              <View style={commonStyles.titleSelectModules(i18n.t('common:dir'))} >
                <Text style={commonStyles.txtItemLabel(i18n.t('common:dir'))}>{i18n.t('schedule:finishType')}</Text>
              </View>

              <View style={commonStyles.listRadio(i18n.t('common:dir'))} >

              </View>



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

                    </View>
                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                    </View>
                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >

                    </View>
                  </View>
                </View>

            </View>
            <View style={commonStyles.viewOkButton} >
              <MyButton title={i18n.t('common:actions.ok')} dir={t("common:dir")}
                onPress={() => this.saveSchedule()}>
              </MyButton>


            </View>


        </ScrollView>

      </KeyboardAvoidingView>

    );
  }


}

export default translate(['ScheduleSetting', 'common'], { wait: true })(ScheduleSetting);
