import React from 'react';
import {Header, Body, Left, Right, Icon, Title} from 'native-base';

export class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render(){

      return(
        <Header style={{paddingTop: 15, paddingBottom: 11}}>
        <Title style={{ fontSize: 18, color: '#E1F5FE', paddingTop: 0 }} >
           {this.props.title}
        </Title>
       </Header>
      );

  }
}
