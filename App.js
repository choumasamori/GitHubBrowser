import React, {Component, useEffect, useState} from 'react';
import {View} from 'react-native'
import {NavigationContainer, StackActions} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Container, Content,Item, Button, Text, Form, Input, Label} from 'native-base'
const axios = require('axios');

function HomeScreen({navigation}){
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  
  const login = (username, token) => {
    axios.get('https://api.github.com/user',{
      headers:{'Authorization':'token '+token}
    }).then((data)=>{
      if(data.data.login!=username){
        alert("Wrong Username")
      }else{
        navigation.navigate('Repository',{
          token: token
        })
      }
      setUsername("");
      setToken("");
    }).catch((err)=>{
      setUsername("");
      setToken("");
      alert("Wrong Password");
      console.log(err);
    })
  }

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
            <Input secureTextEntry value={token} onChangeText={(text)=>{setToken(text)}}/>
          </Item>
          <Button style={{alignSelf:'center', marginTop:20}} onPress={()=>{login(username, token)}}>
            <Text>Sign In</Text>
          </Button>
        </Form>
      </Content>
    </Container>
  );
}

function Repository({route, navigation}){
  const {token} = route.params;
  const [repo, setRepo] = useState("facebook/react-native");
  return(
      <Container>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Repositories</Label>
              <Input value={repo} onChangeText={(text)=>{setRepo(text)}}/>
            </Item>
            <Button style={{alignSelf:'center',marginTop:20}}>
              <Text>Browse</Text>
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
          <Stack.Screen name="Repository" component={Repository} options={({navigation})=>({
            headerLeft: () => (null)
            })} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
