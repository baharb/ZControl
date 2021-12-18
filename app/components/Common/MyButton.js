import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from 'react-native'

export class MyButton extends React.Component {
  constructor(props) {
    super(props)

  }

 render() {
   return (
      <View style={styles.container}>
          <TouchableOpacity  style={styles.button} onPress={this.props.onPress}>
            <Text style={styles.text(this.props.dir)}> {this.props.title} </Text>
          </TouchableOpacity>
      </View>
     )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#522265",
    paddingTop: 30
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff2a62',
    padding: 5,
    borderRadius: 10,
    fontSize: 20,
    width: '95%',
    height: 45,
  },
  text: (dir) => ({
    fontSize: 20,              
    fontFamily: (dir === 'right') ? 'Vazir' : 'Nunito-Bold',
    color: '#fff' ,
    paddingTop: dir === 'ltr' ? 5 : 0,
  })

})






