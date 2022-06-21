import React from 'react';
import { translate} from 'react-i18next';
import i18n from 'i18next';
import { View, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import commonStyles from '../Common/css/commonStyles';
import {MyButton} from '../Common/MyButton';
import Setting from './lib/Setting';
import moment from "moment-jalaali";
import {Picker} from '@react-native-community/picker';

export class DateSetting extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        startYear: 1400,
        startMonth: 1,
        startDay: 1,
        startH: 12,
        startM: 1,
        startS: 1,
      }
    }

    componentDidMount(){
          this.getDateTime();
    }

    saveDateTime(){
         m = ""

         if(i18n.t("common:language") == "persian"){
                    m = moment(this.state.startYear + "/" + this.state.startMonth + "/" + this.state.startDay , 'jYYYY/jM/jD');
         }
         else{
                    m = moment(this.state.startYear + "/" + this.state.startMonth + "/" + this.state.startDay , 'YYYY/M/D');
         }

        start = m.format('YYYY/M/D');
        startDateArray = start.split("/");

        console.log("Save date timemeee...."+ startDateArray[0] +"---" + startDateArray[1] + "---" + startDateArray[2])

        setting = new Setting();
        setting.saveDateTime(startDateArray[0], startDateArray[1], startDateArray[2],
              this.state.startH, this.state.startM, this.state.startS)
          .then(
              data => {
                  if(data == true){
                      this.props.navigation.navigate('SettingPage');
                  }
                  else{
                      alert(this.props.t("setting:errorSaveDateTime"))
                  }
              }
          )
          .catch(
              error => {
                  alert(this.props.t("setting:errorSaveDateTime"))
              }
          );
    }

    getDateTime(retry){

        if(!retry && retry != 0){
            retry = 5    
        }
    
        getResponse = 0
        getError = 0

        setting = new Setting();
        setting.getDateTime().then(
            data => {    
                  getResponse = 1
                  getError = 0

                  year = data[0] & 0xff;
                  year = (year << 8) | (data[1] & 0xff);

                  startDate = moment(year + "/" + data[2] + "/" + data[3] , 'YYYY/M/D');
//                  console.log("dateeeeeeeeeeee: " +startDate + "---" + year +"-" + data[2]+"--"+data[3])

                  if(i18n.t("common:language") == "persian"){
                              start = startDate.format('jYYYY/jM/jD');
//                              console.log("Persian: ----" + start)
                  }
                  else{
                              start = startDate.format('YYYY/M/D');
//                              console.log("English: ----" + start)
                  }

                  startDateArray = start.split("/");

                  this.setState({
	                    startYear: startDateArray[0],
	                    startMonth: startDateArray[1],
	                    startDay: startDateArray[2],
	                    startH: data[4],
	                    startM: data[5],
	                    startS: data[6],
                  })

              }
          )
          .catch(
              error => {
                  console.log(this.props.t("setting:errorGetDateTime"))
                  getResponse = 1
                  getError = 0
                  // alert(this.props.t("setting:errorGetDateTime"))
              }
          );

          setTimeout(() => {
            if(getResponse == 0 && getError == 0){
                if(retry > 0){
                  this.getDateTime()
                }
                else {
                    // console.log("eeeeeeeefffff"+retry)
                  alert(this.props.t("setting:errorGetDateTime"))

                }
              }
          }, 1000);

    }


    render() {
        // Each row of flat list
          const { t } = this.props;
	yearsPicker = ""
              if(i18n.t("common:language") == "persian") {
          	yearsPicker = (
          	<Picker
              selectedValue={this.state.startYear}
              style={commonStyles.pickerSchedule}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({startYear: itemValue})
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
              else{
          		yearsPicker = (
          		<Picker
                        selectedValue={this.state.startYear}
                        style={commonStyles.pickerSchedule}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({startYear: itemValue})
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

          monthsPicker = ""
          monthsPicker = (
                    <Picker
                selectedValue={this.state.startMonth}
                style={commonStyles.pickerSchedule}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({startMonth: itemValue})
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
            )

	daysPicker = ""
          daysPicker = (
                    <Picker
                            selectedValue={this.state.startDay}
                            style={commonStyles.pickerSchedule}
                            onValueChange={(itemValue, itemIndex) =>
                              this.setState({startDay: itemValue})
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
            )

          hoursPicker = new Array()
         for(i3=0; i3<=23; i3++){
                      hoursPicker.push(
                          <Picker.Item label={i3+""} value={i3} key={i3}/>
                      );
          }

          minutesPicker = new Array()
         for(i4=1; i4<=59; i4++){
                      minutesPicker.push(
                          <Picker.Item label={i4+""} value={i4} key={i4}/>
                      );
          }

         secondsPicker = new Array()
         for(i5=1; i5<=59; i5++){
                      secondsPicker.push(
                          <Picker.Item label={i5+""} value={i5} key={i5}/>
                      );
          }



         return (
                <LinearGradient colors={['#1d0527', '#350e45', '#4f1965']} style={commonStyles.containDateSetting} >

		<View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
		<Text style={commonStyles.txtItemLabelSchedule(i18n.t('common:dir'))}>
		{this.state.startYear+"/"+this.state.startMonth+"/"+this.state.startDay+"          "+
		this.state.startH + ":" + this.state.startM + ":" + this.state.startS}
		</Text>
		</View>
		<View style={commonStyles.line}></View>

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
	                    {daysPicker}
	                    </View>
	                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
	                  {monthsPicker}
	                </View>
	                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
	                              {yearsPicker}
	                    </View>
              </View>
	     <View style={commonStyles.line}></View>
              <View style={commonStyles.listViewDropTitle(i18n.t('common:dir'))}>
                    <View style={commonStyles.flex1center}>
                        <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:hour')}</Text>
                    </View>

                     <View style={commonStyles.flex1center}>
                              <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:minute')}</Text>
                    </View>

                     <View style={commonStyles.flex1center}>
                          <Text style={commonStyles.txtItemLabelCenter(i18n.t('common:dir'))}>{t('common:second')}</Text>
                      </View>
              </View>
		<View style={commonStyles.listViewDrop(i18n.t('common:dir'))}>
	                              <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
			                        <Picker
			                  selectedValue={this.state.startH}
			                  style={commonStyles.pickerSchedule}
			                  onValueChange={(itemValue, itemIndex) =>
			                    this.setState({startH: itemValue})
			                  }>
			                  {hoursPicker}
			                  </Picker>
	                              </View>
		                    <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
			                      <Picker
			                      selectedValue={this.state.startM}
			                      style={commonStyles.pickerSchedule}
			                      onValueChange={(itemValue, itemIndex) =>
			                        this.setState({startM: itemValue})
			                      }>
					{minutesPicker}
			                      </Picker>
		                    </View>
                                          <View style={commonStyles.pickerFieldSchedule(i18n.t('common:dir'))} >
			                        <Picker
			                        selectedValue={this.state.startS}
			                        style={commonStyles.pickerSchedule}
			                        onValueChange={(itemValue, itemIndex) =>
			                          this.setState({startS: itemValue})
			                        }>
			                       {secondsPicker}
			                        </Picker>
		                      </View>
                    </View>

                    <View style={commonStyles.viewOkButton} >
                      <MyButton title={t('common:actions.ok') }   dir={t("common:dir")}
                      onPress={() => this.saveDateTime() }>
                      </MyButton>
                    </View>

              </LinearGradient>

        );
    }


}

export default translate(['DateSetting', 'common'], { wait: true })(DateSetting);
