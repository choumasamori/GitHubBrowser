import React, {Component, useEffect, useState} from 'react';
import {View, BackHandler, SafeAreaView, FlatList} from 'react-native'
import {NavigationContainer, StackActions} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {Container, Content,Item, Button, Text, Form, Input, Label, Card, CardItem, Body, Left, Thumbnail, Right} from 'native-base'
const axios = require('axios');
const moment = require('moment');

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
  useEffect(()=>{
    BackHandler.addEventListener('hardwareBackPress',()=>true)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', ()=>true)
    }
  },[])

  const browse = (repo) => {
    axios.get('https://api.github.com/repos/'+repo+'/commits',{
      headers:{'Authorization':'token '+token}
    }).then((data)=>{
      //console.log(data);
      navigation.navigate('Detail',{
        token:token,
        data:data.data
      })
    }).catch((err)=>{
      console.log(err);
    })
  }

  return(
      <Container>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Repositories</Label>
              <Input value={repo} onChangeText={(text)=>{setRepo(text)}}/>
            </Item>
            <Button style={{alignSelf:'center',marginTop:20}} onPress={()=>{browse(repo)}}>
              <Text>Browse</Text>
            </Button>
          </Form>
        </Content>
      </Container>
  );
}
function Detail({route, navigation}){
  const {token, data} = route.params;
  return(
    <Container>
      <SafeAreaView style={{flex: 1}}>
        <FlatList 
        data={data}
        ListEmptyComponent={()=>{return <View><Text>Empty</Text></View>}}
        renderItem={({item})=>{
          const time = moment(item.commit.author.date).fromNow();
          return <Card>
                    <CardItem>
                      <Left>
                        <Thumbnail source={{uri: item.author.avatar_url}}/>
                        <Body>
                          <Text>{item.commit.author.name}</Text>
                          <Text note>{item.commit.author.email}</Text>
                        </Body>
                      </Left>
                      <Right>
                        <Body>
                          <Text>{time}</Text>
                        </Body>
                      </Right>
                    </CardItem>
                    <CardItem cardBody>
                      <Body style={{padding:10}}>
                        <Text>{item.commit.message}</Text>
                      </Body>
                    </CardItem>
                 </Card>
        }}
        keyExtractor={(item, index)=>index.toString()}
        />
      </SafeAreaView>
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
          <Stack.Screen name="Detail" component={Detail}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
