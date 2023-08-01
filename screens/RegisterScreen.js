import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,StyleSheet,Alert,Pressable, TouchableOpacity,Image} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Header from '../components/Header'
import Button from '../components/Button'
import {conn} from '../screens/utils/Conn'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../themes/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import { phoneValidator } from '../helpers/phoneValidator'
import { confirmpasswordValidator } from '../helpers/confirmpasswordValidator'
import { termsValidator } from '../helpers/termsValidator'
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '' })
  const [email, setEmail] = useState({ value: ''})
  const [password, setPassword] = useState({ value: ''})
  const [phone, setPhone] = useState({ value: ''})
  const [confirmpwd, setConfirmpwd] = useState({ value: ''})
  const [isSelected,setSelection]= useState(false)
  const [members,setMembers]=useState([])
  const [image, setImage] = useState(null);

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    const conpasswordError = confirmpasswordValidator(password.value,confirmpwd.value)
    const phoneError = phoneValidator(phone.value)
    const termsError = termsValidator(isSelected)
    
    if(termsError) Alert.alert("Please accept terms & conditions")
    
    
    if (emailError || passwordError || nameError||conpasswordError||phoneError||termsError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setConfirmpwd({ ...confirmpwd, error: conpasswordError })
      setPhone({...phone,error:phoneError})
      setSelection({...isSelected})
      return
    }else{
      const formdata = new FormData()

      formdata.append('memberImage',{
        uri:image,
        name: 'memberImage',
        type: ' image/jpeg',
      })
      formdata.append('name',name.value)
      formdata.append('email',email.value)
      formdata.append('phone',phone.value)
      formdata.append('password',password.value)
   
    const url=''+conn+'/member';
    
   
    axios.post(url,formdata,{
      headers:{
        Accept:'application/json',
        'Content-Type':'multipart/form-data',
       
      }
    })
    .then(res=>{
     
       AsyncStorage.setItem("user",JSON.stringify(res.data) )
       alert("Registration Successful")
       
       navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    })
    .catch(error=>{
           
        alert("A user with same email exists. Pick another email")
       
      }) 
    return
    }

   
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

  
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
  
    <Background>
      
    <BackButton goBack={()=>navigation.goBack()} />
     
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
        <TextInput
        label="Phone"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text })}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        keyboardType="numeric"
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
       <TextInput
        label="Confirm Password"
        returnKeyType="done"
        value={confirmpwd.value}
        onChangeText={(text) => setConfirmpwd({ value: text, error: '' })}
        error={!!confirmpwd.error}
        errorText={confirmpwd.error}
        secureTextEntry
      />
      <View style={styles.row}>
      <Pressable style={styles.button}
      onPress={pickImage}>
      <Text style={styles.text}>Upload Image</Text>
       
       </Pressable>
      {image && <Image source={{ uri: image }} style={{ width: 50, height: 50,marginLeft:10 }} />}
      </View>
    
      <View  style={styles.checkbox}>
      <CheckBox
        value={isSelected}
        onValueChange={()=>setSelection(!isSelected)}
       
       />
        <TouchableOpacity onPress={() => ''}>
           <Text style={styles.link}>Agree to terms and conditions</Text>
        </TouchableOpacity>
       
      </View>
      <Button
        mode="contained"
        onPress={() => {
          onSignUpPressed()
      
        }}
        style={{ marginTop: 10 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text >Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    
    </Background>
    
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 1,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft:5
  },
  checkbox:{
    flexDirection: 'row',
    marginTop: 10,
    paddingRight:1
  },
  text:{
    color:'white'
  },
  button: {

    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor:theme.colors.primary
  },
 
})
