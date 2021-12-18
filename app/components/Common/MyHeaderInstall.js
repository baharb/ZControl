import React from 'react';
import {View, Text, Image} from 'react-native';
import commonStyles from './css/commonStyles';
import { translate} from 'react-i18next';
import i18n from 'i18next';

export class MyHeaderInstall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render(){
      const { t } = this.props;
      return(
        <View style={{height: 60, flex: 1, flexDirection: 'row', marginBottom: 0}} >
          <View style={{height: 60, flex: 1}} >
            <Image style={commonStyles.logoImg} source={require('./img/logoPurple.png')}  />
          </View>
          <View style={{height: 70, flex: 1}} >
            <Text style={commonStyles.title1(i18n.t("common:dir"))}>{t('common:appName')}</Text>
          </View>
        </View>
      );

  }
}
