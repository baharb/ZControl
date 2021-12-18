import i18n from 'i18next';
import {AsyncStorage} from 'react-native';

const Funcs = {
     child : 2,
     onChangeLang: async function(lang) {
        i18n.changeLanguage(lang);
        try {
            await AsyncStorage.setItem('@APP:languageCode',lang);

        }catch (error) {
            alert(` Hi Errorrrr : ${error}`);
        }
    },

}

export default Funcs;
