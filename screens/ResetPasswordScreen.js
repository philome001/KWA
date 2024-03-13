import React, { useState } from 'react'
import axios from 'axios';
import Parse from 'parse/react-native';
import Background from '../components/Background'
import BackButton from '../components/BackButton'
import {conn} from '../screens/utils/Conn'
import Logo from '../components/Logo'
import Header from '../components/Header'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator'
import { Alert } from 'react-native';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
  
   
    const url=''+conn+'/forgotpassword';
    axios.post(url,{email:email.value})
    .then(res=>{
      
      Alert.alert("Success!!"+res.data.message);
      navigation.navigate('Login')
    }).catch(err=>{
      Alert.alert("No such email exists "+err.message)
      return
    })

  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
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
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
       Submit
      </Button>
    </Background>
  )
}
