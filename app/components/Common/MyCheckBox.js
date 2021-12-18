import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { TouchableOpacity, Text, StyleSheet } from 'react-native'

export class MyCheckBox extends React.Component {
    constructor(props) {
      super(props)
        this.state = ({
           selected: false,
           source: ""
        })

        
        this.onpress = this.onpress.bind(this);

    }

    componentDidMount(){
        this.setState({
            selected: (this.props.selected != null) ? this.props.selected : false,
            source:  (this.state.source == 'check-box') ? 'check-box-outline-blank' : 'check-box',
        })
    }

    onpress(){
        if (this.props.onPress) {
            
            // this.props.onpress(!this.props.selected);
            this.setState({
                source: (this.state.source == 'check-box') ? 'check-box-outline-blank' : 'check-box',
            })
//            console.log("aaaa"+this.state.selected)
        }
        // if (this.props.onChange) {
        //     // alert(this.props.checked + "--" + this.state.internalChecked)
        //       this.props.onChange(!this.props.checked);
        //       this.setState({
        //           internalChecked: !this.state.internalChecked,
        //           source: this.state.source == CB_DISABLED_IMAGE ? CB_ENABLED_IMAGE : CB_DISABLED_IMAGE,
        //       })
        //   }
    }

    UNSAFE_componentWillMount() {

        if(this.props.selected == true){
            this.setState({
                source: 'check-box'
            })
        }
        else{
            this.setState({
                selected: 'check-box-outline-blank'
            })
        }
     }

    // const MyCheckBox = ({ selected, onPress, style, textStyle, size = 30, color = '#211f30', text = '', ...props}) => (
    render() {
        return (

        <TouchableOpacity style={[styles.checkBox, this.state.style]} onPress={this.onpress} >
            <Icon
                size={this.props.size}
                color={this.props.color}
                name={this.state.source}
            />

        <Text style={this.props.textStyle}> {this.props.text} - {this.state.selected}</Text>
        </TouchableOpacity>
        )
    }
}

styles = StyleSheet.create({
  checkBox: {
      flexDirection: 'row',
      alignItems: 'center'
  }
} 
)