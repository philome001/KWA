import React, { useState,useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, StyleSheet,View, Alert, } from 'react-native'
import { Text } from 'react-native-paper'
import axios from 'axios';

import {conn} from '../screens/utils/Conn'
import * as Notifications from 'expo-notifications'

import Constants from 'expo-constants'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { theme } from '../themes/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
var bcrypt = require('bcryptjs');
export default function Login({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [members,setMembers]=useState([]);
  const [devicetoken,setDevicetoken]=useState('')
 
  const onLoginPressed = () => {
    
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }else{
      let mail=email.value;
      let pwd = password.value;
      let userpwd='';
      let username='';
            
      const url=''+conn+'/getmember/'+mail
     
      axios.get(url)
    
      .catch(err=>alert('Fail'+err))
      .then(response=>{
            
            userpwd=response.data.password;
            username=response.data.email;

           if(!bcrypt.compareSync(pwd,userpwd))
            {
            alert('Incorrect Password');
            return

            }
            else{
            alert('Login Successful');
            
            try{
              AsyncStorage.setItem("user",JSON.stringify(response.data) )

            } catch(err){
              console.log('Kuna error'+err);
            }
            navigation.reset({
              index: 0,
              routes: [{ name: 'AuthLoading' }],
            })
        }
         
      }).catch(err=>{
          alert('Wrong '+err)
                  
   }) 

    }
    let data={
      email:email.value,
      token:devicetoken
    }
   
    const murl=''+conn+'/updatemembertoken';

         
     axios.put(murl,data)
    .then((res=>console.log(res.data)))
    .catch(err=>console.log('Kuna error '+err))
   
  }
  const  registerForPushNotificationsAsync=async()=> {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
     
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
 
   return token;
  }
 
  useEffect(() => {
   
    return function cleanup() {
       
    }
})
  return (
    
    <Background>
       <Logo/>
      <Header>Please Login</Header>
        
      <TextInput
        label="Email"
        returnKeyType="next"
        
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
     
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      
  
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
     
    </Background>

  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
