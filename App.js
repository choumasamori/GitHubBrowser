import React, {Component, useEffect, useState} from 'react';
import {View} from 'react-native'
import {NavigationContainer, StackActions} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Container, Content,Item, Button, Text, Form, Input, Label} from 'native-base'
const axios = require('axios');

function HomeScreen({navigation}){
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  

  return(
    <Container>
      <Content>
        <Form>
          <Item stackedLabel>
            <Label>Username</Label>
            <Input value={username} onChangeText={(text)=>{setUsername(text)}}/>
          </Item>
          <Item stackedLabel last>
            <Label>Password</Label>
            <Input value={token} onChangeText={(text)=>{setToken(text)}}/>
          </Item>
          <Button style={{alignSelf:'center', marginTop:20}}>
            <Text>Sign In</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

const Stack = createStackNavigator();

export default class App extends Component {
  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
